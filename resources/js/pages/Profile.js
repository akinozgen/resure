import React, { Component } from "react";
import Avatar from "../components/profile/Avatar";
import ProfileNameHolder from "../components/profile/ProfileNameHolder";
import getQuestions from "../api/getQuestions";
import QuestionsList from "../components/QuestionsList";

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            questions: []
        };
        
        this.getQuestions = this.getQuestions.bind(this);
    }
    
    componentDidMount() {
        this.getQuestions();
    }
    
    async getQuestions() {
        const questions = await getQuestions();
        Array.isArray(questions.data) ? this.setState({ questions: questions.data }) : null;
    }
    
    componentWillUpdate(nextProps, nextState, nextContext) {
        console.log(nextState);
    }
    
    render() {
        return (
            <div className="container emp-profile">
                <form method="post">
                    <div className="row">
                        <Avatar
                            name={this.props.state.user.name}
                            pp_url={this.props.state.user.pp_url}
                            self={this.props.self}
                        />
                        <div className="col-md-8">
                            <div className="profile-head">
                                <ProfileNameHolder
                                    name={this.props.state.user.name}
                                    bio={this.props.state.user.bio}
                                    rating={5}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                        
                        </div>
                        <div className="col-md-8">
                            <ul
                                className="nav nav-tabs"
                                id="myTab"
                                role="tablist"
                            >
                                <li className="nav-item">
                                    <a
                                        className="nav-link active"
                                        id="home-tab"
                                        data-toggle="tab"
                                        href="#home"
                                        role="tab"
                                        aria-controls="home"
                                        aria-selected="true"
                                    >
                                        About {this.props.self ? "Me" : null}
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        id="profile-tab"
                                        data-toggle="tab"
                                        href="#profile"
                                        role="tab"
                                        aria-controls="profile"
                                        aria-selected="false"
                                    >
                                        {this.props.self
                                            ? "Questions"
                                            : "Timeline"}
                                    </a>
                                </li>
                            </ul>
                            <div
                                className="tab-content profile-tab"
                                id="myTabContent"
                            >
                                <div
                                    className="tab-pane fade show active"
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
                                                {this.props.state.user.username}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Name</label>
                                        </div>
                                        <div className="col-md-6">
                                            <p>{this.props.state.user.name}</p>
                                        </div>
                                    </div>
                                    {this.props.self ? (
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Email</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>
                                                    {this.props.state.user
                                                        .email || "not set"}
                                                </p>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="profile"
                                    role="tabpanel"
                                    aria-labelledby="profile-tab"
                                >
                                    {this.props.self ?
                                      <QuestionsList
                                        get_questions={this.getQuestions}
                                        user_name={this.props.state.user.name}
                                        self={true}
                                        data={this.state.questions}
                                        pp_url={this.props.state.user.pp_url} /> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
export default ProfilePage;
