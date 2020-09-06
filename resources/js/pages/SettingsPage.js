import React, { Component } from "react";
import Avatar from "../components/profile/Avatar";
import ProfileNameHolder from "../components/profile/ProfileNameHolder";
import getQuestions from "../api/getQuestions";
import QuestionsList from "../components/QuestionsList";

class SettingsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...this.props.state
        };
    }

    componentDidMount() {
        console.log(this.state.user)
    }

    render() {
        return (
            <div className="container emp-profile">
                asd
            </div>
        );
    }
}
export default SettingsPage;
