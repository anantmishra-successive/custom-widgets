"use client"
import type { WidgetState } from "../types/offline-map"
import '../style1.css'
import React from "react"
interface AreaListViewProps {
  state: WidgetState
  onMapChange: (mapId: string) => void
  onCreateArea: () => void
  onViewPackages: (areaId: string) => void
  onRemoveArea: (areaId: string) => void
  onClearAll: () => void
  onRefresh: () => void
  onDismissError: () => void
}

export function AreaListView({
  state,
  onMapChange,
  onCreateArea,
  onViewPackages,
  onRemoveArea,
  onClearAll,
  onRefresh,
  onDismissError,
}: AreaListViewProps) {
  return (
    <div className="offline-map-area-widget">
      <div className="flex-container">
        <h2 className="widget-title">Offline Areas</h2>
      </div>

      {state.availableMaps.length > 0 && (
        <div className="mb-4">
          <label className="select-label">Select Map</label>
          <select
            value={state.selectedMapId || ""}
            onChange={(e) => onMapChange(e.target.value)}
            className="select-input"
          >
            {state.availableMaps.map((map) => (
              <option key={map.id} value={map.id}>
                {map.title}
              </option>
            ))}
          </select>
        </div>
      )}

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

      {state.loading ? (
        <div className="spinner">
          <div className="spinner-circle"></div>
        </div>
      ) : (
        <>
          <div className="area-list">
            {state.offlineAreas.length === 0 ? (
              <p className="no-areas-text">No offline areas created yet</p>
            ) : (
              state.offlineAreas.map((area) => (
                <div key={area.id} className="area-item">
                  <div className="flex-1 min-w-0">
                    <p className="area-title">{area.title}</p>
                    <p className="area-details">
                      Created: {area.created.toLocaleDateString()} • Owner: {area.owner}
                    </p>
                  </div>
                  <div className="flex-gap-1">
                    {area.status === "complete" ? null : (
                      <button
                        disabled
                        className={`action-button status ${area.status === "failed" ? "bg-red-500" : "bg-green-500"}`}
                        title={`Status: ${area.status}`}
                      >
                        {area.status === "failed" ? "Failed" : "Packaging"}
                      </button>
                    )}
                    <button
                      onClick={() => onViewPackages(area.id)}
                      className="action-button view"
                      title="View packages"
                    >
                      <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button onClick={() => onRemoveArea(area.id)} className="action-button remove" title="Remove area">
                      <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex-gap-2">
            <button onClick={onCreateArea} className="btn-primary">
              Create New Area
            </button>
            {state.offlineAreas.length > 0 && (
              <button onClick={onClearAll} className="btn-secondary red" title="Clear all areas">
                Clear All
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
