import { type ImmutableObject, React, ReactRedux, type IMState } from 'jimu-core'
import { useCallback } from 'react'
import {
  areModelViewerLinkedDocumentsEqual,
  areFeatureDocumentLinksEqual,
  type SelectedBimDocument,
  modelViewerLinkedDocumentSelector,
  useLinks,
  useGeoBIM,
  type IFeatureDocumentLinks,
  type GraphicDataRecord,
  areRecordArraysEqual,
  type IDocument
} from 'widgets/shared-code/geobim'
const { useState, useMemo, useRef } = React
const { useSelector } = ReactRedux

interface DocumentSelectionContextType {
  bimDocument: SelectedBimDocument | null
  documentLoading: boolean
  multipleFeatureSelectionWarning: boolean
  cancelMultipleFeatureSelectionWarning: () => void
}

const areDocumentsEqual = (a?: IDocument, b?: IDocument) => {
  return (a ?? null) !== null && (b ?? null) !== null && a.url === b?.url
}

const useDocumentSelection = (
  widgetId: string,
  modelViewerDisabled: boolean
) => {
  const { featureDocumentLinks, linksLoading, linksInitialized } = useLinks()
  const { hasMapWidget, geoBIMInitialized, selectedFeatures } = useGeoBIM()
  const immutableSelectedBimDocument: ImmutableObject<SelectedBimDocument> = useSelector(
    (state: IMState) => modelViewerLinkedDocumentSelector(widgetId, state)
  )
  const selectedBimDocument: SelectedBimDocument | null = useMemo(
    () => immutableSelectedBimDocument?.asMutable({ deep: true })
    , [immutableSelectedBimDocument]
  )
  const [currentBimDocument, setCurrentBimDocument] = useState<SelectedBimDocument | null>(null)
  const [multipleFeatureSelectionWarning, setMultipleFeatureSelectionWarning] = useState<boolean>(false)

  // TODO: Centralize and simplify selection state management (#6023)
  const previousSelectedStoreDocument = useRef<SelectedBimDocument | null>(null)
  const previousSelectedMapDocuments = useRef<IFeatureDocumentLinks | null>(null)
  const previousRenderedDocuments = useRef<IFeatureDocumentLinks | null>(null)
  const previousSelectedFeatures = useRef<GraphicDataRecord[] | null>(null)

  // Warn about multiple feature selections (until supported)
  if (!modelViewerDisabled && !areRecordArraysEqual(previousSelectedFeatures.current, selectedFeatures)) {
    previousSelectedFeatures.current = selectedFeatures
    // (ignore deselection events)
    if (selectedFeatures.length > 1) {
      setMultipleFeatureSelectionWarning(true)
    } else if (selectedFeatures.length === 1) {
      setMultipleFeatureSelectionWarning(false)
    }
  }

  // Process Store Selections
  if (!areModelViewerLinkedDocumentsEqual(previousSelectedStoreDocument.current, selectedBimDocument)) {
    // do nothing if Model Viewer is disabled except track store document changes
    previousSelectedStoreDocument.current = selectedBimDocument
    if (
      !modelViewerDisabled ||
      areDocumentsEqual(
        selectedBimDocument?.document,
        currentBimDocument?.document
      )
    ) {
      setCurrentBimDocument(selectedBimDocument)
      previousRenderedDocuments.current = featureDocumentLinks

      // remove warning if store document is selected
      setMultipleFeatureSelectionWarning(false)
    }
  }

  // Check if the rendered document does not match the latest selection after user selection
  if (linksLoading) {
    if (!areFeatureDocumentLinksEqual(previousSelectedMapDocuments.current, previousRenderedDocuments.current)) {
      previousSelectedMapDocuments.current = previousRenderedDocuments.current
    }
  }

  // Process Map Selections
  if (
    !areFeatureDocumentLinksEqual(previousSelectedMapDocuments.current, featureDocumentLinks) &&
    linksInitialized &&
    !linksLoading
  ) {
    previousSelectedMapDocuments.current = featureDocumentLinks

    // Grab first document link returned (for now)
    const firstDocument = featureDocumentLinks?.documents[0]
    if (
      !modelViewerDisabled ||
      areDocumentsEqual(firstDocument, currentBimDocument?.document)
    ) {
      if (featureDocumentLinks?.documents.length > 0) {
        const bimIds = featureDocumentLinks.feature.bimIds
        const currentMapDocument = {
          document: firstDocument,
          selectedIds: bimIds
        }
        setCurrentBimDocument(currentMapDocument)
        previousRenderedDocuments.current = featureDocumentLinks
      } else {
        setCurrentBimDocument(null)
        previousRenderedDocuments.current = null
      }
    }
  }

  const documentLoading = useMemo(() => {
    // show loading until widget is ready
    if (!geoBIMInitialized || (hasMapWidget && !linksInitialized)) return true

    return linksLoading
  }, [geoBIMInitialized, hasMapWidget, linksInitialized, linksLoading])

  const cancelMultipleFeatureSelectionWarning = useCallback((): void => {
    setMultipleFeatureSelectionWarning(false)
  }, [])

  // memoize hook context and wrap all callback functions in useCallback()
  const documentSelectionReturn: DocumentSelectionContextType = useMemo(
    () => ({
      bimDocument: currentBimDocument,
      documentLoading,
      multipleFeatureSelectionWarning,
      cancelMultipleFeatureSelectionWarning
    }),
    [
      cancelMultipleFeatureSelectionWarning,
      currentBimDocument,
      documentLoading,
      multipleFeatureSelectionWarning
    ]
  )

  return documentSelectionReturn
}

export { useDocumentSelection }
