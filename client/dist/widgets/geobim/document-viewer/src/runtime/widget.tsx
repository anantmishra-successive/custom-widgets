/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { React, jsx, type AllWidgetProps } from 'jimu-core'
import { WidgetPlaceholder } from 'jimu-ui'
import {
  defaultSharedMessages,
  GeoBIMProvider,
  useSharedMessages
} from 'widgets/shared-code/geobim'
import type { IMConfig } from '../config'
import defaultMessages from './translations/default'
import documentViewerIcon from '../../icon.svg'
import ModelViewerWidget from './components/model-viewer-widget'
const { useCallback } = React

const DocumentViewerWidget = (props: AllWidgetProps<IMConfig>): JSX.Element => {
  const { useMapWidgetIds, id, intl, theme, widgetId, state, manifest } = props
  const { translateMessage } = useSharedMessages(intl, manifest.translatedLocales)

  const i18nMessage = useCallback(
    (
      id: keyof typeof defaultMessages | keyof typeof defaultSharedMessages.default,
      values?: { [key: string]: string }
    ): string => {
      // NOTE: defaultMessages is last to ensure it takes priority over defaultSharedMessages
      const defaultLocaleMessages = { ...defaultSharedMessages.default, ...defaultMessages }

      // In the future if strings get loaded by the framework then we can restore
      // the following call to formatMessage and remove the call to translateMessage
      // and the useSharedMessages hook.
      // return intl.formatMessage({ id: id, defaultMessage: messages[id] }, values)
      return translateMessage(id, defaultLocaleMessages, values)
    },
    [translateMessage]
  )
  const currentMapWidgetId = useMapWidgetIds?.[0]
  const appConfigured = true // (false if there is an undesired Settings state for a widget)

  return (
    <>
      {!appConfigured && (
        <WidgetPlaceholder
          icon={documentViewerIcon}
          message={i18nMessage('widgetTitle')}
          widgetId={id}
        />
      )}
      {appConfigured && (
        <>
          <GeoBIMProvider mapWidgetId={currentMapWidgetId} widgetId={widgetId} widgetState={state}>
            <ModelViewerWidget i18nMessage={i18nMessage} theme={theme} widgetId={widgetId} />
          </GeoBIMProvider>
        </>
      )}
    </>
  )
}

export default DocumentViewerWidget
