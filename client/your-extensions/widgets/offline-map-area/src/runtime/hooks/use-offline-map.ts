"use client"

import { useState, useRef } from "react"
import type { JimuMapView } from "jimu-arcgis"
import type SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel"
import type GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine"
import Polygon from "@arcgis/core/geometry/Polygon"
import { OfflineMapAPI } from "../services/offline-map-api"
import type { WidgetState, Config, OfflineArea } from "../types/offline-map"

export function useOfflineMap(config: Config) {
  const [state, setState] = useState<WidgetState>({
    currentView: "list",
    offlineAreas: [],
    availableMaps: [],
    selectedMapId: null,
    selectedAreaId: null,
    selectedAreaPackages: [],
    loading: false,
    errorMessage: null,
    drawingMode: null,
    drawnGeometry: null,
    areaName: "",
    createdAreas: [],
    isMapReady: false,
  })

  const apiService = useRef(
    new OfflineMapAPI(
      config.baseUrl || "https://frontiergis.maps.arcgis.com",
      config.apiToken ||
        "3NKHt6i2urmWtqOuugvr9UtjURsDHFZkSFMe57w5Tzqy_9dSH7-DJbMprzjvS28L8KJH_OuXswOt7jQHhESiOr1V3M39re_jgUG_fuNYp7bi_11HWWj6kZRp8fAPXmhhvIHzh5Lip8Si1kZQwtVDQEGPlU4iYgF7eloXakjcQnsGWHI3H8mZw3K9SpNNNFUHaiyF47TUL5xFZ67xRPpyJL4b1CjXMPQVy4kpeHoQRMQ.",
    ),
  )

  const mapViewRef = useRef<JimuMapView | null>(null)
  const sketchViewModelRef = useRef<SketchViewModel | null>(null)
  const sketchLayerRef = useRef<GraphicsLayer | null>(null)
  const offlineAreasLayerRef = useRef<GraphicsLayer | null>(null)

  const updateState = (updates: Partial<WidgetState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  const setError = (message: string | null) => {
    updateState({ errorMessage: message })
  }

  const setLoading = (loading: boolean) => {
    updateState({ loading })
  }

  const loadAvailableMaps = async () => {
    setLoading(true)
    setError(null)
    try {
      const maps = await apiService.current.getAvailableMaps()
      updateState({
        availableMaps: maps,
        selectedMapId: maps.length > 0 ? maps[0].id : null,
        loading: false,
      })
      if (maps.length > 0) {
        loadOfflineAreas(maps[0].id)
      }
    } catch (error) {
      console.error("[v0] Error loading available maps:", error)
      updateState({
        loading: false,
        errorMessage: "Failed to load available maps. Using demo mode.",
        availableMaps: [
          {
            id: "demo-map-1",
            title: "Demo Web Map",
            owner: "demo",
            created: new Date(),
            modified: new Date(),
            type: "Web Map",
          },
        ],
        selectedMapId: "demo-map-1",
      })
      loadOfflineAreasDemo()
    }
  }

  const loadOfflineAreas = async (mapId?: string) => {
    const targetMapId = mapId || state.selectedMapId
    if (!targetMapId) return
    setLoading(true)
    setError(null)
    try {
      const areas = await apiService.current.getOfflineAreas(targetMapId)
      updateState({
        offlineAreas: areas,
        loading: false,
      })
    } catch (error) {
      console.error("[v0] Error loading offline areas:", error)
      updateState({
        loading: false,
        errorMessage: "Failed to load offline areas from API. Using demo data.",
      })
    }
  }

  const loadOfflineAreasDemo = () => {
    const mockAreas: OfflineArea[] = [
      {
        id: "area-1",
        name: "Downtown Area",
        title: "Downtown Area",
        geometry: [
          [-118.25, 34.05],
          [-118.24, 34.06],
        ],
        created: new Date("2024-01-15"),
        owner: "demo",
        type: "Map Area",
        packages: [],
      },
      {
        id: "area-2",
        name: "Harbor District",
        title: "Harbor District",
        geometry: [
          [-118.27, 34.04],
          [-118.26, 34.05],
        ],
        created: new Date("2024-01-10"),
        owner: "demo",
        type: "Map Area",
        packages: [],
      },
    ]
    updateState({
      offlineAreas: mockAreas,
      loading: false,
    })
  }

  const validateGeometry = (geometry: any): boolean => {
    if (!geometry || !geometry.rings || !geometry.spatialReference) {
      console.error("[v0] Invalid geometry: missing rings or spatialReference")
      return false
    }

    try {
      const polygon = new Polygon({
        rings: geometry.rings,
        spatialReference: geometry.spatialReference,
      })

      const area = geometryEngine.geodesicArea(polygon, "square-kilometers")

      if (area <= 0 || area > 10000) {
        console.error("[v0] Invalid geometry: area is too large or invalid", { area })
        return false
      }

      return true
    } catch (error) {
      console.error("[v0] Error validating geometry:", error)
      return false
    }
  }

  return {
    state,
    updateState,
    setError,
    setLoading,
    loadAvailableMaps,
    loadOfflineAreas,
    validateGeometry,
    apiService: apiService.current,
    mapViewRef,
    sketchViewModelRef,
    sketchLayerRef,
    offlineAreasLayerRef,
  }
}
