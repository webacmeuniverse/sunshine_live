import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

import NavContainer from '../smartcomponents/ossnavcontainer';
import MobileNavContainer from '../smartcomponents/ossMobileNavContainer';

import TopBar from '../../components/ossnavigation/TopBar';
import Calculator from '../../components/utils/EnergyCalculator/Calculator';

const styles = {
  root: {
    height: '100%',
  },
  content: {
    padding: 20,
  },
};

function EnergyCalculatorPage(props) {
  const { classes } = props;
  const {  userdata } = props;
  return (
   

    <div className={classes.root}>
       <Helmet title="Energy Savings Calculator | SUNShINE">
    <style>{
    'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
    }</style>
</Helmet>
<MobileNavContainer/>
   <div className="flex">
        <NavContainer formName="calculator" />
        <div className="content oss-admin">
            <TopBar  userdata={userdata} pageTitle='translations:ossMenu.SimulationTools' subTitle="translations:ossMenu.BuildingCalculator"/>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                   <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                      <div className="container oss-admin h-auto">

                      <Calculator />
         
          </div>
                       </section>

                     </div>
                   </div>

               
          </div>
          
        </div>
    
      
    </div>
  );
}
export default connect(state => ({
  alerts: state.alerts.pending,
  userdata: state.user.profileInfo.data,
}))(withStyles(styles)(EnergyCalculatorPage));

