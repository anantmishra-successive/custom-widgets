/** @jsx jsx */
import { React, dataSourceUtils, type FeatureDataRecord } from 'jimu-core'
import FeatureForm from 'esri/widgets/FeatureForm'
import type FormTemplate from 'esri/form/FormTemplate'
import Graphic from 'esri/Graphic'
import FeatureLayer from 'esri/layers/FeatureLayer'
import Query from 'esri/rest/support/Query'
import { getTimezone } from './utils'
import { getDataSourceById, getEditDataSource, getFlatFormElements } from '../../utils'
import { FormChangeType } from './feature-form-component'

interface UseFeatureFormOptions {
  activeId: string
  activeLayer: __esri.SubtypeSublayer | __esri.FeatureLayer
  sourceVersion: number
  activeFeature: FeatureDataRecord['feature']
  formTemplate: FormTemplate
  editContainer: React.RefObject<HTMLDivElement>
  onValueChange: (change: FormChangeType, submittable: boolean) => void,
  zoneLayerUrl?: string
}

// New helper: load layer (URL or layer object), extract codedValues and append to FeatureForm
export async function appendCodedValuesToForm(layerOrUrl: string | __esri.FeatureLayer | __esri.SubtypeSublayer, featureForm: __esri.FeatureForm) {
  try {
    if (!featureForm || !featureForm.viewModel) return

    // obtain a Layer object
    let layerObj: __esri.FeatureLayer | __esri.SubtypeSublayer
    if (typeof layerOrUrl === 'string') {
      layerObj = new FeatureLayer({ url: layerOrUrl }) as any
      await layerObj.load()
    } else {
      layerObj = layerOrUrl
      if (layerObj.loadStatus !== 'loaded' && layerObj.load) {
        await layerObj.load()
      }
    }

    const fields = (layerObj && (layerObj as any).fields) || []
    if (!fields || fields.length === 0) return

    const codedMap: Record<string, Array<{ name: string; code: any }>> = {}
    for (const f of fields) {
      const domain = (f as any).domain
      const coded = domain && (domain.codedValues || domain.codedValues === 0 ? domain.codedValues : null)
      if (Array.isArray(coded) && coded.length > 0) {
        codedMap[f.name] = coded.map((cv: any) => ({ name: cv.name, code: cv.code }))
      }
    }

    if (Object.keys(codedMap).length === 0) return

    // clone the template and append coded values to matching field elements
    const vm: any = featureForm.viewModel
    const tmpl: any = vm.formTemplate
    if (!tmpl) return
    const cloned = tmpl.clone ? tmpl.clone() : Object.assign({}, tmpl)
    const elements = (cloned.elements || []).map((el: any) => {
      if (el && el.type === 'field' && el.fieldName && codedMap[el.fieldName]) {
        const cvs = codedMap[el.fieldName]
        // attach domain codedValues
        el.domain = el.domain || {}
        el.domain.codedValues = cvs
        // set editor to select with choices so FeatureForm renders a dropdown
        el.editor = el.editor || {}
        el.editor.type = 'select'
        el.editor.options = el.editor.options || {}
        el.editor.options.choices = cvs.map((c: any) => ({ label: c.name, value: c.code }))
      }
      return el
    })
    cloned.elements = elements

    // apply cloned template back to featureForm viewModel
    try {
      // preferred: set via viewModel if supported
      if (vm.set) {
        vm.set('formTemplate', cloned)
      } else {
        vm.formTemplate = cloned
      }
    } catch (e) {
      // fallback: try directly assigning on featureForm
      try { (featureForm as any).formTemplate = cloned } catch (err) { /* ignore */ }
    }
  } catch (err) {
    console.error('appendCodedValuesToForm error:', err)
  }
}

// Helper: spatially query a zone layer by a feature's geometry and return the first matching zone name
export async function getZoneNameByGeometry(feature: __esri.Graphic, zoneLayerUrl: string): Promise<string | null> {
  try {
    if (!feature || !feature.geometry || !zoneLayerUrl) return null

    const zoneLayer = new FeatureLayer({ url: zoneLayerUrl, outFields: ['*'] })
    await zoneLayer.load()

    const query = new Query({
      geometry: feature.geometry,
      spatialRelationship: 'intersects',
      outFields: ['*'],
      returnGeometry: false
    })

    const results = await zoneLayer.queryFeatures(query)
    if (!results || !results.features || results.features.length === 0) return null

    const attrs = results.features[0].attributes || {}
    const candidateFields = ['NAME', 'Name', 'name', 'ZONE', 'Zone', 'zone_name', 'ZONE_NAME', 'ZoneName']
    for (const f of candidateFields) {
      if (Object.prototype.hasOwnProperty.call(attrs, f) && attrs[f] != null) {
        return String(attrs[f])
      }
    }

    // fallback: return the first attribute value as string
    const firstKey = Object.keys(attrs)[0]
    return firstKey ? (attrs[firstKey] != null ? String(attrs[firstKey]) : null) : null
  } catch (err) {
    console.error('getZoneNameByGeometry error:', err)
    return null
  }
}

const useFeatureForm = (options: UseFeatureFormOptions) => {
  console.log('useFeatureForm -> options:', options);
  const { activeId, activeLayer, activeFeature, sourceVersion, formTemplate, editContainer, onValueChange } = options

  const featureForm = React.useRef<FeatureForm>(null)
  const destroyFeatureForm = React.useCallback(() => {
    if (featureForm.current?.destroy && !featureForm.current?.destroyed) {
      featureForm.current.destroy()
    }
  }, [])
  const renderFeatureForm = React.useCallback(async () => {
    console.log('renderFeatureForm called');
    try {
      destroyFeatureForm()
      const ds = getDataSourceById(activeId)
      const dataSource = getEditDataSource(ds)
      const container = document && document.createElement('div')
      editContainer.current.appendChild(container)
      let feature: __esri.Graphic
      if (!activeFeature) {
        feature = new Graphic({ layer: activeLayer })
      } else {
        const objectIdField = dataSource.getIdField() || 'OBJECTID'
        const recordQuery = `${objectIdField} IN (${activeFeature.attributes[objectIdField]})`
        const result = await dataSource.query({
          where: recordQuery,
          returnGeometry: true,
          notAddFieldsToClient: true,
          outFields: ['*']
        })
        const fullRecord = result?.records?.[0] as FeatureDataRecord
        if (!fullRecord) return
        feature = await dataSourceUtils.changeToJSAPIGraphic(fullRecord.feature)
      }
      const originFields = activeLayer.fields
      if (!originFields || activeLayer.loadStatus !== 'loaded') {
        // For arcade data source, the layer's fields may be filtered by the arcade script.
        // If the layer is not loaded, the FeatureForm will load the layer and the fields will be all fields.
        // So we need to load the layer first and then set the original fields back to the layer.
        await activeLayer.load()
        if (originFields && originFields.length > 0) {
          activeLayer.set({'fields': originFields})
        }
      }
      featureForm.current = new FeatureForm({
        container: container,
        feature,
        layer: activeLayer,
        formTemplate,
        timeZone: getTimezone(dataSource)
      })

      // append coded values if present on the layer
      try {
        await appendCodedValuesToForm(activeLayer, featureForm.current)
      } catch (e) {
        console.warn('appendCodedValuesToForm failed:', e)
      }

      featureForm.current.on('value-change', (changedValue) => {
        const idField = dataSource.getIdField()
        const { fieldName } = changedValue
        // Exclude cases where the 'value-change' is caused by dataSource select.
        // If the changed field has an idField, the change is caused by dataSource select change.
        if (fieldName === idField) return
        const submittable = featureForm.current.viewModel.submittable
        const originalFormValues = feature.attributes
        const newFormValues = featureForm.current.viewModel.getValues()
        let change: FormChangeType = null
        if (newFormValues) {
          const arcadeFields = getFlatFormElements(featureForm.current.viewModel.formTemplate?.elements || [])
            .map(e => e.type === 'field' && e.valueExpression && e.fieldName).filter(v => !!v) || []
          for (const key in newFormValues) {
            if (originalFormValues?.[key] !== newFormValues[key]) {
              const isArcade = arcadeFields.includes(key)
              if (isArcade && !change) {
                change = FormChangeType.Arcade
              }
              if (!isArcade) {
                change = FormChangeType.Normal
              break
              }
            }
          }
        }
        onValueChange(change, submittable)
      })
    } catch (err) {
      console.error(err)
    }
  }, [activeFeature, activeId, activeLayer, destroyFeatureForm, editContainer, formTemplate, onValueChange])

  const timer = React.useRef<number>(null)
  React.useEffect(() => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      if (activeId && activeLayer && editContainer.current) {
        renderFeatureForm()
      } else {
        destroyFeatureForm()
      }
    }, 500)
  }, [activeId, activeLayer, sourceVersion, editContainer, destroyFeatureForm, renderFeatureForm])

  // JSAPI bug: FeatureForm's value-change not work for the first time due to deps loading.
  // Below code load the deps in advance to avoid the bug.
  React.useEffect(() => {
    const featureForm = new FeatureForm()
    featureForm.destroy()
  }, [])

  return featureForm
}

export default useFeatureForm
