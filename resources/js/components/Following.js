import React from 'react';
import {Avatar, Button, Card, Comment} from "antd";
import {Link} from "react-router-dom";
import {Loader} from "./helpers/Loader";
import getFollowings from "../api/getFollowings";
import BottomScrollListener from "react-bottom-scroll-listener";
import follow from "../api/follow";
import Title from "antd/lib/typography/Title";

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
    this.renderActions = this.renderActions.bind(this);
    this.unfollow = this.unfollow.bind(this);
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
    ).filter((v, i, a) => a.indexOf(v) === i).map(user => {
      user.loading = false
      return user;
    });

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

  async unfollow(user) {
    const username = user.username;
    let followings = this.state.followings.map(following => {
      if (following.username === username) {
        following.loading = true;
      }
      return following;
    });
    this.setState({ followings });

    const result = await follow(username, false);

    if (result.data.status === 'success') {
      followings = this.state.followings.filter(user => user.username !== username);
      this.setState({ followings });
    }
  }

  renderActions(following) {
    return [
      <Button loading={following.loading} type={'link'} className={'text-danger'} onClick={() => this.unfollow(following)}>Unfollow</Button>
    ];
  }

  renderFollowings() {
    return this.state.followings.map(following => {
      return <Card className={'mb-2'}>
        <Comment
          author={<a href={`/@${following.username}/questions`}><h5 className={'mb-1'}>{following.name}</h5></a>}
          avatar={
            <a href={`/@${following.username}/questions`}>
              <Avatar
                src={following.profile_pic_url}
                alt={`${following.name} on resure.space`}
              />
            </a>
          }
          content={
            <p>
              {following.bio}
            </p>
          }
            actions={this.props.self === true ? this.renderActions(following) : null}
        />
      </Card>;
    });
  }

  render() {
    return <BottomScrollListener
      debounce={500}
      onBottom={(this.state.totalFollowings == this.state.followings.length) ? () => null : this.loadNew}
      triggerOnNoScroll={false}>
      <Title level={3}>
        Followed by {this.props.self === true ? 'You' : this.props.user.name}
      </Title>
      {this.renderFollowings()}
      {this.state.loading ? <Loader /> : null}
    </BottomScrollListener>;
  }
}

export default Following;
