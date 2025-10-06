/** @jsx jsx */
import { React, jsx, type AllWidgetProps } from 'jimu-core'
import { EditModeType, type IMConfig } from '../config'   // 👈 use config.ts version
import FeatureFormComponent from './components/feature-form-component'
import EditorComponent from './components/editor-component'
import { getPrivilege } from './components/utils'
import { versionManager } from '../version-manager'

export interface CommonProps {
  config: IMConfig
  canEditFeature: boolean
}


const EditWidget = (props: AllWidgetProps<IMConfig>) => {
  const { label, config, useDataSources, useMapWidgetIds } = props
  const isAttributeOnly = config.editMode === EditModeType.Attribute

  const [canEditFeature, setCanEditFeature] = React.useState(false)
  React.useEffect(() => {
    getPrivilege().then((canEdit) => {
      setCanEditFeature(canEdit)
    })
  }, [])

  console.log('EditWidget -> canEditFeature:', isAttributeOnly, canEditFeature, useDataSources, useMapWidgetIds)

  return isAttributeOnly
    ? (
      <FeatureFormComponent
        label={label}
        config={config}
        zoneLayerUrl={config.zoneLayerUrl}   // ✅ now works
        canEditFeature={canEditFeature}
        useDataSources={useDataSources}
      />
    )
    : (
      <EditorComponent
        config={config}
        canEditFeature={canEditFeature}
        useMapWidgetIds={useMapWidgetIds}
        zoneLayerUrl={config.zoneLayerUrl} 
      />
    )
}

EditWidget.versionManager = versionManager

export default EditWidget
