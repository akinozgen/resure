import  React from 'react';

export class Loader extends React.Component {
  render() {
    return [
      <style jsx>
        {`
          .loading {
            width: 30px;
            height: 30px;
            display: block;
            margin: 0 auto;
            filter: brightness(0);
          }
        `}
      </style>,
      <img src="/img/loading.gif" className="loading"/>
    ];
  };
};
