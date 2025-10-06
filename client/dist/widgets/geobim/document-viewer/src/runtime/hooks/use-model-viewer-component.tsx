import { React, WidgetState } from 'jimu-core'
import {
  type SelectedBimDocument,
  useGeoBIM,
  useModelViewer
} from 'widgets/shared-code/geobim'
const { useMemo, useState, useEffect } = React

interface ModelViewerDocumentsContextType {
  viewerErrorMessage: string | null
  documentVisible: boolean
}

const useModelViewerComponent = (
  bimDocument: SelectedBimDocument | null
): ModelViewerDocumentsContextType => {
  const { showModelViewer, viewDocument, viewerError } = useModelViewer()
  const { widgetState } = useGeoBIM()
  const [documentVisible, setDocumentVisible] = useState<boolean>(false)
  const documentUrl = bimDocument?.document?.url
  const documentSelectedIds = bimDocument?.selectedIds
  const issue = bimDocument?.document.issue
  useEffect(
    function setDocument () {
      if (documentUrl != null && widgetState !== WidgetState.Closed) {
        showModelViewer(true)
        setDocumentVisible(true)
        viewDocument(documentUrl, undefined, documentSelectedIds, issue !== undefined ? [issue] : undefined)
      } else {
        showModelViewer(false)
        setDocumentVisible(false)
      }
    }, [documentSelectedIds, documentUrl, showModelViewer, viewDocument, issue, widgetState]
  )

  const viewerErrorMessage = useMemo(() => {
    if (viewerError === null) return null

    if (viewerError?.errorCode != null) {
      // TODO: Translate error message?
      return `Code ${viewerError.errorCode}: ${viewerError.message}`
    } else {
      return viewerError.message
    }
  }, [viewerError])

  // memoize hook context and wrap all callback functions in useCallback()
  const modelViewerReturn: ModelViewerDocumentsContextType = useMemo(
    () => ({
      viewerErrorMessage,
      documentVisible
    }),
    [documentVisible, viewerErrorMessage]
  )

  return modelViewerReturn
}

export { useModelViewerComponent }
