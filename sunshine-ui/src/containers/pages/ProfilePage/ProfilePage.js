import React from 'react';
import PropTypes from 'prop-types';

// WRAPPERS
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

// COMPONENTS
import { Helmet } from 'react-helmet';
import NavContainer from '../../smartcomponents/ossnavcontainer';
import TopBar from '../../../components/ossnavigation/TopBar';
//import NavContainer from '../../smartcomponents/navcontainer';
import SnackbarNotification from '../../smartcomponents/SnackbarNotification';
import RestorePassword from '../../../components/authentication/RestorePassword/RestorePassword';
import UserProfile from '../../../components/user/UserProfile/UserProfile';
import ProgressBar from '../../../components/utils/ProgressBar';
import MobileNavContainer from '../../smartcomponents/ossMobileNavContainer';
// ACTIONS
import {
  getMyUserData as getMyUserDataAction,
  getPublicUserdata as getPublicUserdataAction,
  updateUserProfile as updateUserProfileAction,
  updateAnotherUserProfile as updateAnotherUserProfileAction,
} from '../../../actions/user';
import { getMyOrganizations as getMyOrganizationsAction } from '../../../actions/organizations';
import { getMyProjects as getMyProjectsAction } from '../../../actions/projects';
import { getMyAssets as getMyAssetsAction } from '../../../actions/assets';

class ProfilePage extends React.Component {
  componentDidMount() {
    const {
      getPublicUserdata,
      getMyUserData,
      match,
      getMyOrganizations,
      getMyProjects,
      getMyAssets,
      userIsLogged,
    } = this.props;

    const userId = match.params.id;

    if (match.path === '/profile') {
      getMyUserData(userIsLogged);
      getMyOrganizations(userIsLogged, true);
      getMyProjects(userIsLogged, true);
      getMyAssets(userIsLogged);
    } else {
      getPublicUserdata(userId);
      getMyOrganizations(userId, false);
      getMyProjects(userId, false);
      getMyAssets(userId);
    }
  }

  render() {
    const {
      alerts,
      match,
      myUserData,
      publicUserData,
      getMyUserData,
      getPublicUserdata,
      loadingUser,
      isFetchingOrganizations,
      updateUser,
      updateAnotherUser,
	  ossAdmin
    } = this.props;

    const loading = loadingUser || isFetchingOrganizations;
    const isPrivate = match.path === '/profile' && true;
    const restorePassView = (match.path === '/profile/:')
      ? <RestorePassword />
      : '';

    return (
      <div style={{ height: '100%' }}>
     
        <Helmet title='User Profile | SUNShINE' >
        <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size:14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style> </Helmet>
<MobileNavContainer/>
            <div className="flex">
              <NavContainer formName='profileUpdate' />
              <div className="content oss-admin">
                <TopBar  pageTitle='Profile' />
                <div className="grid grid-cols-12 gap-6">
             <div className="col-span-12">
                   <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                      <div className="container oss-admin h-auto">
                     
                       
                              {/* <NavContainer formName='profileUpdate' /> */}
                              {alerts && alerts.map((a, index) => (
                                        <SnackbarNotification open alert={a} key={index} />
                                      ))}
                                      {restorePassView
                                        ? restorePassView
                                        : !loading
                                          ?
                                          <UserProfile
                                            userData={isPrivate ? myUserData : publicUserData}
                                            refetch={isPrivate ? getMyUserData : getPublicUserdata}
                                            updateUser={isPrivate ? updateUser : updateAnotherUser}
                                            isPrivate={isPrivate}
                                          />
                                          : <ProgressBar />
                                      }
                                       
                       
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

ProfilePage.propTypes = {
  myOrganizations: PropTypes.arrayOf(PropTypes.object),
  getMyOrganizations: PropTypes.func.isRequired,
};

export default withRouter(withTranslation('translations')(connect(
  state => ({
    userIsLogged: state.user.isAuthenticated,
    myUserData: state.user.profileInfo,
    publicUserData: state.user.publicUserdata,
    loadingUser: state.user.isFetching,
    isFetchingOrganizations: state.organization.isFetchingMine,
    alerts: state.alerts.pending,
    changePassword: state.auth.changePassword,
	ossAdmin: state.user.profileInfo.data.is_oss_admin,
  }),
  dispatch => ({
    getPublicUserdata: (userId) => dispatch(getPublicUserdataAction(userId)),
    getMyUserData: (userId) => dispatch(getMyUserDataAction(userId)),
    getMyOrganizations: (userId, isMine) => dispatch(getMyOrganizationsAction(userId, isMine)),
    getMyProjects: (userId, isMine) => dispatch(getMyProjectsAction(userId, isMine)),
    getMyAssets: (userID) => dispatch(getMyAssetsAction(userID, { limit: 12 })),
    updateUser: (data) => dispatch(updateUserProfileAction(data)),
    updateAnotherUser: (data) => dispatch(updateAnotherUserProfileAction(data)),
  })
)(ProfilePage)));
