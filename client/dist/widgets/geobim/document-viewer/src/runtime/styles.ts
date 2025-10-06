import { css, type IMThemeVariables, type SerializedStyles } from 'jimu-core'
import { HEADER_LINE_HEIGHT } from 'widgets/shared-code/geobim'

export const modelViewerHeader = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'modelViewerHeader',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    lineHeight: HEADER_LINE_HEIGHT,
    fontSize: `${theme.sys.typography.h5.fontSize}`,
    fontWeight: `${theme.sys.typography.h5.fontWeight}`,
    fontcolor: `${theme.sys.typography.h5.color}`,
    padding: theme.sys.spacing(3),
    backgroundColor: theme.sys.color.surface.paper,
    borderBottom: `solid 1px ${theme.sys.color.divider.primary}`
  })
}

export const modelViewerWrapper = (_theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'modelViewerWrapper',
    position: 'relative',
    width: '100%',
    height: '100%'
  })
}

export const modelViewerAlert = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'modelViewerAlert',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',

    'div.alert-panel': {
      width: '80% !important',
      marginBottom: `${theme.sys.spacing(3)} !important`
    }
  })
}

export const noDocumentMessage = (theme: IMThemeVariables): SerializedStyles => {
  return css({
    label: 'noDocumentMessage',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontcolor: theme.sys.color.action.disabled.text
  })
}
