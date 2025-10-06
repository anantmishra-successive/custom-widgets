/** @jsx jsx */
import { classNames, css, hooks, jsx, React, ReactDOM, utils as jimuUtils } from 'jimu-core'
import {
  Button, Loading, defaultMessages, type ControlPosition, Draggable, type DraggableData,
  type DraggableEvent, type StyleState,
  LoadingType
} from 'jimu-ui'
import { styled } from 'jimu-theme'
import { MinusOutlined } from 'jimu-icons/outlined/editor/minus'
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus'

const Root = styled('div')(css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`)

interface ImageProps {
  scale: number
}

const Image = styled('img')<StyleState<ImageProps>>(({ theme, styleState }) => {
  return css`
    width: 100%;
    height: 100%;
    object-fit: contain;
    scale: ${styleState.scale};
    user-select: none;
    cursor: pointer;
  `
})

const Tools = styled('div')(({ theme }) => css`
  height: 36px;
  border-radius: 18px;
  background-color: ${theme.sys.color.surface.overlay};
  position: absolute;
  left: 50%;
  bottom: 56px;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
`)

const Zoom = styled(Button)(({ theme }) => css`
  background-color: transparent;
  color: ${theme.sys.color.surface.overlayText};
`)

const Percent = styled('span')(({ theme }) => css`
  color: ${theme.sys.color.surface.overlayText};
  font-size: 16px;
  width: 50px;
  text-align: center;
`)

interface PanZoomImageProps {
  src: string
  isCurrent: boolean
}

export const ImagePanZoom = (props: PanZoomImageProps) => {
  const { src, isCurrent } = props
  const [position, setPosition] = React.useState<ControlPosition>({x: 0, y: 0})
  const [percent, setPercent] = React.useState(1)
  const [loading, setLoading] = React.useState(true)

  const translate = hooks.useTranslation(defaultMessages)

  const rootRef = React.useRef<HTMLDivElement>(null)
  const imageRef = React.useRef<HTMLImageElement>(null)

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = React.useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setLoading(false)
  }, [])

  const handleZoomOut = React.useCallback(() => {
    setPercent(oldPercent => {
      let newPercent = oldPercent
      if (oldPercent > 0.1) {
        const variation = oldPercent > 1 ? 0.2 : 0.1
        newPercent = Math.round((oldPercent - variation) * 10) / 10
      } else {
        newPercent = 0.1
      }
      return newPercent
    })
  }, [])

  const handleZoomIn = React.useCallback(() => {
    setPercent(oldPercent => {
      let newPercent = oldPercent
      if (oldPercent < 10) {
        const variation = oldPercent >= 1 ? 0.2 : 0.1
        newPercent = Math.round((oldPercent + variation) * 10) / 10
      } else {
        newPercent = 10
      }
      return newPercent
    })
  }, [])

  const handleWheel = React.useCallback((event: WheelEvent) => {
    if (event.deltaY > 0) {
      handleZoomOut()
    } else {
      handleZoomIn()
    }
    event.preventDefault()
    event.stopPropagation()
  }, [handleZoomIn, handleZoomOut])

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      root.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

  const handleDrag = React.useCallback((e: DraggableEvent, data: DraggableData) => {
    ReactDOM.flushSync(() => {
      setPosition({ x: data.x, y: data.y })
    })
  }, [])

  const pinchStartDistance = React.useRef<number>(null)
  const pinchStartPercent = React.useRef<number>(null)
  const latestPercent = hooks.useLatest(percent)
  const handleTouchStart = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.targetTouches.length === 2) {
      pinchStartDistance.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      pinchStartPercent.current = latestPercent.current
    }
  }, [latestPercent])

  const handleTouchMove = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (typeof pinchStartDistance.current === 'number' && e.targetTouches.length === 2) {
      const newDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      let newPercent = pinchStartPercent.current * newDistance / pinchStartDistance.current
      if (newPercent < 0.1) {
        newPercent = 0.1
      } else if (newPercent > 10) {
        newPercent = 10
      }
      ReactDOM.flushSync(() => {
        setPercent(newPercent)
      })
    }
  }, [])

  const handleTouchEnd = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (typeof pinchStartDistance.current === 'number') {
      pinchStartDistance.current = null
      pinchStartPercent.current = null
    }
  }, [])

  const percentText = React.useMemo(() => {
    if (typeof percent === 'number') {
      return jimuUtils.formatPercentageNumber(Math.round((percent * 100) * 10) / 10 + '%')
    } else {
      return ''
    }
  }, [percent])

  return <Root
    ref={rootRef}
    className={classNames({ 'd-none': !isCurrent })}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    <Draggable
      bounds={false}
      position={position}
      onDrag={handleDrag}
    >
      <div className='w-100 h-100'>
        <Image
          ref={imageRef}
          src={src}
          draggable={false}
          className='jimu-image-viewer-image'
          styleState={{ scale: percent }}
          onLoad={handleLoad}
          onError={handleLoad}
        />
        {loading && <Loading type={LoadingType.Donut} />}
      </div>
    </Draggable>
    <Tools className='jimu-image-viewer-tools'>
      <Zoom
        className='jimu-image-viewer-zoom-out'
        aria-label={translate('zoomOut')}
        disableHoverEffect
        disableRipple
        icon
        variant='text'
        onClick={handleZoomOut}
      >
        <MinusOutlined />
      </Zoom>
      <Percent className='jimu-image-viewer-percent'>{percentText}</Percent>
      <Zoom
        className='jimu-image-viewer-zoom-in'
        aria-label={translate('zoomIn')}
        disableHoverEffect
        disableRipple
        icon
        variant='text'
        onClick={handleZoomIn}
      >
        <PlusOutlined />
      </Zoom>
    </Tools>
  </Root>
}