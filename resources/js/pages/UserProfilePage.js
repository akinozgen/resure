import React, {Component} from 'react';
import {Layout} from 'antd';
import Card from "antd/lib/card";
import Icon from "antd/lib/icon";
import {Meta} from "antd/lib/list/Item";
import Avatar from "antd/lib/avatar";
import PageHeader from "antd/lib/page-header";
import Form from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal";
import sendQuestion from "../api/sendQuestion";
import {Loader} from "../components/helpers/Loader";
import getUser from "../api/getUser";
import {Link} from "react-router-dom";
import LoginUserMenu from "../components/helpers/LoginUserMenu";
import getQuestions from "../api/getQuestions";
import axiosResponseErrorModal from "../components/helpers/axiosResponseErrorModal";

const {Content, Footer} = Layout;

class UserProfilePage extends Component {
  questionContentMinLength = 10;
  questionContentMaxLength = 140;
  
  constructor(props) {
    super(props);
    
    this.state = {
      questionModalVisibility: false,
      questionModalLoading: false,
      questionContent: '',
      questionContentValidationStatus: true,
      questionContentHelpText: '',
      user: this.props.self === false ? false : this.props.state.user,
      questions: []
    };
    
    this.toggleQuestionModal = this.toggleQuestionModal.bind(this);
    this.sendQuestion = this.sendQuestion.bind(this);
    this.handleQuestionContentChange = this.handleQuestionContentChange.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getProfileActionsDependentToSelf = this.getProfileActionsDependentToSelf.bind(this);
    
    if (this.props.self === false) this.getUser();
  }
  
  componentDidMount() {
    this.getQuestions();
  }
  
  async getUser() {
    const user = await getUser(this.props.username);
    Array.isArray(Object.keys(user.data)) ? this.setState({user: user.data}) : null;
    // TODO: Check for not found error.
  }
  
  handleQuestionContentChange(_) {
    const isShort = this.isQuestionContentShort(_.target.value);
    const isLong = this.isQuestionContentLong(_.target.value);
    this.setState({
      questionContent: _.target.value,
      questionContentHelpText: UserProfilePage.prepareQuestionContentHelpText(isShort, isLong, _.target.value),
      questionContentValidationStatus: UserProfilePage.prepareQuestionContentStatus(isShort, isLong, _.target.value)
    });
  }
  
  static prepareQuestionContentHelpText(isShort, isLong, content) {
    if (content.length === 0) return 'Question can\'t be empty.';
    if (isShort) return 'Your question is too short.';
    if (isLong) return 'Your qusetion is too long.';
    return '';
  }
  
  static prepareQuestionContentStatus(isShort, isLong, content) {
    if (content.length === 0) return 'error';
    else if (isShort || isLong) return 'error';
    else if (!isShort && !isLong) return 'success';
    return '';
  }
  
  isQuestionContentShort(content) {
    return String(content).length < this.questionContentMinLength;
  }
  
  isQuestionContentLong(content) {
    return String(content).length > this.questionContentMaxLength;
  }
  
  toggleQuestionModal() {
    this.setState({
      questionModalVisibility: !this.state.questionModalVisibility,
      questionModalLoading: this.state.questionModalVisibility ? true : false,
      questionContent: ''
    });
  }
  
  sendQuestion() {
    const content = this.state.questionContent;
    const isShort = this.isQuestionContentShort(content);
    const isLong = this.isQuestionContentLong(content);
    if (UserProfilePage.prepareQuestionContentStatus(isShort, isLong, content) !== 'success') return;
    
    this.setState({questionModalLoading: !this.state.questionModalLoading});
    
    sendQuestion({content, to_id: this.state.user.username})
      .then(response => {
        Modal.success({
          title: 'Success',
          content: response.data.message
        });
      })
      .catch(axiosResponseErrorModal)
      .finally(() => {
        this.setState({questionModalLoading: false});
        this.toggleQuestionModal();
      });
  }
  
  getQuestions() {
    getQuestions(this.props.username)
      .then(response => {
        if (response.data.status !== 'success') return axiosResponseErrorModal({ response });
        this.setState({ questions: response.data.data });
      })
      .catch(axiosResponseErrorModal)
  }
  
  getProfileActionsDependentToSelf() {
    if (this.props.self === true) return [
      <Link to={'/settings'}><Icon type="setting" key="setting"/></Link> ,
      <Link to={'/profile_edit'}><Icon type="edit" key="edit"/></Link>,
      <Icon type="logout" key="ellipsis" onClick={LoginUserMenu.performLogout}/>,
    ];
    
  }
  
  render() {
    if (!this.state.user && this.props.self === false) return <div className="onAuthFail"><Loader/></div>;
    
    return (
      <div className={'container'}>
        <Content className={'pt-3 row'}>
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Card
              cover={<img src={this.state.user.banner_url}/>}
              actions={this.getProfileActionsDependentToSelf()}
            >
              <Meta
                avatar={<Avatar src={this.state.user.pp_url}>{this.state.user.name}</Avatar>}
                title={this.state.user.name}
                description={this.state.user.bio ? this.state.user.bio : '[bio not set]'}
              />
            </Card>
          </div>
          <div className="col-md-8 col-sm-12">
            <Card bodyStyle={{padding: 0}}>
              <PageHeader
                onBack={() => window.history.back()}
                title="Profile"
                subTitle={this.state.user.name}
              >
                <div className="wrap">
                  <div className="content padding">
                    {this.props.self === false ? <Button type="primary" onClick={this.toggleQuestionModal}>
                      Want to ask a question
                      <Icon type={'question'}/>
                    </Button> : null}
                  </div>
                  <div className="extraContent"></div>
                </div>
              </PageHeader>
            </Card>
          </div>
        </Content>
        
        <Modal
          okText={'Send'}
          cancelText={'Nevermind'}
          visible={this.state.questionModalVisibility}
          onOk={this.sendQuestion}
          confirmLoading={this.state.questionModalLoading}
          onCancel={this.toggleQuestionModal}>
          <Form layout="horizontal">
            <Form.Item
              label={"Your question"}
              validateStatus={this.state.questionContentValidationStatus}
              help={this.state.questionContentHelpText}>
              <TextArea
                minLength={10}
                maxLength={140}
                value={this.state.questionContent}
                onInput={this.handleQuestionContentChange}
                placeholder={'Please be kind to others.'}
                rows={4}
                title={'Your question?'}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default UserProfilePage;