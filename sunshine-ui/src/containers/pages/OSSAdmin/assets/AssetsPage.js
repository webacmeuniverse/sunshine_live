import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import NavContainer from '../../../smartcomponents/ossnavcontainer';


import TopBar from '../../../../components/ossnavigation/TopBar';

class AssetsView extends React.Component {

  render() {
    const {  userdata } = this.props;
          return (
            <React.Fragment>
               <div className="flex">
                    <NavContainer  />
                    <div className="content">
                        <TopBar  userdata={userdata} pageTitle='Assets'/>
                        <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 mt-6">   
                                    <div className="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">     
                                    <h2>OSS Assets</h2>  
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
}))(AssetsView);
