/** @jsx jsx */
import { appConfigUtils, css, hooks, jsx, React } from 'jimu-core'
import { Button, Modal, type StyleState, defaultMessages as jimuUIMessages } from 'jimu-ui'
import { styled } from 'jimu-theme'
import { LeftOutlined } from 'jimu-icons/outlined/directional/left'
import { RightOutlined } from 'jimu-icons/outlined/directional/right'
import { CloseOutlined } from 'jimu-icons/outlined/editor/close'
import defaultMessages from '../translations/default'
import { FullscreenViewOutlined } from 'jimu-icons/outlined/application/fullscreen-view'
import { ImagePanZoom } from './image-pan-zoom'
import { ImageDots } from './image-dots'


export interface ImageWidgetViewerProps {
  /**
   * An array of images' src list.
   */
  srcList: string[]
  /**
   * The default image's index in the `srcList` when the image viewer is loaded.
   * @default 0
   */
  defaultIndex?: number
}

const ViewerButton = styled(Button)(css`
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
  border-radius: 50%;
  border: none;
  opacity: .7;
  &:hover {
    opacity: 1;
  }
`)

const ViewerModal = styled(Modal)(css`
&.modal-dialog {
  width: 100%;
  height: 100%;
  max-width: 100vw;
  margin: 0;
  backdrop-filter: blur(3px);
  .modal-content{
    width: 100%;
    height: 100%;
    border: 0 !important;
    background-color: transparent !important;
  }
}
`)

const Viewer = styled('div')(css`
  width: 100%;
  height: 100%;
  .jimu-image-viewer-dots {
    position: absolute;
    z-index: 1;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
  }
`)

const Close = styled(Button)(css`
  position: absolute;
  right: 8px;
  top: 8px;
  border-radius: 50%;
  border: none;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`)

interface ImageViewerArrowProps {
  type: 'previous' | 'next'
}

const Arrow = styled(Button)<StyleState<ImageViewerArrowProps>>(({ styleState }) => css`
  position: absolute;
  ${styleState.type === 'previous' ? 'left: 8px;' : ''}
  ${styleState.type === 'next' ? 'right: 8px;' : ''}
  top: 50%;
  translate: 0 -50%;
  padding: 0;
  color: rgba(255, 255, 255, 0.8);
  svg {
    height: 32px;
    filter: drop-shadow(0 0 4px #000);
  }
  &:hover {
    color: rgba(255, 255, 255, 1);
    svg {
      filter: drop-shadow(0 0 6px #000);
    }
  }
`)

export const ImageWidgetViewer = (props: ImageWidgetViewerProps) => {
  const { srcList = [], defaultIndex = 0 } = props
  const [showViewer, setShowViewer] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [launchedIndexes, setLaunchedIndexes] = React.useState<number[]>([defaultIndex])

  const translate = hooks.useTranslation(defaultMessages, jimuUIMessages)

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowViewer(true)
    event.stopPropagation()
  }

  const handleToggle = (e: React.KeyboardEvent<any>) => {
    if (e.type === 'keyup' && e.key === 'Escape') {
      setShowViewer(false)
    }
  }

  const handleClose = () => {
    setShowViewer(false)
  }

  const setCurrentImage = React.useCallback((index: number) => {
    const newIndex = index
    setCurrentIndex(newIndex)
    if (!launchedIndexes.includes(newIndex)) {
      setLaunchedIndexes(old => {
        const newIndexes = [...old]
        newIndexes.push(newIndex)
        return newIndexes
      })
    }
  }, [launchedIndexes])

  const handlePrevious = React.useCallback(() => {
    let newIndex = currentIndex - 1
    if (newIndex < 0) {
      newIndex = srcList.length - 1
    }
    setCurrentImage(newIndex)
  }, [currentIndex, setCurrentImage, srcList.length])

  const handleNext = React.useCallback(() => {
    let newIndex = currentIndex + 1
    if (newIndex > srcList.length - 1) {
      newIndex = 0
    }
    setCurrentImage(newIndex)
  }, [currentIndex, setCurrentImage, srcList.length])

  React.useEffect(() => {
    const listenKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious()
      } else if (event.key === 'ArrowRight') {
        handleNext()
      }
    }
    document.addEventListener('keydown', listenKeyDown)
    return () => {
      document.removeEventListener('keydown', listenKeyDown)
    }
  }, [handleNext, handlePrevious])

  const multiple = srcList.length > 1

  return <React.Fragment>
    {srcList.length > 0 && <ViewerButton
      aria-label={translate('imageViewer')}
      disableHoverEffect
      icon
      variant='contained'
      size='sm'
      onClick={handleOpen}
    >
      <FullscreenViewOutlined />
    </ViewerButton>}
    <ViewerModal isOpen={showViewer} centered={true} keyboard={true} toggle={handleToggle}>
      <Viewer>
        {srcList.filter((src, i) => src && launchedIndexes.includes(i)).map((src, i) =>
          <ImagePanZoom key={i} isCurrent={currentIndex === i} src={appConfigUtils.processResourceUrl(src)} />
        )}
        <Close
          className='jimu-image-viewer-close'
          aria-label={translate('closeTour')}
          icon
          disableHoverEffect
          variant='contained'
          size='sm'
          onClick={handleClose}
        >
          <CloseOutlined />
        </Close>
        {multiple && <React.Fragment>
          <Arrow
            className='jimu-image-viewer-previous'
            aria-label={translate('previous')}
            disableHoverEffect
            disableRipple
            icon
            variant='text'
            styleState={{type: 'previous'}}
            onClick={handlePrevious}
          >
            <LeftOutlined autoFlip size={26} />
          </Arrow>
          <Arrow
            className='jimu-image-viewer-next'
            aria-label={translate('next')}
            disableHoverEffect
            disableRipple
            icon
            variant='text'
            styleState={{type: 'next'}}
            onClick={handleNext}
          >
            <RightOutlined autoFlip size={26} />
          </Arrow>
        </React.Fragment>}
        {multiple && <ImageDots
          className='jimu-image-viewer-dots'
          imageCount={srcList.length}
          currentIndex={currentIndex}
          onChange={setCurrentImage}
        />}
      </Viewer>
    </ViewerModal>
  </React.Fragment>
}
