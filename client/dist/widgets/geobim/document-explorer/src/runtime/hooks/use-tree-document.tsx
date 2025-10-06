import { React } from 'jimu-core'
import { DocumentsContext, type DocumentsContextType } from '../providers/documents-provider'
import type { IDocument } from 'widgets/shared-code/geobim'
const { useContext, useMemo } = React

interface UseTreeDocumentContextType {
  selectedDocument: IDocument | null
  previewDocument: (document: IDocument) => void
}

function useTreeDocument (): UseTreeDocumentContextType {
  const documentsContext = useContext<DocumentsContextType | undefined>(DocumentsContext)
  if (documentsContext === undefined) {
    throw new Error('Must call useTree inside of DocumentsProvider')
  }
  const { previewDocument, selectedDocument } = documentsContext

  // memoize context and wrap all callback functions in useCallback()
  const useTreeDocumentReturn: UseTreeDocumentContextType = useMemo(
    () => ({
      selectedDocument,
      previewDocument
    }),
    [previewDocument, selectedDocument]
  )

  return useTreeDocumentReturn
}

export { useTreeDocument, type UseTreeDocumentContextType }
