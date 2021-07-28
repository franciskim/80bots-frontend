import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import lightLoaderImage from 'assets/img/loader/80bots_loader_light.svg'
import darkLoaderImage from 'assets/img/loader/80bots_loader_dark.svg'
import { Container } from 'reactstrap'

// const LoaderContainer = styled.div`
//   display: flex;
//   flex: 1;
//   justify-content: center;
//   align-items: center;
//   flex-direction: column;
// `

export const Loader80bots = ({ data, styled, ...props }) => {
  const [icon, setIcon] = useState(null)

  useEffect(() => {
    if (data === 'light') {
      setIcon(lightLoaderImage)
    } else if (data === 'dark') {
      setIcon(darkLoaderImage)
    }
  }, [data])

  return (
    <Container>
      <object
        type="image/svg+xml"
        data={icon}
        className={'loader80bots'}
        style={styled}
      />
    </Container>
  )
}

Loader80bots.propTypes = {
  data: PropTypes.oneOf(['light', 'dark']),
  styled: PropTypes.object,
}

export default Loader80bots
