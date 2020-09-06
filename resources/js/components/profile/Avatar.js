import React from 'react'
import PropTypes from 'prop-types'

const Avatar = (props) => {
  return (
    <div className="col-md-4">
      <div className="profile-img">
        <img
          src={props.pp_url}
          alt={`${props.name} on resure.space`}
        />
      </div>
    </div>
  )
}

export default Avatar
