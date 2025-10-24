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
//import NavContainer from '../../smartcomponents/navcontainer';
import SnackbarNotification from './../../smartcomponents/SnackbarNotification';

import { countriesMap } from '../../../constants/countries';

// ACTIONS
import {
  getAllUsers as getAllUsersAction,
  searchUsers as searchUsersAction,
  isFetchingUsersSetDefault
} from './../../../actions/users';
import {
  getAllOrganizations as getAllOrganizationsAction,
  searchOrganizations as searchOrganizationsAction,
  isFetchingListOrganizationSetDefault
} from './../../../actions/organizations';
import {
  getAllAssets as getAllAssetsAction,
  searchAssets as searchAssetsAction,
  isFetchingListAssetSetDefault
} from './../../../actions/assets';
import {
  getAllProjects as getAllProjectsAction,
  searchProjects as searchProjectsAction,
  isFetchingListProjectSetDefault
} from './../../../actions/projects';
//import './flexboxgrid.css'; 
import styles from './styles';

class AdminPage extends React.Component {
  componentDidMount() {
    const {
      getAllUsers,
      getAllOrganizations,
      getAllAssets,
      getAllProjects,
      clearIsFetchingUsers,
      clearIsFetchingListOrgs,
      clearIsFetchingListAssets,
      clearIsFetchingListProj
    } = this.props;

    getAllUsers(0, null);
    getAllOrganizations(0, null);
    getAllAssets(0, null);
    getAllProjects(0, null);
    clearIsFetchingUsers();
    clearIsFetchingListOrgs();
    clearIsFetchingListAssets();
    clearIsFetchingListProj();
  }

  render() {
    const { allUsers, allOrganizations, allAssets, allProjects,
      searchAssets, searchProjects, allUsersReady,
      searchUsers, searchOrganizations, alerts, slideIndex, allAssetsReady,
      allOrganizationsReady, allProjectsReady, isUsersFetching,
      isAssetFetching, isOrganizationFetching, isProjectFetching,
    } = this.props;

   return (
      <div style={{ height: '100%' }}>
         <Helmet  >
        <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style> </Helmet>
          <MobileNavContainer/>
       <div className="flex">
              <NavContainer formName='profileUpdate' />
              <div className="content oss-admin">
                <TopBar  pageTitle='translations:ossMenu.Admin' />
                <div className="grid grid-cols-12 gap-6">
                   <div className="col-span-12">
                   <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                      <div className="container oss-admin h-auto">
                            {alerts && alerts.map((msg, index) => (
                              <SnackbarNotification open alert={msg} key={index} />
                            ))}
                            {
                              <AdminTabs
                                allUsers={allUsers}
                                allOrganizations={allOrganizations}
                                allAssets={allAssets}
                                allProjects={allProjects}
                                searchUsers={searchUsers}
                                searchAssets={searchAssets}
                                searchOrganizations={searchOrganizations}
                                searchProjects={searchProjects}
                                slideIndex={slideIndex}
                                allUsersReady={allUsersReady}
                                allOrganizationsReady={allOrganizationsReady}
                                allAssetsReady={allAssetsReady}
                                allProjectsReady={allProjectsReady}
                                isUsersFetching={isUsersFetching}
                                isOrganizationFetching={isOrganizationFetching}
                                isAssetFetching={isAssetFetching}
                                isProjectFetching={isProjectFetching}
                              />
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

// TODO: Fill propTypes with content
AdminPage.propTypes = {};

const mapStateToProps = (state) => {
  return {
    allUsers: state.users.users,
    allAssets: state.asset.allAssets,
    allOrganizations: state.organization.allOrganizations,
    allProjects: state.project.allProjects,
    allUsersReady: state.users.allUsersReady,
    allOrganizationsReady: state.organization.allOrganizationsReady,
    allAssetsReady: state.asset.allAssetsReady,
    allProjectsReady: state.project.allProjectsReady,
    isUsersFetching: state.users.isUsersFetching,
    isAssetFetching: state.asset.isFetchingList,
    isOrganizationFetching: state.organization.isFetchingList,
    isProjectFetching: state.project.isFetchingList,
    userIsSuperUser: state.user.isSuperUser,
    userFilterValue: state.users.userFilterValue,
    legalFormFilterValue: state.organization.legalFormFilterValue,
    filteredUsers: state.users.users,
    typeFilter: state.asset.typeFilter,
    projectTypeFilter: state.project.typeFilter,
    alerts: state.alerts.pending,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllUsers: (offset, limit) => {
      dispatch(getAllUsersAction({ offset, limit }));
    },
    getAllOrganizations: (offset, limit) => {
      dispatch(getAllOrganizationsAction({ offset, limit }));
    },
    getAllAssets: (offset, limit) => {
      dispatch(getAllAssetsAction({ offset, limit }));
    },
    getAllProjects: (offset, limit) => {
      dispatch(getAllProjectsAction({ offset, limit }));
    },
    searchUsers: (search, filter) => {
      // TODO (@edimov): This weird logic is here afer
      // dropping user status support and the filter uses
      // country values to filter from, rather than sttus.
      // Refactor to a more clean approach.
      const filterParams = {};
      if (filter) {
        filterParams.country = encodeURIComponent(countriesMap[filter]);
      }
      dispatch(searchUsersAction(search, filterParams, 0));
    },
    searchOrganizations: (search, filter) => {
      dispatch(searchOrganizationsAction(search, filter, 0, 1000));
    },
    searchAssets: (search, filter) => {
      dispatch(searchAssetsAction(search, filter, 0, 1000));
    },
    searchProjects: (search, filter) => {
      dispatch(searchProjectsAction(search, filter, 0, 1000));
    },
    clearIsFetchingUsers: () => {
      dispatch(isFetchingUsersSetDefault());
    },
    clearIsFetchingListOrgs: () => {
      dispatch(isFetchingListOrganizationSetDefault());
    },
    clearIsFetchingListAssets: () => {
      dispatch(isFetchingListAssetSetDefault());
    },
    clearIsFetchingListProj: () => {
      dispatch(isFetchingListProjectSetDefault());
    },
  };
};

export default withRouter(withTranslation('translations')(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminPage))));
