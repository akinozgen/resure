import React from "react";
import PropTypes from "prop-types";

const ProfileNameHolder = props => {
  return [
    <h5 className="text-center text-md-left text-lg-left text-xl-left">{props.name}</h5>,
    <h6 className="text-center text-md-left text-lg-left text-xl-left">{props.bio}</h6>,
    <p className="proile-rating text-center text-md-left text-lg-left text-xl-left">
      Rating: <span>{props.rating}/10</span>
    </p>
  ];
};

export default ProfileNameHolder;
