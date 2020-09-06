import React, { Component } from "react";
import Avatar from "../components/profile/Avatar";
import ProfileNameHolder from "../components/profile/ProfileNameHolder";
import getQuestions from "../api/getQuestions";
import QuestionsList from "../components/QuestionsList";
import getUser from "../api/getUser";
import {Loader} from "../components/helpers/Loader";

class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        };

        this.getQuestions = this.getQuestions.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    componentDidMount() {
        console.log(this.props.username);
        this.getQuestions();
        this.getUser();
    }

    async getQuestions() {
        const questions = await getQuestions(this.props.username);
        Array.isArray(questions.data) ? this.setState({ questions: questions.data }) : null;
        // TODO: Check for not found error.
    }

    async getUser() {
        const user = await getUser(this.props.username);
        Array.isArray(Object.keys(user.data)) ? this.setState({ user: user.data }) : null;
        // TODO: Check for not found error.
    }

    render() {
        return (
            this.state.user ? <div className="container emp-profile">
                <form method="post">
                    <div className="row">
                        <Avatar
                          name={this.state.user.name}
                          pp_url={this.state.user.pp_url}
                          self={false}
                        />
                        <div className="col-md-8">
                            <div className="profile-head">
                                <ProfileNameHolder
                                  name={this.state.user.name}
                                  bio={this.state.user.bio}
                                  rating={5}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="mt-2 profile-work text-center">
                                <a
                                  target="_blank"
                                  href={`https://twitter.com/${
                                    this.state.user.username
                                    }`}
                                >
                                    @{this.state.user.username} on Twitter
                                </a>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <ul
                              className="nav nav-tabs"
                              id="myTab"
                              role="tablist"
                            >
                                <li className="nav-item">
                                    <a
                                      className="nav-link"
                                      id="home-tab"
                                      data-toggle="tab"
                                      href="#home"
                                      role="tab"
                                      aria-controls="home"
                                      aria-selected="true"
                                    >
                                        About
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                      className="nav-link active"
                                      id="profile-tab"
                                      data-toggle="tab"
                                      href="#profile"
                                      role="tab"
                                      aria-controls="profile"
                                      aria-selected="false"
                                    >
                                        Timeline
                                    </a>
                                </li>
                            </ul>
                            <div
                              className="tab-content profile-tab"
                              id="myTabContent"
                            >
                                <div
                                  className="tab-pane fade"
                                  id="home"
                                  role="tabpanel"
                                  aria-labelledby="home-tab"
                                >
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>
                                                Username on resure.space
                                            </label>
                                        </div>
                                        <div className="col-md-6">
                                            <p>
                                                {this.state.user.username}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Name</label>
                                        </div>
                                        <div className="col-md-6">
                                            <p>{this.state.user.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                  className="tab-pane fade show active"
                                  id="profile"
                                  role="tabpanel"
                                  aria-labelledby="profile-tab"
                                >
                                    <QuestionsList
                                      user_name={this.state.user.name}
                                      self={false}
                                      data={this.state.user.questions}
                                      pp_url={this.state.user.pp_url} />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div> : <div className="onAuthFail"><Loader /></div>
        );
    }
}
export default UserProfilePage;
