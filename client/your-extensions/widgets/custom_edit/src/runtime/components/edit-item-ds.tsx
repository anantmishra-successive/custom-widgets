/** @jsx jsx */
import { React, jsx, DataSourceComponent, type IMUseDataSource, type DataSource, type ImmutableArray, type IMDataSourceInfo } from 'jimu-core'
import { idsArrayEquals } from './utils'

interface DataSourceProps {
  useDataSource: IMUseDataSource
  onDataSourceCreated?: (dataSourceId: string, dataSource?: DataSource) => void
  onSelectionChange: (dataSourceId: string) => void
  onSourceVersionChange?: (dataSourceId: string, sourceVersion: number) => void
}

export default class EditItemDataSource extends React.PureComponent<DataSourceProps> {
  
  onDataSourceCreated = (ds: DataSource) => {
    console.log('EditItemDataSource -> onDataSourceCreated:', ds);
    // Log layer whose layerId is '2'
    // Use type assertion to access custom property 'q'
    const layerId = (ds as any)?.layerId;
    if (ds && layerId === '2') {
      console.log('Layer with layerId=2:', ds);
    }
    // Log fields for layer whose layerId is '2'
    const fieldsLayerId2 = ds?.layerId === '2';
    if (ds && fieldsLayerId2) {
      // Try to get fields from schema or layerDefinition
      const fields = ds?.schema?.fields || ds?.layerDefinition?.fields || ds?.fetchedSchema?.fields;
      console.log('Fields for layerId=2:', fields);
    }
    this.props?.onDataSourceCreated?.(this.props.useDataSource.dataSourceId, ds)
    console.log(this.props);
  }
  

  onSelectionChange = (selection: ImmutableArray<string>, preSelection?: ImmutableArray<string>) => {
    const selectedChange = !idsArrayEquals(selection, preSelection) && (selection?.length !== 0 || preSelection?.length !== 0)
    if (selectedChange) {
      this.props.onSelectionChange?.(this.props.useDataSource.dataSourceId)
    }
  }

  onDataSourceInfoChange = (info: IMDataSourceInfo, preInfo?: IMDataSourceInfo) => {
    if (!info) return
    const sourceVersionChange = info.sourceVersion !== preInfo?.sourceVersion
    if (sourceVersionChange) {
      this.props.onSourceVersionChange?.(this.props.useDataSource.dataSourceId, info.sourceVersion)
    }
  }

  render () {
    const { useDataSource } = this.props
    console.log('EditItemDataSource -> props:', this.props);
    return (
      <DataSourceComponent
        useDataSource={useDataSource}
        onDataSourceCreated={this.onDataSourceCreated}
        onSelectionChange={this.onSelectionChange}
        onDataSourceInfoChange={this.onDataSourceInfoChange}
      />
    )
  }
}
