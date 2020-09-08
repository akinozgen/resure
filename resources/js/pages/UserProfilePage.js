import React, {Component} from 'react';
import {Alert, Layout, Icon, Row, Col} from 'antd';
import Card from "antd/lib/card";
import {Meta} from "antd/lib/list/Item";
import Avatar from "antd/lib/avatar";
import PageHeader from "antd/lib/page-header";
import Form from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal";
import sendQuestion from "../api/sendQuestion";
import getUser from "../api/getUser";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import LoginUserMenu from "../components/helpers/LoginUserMenu";
import getQuestions from "../api/getQuestions";
import axiosResponseErrorModal from "../components/helpers/axiosResponseErrorModal";
import Comment from "antd/lib/comment";
import Skeleton from "antd/lib/skeleton";
import Tooltip from "antd/lib/tooltip";
import sendAnswer from "../api/sendAnswer";
import ButtonGroup from "antd/lib/button/button-group";
import NotFoundPage from './NotFoundPage';
import Followers from "../components/Followers";
import Following from "../components/Following";
import SwitchAnt from 'antd/lib/switch';
import follow from "../api/follow";
import SettingsPage from "./SettingsPage";

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
      answerModalVisibility: false,
      answerModalLoading: false,
      answerContent: '',
      answerContentValidationStatus: true,
      answerContentHelpText: '',
      user: this.props.self === false ? false : this.props.state.user,
      questions: [],
      newOnly: false,
      questionsLoading: false,
      selectedQuestion: null,
      isAnon: true,
      followInProgress: false
    };

    this.toggleQuestionModal = this.toggleQuestionModal.bind(this);
    this.toggleAnswerModal = this.toggleAnswerModal.bind(this);
    this.sendQuestion = this.sendQuestion.bind(this);
    this.sendAnswer = this.sendAnswer.bind(this);
    this.handleQuestionContentChange = this.handleQuestionContentChange.bind(this);
    this.handleAnswerContentChange = this.handleAnswerContentChange.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getProfileActionsDependentToSelf = this.getProfileActionsDependentToSelf.bind(this);
    this.handleNewOnly = this.handleNewOnly.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.renderFollowing = this.renderFollowing.bind(this);
    this.renderFollowers = this.renderFollowers.bind(this);
    this.follow = this.follow.bind(this);
    this.goTo = this.goTo.bind(this);

    if (this.props.self === false) this.getUser();
  }

  componentDidMount() {
    this.getQuestions({newOnly: this.state.newOnly});
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

  handleAnswerContentChange(_) {
    const isShort = this.isQuestionContentShort(_.target.value);
    const isLong = this.isQuestionContentLong(_.target.value);
    this.setState({
      answerContent: _.target.value,
      answerContentHelpText: UserProfilePage.prepareAnswerContentHelpText(isShort, isLong, _.target.value),
      answerContentValidationStatus: UserProfilePage.prepareQuestionContentStatus(isShort, isLong, _.target.value)
    });
  }

  static prepareQuestionContentHelpText(isShort, isLong, content) {
    if (content.length === 0) return 'Question can\'t be empty.';
    if (isShort) return 'Your question is too short.';
    if (isLong) return 'Your qusetion is too long.';
    return '';
  }

  static prepareAnswerContentHelpText(isShort, isLong, content) {
    if (content.length === 0) return 'Answer can\'t be empty.';
    if (isShort) return 'Your answer is too short.';
    if (isLong) return 'Your answer is too long.';
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
    if (!this.props.state.authState) return Modal.warning({
      content: 'You need to login in order to ask a question.',
      okText: 'Login with twitter',
      cancelText: 'Cancel',
      onOk: () => LoginUserMenu.performLogin(),
      title: 'Warning'
    });

    this.setState({
      questionModalVisibility: !this.state.questionModalVisibility,
      questionModalLoading: this.state.questionModalVisibility ? true : false,
      questionContent: ''
    });
  }

  toggleAnswerModal(id = null) {
    this.setState({
      answerModalVisibility: !this.state.answerModalVisibility,
      answerModalLoading: this.state.answerModalVisibility ? true : false,
      answerContent: '',
      selectedQuestion: typeof id === 'number' ? id : 0
    });
  }

  sendQuestion() {
    const content = this.state.questionContent;
    const isShort = this.isQuestionContentShort(content);
    const isLong = this.isQuestionContentLong(content);
    if (UserProfilePage.prepareQuestionContentStatus(isShort, isLong, content) !== 'success') return;

    this.setState({questionModalLoading: !this.state.questionModalLoading});

    sendQuestion({content, to_id: this.state.user.username, isAnon: this.state.isAnon})
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

  sendAnswer() {
    const content = this.state.answerContent;
    const isShort = this.isQuestionContentShort(content);
    const isLong = this.isQuestionContentLong(content);
    if (UserProfilePage.prepareQuestionContentStatus(isShort, isLong, content) !== 'success') return;

    this.setState({answerModalLoading: !this.state.answerModalLoading});

    sendAnswer({id: this.state.selectedQuestion, answer: content})
      .then(response => {
        Modal.success({
          title: 'Success',
          content: response.data.message
        });

        this.appendAnswer();
      })
      .catch(axiosResponseErrorModal)
      .finally(() => {
        this.setState({answerModalLoading: false});
        this.toggleAnswerModal(0);
      });
  }

  appendAnswer() {
    const question = this.state.questions.filter(_ => _.id === this.state.selectedQuestion)[0];
    const questionIndex = this.state.questions.map(_ => _.id).indexOf(question.id);
    const questions = this.state.questions;

    question.answer = this.state.answerContent;
    question.answered_at = 'Just now';
    questions[questionIndex] = question;

    this.setState({questions});
  }

  getQuestions({newOnly}) {
    if (this.state.questionsLoading) return ;
    this.setState({questionsLoading: true});

    getQuestions(this.props.username, null, newOnly)
      .then(response => {
        if (response.data.status !== 'success') return axiosResponseErrorModal({response});
        this.setState({questions: response.data.data});
      })
      .catch(axiosResponseErrorModal)
      .finally(() => {
        this.setState({questionsLoading: false});
      });
  }

  getQuestionTemplate(question) {
    const username = question.hasOwnProperty('asked_by') ? question.asked_by.username : 'Anonymous';
    const profile_picture = question.hasOwnProperty('asked_by') ? question.asked_by.profile_picture : '/img/anon-avatar.svg';
    const href = question.hasOwnProperty('asked_by') ? (window.location.origin + '/@' + question.asked_by.username) : 'javascript:void(0)';

    return <Card bodyStyle={{padding: 0}} className="pl-4 pr-4 pt-2 pb-0 mb-2">
      {this.state.questionsLoading ?
        <Skeleton key={_} avatar={true} title={true} paragraph={true} active={true} loading={true}/> :
        <Comment
          actions={[<span key="comment-nested-reply-to">{question.asked_at}</span>]}
          author={<a href={href}>{username} <small className="badge badge-light ml-1">asked</small></a>}
          avatar={
            <Avatar src={profile_picture} onClick={() => {
              if (!question.hasOwnProperty('asked_by')) return;
              window.location = href;
            }}/>
          }
          content={
            <p>
              {question.content}
            </p>
          }
        >
          {question.answer ? <Comment
            actions={[<span key="comment-nested-reply-to">{question.answered_at}</span>]}
            author={<a>{this.state.user.name} <small className={'badge badge-success ml-1'}>answered</small></a>}
            avatar={
              <Avatar src={this.state.user.pp_url}/>
            }
            content={question.answer}
          >
          </Comment> : <Button className={'mb-2'} onClick={_ => this.toggleAnswerModal(question.id)}
                               type={'primary'}>Answer</Button>}
        </Comment>}
    </Card>;
  }

  getGhostQuestionTemplate() {
    return Array.from('loading').map(_ => <Card bodyStyle={{padding: 0}} className="pl-4 pr-4 pt-2 pb-0 mb-2">
      <Skeleton key={_} avatar={true} title={true} paragraph={true} active={true} loading={true}/>
    </Card>);
  }

  getProfileActionsDependentToSelf() {
    if (this.props.self === true) return [
      <Tooltip key={0} title={'Settings'}>
        <Link to={'/profile/settings'}><Icon type="setting"/></Link>
      </Tooltip>,
      <Tooltip key={1} title={'Edit Profile'}>
        <Link to={'/profile/edit'}><Icon type="edit"/></Link>
      </Tooltip>,
      <span onClick={LoginUserMenu.performLogout}>
        <Tooltip key={2} title={'Logout'}>
            <Icon type="logout"/>
        </Tooltip>
      </span>
    ];

    return [
      <Link to={`/@${this.state.user.username}/followers`}>
        <i className="fa fa-user-friends"/><br/>
        {this.state.user.total_followers} Followers
      </Link>,
      <Link to={`/@${this.state.user.username}/following`}>
        <i className="fa fa-users"/><br/>
        {this.state.user.total_followings} Following
      </Link>,
      <Link to={`/@${this.state.user.username}/questions`}>
        <i className="fa fa-star"/><br/>
        {this.state.user.total_answered} Answers
      </Link>,
    ];
  }

  handleNewOnly() {
    const newOnly = !this.state.newOnly;
    this.setState({
      newOnly
    });

    this.getQuestions({newOnly});
  }

  renderQuestions() {
    if (this.state.user.private) {
      return <Alert
        message="This person has a private account. You need to follow him/her to view answers."
        type="warning" showIcon/>;
    }

    return <div className="questions_list">{
      this.state.questionsLoading ? this.getGhostQuestionTemplate() : this.state.questions.map(this.getQuestionTemplate.bind(this))
    }</div>;
  }

  openTwitter() {
    window.open('https://twitter.com/' + this.state.user.username);
  }

  renderContent() {
    const {path} = this.props.router.match;

    return <div className="col-md-8 col-sm-12">
      <Card bodyStyle={{padding: 0}} className={'mb-2'}>
        <PageHeader
          onBack={() => window.history.back()}
          title={this.state.user.name}
        >
          <div className="wrap">
            {this.props.self ?
              <div className="extraContent row">
                <div className="col-12">
                  <p>Questions sent to you</p>
                </div>
                <div className="col-12">
                  <Form layout={'inline'}>
                    <Form.Item label="Unanswered Only">
                      <SwitchAnt checked={this.state.newOnly}
                              onClick={this.handleNewOnly}/>
                    </Form.Item>
                  </Form>
                </div>
              </div> :
              <div className="extraContent row">
                <div className="col-md-12">
                  <p>
                    Answered questions by {this.state.user.name}
                  </p>
                </div>
              </div>
            }
          </div>
        </PageHeader>
      </Card>

      <Switch>
        <Route path={`${path}/questions`}>
          {this.renderQuestions()}
        </Route>
        <Route path={`${path}/following`}>
          {this.renderFollowing()}
        </Route>
        <Route path={`${path}/followers`}>
          {this.renderFollowers()}
        </Route>
        {this.props.self ? [
          <Route path={`${path}/settings`}>
            <SettingsPage />
          </Route>,
          <Route path={`${path}/edit`}>
            Profile Edit
          </Route>
        ]: null}
      </Switch>
    </div>;
  }

  renderFollowing() {
    return <Following self={this.props.self} user={this.state.user} />;
  }

  renderFollowers() {
    return <Followers self={this.props.self} user={this.state.user} />;
  }

  follow() {
    if (this.state.user.is_followed) {
      return this.unfollow();
    }

    this.setState({ followInProgress: true })
    follow(this.state.user.username, true)
      .then(result => {

        if (result.data.status === 'success') {
          const user = this.state.user;
          user.is_followed = true;

          this.setState({ isFollowing: true, user })
        } else {
          axiosResponseErrorModal(result);
        }

        this.setState({ followInProgress: false });
      })
      .catch(result => {
        axiosResponseErrorModal(result);
        this.setState({ followInProgress: false });
      });
  }

  async unfollow() {
    this.setState({ followInProgress: true });
    const result = await follow(this.state.user.username, false);

    if (result.data.status === 'success') {
      const user = this.state.user;
      user.is_followed = false;

      this.setState({ isFollowing: true, user })
    }

    this.setState({ followInProgress: false });
  }

  getDescription() {
    let biographyText = this.state.user.bio ? this.state.user.bio : '[bio not set]';
    if (this.props.self === true) {
      return biographyText;
    }
    let isFollowing = '';
    if (this.state.user.is_following) {
      isFollowing = ' (follows you)';
    }

    return biographyText+isFollowing;
  }

  goTo(path) {
    const {history} = this.props.router;
    history.push(path);
  }

  render() {
    return (
      <div className={'container'}>
        <Content className={'pt-3 row'}>
          <div className="col-md-4 col-sm-6 col-sm-12">
            <Card
              cover={<img src={this.state.user.banner_url}/>}
              actions={this.getProfileActionsDependentToSelf()}
            >
              <Meta
                avatar={<Avatar src={this.state.user.pp_url}>{this.state.user.name}</Avatar>}
                title={this.state.user.name}
                description={this.getDescription(this.state.user)}
              />
              <Row hidden={!this.props.self} className={'mt-4'}>
                <Col span={8}>
                  <Button
                    block
                    type={'link'}
                    onClick={() => this.goTo('/profile/followers')}>
                    {this.state.user.followers_count} Followers
                  </Button>
                </Col>
                <Col span={8}>
                  <Button
                    block
                    type={'link'}
                    onClick={() => this.goTo('/profile/following')}>
                    {this.state.user.following_count} Following
                  </Button>
                </Col>
                <Col span={8}>
                  <Button
                    block
                    type={'link'}
                    onClick={() => this.goTo('/profile/questions')}>
                    {this.state.questions.length} Questions
                  </Button>
                </Col>
              </Row>
              <ButtonGroup hidden={this.props.self} className="mt-3">
                <Button
                  icon='question'
                  type={'danger'}
                  onClick={this.toggleQuestionModal}>
                  Ask
                </Button>
                <Button
                  type={this.state.user.is_followed ? 'danger' : 'success'}
                  loading={this.state.followInProgress}
                  icon={this.state.user.is_followed ? 'user-delete' : 'user-add'}
                  onClick={this.follow}>
                  {this.state.user.is_followed ? 'Unfollow' : 'Follow'}
                </Button>
                <Button
                  hidden={!this.state.user.show_twitter}
                  type={'primary'}
                  icon="twitter"
                  onClick={this.openTwitter.bind(this)}>
                  Twitter
                </Button>
              </ButtonGroup>
            </Card>
          </div>
          {this.state.user ? this.renderContent() : null}

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
            <Form.Item label="Anonymous" labelAlign="left">
              <SwitchAnt defaultChecked onChange={_ => this.setState({isAnon: _})}/>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          okText={'Send'}
          cancelText={'Nevermind'}
          visible={this.state.answerModalVisibility}
          onOk={this.sendAnswer}
          confirmLoading={this.state.answerModalLoading}
          onCancel={this.toggleAnswerModal}
        >
          <Form layout="horizontal">
            <Form.Item
              label={"Your answer"}
              validateStatus={this.state.answerContentValidationStatus}
              help={this.state.answerContentHelpText}>
              <TextArea
                minLength={10}
                maxLength={140}
                value={this.state.answerContent}
                onInput={this.handleAnswerContentChange}
                placeholder={'Please be kind to others.'}
                rows={4}
                title={'Your answer...'}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default UserProfilePage;
