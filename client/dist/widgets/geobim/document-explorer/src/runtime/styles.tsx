import { css, type IMThemeVariables, type SerializedStyles } from 'jimu-core'
import { loadingContainerStyle } from 'widgets/shared-code/geobim'

export const documentExplorerControls = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'documentExplorerControls',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.sys.spacing(3),
    backgroundColor: theme.sys.color.surface.paper,
    borderBottom: `solid 1px ${theme.sys.color.divider.primary}`
  })
}

export const searchBox = (_theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'searchBox',
    width: '100%'
  })
}

export const documentsContainer = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'documentsContainer',
    height: '100%',
    overflow: 'auto',
    position: 'relative',
    backgroundColor: theme.sys.color.surface.paper
  })
}

export const documentsLoadingContainer = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'documentsLoadingContainer',
    position: 'relative',
    height: '100%',
    backgroundColor: theme.sys.color.surface.background
  }, loadingContainerStyle(theme))
}

export const treeContainer = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'treeContainer',
    minWidth: 'fit-content',
    padding: theme.sys.spacing(3)
  })
}

export const rootDisplayStyle = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'rootDisplayStyle',
    minWidth: 'fit-content',
    marginLeft: theme.sys.spacing(5)
  })
}

export const rootItemsDisplayStyle = (_theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'rootItemsDisplayStyle',
    minWidth: 'fit-content',
    marginLeft: '0px'
  })
}

export const treeNodeStyle = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'treeNodeStyle',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.sys.spacing(1),
    minWidth: 'fit-content',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: theme.sys.color.primary.main
    }
  })
}

export const treeNodeIcon = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'treeNodeIcon',
    margin: `0 ${theme.sys.spacing(2)} 2px 0`
  })
}

export const treeNodeLoadingStyle = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'treeNodeLoadingStyle',
    display: 'inline-block',
    // HACK: Used to contain and position the ExB loading spinner
    position: 'relative',
    transform: 'scale(0.3)',
    height: '12px', // (same height as the ExB loading spinner inline)
    marginTop: theme.sys.spacing(2),
    marginLeft: theme.sys.spacing(2) // (same as right margin of treeNodeIcon)
  })
}

export const treeChildrenStyle = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'treeChildrenStyle',
    minWidth: 'fit-content',
    marginLeft: theme.sys.spacing(6)
  })
}

export const noDocumentsStyle = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'noDocumentsStyle',
    padding: theme.sys.spacing(1)
  })
}

export const treeDocumentStyle = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'treeDocumentStyle',
    padding: theme.sys.spacing(1),
    minWidth: 'fit-content',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: theme.sys.color.primary.main
    }
  })
}

export const selectedTreeDocumentStyle = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'selectedTreeDocumentStyle',
    backgroundColor: theme.sys.color.secondary.main
  }, treeDocumentStyle(theme))
}

export const noTreeMessageContainer = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'noTreeMessageContainer',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.sys.color.surface.background,
    fontcolor: theme.sys.color.action.disabled.text,
    padding: theme.sys.spacing(2)
  })
}

export const noTreeMessageStyle = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'noTreeMessageStyle',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  })
}
