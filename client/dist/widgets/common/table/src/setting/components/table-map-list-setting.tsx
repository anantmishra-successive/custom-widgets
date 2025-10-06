/** @jsx jsx */
import { React, jsx, type ImmutableObject, type ImmutableArray, Immutable, CONSTANTS, hooks, defaultMessages as jimuCoreMessages  } from 'jimu-core'
import { type _TreeItem, List, type TreeActionDataType, type TreeRenderOverrideItemDataType, type UpdateTreeActionDataType } from 'jimu-ui/basic/list-tree'
import { SettingRow, SidePopper } from 'jimu-ui/advanced/setting-components'
import type { JimuFeatureLayerView, JimuMapView, JimuMapViewGroup, JimuSceneLayerView } from 'jimu-arcgis'
import type { LayersConfig } from '../../config'
import LayerConfig from './layer-config'
import { getDataSourceById, getTableDataSource } from '../../utils'
import { Alert } from 'jimu-ui'
import { advancedActionMap } from './utils'
import { builderAppSync } from 'jimu-for-builder'

interface TableLayerProps {
  widgetId: string
  layersConfig: ImmutableArray<LayersConfig>
  viewGroup: JimuMapViewGroup
  activeMapView: JimuMapView
  onChange: (layersConfig: ImmutableArray<LayersConfig>, activeId?: string) => void
}

export type SelectableJimuLayerView = JimuFeatureLayerView | JimuSceneLayerView

const TableMapListSetting = (props: TableLayerProps) => {
  const { widgetId, layersConfig, viewGroup, activeMapView, onChange } = props
  const [activeId, setActiveId] = React.useState<string>('')
  const [showLayerPanel, setShowLayerPanel] = React.useState<boolean>(false)
  const [popperFocusNode, setPopperFocusNode] = React.useState<HTMLElement>(null)
  const sidePopperTrigger = React.useRef<HTMLDivElement>(null)
  const translate = hooks.useTranslation(jimuCoreMessages)
  const { OUTPUT_DATA_VIEW_ID } = CONSTANTS

  const activeLayerConfig = React.useMemo(() => {
    const layerConfig = layersConfig.find(l => l.id === activeId)
    return Immutable(layerConfig)
  }, [activeId, layersConfig])

  const dataSource = React.useMemo(() => {
    const ds = getDataSourceById(activeId)
    return getTableDataSource(ds)
  }, [activeId])
  const layerDefinition = dataSource?.getLayerDefinition()
  const layerEditingEnabled = dataSource?.layer?.editingEnabled
  const isDsAutoRefresh = dataSource?.getAutoRefreshInterval() > 0
  const isEditableDs = dataSource?.url && dataSource?.dataViewId !== OUTPUT_DATA_VIEW_ID

  const itemsJson = React.useMemo(() => {
    return layersConfig.map((config) => {
      return {
        itemStateDetailContent: config,
        itemKey: config.id,
        itemStateChecked: config.id === activeId,
        itemStateTitle: config.name,
        itemStateCommands: []
      }
    }).asMutable({ deep: true })
  }, [activeId, layersConfig])

  const alertIcon = React.useMemo(() => {
    return <Alert
      variant='text'
      form='tooltip'
      size='small'
      type='error'
      text={translate('dataSourceCreateError')}
    />
  }, [translate])

  const isDataSourceAccessible = (dataSourceId: string) => {
    const ds = getDataSourceById(dataSourceId)
    return !!ds
  }

  const renderDetail = React.useCallback((actionData: TreeRenderOverrideItemDataType, refComponent: _TreeItem) => {
    const { itemJsons } = refComponent.props
    const [currentItemJson] = itemJsons
    const dsId = currentItemJson?.itemStateDetailContent?.useDataSource?.dataSourceId
    const accessible = isDataSourceAccessible(dsId)
    return accessible ? null : alertIcon
  }, [alertIcon])

  const informRuntime = React.useCallback((layerConfig: LayersConfig) => {
    setActiveId(layerConfig.id)
    setShowLayerPanel(true)
    builderAppSync.publishChangeWidgetStatePropToApp({ widgetId, propKey: 'activeTabId', value: layerConfig.id })
    builderAppSync.publishChangeWidgetStatePropToApp({ widgetId, propKey: 'settingChangeTab', value: true })
    if (sidePopperTrigger.current) {
      const index = layersConfig.findIndex(l => l.id === layerConfig.id)
      const node = sidePopperTrigger.current.getElementsByClassName('jimu-tree-item__body')[index] as HTMLElement
      setPopperFocusNode(node)
    }
  }, [widgetId, layersConfig])

  const handleClick = React.useCallback((actionData: TreeActionDataType, refComponent: _TreeItem) => {
    const { itemJsons: [currentItemJson] } = refComponent.props
    const layerConfig = currentItemJson.itemStateDetailContent
    if (layerConfig.id === activeId) {
      setActiveId(null)
      setShowLayerPanel(false)
      setPopperFocusNode(null)
    } else {
      const activeMapViewDsId = activeMapView?.dataSourceId
      const layerRootDsId = layerConfig.useDataSource?.rootDataSourceId
      // If the view corresponding to the layer panel clicked is not the active view of the current map, need to switch the view of the map
      if (activeMapViewDsId === layerRootDsId) {
        informRuntime(layerConfig)
      } else {
        viewGroup && viewGroup.switchMap().then(() => {
          informRuntime(layerConfig)
        })
      }
    }
  }, [activeId, activeMapView, informRuntime, viewGroup])

  const handleChange = (layerConfig: ImmutableObject<LayersConfig>) => {
    const activeIndex = layersConfig.findIndex(l => l.id === activeId)
    onChange(Immutable.set(layersConfig, activeIndex, layerConfig), activeId)
  }

  const handleClose = () => {
    setActiveId(null)
    setShowLayerPanel(false)
  }

  const onUpdateItem = (actionData: UpdateTreeActionDataType, refComponent: _TreeItem) => {
    if (actionData.updateType === 'handleDidDrop') {
      const { dragItemIndex: curIndex, targetDropItemIndex: newIndex } = actionData
      const isValidIndex = (n: any) => typeof n === 'number' && n > -1 && n < layersConfig.length
      if (isValidIndex(curIndex) && isValidIndex(newIndex)) {
        const newLayersConfig = layersConfig.asMutable({ deep: true })
        const sortItem = newLayersConfig.splice(curIndex, 1)[0]
        newLayersConfig.splice(newIndex, 0, sortItem)
        onChange(Immutable(newLayersConfig))
      }
    }
  }

  return <SettingRow>
    <div className='w-100' ref={sidePopperTrigger}>
      <List
        className='py-1'
        itemsJson={itemsJson}
        dndEnabled
        onUpdateItem={onUpdateItem}
        renderOverrideItemDetailToggle={renderDetail}
        onClickItemBody={handleClick}
        {...advancedActionMap}
      />
    </div>
    <SidePopper
      position='right'
      isOpen={showLayerPanel}
      toggle={handleClose}
      trigger={sidePopperTrigger.current}
      backToFocusNode={popperFocusNode}
    >
      <LayerConfig
        widgetId={widgetId}
        layerConfig={activeLayerConfig}
        isMapMode={true}
        layerDefinition={layerDefinition}
        layerEditingEnabled={layerEditingEnabled}
        isDsAutoRefresh={isDsAutoRefresh}
        isEditableDs={isEditableDs}
        onChange={handleChange}
        onClose={handleClose}
      />
    </SidePopper>
  </SettingRow>
}

export default TableMapListSetting
