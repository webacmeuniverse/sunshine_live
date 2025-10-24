import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import NavContainer from '../../smartcomponents/ossnavcontainer';
import MobileNavContainer from '../../smartcomponents/ossMobileNavContainer';
import TopBar from '../../../components/ossnavigation/TopBar';
//import NavContainer from '../../smartcomponents/navcontainer';

import SnackbarNotification from './../../smartcomponents/SnackbarNotification';
import OrganizationMeetingViewWrapper from '../../../components/organization/OrganizationMeetings/OrganizationMeetingViewWrapper/OrganizationMeetingViewWrapper';

class OrganizationMeetingPage extends Component { 
    render(){
        const { alerts } = this.props;
        
        return(
            
            <div style={{ height: '100%' }}>

<Helmet title='Energy Service Companies | SUNShINE' >
        <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style> </Helmet>
     <MobileNavContainer/>
     <div className="flex">
              <NavContainer formName='profileUpdate'  />
              <div className="content oss-admin">
                <TopBar  pageTitle='translations:meetings.meetings' subTitle=''/>
                <div className="grid grid-cols-12 gap-6">
                   <div className="col-span-12">
                   <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                      <div className="container oss-admin h-auto">

                      <div>   
                    {alerts && alerts.map((alert, index) => (
                        <SnackbarNotification open alert={alert} key={index}/>
                    ))}
                    <OrganizationMeetingViewWrapper />
                </div>

       
                         </div>
                       </section>

                     </div>
                   </div>

               
            </div>
      </div>


              
              
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        alerts: state.alerts.pending,
    };
};

export default connect(mapStateToProps, '')(OrganizationMeetingPage);