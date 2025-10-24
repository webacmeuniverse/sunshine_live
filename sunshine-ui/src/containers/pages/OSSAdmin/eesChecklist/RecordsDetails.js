import React from 'react';
import PropTypes from 'prop-types';

// WRAPPERS
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import ENDPOINTS from '../../../../constants/endpoints';
// COMPONENTS
import { Helmet } from 'react-helmet';
import NavContainer from '../../../smartcomponents/ossnavcontainer';
import TopBar from '../../../../components/ossnavigation/TopBar';



class RecordsDetails extends React.Component {
    constructor(props) {
    
        super(props);
        this.state = {
            userInputDataGet: [],
         
        
        }
        
      }
  componentDidMount() {
   
    this.userListGet();

  }
  userListGet(){
   
    const config = {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain' },
           
          };

       
          fetch(ENDPOINTS.SERVER + '/onboarding/user/data/'+this.props.match.params.id, config)
              .then(res => res.json())
             // .then((result) => result.length ? JSON.parse(text) : {})
              .then(
                  (result) => {
                     
                    if (result != null) {
                        this.setState({
                          userInputDataGet: [result],
            
                        })
                        
                      }else{
                       
                          alert({
                              text: 'data not available',
                              type: 'success',
                              delay: 800,
                              closer: true
                          });
    
                     }
               
                   

                  },
                  
              ).catch(error => {
               
                alert({
                  text: 'data not available',
                  type: 'error',
                  delay: 800,
                  closer: true
        
                });
            });
  }
  render() {
    const {
      alerts,
      match,
      myUserData,
      publicUserData,
      userdata,
      loadingUser,
     
      ossAdmin,
    } = this.props;
   
   

    return (
      <div style={{ height: '100%' }}>
     
        <Helmet title='User Profile | SUNShINE' >
        <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size:14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style> </Helmet>

            <div className="flex">
              <NavContainer formName='profileUpdate' />
              <div className="content oss-admin">
                <TopBar  userdata={userdata} pageTitle='Simulation Tools Records' subTitle='Answer' />
                <div className="intro-y grid grid-cols-12 gap-12 mt-1">
                   <div className="col-span-12 lg:col-span-12">
                   <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                      <div className="container oss-admin h-auto">
                     
                      <div className="grid grid-cols-12 gap-12 mt-5">
                    
                   
                    <div className="intro-y col-span-12 md:col-span-12">
                        <div className="box">
                            
                            <div className="flex flex-wrap lg:flex-no-wrap items-center justify-center p-5">
                                <div className="w-full  mb-4 lg:mb-0 mr-auto">
								<h2 className="text-lg font-bold mr-auto">Basic Information </h2>
								<hr/>
                                {this.state.userInputDataGet.map((data, index) => {
                                                                        return (
                                                                        <>
                                                                        {(() => {
                             if(data.data.menu_type === 'Housing Association'){
                              return(<>
                                      <div className="grid grid-cols-12 gap-1 mt-5 mb-5">
                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Name</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.name} {data.data.surname}</div>
                                                                            </div>

                                                                          

                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Email</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.email}</div>
                                                                            </div>
                                                                            
                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Phone</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.phone_number}</div>
                                                                            </div>
                                                                            
                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Where are you located?</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.country}</div>
                                                                            </div>
                                                                            
                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>City</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.city}</div>
                                                                            </div>	
                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Post Code</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.post_code}</div>
                                                                            </div>	

                                                                             <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Type of Organization</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.org_type}</div>
                                                                            </div>

                                                                             <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Name of Organization</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.org_name}</div>
                                                                            </div>

                                                                             <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Registration number</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.reg_number}</div>
                                                                            </div>	

                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>VAT number</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.vat_number}</div>
                                                                            </div>	

                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Website</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.website}</div>
                                                                            </div>

                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Address</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.address}</div>
                                                                            </div>																							                                    
                                                                        </div>
                                  
                                       </>
                              );

                             }else{
                              return(<> 
                                           <div className="grid grid-cols-12 gap-1 mt-5 mb-5">
                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Name</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.name} {data.data.surname}</div>
                                                                            </div>                                                                         
                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Email</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.email}</div>
                                                                            </div>
                                                                            
                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Phone</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.phone_number}</div>
                                                                            </div>
                                                                            
                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Where are you located?</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.country}</div>
                                                                            </div>
                                                                            
                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>City</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.city}</div>
                                                                            </div>	
                                                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                <label>Post Code</label>
                                                                                <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>{data.data.post_code}</div>
                                                                            </div>																								                                    
                                                                        </div>
                                                    </>
                                                    );

                             }
                            })()} 
                                                                         
                                                                        <h2 className="text-lg font-bold mr-auto">Question Answer</h2>
								                                          <hr/>	
                                                                            {data.data.data_inputs.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1 : -1).map((c, i) => {
                                                                                
                                                                              return (
                                                                                <>                                                                               
                                                                                        <div className="grid grid-cols-12 gap-1 mt-2 mb-2">                                                                                           
                                                                                                <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                                                                                    <label>Q{i +1}. {c.field_title} </label>
                                                                                                    <div className="text-gray-600 mt-1" style={{fontSize: '13px'}}>Answer.{c.field_value}</div>
                                                                                                </div>
                                                                                                </div>
                                                                                            <hr/>																																																		
                                                                                           
                                                                                    </>
                                                                                    );                                                                            
                                                                                })}                                                               
                                                                        </>
                                                                        );
                                                                    })}                                                        								          																																
                                </div>                              
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
    );
  }
}



export default withRouter(withTranslation('translations')(connect(
  state => ({
    userIsLogged: state.user.isAuthenticated,
    myUserData: state.user.profileInfo,
   
    loadingUser: state.user.isFetching,
   
    alerts: state.alerts.pending,
    userdata: state.user.profileInfo.data,
    ossAdmin: state.user.profileInfo.data.is_oss_admin,
  }),
  
)(RecordsDetails)));
