/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { React, jsx, type IMThemeVariables } from 'jimu-core'
import {
  type DocumentRepositoryItem,
  areIDocumentsEqual
} from 'widgets/shared-code/geobim'
import { useTreeDocument } from '../../hooks/use-tree-document'
import { treeDocumentStyle, selectedTreeDocumentStyle } from '../../styles'

export interface TreeDocumentProps {
  theme: IMThemeVariables
  documentItem: DocumentRepositoryItem
}

const TreeDocument = (props: TreeDocumentProps): JSX.Element => {
  const { theme, documentItem } = props
  const {
    selectedDocument,
    previewDocument
  } = useTreeDocument()
  const isSelected = selectedDocument !== null && areIDocumentsEqual(documentItem.document, selectedDocument)

  const onDocumentClick = (): void => {
    previewDocument(documentItem.document)
  }

  return (
    <div
      onClick={onDocumentClick}
      css={isSelected ? selectedTreeDocumentStyle(theme) : treeDocumentStyle(theme)}
    >
      {documentItem.label}
    </div>
  )
}

export default TreeDocument
