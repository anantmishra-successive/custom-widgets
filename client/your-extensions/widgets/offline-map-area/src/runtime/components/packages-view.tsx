"use client"
import type { WidgetState } from "../types/offline-map"
import '../style1.css'
import React from "react"
interface PackagesViewProps {
  state: WidgetState
  onBack: () => void
  onRefreshPackage: (packageId: string) => void
  onDismissError: () => void
}

export function PackagesView({ state, onBack, onRefreshPackage, onDismissError }: PackagesViewProps) {
  const selectedArea = state.offlineAreas.find((area) => area.id === state.selectedAreaId)

  return (
    <div className="offline-map-area-widget">
      <div className="flex-container">
        <button onClick={onBack} className="back-button">
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="widget-title">Packages</h2>
      </div>

      {selectedArea && (
        <div className="area-item">
          <p className="area-title">{selectedArea.title}</p>
          <p className="area-details">Created: {selectedArea.created.toLocaleDateString()}</p>
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
        <div className="package-list">
          {state.selectedAreaPackages.length === 0 ? (
            <p className="no-areas-text">No packages found for this area</p>
          ) : (
            state.selectedAreaPackages.map((pkg) => (
              <div key={pkg.id} className="package-item">
                <div className="flex-container">
                  <div className="flex-1 min-w-0">
                    <p className="package-title">{pkg.title}</p>
                    <p className="package-details">
                      {pkg.type} • {pkg.created.toLocaleDateString()}
                      {pkg.size && ` • ${(pkg.size / 1024 / 1024).toFixed(1)} MB`}
                    </p>
                  </div>
                  <button
                    onClick={() => onRefreshPackage(pkg.id)}
                    disabled={state.loading}
                    className="refresh-button"
                    title="Refresh package"
                  >
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
