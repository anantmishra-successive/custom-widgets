import type { OfflineArea, Package, WebMap } from "../types/offline-map"

export class OfflineMapAPI {
  private baseUrl: string
  private token: string

  constructor(baseUrl = "https://frontiergis.maps.arcgis.com", token = "") {
    this.baseUrl = baseUrl
    this.token = token
  }

  setToken(token: string) {
    this.token = token
  }

  async getAvailableMaps(): Promise<WebMap[]> {
    const url = `${this.baseUrl}/sharing/rest/search`
    const params = new URLSearchParams({
      num: "1000",
      start: "1",
      sortField: "modified",
      sortOrder: "desc",
      q: `owner:"FSAdministrator" orgid:rNrQIsYWvDmHbnqi (type:("Web Map" OR "CityEngine Web Scene") -type:"Web Mapping Application") -type:("Code Attachment") -typekeywords:("MapAreaPackage") -type:("Map Area" OR "Indoors Map Configuration")`,
      f: "json",
      token: this.token,
      _: Date.now().toString(),
    })

    try {
      const response = await fetch(`${url}?${params}`)
      const data = await response.json()
      if (data.results) {
        return data.results.map((item: any) => ({
          id: item.id,
          title: item.title,
          owner: item.owner,
          created: new Date(item.created),
          modified: new Date(item.modified),
          type: item.type,
        }))
      }
      return []
    } catch (error) {
      console.error("[v0] Error fetching available maps:", error)
      throw error
    }
  }

  async getOfflineAreas(mapId: string): Promise<OfflineArea[]> {
    const url = `${this.baseUrl}/sharing/rest/content/items/${mapId}/relatedItems`
    const params = new URLSearchParams({
      relationshipType: "Map2Area",
      token: this.token,
      f: "json",
    })

    try {
      const response = await fetch(`${url}?${params}`)
      const data = await response.json()
      if (data.relatedItems) {
        return data.relatedItems.map((item: any) => ({
          id: item.id,
          name: item.title,
          title: item.title,
          geometry: item.extent || null,
          created: new Date(item.created),
          owner: item.owner,
          type: item.type,
          numViews: item.numViews,
          size: item.size,
          packages: [],
          status: item?.properties?.status,
        }))
      }
      return []
    } catch (error) {
      console.error("[v0] Error fetching offline areas:", error)
      throw error
    }
  }

  async getAreaPackages(areaId: string): Promise<Package[]> {
    const url = `${this.baseUrl}/sharing/rest/content/items/${areaId}/relatedItems`
    const params = new URLSearchParams({
      relationshipType: "Area2Package",
      direction: "forward",
      token: this.token,
      f: "json",
    })

    try {
      const response = await fetch(`${url}?${params}`)
      const data = await response.json()
      console.log("areaaaaas packages", data.relatedItems)
      if (data.relatedItems) {
        return data.relatedItems.map((item: any) => ({
          id: item.id,
          title: item.title.match(/^[^-]*/)?.[0] || item.title,
          type: item.type,
          created: new Date(item.created),
          size: item.size,
          status: "ready",
        }))
      }
      return []
    } catch (error) {
      console.error("[v0] Error fetching area packages:", error)
      throw error
    }
  }

  async refreshPackage(packageId: string): Promise<any> {
    const url =
      "https://packaging.arcgis.com/arcgis/rest/services/OfflinePackaging/GPServer/RefreshMapAreaPackage/submitJob"
    const formData = new FormData()
    formData.append("f", "json")
    formData.append("token", this.token)
    formData.append("packages", JSON.stringify([{ itemId: packageId }]))

    try {
      const response = await fetch(url, { method: "POST", body: formData })
      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Error refreshing package:", error)
      throw error
    }
  }

  private async getWebMapData(mapId: string): Promise<any> {
    const url = `${this.baseUrl}/sharing/rest/content/items/${mapId}/data`
    const params = new URLSearchParams({
      f: "json",
      token: this.token,
    })

    try {
      const response = await fetch(`${url}?${params}`)
      return await response.json()
    } catch (error) {
      console.error("[v0] Error fetching web map data:", error)
      throw error
    }
  }

  async createMapAreaJob(mapId: string, area: any, areaType: string, title: string): Promise<string> {
    const url = "https://packaging.arcgis.com/arcgis/rest/services/OfflinePackaging/GPServer/CreateMapArea/submitJob"
    const formData = new FormData()
    formData.append("f", "json")
    formData.append("token", this.token)
    formData.append("mapItemId", mapId)
    formData.append("area", JSON.stringify(area))
    formData.append("areaType", areaType)
    formData.append("outputName", JSON.stringify({ title: title, folderId: "", packageRefreshSchedule: "" }))

    try {
      const response = await fetch(url, { method: "POST", body: formData })
      const data = await response.json()
      if (data.jobId) {
        return data.jobId
      } else {
        throw new Error("Failed to submit create map area job: " + JSON.stringify(data))
      }
    } catch (error) {
      console.error("[v0] Error submitting create map area job:", error)
      throw error
    }
  }

  async getJobStatus(task: string, jobId: string): Promise<any> {
    const url = `https://packaging.arcgis.com/arcgis/rest/services/OfflinePackaging/GPServer/${task}/jobs/${jobId}`
    const params = new URLSearchParams({
      f: "json",
      token: this.token,
      returnMessages: "true",
      _: Date.now().toString(),
    })

    try {
      const response = await fetch(`${url}?${params}`)
      return await response.json()
    } catch (error) {
      console.error("[v0] Error getting job status:", error)
      throw error
    }
  }

  async pollJobStatus(task: string, jobId: string): Promise<any> {
    let jobStatus = "esriJobExecuting"
    while (jobStatus === "esriJobSubmitted" || jobStatus === "esriJobExecuting") {
      const data = await this.getJobStatus(task, jobId)
      jobStatus = data.jobStatus
      if (jobStatus === "esriJobFailed") {
        throw new Error(`Job failed: ${JSON.stringify(data.messages)}`)
      }
      if (jobStatus === "esriJobSucceeded") {
        return data
      }
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
    throw new Error(`Unexpected job status: ${jobStatus}`)
  }

  async getMapAreaItemId(jobId: string): Promise<string> {
    const url = `https://packaging.arcgis.com/arcgis/rest/services/OfflinePackaging/GPServer/CreateMapArea/jobs/${jobId}/results/mapAreaItemId`
    const params = new URLSearchParams({
      f: "json",
      token: this.token,
      _: Date.now().toString(),
    })

    try {
      const response = await fetch(`${url}?${params}`)
      const data = await response.json()
      return data.value
    } catch (error) {
      console.error("[v0] Error getting map area item ID:", error)
      throw error
    }
  }

  async setupMapAreaJob(mapAreaItemId: string, featureServices: any[], tileServices: any[]): Promise<string> {
    const url = "https://packaging.arcgis.com/arcgis/rest/services/OfflinePackaging/GPServer/SetupMapArea/submitJob"
    const formData = new FormData()
    formData.append("f", "json")
    formData.append("token", this.token)
    formData.append("mapAreaItemId", mapAreaItemId)
    formData.append("featureServices", JSON.stringify(featureServices))
    formData.append("tileServices", JSON.stringify(tileServices))

    try {
      const response = await fetch(url, { method: "POST", body: formData })
      const data = await response.json()
      if (data.jobId) {
        return data.jobId
      } else {
        throw new Error("Failed to submit setup map area job: " + JSON.stringify(data))
      }
    } catch (error) {
      console.error("[v0] Error submitting setup map area job:", error)
      throw error
    }
  }

  async createOfflineArea(mapId: string, geometry: any, areaName: string): Promise<OfflineArea> {
    const geometryJson = geometry
    const areaType = geometryJson.rings ? "POLYGON" : "ENVELOPE"
    const area = {
      spatialReference: geometryJson.spatialReference || { wkid: 102100, latestWkid: 3857 },
      ...(areaType === "POLYGON"
        ? { rings: geometryJson.rings }
        : {
            xmin: geometryJson.xmin,
            ymin: geometryJson.ymin,
            xmax: geometryJson.xmax,
            ymax: geometryJson.ymax,
          }),
    }

    // Submit CreateMapArea job
    const createJobId = await this.createMapAreaJob(mapId, area, areaType, areaName.trim())
    const createJobResult = await this.pollJobStatus("CreateMapArea", createJobId)
    const mapAreaItemId = await this.getMapAreaItemId(createJobId)

    // Fetch web map data to extract services
    const webMapData = await this.getWebMapData(mapId)

    // Extract feature services
    const operationalLayers = webMapData.operationalLayers || []
    const featureServiceMap = new Map<string, { layers: number[]; layerQueries: any }>()
    for (const layer of operationalLayers) {
      if (layer.url && layer.url.includes("FeatureServer")) {
        const urlParts = layer.url.split("/")
        const layerIdStr = urlParts.pop() || ""
        const layerId = Number.parseInt(layerIdStr, 10)
        const isSublayer = !isNaN(layerId)
        const serviceUrl = isSublayer ? urlParts.join("/") : layer.url

        if (!featureServiceMap.has(serviceUrl)) {
          featureServiceMap.set(serviceUrl, { layers: [], layerQueries: {} })
        }

        const entry = featureServiceMap.get(serviceUrl)!
        const effectiveLayerId = isSublayer ? layerId : 0
        entry.layers.push(effectiveLayerId)
        entry.layerQueries[effectiveLayerId] = { queryOption: "all" }
      }
    }

    const featureServices = Array.from(featureServiceMap.entries()).map(([url, entry]) => ({
      url,
      layers: entry.layers.sort((a, b) => a - b),
      returnAttachments: false,
      attachmentsSyncDirection: "upload",
      syncModel: "perLayer",
      createPkgDeltas: { maxDeltaAge: 5 },
      layerQueries: entry.layerQueries,
    }))

    // Extract tile services
    const baseMapLayers = webMapData.baseMap?.baseMapLayers || []
    const tileServices = baseMapLayers
      .filter(
        (layer: any) =>
          layer.layerType === "ArcGISTiledMapServiceLayer" ||
          layer.layerType === "VectorTileLayer" ||
          layer.url?.includes("MapServer") ||
          layer.url?.includes("VectorTileServer"),
      )
      .map((layer: any) => ({
        url: layer.url,
        levels: Array.from({ length: 22 }, (_, i) => i).join(","),
      }))

    // Submit SetupMapArea job
    await this.setupMapAreaJob(mapAreaItemId, featureServices, tileServices)

    // Return new area object
    return {
      id: mapAreaItemId,
      name: areaName.trim(),
      title: areaName.trim(),
      geometry: geometry,
      created: new Date(),
      owner: "current_user",
      type: "Map Area",
      packages: [],
    }
  }
}
