import { type IMState, React, ReactRedux } from 'jimu-core'
import type { Dispatch } from 'redux'
import {
  type IFeatureDocumentLinks,
  getFeatureTitle,
  type IDocument,
  setModelViewerLinkedDocument,
  type ActionTypes,
  modelViewerDisabledSelector,
  useLinks,
  useGeoBIM,
  type defaultSharedMessages,
  areRecordArraysEqual,
  type GraphicDataRecord,
} from 'widgets/shared-code/geobim'
import type defaultMessages from '../translations/default'
const { useMemo, useCallback, useState } = React
const { useDispatch, useSelector } = ReactRedux

interface LinkExplorerContextType {
  setDocumentSelection: (document: IDocument | null, bimIds: string[] | null) => void
  linkExplorerTitle: string
  featureDocumentLinks: IFeatureDocumentLinks | null
  linksLoading: boolean
  linksInitialized: boolean
  multipleFeatureSelectionWarning: boolean
  onMultipleFeatureSelectionWarningCancel: () => void
}

const useLinkExplorer = (
  modelViewerWidgetId: string,
  i18nMessage: (
    id: keyof typeof defaultMessages | keyof typeof defaultSharedMessages.default,
    values?: { [key: string]: string }
  ) => string
): LinkExplorerContextType => {
  const isModelViewerDisabled: boolean = useSelector((state: IMState) =>
    modelViewerDisabledSelector(modelViewerWidgetId, state)
  )
  const { selectedFeatures, geoBIMLoading } = useGeoBIM()
  const { featureDocumentLinks, linksLoading, linksInitialized } = useLinks()
  // NOTE: Only local state for the widget is kept in hooks. All shared state is in the Store.
  const dispatch = useDispatch<Dispatch<ActionTypes>>()  
  const [selectionTitle, setSelectionTitle] = useState<string | null>(null)
  const [prevSelectedFeatures, setPrevSelectedFeatures] = useState<GraphicDataRecord[]>([])
  const [multipleFeatureSelectionWarning, setMultipleFeatureSelectionWarning] = useState<boolean>(false)
  // TODO: Handle multiselect (single select for now...)
  if (!areRecordArraysEqual(prevSelectedFeatures, selectedFeatures)) {
    setPrevSelectedFeatures(selectedFeatures)
    if (selectedFeatures.length === 1) {
      if (multipleFeatureSelectionWarning) {
        setMultipleFeatureSelectionWarning(false)
      }
      const selectedFeature: __esri.Graphic = selectedFeatures[0].feature
      const selectedRecordTitle: string = getFeatureTitle(selectedFeature) ?? i18nMessage('noFeatureTitle')
      const selectedLayerTitle: string = selectedFeature.layer.title
      const newLinkExplorerTitle: string = (selectedRecordTitle === selectedLayerTitle)
        ? selectedRecordTitle
        : `${selectedLayerTitle}: ${selectedRecordTitle}`
      if (selectionTitle !== newLinkExplorerTitle) {
        setSelectionTitle(newLinkExplorerTitle)
      }
    } else if (selectedFeatures.length > 1) {
      if (!multipleFeatureSelectionWarning) {
        setMultipleFeatureSelectionWarning(true)
      }
      if (selectionTitle !==  null) {
        setSelectionTitle(null)
      }
    }
  }

  const linkExplorerTitle = useMemo((): string => {
    if (linksInitialized && !geoBIMLoading && selectionTitle !== null) {
      return selectionTitle
    }
    return i18nMessage('widgetTitle')
  },[geoBIMLoading, i18nMessage, linksInitialized, selectionTitle])

  const setDocumentSelection = useCallback((document: IDocument, bimIds: string[] | null): void => {
    if (modelViewerWidgetId == null || modelViewerWidgetId === '' || isModelViewerDisabled) return

      setModelViewerLinkedDocument(modelViewerWidgetId, document, bimIds, dispatch)
    },
    [modelViewerWidgetId, isModelViewerDisabled, dispatch]
  )

  const onMultipleFeatureSelectionWarningCancel = useCallback((): void => {
    setMultipleFeatureSelectionWarning(false)
  },[])

  // memoize hook context and wrap all callback functions in useCallback()
  const linkExplorerReturn: LinkExplorerContextType = useMemo(
    () => ({
      setDocumentSelection,
      linkExplorerTitle,
      featureDocumentLinks,
      linksLoading,
      linksInitialized,
      multipleFeatureSelectionWarning,
      onMultipleFeatureSelectionWarningCancel
    }),
    [
      setDocumentSelection,
      linkExplorerTitle,
      featureDocumentLinks,
      linksLoading,
      linksInitialized,
      multipleFeatureSelectionWarning,
      onMultipleFeatureSelectionWarningCancel
    ]
  )

  return linkExplorerReturn
}

export { useLinkExplorer }
