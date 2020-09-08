import React from 'react';
import {Avatar, Card, Comment} from "antd";
import {Link} from "react-router-dom";
import {Loader} from "./helpers/Loader";
import getFollowers from "../api/getFollowers";
import BottomScrollListener from "react-bottom-scroll-listener";
import Title from "antd/lib/typography/Title";

class Followers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: [],
      start: 0,
      length: 4,
      loading: true,
      locked: false,
      totalFollowers: 100
    };

    this.getFollowers = this.getFollowers.bind(this);
    this.renderFollowers = this.renderFollowers.bind(this);
    this.loadNew = this.loadNew.bind(this);
  }

  componentDidMount() {
    this.getFollowers();
    this.setState({
      totalFollowers: this.props.user.total_followers
    })
  }

  async getFollowers() {
    if (this.state.locked === true) return;
    this.setState({locked: true});

    const _users = await getFollowers(this.props.user.username, this.state.start, this.state.length);
    let newLength = this.state.start + this.state.length;

    if (newLength >= _users.data.total_followers) {
      newLength = _users.data.total_followers - this.state.length;
    }

    const newUsers = Array.from(
      [...this.state.followers, ..._users.data.followers]
    ).filter((v, i, a) => a.indexOf(v) === i);

    return Array.isArray(Object.keys(_users.data)) ? this.setState({
      followers: newUsers,
      start: newLength,
      loading: false,
      locked: false,
      totalFollowers: _users.data.total_followers
    }) : null;
  }

  loadNew() {
    this.setState({
      loading: true
    });
    this.getFollowers();
  }

  renderFollowers() {
    return this.state.followers.map(follower => {
      return <Card className={'mb-2'}>
        <Comment
          author={<a href={`/@${follower.username}/questions`}><h5 className={'mb-1'}>{follower.name}</h5></a>}
          avatar={
            <a href={`/@${follower.username}/questions`}>
              <Avatar
                src={follower.profile_pic_url}
                alt={`${follower.name} on resure.space`}
              />
            </a>
          }
          content={
            <p>
              {follower.bio}
            </p>
          }
        />
      </Card>;
    });
  }

  render() {
    return <BottomScrollListener
      debounce={500}
      onBottom={this.state.totalFollowers == this.state.followers.length ? () => null : this.loadNew}
      triggerOnNoScroll={false}>
      <Title level={3}>
        {this.props.self === true ? 'Your' : `${this.props.user.name}'s`} Followers
      </Title>
      {this.renderFollowers()}
      {this.state.loading ? <Loader /> : null}
    </BottomScrollListener>;
  }
}

export default Followers;
