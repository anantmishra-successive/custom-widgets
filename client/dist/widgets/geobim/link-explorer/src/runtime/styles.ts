import { css, type IMThemeVariables, type SerializedStyles } from 'jimu-core'
import { HEADER_LINE_HEIGHT } from 'widgets/shared-code/geobim'

export const linkExplorerHeader = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'linkExplorerHeader',
    lineHeight: HEADER_LINE_HEIGHT,
    fontSize: `${theme.sys.typography.h5.fontSize}`,
    fontWeight: `${theme.sys.typography.h5.fontWeight}`,
    fontcolor: `${theme.sys.typography.h5.color}`,
    padding: theme.sys.spacing(3),
    backgroundColor: theme.sys.color.surface.paper,
    borderBottom: `solid 1px ${theme.sys.color.divider.primary}`
  })
}

export const documentLinkList = (_theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'documentLinkList',
    flexBasis: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    overflowY: 'auto'
  })
}

export const documentLinkListItem = (theme: IMThemeVariables): SerializedStyles => {
  const focusBorderThickness = '3px'
  return css({
    label: 'documentLinkListItem',
    padding: theme.sys.spacing(2),
    borderBottom: `solid 1px ${theme.sys.color.divider.primary}`,
    cursor: 'pointer',
    textDecoration: 'underline',
    // animate hover state with color and underlined text
    transition: 'background-color 0.3s ease-in-out, text-decoration-color 0.3s ease-in-out',
    textDecorationColor: 'transparent',
    backgroundColor: theme.sys.color.surface.paper,
    '&:hover': {
      textDecorationColor: 'inherit'
    },
    '&:focus': {
      borderLeft: `solid ${focusBorderThickness} ${theme.sys.color.primary.main}`,
      paddingLeft: `calc(${theme.sys.spacing(2)} - ${focusBorderThickness})`,
      outline: '0px !important' // (prevents issues with ExB focus effects)
    }
  })
}

export const documentTitle = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'documentTitle',
    fontWeight: `${theme.ref.typeface.fontWeightBold}`
  })
}

export const documentInfo = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'documentInfo',
    fontcolor: theme.sys.color.action.disabled.text
  })
}

export const noDocumentsMessage = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'noDocumentsMessage',
    flexBasis: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontcolor: theme.sys.color.action.disabled.text
  })
}
