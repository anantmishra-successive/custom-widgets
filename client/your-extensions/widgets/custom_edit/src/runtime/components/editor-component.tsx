/** @jsx jsx */
import {
  React, jsx, Immutable, type IMUseDataSource, type DataSourceTypes, type ImmutableArray,
  type FeatureDataRecord, dataSourceUtils, hooks
} from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import { WidgetPlaceholder } from 'jimu-ui'
import * as reactiveUtils from 'esri/core/reactiveUtils'
import FeatureLayer from 'esri/layers/FeatureLayer'
import editWidgetIcon from '../../../icon.svg'
import { getDataSourceById, getFlatFormElements, supportedDsTypes } from '../../utils'
import {
  type EditFeatures, flatMapArrayWithView, idsArrayEquals, queryFullFeatures, useVisible
} from './utils'
import EditListDataSource from './edit-list-ds'
import useEditor from './use-editor'
import type { CommonProps } from '../widget'
import defaultMessages from '../translations/default'
import MyMultiSelectWidget from './calcite-component'

interface EditorComponentProps extends CommonProps {
  useMapWidgetIds?: ImmutableArray<string>
  zoneLayerUrl?: string
}

const EditorComponent = (props: EditorComponentProps) => {

  const { config, canEditFeature, useMapWidgetIds, zoneLayerUrl  } = props
  const { mapViewsConfig, batchEditing = false } = config

  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView>(null)
  const [mapUseDataSources, setMapUseDataSources] = React.useState<IMUseDataSource[]>()
  const [editFeatures, setEditFeatures] = React.useState<EditFeatures>({})

  const translate = hooks.useTranslation(defaultMessages)

  const editContainer = React.useRef<HTMLDivElement>(null)
  const editor = useEditor({
    config,
    jimuMapView,
    editContainer,
    canEditFeature
  })

  console.log("EditorComponent props:", editor);

  const updateUseDataSourcesByLayerInfos = React.useCallback(async (layerInfos: __esri.EditorLayerInfo[]) => {
    if (!jimuMapView || jimuMapView.isDestroyed() || !layerInfos) return
    const viewConfig = mapViewsConfig?.[jimuMapView.id]
    const customizeLayers = viewConfig?.customizeLayers
    const customJimuLayerViewIds = viewConfig?.customJimuLayerViewIds
    const newMapUseDataSources = []
    for (const layerInfo of layerInfos) {
      try {
        if (!layerInfo.enabled || (layerInfo.layer as __esri.FeatureLayer).isTable) continue
        const jimuLayerViewId = jimuMapView.getJimuLayerViewIdByAPILayer(layerInfo.layer)
        if (customizeLayers && !customJimuLayerViewIds?.includes(jimuLayerViewId)) continue
        const jimuLayerView = await jimuMapView.whenJimuLayerViewLoaded(jimuLayerViewId)
        const layerDs = jimuLayerView.getLayerDataSource()
        if (!layerDs || !supportedDsTypes.includes(layerDs.type as DataSourceTypes)) continue
        const mainDs = layerDs.getMainDataSource()
        const rootDs = layerDs.getRootDataSource()
        const usedDs: IMUseDataSource = Immutable({
          dataSourceId: layerDs.id,
          mainDataSourceId: mainDs?.id,
          dataViewId: layerDs.dataViewId,
          rootDataSourceId: rootDs?.id
        })
        newMapUseDataSources.push(usedDs)
      } catch (e) {
        continue
      }
    }
    setMapUseDataSources(newMapUseDataSources)
  }, [jimuMapView, mapViewsConfig])

  const handleActiveViewChange = React.useCallback((jmv: JimuMapView) => {
    setJimuMapView(jmv)
  }, [])

  const startWorkflow = React.useCallback(async (features: EditFeatures) => {
    if (!editor || !jimuMapView) return
    if ((editor as any).activeWorkflow) {
      editor.cancelWorkflow()
    }
    const selectionManager = (editor as any).effectiveSelectionManager
    const featureRecords = flatMapArrayWithView(features, jimuMapView)
    if (featureRecords.length === 0) {
      selectionManager?.hasSelection && selectionManager.clear()
    } else {
      selectionFromExb.current = true
      let fullFeatures: __esri.Graphic[] = []
      try {
        fullFeatures = await queryFullFeatures(jimuMapView, features)
      } catch (err) {
        console.error('Failed to query editing features:', err)
      }
      if (fullFeatures.length === 0) {
        selectionManager?.hasSelection && selectionManager.clear()
        console.error('No features found for the selected data records.')
      } else if (fullFeatures.length === 1) {
        selectionManager?.hasSelection && selectionManager.clear()
        const activeFeature = fullFeatures[0]
        editor.startUpdateWorkflowAtFeatureEdit(activeFeature)
      } else if (fullFeatures.length > 1) {
        if (jimuMapView.view.type === '2d' && batchEditing) {
          selectionManager?.hasSelection && selectionManager.clear()
          selectionManager && selectionManager.updateSelection({
            current: fullFeatures,
            added: [],
            removed: [],
          })
        } else {
          editor.startUpdateWorkflowAtMultipleFeatureSelection(fullFeatures)
        }
      }
    }
  }, [batchEditing, editor, jimuMapView])

  const selectionFromEditor = React.useRef(false)
  const selectionFromExb = React.useRef(false)
  const visible = useVisible(editContainer.current)

  const handleSelectionChange = React.useCallback((dataSourceIds: string[]) => {
    const newEditFeatures = Object.assign({}, editFeatures)
    for (const dataSourceId of dataSourceIds) {
      const dataSource = getDataSourceById(dataSourceId)
      if (!dataSource) continue
      const selectedRecords = dataSource.getSelectedRecords() as FeatureDataRecord[]
      newEditFeatures[dataSourceId] = selectedRecords
    }
    setEditFeatures(newEditFeatures)
    if (selectionFromEditor.current) {
      window.setTimeout(() => {
        selectionFromEditor.current = false
      }, 50)
    } else if (visible) {
      startWorkflow(newEditFeatures)
    }
  }, [editFeatures, startWorkflow, visible])

  const handleSourceVersionChange = React.useCallback((dataSourceId: string) => {
    const featureRecords = flatMapArrayWithView(editFeatures, jimuMapView)
    const featureCount = featureRecords.length
    if (!editor?.viewModel.syncing || featureCount === 1) {
      handleSelectionChange([dataSourceId])
    }
  }, [editFeatures, editor, handleSelectionChange, jimuMapView])

  const editFeatureRef = hooks.useLatest(editFeatures)
  React.useEffect(() => {
    if (visible && !editor?.activeWorkflow?.started) {
      startWorkflow(editFeatureRef.current)
    }
    if (!visible && editor?.activeWorkflow?.started) {
      editor.activeWorkflow.cancel()
    }
  }, [editFeatureRef, editor, startWorkflow, visible])

  const [formChange, setFormChange] = React.useState(false)

  React.useEffect(() => {
    if (!editor || !jimuMapView) return

    let rootFeatureWatchHandle: __esri.WatchHandle | null = null

    // 👇 This is the important logging block
    rootFeatureWatchHandle = reactiveUtils.watch(
      () => (editor.viewModel?.activeWorkflow?.data as any)?.rootFeature,
      async (rootFeature) => {
        if (!rootFeature) return

        // ✅ Log selected feature details
        console.log("🔎 Selected Feature Attributes:", rootFeature.attributes)
        console.log("📐 Selected Feature Geometry:", rootFeature.geometry)

        if (!rootFeature.geometry) return
        // you can keep zone logic here if needed
      },
      { initial: true }
    )

    return () => {
      try { rootFeatureWatchHandle?.remove?.() } catch {}
    }
  }, [editor, jimuMapView])

  React.useEffect(()=> {
    if (!editor) return
    const watchLayerInfos = reactiveUtils.watch(() => editor?.layerInfos, (layerInfos) => {
      updateUseDataSourcesByLayerInfos(layerInfos)
    }, { initial: true })
    return () => {
      try { watchLayerInfos?.remove?.() } catch {}
    }
  }, [editor, updateUseDataSourcesByLayerInfos])

  const mapWidgetId = useMapWidgetIds?.[0]
  return (
    <div className='jimu-widget widget-edit esri-widget'>
      <div className="editor-component-root">
        {/* Multi-select widget demo */}
        {/* <MyMultiSelectWidget /> */}
      </div>
      {mapWidgetId && <div className='edit-con h-100' ref={editContainer}></div>}
      {!mapWidgetId && <WidgetPlaceholder
        autoFlip
        icon={editWidgetIcon}
        name={translate('_widgetLabel')}
        data-testid='editPlaceholder'
      />}
      <JimuMapViewComponent
        useMapWidgetId={mapWidgetId}
        onActiveViewChange={handleActiveViewChange}
      />
      {mapWidgetId && !jimuMapView && <div className='jimu-secondary-loading' />}
      {editor &&<EditListDataSource
        useDataSources={mapUseDataSources}
        unsavedChange={formChange}
        onSelectionChange={handleSelectionChange}
        onSourceVersionChange={handleSourceVersionChange}
      />}
    </div>
  )
}

/**
 * Query the technician layer for supervisor names and publish them via callback.
 * @param {string} technicianLayerUrl - The URL of the technician FeatureLayer.
 * @param {string} roleField - The field name for role (e.g., 'ROLE').
 * @param {string} nameField - The field name for supervisor name (e.g., 'NAME').
 * @param {string} activeField - The field name for active status (e.g., 'ACTIVE').
 * @param {function} onResult - Callback to receive the supervisor names array.
 */
export async function getSupervisorNamesQuery({
  technicianLayerUrl,
  roleField = 'ROLE',
  nameField = 'NAME',
  activeField = 'ACTIVE',
  onResult
}) {
  try {
    const supervisorNames = [{ id: '', label: '' }];
    const fl = new FeatureLayer({ url: technicianLayerUrl });
    const query = fl.createQuery();
    query.where = `${roleField} IN ('Supervisor')`;
    query.returnGeometry = false;
    query.outFields = [nameField, activeField];
    query.orderByFields = [nameField];
    query.returnDistinctValues = true;
    const result = await fl.queryFeatures(query);
    const features = (result.features || []).filter(f => f.attributes?.[activeField] === 1);
    for (const feat of features) {
      const name = feat.attributes?.[nameField];
      if (name) supervisorNames.push({ id: name, label: name });
    }
    if (typeof onResult === 'function') {
      onResult(supervisorNames);
    }
    // If you want to use a pub/sub system, you can publish here
    // topic.publish('getSupervisorNames', supervisorNames);
    return supervisorNames;
  } catch (err) {
    console.error('getSupervisorNamesQuery error:', err);
    // If you have a logger, use it here
    // this.ApplicationLogger.log('Critical', 'Search->getSupervisorNamesQuery', err.message, this.appConfig);
    return [];
  }
}

export default EditorComponent
