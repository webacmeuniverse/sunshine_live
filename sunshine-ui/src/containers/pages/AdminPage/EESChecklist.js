import React from 'react';

// WRAPPERS
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
// COMPONENTS
import AdminTabs from './../../../components/admin/AdminTabs/AdminTabs';
import NavContainer from '../../smartcomponents/ossnavcontainer';
import MobileNavContainer from '../../smartcomponents/ossMobileNavContainer';
import TopBar from '../../../components/ossnavigation/TopBar';

import EESChecklistPreview from '../../../containers/pages/AdminPage/EESChecklistPreview/EESChecklist';


class EESChecklist extends React.Component {
  componentDidMount() {
    
  }

  render() {
    const {userdata
    } = this.props;

   return (
      <div style={{ height: '100%' }}>
         <Helmet  >
          <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
             }</style> 
          </Helmet>
          <MobileNavContainer/>
           <div className="flex">
              <NavContainer formName='profileUpdate' />
              <div className="content oss-admin">
              {userdata.superuser == false ?<TopBar pageTitleAction="/oss/ees-checklist" subTitleAction=""  pageTitle='translations:ossMenu.EESChecklist' subTitle='translations:ossMenu.Preview'/> :
                                            <TopBar pageTitleAction="/oss/ees-checklist" subTitleAction="" pageTitle='translations:ossMenu.EESChecklist' subTitle='translations:ossMenu.Preview'/>
                                    }


               
                <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                        <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                          <div className="container oss-admin h-auto">
                                <EESChecklistPreview/>       
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

// TODO: Fill propTypes with content
EESChecklist.propTypes = {};

const mapStateToProps = (state) => { 
  return { 
 
 userdata: state.user.profileInfo.data
}

};

export default withRouter(withTranslation('translations')(connect(
  mapStateToProps,
  
)((EESChecklist))));
