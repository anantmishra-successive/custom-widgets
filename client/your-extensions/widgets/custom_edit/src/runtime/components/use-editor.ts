import { Immutable, React, hooks, type JSAPILayerTypes } from 'jimu-core'
import { type JimuLayerView, type JimuMapView, SnappingUtils } from 'jimu-arcgis'
import Editor from 'esri/widgets/Editor'
import * as reactiveUtils from 'esri/core/reactiveUtils'
import { type IMConfig, type LayersConfig, SnapSettingMode } from '../../config'
import { getDataSourceById, getEditDataSource, SUPPORTED_JIMU_LAYER_TYPES, type SupportedDataSource, type SupportedLayer } from '../../utils'
import { constructUneditableInfo, getEditorLayerInfo, isEditableLayerView, updateDataSourceAfterEdit } from './utils'
import Graphic from 'esri/Graphic'
import FeatureLayer from 'esri/layers/FeatureLayer'

interface UseEditorOptions {
  config: IMConfig
  jimuMapView: JimuMapView
  editContainer: React.RefObject<HTMLDivElement>
  canEditFeature: boolean
  onRootFeatureChange?: (rootFeature: __esri.Graphic | null) => void
  onCreateFeature?: (evt: any) => void
}

const useEditor = (options: UseEditorOptions) => {

  const { config, jimuMapView, editContainer, canEditFeature, onRootFeatureChange, onCreateFeature } = options
  const { mapViewsConfig, relatedRecords, liveDataEditing } = config
  const editorRef = React.useRef<Editor>(null)
  const rootFeatureWatchRef = React.useRef<__esri.WatchHandle | null>(null)
  const createHandleRef = React.useRef<__esri.Handle | null>(null)
  const loggedRootFeatureIdsRef = React.useRef<Set<string | number>>(new Set())
  // store original applyEdits functions so we can restore later
  const origApplyEditsMapRef = React.useRef<Map<string, { layer: any, original: Function }>>(new Map())
// --- Paste these helpers + effect into use-editor.tsx (after editorRef is created / in the component scope) ---

// helper to detect the target layer (service request or layer id = 2)
const isServiceRequestLayer = (layer: any) => {
  if (!layer) return false
  const title = (layer.title || layer.name || '').toString()
  if (/service\s*request/i.test(title)) return true

  if (typeof layer.layerId !== 'undefined' && Number(layer.layerId) === 2) return true
  if (typeof layer.id !== 'undefined' && Number(layer.id) === 2) return true

  const url = (layer.url || '').toString()
  const m = url.match(/\/(\d+)(?:\/)?$/)
  if (m && Number(m[1]) === 2) return true

  return false
}

// placeholder where you will fetch details related to this layer/feature
const fetchDetailsForLayer = async (layer: any, feature: __esri.Graphic | null) => {
  try {
    // Put your detail-fetch logic here. Example placeholders:
    console.log('fetchDetailsForLayer: matched layer ->', {
      id: layer?.id,
      layerId: layer?.layerId,
      title: layer?.title || layer?.name,
      url: layer?.url
    })
    // Example: if you want to query layer fields, attributes, or call custom REST endpoints
    // const info = await someFetchFn(layer.url, { feature })
    // return info

  } catch (err) {
    console.warn('fetchDetailsForLayer error:', err)
  }
}

// Effect: watch editor rootFeature and react once per NEW feature
React.useEffect(() => {
  const editorWidget = editorRef.current
  console.log('use-editor -> editorWidget:', editorWidget);
  if (!editorWidget) return

  const vm = (editorWidget as any).viewModel
  if (!vm) return

  const processed = new Set<string>()

  // stable key creator for a root feature
  const getFeatureUniqueKey = (g: __esri.Graphic | null) => {
    try {
      if (!g) return `null-${Date.now()}`
      const objectIdField = g?.attributes && Object.keys(g.attributes).find((k: string) => /objectid/i.test(k))
      const oidVal = objectIdField ? g.attributes[objectIdField] : undefined
      if (oidVal !== undefined && oidVal !== null) return `oid:${oidVal}`
      if ((g as any)?.uid) return `uid:${(g as any).uid}`
      // fallback to geometry hash (stringify)
      return `geom:${JSON.stringify(g.geometry || {})}`
    } catch (e) {
      return `fallback:${Date.now()}`
    }
  }

  // the watcher: fires when editor's rootFeature changes (form open/create flows)
  const watchHandle: __esri.WatchHandle | null = reactiveUtils.watch(
    () => (vm?.activeWorkflow?.data as any)?.rootFeature,
    async (rootFeature: __esri.Graphic | null) => {
      try {
        if (!rootFeature) return

        const key = getFeatureUniqueKey(rootFeature)
        if (processed.has(key)) {
          // we've already handled this feature once
          return
        }

        // determine if it's a NEW feature (no object id yet)
        const idField = rootFeature?.attributes ? Object.keys(rootFeature.attributes).find(k => /objectid/i.test(k)) : undefined
        const hasObjectId = idField && (rootFeature as any).attributes && (rootFeature as any).attributes[idField] !== undefined && (rootFeature as any).attributes[idField] !== null

        // only run for new features (create flow)
        if (!hasObjectId) {
          // mark processed before async work to avoid races
          processed.add(key)

          // try to locate the layer the workflow is operating on
          // 1) try from activeWorkflow (some Editor versions expose layer/layerView)
          let layer: any = vm?.activeWorkflow?.layer ?? vm?.activeWorkflow?.layerView?.layer ?? null

          // 2) fallback: try to read from editor.layerInfos if any match the workflow's layerId
          if (!layer && Array.isArray(editorWidget?.layerInfos)) {
            // first try to find any layerInfo whose layer contains this rootFeature's attributes matching idField
            // fallback to the first matching by isServiceRequestLayer
            const matched = (editorWidget.layerInfos || []).find((li: any) => {
              try {
                const liLayer = li.layer
                return isServiceRequestLayer(liLayer)
              } catch (e) { return false }
            })
            layer = matched?.layer ?? null
          }

          if (!layer) {
            console.log('use-editor: Could not resolve layer for the opened form (rootFeature).')
            return
          }

          // check if it's the target SR layer
          if (isServiceRequestLayer(layer)) {
            // invoke your fetch logic (placeholder)
            await fetchDetailsForLayer(layer, rootFeature)
          } else {
            // not the layer we care about
            console.log('use-editor: form opened for a NEW feature, but layer is not Service Request / id=2')
          }
        } else {
          // existing feature edit — do not run initial-only fetch
          console.log('use-editor: form opened for existing feature edit — skipping initial-only fetch.')
        }
      } catch (err) {
        console.warn('use-editor rootFeature watch handler error:', err)
      }
    },
    { initial: false }
  )

  // cleanup
  return () => {
    try { watchHandle?.remove?.() } catch {}
  }
}, [/* no external deps so it stays tied to editorRef only; if you prefer include editorRef.current as dep use a stable ref hook */])

  const destroyEditor = React.useCallback(() => {
    try {
      if (rootFeatureWatchRef.current) {
        try { rootFeatureWatchRef.current.remove?.(); rootFeatureWatchRef.current = null } catch {}
      }
      if (createHandleRef.current) {
        try { createHandleRef.current.remove?.(); createHandleRef.current = null } catch {}
      }
      loggedRootFeatureIdsRef.current.clear()
      // restore any patched applyEdits
      try {
        for (const [, { layer, original }] of origApplyEditsMapRef.current) {
          try {
            if (layer && original) {
              (layer as any).applyEdits = original
            }
          } catch (restoreErr) {
            console.warn('Failed to restore original applyEdits for layer', restoreErr)
          }
        }
      } catch (mapErr) {
        console.warn('Error while restoring applyEdits map', mapErr)
      }
      origApplyEditsMapRef.current.clear()

      if (editorRef.current && !(editorRef.current as any).destroyed) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    } catch (e) {
      console.warn('Error while destroying editor or handles:', e)
    }
  }, [])

  React.useEffect(() => {
    return () => {
      destroyEditor()
    }
  }, [destroyEditor])

  const [editorLayerInfos, setEditorLayerInfos] = React.useState<__esri.EditorLayerInfo[]>([])
  const [showUpdateBtn, setShowUpdateBtn] = React.useState(false)

  const updateEditorLayerInfos = React.useCallback(() => {
    if (!jimuMapView) return
    let allLayerViews = jimuMapView.getAllJimuLayerViews()
    const mapViewConfig = mapViewsConfig?.[jimuMapView.id]
    const customizeLayers = mapViewConfig?.customizeLayers
    const customJimuLayerViewIds = mapViewConfig?.customJimuLayerViewIds
    const layersConfig = mapViewConfig?.layersConfig || Immutable<LayersConfig[]>([])
    if (customizeLayers) {
      allLayerViews = allLayerViews.sort((a, b) => {
        const aIndex = layersConfig.findIndex(layerConfig => layerConfig.id === a.layerDataSourceId)
        const bIndex = layersConfig.findIndex(layerConfig => layerConfig.id === b.layerDataSourceId)
        return aIndex - bIndex
      })
    }
    const allLayers = jimuMapView.view?.map?.allLayers?.toArray?.() || []
    const uneditableLayers = allLayers.filter(layer => {
      const isSupported = SUPPORTED_JIMU_LAYER_TYPES.includes(layer.type as JSAPILayerTypes)
      const notInJimuLayerView = !allLayerViews.find(layerView => layerView.layer === layer)
      return isSupported && notInJimuLayerView
    }) as SupportedLayer[]
    const supportedLayerViews = allLayerViews.filter(layerView => {
      const layer = layerView.layer
      const isSupported = SUPPORTED_JIMU_LAYER_TYPES.includes(layer.type)
      return isSupported
    })
    const editableLayerViews: JimuLayerView[] = []
    supportedLayerViews.forEach(layerView => {
      const layer = layerView.layer
      const isEditable = isEditableLayerView(layerView, customizeLayers, customJimuLayerViewIds, liveDataEditing)
      if (isEditable) {
        editableLayerViews.push(layerView)
      } else {
        uneditableLayers.push(layerView.layer)
      }
    })
    const uneditableLayerInfos = uneditableLayers.map(layer => constructUneditableInfo(layer))
    const editablePromise = editableLayerViews.map(async (layerView) => {
      const ds = await layerView.getOrCreateLayerDataSource() as SupportedDataSource
      if (!ds) return null
      const layerConfig = layersConfig.filter(l => l.id === ds?.id)?.[0]?.asMutable?.({ deep: true })
      const dataSource = getEditDataSource(ds)
      return getEditorLayerInfo(dataSource, layerConfig, layerView, relatedRecords, canEditFeature)
    })
    Promise.all(editablePromise).then((results) => {
      
      const validResults = results.filter(v => !!v)
      setShowUpdateBtn(validResults.some(r => r.showUpdateBtn))
      const layerInfos = validResults.map(r => r.editorLayerInfo).concat(uneditableLayerInfos)
      const relatedTableInfos = []
      const allTables = (jimuMapView.view.map.allTables.toArray() || []) as __esri.FeatureLayer[]
      for (const layerInfo of layerInfos) {
        const elements = layerInfo.formTemplate?.elements || []
        const hasRelationships = elements.some(e => e.type === 'relationship')
        if (!hasRelationships) continue
        const relationships = (layerInfo.layer as __esri.FeatureLayer | __esri.SubtypeSublayer | __esri.SceneLayer).relationships
        for (const relationship of relationships) {
          const relatedTableId = relationship.relatedTableId
          const relatedTable = allTables.find(t => t.layerId === relatedTableId)
          if (!relatedTable) continue
          const relatedTableInfo = relatedTableInfos.find(tableInfo => tableInfo.layer === relatedTable)
          if (relatedTableInfo) continue
          relatedTableInfos.push({
            layer: relatedTable,
            enabled: true,
            addEnabled: layerInfo.addEnabled,
            updateEnabled: layerInfo.updateEnabled,
            deleteEnabled: layerInfo.deleteEnabled,
          })
        }
      }
      setEditorLayerInfos(layerInfos.concat(relatedTableInfos))
    })
  }, [canEditFeature, jimuMapView, liveDataEditing, mapViewsConfig, relatedRecords])

  React.useEffect(() => {
    updateEditorLayerInfos()
  }, [updateEditorLayerInfos])

  const updateEditorLayerInfosRef = hooks.useLatest(updateEditorLayerInfos)
  React.useEffect(() => {
    if (!jimuMapView?.view?.map?.layers) return
    const visibleChangedListener = () => {
      updateEditorLayerInfosRef.current()
    }
    let timer: number = null
    let lastLayerCount = jimuMapView.getAllJimuLayerViews().length
    const layersChangedListener = (jimuLayerView: JimuLayerView) => {
      if (jimuLayerView.fromRuntime) {
        updateEditorLayerInfosRef.current()
        return
      }
      if (timer) {
        window.clearTimeout(timer)
      }
      timer = window.setTimeout(() => {
        const currentLayerCount = jimuMapView.getAllJimuLayerViews().length
        if (currentLayerCount === lastLayerCount) return
        updateEditorLayerInfosRef.current()
        lastLayerCount = currentLayerCount
      }, 5000)
    }
    jimuMapView.addJimuLayerViewsVisibleChangeListener(visibleChangedListener)
    jimuMapView.addJimuLayerViewCreatedListener(layersChangedListener)
    jimuMapView.addJimuLayerViewRemovedListener(layersChangedListener)
    return () => {
      jimuMapView?.removeJimuLayerViewsVisibleChangeListener?.(visibleChangedListener)
      jimuMapView?.removeJimuLayerViewCreatedListener?.(layersChangedListener)
      jimuMapView?.removeJimuLayerViewRemovedListener?.(layersChangedListener)
    }
  }, [jimuMapView, updateEditorLayerInfosRef])

  const updateEditorByConfig = React.useCallback(async () => {
    const editorWidget = editorRef.current
    if (!editorWidget) return
    const {
      selfSnapping, featureSnapping, gridSnapping = false, defaultSelfEnabled, defaultFeatureEnabled, defaultGridEnabled = false, 
      snapSettingMode, defaultSnapLayers, tooltip, defaultTooltipEnabled = false, segmentLabel = true, defaultSegmentLabelEnabled = false,
      templateFilter, initialReshapeMode, batchEditing= false
    } = config
    try {
      editorWidget.tooltipOptions.enabled = defaultTooltipEnabled
      editorWidget.labelOptions.enabled = defaultSegmentLabelEnabled
      editorWidget.snappingOptions.enabled = defaultSelfEnabled || defaultFeatureEnabled || defaultGridEnabled
      editorWidget.snappingOptions.selfEnabled = defaultSelfEnabled
      editorWidget.snappingOptions.featureEnabled = defaultFeatureEnabled
      editorWidget.snappingOptions.gridEnabled = defaultGridEnabled && gridSnapping
      editorWidget.snappingOptions.featureSources = await SnappingUtils.getSnappingFeatureSourcesCollection(jimuMapView, defaultSnapLayers)
      const flexibleMode = snapSettingMode === SnapSettingMode.Flexible
      const snapOn = selfSnapping || featureSnapping || gridSnapping
      const snappingControlsOpen = flexibleMode && snapOn;
      (editorWidget.visibleElements as any).selectionToolbar = batchEditing
      editorWidget.visibleElements.snappingControls = snappingControlsOpen
      editorWidget.visibleElements.snappingControlsElements = {
        enabledToggle: selfSnapping || featureSnapping || gridSnapping,
        selfEnabledToggle: selfSnapping,
        featureEnabledToggle: featureSnapping,
        layerList: featureSnapping,
        layerListToggleLayersButton: featureSnapping,
        gridEnabledToggle: gridSnapping,
        gridControls: gridSnapping
      }
      editorWidget.visibleElements.tooltipsToggle = tooltip
      editorWidget.visibleElements.labelsToggle = segmentLabel
      const settingsOpen = snappingControlsOpen || tooltip || (segmentLabel && jimuMapView.view?.type === '3d')
      editorWidget.visibleElements.settingsMenu = settingsOpen
      editorWidget.supportingWidgetDefaults = {
        featureTemplates: {
          visibleElements: {
            filter: templateFilter
          }
        },
        sketch: {
          defaultUpdateOptions: {
            tool: initialReshapeMode ? 'reshape' : 'transform'
          }
        }
      }
    } catch (err) {
      console.warn('Failed updating editor widget config:', err)
    }
  }, [config, jimuMapView])

  const previousJimuMapView = hooks.usePrevious(jimuMapView)
  const previousConfig = hooks.usePrevious(config)

  const updateDataSource = React.useCallback(async (
    layer: __esri.SubtypeGroupLayer | __esri.FeatureLayer,
    event: __esri.SubtypeGroupLayerEditsEvent | __esri.FeatureLayerEditsEvent
  ) => {
    if (!editorRef.current?.viewModel.syncing) return
    const dsId = jimuMapView.getDataSourceIdByAPILayer(layer)
    const ds = getDataSourceById(dsId)
    if (!ds) return
    const objectIdField = layer.objectIdField
    const addIds = (event.addedFeatures || []).map(f => f.objectId)
    let addFeatures = []
    if (addIds.length > 0) {
      const addFeatureSet = await layer.queryFeatures({
        where: `${objectIdField} IN (${addIds.join(',')})`,
        outFields: ['*'],
        returnGeometry: false
      })
      addFeatures = addFeatureSet?.features || []
    }

    const updateIds = (event.updatedFeatures || []).map(f => f.objectId)
    let updateFeatures = []
    if (updateIds.length > 0) {
      const updateFeatureSet = await layer.queryFeatures({
        where: `${objectIdField} IN (${updateIds.join(',')})`,
        outFields: ['*'],
        returnGeometry: false
      })
      updateFeatures = updateFeatureSet?.features || []
    }
    const deleteFeatures = (event.deletedFeatures || []).map(f => new Graphic({attributes: {[objectIdField]: f.objectId}}))
    updateDataSourceAfterEdit(ds, { addFeatures, updateFeatures, deleteFeatures})
  }, [jimuMapView])

  // --- helper: wait until rootFeature.geometry exists (watch + timeout)
  const waitUntilGeometry = React.useCallback((vmAny: any, timeoutMs = 5000): Promise<__esri.Graphic | null> => {
    return new Promise(resolve => {
      if (!vmAny) return resolve(null)
      try {
        const rf = (vmAny?.activeWorkflow?.data as any)?.rootFeature
        if (rf?.geometry) {
          return resolve(rf)
        }
        const handle = reactiveUtils.watch(
          () => (vmAny?.activeWorkflow?.data as any)?.rootFeature?.geometry,
          (geom) => {
            if (geom) {
              try { handle.remove?.() } catch {}
              resolve((vmAny?.activeWorkflow?.data as any)?.rootFeature)
            }
          }
        )
        if (timeoutMs && typeof timeoutMs === 'number') {
          setTimeout(() => {
            try { handle.remove?.() } catch {}
            resolve(null)
          }, timeoutMs)
        }
      } catch (err) {
        console.warn('waitUntilGeometry error', err)
        resolve(null)
      }
    })
  }, [])

  // --- helper to compute zone value for a feature BEFORE it is sent to applyEdits
  // Replace this with your actual business logic. Can be sync or async.
  const computeZoneForFeature = (feature: any): any => {
    try {
      // Example: compute centroid's x coordinate and assign a zone string based on it.
      // This is only a placeholder. Replace with real logic (e.g. spatial lookup, service call).
      const geom = feature?.geometry
      if (!geom) return 'UNKNOWN'
      // simple centroid calculation for poly/point/extent-like inputs
      let x = 0, y = 0
      if (geom.x !== undefined && geom.y !== undefined) {
        x = geom.x; y = geom.y
      } else if (geom.centroid && geom.centroid.x !== undefined) {
        x = geom.centroid.x; y = geom.centroid.y
      } else if (geom.rings && geom.rings.length && geom.rings[0].length) {
        const ring = geom.rings[0][0]
        x = ring[0]; y = ring[1]
      }
      // simplistic zone assignment based on x
      if (x < -10000000) return 'ZONE_A'
      if (x < 0) return 'ZONE_B'
      return 'ZONE_C'
    } catch (err) {
      console.warn('computeZoneForFeature error', err)
      return 'UNKNOWN'
    }
  }

  // --- helper: enrich a feature with zone, zone2, supervisor and technician by querying configured layers
  const enrichFeatureWithZoneAndTech = async (feat: any): Promise<any> => {
    try {
      if (!feat || !feat.geometry) return feat

      // Read URLs / field mappings from config if available (best-effort)
      const svc = (config as any)?.serviceRequest || {}
      const zoneLayerUrl = svc?.ZoneLayer || svc?.zoneLayerUrl || null
      const zone2LayerUrl = svc?.Zone2Layer || svc?.zone2LayerUrl || null
      const technicianLayerUrl = svc?.TechnicianLayerURL || svc?.technicianLayerUrl || null

      // Field name mapping - try config.fieldInfo, else defaults
      const fieldInfo = (config as any)?.fieldInfo || {}
      const commonNameField = fieldInfo?.CommonField?.NAME || 'NAME'
      const zoneFieldName = fieldInfo?.CommonField?.ZONE || 'ZONE'
      const techSupervisorField = fieldInfo?.TechnicianFields?.SUPERVISOR || 'SUPERVISOR'
      const techNameField = fieldInfo?.TechnicianFields?.NAME || 'TECH_NAME' // default tech field name

      // set defaults on attributes
      if (!feat.attributes) feat.attributes = {}
      // If zone already set and non-null, don't overwrite
      const needZone = feat.attributes[zoneFieldName] === null || feat.attributes[zoneFieldName] === undefined

      // geometry-based query
      const q = {
        geometry: feat.geometry,
        spatialRelationship: 'intersects',
        outFields: ['*'],
        returnGeometry: false,
        where: '1=1'
      } as any

      // helper to query a url using FeatureLayer
// helper to query a url using FeatureLayer
const queryLayer = async (url?: string, geometry?: __esri.Geometry) => {
  if (!url) return null
  try {
    const fl = new FeatureLayer({ url }) as __esri.FeatureLayer

    // ensure geometry is in correct format
    let geom: any = null
    if (geometry) {
      // Esri geometry supports .toJSON()
      geom = (geometry as any).toJSON ? (geometry as any).toJSON() : geometry
    }

    const q = fl.createQuery()
    if (geom) {
      q.geometry = geom
      q.spatialRelationship = "intersects" // or contains/within, depending on use case
    }
    q.outFields = ["*"]

    const res = await fl.queryFeatures(q)
    if (res && res.features && res.features.length > 0) {
      return res.features
    }
    return null
  } catch (err) {
    console.warn('queryLayer error for url', url, err)
    return null
  }
}


      // Query zone layer if needed
      if (needZone && zoneLayerUrl) {
        const zoneResults = await queryLayer(zoneLayerUrl)
        if (zoneResults && zoneResults.length > 0) {
          const nameVal = zoneResults[0].attributes?.[commonNameField]
          if (nameVal) feat.attributes[zoneFieldName] = nameVal
        }
      }

      // Query zone2 (optional)
      if (zone2LayerUrl) {
        const zone2Results = await queryLayer(zone2LayerUrl)
        if (zone2Results && zone2Results.length > 0) {
          const z2 = zone2Results[0].attributes?.[commonNameField]
          if (z2) feat.attributes['ZONE2'] = z2
        }
      }

      // If configured to auto-assign technician by zone, query technician layer by zone value
      if (technicianLayerUrl) {
        // try by zone attribute (either just-set or existing)
        const zoneVal = feat.attributes[zoneFieldName]
        let techQuery = q
        if (zoneVal) {
          techQuery = {
            ...q,
            where: `${(fieldInfo?.CommonField?.ZONE || 'ZONE')}='${zoneVal}'`
          }
        }
        try {
          const techFl = new FeatureLayer({ url: technicianLayerUrl }) as __esri.FeatureLayer
          const techRes = await techFl.queryFeatures(techQuery)
          if (techRes && techRes.features && techRes.features.length > 0) {
            const r = techRes.features[0].attributes || {}
            if (r[techSupervisorField]) feat.attributes['SUPERVISOR'] = r[techSupervisorField]
            if (r[techNameField]) feat.attributes['ASSIGNEDTECH'] = r[techNameField]
          }
        } catch (err) {
          console.warn('technician layer query error', err)
        }
      }

      return feat
    } catch (err) {
      console.warn('enrichFeatureWithZoneAndTech error', err)
      return feat
    }
  }

  React.useEffect(() => {
    if (!jimuMapView || !editContainer.current) return
    if (!editorRef.current || jimuMapView !== previousJimuMapView) {
      destroyEditor()
      const container = document.createElement('div')
      container.className = 'h-100'
      editContainer.current.appendChild(container)
      editorRef.current = new Editor({
        container,
        view: jimuMapView.view
      })
      updateEditorByConfig()

      // attach reactive watch for rootFeature -> call onRootFeatureChange when it changes
      try {
        const vm = editorRef.current.viewModel

        // ----------------- rootFeature watch (log + callback) -----------------
        if (vm) {
          if (rootFeatureWatchRef.current) {
            try { rootFeatureWatchRef.current.remove?.() } catch {}
            rootFeatureWatchRef.current = null
          }
          rootFeatureWatchRef.current = reactiveUtils.watch(
            () => (vm?.activeWorkflow?.data as any)?.rootFeature,
            (rootFeature: __esri.Graphic | null) => {
              try {
                if (rootFeature) {
                  try {
                    const objectIdField = (rootFeature as any)?.attributes && Object.keys((rootFeature as any).attributes).find(k => /objectid/i.test(k))
                    const oidVal = objectIdField ? (rootFeature as any).attributes[objectIdField] : undefined
                    const uniqueKey = oidVal ?? (rootFeature as any)?.uid ?? JSON.stringify((rootFeature as any).geometry || {})
                    if (!loggedRootFeatureIdsRef.current.has(uniqueKey)) {
                      loggedRootFeatureIdsRef.current.add(uniqueKey)
                      console.log('Editor rootFeature changed -> attributes:', (rootFeature as any).attributes)
                      console.log('Editor rootFeature changed -> geometry:', (rootFeature as any).geometry)
                    }
                  } catch (logErr) {
                    console.warn('Error logging rootFeature contents', logErr)
                  }
                }

                if (typeof onRootFeatureChange === 'function') {
                  try { onRootFeatureChange(rootFeature) } catch (cbErr) { console.warn('onRootFeatureChange callback error:', cbErr) }
                }
              } catch (cbErr) {
                console.warn('rootFeature watch handler error:', cbErr)
              }
            },
            { initial: true }
          )
        }

        // ----------------- editor create event (wait-for-geometry + log + callback) -----------------
        if (createHandleRef.current) {
          try { createHandleRef.current.remove?.() } catch {}
          createHandleRef.current = null
        }

        const waitAndLogRootFeature = async (vmAny: any, tag = 'create') => {
          try {
            if (!vmAny) return
            const rf = (vmAny?.activeWorkflow?.data as any)?.rootFeature
            if (rf && rf.geometry) {
              const objectIdField = rf?.attributes && Object.keys(rf.attributes).find((k: string) => /objectid/i.test(k))
              const oidVal = objectIdField ? rf.attributes[objectIdField] : undefined
              const uniqueKey = oidVal ?? (rf as any)?.uid ?? JSON.stringify(rf.geometry || {})
              if (!loggedRootFeatureIdsRef.current.has(uniqueKey)) {
                loggedRootFeatureIdsRef.current.add(uniqueKey)
                console.log(`[Editor][${tag}] rootFeature (immediate) -> attributes:`, rf.attributes)
                console.log(`[Editor][${tag}] rootFeature (immediate) -> geometry:`, rf.geometry)
              }
              return
            }
            const rf2 = await waitUntilGeometry(vmAny)
            if (rf2) {
              const objectIdField = rf2?.attributes && Object.keys(rf2.attributes).find((k: string) => /objectid/i.test(k))
              const oidVal = objectIdField ? rf2.attributes[objectIdField] : undefined
              const uniqueKey = oidVal ?? (rf2 as any)?.uid ?? JSON.stringify(rf2.geometry || {})
              if (!loggedRootFeatureIdsRef.current.has(uniqueKey)) {
                loggedRootFeatureIdsRef.current.add(uniqueKey)
                console.log(`[Editor][${tag}] rootFeature (when) -> attributes:`, rf2.attributes)
                console.log(`[Editor][${tag}] rootFeature (when) -> geometry:`, rf2.geometry)
              }
            } else {
              console.warn(`[Editor][${tag}] rootFeature did not appear with geometry within wait period`)
            }
          } catch (err) {
            console.warn('[Editor] waitAndLogRootFeature error:', err)
          }
        }

        try {
          createHandleRef.current = (editorRef.current as any).on?.('create', (evt: any) => {
            try {

              if (evt?.graphic) {
                try {
                  const g = evt.graphic as any
                  const objectIdField = g?.attributes && Object.keys(g.attributes).find((k: string) => /objectid/i.test(k))
                  const oidVal = objectIdField ? g.attributes[objectIdField] : undefined
                  const uniqueKey = oidVal ?? g?.uid ?? JSON.stringify(g.geometry || {})
                  if (!loggedRootFeatureIdsRef.current.has(uniqueKey)) {
                    loggedRootFeatureIdsRef.current.add(uniqueKey)
                    console.log('create event graphic attributes:', g.attributes)
                    console.log('create event graphic geometry:', g.geometry)
                  }
                } catch (gErr) {
                  console.warn('Error logging evt.graphic', gErr)
                }
                if (typeof onCreateFeature === 'function') {
                  try { onCreateFeature(evt) } catch (cbErr) { console.warn('onCreateFeature callback error:', cbErr) }
                }
                const vmAny = editorRef.current?.viewModel
                waitAndLogRootFeature(vmAny, 'create-after-evtGraphic')
                return
              }

              const vmAny = editorRef.current?.viewModel
              waitAndLogRootFeature(vmAny, 'create')

              if (typeof onCreateFeature === 'function') {
                try { onCreateFeature(evt) } catch (cbErr) { console.warn('onCreateFeature callback error:', cbErr) }
              }
            } catch (logErr) {
              console.warn('Error in create event handler:', logErr)
            }
          })
        } catch (attachErr) {
          console.warn('Failed to attach create handler on editor', attachErr)
        }

      } catch (watchErr) {
        console.warn('Failed to create rootFeature watch or attach create handler:', watchErr)
      }
    } else if (config !== previousConfig) {
      updateEditorByConfig()
    }
  }, [config, destroyEditor, editContainer, jimuMapView, previousConfig, previousJimuMapView, updateEditorByConfig, onRootFeatureChange, onCreateFeature, waitUntilGeometry])

  React.useEffect(() => {
    const editorWidget = editorRef.current
    if (!editorWidget) return
    const handles: __esri.Handle[] = []
    for (const layerInfo of editorLayerInfos) {
      if (!layerInfo.enabled) continue
      const editorLayer = layerInfo.layer
      if (editorLayer.type === 'subtype-sublayer') {
        const subtypeGrouplayer = editorLayer.parent
        const handle = subtypeGrouplayer?.on('edits', (event) => {
          updateDataSource(subtypeGrouplayer, event)
        })
        handles.push(handle)

        // --- patch applyEdits on parent (subtype group) so we can modify features BEFORE applyEdits runs
        try {
          //call a method which will give me data source by layer
          const layerKey = (subtypeGrouplayer as any)?.uid || (subtypeGrouplayer as any)?.id || Math.random().toString(36).slice(2)
          if (!(origApplyEditsMapRef.current.has(layerKey)) && (subtypeGrouplayer as any)?.applyEdits) {
            const original = (subtypeGrouplayer as any).applyEdits.bind(subtypeGrouplayer)
            origApplyEditsMapRef.current.set(layerKey, { layer: subtypeGrouplayer, original })
            ;(subtypeGrouplayer as any).applyEdits = async (params: any) => {
              try {
                // make modifyFeature async so we can await enrichment
                const modifyFeatureAsync = async (feat: any) => {
                  if (!feat) return feat
                  if (!feat.attributes) feat.attributes = {}

                  // keep original zone logic as fallback if enrichment fails or not configured
                  const hasZoneAttr = feat.attributes.ZONE !== null && feat.attributes.ZONE !== undefined
                  if (!hasZoneAttr) {
                    // try spatial/enrichment based on configured layers
                    try {
                      feat = await enrichFeatureWithZoneAndTech(feat)
                    } catch (e) {
                      console.warn('enrichment failed, falling back to computeZoneForFeature', e)
                      feat.attributes.ZONE = computeZoneForFeature(feat)
                    }
                  } else {
                    // if zone already present still try to fill supervisor/technician if missing
                    const needTech = feat.attributes.ASSIGNEDTECH === null || feat.attributes.ASSIGNEDTECH === undefined
                    const needSupervisor = feat.attributes.SUPERVISOR === null || feat.attributes.SUPERVISOR === undefined
                    if ((needTech || needSupervisor)) {
                      try {
                        feat = await enrichFeatureWithZoneAndTech(feat)
                      } catch (e) {
                        console.warn('enrichment failed for tech fields', e)
                      }
                    }
                  }
                  return feat
                }

                if (params?.addFeatures?.length) {
                  const promises = params.addFeatures.map((f: any) => modifyFeatureAsync(f))
                  params.addFeatures = await Promise.all(promises)
                }
                if (params?.updateFeatures?.length) {
                  const promises = params.updateFeatures.map((f: any) => modifyFeatureAsync(f))
                  params.updateFeatures = await Promise.all(promises)
                }

                // --- validation: prevent applyEdits if required fields missing on any feature
                try {
                  const invalids: Array<{ op: string; index: number; missing: string[] }>= []
                  if (params?.addFeatures?.length) {
                    params.addFeatures.forEach((f: any, idx: number) => {
                      const v = validateFeatureAttributes(f, subtypeGrouplayer)
                      if (!v.valid) invalids.push({ op: 'add', index: idx, missing: v.missing })
                    })
                  }
                  if (params?.updateFeatures?.length) {
                    params.updateFeatures.forEach((f: any, idx: number) => {
                      const v = validateFeatureAttributes(f, subtypeGrouplayer)
                      if (!v.valid) invalids.push({ op: 'update', index: idx, missing: v.missing })
                    })
                  }
                  if (invalids.length) {
                    const msg = invalids.map(i => `${i.op}[${i.index}]: ${i.missing.join(',')}`).join('; ')
                    console.warn('Validation failed - required fields missing for features:', msg)
                    // reject so applyEdits is not called
                    return Promise.reject(new Error(`Validation failed - required fields missing: ${msg}`))
                  }
                } catch (valErr) {
                  console.warn('Validation check error (subtype group):', valErr)
                }

              } catch (err) {
                console.warn('applyEdits wrapper error (subtype group):', err)
              }
              return original(params)
            }
          }
        } catch (patchErr) {
          console.warn('Failed to patch applyEdits for subtype group layer', patchErr)
        }

      } else {
        const featureLayer = editorLayer as unknown as __esri.FeatureLayer
        const handle = featureLayer.on('edits', (event) => {
          updateDataSource(featureLayer, event)
        })
        handles.push(handle)

        // --- patch applyEdits on feature layer so we can modify features BEFORE applyEdits runs
        try {
          const layerKey = (featureLayer as any)?.uid || (featureLayer as any)?.id || Math.random().toString(36).slice(2)
          if (!(origApplyEditsMapRef.current.has(layerKey)) && (featureLayer as any)?.applyEdits) {
            const original = (featureLayer as any).applyEdits.bind(featureLayer)
            origApplyEditsMapRef.current.set(layerKey, { layer: featureLayer, original })
            ;(featureLayer as any).applyEdits = async (params: any) => {
              try {
                // async modifier that tries enrichFeatureWithZoneAndTech first
                const modifyFeatureAsync = async (feat: any) => {
                  if (!feat) return feat
                  if (!feat.attributes) feat.attributes = {}
                  const hasZone = feat.attributes.ZONE !== null && feat.attributes.ZONE !== undefined
                  if (!hasZone) {
                    try {
                      // attempt async enrichment which may query zone/technician layers
                      feat = await enrichFeatureWithZoneAndTech(feat)
                      return feat
                    } catch (e) {
                      console.warn('enrichFeatureWithZoneAndTech failed, falling back to computeZoneForFeature', e)
                      try {
                        feat.attributes.ZONE = computeZoneForFeature(feat)
                      } catch (ce) {
                        console.warn('computeZoneForFeature fallback failed', ce)
                      }
                      return feat
                    }
                  }
                  // if zone exists, still try to enrich tech/supervisor if missing
                  const needTech = feat.attributes.ASSIGNEDTECH === null || feat.attributes.ASSIGNEDTECH === undefined
                  const needSupervisor = feat.attributes.SUPERVISOR === null || feat.attributes.SUPERVISOR === undefined
                  if (needTech || needSupervisor) {
                    try {
                      feat = await enrichFeatureWithZoneAndTech(feat)
                    } catch (e) {
                      console.warn('enrichFeatureWithZoneAndTech (tech) failed', e)
                    }
                  }
                  return feat
                }

                if (params?.addFeatures?.length) {
                  const promises = params.addFeatures.map((f: any) => modifyFeatureAsync(f))
                  params.addFeatures = await Promise.all(promises)
                }
                if (params?.updateFeatures?.length) {
                  const promises = params.updateFeatures.map((f: any) => modifyFeatureAsync(f))
                  params.updateFeatures = await Promise.all(promises)
                }

                // --- validation: prevent applyEdits if required fields missing on any feature
                try {
                  const invalids: Array<{ op: string; index: number; missing: string[] }>= []
                  if (params?.addFeatures?.length) {
                    params.addFeatures.forEach((f: any, idx: number) => {
                      const v = validateFeatureAttributes(f, featureLayer)
                      if (!v.valid) invalids.push({ op: 'add', index: idx, missing: v.missing })
                    })
                  }
                  if (params?.updateFeatures?.length) {
                    params.updateFeatures.forEach((f: any, idx: number) => {
                      const v = validateFeatureAttributes(f, featureLayer)
                      if (!v.valid) invalids.push({ op: 'update', index: idx, missing: v.missing })
                    })
                  }
                  if (invalids.length) {
                    const msg = invalids.map(i => `${i.op}[${i.index}]: ${i.missing.join(',')}`).join('; ')
                    console.warn('Validation failed - required fields missing for features:', msg)
                    // reject so applyEdits is not called
                    return Promise.reject(new Error(`Validation failed - required fields missing: ${msg}`))
                  }
                } catch (valErr) {
                  console.warn('Validation check error (feature layer):', valErr)
                }

                // if your zone computation is synchronous the above will still work
              } catch (err) {
                console.warn('applyEdits wrapper error (feature layer):', err)
              }
              return original(params)
            }
          }
        } catch (patchErr) {
          console.warn('Failed to patch applyEdits for feature layer', patchErr)
        }
      }
    }
    editorWidget.layerInfos = editorLayerInfos
    editorWidget.visibleElements.editFeaturesSection = showUpdateBtn
    return () => {
      for (const handle of handles) {
        try { handle.remove?.() } catch {}
      }
      // restore patched applyEdits for layers that were only in this render
      try {
        for (const [key, { layer, original }] of origApplyEditsMapRef.current) {
          // if the layer is no longer in editorLayerInfos restore and remove from map
          const stillPresent = editorLayerInfos.some(li => (li.layer as any)?.uid === (layer as any)?.uid || (li.layer as any)?.id === (layer as any)?.id)
          if (!stillPresent) {
            try { (layer as any).applyEdits = original } catch {}
            origApplyEditsMapRef.current.delete(key)
          }
        }
      } catch (restoreErr) {
        console.warn('Error while restoring applyEdits in cleanup:', restoreErr)
      }
    }
  }, [editorLayerInfos, showUpdateBtn, updateDataSource])

  // --- validation helpers: determine required fields from layer.fields and validate a feature's attributes
  const getRequiredFieldNames = (layer: any): string[] => {
    try {
      const fields = (layer && (layer.fields || (layer?.layer?.fields))) || []
      return fields
        .filter((f: any) => f && f.name && f.nullable === false && !/objectid/i.test(f.name))
        .map((f: any) => f.name)
    } catch (err) {
      console.warn('getRequiredFieldNames error', err)
      return []
    }
  }

  const validateFeatureAttributes = (feat: any, layer: any): { valid: boolean; missing: string[] } => {
    try {
      const missing: string[] = []
      const required = getRequiredFieldNames(layer)
      if (!required || required.length === 0) return { valid: true, missing }
      const attrs = feat?.attributes || {}
      for (const rn of required) {
        const val = attrs[rn]
        if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) {
          missing.push(rn)
        }
      }
      return { valid: missing.length === 0, missing }
    } catch (err) {
      console.warn('validateFeatureAttributes error', err)
      return { valid: true, missing: [] }
    }
  }

  return editorRef.current
}

export default useEditor
