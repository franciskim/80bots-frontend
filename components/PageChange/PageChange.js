import React from 'react'
import PropTypes from 'prop-types'
import { Loader80bots } from 'components/default'

const PageChange = () => {
  return (
    <div>
      <div className="page-transition-wrapper-div">
        <div className="page-transition-icon-wrapper mb-3">
          <Loader80bots
            styled={{
              width: '200px',
              height: '100px',
            }}
          />
        </div>
      </div>
    </div>
  )
}

PageChange.propTypes = {
  path: PropTypes.string.isRequired,
}

export default PageChange
