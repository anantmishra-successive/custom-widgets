import { React, ReactRedux, type IMState, type AllWidgetProps } from 'jimu-core'
import { versionManager } from '../version-manager'
import { ListRuntimeStateProvider } from './state'
import type { IMConfig } from '../config'
import List from './components/list-widget'
import { getExtraStateProps } from './utils/utils'

const { useSelector } = ReactRedux

const Widget = (props: AllWidgetProps<IMConfig>): React.ReactElement => {
  const extraStatePropsRef = React.useRef(null)
  const extraStateProps = useSelector((state: IMState) => {
    const extraState = getExtraStateProps(state, props)
    if (JSON.stringify(extraStatePropsRef.current) === JSON.stringify(extraState)) {
      return extraStatePropsRef.current
    } else {
      extraStatePropsRef.current = extraState
      return extraState
    }
  })

  return (
    <div className='jimu-widget widget-chart'>
      <ListRuntimeStateProvider>
        <List
          {...extraStateProps}
          {...props}
        />
      </ListRuntimeStateProvider>
    </div>
  )
}

Widget.versionManager = versionManager

export default Widget
