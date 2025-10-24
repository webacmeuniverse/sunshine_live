import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withTranslation } from 'react-i18next';
import NavContainer from '../../smartcomponents/ossnavcontainer';
import MobileNavContainer from '../../smartcomponents/ossMobileNavContainer';
import ENDPOINTS from '../../../constants/endpoints';
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import TopBar from '../../../components/ossnavigation/TopBar';
import Moment from 'moment';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class Support extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      userDataList: [],
      userChatDetailsData: [],
      ckData:'',
      basicInformation: {      
        email:'',
        topic:'',
        message:''                     
      },
    }

  }
  basicInformationChange = e => {

   
    let nameType  = e.target.name;
    let value = e.target.value;
    //this.setState({
    //  basicInformation: [ ...this.state.nameType, e.target.value],
   // })



   this.setState({
    basicInformation:{
      ...this.state.basicInformation,
      [nameType]: value
    }
  });

      if(e.target.name==='email'){
        if(e.target.value==='' || e.target.value===null ){
          this.setState({
            emailError:true,
            emailMsg:'email field is required'
          })
        }else if( !e.target.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) ){

          this.setState({
            emailError:true,
            emailMsg:'please enter a valid email address'
          })
        } else {
          this.setState({
            emailError:false,     
            emailMsg:''
          
          })
        }
      }

      if(e.target.name==='topic'){
        if(e.target.value==='' || e.target.value===null){
          this.setState({
            topicError:true,
            topicMsg:'Subject field is required'
          })
        } 
        
        else {
          this.setState({
            topicError:false,   
            topicMsg:''  
          
          })
        }
      }

      
  

     
  }
  messageTextGet  = (event, editorData) => {

    this.setState({
      basicInformation:{
        ...this.state.basicInformation,
        ['message']: editorData
      }
    });
    
        if(editorData==='' || editorData===null){
          this.setState({
            messageError:true,
            messageMsg:'message field is required'
          })
        } 
        
        else {
          this.setState({
            messageError:false,   
            messageMsg:'message field is required'  
          
          })

          
        }
      

  }
  userSendMessage  = (event, sender_email) => {

    const config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "topic":this.state.basicInformation.topic,
        "message":this.state.basicInformation.message,
        "sender_email":sender_email,
        "oss_admin_id":this.props.userdata.email

      })
    };

      if(this.state.messageError === false && this.state.topicError === false) {
                fetch(ENDPOINTS.SERVER + '/reply/mail', config)
                .then(res => res.json())
                // .then((result) => result.length ? JSON.parse(text) : {})
                .then(
                  (result) => {
                  
                  $("#message").val('');
                  $("#subject").val('');
                  
                 
                            this.userChatDetails(result.data.sender_email);

                            this.state.ckData = '';
                            this.forceUpdate();

                  },

                ).catch(error => {
                
                  alert({
                    text: 'data not available',
                    type: 'error',
                    delay: 800,
                    closer: true

                  });
                });

      }else{
          this.setState({
            messageError:true,
            messageMsg:'message field is required'
          })
          this.setState({
            topicError:true,
            topicMsg:'Subject field is required'
          })
      }
    
  }




  componentDidMount() {
    this.userListGet();

  }
  userListGet() {

    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    };


    fetch(ENDPOINTS.SERVER + '/book/a/call', config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
       

          if (result.documents.length != 0) {
            this.setState({
              userDataList: result.documents.filter(item => item.data.oss_admin_id == this.props.userdata.email)
          })
            


          } else {
            this.setState({
              userDataList: []
            })
            alert({
              text: 'data not available',
              type: 'success',
              delay: 800,
              closer: true
            });

          }


        },

      ).catch(error => {
        this.setState({
          userDataList: []
        })
        alert({
          text: 'data not available',
          type: 'error',
          delay: 800,
          closer: true

        });
      });
  }


  userChatDetails = (email) => {

    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "email": email

      })
    };
   

    fetch(ENDPOINTS.SERVER + '/reply/mail', config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          ;
          this.setState({
            userChatDetailsData: result
          })


        },

      ).catch(error => {
        this.setState({
          userChatDetailsData: []
        })
        alert({
          text: 'data not available',
          type: 'error',
          delay: 800,
          closer: true

        });
      });
  }

  render() {
 

    const { userdata,t } = this.props;
    return (
      <React.Fragment>
        <Helmet>
          <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style>
        </Helmet>
        <MobileNavContainer/>
        <div className="flex">
          <NavContainer />
          <div className="content oss-admin">

            <TopBar userdata={userdata} pageTitle={t('translations:suportTitle.Support')} subTitle='' />


            <section id="accordion" style={{ marginTop: '20px',marginBottom: '20px' }}>
              <div className="row">

                <div className="col-sm-12">
                  <div id="accordionWrapa1" role="tablist" aria-multiselectable="true">
                    <div className="card collapse-icon">
                    
                      <div className="card-body">
                        
                        <div className="collapse-default">
                                     {(() => {
                                                if (this.state.userDataList.length != 0) {
                                                  return<>
                                                            {this.state.userDataList.map((userInfo, userInfoKey, arr) => {
                                                              return (<>
                                                                <div className="card" key={userInfoKey}>
                                                                
                                                                  <div
                                                                    id={"heading" + userInfoKey}
                                                                    className="card-header"
                                                                    data-toggle="collapse"
                                                                    role="button"
                                                                    data-target={"#accordion" + userInfoKey}
                                                                    aria-expanded="false"
                                                                    aria-controls={"accordion" + userInfoKey}
                                                                    onClick={(e) => this.userChatDetails( userInfo.data.email)}
                                                                  >
                                                                    <span className="lead collapse-title" style={{ fontFamily: "Open Sans, sans-serif",fontStyle: '-moz-initial',color: '#000000',fontWeight: '500',fontSize: '13.602px' }}>  {userInfo.data.name}  {userInfo.data.last_name}
                                  
                                                                    </span>
                                                                  </div>
                                  
                                  
                                  
                                                                  <div
                                                                    id={"accordion" + userInfoKey}
                                                                    role="tabpanel"
                                                                    data-parent="#accordionWrapa1"
                                                                    aria-labelledby={"heading" + userInfoKey}
                                                                    className="collapse"
                                                                    aria-expanded="false"
                                                                  >
                                                                    <div className="card-body">
                                                                      <div className="row invoice-spacing" style={{marginLeft: '5px',marginRight: '5px'}}>
                                  
                                                                        <div className="col-xl-3 p-0">
                                                                          <p>{t('translations:documents.name')}</p>
                                                                          <h6 className="mb-2" style={{ color: '#6c757d' }}>  {userInfo.data.name} {userInfo.data.last_name}</h6>
                                  
                                  
                                                                        </div>
                                                                        <div className="col-xl-3 p-0">
                                                                          <p>{t('translations:organizations.phone')}</p>
                                                                          <h6 className="mb-2" style={{ color: '#6c757d' }}> {userInfo.data.phone_number}</h6>
                                  
                                  
                                                                        </div>
                                                                        <div className="col-xl-3 p-0">
                                                                          <p>{t('translations:auth.email')}</p>
                                                                          <h6 className="mb-2" style={{ color: '#6c757d' }}>{userInfo.data.email}  </h6>
                                  
                                  
                                                                        </div>
                                                                        <div className="col-xl-3 p-0">
                                                                          <p>{t('translations:suportTitle.Message')}</p>
                                                                          <h6 className="mb-2" style={{ color: '#6c757d' }}>{userInfo.data.description} </h6>
                                  
                                  
                                                                        </div>
                                  
                                  
                                                                      </div>
                                                                      <br></br>
                                                                      <br></br>
                                                                      <div className="row">
                                                                          <div className="col-sm-6">
                                                                            <div className="todo-task-list-wrapper list-group" style={{ height: '300px',overflow: 'auto' }}>
                                                                              <ul className="todo-task-list media-list" id="todo-task-list">
                                                                                {this.state.userChatDetailsData.filter(book => book.sender_email === userInfo.data.email && book.oss_admin_id == this.props.userdata.email).sort((a, b) => a.CreatedAt > b.CreatedAt ? -1:1).map((chatUser, chatKey) => {
                                                                                  return (<>
                                  
                                                                                    <li className="todo-item" key={chatKey} style={{ cursor: 'pointer', transition: 'all .2s,border-color 0s', position: 'relative', padding: '0.893rem 2rem', borderTop: '1px solid #EBE9F1' }}>
                                                                                      <div className="todo-title-wrapper">
                                                                                        <div className="todo-title-area">
                                  
                                                                                          <div className="title-wrapper">
                                                                                          <span className="todo-title">{t('translations:suportTitle.Subject')}: {chatUser.topic}</span>
                                                                                          <br></br>
                                                                                          <div className="w-64 sm:w-auto truncate essChecklistquestions " dangerouslySetInnerHTML={{ __html: chatUser.message }} style={{ whiteSpace: 'unset' }} />
                                                                                        
                                                                                          </div>
                                                                                        </div>
                                                                                        <div className="todo-item-action">
                                  
                                                                                          <small className="text-nowrap text-muted mr-1">{Moment(chatUser.CreatedAt).format('d MMM HH:mm:ss')}</small>
                                  
                                                                                        </div>
                                                                                      </div>
                                                                                    </li>
                                  
                                                                                  </>);
                                                                                })}
                                                                              </ul>
                                                                            </div>
                                                                          </div>
                                  
                                                                          <div className="col-sm-6">
                                                                              <div className="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">
                                                                                                <div className="grid grid-cols-12 mt-1">
                                                                                                  <div className="intro-y col-span-12 lg:col-span-12">
                                  
                                                                                                    <div className="intro-y box">
                                  
                                                                                                      <div className="p-1" id="input">
                                                                                                        <div className="preview">
                                                                                                          <div>
                                                                                                            <label>{t('translations:suportTitle.Subject')} </label>
                                                                                                            <input type="text" name="topic" id="subject" className="input w-full border mt-2" onChange={(e) => this.basicInformationChange(e)} placeholder={t('translations:suportTitle.Subject')} />
                                                                                                            {this.state.topicError === true ? <span style={{color: "red"}}>{this.state.topicMsg}</span> : ''}
                                                                                                          </div>
                                                                                                          <div className="mt-3">
                                                                                                            
                                                                                                            <CKEditor id="message" name="message" 
                                                                                                                  editor={ ClassicEditor }
                                                                                                                  config={{
                                                                                                                    plugins: ['Essentials',
                                                                                                                    'CKFinderUploadAdapter',
                                                                                                                    'Autoformat',
                                                                                                                    'Bold',
                                                                                                                    'Italic',
                                                                                                                    'BlockQuote',
                                                                                                                    
                                                                                                                    'EasyImage',
                                                                                                                    'Heading',
                                                                                                                    'Image',
                                                                                                                    'ImageCaption',
                                                                                                                    'ImageStyle',
                                                                                                                    'ImageToolbar',
                                                                                                                    'ImageUpload',
                                                                                                                    'Indent',
                                                                                                                    
                                                                                                                    'List',
                                                                                                                    'MediaEmbed',
                                                                                                                    'Paragraph',
                                                                                                                    'PasteFromOffice',
                                                                                                                    'Table',
                                                                                                                    'TableToolbar',
                                                                                                                    ],
                                                                                                                    toolbar: [ 'heading',
                                                                                                                    '|',
                                                                                                                                                                     // <--- ADDED
                                                                                                                    'bold',
                                                                                                                    'italic',
                                                                                                                    
                                                                                                                    'bulletedList',
                                                                                                                    'numberedList',
                                                                                                                    //'uploadImage',
                                                                                                                    'blockQuote',
                                                                                                                    'undo',
                                                                                                                    'redo']
                                                                                                                  }}
                                                                                                                  data={this.state.ckData}
                                                                                                                  onReady={ editor => {
                                                                                                                      // You can store the "editor" and use when it is needed.
                                                                                                                 
                                                                                                                  } }
                                                                                                                  onChange={ ( event, editor ) => {
                                                                                                                      const data = editor.getData();
                                                                                                                     
                                                                                                                  } }
                                                                                                                  onBlur={(e, editor) => this.messageTextGet(e,editor.getData()) }
                                                                                                                  onFocus={ ( event, editor ) => {
                                                                                                                     
                                                                                                                  } }
                                                                                                              />
                                                                                                            {/* <textarea name="message" id="message" className="input w-full  border mt-2" onChange={(e) => this.basicInformationChange(e)}  rows="4" cols="50"></textarea> */}
                                                                                                          <br></br>
                                                                                                            {this.state.messageError === true ? <span style={{color: "red"}}>{this.state.messageMsg}</span> : ''}
                                                                                                          </div>
                                                                                                        </div>
                                                                                                        <div className="sm:pl-1 mt-1">
                                                                                                          <button type="button" onClick={(e) => this.userSendMessage(e, userInfo.data.email)} className="button bg-theme-1 text-white">{t('translations:suportTitle.Send')}</button>
                                                                                                        </div>
                                                                                                      </div>
                                                                                                    </div>
                                                                                                  </div>
                                                                                                </div>
                                                                                              </div>
                                                                          </div>
                                                                      </div>
                                  
                                  
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                                <br></br>
                                                              </>);
                                                              
                                                            })}
</>
                                                     }else {

                                                     return <h3 style={{ textAlign: 'center' }}>{t('translations:suportTitle.Title1')} </h3>;
                                                }
                                            })()}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </React.Fragment>
    );

  }
}

export default connect(state => ({
  alerts: state.alerts.pending,
  userdata: state.user.profileInfo.data,
}))(withTranslation('translations')(Support));
