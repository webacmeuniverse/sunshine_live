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

class UserSupport extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      userDataList: [],
      userChatDetailsData: [],
      errors: {},  
      errors1: {},
      ossAdminData:[],
      selectedCountry: this.props.country,
      bookACallUserInformation: {       
       
        description:'',    
        oss_admin_id:'',
                                      
      },
      basicInformation: {
       
        email:'',
        topic:'',
        message:''                     
      },
    }

  }

  bookACallDataChange = e => {

    let nameType  = e.target.name;
    let value = e.target.value;
    
  this.setState({
    bookACallUserInformation:{
      ...this.state.bookACallUserInformation,
      [nameType]: value
    }
  });     
}
handleValidation() {
  let fields = this.state.bookACallUserInformation;
  let errors = {};
  let formIsValid = true;
  
       

  if (!fields["oss_admin_id"]) {
    formIsValid = false;
    errors["oss_admin_id"] = "oss field is required";
  }
      if (!fields["description"]) {
        formIsValid = false;
        errors["description"] = "description field is required";
      }


       this.setState({ errors: errors });
      return formIsValid;

    }
bookACallFormSubmit = (e) => {
  if (this.handleValidation()) {
  

    let config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "name":this.props.userdata.name,
        "last_name":'',
        "email": this.props.userdata.email,
        "phone_number":this.props.userdata.telephone,
        "oss_admin_id":this.state.bookACallUserInformation.oss_admin_id,
        "description":this.state.bookACallUserInformation.description,
        "menu_type":''
       
      })
    }

     fetch(ENDPOINTS.SERVER + '/book/a/call', config)
        .then(status => status.json().then(data => ({ data, status })))
        .then(({ data, status }) => {
       
          alert({
            text: 'You Have Successfully Book A Call',
            type: 'success',
            delay: 800,
            closer: true
          });
        
         $('#addNewRequest').hide();
         $('.modal-backdrop').hide();
         
        })
        .catch(error => {
          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
      });

    }
};  



ossListNew = () => {

  const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
  };

  fetch(ENDPOINTS.SERVER + '/oss/admins', config)
      .then(res => res.json())
      //.then((result) => result.length ? JSON.parse(text) : {})
      .then(
          (result) => {
         
            if (result != null) {
              let resultData = result.filter(item => item.country === this.props.country)

              if (resultData.length === 0) {
                  let resultData1 = result.filter(item => item.country === 'Latvia')

                  this.setState({
                     // fetching: false,
                      ossAdminData: resultData1,
                  })

              } else {

                  this.setState({
                    //  fetching: false,
                      ossAdminData: resultData,
                  })
                
                  // this.setState({
                  //     ossAdminData: resultData,
                  //     selectedOssData: resultData[0],
                  // })
              }

              this.forceUpdate()
              //this.getOssStep();
          } else {

             // this.state.selectedOssEmail = '';
             // this.forceUpdate()

          }


              // if (result != null) {

              //     let resultData = result.filter(item => item.country === this.state.selectedCountry)
                 
                  
                      
              //         let resultData1 = result.filter(item => item.country === 'Latvia')
                    
                      
              //         this.setState({
              //             ossAdminData: resultData1,
                          
              //         })
                 
                 

              // }else{

                 
              // }
          }
      )

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

     
      if(e.target.name==='message'){
        if(e.target.value==='' || e.target.value===null){
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
  

     
  }
  userSendMessage  = (event, sender_email) => {

    const config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "topic":this.state.basicInformation.topic,
        "message":this.state.basicInformation.message,
        "sender_email":this.props.userdata.email,
        "oss_admin_id":sender_email

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
                            this.userChatDetails(result.data.oss_admin_id);
                            this.userListGet();
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

  // componentDidUpdate() {
  //   this.userChatDetails();
  // }

  
  componentDidMount() {
    this.userListGet();
    this.ossListNew();

  }

  componentDidUpdate(){

    
   
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
          ;
          if (result.documents.length != 0) {

         
            this.setState({
              userDataList: result.documents.filter(item => item.data.email === this.props.userdata.email)
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
  userChatDetails = (email) => {
   
    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "email":  this.props.userdata.email

      })
    };
   

    fetch(ENDPOINTS.SERVER + '/reply/mail', config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          ;
          this.setState({
            userChatDetailsData: result.filter(item => item.oss_admin_id === email) 
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
    const { userdata ,t} = this.props;
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



            <section id="accordion" style={{ marginTop: '10px',marginBottom: '0PX' }}>
              <div className="row">
              <div className="col-sm-12 mb-3">
              <button type="button" data-toggle="modal" data-target="#addNewRequest" className="button w-20 bg-theme-1 text-white" style={{ width: '10%',float: 'right' }}>
              {t('translations:suportTitle.AddNewRequest')}</button>
                                           </div>
                                           <br></br>
                <div className="col-sm-12">
                  <div id="accordionWrapa1" role="tablist" aria-multiselectable="true">
                    <div className="card collapse-icon">
                    
                      <div className="card-body">
                        
                        <div className="collapse-default">
                        {(() => {
                                                if (this.state.userDataList.length > 0) {
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
                                                          onClick={(e) => this.userChatDetails(userInfo.data.oss_admin_id)}
                                                        >
                                                          <span className="lead collapse-title" style={{ fontFamily: "Open Sans, sans-serif",fontStyle: '-moz-initial',color: '#000000',fontWeight: '500',fontSize: '13.602px' }}>  {userInfo.data.oss_admin_id} 
                        
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
                                                            <div className="row invoice-spacing">
                        
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
                                                                      {this.state.userChatDetailsData.filter(book => book.sender_email === userInfo.data.email && book.sender_email == this.props.userdata.email).sort((a, b) => a.CreatedAt > b.CreatedAt ? -1:1).map((chatUser, chatKey) => {
                                                                        return (<>
                        
                                                                          <li className="todo-item" key={chatKey} style={{ cursor: 'pointer', transition: 'all .2s,border-color 0s', position: 'relative', padding: '0.893rem 2rem', borderTop: '1px solid #EBE9F1' }}>
                                                                            <div className="todo-title-wrapper">
                                                                              <div className="todo-title-area">
                        
                                                                                <div className="title-wrapper">
                                                                                <span className="todo-title">{t('translations:suportTitle.Subject')} :- {chatUser.topic}</span>
                                                                                <br></br>
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
                                                                                                  <label>{t('translations:suportTitle.Subject')}</label>
                                                                                                  <input type="text" name="topic" id="subject"  className="input w-full border mt-2" onChange={(e) => this.basicInformationChange(e)} placeholder="Subject" />
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
                                                                                                
                                                                                                 <br></br>
                                                                                                  {this.state.messageError === true ? <span style={{color: "red"}}>{this.state.messageMsg}</span> : ''}
                                                                                                </div>
                                                                                              
                                                                                              </div>
                                                                                              <div className="sm:pl-1 mt-1">
                                                                                                <button type="button" onClick={(e) => this.userSendMessage(e, userInfo.data.oss_admin_id)} className="button bg-theme-1 text-white">{t('translations:suportTitle.Send')}</button>
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

                                                  return <h3 style={{ textAlign: 'center' }}>{t('translations:suportTitle.Title1')}</h3>;
                                             }

                                         })()}

                     

</div>
                      </div>

                      <div className="modal fade" id="addNewRequest" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content" style={{width: '416px',height: '260px' }}>
                                    <div className="modal-header" style={{background: '#FCCB00'}}>
                                        <center>
                                            <h5 className="modal-title" style={{padding: '1rem',margin:'-1rem -1rem -1rem 6rem',textTransform: 'uppercase',fontFamily: 'Inter',fontStyle: 'normal',fontWeight: 'bold',fontSize: '16.1691px',color:'#FFFFFF'}}> {t('translations:suportTitle.AddNewRequest')}</h5>
                                        </center>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                            style={{padding: '0px',margin: '0px'}}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        {/* <h2 className="mb-3" style={{fontFamily: 'Inter',fontStyle: 'normal',fontWeight: '800',fontSize: '18.0073px',lineHeight: '32px',textAlign: 'center',color: '#4B4B4A'}}>Schedule a meeting with us </h2> */}

                                      
                                        <div className="row" style={{marginLeft: 'auto',marginRight: 'auto'}}>
                                            <div className="col-md-12 mb-4">

                                            <select  name="oss_admin_id" id="location" style={{background:'none',borderBottom: '0.89246px solid #BFD4E4',    width: '100%'}} onChange={(e) => this.bookACallDataChange(e)} required>
                                               <option value="" >Select OSS</option>
                                                  { this.state.ossAdminData.map((subval, idx) => {
                                                                                                  
                                                                  return (
                                                                    
                                                                        <option value={subval.email} key={subval.email} >{subval.organization_name}</option>
                                                                        
                                                                      )
                                                                })
                                                              
                                                              } 


                                                  </select>
                                                <span style={{ color: "red",fontFamily: 'Inter',fontStyle: 'normal',fontweight: '500',fontSize: '10.3482px' }}>{this.state.errors["oss_admin_id"]}</span> 
                                            </div>
                                          
                                            <div className="col-md-12 mb-4">
                                            
                                                <input type="text" name="description"  className="form-control modelTextbox" onChange={(e) => this.bookACallDataChange(e)} placeholder="Define the topic of interest"/>
                                                <span style={{ color: "red",fontFamily: 'Inter',fontStyle: 'normal',fontweight: '500',fontSize: '10.3482px' }}>{this.state.errors["description"]}</span> 
                                            </div>

                                        </div>

                                    </div>
                                    <div className="px-5 py-3 text-right border-t border-gray-200 dark:border-dark-5">
                                    <center>    <button type="button" data-dismiss="modal" className="button w-30 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-1">{t('translations:workStatus.cancelled')}</button>
                                                                <button type="button" onClick={(e) => this.bookACallFormSubmit(e)}   className="button w-20 bg-theme-1 text-white">{t('translations:suportTitle.Send')}</button>
                                                                </center>
                                                            </div>
                                </div>
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
  country: state.user.country,
        language: state.user.language,
}))(withTranslation('translations')(UserSupport));
