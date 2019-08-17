import React from "react";
import {Rate} from "antd";

const ProfileNameHolder = props => {
  return [
    <h5 className="text-center text-md-left text-lg-left text-xl-left">{props.name}</h5>,
    <h6 className="text-center text-md-left text-lg-left text-xl-left">{props.bio}</h6>,
    <p className="proile-rating text-center text-md-left text-lg-left text-xl-left">
        <Rate disabled defaultValue={2} />
    </p>
  ];
};

export default ProfileNameHolder;
