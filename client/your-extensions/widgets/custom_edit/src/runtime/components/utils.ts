import {
  React, dataSourceUtils, esri, type ImmutableArray, privilegeUtils, ServiceManager, SessionManager,
  type SubtypeSublayerDataSource, type ArcGISQueriableDataSource,  type FeatureDataRecord,
  type FeatureLayerDataSource, type DataSource, ExBAddedJSAPIProperties
} from 'jimu-core'
import type { JimuMapView, JimuLayerView } from 'jimu-arcgis'
import type { IItem } from '@esri/arcgis-rest-portal'
import Query from 'esri/rest/support/Query'
import FieldElement from 'esri/form/elements/FieldElement'
import GroupElement from 'esri/form/elements/GroupElement'
import FormTemplate from 'esri/form/FormTemplate'
import { type LayersConfig, type TreeFields, LayerHonorModeType } from '../../config'
import { type SupportedLayer, type SupportedDataSource, constructConfig, getEditDataSource, getDataSourceById, getEditHiddenFields, getDsPrivileges } from '../../utils'
import type { LayerInfo } from './feature-form-component'

export const classNameMap = {
  base: 'esri-item-list',
  widget: 'esri-widget',
  header: 'esri-editor__header',
  formHeader: 'esri-feature-form__form-header',
  description: 'esri-feature-form__description-text',
  buttonDisabled: 'esri-button--disabled',
  heading: 'esri-widget__heading',
  featureForm: 'esri-feature-form',
  scroller: 'esri-editor__scroller',
  content: 'esri-editor__content',
  list: 'esri-item-list__list',
  group: 'esri-item-list__group',
  noMatchesMessage: 'esri-item-list__no-matches-message',
  itemLabel: 'esri-item-list__list-item-label',
  itemContainer: 'esri-item-list__list-item-container',
  item: 'esri-item-list__list-item',
  groupHeader: 'esri-item-list__group-header',
  backButton: 'esri-editor__back-button',

  widgetHeading: 'esri-widget__heading',
  warningOption: 'esri-editor__warning-option',
  warningOptionPrimary: 'esri-editor__warning-option--primary',
  warningOptionPositive: 'esri-editor__warning-option--positive',

  promptDanger: 'esri-editor__prompt--danger',
  promptHeader: 'esri-editor__prompt__header',
  promptHeaderHeading: 'esri-editor__prompt__header__heading',
  promptMessage: 'esri-editor__prompt__message',
  promptDivider: 'esri-editor__prompt__divider',
  promptActions: 'esri-editor__prompt__actions',
}

export interface EditFeatures {
  [dsId: string]: FeatureDataRecord[]
}

export const flatMapArray = (editFeatures: EditFeatures) => {
  // flat editFeatures
  const flatEditFeatures: FeatureDataRecord[] = []
  for (const dsId in editFeatures) {
    if (editFeatures?.[dsId]) {
      flatEditFeatures.push(...editFeatures[dsId])
    }
  }
  return flatEditFeatures
}

export const flatMapArrayWithView = (editFeatures: EditFeatures, jimuMapView: JimuMapView) => {
  const flatEditFeatures: FeatureDataRecord[] = []
  const mapDsId = jimuMapView?.dataSourceId
  for (const dsId in editFeatures) {
    if (dsId.indexOf(mapDsId) === 0 && editFeatures?.[dsId]) {
      flatEditFeatures.push(...editFeatures[dsId])
    }
  }
  return flatEditFeatures
}

export function isEditableLayerView (
  layerView: JimuLayerView,
  customizeLayers: boolean,
  customJimuLayerViewIds: ImmutableArray<string>,
  liveDataEditing: boolean
) {
  const layer = layerView.layer
  const hasUrl = !!layer.url
  const isDrawMeasurements = layer.id.toString().includes('jimu-draw-measurements-layer')
  const notEditable = layer[ExBAddedJSAPIProperties.EXB_NOT_EDITABLE]
  const isFromRuntime = layerView.fromRuntime
  let shouldShow = true
  if (isFromRuntime) {
    shouldShow = liveDataEditing
  } else {
    shouldShow = customizeLayers ? customJimuLayerViewIds.includes(layerView.id) : true
  }
  const isVisible = layerView.isLayerVisible()
  return hasUrl && !isDrawMeasurements && !notEditable && shouldShow && isVisible
}

export const getDsAccessibleInfo = async (url: string) => {
  if (!url) return false
  const request = esri.restRequest.request
  try {
    const info = await request(`${url}?f=json`)
    if (Object.keys(info).includes('error')) {
      return false
    } else {
      return true
    }
  } catch (err) {
    return false
  }
}

export const getPrivilege = async () => {
  const exbAccess = await privilegeUtils.checkExbAccess(privilegeUtils.CheckTarget.Experience)
  return exbAccess?.capabilities?.canEditFeature
}

export const getIsAdvancedPermission = async (dataSource: SupportedDataSource): Promise<boolean> => {
  const layerItemInfo = await dataSource?.fetchItemInfo().then((info: IItem) => {
    return info
  }).catch(err => {
    console.error(err)
  })
  if (!layerItemInfo || !layerItemInfo.url) return false
  // user is admin/owner, or user and item are in the same update org
  // If there is no portalUrl, it means it's non-hosted (sampleServer6)
  const portalUrl = (await ServiceManager.getInstance().fetchArcGISServerInfo(layerItemInfo.url))?.owningSystemUrl
  if (!portalUrl) return false
  const sessionForItem = SessionManager.getInstance().getSessionByUrl(portalUrl)
  // If there is no session, it means there was no pop-up login
  if (!sessionForItem) return false
  const user = await sessionForItem.getUser()
  const isAdmin = user?.role === 'org_admin'
  const isOrgItem = layerItemInfo?.isOrgItem
  // Grants the ability to update and categorize content in the organization and edit hosted feature layers in your organization.
  const hasUpdateItems = (user?.privileges || []).includes('portal:admin:updateItems')
  const allowAdminEdit = isAdmin && isOrgItem && hasUpdateItems
  const isOwner = layerItemInfo.owner === user?.username
  const isInUpdatedGroup = await privilegeUtils.isItemInTheUpdatedGroup(layerItemInfo.id, sessionForItem)
  return allowAdminEdit || isOwner || isInUpdatedGroup
}

export const getTimezone = (dataSource: SupportedDataSource) => {
  return dataSourceUtils.getTimezoneAPIFromRuntime(dataSource.getTimezone())
}

export const idsArrayEquals = (selection: ImmutableArray<string> | string[], preSelection: ImmutableArray<string> | string[]) => {
  return Array.isArray(selection) &&
    Array.isArray(preSelection) &&
    selection.length === preSelection.length &&
    selection.every((v, i) => preSelection[i] === v)
}

export const getDisplayField = (dataSource: SupportedDataSource) => {
  const layerDefinition = dataSource?.getLayerDefinition()
  const belongToLayerDefinition = (dataSource.belongToDataSource as ArcGISQueriableDataSource)?.getLayerDefinition()
  const displayField = layerDefinition?.displayField ||
    belongToLayerDefinition?.displayField ||
    layerDefinition?.objectIdField ||
    belongToLayerDefinition?.objectIdField ||
    'OBJECTID'
  return displayField
}

export const constructUneditableInfo = (layer: SupportedLayer) => {
  return {
    layer,
    enabled: false,
    addEnabled: false,
    updateEnabled: false,
    deleteEnabled: false,
    attributeUpdatesEnabled: false,
    geometryUpdatesEnabled: false,
    attachmentsOnUpdateEnabled: false,
  } as __esri.EditorLayerInfo
}

export const constructFormElements = (groupedFields: TreeFields[], hiddenFields: string[], fieldElements: __esri.FieldElement[]): Array<FieldElement | GroupElement> => {
  const elements = groupedFields.filter(f => !hiddenFields.includes(f.jimuName)).map(item => {
    if (item.children) {
      return new GroupElement({
        label: item.name,
        description: item.subDescription || item?.description,
        elements: item.children.filter(f => !hiddenFields.includes(f.jimuName)).map(ele => {
          return new FieldElement({
            fieldName: ele.jimuName,
            label: ele.alias || ele.name,
            description: ele.subDescription || ele.description,
            editableExpression: ele.editAuthority ? 'true' : 'false'
          })
        })
      })
    } else {
      const existElement = fieldElements.find(e => e.fieldName === item.jimuName)
      const fieldElement = existElement ? existElement.clone() : new FieldElement({
        fieldName: item.jimuName,
        label: item?.alias || item?.name
      })
      fieldElement.description = item.subDescription || item?.description
      fieldElement.editableExpression = item.editAuthority && !fieldElement.valueExpression ? 'true' : 'false'
      return fieldElement
    }
  })
  return elements
}

const constructFormTemplate = (
  editorUseLayer: __esri.FeatureLayer | __esri.SubtypeSublayer,
  layerConfig: LayersConfig,
  relatedRecords: boolean,
  hiddenFields: string[]
) => {
  const { groupedFields, layerHonorMode } = layerConfig
  const originalFormTemplate = editorUseLayer.formTemplate
  const editorFormTemplate: FormTemplate = originalFormTemplate ? originalFormTemplate.clone() : new FormTemplate()
  const fieldElements = (originalFormTemplate?.elements || []).filter(e => e.type === 'field')
  if (layerHonorMode === LayerHonorModeType.Custom) {
    editorFormTemplate.elements = constructFormElements(groupedFields, hiddenFields, fieldElements)
  }
  if (!relatedRecords && editorFormTemplate.elements) {
    for (const element of editorFormTemplate.elements) {
      if (element.type === 'relationship') {
        element.editableExpression = 'false'
      }
    }
  }
  editorFormTemplate.title = originalFormTemplate?.title || editorUseLayer.title
  return editorFormTemplate
}

export const queryFullFeatures = async (jimuMapView: JimuMapView, features: EditFeatures) => {
  const promises: Array<Promise<__esri.FeatureSet>> = []
  for (const dsId in features) {
    const ds = getDataSourceById(dsId)
    const dataSource = getEditDataSource(ds)
    const objectIdField = dataSource.getIdField()
    const layerFeaturesArray = features[dsId]
    if (layerFeaturesArray?.length > 0) {
      const selectedQuery = `${objectIdField} IN (${features[dsId]
        .map(record => {
          const activeGraphic = (record)?.feature as __esri.Graphic
          return activeGraphic.attributes[objectIdField]
        })
        .join()})`
      const jimuLayerView = jimuMapView.getJimuLayerViewByDataSourceId(dsId)
      const currentEditLayer = jimuLayerView?.layer
      if (!currentEditLayer) continue
      const query = new Query({
        where: selectedQuery,
        outFields: ['*'],
        returnGeometry: true
      })
      promises.push(currentEditLayer.queryFeatures(query))
    }
  }
  const results = await Promise.all(promises)
  const fullFeatures = results.reduce<__esri.Graphic[]>((prev, cur) => {
    if (Array.isArray(cur.features)) {
      return prev.concat(cur.features)
    } else {
      return prev
    }
  }, [])
  return fullFeatures
}

export const getEditorLayerInfo = async (
  dataSource: FeatureLayerDataSource | SubtypeSublayerDataSource,
  layerConfig: LayersConfig,
  jimuLayerView: JimuLayerView,
  relatedRecords: boolean,
  canEditFeature: boolean
) => {
  let showUpdateBtn = false
  let editorLayerInfo: __esri.EditorLayerInfo
  const editorUseLayer = jimuLayerView.layer as __esri.FeatureLayer | __esri.SubtypeSublayer
  const fullEditingPrivileges = (editorUseLayer as any)?.userHasFullEditingPrivileges
  const isAdvancedPermission = await getIsAdvancedPermission(dataSource)
  const layerEditingEnabled = editorUseLayer.editingEnabled
  let editorLayerConfig = layerConfig
  if (!editorLayerConfig) {
    editorLayerConfig = constructConfig(dataSource, editorUseLayer)
  }
  const layerDefinition = dataSource.getLayerDefinition()
  const hiddenFields = getEditHiddenFields(layerDefinition)
  const usedFormTemplate = constructFormTemplate(editorUseLayer, editorLayerConfig, relatedRecords, hiddenFields)
  if (isAdvancedPermission || fullEditingPrivileges) {
    showUpdateBtn = true
    editorLayerInfo = {
      layer: editorUseLayer,
      formTemplate: usedFormTemplate,
      enabled: true,
      addEnabled: true,
      updateEnabled: true,
      deleteEnabled: true,
      attributeUpdatesEnabled: true,
      geometryUpdatesEnabled: true
    }
  } else if (!layerEditingEnabled || !dataSource) {
    editorLayerInfo = constructUneditableInfo(editorUseLayer)
  } else {
    const { addRecords, deleteRecords, updateRecords, updateAttributes, updateGeometries } = editorLayerConfig
    // New logic of API: The user with advanced permissions can modify the configuration regardless of the configuration
    const haveUpdatePrivilege = updateRecords || deleteRecords
    if (isAdvancedPermission || haveUpdatePrivilege) {
      showUpdateBtn = true
    }
    // fetch to confirm whether it's a public source
    const accessible = await getDsAccessibleInfo(editorUseLayer?.url)
    // exb access and privilege
    const editable = accessible || canEditFeature
    const {allowGeometryUpdates, create, update, deletable} = getDsPrivileges(layerDefinition)
    editorLayerInfo = {
      layer: editorUseLayer,
      formTemplate: usedFormTemplate,
      enabled: editable && (addRecords || updateRecords || deleteRecords),
      addEnabled: addRecords && create,
      updateEnabled: updateRecords && update,
      deleteEnabled: deleteRecords && deletable,
      attributeUpdatesEnabled: updateAttributes && update,
      geometryUpdatesEnabled: updateGeometries && allowGeometryUpdates
    }
  }
  return { showUpdateBtn, editorLayerInfo }
}

export const updateDataSourceAfterEdit = (dataSource: DataSource, params: __esri.FeatureLayerApplyEditsEdits) => {
  const { addFeatures = [], updateFeatures = [], deleteFeatures = [] } = params
  for (const addFeature of addFeatures) {
    const record = dataSource.buildRecord(addFeature)
    dataSource.afterAddRecord(record)
  }
  const objectIdField = dataSource.getIdField()
  for (const updateFeature of updateFeatures) {
    const recordId = updateFeature.attributes[objectIdField]
    const originalFeature = (dataSource.getRecordById(recordId) as FeatureDataRecord)?.feature as __esri.Graphic
    const originalAttributes = originalFeature?.attributes || {}
    const newAttributes = Object.assign(originalAttributes, updateFeature?.attributes)
    updateFeature.attributes = newAttributes
    const record = dataSource.buildRecord(updateFeature)
    dataSource.afterUpdateRecord(record)
  }
  for (const deleteFeature of deleteFeatures) {
    const record = dataSource.buildRecord(deleteFeature)
    dataSource.afterDeleteRecordById(record.getId())
  }
}

export const applyAttributeUpdates = async (layerInfo: LayerInfo, params: __esri.FeatureLayerApplyEditsEdits) => {
  const dataSource = layerInfo.dataSource
  const layer = layerInfo.layer
  const gdbVersion = dataSource.getGDBVersion()
  return layer.applyEdits(params, { gdbVersion })
}

export const useVisible = (el: HTMLElement) => {
  const [visible, setVisible] = React.useState(true)
  React.useEffect(() => {
    let observer: IntersectionObserver
    if (el) {
      observer = new IntersectionObserver((entries) => {
        const entry = entries[0]
        if (!entry) return
        const visibility = entry.target.checkVisibility()
        const isZeroSize = entry.boundingClientRect.width === 0 || entry.boundingClientRect.height === 0
        setVisible(visibility && !isZeroSize)
      })
      observer.observe(el)
    } else {
      setVisible(false)
    }
    return () => {
      observer && observer.disconnect()
    }
  }, [el])
  return visible
}
