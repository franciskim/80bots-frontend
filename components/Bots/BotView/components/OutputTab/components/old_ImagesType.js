import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ScreenShot from '../../ScreenShot'
import styled from '@emotion/styled'

const Images = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  ${(props) => props.styles};
`

const Image = styled(ScreenShot)`
  margin-bottom: 20px;
  margin-right: 20px;
  animation: ${Fade} 200ms ease-in-out;
  ${(props) => props.styles};
`

const ImageViewer = styled.div`
  top: 0;
  left: 0;
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  img {
    width: calc(100vw - 400px);
    height: calc(100vh - 200px);
  }
`

const Old_ImagesType = ({ output }) => {
  const [currentImage, setCurrentImage] = useState(null)

  const toFile = (item) => {
    const blob = new Blob([item.thumbnail || item.data], { type: 'image/jpg' })
    return new File([blob], item.name, { type: 'image/jpg' })
  }

  const toImage = (item) => ({
    src: URL.createObjectURL(toFile(item)),
    caption: item.name,
    ...item,
  })

  const renderImage = (item, idx) => {
    if (item.data) {
      item = toImage(item)
      return (
        <Image
          key={idx}
          src={item.src}
          caption={item.caption}
          onClick={() => setCurrentImage(item)}
        />
      )
    }
  }

  return (
    <>
      <Images>{output.map(renderImage)}</Images>
      {currentImage && (
        <ImageViewer onClick={() => setCurrentImage(null)}>
          <img
            onClick={(e) => e.stopPropagation()}
            alt={currentImage.caption}
            src={currentImage.src}
          />
        </ImageViewer>
      )}
    </>
  )
}

Old_ImagesType.propTypes = {
  output: PropTypes.array.isRequired,
}

export default Old_ImagesType
