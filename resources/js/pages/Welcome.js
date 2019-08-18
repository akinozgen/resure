import React from 'react';
import getLatestUsers from "../api/getLatestUsers";
import {Link} from "react-router-dom";
import {Tooltip} from "antd";
import Avatar from "antd/lib/avatar";
import SkeletonAvatar from "antd/lib/skeleton/Avatar";
import Skeleton from "antd/lib/skeleton";

export default class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      users: [],
      usersLoading: false
    };
    
    this.getLatestUsers = this.getLatestUsers.bind(this);
  }
  
  componentDidMount() {
    this.getLatestUsers();
  }
  
  async getLatestUsers() {
    this.setState({ usersLoading: true });
    
    const users = await getLatestUsers();
    Array.isArray(users.data) ? this.setState({users: users.data}) : null;
    
    this.setState({ usersLoading: false });
  }
  
  renderUserAvatar(user) {
    return (
      <Tooltip title={user.name}>
        <Link
          to={`@${user.username}`}
          className={'user-block mr-2'}>
          <Avatar src={user.pp_url} size={70}>{user.username}</Avatar>
        </Link>
      </Tooltip>
    );
  }
  
  renderGhostUsers() {
    const users = [];
    for (let i = 0; i <= 10; i++) {
      users.push(<Skeleton loading={true}  paragraph={false} title={false} avatar={true} active={true}>
        <SkeletonAvatar size="large" />
      </Skeleton>);
    }
    
    return <div className={'welcome-page-users'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>{users}</div>;
  }
  
  render() {
    return (
      <div>
        <style jsx={'jsx'}>{`
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
            <div className="mt-5">
              {
                this.state.usersLoading ? this.renderGhostUsers() : this.state.users.map(this.renderUserAvatar)
              }
            </div>
          </div>
          <div className="video">
            <video src="/bg.mp4" autoPlay={true} loop={true} controls={false}/>
          </div>
        </div>
      </div>
    );
  }
}