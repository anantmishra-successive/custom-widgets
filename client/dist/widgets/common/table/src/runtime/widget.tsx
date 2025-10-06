/** @jsx jsx */
import {
  React, ReactRedux, hooks, jsx, type AllWidgetProps, type IMState, classNames, ReactResizeDetector,
  CONSTANTS, lodash, appActions, getAppStore, MutableStoreManager, DataSourceManager, MessageManager,
  DataRecordsSelectionChangeMessage, type QueriableDataSource, type ClauseValuePair, type QueryParams,
  appConfigUtils, type DataRecord, type FeatureLayerDataSource, type TimeExtent, dataSourceUtils,
  Immutable, QueryScope, WidgetState, loadArcGISJSAPIModule
} from 'jimu-core'
import { TableArrangeType, TableModeType, type IMConfig, type LayersConfig, LayerHonorModeType, TableDataActionType } from '../config'
import { versionManager } from '../version-manager'
import { Global, useTheme } from 'jimu-theme'
import TableTabSelect from './components/table-tab-select'
import TableHeader from './components/table-header'
import EmptyTablePlaceholder from './components/empty-table-placeholder'
import TableTotalSelection from './components/table-total-selection'
import AutoRefreshLoading from './components/auto-refresh-loading'
import useTable from './components/use-table'
import TableToolList from './components/table-tool-list'
import TableMapView from './components/table-map-view'
import { getGlobalTableTools, getPrivilege, minusStringArray, areArraysEqual } from './utils'
import { LayoutItemSizeModes } from 'jimu-layouts/layout-runtime'
import { getQueryOptions, minusArray } from '../utils'
import { getStyle } from './style'
import * as reactiveUtils from 'esri/core/reactiveUtils'
import TableDataSource, { type LayerInfo } from './components/table-data-source'
import Polygon from 'esri/geometry/Polygon'
import { WidgetPlaceholder } from 'jimu-ui'
import type { JimuMapView } from 'jimu-arcgis'
import { getTableColumnsFields } from './components/utils'
import tablePlaceholderIcon from '../../icon.svg'
import defaultMessages from './translations/default'

const { BREAK_POINTS } = CONSTANTS
const EMPTY_QUERY_PARAMS = { where: '1=1', sqlExpression: null } as QueryParams
const SEARCH_TOOL_MIN_SIZE = 320
const TABLE_BOTTOM_BREAK_POINTS = 430

const TableWidget = (props: AllWidgetProps<IMConfig>) => {
  const { id, config, useMapWidgetIds, layoutId, layoutItemId, stateProps, mutableStateProps, state: widgetState } = props
  const {
    tableMode, arrangeType, layersConfig,  mapViewsConfig, enableMapExtentFilter,
    defaultExtentFilterEnabled, enableRelatedRecords, enableAttachments
  } = config
  const theme = useTheme()
  const isMapMode = tableMode === TableModeType.Map
  // use exb privilege instead of api's supportsUpdateByOthers
  const [canEditFeature, setCanEditFeature] = React.useState(false)
  const [configuredLayersConfig, setConfiguredLayersConfig] = React.useState<LayersConfig[]>([])
  const [allLayersConfig, setAllLayersConfig] = React.useState<LayersConfig[]>([])
  const [activeTabId, setActiveTabId] = React.useState<string>()
  const [selectQueryFlag, setSelectQueryFlag] = React.useState<boolean>(false)
  const [mobileFlag, setMobileFlag] = React.useState<boolean>(false)
  const [searchToolTowed, setSearchToolTowed] = React.useState<boolean>(false)
  const [bottomResponsiveFlag, setBottomResponsiveFlag] = React.useState<boolean>(false)
  const [widgetWidth, setWidgetWidth] = React.useState<number>(600)
  const [tableShowColumns, setTableShowColumns] = React.useState<ClauseValuePair[]>()
  const [tableSelected, setTableSelected] = React.useState<number>(0)
  const [mapFilterEnabled, setMapFilterEnabled] = React.useState<boolean>(false)
  const [emptyTable, setEmptyTable] = React.useState<boolean>(false)
  const [notReady, setNotReady] = React.useState<boolean>(false)
  const [showLoading, setShowLoading] = React.useState<boolean>(false)
  const [interval, setInterval] = React.useState<number>(0)
  const [selectedRecords, setSelectedRecords] = React.useState<DataRecord[]>([])
  const [selectionViewIds, setSelectionViewIds] = React.useState<string>('')
  const [maxCount, setMaxCount] = React.useState<number>()
  const [sourceVersion, setSourceVersion] = React.useState<string | number>()
  const [refreshTime, setRefreshTime] = React.useState<number>(0)
  const [activeView, setActiveView] = React.useState<JimuMapView>(null)

  const tableContainer = React.useRef<HTMLDivElement>(null)
  const dataActionTableRecords = React.useRef<{ [configId: string]: DataRecord[] }>({})
  const needToCallUpdateGeometryAndSql = React.useRef<boolean>(false)
  const needToUpdateHighlight = React.useRef<boolean>(false)
  const tableWidgetCon = React.useRef<HTMLDivElement>()
  const bufferOperatorRef = React.useRef<__esri.bufferOperator>(null)
  const geodesicBufferOperatorRef = React.useRef<__esri.geodesicBufferOperator>(null)
  // indicating editing comes from self
  const isSelfEditing = React.useRef(false)
  const translate = hooks.useTranslation(defaultMessages)

  const appMode = ReactRedux.useSelector((state: IMState) => state?.appRuntimeInfo?.appMode)
  const enableDataAction = ReactRedux.useSelector((state: IMState) => {
    const appConfig = state.appConfig
    const currentWidget = appConfig?.widgets?.[id]
    const enableDataAction = currentWidget?.enableDataAction
    return enableDataAction === undefined ? true : enableDataAction
  })
  const isHeightAuto = ReactRedux.useSelector((state: IMState) => {
    const appConfig = state.appConfig
    const layout = appConfig?.layouts?.[layoutId]
    const layoutSetting = layout?.content?.[layoutItemId]?.setting
    return layoutSetting?.autoProps?.height === LayoutItemSizeModes.Auto || layoutSetting?.autoProps?.height === true
  })
  const isWidthAuto = ReactRedux.useSelector((state: IMState) => {
    const appConfig = state.appConfig
    const layout = appConfig?.layouts?.[layoutId]
    const layoutSetting = layout?.content?.[layoutItemId]?.setting
    return layoutSetting?.autoProps?.width === LayoutItemSizeModes.Auto || layoutSetting?.autoProps?.width === true
  })

  const classes = classNames(
    'jimu-widget',
    'widget-table',
    'table-widget-' + id
  )
  const isHorizontalTab = arrangeType === TableArrangeType.Tabs
  const curLayerConfig = allLayersConfig.find(item => item.id === activeTabId)
  const allowDel = canEditFeature && curLayerConfig?.enableDelete
  const appConfig = getAppStore().getState()?.appConfig
  const curUseDs = curLayerConfig?.useDataSource
  const outputDsWidgetId = appConfigUtils.getWidgetIdByOutputDataSource(curUseDs)
  const widgetLabel = appConfig?.widgets?.[outputDsWidgetId]?.label
  const searchOn = curLayerConfig?.enableSearch && curLayerConfig?.searchFields?.length !== 0
  const dsManager = DataSourceManager.getInstance()
  const dataSource = ReactRedux.useSelector((state: IMState) => {
    const dataSource = curUseDs
    ? dsManager.getDataSource(curLayerConfig?.useDataSource?.dataSourceId) as QueriableDataSource
    : curLayerConfig?.dataActionDataSource as QueriableDataSource

    return dataSource
  })
  // mutableStateProps?.viewInTableObj is an object, it will not change, although its internal entries change
  const viewInTableKeyStrings = mutableStateProps?.viewInTableObj && Object.keys(mutableStateProps.viewInTableObj).join('|')
  const runtimeTableKeyStrings = mutableStateProps?.runtimeTableObj && Object.keys(mutableStateProps.runtimeTableObj).join('|')

  const tableSelectAsyncDs = React.useCallback((selectedIds: Array<string | number>) => {
    if (!dataSource) return
    const syncSqlResult = (records) => {
      MessageManager.getInstance().publishMessage(
        new DataRecordsSelectionChangeMessage(id, records, [dataSource.id])
      )
      if (records.length > 0) {
        dataSource.selectRecordsByIds(records.map(record => record.getId()), records)
      } else {
        dataSource.clearSelection()
      }
    }
    if (selectedIds?.length > 0) {
      dataSource.query({
        objectIds: selectedIds,
        returnGeometry: true,
        outFields: ['*'],
        notAddFieldsToClient: true
      } as QueryParams, { scope: QueryScope.InAllData }).then(result => {
        const records = result?.records
        if (records) syncSqlResult(records)
      })
    } else {
      syncSqlResult([])
    }
  }, [dataSource, id])

  const tableOptions = {
    dataInvalid: emptyTable,
    layerConfig: curLayerConfig,
    activeView,
    enableRelatedRecords,
    enableAttachments,
    tableContainer,
    canEditFeature,
    selectQueryFlag,
    tableShowColumns,
    dataActionRecords: dataActionTableRecords.current?.[curLayerConfig?.id],
    selectionViewIds,
    maxCount,
    sourceVersion,
    isMapMode,
    tableSelectAsyncDs,
    isSelfEditing,
    activeTabId
  }
  const [table, tableLoaded, usedDsId] = useTable(tableOptions)

  const partProps = {
    id, enableDataAction, isHeightAuto, isWidthAuto, headerFontSetting: curLayerConfig?.headerFontSetting,
    emptyTable, isHorizontalTab, widgetWidth
  }
  const usedState = {
    activeTabId, selectQueryFlag, tableShowColumns, mobileFlag, emptyTable,
    tableLoaded, tableSelected, allowDel, mapFilterEnabled, allLayersConfig,
    columns: table?.columns, enableRelatedRecords, enableAttachments, setTableShowColumns
  }
  const previousSearchOn = hooks.usePrevious(searchOn)
  const previousViewInTableKeyStrings = hooks.usePrevious(viewInTableKeyStrings)

  const getDataActionTable = React.useCallback(() => {
    const viewInTableObj = mutableStateProps?.viewInTableObj
    const dataActionTableArray = []
    if (!viewInTableKeyStrings) return dataActionTableArray
    const viewInTableKeys = viewInTableKeyStrings.split('|')
    viewInTableKeys?.forEach(key => {
      const tableObj = viewInTableObj[key]
      if (!tableObj) return
      dataActionTableRecords.current[key] = tableObj.records
      dataActionTableArray.push({ ...tableObj.daLayerItem })
    })
    return dataActionTableArray
  }, [mutableStateProps?.viewInTableObj, viewInTableKeyStrings])

  const getRuntimeTable = React.useCallback(() => {
    const runtimeTableObj = mutableStateProps?.runtimeTableObj
    const runtimeTableArray = []
    if (!runtimeTableKeyStrings) return runtimeTableArray
    const runtimeTableKeys = runtimeTableKeyStrings.split('|')
    runtimeTableKeys?.forEach(key => {
      const tableConfig = runtimeTableObj[key]
      if (!tableConfig) return
      runtimeTableArray.push({ ...tableConfig })
    })
    return runtimeTableArray
  }, [mutableStateProps?.runtimeTableObj, runtimeTableKeyStrings])

  const onMapLayersConfigChange = React.useCallback((layersConfig: LayersConfig[]) => {
    setConfiguredLayersConfig(layersConfig)
  }, [])

  const onViewChange = React.useCallback((view: JimuMapView) => {
    setActiveView(view)
  }, [])

  const handleSubmit = React.useCallback((searchText: string) => {
    if (!curLayerConfig || !dataSource) return
    const tableQuery = getQueryOptions(curLayerConfig, searchText, dataSource)
    dataSource.updateQueryParams(tableQuery as QueryParams, id)
  }, [curLayerConfig, dataSource, id])

  const onTabClick = React.useCallback((tabId: string) => {
    setActiveTabId(tabId)
    setSelectQueryFlag(false)
    setTableShowColumns(undefined)
    getAppStore().dispatch(
      appActions.widgetStatePropChange(id, 'activeTabId', tabId)
    )
  }, [id])

  const resetTableExpression = React.useCallback(() => {
    if (table?.layer) {
      const curQuery: any = dataSource && dataSource.getCurrentQueryParams()
      const sqlExpression = curQuery.where
      const tableInstance = table as any
      tableInstance.layer.definitionExpression = sqlExpression
    }
  }, [dataSource, table])

  const syncSelectedForTableHighlight = React.useCallback(() => {
    if (!dataSource) return
    let selectedRecordIds = dataSource.getSelectedRecordIds()
    const belongToSelectedRecordIds = dataSource?.belongToDataSource?.getSelectedRecordIds() || []
    if (dataSource.isDataView && selectedRecordIds.length !== belongToSelectedRecordIds.length) {
      selectedRecordIds = belongToSelectedRecordIds || selectedRecordIds
    }
    table.highlightIds?.removeAll && table.highlightIds.removeAll()
    const recordIds = selectedRecordIds.map(recordId => parseInt(recordId))
    table.highlightIds.addMany(recordIds)
  }, [dataSource, table])

  const updateTableGeometry = React.useCallback(async (geometry, distance, units) => {
    const sr = geometry?.spatialReference
    const geometryType = (geometry as __esri.Geometry)?.type
    const { isWGS84, isWebMercator } = sr as __esri.SpatialReference
    let usedBufferMethod
    if (isWGS84 || isWebMercator) {
      if (!geodesicBufferOperatorRef.current) {
        geodesicBufferOperatorRef.current = await loadArcGISJSAPIModule('esri/geometry/operators/geodesicBufferOperator')
      }
      if (!geodesicBufferOperatorRef.current.isLoaded()) {
        await geodesicBufferOperatorRef.current.load()
      }
      usedBufferMethod = geodesicBufferOperatorRef.current
    } else {
      if (!bufferOperatorRef.current) {
        bufferOperatorRef.current = await loadArcGISJSAPIModule('esri/geometry/operators/bufferOperator')
      }
      usedBufferMethod = bufferOperatorRef.current
    }
    const orgGeometryJson = (table?.filterGeometry as any)?.toJSON()
    if (geometryType !== 'polygon' && distance && distance <= 0) {
      const emptyBuff = new Polygon({ rings: [] })
      if (!lodash.isDeepEqual(orgGeometryJson, emptyBuff?.toJSON())) {
        (table.filterGeometry as any) = emptyBuff
      }
    } else if (distance && units) {
      const geometryBuff = usedBufferMethod.execute(geometry, distance, { unit: units })
      if (!lodash.isDeepEqual(orgGeometryJson, geometryBuff?.toJSON())) {
        (table.filterGeometry as any) = geometryBuff
      }
    } else { // only extent change
      (table.filterGeometry as any) = geometry
    }
  }, [table])

  // This method will update this.table.layer.definitionExpression by data source.
  const updateGeometryAndSql = React.useCallback((onlyUpdateExpression?: boolean) => {
    if (!table?.layer || !dataSource) return
    const isNotCurrentTable = usedDsId !== dataSource.id
    if (isNotCurrentTable) return
    needToCallUpdateGeometryAndSql.current = false
    const dsParam: any = dataSource?.getCurrentQueryParams()
    const orgExpression = table.layer.definitionExpression
    const isDefaultExpression = orgExpression === '' && dsParam?.where === '1=1'
    if (!isDefaultExpression && orgExpression !== dsParam?.where) {
      // If the value of tableLoaded is false, we will call this.updateGeometryAndSql() method again when it becomes true,
      // so here we only handle the case where tableLoaded is true.
      if (tableLoaded) {
        if (table.isQueryingOrSyncing) {
          // table is busy, we need to wait it idle to update layer.definitionExpression
          // because FeatureTable will show blank if update featureTable.layer.definitionExpression quickly.
          let handle = reactiveUtils.watch(() => table.isQueryingOrSyncing, () => {
            if (!table.isQueryingOrSyncing) {
              // table is idle now
              if (handle) {
                handle.remove()
                handle = null
              }
              const newDsParam: any = dataSource?.getCurrentQueryParams()
              // We need to check the latest newDsParam?.where and this.table.layer.definitionExpression to avoid multiple updateGeometryAndSql() call case.
              if (table.layer && dsParam?.where === newDsParam?.where && table.layer.definitionExpression !== dsParam?.where) {
                (table.layer.definitionExpression as any) = dsParam?.where
              }
            }
          })
        } else {
          // table is idle
          (table.layer.definitionExpression as any) = dsParam?.where
        }
      } else {
        // table is not loaded, need to call updateGeometryAndSql again after table loaded
        needToCallUpdateGeometryAndSql.current = true
      }
    }
    // resynchronize and highlight:
    // The delay here is caused by the same reason as the loading of most tables.
    // After changing the definitionExpression, the table has a loading process.
    // We currently have no way of knowing when this process will be completed.
    // If the highlight is resynchronized before its completion, there will be a situation
    // where there is a highlight first and then it is reset to empty by the api after the loading ends
    setTimeout(() => {
      syncSelectedForTableHighlight()
    }, 300)
    if (onlyUpdateExpression) return
    dataSourceUtils.changeJimuArcGISQueryToJSAPIQuery(dataSource as FeatureLayerDataSource, Immutable(dsParam)).then(async res => {
      if (!res) return Promise.resolve()
      const { geometry, distance, units } = res
      if (!geometry) {
        table.filterGeometry = null
        return Promise.resolve()
      }
      // same as sql update, need to call update method after table loaded
      if (tableLoaded) {
        if (table.isQueryingOrSyncing) {
          let handle = reactiveUtils.watch(() => table.isQueryingOrSyncing, () => {
            if (!table.isQueryingOrSyncing) {
              if (handle) {
                handle.remove()
                handle = null
              }
              updateTableGeometry(geometry, distance, units)
            }
          })
        } else {
          updateTableGeometry(geometry, distance, units)
        }
      } else {
        needToCallUpdateGeometryAndSql.current = true
      }
      return Promise.resolve()
    }).then(() => {
       // update sql in table, API will clear table highlight, so need to sync highlight
       needToUpdateHighlight.current = true
    })
  }, [usedDsId, dataSource, table, tableLoaded, syncSelectedForTableHighlight, updateTableGeometry])

  React.useEffect(() => {
    const daLayersConfig = getDataActionTable()
    const runtimeLayersConfig = getRuntimeTable()
    const newLayersConfig = configuredLayersConfig.concat(daLayersConfig).concat(runtimeLayersConfig)
    setAllLayersConfig(newLayersConfig)
  }, [configuredLayersConfig, getDataActionTable, getRuntimeTable])

  React.useEffect(() => {
    const newViewInTables = viewInTableKeyStrings ? viewInTableKeyStrings.split('|') : []
    const preViewInTables = previousViewInTableKeyStrings ? previousViewInTableKeyStrings.split('|') : []
    const newViewLength = newViewInTables.length
    const preViewLength = preViewInTables.length
    if (newViewLength > preViewLength) {
      const newAddedIds = minusStringArray(newViewInTables, preViewInTables)
      setActiveTabId(newAddedIds[0])
    }
    // open in same tab
    if (newViewLength > 0 && (newViewLength === preViewLength) && !areArraysEqual(newViewInTables, preViewInTables)) {
      setActiveTabId(newViewInTables[newViewLength - 1])
    }
  }, [previousViewInTableKeyStrings, viewInTableKeyStrings])

  React.useEffect(() => {
    return () => {
      const mutableStoreManager = MutableStoreManager.getInstance()
      mutableStoreManager.updateStateValue(id, 'viewInTableObj', {})
      mutableStoreManager.updateStateValue(id, 'runtimeTableObj', {})
    }
  }, [id])

  React.useEffect(() => {
    getPrivilege().then((canEdit) => {
      setCanEditFeature(canEdit)
    })
  }, [])

  // selection change
  React.useEffect(() => {
    const isActive = widgetState === WidgetState.Active
    if (table && dataSource && isActive && needToUpdateHighlight.current) {
      needToUpdateHighlight.current = false
      syncSelectedForTableHighlight()
    }
    if (table && dataSource && !isActive) {
      const isViewInTable = curLayerConfig?.dataActionType === TableDataActionType.View
      const useSelectedRecords = (isViewInTable ? dataSource.getSelectedRecords() : selectedRecords) || []
      table.highlightIds?.removeAll && table.highlightIds.removeAll()
      const recordIds = useSelectedRecords.map(record => parseInt(record.getId()))
      table.highlightIds.addMany(recordIds)
    }
  }, [widgetState, table, dataSource, curLayerConfig?.dataActionType, selectedRecords, syncSelectedForTableHighlight])

  // only for table switch tab, sync selection for dataSource change
  React.useEffect(() => {
    const isActive = widgetState === WidgetState.Active
    if (table && dataSource && isActive) {
      const useSelectedRecords = dataSource.getSelectedRecords() || []
      table.highlightIds?.removeAll && table.highlightIds.removeAll()
      const recordIds = useSelectedRecords.map(record => parseInt(record.getId()))
      table.highlightIds.addMany(recordIds)
    }
  }, [widgetState, table, dataSource])

  React.useEffect(() => {
    if (table && dataSource) {
      // show selection in turned on and selection is clear
      if (selectQueryFlag && selectedRecords?.length === 0) {
        table.filterBySelectionEnabled = false
        resetTableExpression()
        setSelectQueryFlag(!selectQueryFlag)
      }
    }
  }, [table, dataSource, selectQueryFlag, selectedRecords, resetTableExpression])

  React.useEffect(() => {
    if (!isMapMode) {
      setConfiguredLayersConfig(layersConfig?.asMutable({ deep: true }))
    }
  }, [isMapMode, layersConfig])

  React.useEffect(() => {
    const needInitTabId = (!activeTabId || allLayersConfig.findIndex(x => x.id === activeTabId) < 0) && allLayersConfig.length > 0
    if (needInitTabId) setActiveTabId(allLayersConfig[0].id)
  }, [allLayersConfig, activeTabId])

  // map extent filter
  React.useEffect(() => {
    setMapFilterEnabled(enableMapExtentFilter && defaultExtentFilterEnabled)
  }, [enableMapExtentFilter, defaultExtentFilterEnabled])

  // The activeTab change caused by setting
  React.useEffect(() => {
    const settingChangeTab = stateProps?.settingChangeTab || false
    const activeSettingTabId = stateProps?.activeTabId
    if (settingChangeTab && activeSettingTabId && (activeTabId !== activeSettingTabId)) {
      getAppStore().dispatch(
        appActions.widgetStatePropChange(id, 'settingChangeTab', false)
      )
      onTabClick(activeSettingTabId)
    }
  }, [stateProps, activeTabId, appMode, id, onTabClick])

  // search close
  React.useEffect(() => {
    if (previousSearchOn && !searchOn && dataSource) {
      dataSource.updateQueryParams(EMPTY_QUERY_PARAMS, id)
    }
  }, [dataSource, id, previousSearchOn, searchOn])

  React.useEffect(() => {
    if (tableLoaded && needToCallUpdateGeometryAndSql.current) {
      // Temporary solution, there is still a blank line problem, need further tracking
      setTimeout(() => {
        updateGeometryAndSql()
      }, 300)
    }
  }, [tableLoaded, dataSource, updateGeometryAndSql])

  const onToolStyleChange = (width: number, height: number) => {
    const { enableMapExtentFilter } = config
    const searchMinSize = enableMapExtentFilter ? SEARCH_TOOL_MIN_SIZE + 40 : SEARCH_TOOL_MIN_SIZE
    width < BREAK_POINTS[0]
      ? setMobileFlag(true)
      : setMobileFlag(false)
    width < searchMinSize
      ? setSearchToolTowed(true)
      : setSearchToolTowed(false)
    width < TABLE_BOTTOM_BREAK_POINTS
      ? setBottomResponsiveFlag(true)
      : setBottomResponsiveFlag(false)
    setWidgetWidth(width)
  }

  const updateViewExtent = React.useCallback((extent?: __esri.Extent) => {
    const dsAvailable = dsManager.getDataSource(dataSource?.id)
    if (!dsAvailable) return
    const dsParam: any = dataSource.getInfo()?.widgetQueries?.[id]
    let newParam
    if (extent) {
      newParam = {
        ...dsParam,
        geometry: extent.toJSON()
      }
    } else {
      newParam = {
        ...dsParam
      }
      delete newParam.geometry
    }
    dataSource.updateQueryParams(newParam, id)
  }, [dsManager, dataSource, id])

  const onRestTableGeometry = React.useCallback(() => {
    if (table) {
      table.filterGeometry = null
    }
  }, [table])

  const debounceOnResize = lodash.debounce(({ width, height }) => { onToolStyleChange(width, height) }, 200)

  const onCloseTab = (tabId: string, evt?) => {
    if (evt) evt.stopPropagation()
    setTableShowColumns(undefined)
    const newViewInTableObj = mutableStateProps?.viewInTableObj
    delete newViewInTableObj[tabId]
    delete dataActionTableRecords.current[tabId]
    MutableStoreManager.getInstance().updateStateValue(id, 'viewInTableObj', newViewInTableObj)
    if (tabId === activeTabId) {
      setActiveTabId(allLayersConfig[0].id)
    }
  }

  const onShowSelection = () => {
    if (selectQueryFlag) {
      table.filterBySelectionEnabled = false
      resetTableExpression()
    } else {
      table.filterBySelectionEnabled = true
    }
    setSelectQueryFlag(!selectQueryFlag)
  }

  const resetTable = () => {
    if (selectQueryFlag) {
      resetTableExpression()
      setSelectQueryFlag(false)
    }
    MessageManager.getInstance().publishMessage(
      new DataRecordsSelectionChangeMessage(id, [], [dataSource.id])
    )
    setTimeout(() => {
      const currentParams = dataSource.getCurrentQueryParams()
      dataSource.clearSelection()
      const newEmptySqlParams = { ...currentParams, ...EMPTY_QUERY_PARAMS }
      dataSource.updateQueryParams(newEmptySqlParams, id)
      if (table) {
        table.highlightIds.removeAll()
        if (selectQueryFlag) table.filterBySelectionEnabled = false
      }
    }, 500)
  }

  const onTableRefresh = () => {
    table && table.refresh()
  }

  const onDeleteSelection = () => {
    table && table.deleteSelection(true)
  }

  const getInitFields = () => {
    const initSelectTableFields: ClauseValuePair[] = []
    // get all layer config include data-action and map mode
    const curLayer = allLayersConfig.find(item => item.id === activeTabId)
    if (!curLayer) return initSelectTableFields
    const { tableFields, allFields, layerHonorMode } = curLayer
    // honor layer settings
    const isHonorWebmap = layerHonorMode === LayerHonorModeType.Webmap
    if (isHonorWebmap && dataSource) {
      const popupInfo = (dataSource as FeatureLayerDataSource)?.getPopupInfo?.()
      if (popupInfo) {
        const popupAllFieldInfos = popupInfo.fieldInfos || []
        for (const item of popupAllFieldInfos) {
          initSelectTableFields.push({ value: item.fieldName, label: item.label })
        }
      } else {
        // if popupInfo is null, use 'allFields' instead
        for (const item of allFields) {
          initSelectTableFields.push({ value: item.name, label: item.alias })
        }
      }
    } else {
      for (const item of tableFields) {
        if (item.visible) initSelectTableFields.push({ value: item.name, label: item.alias })
      }
    }
    return initSelectTableFields
  }

  const onValueChangeFromRuntime = (valuePairs: ClauseValuePair[]) => {
    if (!valuePairs) valuePairs = []
    const { columnsVisibleFields } = getTableColumnsFields(table?.columns?.toArray())
    const tableColumns = tableShowColumns || columnsVisibleFields
    minusArray(tableColumns, valuePairs, 'value').forEach(item => {
      table.toggleColumnVisibility(item.value)
    })
    setTableShowColumns(valuePairs)
  }

  const toggleMapFilter = () => {
    setMapFilterEnabled(!mapFilterEnabled)
  }

  const handleSelectionChange = (tableSelected: number) => {
    setTableSelected(tableSelected)
  }

  const onUpdateLayerInfo = (layerInfo: LayerInfo) => {
    if (!layerInfo || !activeTabId || !curLayerConfig) return
    const {
      notReady, emptyTable, showLoading, interval, selectedRecords,
      selectionViewIds, maxCount, sourceVersion: dsSourceVersion, refreshTime
    } = layerInfo
    setNotReady(notReady)
    setEmptyTable(emptyTable)
    setShowLoading(showLoading)
    setInterval(interval)
    setSelectedRecords(selectedRecords)
    setSelectionViewIds(selectionViewIds)
    setMaxCount(maxCount)
    setSourceVersion(dsSourceVersion)
    setRefreshTime(refreshTime)
  }

  const onTimeExtentChange = (time: TimeExtent) => {
    const tableLayer = table?.layer as any
    if (time) {
      const apiTime = dataSourceUtils.changeJimuTimeToJSAPITimeExtent(time)
      const orgTimeExtent = tableLayer?.timeExtent
      const timeNotChange = time?.[0] === orgTimeExtent?.start?.getTime() && time?.[1] === orgTimeExtent?.end?.getTime()
      if (!timeNotChange && tableLayer) tableLayer.timeExtent = apiTime
    } else {
      if (tableLayer) tableLayer.timeExtent = null
    }
  }

  const onGdbVersionChange = (gdbVersion: string) => {
    const tableLayer: any = table.layer
    tableLayer.gdbVersion = gdbVersion
    onTableRefresh()
  }

  // eg. data view update will cause beLongTo source version change
  // only refresh is not enough, need to update geometry and sql
  // Case: belongToDsVersion changes but the sql and geometry remain unchanged
  // this won't update sql or geometry, so need to call onTableRefresh
  // The best logic is to call refresh only when it is determined that neither the sql nor the geometry has changed.
  // This involves the modification of updateGeometryAndSql. In the patch, we will not handle it this way for the time being
  // We directly call refresh method. This will ensure the correctness of the data.
  const onBelongToSourceVersionChange = () => {
    updateGeometryAndSql()
    onTableRefresh()
  }

  const onNeedRefresh = () => {
    onTableRefresh()
  }

  const onWidgetQueryChange = () => {
    // In some scenarios, for example, filter is enabled by default.
    // When the page is initialized, the layer of the table is still inaccessible. Therefore, the layer must be updated after the table loaded.
    if (!table?.layer) {
      needToCallUpdateGeometryAndSql.current = true
      return
    }
    updateGeometryAndSql()
  }

  const showPlaceholder = allLayersConfig.length === 0
  const toolListNode =
    curLayerConfig && <TableToolList
      usedState={usedState}
      curLayerConfig={curLayerConfig}
      dataSource={dataSource}
      dsSelection={selectedRecords}
      isMapMode={isMapMode}
      arrangeType={arrangeType}
      enableMapExtentFilter={enableMapExtentFilter}
      widgetId={id}
      enableDataAction={enableDataAction}
      getInitFields={getInitFields}
      onShowSelection={onShowSelection}
      resetTable={resetTable}
      onTableRefresh={onTableRefresh}
      onDeleteSelection={onDeleteSelection}
      onValueChangeFromRuntime={onValueChangeFromRuntime}
      toggleMapFilter={toggleMapFilter}
    />

  return (
    <React.Fragment>
      {showPlaceholder &&
        <WidgetPlaceholder
          icon={tablePlaceholderIcon}
          name={translate('_widgetLabel')}
          data-testid='tablePlaceholder'
        />
      }
      <div className={classes} css={getStyle(theme, mobileFlag, searchOn, partProps)} ref={tableWidgetCon}>
        <div className={!showPlaceholder ? 'surface-1 border-0 h-100' : 'hide-table'}>
          <div className='table-indent'>
            {allLayersConfig && activeTabId &&
              <TableTabSelect
                allLayersConfig={allLayersConfig}
                isHorizontalTab={isHorizontalTab}
                activeTabId={activeTabId}
                searchOn={searchOn}
                toolListNode={toolListNode}
                onTabClick={onTabClick}
                onCloseTab={onCloseTab}
              />
            }
            <div className={isHorizontalTab ? 'horizontal-render-con' : 'dropdown-render-con'}>
              {curLayerConfig && searchOn &&
                <TableHeader
                  searchToolTowed={searchToolTowed}
                  curLayerConfig={curLayerConfig}
                  dataSource={dataSource}
                  tableLoaded={tableLoaded}
                  widgetState={widgetState}
                  toolListNode={toolListNode}
                  handleSubmit={handleSubmit}
                />
              }
              {emptyTable &&
                <EmptyTablePlaceholder
                  searchOn={searchOn}
                  notReady={notReady}
                  dataSourceLabel={dataSource?.getLabel()}
                  widgetLabel={widgetLabel}
                />
              }
              <div className='table-con' ref={tableContainer}/>
              <div className='table-bottom-info'>
                <TableTotalSelection
                  table={table}
                  showCount={curLayerConfig?.showCount}
                  onSelectedChange={handleSelectionChange}
                />
                {(curLayerConfig?.updateText === undefined ? true : curLayerConfig.updateText) && (showLoading || interval > 0) &&
                  <AutoRefreshLoading
                    showLoading={showLoading}
                    interval={interval}
                    isMobile={mobileFlag}
                    bottomResponsive={bottomResponsiveFlag}
                    refreshTime={refreshTime}
                  />
                }
              </div>
              {isMapMode &&
                <TableMapView
                  widgetId={id}
                  useMapWidgetIds={useMapWidgetIds}
                  mapViewsConfig={mapViewsConfig}
                  mapFilterEnabled={mapFilterEnabled}
                  onUpdateViewExtent={updateViewExtent}
                  onRestTableGeometry={onRestTableGeometry}
                  onLayersConfigChange={onMapLayersConfigChange}
                  onViewChange={onViewChange}
                />
              }
              <TableDataSource
                widgetId={id}
                curLayerConfig={curLayerConfig}
                isSelfEditing={isSelfEditing}
                onUpdateLayerInfo={onUpdateLayerInfo}
                onTimeExtentChange={onTimeExtentChange}
                onGdbVersionChange={onGdbVersionChange}
                onBelongToSourceVersionChange={onBelongToSourceVersionChange}
                onNeedRefresh={onNeedRefresh}
                onWidgetQueryChange={onWidgetQueryChange}
              />
              <Global styles={getGlobalTableTools(theme)} />
            </div>
          </div>
        </div>
        <ReactResizeDetector
          targetRef={tableWidgetCon}
          handleWidth
          handleHeight
          onResize={debounceOnResize}
        />
      </div>
    </React.Fragment>
  )
}

TableWidget.versionManager = versionManager

export default TableWidget
