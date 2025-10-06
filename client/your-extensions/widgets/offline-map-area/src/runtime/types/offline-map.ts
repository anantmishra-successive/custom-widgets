export interface OfflineArea {
  id: string
  name: string
  title: string
  geometry: any
  created: Date
  owner: string
  type: string
  numViews?: number
  size?: number
  packages?: Package[]
  status?: string
}

export interface Package {
  id: string
  title: string
  type: string
  created: Date
  size?: number
  status: string
}

export interface WebMap {
  id: string
  title: string
  owner: string
  created: Date
  modified: Date
  type: string
}

export interface Config {
  configText?: string
  refreshArea?: string
  createArea?: string
  setupArea?: string
  GetAllOfflineAreas?: string
  GetOfflineAreaById?: string
  GetLayersbyWebMapId?: string
  GetGeometry?: string
  setUpMapAreaJobStatus?: string
  GetMapAreaItemId?: string
  statusSetupMapArea?: string
  refreshMapOfflineArea?: string
  editOfflineMapArea?: string
  deleteOfflineArea?: string
  SqlGeoLite?: string
  apiToken?: string
  baseUrl?: string
}

export interface WidgetProps {
  config: Config
  useMapWidgetIds?: string[]
}

export interface WidgetState {
  currentView: "list" | "create" | "packages"
  offlineAreas: OfflineArea[]
  availableMaps: WebMap[]
  selectedMapId: string | null
  selectedAreaId: string | null
  selectedAreaPackages: Package[]
  loading: boolean
  errorMessage: string | null
  drawingMode: "polygon" | "rectangle" | null
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  drawnGeometry: any | null
  areaName: string
  createdAreas: OfflineArea[]
  isMapReady: boolean
}
