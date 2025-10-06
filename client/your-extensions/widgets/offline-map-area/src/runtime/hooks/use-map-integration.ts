"use client"

import type React from "react"

import { useEffect } from "react"
import type { JimuMapView } from "jimu-arcgis"
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
import Polygon from "@arcgis/core/geometry/Polygon"
import Graphic from "@arcgis/core/Graphic"
import Extent from "@arcgis/core/geometry/Extent"
import type { OfflineArea, WidgetState } from "../types/offline-map"

interface UseMapIntegrationProps {
  state: WidgetState
  updateState: (updates: Partial<WidgetState>) => void
  mapViewRef: React.MutableRefObject<JimuMapView | null>
  sketchViewModelRef: React.MutableRefObject<SketchViewModel | null>
  sketchLayerRef: React.MutableRefObject<GraphicsLayer | null>
  offlineAreasLayerRef: React.MutableRefObject<GraphicsLayer | null>
}

export function useMapIntegration({
  state,
  updateState,
  mapViewRef,
  sketchViewModelRef,
  sketchLayerRef,
  offlineAreasLayerRef,
}: UseMapIntegrationProps) {
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    console.log("JimuMapView received:", jmv)
    if (jmv && jmv.view) {
      console.log("MapView initialized:", jmv.view)
      mapViewRef.current = jmv

      const sketchLayer = new GraphicsLayer({
        id: "sketch-layer",
        title: "Sketch Layer",
      })

      jmv.view.map.add(sketchLayer)
      sketchLayerRef.current = sketchLayer

      const offlineAreasLayer = new GraphicsLayer({
        id: "offline-areas-layer",
        title: "Offline Areas Layer",
      })

      jmv.view.map.add(offlineAreasLayer)
      offlineAreasLayerRef.current = offlineAreasLayer

      sketchViewModelRef.current = new SketchViewModel({
        view: jmv.view,
        layer: sketchLayer,
        polygonSymbol: {
          type: "simple-fill",
          color: [51, 153, 255, 0.3],
          outline: { color: [51, 153, 255, 1], width: 2 },
        },
      })

      sketchViewModelRef.current.on("create", (event) => {
        if (event.state === "complete") {
          console.log("Geometry drawn:", event.graphic.geometry)
          updateState({
            drawnGeometry: event.graphic.geometry.toJSON(),
            drawingMode: null,
          })
        }
      })

      updateState({ isMapReady: true })
    } else {
      console.error("No valid MapView found")
      updateState({
        isMapReady: false,
        errorMessage: "Map widget not found. Please select a map widget in the settings.",
      })
    }
  }

  // Render offline areas geometries on the map
  useEffect(() => {
    if (!mapViewRef.current || !offlineAreasLayerRef.current || !state.isMapReady || state.offlineAreas.length === 0) {
      return
    }

    offlineAreasLayerRef.current.removeAll()

    state.offlineAreas.forEach((area) => {
      if (!area.geometry) return

      let polygon: Polygon | null = null

      if (
        Array.isArray(area.geometry) &&
        area.geometry.length === 2 &&
        Array.isArray(area.geometry[0]) &&
        Array.isArray(area.geometry[1])
      ) {
        const [[xmin, ymin], [xmax, ymax]] = area.geometry
        polygon = new Polygon({
          rings: [
            [
              [xmin, ymin],
              [xmax, ymin],
              [xmax, ymax],
              [xmin, ymax],
              [xmin, ymin],
            ],
          ],
          spatialReference: { wkid: 4326 },
        })
      } else if (area.geometry.rings) {
        polygon = Polygon.fromJSON(area.geometry)
      }

      if (polygon) {
        const graphic = new Graphic({
          geometry: polygon,
          symbol: {
            type: "simple-fill",
            color: [255, 0, 0, 0.1],
            outline: { color: [255, 0, 0, 1], width: 1 },
          },
        })
        offlineAreasLayerRef.current?.add(graphic)
      }
    })
  }, [state.offlineAreas, state.isMapReady])

  // Clean up
  useEffect(() => {
    return () => {
      if (sketchLayerRef.current && mapViewRef.current?.view) {
        mapViewRef.current.view.map.remove(sketchLayerRef.current)
      }
      if (offlineAreasLayerRef.current && mapViewRef.current?.view) {
        mapViewRef.current.view.map.remove(offlineAreasLayerRef.current)
      }
    }
  }, [])

  const startDrawing = (mode: "polygon" | "rectangle") => {
    if (!mapViewRef.current || !sketchViewModelRef.current || !sketchLayerRef.current) {
      updateState({
        errorMessage: "Map is not loaded or drawing tools are not initialized. Please ensure a map widget is selected.",
      })
      return
    }

    sketchLayerRef.current.removeAll()
    sketchViewModelRef.current.create(mode)
    updateState({
      drawingMode: mode,
      drawnGeometry: null,
      errorMessage: null,
    })
  }

  const clearCurrentDrawing = () => {
    if (sketchLayerRef.current) {
      sketchLayerRef.current.removeAll()
    }
    if (sketchViewModelRef.current) {
      sketchViewModelRef.current.cancel()
    }
    updateState({
      drawingMode: null,
      drawnGeometry: null,
      errorMessage: null,
    })
  }

  const zoomToArea = (area: OfflineArea) => {
    if (!mapViewRef.current || !area.geometry) return

    let extent: Extent | null = null

    if (Array.isArray(area.geometry) && area.geometry.length === 2) {
      const [[xmin, ymin], [xmax, ymax]] = area.geometry
      extent = new Extent({
        xmin,
        ymin,
        xmax,
        ymax,
        spatialReference: { wkid: 4326 },
      })
    } else if (area.geometry.rings) {
      const polygon = Polygon.fromJSON(area.geometry)
      extent = polygon.extent
    }

    if (extent) {
      mapViewRef.current.view.goTo(extent.expand(1.2))
    }
  }

  return {
    activeViewChangeHandler,
    startDrawing,
    clearCurrentDrawing,
    zoomToArea,
  }
}
