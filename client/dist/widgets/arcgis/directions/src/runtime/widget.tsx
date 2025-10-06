/** @jsx jsx */
import { React, jsx, css, type AllWidgetProps, DataSourceManager, DataSourceStatus, type FeatureLayerDataSource, UtilityManager, getAppStore, hooks, MutableStoreManager, ReactRedux, type IMState, ServiceManager, type ResourceSessions } from 'jimu-core'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import { defaultMessages as jimuUIMessages, WidgetPlaceholder } from 'jimu-ui'
import Directions from 'esri/widgets/Directions'
import RouteLayer from 'esri/layers/RouteLayer'
import PointBarrier from "esri/rest/support/PointBarrier"
import PolylineBarrier from "esri/rest/support/PolylineBarrier"
import PolygonBarrier from "esri/rest/support/PolygonBarrier"

import type { IMConfig } from '../config'
import { getDirectionPointOutputDsId, getDirectionLineOutputDsId, getRouteOutputDsId, getStopOutputDsId, getDefaultOrgUnit, convertSearchConfigToJSAPISearchProperties, getUrlOfUseUtility, getAddressFromSources } from '../utils'
import defaultMessages from './translations/default'
import WidgetIcon from '../../icon.svg'
import UtilsAlert from './components/utils-alert'

const { useEffect, useState, useRef, useCallback, useMemo } = React

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const { config, id } = props
  const { searchConfig, routeConfig } = config
  const isDarkTheme = props.theme?.sys.color.mode === 'dark'
  const useMapWidgetId = props.useMapWidgetIds?.[0]
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null)
  const sessionsRef = useRef<ResourceSessions>(null)
  const [utilitiesChangedFlag, setUtilitiesChangedFlag] = useState(Math.random())
  const containerRef = useRef<HTMLDivElement>(null)
  const directionsRef = useRef<__esri.Directions>(null)
  const watchLastRouteRef = useRef<__esri.WatchHandle>(null)
  const translate = hooks.useTranslation(defaultMessages, jimuUIMessages)
  const defaultSearchHint = useMemo(() => translate('findAddressOrPlace'), [translate])
  const [isReadyToRender, setIsReadyToRender] = useState<boolean>(false)
  const resourceSessions = ReactRedux.useSelector((state: IMState) => {
    return state.resourceSessions
  })

  const onActiveMapViewChange = useCallback(activeView => {
    setJimuMapView(activeView)
  }, [])

  const updateFromDataAction = useCallback(async () => {
    if (isReadyToRender && directionsRef.current && props.mutableStateProps) {
      const { directionsFromPoint, directionsToPoint, routeStops } = props.mutableStateProps

      if (directionsFromPoint) {
        const address = await getAddressFromSources(directionsFromPoint, searchConfig)
        directionsRef.current.layer.stops.at(0).geometry = directionsFromPoint
        directionsRef.current.layer.stops.at(0).name = address
        // Clean up once used
        MutableStoreManager.getInstance().updateStateValue(props.widgetId, 'directionsFromPoint', null)
        return
      }

      if (directionsToPoint) {
        const address = await getAddressFromSources(directionsToPoint, searchConfig)
        const stopLength = directionsRef.current.layer.stops.length
        directionsRef.current.layer.stops.at(stopLength - 1).geometry = directionsToPoint
        directionsRef.current.layer.stops.at(stopLength - 1).name = address
        MutableStoreManager.getInstance().updateStateValue(props.widgetId, 'directionsToPoint', null)
        return
      }

      if (routeStops) {
        const localStops = routeStops
        const stops = await Promise.all(localStops.map(async stopPoint => {
          const addressName = await getAddressFromSources(stopPoint, searchConfig)
          return {
            geometry: stopPoint,
            name: addressName
          }
        }))
        directionsRef.current.layer.stops.removeAll()
        directionsRef.current.layer.stops.addMany(stops)
        MutableStoreManager.getInstance().updateStateValue(props.widgetId, 'routeStops', null)
        return
      }

      await directionsRef.current.viewModel.load()
      // If valid stops are greater than two
      if (directionsRef.current.viewModel.layer.stops.filter(point => point.geometry !== null).length >= 2) {
        await directionsRef.current.viewModel.getDirections()
      }
    }
  }, [isReadyToRender, props.mutableStateProps, props.widgetId, searchConfig])

  useEffect(() => {
    function helper () {
      if (useMapWidgetId && routeConfig?.useUtility && searchConfig?.dataConfig?.length > 0) {
        const utilities = getAppStore().getState().appConfig?.utilities
        const isAnySearchUtilReady = searchConfig.dataConfig.some(searchDataConfig => {
          return !!searchDataConfig.useDataSource || utilities[searchDataConfig.useUtility.utilityId]
        })
        const isUtilReady = !!(utilities && utilities[routeConfig.useUtility.utilityId] && isAnySearchUtilReady)
        setIsReadyToRender(!!(routeConfig && isUtilReady))
      } else {
        setIsReadyToRender(false)
      }
    }
    helper()
  }, [useMapWidgetId, routeConfig?.useUtility, searchConfig?.dataConfig, routeConfig, props?.useUtilities])

  useEffect(() => {
    updateFromDataAction()
  })

  useEffect(() => {
    checkUtilityAccount()

    async function checkUtilityAccount () {
      if (sessionsRef.current === resourceSessions || !props?.useUtilities) {
        return
      }

      const prevResourceSessions = sessionsRef.current
      sessionsRef.current = resourceSessions

      const utilUrls = props?.useUtilities?.map(useUtility => {
        return UtilityManager.getInstance().getUtilityJson(useUtility.utilityId)?.url
      })
      const serverInfos = await Promise.all(utilUrls.map(utilUrl => {
        return ServiceManager.getInstance().fetchArcGISServerInfo(utilUrl)
      }))
      const urlSet = new Set<string>()
      for (let i = 0; i < utilUrls.length; i++) {
        urlSet.add(serverInfos[i].owningSystemUrl || utilUrls[i])
      }
      const urls = [...urlSet]
      const resourceSessionsKeys = Object.keys(resourceSessions || {})

      for (const url of urls) {
        // Owning system url exact match, `url` here is the owning system url
        if (resourceSessions[url] && resourceSessions[url] !== prevResourceSessions?.[url]) {
          setUtilitiesChangedFlag(Math.random())
          return
        }
        for (const resourceUrl of resourceSessionsKeys) {
          // The resource url is part of the full util url
          if (url.includes(resourceUrl) && resourceSessions[resourceUrl] !== prevResourceSessions?.[resourceUrl]) {
            setUtilitiesChangedFlag(Math.random())
            return
          }
        }
      }
    }
  }, [props?.useUtilities, resourceSessions])

  useEffect(() => {
    if (isReadyToRender && jimuMapView?.view && containerRef.current) {
      updateDirectionsWidget()
    } else {
      destroyDirectionsWidget()
    }

    async function updateDirectionsWidget(isClearTriggered?: boolean) {
      destroyDirectionsWidget()
      const rawRouteServiceUrl = getUrlOfUseUtility(routeConfig?.useUtility)
      // const routeServiceUrl = proxyUtils.getWhetherUseProxy() ? proxyUtils.getProxyUrl(rawRouteServiceUrl) || rawRouteServiceUrl : rawRouteServiceUrl
      const routeServiceUrl = rawRouteServiceUrl
      const searchProperties = await convertSearchConfigToJSAPISearchProperties(searchConfig, defaultSearchHint)
      const barrierLayers = await getBarrierLayers()
      const c = document.createElement('div')
      c.className = 'directions-container'
      if (isDarkTheme) {
        c.className += ' dark-theme'
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
        containerRef.current.appendChild(c)
      }

      const routeTitle = `${props.label} - ${translate('route')}`
      const newRouteLayer = new RouteLayer({
        id,
        url: routeServiceUrl,
        title: routeTitle,
        pointBarriers: barrierLayers?.points,
        polylineBarriers: barrierLayers?.polylines,
        polygonBarriers: barrierLayers?.polygons
      })
      if (typeof config.showRuntimeLayers === 'boolean' && !config.showRuntimeLayers) {
        newRouteLayer.listMode = 'hide'
      }

      directionsRef.current = new Directions({
        id,
        layer: newRouteLayer,
        container: c,
        view: jimuMapView?.view,
        searchProperties: searchProperties,
        unit: config?.unit ?? getDefaultOrgUnit(),
        // TODO: Wait for API update
        visibleElements: {
          printButton: false
        } as any
      })

      const prevRouteLayer = directionsRef.current.view.map.findLayerById(id)
      if (prevRouteLayer) {
        jimuMapView?.view?.map?.remove(prevRouteLayer)
      }
      jimuMapView?.view?.map?.add(newRouteLayer)

      // Default option is true
      if (!(config?.enableRouteSaving ?? true)) {
        directionsRef.current.visibleElements = {
          printButton: false,
          saveAsButton: false,
          saveButton: false,
          layerDetails: false,
        } as any
      }

      // Set route parameters to get needed data from route service.
      directionsRef.current.viewModel.routeParameters.returnRoutes = true
      directionsRef.current.viewModel.routeParameters.returnDirections = true
      directionsRef.current.viewModel.routeParameters.returnStops = true

      // Refresh the whole widget for correct barrier settings
      // 1. Preset barrier should be kept
      // 2. Runtime added barrier should be removed
      directionsRef.current.viewModel.reset = () => {
        updateDirectionsWidget(true)
      }

      // Get start/end point from the action for widget-controller scenario
      updateFromDataAction()

      setOutputDssNotReady(id)
      watchLastRoute()
      setPresetStops(isClearTriggered)
    }

    function watchLastRoute () {
      watchLastRouteRef.current = directionsRef.current.watch('lastRoute', () => {
        if (props.autoHeight) {
          // Add max height to container for auto height style
          containerRef.current.style.maxHeight = '750px'
        }
        if (directionsRef.current.lastRoute) { // If there is route result, change status of output data sources to unloaded.
          setOutputDssUnloadedAndSetLayer(id, directionsRef.current.lastRoute)
        } else { // If there isn't route result, change status of output data sources to not_ready.
          setOutputDssNotReady(id)
        }
      })
    }

    function destroyDirectionsWidget() {
      // If do not have map, destroy will throw error.
      if (directionsRef.current?.view?.map) {
        const prevRouteLayer = directionsRef.current.view.map.findLayerById(id)
        if (prevRouteLayer && jimuMapView) {
          jimuMapView.view.map.remove(prevRouteLayer)
        }
        directionsRef.current.destroy()
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      try {
        // Remove save as popper.
        const saveAsPopper = document.querySelector('calcite-panel.esri-save-layer')?.parentElement
        if (saveAsPopper && saveAsPopper.tagName.toUpperCase() === 'CALCITE-POPOVER') {
          document.body.removeChild(saveAsPopper)
        }
      } catch (e) {}
    }

    async function getBarrierLayers() {
      if (!jimuMapView) {
        return null
      }
      const barrierJlvIds = routeConfig?.barrierLayers?.[jimuMapView.id]
      if (!barrierJlvIds) {
        return null
      }
      const barrierLayers = {
        points: [],
        polylines: [],
        polygons: [],
      }
      for (const jlvId of barrierJlvIds) {
        const jlv = await jimuMapView.whenJimuLayerViewLoaded(jlvId)
        let ds = jlv.getLayerDataSource()
        const dsId = jlv.layerDataSourceId

        if (!ds) {
          ds = await jimuMapView.getMapDataSource().createDataSourceById(dsId)
        }
        const { records } = await (ds as any).query({ where: '1=1', returnGeometry: true })
        switch (ds.getGeometryType()) {
          case 'esriGeometryPoint': {
            const barriers = records.map(record => {
              return new PointBarrier({ geometry: record.getGeometry() })
            })
            barrierLayers.points.push(...barriers)
            break
          }
          case 'esriGeometryPolyline': {
            const barriers = records.map(record => {
              return new PolylineBarrier({ geometry: record.getGeometry() })
            })
            barrierLayers.polylines.push(...barriers)
            break
          }
          case 'esriGeometryPolygon': {
            const barriers = records.map(record => {
              return new PolygonBarrier({ geometry: record.getGeometry() })
            })
            barrierLayers.polygons.push(...barriers)
            break
          }
          default: {
            break
          }
        }
      }
      return barrierLayers
    }

    async function setPresetStops(isClearTriggered?: boolean) {
      if (isClearTriggered || !routeConfig) {
        return
      }
      if (!routeConfig.presetStart && !routeConfig.presetEnd) {
        return
      }
      if (routeConfig.presetStart) {
        directionsRef.current.layer.stops.at(0).name = routeConfig.presetStart.name
        directionsRef.current.layer.stops.at(0).geometry = routeConfig.presetStart.geometry
      }
      if (routeConfig.presetEnd) {
        directionsRef.current.layer.stops.at(1).name = routeConfig.presetEnd.name
        directionsRef.current.layer.stops.at(1).geometry = routeConfig.presetEnd.geometry
      }

      await directionsRef.current.viewModel.load()
      if (routeConfig.presetStart && routeConfig.presetEnd) {
        directionsRef.current.getDirections()
      }
    }

    return () => {
      watchLastRouteRef.current?.remove()
      destroyDirectionsWidget()
    }
  }, [id, jimuMapView?.view, searchConfig, defaultSearchHint, isReadyToRender, isDarkTheme, props.autoHeight, updateFromDataAction, utilitiesChangedFlag, props.label, translate, config?.showRuntimeLayers, config?.unit, jimuMapView, routeConfig, config?.enableRouteSaving])

  return (
    <div className='widget-directions jimu-widget'>
      {
        isReadyToRender
          ?
          <React.Fragment>
            <JimuMapViewComponent useMapWidgetId={useMapWidgetId} onActiveViewChange={onActiveMapViewChange} />
            <div ref={containerRef} css={style}></div>
            <UtilsAlert useUtilities={props.useUtilities} ></UtilsAlert>
          </React.Fragment>
          :
          <WidgetPlaceholder widgetId={id} icon={WidgetIcon} name={translate('_widgetLabel')} />
      }
    </div>
  )
}

export default Widget

const style = css`
  width: 100% !important;
  height: 100% !important;
  .directions-container{
    width: 100% !important;
    height: 100% !important;
    overflow: scroll;
    .esri-search{
      .esri-search__container{
        .esri-search__sources-button{
          z-index: 0;
          border-top: none;
          border-right: solid 1px var(--ref-palette-neutral-400);
          border-bottom: none;
          border-left: none;
          margin-right: 1px;
          margin-bottom: 2px;
        }
        .esri-search__input-container{
          margin: auto;
          .esri-search__clear-button{
            z-index: 0;
            right: 1px;
          }
        }
      }
      .esri-search--multiple-sources {
        .esri-search__sources-button {
          border-right: inherit;
        }
        .esri-search__input {
          border: 1px solid #959595;
        }
      }
    }
    .esri-directions__panel-content{
      padding: 0 0 20px 0;
      div[role='button'] {
        cursor: unset;
      }
    }
    .esri-directions__add-stop-button{
      --calcite-ui-text-1: var(--ref-palette-neutral-1200);
    }
    &.dark-theme img.esri-directions__maneuver-icon{
      filter: invert(100%);
    }
  }
`

async function setOutputDssNotReady (widgetId: string) {
  try {
    const stopOutputDs = await DataSourceManager.getInstance().createDataSource(getStopOutputDsId(widgetId)) as FeatureLayerDataSource
    const routeOutputDs = await DataSourceManager.getInstance().createDataSource(getRouteOutputDsId(widgetId)) as FeatureLayerDataSource
    const directionPointOutputDs = await DataSourceManager.getInstance().createDataSource(getDirectionPointOutputDsId(widgetId)) as FeatureLayerDataSource
    const directionLineOutputDs = await DataSourceManager.getInstance().createDataSource(getDirectionLineOutputDsId(widgetId)) as FeatureLayerDataSource

    setDsNotReady(stopOutputDs)
    setDsNotReady(routeOutputDs)
    setDsNotReady(directionPointOutputDs)
    setDsNotReady(directionLineOutputDs)
  } catch (e) {
    console.log('Failed to create directions output data sources. ', e)
  }
}

async function setOutputDssUnloadedAndSetLayer (widgetId: string, result: __esri.RouteLayerSolveResult) {
  try {
    const stopOutputDs = await DataSourceManager.getInstance().createDataSource(getStopOutputDsId(widgetId)) as FeatureLayerDataSource
    const routeOutputDs = await DataSourceManager.getInstance().createDataSource(getRouteOutputDsId(widgetId)) as FeatureLayerDataSource
    const directionPointOutputDs = await DataSourceManager.getInstance().createDataSource(getDirectionPointOutputDsId(widgetId)) as FeatureLayerDataSource
    const directionLineOutputDs = await DataSourceManager.getInstance().createDataSource(getDirectionLineOutputDsId(widgetId)) as FeatureLayerDataSource

    await createJSAPILayerForDs(stopOutputDs, 'point', convertToJSAPIGraphic(result.stops?.toArray()))
    await createJSAPILayerForDs(routeOutputDs, 'polyline', convertToJSAPIGraphic(result.routeInfo ? [result.routeInfo] : []))
    await createJSAPILayerForDs(directionPointOutputDs, 'point', convertToJSAPIGraphic(result.directionPoints?.toArray()))
    await createJSAPILayerForDs(directionLineOutputDs, 'polyline', convertToJSAPIGraphic(result.directionLines?.toArray()))

    setDsUnloaded(stopOutputDs)
    setDsUnloaded(routeOutputDs)
    setDsUnloaded(directionPointOutputDs)
    setDsUnloaded(directionLineOutputDs)
  } catch (e) {
    console.log('Failed to create directions output data sources. ', e)
  }
}

function setDsNotReady (ds: FeatureLayerDataSource) {
  if (ds) {
    ds.setStatus(DataSourceStatus.NotReady)
    ds.setCountStatus(DataSourceStatus.NotReady)
  }
}

function setDsUnloaded (ds: FeatureLayerDataSource) {
  if (ds) {
    ds.setStatus(DataSourceStatus.Unloaded)
    ds.setCountStatus(DataSourceStatus.Unloaded)
  }
}

async function createJSAPILayerForDs (ds: FeatureLayerDataSource, geoType: 'point' | 'polyline', source: __esri.Graphic[]) {
  if (!ds) {
    return
  }
  await ds.setSourceFeatures(source, {
    id: ds.id,
    geometryType: geoType
  })
}

function convertToJSAPIGraphic (res: __esri.Stop[] | __esri.RouteInfo[] | __esri.DirectionLine[] | __esri.DirectionPoint[]): __esri.Graphic[] {
  if (!res) {
    return []
  }
  return res.map((r: __esri.Stop | __esri.RouteInfo | __esri.DirectionLine | __esri.DirectionPoint) => r?.toGraphic()).filter(g => !!g)
}
