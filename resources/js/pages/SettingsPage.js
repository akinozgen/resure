import React, { Component } from "react";
import Avatar from "../components/profile/Avatar";
import ProfileNameHolder from "../components/profile/ProfileNameHolder";
import getQuestions from "../api/getQuestions";
import QuestionsList from "../components/QuestionsList";
import {Card, Col, Row} from "antd";
import Title from "antd/lib/typography/Title";
import setUserId from "../api/setUserId";

class SettingsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...this.props.state
        };
    }

    componentDidMount() {
      window.OneSignal = window.OneSignal || [];
      OneSignal.push(function() {
        OneSignal.init({
          appId: "3ad720b3-9624-4636-97da-feabe1dd68cd",
        });
      });

      OneSignal.getUserId().then(async userId => {
        if (String(userId).length < 10) return ;
        await setUserId({ userId });
      })
    }

  render() {

        return (
          <Card>
            <Title level={3}>Settings</Title>
            <Row>
              <Col span={24}>
                <div className='onesignal-customlink-container'></div>
              </Col>
            </Row>
          </Card>
        );
    }
}
export default SettingsPage;
