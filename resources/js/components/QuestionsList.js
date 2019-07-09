import React, {Component} from 'react';

class QuestionsList extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className={'row'}>
        
        {this.props.data.map(question => {
          return <div className="col-12">
            <div className="card mb-3 question-block">
              <div className="card-inner question-inner p-2">
                <div className="media"
                     data-toggle="collapse"
                     href={`#collapse${question.id}`}
                     role="button"
                     aria-expanded="false"
                     aria-controls={`collapse${question.id}`}>
                  
                  <img width={60} className="mr-3 img-thumbnail rounded-circle" src="/img/anon-avatar.svg"/>
                  
                  <div className="media-body">
                    
                    <h5 className="mt-0 question-title">
                      Anonymous Asked {question.answer ? <small className={'badge badge-success ml-1'}>Answered</small> : null}
                    </h5>
                    
                    <div className="question-content">{question.content}</div>
                    
                    {question.answer ? <div className="media mt-4">
                      <img width={60}  src={this.props.pp_url} className="mr-3 img-thumbnail rounded-circle"/>
                      <div className="media-body">{question.answer}</div>
                    </div> : null}
                    
                  </div>
                </div>
                
                {question.answer ? null :
                    <div className="answer-area pt-4 collapse" id={`collapse${question.id}`}>
                      <div className="form-group">
                        <textarea placeholder={'Answer...'} className="form-control"></textarea>
                      </div>
                      <div className="form-group">
                        <button className="btn btn-succes btn-sm" type={'button'}>
                          <i className="fa fa-send pr-1"></i>
                          Send Answer
                        </button>
                      </div>
                    </div>}
                
              </div>
            </div>
          </div>
        })}
      
      </div>
    );
  }
}

export default QuestionsList;