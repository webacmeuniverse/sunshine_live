import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import NavContainer from '../../../smartcomponents/ossnavcontainer';


import TopBar from '../../../../components/ossnavigation/TopBar';

class ProfileView extends React.Component {

  render() {
    const {  userdata } = this.props;
          return (
            <React.Fragment>
                <Helmet>
                <style>{
                'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
                }</style>
            </Helmet>
               <div className="flex">
                    <NavContainer  />
                    <div className="content oss-admin">
                        <TopBar  userdata={userdata} pageTitle='Profile'/>
                        <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 mt-6">   
                                    <div className="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">     
                                    <h2>OSS Profile</h2>  
                                    </div> 
                                </div>
                            </div>
                      </div>
                    </div>
            </React.Fragment>
          );

  }
}

export default connect(state => ({
  alerts: state.alerts.pending,
  userdata: state.user.profileInfo.data,
}))(ProfileView);
