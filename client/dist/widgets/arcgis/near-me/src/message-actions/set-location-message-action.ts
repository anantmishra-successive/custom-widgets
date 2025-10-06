import { AbstractMessageAction, type DataRecordsSelectionChangeMessage, type Message, type MessageDescription, MessageType, MutableStoreManager } from 'jimu-core'
import { getCompleteGeometries } from '../common/utils'

export default class SetLocationMessageAction extends AbstractMessageAction {
  filterMessageDescription (messageDescription: MessageDescription): boolean {
    return messageDescription.messageType === MessageType.DataRecordsSelectionChange
  }

  filterMessageType (messageType: MessageType): boolean {
    return messageType === MessageType.DataRecordsSelectionChange
  }

  filterMessage (message: Message): boolean {
    return true
  }

  //on selection of the features in other widgets get the data record set by execute method
  //data record set consists of the features which will be used for getting the incident geometry
  async onExecute (message: DataRecordsSelectionChangeMessage, actionConfig?: any): Promise<boolean> {
    const dataRecordsSelectionChangeMessage = message
    if (dataRecordsSelectionChangeMessage?.records.length > 0) {
      const geometriesByDsId = {}
      const incompleteGeometriesIds = {}
      let spatialRef
      //group geometries by datasource ids
      dataRecordsSelectionChangeMessage?.records?.forEach((eachRecord: any) => {
        //get the spatial reference of the feature geometry
        if (!spatialRef) {
          spatialRef = eachRecord.feature.geometry.spatialReference.toJSON()
        }
        const dsID = eachRecord?.dataSource?.id
        if (!geometriesByDsId[dsID]) {
          geometriesByDsId[dsID] = []
        }
        //check if the feature having the full geometry
        if (eachRecord.hasFullGeometry) {
          geometriesByDsId[dsID].push(eachRecord.feature.geometry)
        } else { //if incomplete geometry then push the each records id
          if (!incompleteGeometriesIds[dsID]) {
            incompleteGeometriesIds[dsID] = []
          }
          incompleteGeometriesIds[dsID].push(eachRecord.getId())
        }
      })
      if (Object.keys(incompleteGeometriesIds).length) {
        const incompleteGeomResults = await getCompleteGeometries(incompleteGeometriesIds, spatialRef)
        Object.keys(incompleteGeomResults).forEach((dsId) => {
          //merge the incomplete geometries results in the complete geomtries
          if (geometriesByDsId[dsId]) {
            geometriesByDsId[dsId] = [...geometriesByDsId[dsId], ...incompleteGeomResults[dsId]]
          } else {
            geometriesByDsId[dsId] = incompleteGeomResults[dsId]
          }
        })
      }
      MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'selectedIncidentLocation', geometriesByDsId)
      return true
    }
  }

  getSettingComponentUri (messageType: MessageType, messageWidgetId?: string): string {
    return null
  }
}
