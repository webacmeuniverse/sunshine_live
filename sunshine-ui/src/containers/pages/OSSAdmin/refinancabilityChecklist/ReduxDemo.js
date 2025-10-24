import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import NavContainer from '../../../smartcomponents/ossnavcontainer';
import language_icon from '../../../../styles/assets/images/language-icon.png';

import calculaadora from '../../../../styles/ossAdmin/assets/calculaadora.png';
import quizHomeIcon from '../../../../styles/ossAdmin/assets/quizHomeIcon.png';
import Logo_europa_White from '../../../../styles/ossAdmin/assets/Logo_europa_White.png';
import {
  Home as HomeIcon,
  BusinessCenter as OrganizationIcon,
  Business as AssetIcon,
  Equalizer as ProjectIcon,
  Security as AdminIcon,
  TableChart as TableChartIcon,
  Delete as DeleteIcon,
  Add as PlusIcon,
} from '@material-ui/icons';

import {
  getStepDataGet as getStepDataGetAction
} from '../../../../actions/stepData';

import TopBar from '../../../../components/ossnavigation/TopBar';
import {AppendFields,AppendStep} from "./AppendFields";
import {ResultData} from "./ResultData";
import ENDPOINTS from '../../../../constants/endpoints';

import Belgium from '../../../../styles/assets/images/country/Belgium.png';
import France from '../../../../styles/assets/images/country/France.png';
import Latvia from '../../../../styles/assets/images/country/Latvia.png';
import Spain from '../../../../styles/assets/images/country/Spain.png';
import Italy from '../../../../styles/assets/images/country/Italy.png';
import Portugal from '../../../../styles/assets/images/country/Portugal.png';
import UK from '../../../../styles/assets/images/country/UK.png';

import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';


import ReactTags from 'react-tag-autocomplete'
import './style.css';


class EESCalculatorView extends React.Component {
  componentDidMount() {
    const {
      getStepDataGet,
     
    } = this.props;

  
    getStepDataGet({
      "oss_admin_id":this.props.userdata.email,
      "lang":this.state.langSelected,                        
    });
   
  }
  constructor(props) {
    super(props);
    this.state = {
      tabStep: [],
      tabStepResult: [],
      langSelected: 'en',
      
    
    }
    this.stepDataGet = this.stepDataGet.bind(this);
    this.lngChange = this.lngChange.bind(this);
    //this.onDelete =this.onDelete.bind(this);   
  }
 
  lngChange = (e) => {

    
    this.state.langSelected =e.target.value
             
    this.forceUpdate()
        this.setState({
          langSelected: e.target.value
      })

     
      this.stepDataGet();
  }


  // onDelete (i,id) {

  //   let config = {
  //     method: 'DELETE',
  //     headers: { 'Content-Type': 'text/plain' },
     
  //   }
  
  
  //    fetch(ENDPOINTS.SERVER + '/step/result/subitem/'+id[i].field_id, config)
  //       ///.then(status => status.json().then(data => ({ data, status })))
  //       .then((result) => {
  //         if(result.status == 200){
      
           
  //           alert({
  //             text: 'Deleted Successfully',
  //             type: 'success',
  //             delay: 800,
  //             closer: true
  //           });
  //         }else{
  
  //           alert({
  //             text: 'There was an error!',
  //             type: 'error',
  //             delay: 800,
  //             closer: true
  //           });
  //         }
        
         
  //       });
  
  // }

//   componentDidMount(){                        
//     this.stepDataGet();                                         //
// }
componentDidUpdate() {

}

//Step Function Start
  stepDataGet(){
    const config = {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
              "oss_admin_id":this.props.userdata.email,
              "lang":this.state.langSelected,                        
            })
          };

          
          fetch(ENDPOINTS.SERVER + '/onboarding/residents/step', config)
              .then(res => res.json())
             // .then((result) => result.length ? JSON.parse(text) : {})
              .then(
                  (result) => {
                   
                  
                    if (result != null) {
                     
                            this.setState({
                              tabStep: result
                          })
                          
                        }else{
                          this.setState({
                            tabStep: []
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
                      tabStep: []
                  })
                alert({
                  text: 'data not available',
                  type: 'error',
                  delay: 800,
                  closer: true
        
                });
            });
  }
  addNewStep = e => {

    

    let stepCount = this.state.tabStep.length + 1;



    let config = {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "name":this.props.userdata.name+ ' Residents Step '+ stepCount,
        "index": stepCount,
        "require":true,
        "lang": this.state.langSelected,
        "oss_admin_id": this.props.userdata.email,
      })
    }
  
     fetch(ENDPOINTS.SERVER + '/onboarding/residents/step', config)
        .then(status => status.json().then(data => ({ data, status })))
        .then(({ data, status }) => {
          this.stepDataGet();

          this.questionAdd(data.data.ID,data.data.name);
          alert({
            text: 'Add New Step Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
        
         
        })
        .catch(error => {
          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
      });
    
    
  
  };
  stepTitleUpdate = (event,id) => {  
   
    let config = {
      method: 'Put',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "name":event.target.value,
        
      })
    }
  
    
     fetch(ENDPOINTS.SERVER + '/onboarding/residents/step/'+id, config)
        //.then(status => status.json().then(data => ({ data, status })))
        .then((result) => {
        if(result.status == 200){
          this.stepDataGet();
          alert({
            text: 'Data Update Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
         // alert('Data Update Successfully');

        }else{

          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
        }
      
       
      });
   
    }
 
    deleteStep = id => {
      const { tabStep } = this.state;
           
              const config = {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'text/plain' },
            };
            fetch(ENDPOINTS.SERVER + '/onboarding/residents/step/'+id, config)
               // .then(res => res.json())
               // .then((result) => result.length ? JSON.parse(text) : {})
                .then(
                    (result) => {
                        if(result.status == 200){
                          this.stepDataGet();
                           
                          alert({
                            text: 'Delete Successfully',
                            type: 'success',
                            delay: 800,
                            closer: true
                          });
                         
                        }else{
                          alert({
                            text: 'There was an error!',
                            type: 'error',
                            delay: 800,
                            closer: true
                          });
                        }
                 
                      
                    },
                   
                ).catch(error => {
                  alert({
                    text: 'There was an error!',
                    type: 'error',
                    delay: 800,
                    closer: true
                  });
                 // console.error('There was an error!', error);
              });
  
  
     
    };
    
    //Step Function Finish

    //Add New Question
    questionAdd = (id,stepName) => {

     
        let config = {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            "step_name":stepName,
            "name":'Question',
            "index": 0,
            "require":false,
            "lang": this.state.langSelected,
            "placeholder": '',
            "text": 'this is Step Field 1 text',
            "input_type":'Question'
          })
        }
    
         fetch(ENDPOINTS.SERVER + '/onboarding/residents/field/'+id, config)
            .then(status => status.json().then(data => ({ data, status })))
            .then(({ data, status }) => {
              this.stepDataGet();
              alert({
                text: 'Add New Question Successfully',
                type: 'success',
                delay: 800,
                closer: true
              });
            
             
            })
            .catch(error => {
              alert({
                text: 'There was an error!',
                type: 'error',
                delay: 800,
                closer: true
              });
          });
    };

    //Question Data Update

    questionUpdate = (event,id,stepKey,fieldKey) => {  

      const fieldName = event.target.name;
      const key = event.target.key;
      let value     = event.target.value;
      
      
  if([fieldName] == 'require'){
    
    if(value == 'true'){

       value =false;
    }else{
    
       value =true;
    }

  }else{
     value     = event.target.value;

  }
      
    
      this.state.tabStep[stepKey].data.step_fields[fieldKey][fieldName] =value
      this.forceUpdate()
     
      let config = {
        method: 'Put',
        credentials: 'include',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(this.state.tabStep[stepKey].data.step_fields[fieldKey])
      }
    
       fetch(ENDPOINTS.SERVER + '/onboarding/residents/field/'+id, config)
          ///.then(status => status.json().then(data => ({ data, status })))
          .then((result) => {
            if(result.status == 200){
              this.stepDataGet();
             
              alert({
                text: 'Question Update Successfully',
                type: 'success',
                delay: 800,
                closer: true
              });
            }else{
    
              alert({
                text: 'There was an error!',
                type: 'error',
                delay: 800,
                closer: true
              });
            }
          
           
          });
       
      }


      //Add New Field
      addNewField = id => {
 
        let filedTypeValue = $('#filedType-'+id).val();


        let { tabStep } = this.state;                          
           
          let stepCount = this.state.tabStep[id].data.step_fields.length + 1;
      
          let config = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
              "step_name":this.state.tabStep[id].data.name,
              "name":'Title',
              "index": stepCount,
              "require":false,
              "lang": this.state.langSelected,
              "placeholder": 'placeholder',
              "text": 'this is Step Field 1 text',
              "input_type":filedTypeValue
            })
          }
      
           fetch(ENDPOINTS.SERVER + '/onboarding/residents/field/'+this.state.tabStep[id].data.ID, config)
              .then(status => status.json().then(data => ({ data, status })))
              .then(({ data, status }) => {
                
                this.stepDataGet();
                alert({
                  text: 'Add New Field Successfully',
                  type: 'success',
                  delay: 800,
                  closer: true
                });
              
               
              })
              .catch(error => {
                alert({
                  text: 'There was an error!',
                  type: 'error',
                  delay: 800,
                  closer: true
                });
            });
        
      };

   fieldDelete= (fieldId,stepId) => {
         
        const config = {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain' },
        };
        fetch(ENDPOINTS.SERVER + '/onboarding/residents/field/'+fieldId, config)
            //.then(res => res.json())
          // .then((result) => result.length ? JSON.parse(text) : {})
            .then(
                (result) => {
                  if(result.status == 200){
                    this.stepDataGet();
                    alert({
                      text: 'Delete Successfully',
                      type: 'success',
                      delay: 800,
                      closer: true
                    });
                  
                   
                  }else{
                    alert({
                      text: 'There was an error!',
                      type: 'error',
                      delay: 800,
                      closer: true
                    });
              
                   
  
                  }
           
                  
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                  
                    //setError(error);
                }
            )
            .catch(error => {
              alert({
                text: 'There was an error!',
                type: 'error',
                delay: 800,
                closer: true
  
              });
          });
     
    }

    fieldOptionUpdate = (event,id) => {  

      const fieldName = event.target.name;
      const key = event.target.key;
      let value     = event.target.value;
      
      let config = {
        method: 'Put',
        credentials: 'include',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          "title":value,
          "option_value":value,
          "image": '',
         
        })
      }
    
    
     
      
       fetch(ENDPOINTS.SERVER + '/step/field/option/'+id, config)
          ///.then(status => status.json().then(data => ({ data, status })))
          .then((result) => {
            if(result.status == 200){
              this.stepDataGet();
             
              alert({
                text: 'Field Option Update Successfully',
                type: 'success',
                delay: 800,
                closer: true
              });
            }else{
    
              alert({
                text: 'There was an error!',
                type: 'error',
                delay: 800,
                closer: true
              });
            }
          
           
          });
        //   .catch(error => {
        //     alert('There was an error!');
        //     console.error('There was an error!', error);
        // });
    
      
      
      }
      
      
      addNewFieldOption = (event,id) => {  

       
        
        let config = {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            "title":'Title',
            "option_value":'Option Value',
            "image": '',
          
          })
        }
      
    
       
        
         fetch(ENDPOINTS.SERVER + '/step/field/option/'+id, config)
            ///.then(status => status.json().then(data => ({ data, status })))
            .then((result) => {
              if(result.status == 200){
                this.stepDataGet();
               
                alert({
                  text: 'Add Option Successfully',
                  type: 'success',
                  delay: 800,
                  closer: true
                });
              }else{
      
                alert({
                  text: 'There was an error!',
                  type: 'error',
                  delay: 800,
                  closer: true
                });
              }
            
             
            });
          //   .catch(error => {
          //     alert('There was an error!');
          //     console.error('There was an error!', error);
          // });
      
        
        
        }

        deleteFiled= (fieldId,stepId) => {
         
          const config = {
              method: 'DELETE',
              credentials: 'include',
              headers: { 'Content-Type': 'text/plain' },
          };
          fetch(ENDPOINTS.SERVER + '/onboarding/residents/field/'+fieldId, config)
              //.then(res => res.json())
            // .then((result) => result.length ? JSON.parse(text) : {})
              .then(
                  (result) => {
                    if(result.status == 200){
                      this.stepDataGet();
                      alert({
                        text: 'Delete Successfully',
                        type: 'success',
                        delay: 800,
                        closer: true
                      });
                    
                     
                    }else{
                      alert({
                        text: 'There was an error!',
                        type: 'error',
                        delay: 800,
                        closer: true
                      });
                
                     
    
                    }
             
                    
                  },
                  // Note: it's important to handle errors here
                  // instead of a catch() block so that we don't swallow
                  // exceptions from actual bugs in components.
                  (error) => {
                    
                      //setError(error);
                  }
              )
              .catch(error => {
                alert({
                  text: 'There was an error!',
                  type: 'error',
                  delay: 800,
                  closer: true
    
                });
            });
       
      }

      deleteFieldOption = (id) => {
        const config = {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'text/plain' },
      };
    
    
      fetch(ENDPOINTS.SERVER + '/step/field/option/'+id, config)
          //.then(res => res.json())
        // .then((result) => result.length ? JSON.parse(text) : {})
          .then(
              (result) => {
               
                if(result.status === 200){
                 
                  this.stepDataGet();
                  alert({
                    text: 'Delete Successfully',
                    type: 'success',
                    delay: 800,
                    closer: true
                  });
                
                 
                }else{
                  alert({
                    text: 'There was an error!',
                    type: 'error',
                    delay: 800,
                    closer: true
                  });
            
                 
    
                }
         
                
              },
              // Note: it's important to handle errors here
              // instead of a catch() block so that we don't swallow
              // exceptions from actual bugs in components.
              (error) => {
                
                  //setError(error);
              }
          )
          .catch(error => {
            alert({
              text: 'There was an error!',
              type: 'error',
              delay: 800,
              closer: true
    
            });
        });
          
          
      
      }  
      
      
     
   handleNextStep() {

    $('.nav-tabs > .nav-item > .active').parent().next('li').find('a').trigger('click');

}

handlePrevStep() {

  $('.nav-tabs > .nav-item > .active').parent().prev('li').find('a').trigger('click');

}


 

  render() {

   
    const { userdata,allStepData } = this.props;
    let { bookDetails,tabStep ,tabStepResult,tags,suggestions,newTag,tags2} = this.state;

    return (
      <React.Fragment>
        
        <Helmet>
          <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style>
        </Helmet>
        <div className="flex">
          <NavContainer />
          <div className="content oss-admin">
            <TopBar userdata={userdata} pageTitle='Onboarding Residents' />
            
            <div className="intro-y grid grid-cols-12 gap-12 mt-1">
              <div className="col-span-12 lg:col-span-12">
                <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                  <div className="container oss-admin h-auto">
                    <div className="row row-eq-height" style={{ background: ' #F5F7FA' }}  >
                      <div className="col-md-3 pl-0" id="EEScalculator">
                        <div className="row">
                          <div className="col-md-12 mb-3 mt-2 text-center">
                            <center><img src={Logo_europa_White} alt="EUROPA" /></center>
                          </div>
                          <div className="col-md-12 mb-3 text-center ">
                            <h2 className="welcomeTitle mt-10"> How much will it cost?</h2>
                          </div>
                          <div className="col-md-12 mb-2 mt-2 text-center" style={{ paddingRight: '0px' }} >
                            <center>
                              <img src={calculaadora} alt="" style={{ marginTop: '-34px',marginLeft:'126px',height:'50%',position:'absolute' }} />
                                <img src={quizHomeIcon} alt="" style={{ marginTop: '30px' }} />
                            </center>
                          </div>
                        </div>
                        <div className="row" style={{ marginLeft: '0PX',marginRight:'0PX' }}>
                          <div className="col-md-12 mb-2 mt-2" style={{ marginLeft: 'auto',marginRight:'auto' }} >
                            <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={this.addNewStep }>
                              <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                                <PlusIcon />
                                 <i className="fa fa-plus" aria-hidden="true" className="w-4 "></i> </span>
                              </button>
                            <ul className="nav nav-tabs flex-column mb-3" id="customeTab">

                            <AppendStep  add={this.addNewRow}
                                         addNewRow={this.addNewRow}
                                                          delete={this.clickOnDelete}
                                                          tabStep={tabStep}
                                                          nextButtonClick={this.handleNextStep}
                                                          bookDetails={bookDetails}
                                                          prevButtonClick={this.handlePrevStep}
                                                          deleteStep={this.deleteStep}
                                                          questionUpdate={this.questionUpdate}
                                                          stepTitleUpdate={this.stepTitleUpdate}
                                                          addNewField={this.addNewField}
                                                          fieldDelete={this.fieldDelete}
                                                          fieldUpdate={this.fieldUpdate}
                                                          addNewFieldOption={this.addNewFieldOption}
                                                          deleteFiled={this.deleteFiled}
                                                          fieldOptionUpdate={this.fieldOptionUpdate}
                                                          deleteFieldOption={this.deleteFieldOption}
                                                         
                                                        />                                    
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-9 " style={{ background: 'white' }} >
                                  <div className="row row-eq-height align-middle my-auto">
                                      <div className="col-md-12" style={{  paddingLeft: "15px"}}>
                                          <h2 className="basicinfo-title"><span style={{ fontSize: '9.92639px',color:'#FE9B00' }}>Q: 
                                          <span id="currentCounter">1 </span>/5 </span> &nbsp;&nbsp;<span >Onboarding Residents</span>
                                          </h2>
                                          <br/>
											<br/>
											<h2 className="modelH2"> 
													  Select Language</h2>
													<br/>

													<div className="row">
														<div className="col-md-1" id="ossstep5chk">
                             <center>
														<input type="radio" id="language" name="language" value="bg" onChange={e =>this.lngChange(e)}/>
														<label htmlFor="language" ><img src={Belgium} alt="Belgium" style= {{marginTop:'6px'   }} /></label>
														</center>
                            </div>
														<div className="col-md-1" id="ossstep5chk">
                            <center>
														<input type="radio" id="language1" name="language" value="fr"onChange={e =>this.lngChange(e)}/>
														<label htmlFor="language1"> <img src={France} alt="France"  style= {{marginTop:'6px'   }} /></label>
														</center>
                            </div>
														<div className="col-md-1" id="ossstep5chk">
                            <center>
														<input type="radio" id="language2" name="language" value="lv" onChange={e =>this.lngChange(e)}/>
														<label htmlFor="language2" > <img src={Latvia} alt="Latvia"  style= {{marginTop:'6px'   }} /></label>
														</center>
                            </div>
														<div className="col-md-1" id="ossstep5chk">
                            <center>
														<input type="radio" id="language3" name="language" value="sp" onChange={e =>this.lngChange(e)}/>
														<label htmlFor="language3" > <img src={Spain} alt="Spain"  style= {{marginTop:'6px'   }}/></label>
														</center>
                            </div>
														<div className="col-md-1" id="ossstep5chk">
                            <center>
														<input type="radio" id="language4" name="language" value="it" onChange={e =>this.lngChange(e)}/>
														<label htmlFor="language4" ><img src={Italy} alt="Italy" style= {{marginTop:'6px'   }} /></label>
                            </center>
                          	</div>
														<div className="col-md-1" id="ossstep5chk">
                            <center>
														<input type="radio" id="language5" name="language" value="pt" onChange={e =>this.lngChange(e)}/>
														<label htmlFor="language5" ><img src={Portugal} alt="Portugal" style= {{marginTop:'6px'   }} /></label>
                            </center>
                          	</div>
														<div className="col-md-1" id="ossstep5chk">
                            <center>
														<input type="radio" id="language6" name="language"  defaultChecked={true} value="en" onChange={e =>this.lngChange(e)}/>
														<label htmlFor="language6" >        <img src={UK} alt="English"  style= {{marginTop:'6px'   }}/></label>
														</center>
                            </div>
													</div>
                                        
                                          <hr/>
                                      </div>
                                      <div className="col-md-12">
                                        <section className="signup-step-container" style={{ marginTop: '10px',marginBottom:'10px' }} >
                                          <div className="container">
                                            <div className="row d-flex ">
                                              <div className="col-md-12">                                       
                                                <div className="wizard">
                                                    <div className="tab-content" id="tab-details">
                                                        <AppendFields
                                                         add={this.addNewRow}
                                                         addNewRow={this.addNewRow}
                                                                          delete={this.clickOnDelete}
                                                                          tabStep={tabStep}
                                                                          nextButtonClick={this.handleNextStep}
                                                                          bookDetails={bookDetails}
                                                                          prevButtonClick={this.handlePrevStep}
                                                                          deleteStep={this.deleteStep}
                                                                          questionUpdate={this.questionUpdate}
                                                                          stepTitleUpdate={this.stepTitleUpdate}
                                                                          addNewField={this.addNewField}
                                                                          fieldDelete={this.fieldDelete}
                                                                          fieldUpdate={this.fieldUpdate}
                                                                          addNewFieldOption={this.addNewFieldOption}
                                                                          deleteFiled={this.deleteFiled}
                                                                          fieldOptionUpdate={this.fieldOptionUpdate}
                                                                          deleteFieldOption={this.deleteFieldOption}
                                                        />    

                                                                                                                                                                       
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                    </section>
                                  </div>
                             </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );

  }
}

const mapStateToProps = (state) => {
  return {
    alerts: state.alerts.pending,
    userdata: state.user.profileInfo.data,
    allStepData: state.stepData.allStepData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {   
    getStepDataGet: (data) => {
      dispatch(getStepDataGetAction(data));
    },
  };
};

export default withRouter(withTranslation('translations')(connect(
  mapStateToProps,
  mapDispatchToProps
)(EESCalculatorView)));

