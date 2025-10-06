/** @jsx jsx */
/** @jsxFrag React.Fragment */
import type { ReactNode } from 'react'
import type { Dispatch } from 'redux'
import { type IMState, React, ReactRedux, jsx } from 'jimu-core'
import {
  type ActionTypes,
  modelViewerDisabledSelector,
  type IDocument,
  setModelViewerLinkedDocument
} from 'widgets/shared-code/geobim'
const { useCallback, useState, createContext, useMemo } = React
const { useSelector, useDispatch } = ReactRedux

interface DocumentsProviderProps {
  modelViewerWidgetId: string
  children: ReactNode
}

interface DocumentsContextType {
  selectedDocument: IDocument | null
  documentPreviewDisabled: boolean
  previewDocument: (document: IDocument) => void
  clearDocumentSelection: () => void
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(
  undefined
)

function DocumentsProvider (props: DocumentsProviderProps): JSX.Element {
  const { modelViewerWidgetId, children } = props
  // NOTE: Only local state for the widget is kept in hooks. All shared state is in the Store.
  const dispatch = useDispatch<Dispatch<ActionTypes>>()
  const isModelViewerDisabled: boolean = useSelector(
    (state: IMState) => modelViewerDisabledSelector(modelViewerWidgetId, state)
  )
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(null)

  const documentPreviewDisabled = useMemo(() => {
    return isModelViewerDisabled || modelViewerWidgetId == null || modelViewerWidgetId === ''
  }, [isModelViewerDisabled, modelViewerWidgetId])

  const clearDocumentSelection = useCallback((): void => {
    setSelectedDocument(null)
  }, [])

  const previewDocument = useCallback((document: IDocument): void => {
    if (documentPreviewDisabled || document == null) {
      return
    }
    if (document.url === selectedDocument?.url) {
      // clear selection so we can set the document again
      setModelViewerLinkedDocument(modelViewerWidgetId, null, null, dispatch)
    }
    setModelViewerLinkedDocument(modelViewerWidgetId, document, null, dispatch)
    setSelectedDocument(document)
  }, [documentPreviewDisabled, selectedDocument?.url, modelViewerWidgetId, dispatch])

  // memoize provider context and wrap all callback functions in useCallback()
  const documentsReturn: DocumentsContextType = useMemo(
    () => {
      return {
        selectedDocument,
        documentPreviewDisabled,
        previewDocument,
        clearDocumentSelection
      }
    },
    [clearDocumentSelection, documentPreviewDisabled, previewDocument, selectedDocument]
  )

  return (
    <DocumentsContext.Provider value={documentsReturn}>
      {children}
    </DocumentsContext.Provider>
  )
}

export { DocumentsProvider, DocumentsContext, type DocumentsContextType }
