"use client"
import type { WidgetState } from "../types/offline-map"
import '../style1.css'
import React from "react"
interface CreateAreaViewProps {
  state: WidgetState
  onBack: () => void
  onAreaNameChange: (name: string) => void
  onStartDrawing: (mode: "polygon" | "rectangle") => void
  onClearDrawing: () => void
  onSave: () => void
  onDismissError: () => void
}

export function CreateAreaView({
  state,
  onBack,
  onAreaNameChange,
  onStartDrawing,
  onClearDrawing,
  onSave,
  onDismissError,
}: CreateAreaViewProps) {
  return (
    <div className="offline-map-area-widget">
      <div className="flex-container">
        <button onClick={onBack} className="back-button">
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="widget-title">Create Offline Area</h2>
      </div>

      {state.errorMessage && (
        <div className="error-container">
          <div className="flex-container">
            <p className="error-text">{state.errorMessage}</p>
            <button onClick={onDismissError} className="error-close-button">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {!state.isMapReady && (
        <div className="notification-container yellow">
          <p className="notification-text yellow">Loading map, please wait...</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="areaName" className="select-label">
            Area Name
          </label>
          <input
            type="text"
            id="areaName"
            value={state.areaName}
            onChange={(e) => onAreaNameChange(e.target.value)}
            placeholder="Enter a name for your area"
            className="input-field"
          />
        </div>

        <div>
          <label className="select-label">Select Draw Mode</label>
          <div className="flex-gap-2">
            <button
              onClick={() => onStartDrawing("polygon")}
              disabled={state.drawingMode === "polygon" || !state.isMapReady}
              className={`draw-mode-button ${state.drawingMode === "polygon" ? "active" : state.isMapReady ? "inactive" : ""}`}
            >
              ● Polygon
            </button>
            <button
              onClick={() => onStartDrawing("rectangle")}
              disabled={state.drawingMode === "rectangle" || !state.isMapReady}
              className={`draw-mode-button ${state.drawingMode === "rectangle" ? "active" : state.isMapReady ? "inactive" : ""}`}
            >
              ■ Rectangle
            </button>
            <button onClick={onClearDrawing} className="btn-secondary">
              Clear
            </button>
          </div>
        </div>

        {state.drawingMode && (
          <div className="notification-container yellow">
            <p className="notification-text yellow">
              Drawing {state.drawingMode} mode active. Draw on the map to create your offline area.
            </p>
          </div>
        )}

        {state.drawnGeometry && (
          <div className="notification-container green">
            <p className="notification-text green">
              ✓ Geometry created successfully. You can now save this offline area.
            </p>
          </div>
        )}

        {state.createdAreas.length > 0 && (
          <div className="notification-container blue">
            <p className="notification-text blue">
              {state.createdAreas.length} area(s) created in this session. All areas will be preserved.
            </p>
          </div>
        )}

        <div className="flex-gap-2 pt-2">
          <button
            onClick={onSave}
            disabled={!state.drawnGeometry || !state.areaName.trim() || state.loading}
            className="btn-primary"
          >
            {state.loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
          <button onClick={onBack} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
