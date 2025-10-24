import React, { useCallback, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
  Grid,
  makeStyles,
} from '@material-ui/core';

import { countries } from '../../../constants/countries';
import { legalForms } from '../../../constants/legalStatusTypes';
import { countriesMap } from '../../../constants/countries';
import {
  getAllOrganizations as getAllOrganizationsAction,
  getMyOrganizations as getMyOrganizationsAction,
  getAllOSSList as getAllOSSListAction,
} from '../../../actions/organizations';
import { parseQuery } from '../../../utils/url';
import useFetching from '../../../utils/useFetching';
import NavContainer from '../../smartcomponents/ossnavcontainer';
import MobileNavContainer from '../../smartcomponents/ossMobileNavContainer';
import TopBar from '../../../components/ossnavigation/TopBar';
//import NavContainer from '../../smartcomponents/navcontainer';
import SnackbarNotification from '../../smartcomponents/SnackbarNotification';
import SearchAndFilter from '../../smartcomponents/SearchAndFilter';
import MarkdownText from '../../../components/utils/MarkdownText';
import SeparatorMenu from '../../../components/utils/SeparatorMenu';
import UserTooltip from '../../../components/utils/UserTooltip';
import Pagination from '../../../components/utils/Pagination/Pagination';
import OrganizationEditor from '../../../components/organization/OrganizationEditor/OrganizationEditor';


import OSSListCard from '../../../components/admin/Onboarding/OSSListCard';

import Loader from '../../../components/utils/Loader';
import DefaultCard from '../../../components/admin/Onboarding/DefaultCard';

const useStyles = makeStyles({
  gridRoot: {
    marginLeft: 0,
    marginTop: 30,
  },
});

const tabs = [
  {
    labelKey: 'translations:ossMenu.DefaultTemplate',
    hash: '#private',
    perPage: 11,
    withCreateButton: true,
    getNodes: (state) => {
      if (state.myOrganizations?.length > 0) {
        return { nodes: [], count: 0 };
      }
      return { nodes: [], count: 0 };
    },
  },
  {
    labelKey: 'translations:ossMenu.OSSList',
    hash: '#all',
    perPage: 12,
    getNodes: (state) => {
      if (state.allOSSList?.length > 0) {
        return { nodes: state.allOSSList, count: parseInt(state.allOSSListNumber, 10) || 0 };
      }
      return { nodes: [], count: 0 };
    },
  },
];



function OnboardingPage(props) {
  const {
    alerts,
    user,
    organization,
  } = props;
  const userID = user.profileInfo?._id;

  const classes = useStyles();
  const { t } = useTranslation('translations');
  const dispatch = useDispatch();
  const { hash } = useLocation();

  const [state, setState] = useState({
    page: parseQuery(window.location.search).page || 1,
    activeTabIDX: hash === '#all' ? 1 : 0,
  });
  const { page, activeTabIDX } = state;

  const onTabChange = useCallback((idx) => {
    window.location.hash = tabs[idx].hash;
    setState({ activeTabIDX: idx, page: 1 });
  }, [setState]);
  const onPageChange = useCallback((p) => {
    setState({ activeTabIDX, page: p });
  }, [setState, activeTabIDX]);
  const { nodes: activeNodes, count } = tabs[activeTabIDX].getNodes(organization);
  const perPage = tabs[activeTabIDX].perPage;
  const offset = (page - 1) * perPage;

  const userOrganizationsFetcher = useCallback((params) => {
    if (!userID) {
      return null;
    }
    return getMyOrganizationsAction(userID, true, { ...params, offset, limit: perPage });
  }, [userID, offset, perPage]);


  const allOrganizationsFetcher = useCallback((params) => {
    return getAllOSSListAction({ ...params, offset, limit: perPage });
  }, [offset, perPage]);

  useFetching(allOrganizationsFetcher);
  useFetching(userOrganizationsFetcher);

  const fetchFn = useCallback(() => {
    if (activeTabIDX > 0) {
      return allOrganizationsFetcher;
    }
    return userOrganizationsFetcher;
  }, [activeTabIDX, userOrganizationsFetcher, allOrganizationsFetcher]);

  const onFilterChange = useCallback((params) => {
    if (params?.country) {
      params.country = encodeURIComponent(countriesMap[params.country]);
    }
    dispatch(fetchFn(params));
  }, [dispatch, fetchFn]);

  const loading = organization.isFetchingList || organization.isFetchingMine;

  return (
    <React.Fragment>
 <div style={{ height: '100%' }}>
 {alerts && alerts.map((msg, index) => (
        <SnackbarNotification open alert={msg} key={index}/>
      ))}
         <Helmet title='Energy Service Companies | SUNShINE' >
        <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style> </Helmet>
     <MobileNavContainer/>
     <div className="flex">
              <NavContainer formName='profileUpdate' />
              <div className="content oss-admin">
                <TopBar  pageTitle={t('translations:ossMenu.Onboarding')} />
                <div className="grid grid-cols-12 gap-6">
                   <div className="col-span-12">
                   <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                      <div className="container oss-admin h-auto">

     

                      {/* <SearchAndFilter
        onChange={onFilterChange}
        filters={[
          { label: t('assets.country'), name: 'country', options: countries },
          { label: t('organizations.legalForm'), name: 'legal_form', options: legalForms(t, true) },
        ]}
        tooltip={<MarkdownText text={t('tooltips:organizations.info', { returnObjects: true })} />}
        searchInfoTooltip={
          <MarkdownText
            text={t('tooltips:organizations.publicSearchHint', { returnObjects: true })} gutterBottom={false}
          />
        }
        searchPlaceholder={t('utils.searchOrganizationName')}
      /> */}
      <SeparatorMenu
        items={tabs.map(({ labelKey }) => t(labelKey))}
        active={activeTabIDX}
        onChange={onTabChange}
      />
      <div className={classes.gridRoot}>
        <OrganizationsGrid
          loading={loading}
          nodes={activeNodes}
          withCreateButton={tabs[activeTabIDX].withCreateButton && userID}
          page={page}
          perPage={tabs[activeTabIDX].perPage}
          count={count}
          onChangePage={onPageChange}
        />
      </div>
       
       
           </div>
                       </section>

                     </div>
                   </div>

                </div>
            </div>
      </div>




     
    </React.Fragment>
  );
}

function OrganizationsGrid(props) {
  const {
    loading,
    nodes,
    withCreateButton,
    page,
    perPage,
    count,
    onChangePage,
  } = props;

  const { t } = useTranslation('translations');
  const [editorOpen, setEditorOpen] = useState(false);
  const toggleEditorOpen = useCallback(() => {
    setEditorOpen(!editorOpen);
  }, [editorOpen, setEditorOpen]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container item xs={12} spacing={4} style={{ margin: '0px' }}>
      {withCreateButton && (
        <DefaultCard></DefaultCard>
      )}
      {nodes.map((node) => {
        return (
          <Grid item xl={3} lg={4} sm={6} xs={12} key={node._id} >
            <OSSListCard data={node} />
          </Grid>
        );
      })}
    
    </Grid>
  );
}

export default connect(
  (state) => ({
    alerts: state.alerts.pending,
    user: state.user,
    organization: state.organization,
  }),
)(OnboardingPage);
