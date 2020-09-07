import React from 'react';
import getLatestUsers from "../api/getLatestUsers";
import {Link} from "react-router-dom";
import {Tooltip} from "antd";
import Avatar from "antd/lib/avatar";
import SkeletonAvatar from "antd/lib/skeleton/Avatar";
import Skeleton from "antd/lib/skeleton";
import '../../sass/welcome.scss';

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
        this.setState({usersLoading: true});

        const users = await getLatestUsers();
        Array.isArray(users.data) ? this.setState({users: users.data}) : null;

        this.setState({usersLoading: false});
    }

    renderUserAvatar(user) {
        return (
            <Tooltip title={user.name}>
                <Link
                    to={`@${user.username}/questions`}
                    className={'user-block mr-2'}>
                    <Avatar className={user.isNew ? 'new_user' : ''} src={user.pp_url} size={70}>{user.isNew ? 'new' : ''} {user.username}</Avatar>
                </Link>
            </Tooltip>
        );
    }

    renderGhostUsers() {
        const users = [];
        for (let i = 0; i <= 10; i++) {
            users.push(<Skeleton loading={true} paragraph={false} title={false} avatar={true} active={true}>
                <SkeletonAvatar size="large"/>
            </Skeleton>);
        }

        return <div className={'welcome-page-users'} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row'
        }}>{users}</div>;
    }

    render() {
        return (
            <div className="Welcome">
                <div className="content">
                    <div className="title m-b-md">
                        New Area to Meet New People
                    </div>

                    <div className="links">
                        <p className="main-paragraph">
                            Ask a stranger as
                            <a href="https://www.dictionary.com/browse/anonymous?s=t" target="_blank">anon(1)</a>,
                            get questions from
                            <a href="https://www.dictionary.com/browse/anonymous?s=t" target="_blank">anons(1)</a>,
                            answer them if you wish.
                        </p>
                        <div className="mt-5">
                            {this.state.usersLoading ? this.renderGhostUsers() : this.state.users.map(this.renderUserAvatar)}
                        </div>
                    </div>
                    <div className="video">
                        <video src="/bg.webm" autoPlay={true} loop={true} controls={false}/>
                    </div>
                </div>
            </div>
        );
    }
}
