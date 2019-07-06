import React from "react";
import PropTypes from "prop-types";

const ProfileNameHolder = props => {
  return [
    <h5>{props.name}</h5>,
    <h6>{props.bio}</h6>,
    <p className="proile-rating">
      Rating: <span>{props.rating}/10</span>
    </p>
  ];
};

export default ProfileNameHolder;
