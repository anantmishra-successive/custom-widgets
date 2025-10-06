/** @jsx jsx */
import { classNames, css, jsx } from 'jimu-core'
import { Button, type StandardComponentProps } from 'jimu-ui'
import { styled } from 'jimu-theme'

export interface ImageDotsProps extends StandardComponentProps {
  imageCount: number
  currentIndex: number
  onChange: (index: number) => void
}

const Dots = styled('div')(css`
  max-width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 4px;
`)

const Dot = styled(Button)(({ theme }) => css`
  padding: 0;
  width: 8px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  transition: ${theme.sys.transitions.create('width')};
  &.active {
    width: 14px;
    background-color: ${theme.sys.color.primary.light};
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 4px;
  }
`)

export const ImageDots = (props: ImageDotsProps) => {
  const { imageCount = 0, currentIndex = 0, className, style, onChange } = props

  if (imageCount < 1) return null

  const imageList = new Array(imageCount).fill('')

  return <Dots className={className} style={style}>
    {imageList.map((v, index) =>
      <Dot
        key={index}
        variant='contained'
        className={classNames('dot', {active: currentIndex === index})}
        onClick={() => { onChange(index) }}
      />
    )}
  </Dots>
}
