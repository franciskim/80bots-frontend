import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import lightLoaderImage from 'assets/img/loader/80bots_loader_light.svg'
import darkLoaderImage from 'assets/img/loader/80bots_loader_dark.svg'

export const Loader80bots = ({ mode, styled }) => {
  const [icon, setIcon] = useState(null)
  const [colorTheme] = useState(mode)

  useEffect(() => {
    if (colorTheme === 'dark') {
      setIcon(darkLoaderImage)
    } else if (colorTheme === 'light') {
      // By default, light mode
      setIcon(lightLoaderImage)
    }
  }, [mode])

  return (
    <object
      type="image/svg+xml"
      data={icon}
      className={'loader80bots'}
      style={styled}
    />
  )
}

Loader80bots.propTypes = {
  mode: PropTypes.oneOf(['light', 'dark']),
  styled: PropTypes.object,
}

Loader80bots.defaultProps = {
  mode: 'light',
}

export default Loader80bots
