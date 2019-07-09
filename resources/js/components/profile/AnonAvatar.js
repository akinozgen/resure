import React from 'react';

const AnonAvatar = () => {
  const colors = ['00b1ff', 'ff5500', 'ffd500', 'a600ff'];
  
  return (
    <img
      className="mr-3 img-thumbnail rounded-circle"
      type="image/svg+xml"
      width={60}
      src={`/img/anon-avatar.svg?color=${colors[Math.floor(Math.random()*colors.length)]}`}
    />
  );
};

export default AnonAvatar;