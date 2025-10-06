/** @jsx jsx */
import { jsx, hooks } from 'jimu-core'
import type { DataSource } from 'jimu-core'
import { defaultMessages as jimuLayoutsDefaultMessages } from 'jimu-layouts/layout-runtime'
import { defaultMessages as jimuUIDefaultMessages } from 'jimu-ui'
import defaultMessages from '../../translations/default'
import { Fragment } from 'react'
import { ClickOutlined } from 'jimu-icons/outlined/application/click'

interface Props {
  datasource: DataSource
}

const DataSourcePlaceholder = (props: Props) => {
  const nls = hooks.useTranslation(defaultMessages, jimuUIDefaultMessages, jimuLayoutsDefaultMessages)
  const { datasource } = props
  return (
    <Fragment>
      {!datasource && <div className='w-100 text-center datasource-placeholder flex-grow-1 d-flex flex-column justify-content-center align-items-center'>
        <div className="w-100">
          <ClickOutlined size={48}/>
          <p className='text-Secondary' id='list-empty-tip'>
            {nls('listBlankStatus', {
              ButtonString: nls('setDataSource')
            })}
          </p>
        </div>
      </div>}
    </Fragment>
  )
}
export default DataSourcePlaceholder