import React, {Component} from 'react';
import { Result, Button } from 'antd';

class NotFoundPage extends Component {
  
  constructor(props) {
    super(props);
  }
  
  goHome() {
    this.props.router.history.push('/')
  }
  
  render() {
    return (
      <Result status={404}
              title={'Not Found'}
              subTitle={'The requested page was not found!'}
              extra={<Button type={'primary'} onClick={this.goHome.bind(this)}>Go Home</Button>}
      />
    );
  }
}

export default NotFoundPage;