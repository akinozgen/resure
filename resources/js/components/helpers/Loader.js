import  React from 'react';

export class Loader extends React.Component {
  render() {
    return [
      <style jsx>
        {`
          .loading {
            width: 30px;
            height: 30px;
            filter: brightness(0) invert(1);
          }
        `}
      </style>,
      <img src="/img/loading.gif" className="loading"/>
    ];
  };
};