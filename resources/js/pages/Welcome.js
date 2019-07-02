import React from 'react';

export default class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <style jsx>{`
          body {
              background-color: #000;
              color: #fff;
              font-family: 'Nunito', sans-serif;
              font-weight: 200;
              height: 100vh;
              margin: 0;
              position: absolute;
              width: 100%;
              height: 100%;
              overflow: auto;
              z-index: 2;
          }
          .content {
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              height: calc(100vh - 76px);
              flex-direction: column;
              z-index: 1;
          }
          
          video {
              position: fixed;
              right: 0;
              bottom: 0;
              min-width: 100%;
              min-height: 100%;
              z-index: -1;
              opacity: .3;
          }
          
          .title {
              font-size: 64px;
          }
          .links p {
              color: #fff;
              padding: 0 25px;
              font-size: 16px;
              font-weight: 400;
          }
          .m-b-md {
              margin-bottom: 30px;
          }
        `}</style>
        
        <div className="content">
          <div className="title m-b-md">
            New Area to Meet New People
          </div>
          
          <div className="links">
            <p className="main-paragraph">Ask to a stranger as anonymously, get questions from anonymous anser them.</p>
          </div>
          <div className="video"><video src="/bg.mp4" autoPlay={true} loop={true} controls={false} /></div>
        </div>
      </div>
    );
  }
}