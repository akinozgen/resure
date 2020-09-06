import React from 'react';
import {Avatar, Card, Comment} from "antd";
import {Link} from "react-router-dom";
import {Loader} from "./helpers/Loader";
import getFollowings from "../api/getFollowings";
import BottomScrollListener from "react-bottom-scroll-listener";

class Following extends React.Component {
  constructor() {
    super();
    this.state = {
      followings: [],
      start: 0,
      length: 4,
      loading: true,
      locked: false,
      totalFollowings: 100
    };

    this.getFollowings = this.getFollowings.bind(this);
    this.renderFollowings = this.renderFollowings.bind(this);
    this.loadNew = this.loadNew.bind(this);
  }

  componentDidMount() {
    this.getFollowings();
    this.setState({
      totalFollowings: this.props.user.total_followings
    })
  }

  async getFollowings() {
    if (this.state.locked === true) return;
    this.setState({locked: true});

    let newLength = this.state.start + this.state.length;
    if (newLength >= this.state.totalFollowings) {
      newLength = this.state.totalFollowings - this.state.length;
    }

    const _users = await getFollowings(this.props.user.username, this.state.start, this.state.length);

    const newUsers = Array.from(
      [...this.state.followings, ..._users.data.followings]
    ).filter((v, i, a) => a.indexOf(v) === i);

    return Array.isArray(Object.keys(_users.data)) ? this.setState({
      followings: newUsers,
      start: newLength,
      loading: false,
      locked: false,
      totalFollowings: _users.data.total_followings
    }) : null;
  }

  loadNew() {
    this.setState({
      loading: true
    });
    this.getFollowings();
  }

  renderFollowings() {
    return this.state.followings.map(following => {
      return <Card className={'mb-2'}>
        <Comment
          author={<Link to={`/@${following.username}`}><h5 className={'mb-1'}>{following.name}</h5></Link>}
          avatar={
            <Link to={`/@${following.username}`}>
              <Avatar
                src={following.profile_pic_url}
                alt={`${following.name} on resure.space`}
              />
            </Link>
          }
          content={
            <p>
              {following.bio}
            </p>
          }
        />
      </Card>;
    });
  }

  render() {
    return <BottomScrollListener
      debounce={500}
      onBottom={(this.state.totalFollowings == this.state.length+this.state.start) ? () => null : this.loadNew}
      triggerOnNoScroll={false}>
      {this.renderFollowings()}
      {this.state.loading ? <Loader /> : null}
    </BottomScrollListener>;
  }
}

export default Following;
