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
import { projectPhases } from '../../../constants/statusTypes';
import { countriesMap } from '../../../constants/countries';
import {
  getAllProjects as getAllProjectsAction,
  getMyProjects as getMyProjectsAction,
} from '../../../actions/projects';
import { parseQuery } from '../../../utils/url';
import useFetching from '../../../utils/useFetching';
import SnackbarNotification from '../../smartcomponents/SnackbarNotification';
import NavContainer from '../../smartcomponents/ossnavcontainer';
import MobileNavContainer from '../../smartcomponents/ossMobileNavContainer';
import TopBar from '../../../components/ossnavigation/TopBar';
//import NavContainer from './../../smartcomponents/navcontainer';
import SearchAndFilter from '../../smartcomponents/SearchAndFilter';
import Pagination from '../../../components/utils/Pagination/Pagination';
import MarkdownText from '../../../components/utils/MarkdownText';
import SeparatorMenu from '../../../components/utils/SeparatorMenu';
import Loader from '../../../components/utils/Loader';
import ProjectEditor from '../../../components/project/ProjectEditor/ProjectEditor';
import RegisterProjectCard from '../../../components/project/ProjectCard/RegisterProjectCard';
import ProjectCard from '../../../components/project/ProjectCard/ProjectCard';
import RequestAssetPermission from '../../../components/project/RequestAssetPermission';
import projectSVG from '../../../images/svgIcons/Project.svg';

const useStyles = makeStyles({
  gridRoot: {
    marginLeft: 0,
    marginTop: 30,
  },
});

const tabs = [
  {
    labelKey: 'translations:projects.privateProjects',
    hash: '#private',
    perPage: 10,
    withCreateButton: true,
    typeOfView: 'private',
    getNodes: (state) => {
      if (state.myProjects?.length > 0) {
        return { nodes: state.myProjects, count: parseInt(state.myProjectsNumber, 10) || 0 };
      }
      return { nodes: [], count: 0 };
    },
  },
  {
    labelKey: 'translations:projects.publicProjects',
    hash: '#all',
    perPage: 12,
    getNodes: (state) => {
      if (state.allProjects?.length > 0) {
        return {
          nodes: state.allProjects,
          count: parseInt(state.allProjectsNumber, 10) || 0,
        };
      }
      return {
        nodes: [],
        count: 0,
      };
    },
  },
];

function ProjectsPage(props) {
  const {
    alerts,
    user,
    project,
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
  const { nodes: activeNodes, count } = tabs[activeTabIDX].getNodes(project);
  const perPage = tabs[activeTabIDX].perPage;
  const offset = (page - 1) * perPage;

  const userProjectsFetcher = useCallback((params) => {
    if (!userID) {
      return null;
    }
    return getMyProjectsAction(userID, true, { ...params, offset, limit: perPage });
  }, [userID, offset, perPage]);
  const allProjectsFetcher = useCallback((params) => {
    return getAllProjectsAction({ ...params, offset, limit: perPage });
  }, [offset, perPage]);

  useFetching(userProjectsFetcher);
  useFetching(allProjectsFetcher);

  const fetchFn = useCallback(() => {
    if (activeTabIDX > 0) {
      return allProjectsFetcher;
    }
    return userProjectsFetcher;
  }, [activeTabIDX, userProjectsFetcher, allProjectsFetcher]);

  const onFilterChange = useCallback((params) => {
    if (params?.country) {
      params.country = countriesMap[params.country];
    }
    dispatch(fetchFn(params));
  }, [dispatch, fetchFn]);

  const loading = project.isFetchingList;

  return (
    <React.Fragment>

<Helmet title='Energy Service Companies | SUNShINE' >
        <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style> </Helmet>
     <MobileNavContainer/>
     <div className="flex">
              <NavContainer formName='profileUpdate' />
              <div className="content oss-admin">
                <TopBar  pageTitle={t('translations:ossMenu.Projects')} subTitle={t('translations:ossMenu.ProjectDetails')}/>
                <div className="grid grid-cols-12 gap-6">
                   <div className="col-span-12">
                   <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                      <div className="container oss-admin h-auto">
                      {alerts && alerts.map((msg, index) => (
                             <SnackbarNotification open alert={msg} key={index}/>
                          ))}

<SearchAndFilter
        onChange={onFilterChange}
        filters={[
          { label: t('assets.country'), name: 'country', options: countries },
          { label: t('projects.projectPhase'), name: 'state', options: projectPhases(t) },
        ]}
        tooltip={<MarkdownText text={t('tooltips:projects.info', { returnObjects: true })} />}
        t={t}
        searchPlaceholder={t('utils.searchProjectName')}
      />
      <SeparatorMenu
        items={tabs.map(({ labelKey }) => t(labelKey))}
        active={activeTabIDX}
        onChange={onTabChange}
      />
      <div className={classes.gridRoot}>
        <ProjectsGrid
          loading={loading}
          nodes={activeNodes}
          withCreateButton={tabs[activeTabIDX].withCreateButton}
          typeOfView={tabs[activeTabIDX].typeOfView}
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


     
     
   
    </React.Fragment>
  );
}

function ProjectsGrid(props) {
  const {
    loading,
    nodes,
    withCreateButton,
    typeOfView,
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
    <Grid container item xs={12} spacing={4} style={{     margin: '0px' }}>
      {withCreateButton && (
        <React.Fragment>
          <Grid item lg={3} sm={4} xs={12}>
            <ProjectEditor
              open={editorOpen}
              handleClose={toggleEditorOpen}
              title={t('projects.registerProject')}
            />

            <RegisterProjectCard
              onClick={toggleEditorOpen}
              label='translations:projects.registerProject'
              tooltip='tooltips:projects.registerProject'
              imgSrc={projectSVG}
            />
          </Grid>
          <Grid item lg={3} sm={4} xs={12}>
            <RequestAssetPermission />
          </Grid>
        </React.Fragment>
      )}
      {nodes.map((node) => {
        return (
          <Grid item lg={3} sm={4} xs={12} key={node._id}>
            <ProjectCard data={node} typeOfView={typeOfView} />
          </Grid>
        );
      })}
      {count > perPage && (
        <Grid item xs={12} align="center">
          <Pagination
            activePage={page}
            itemsCountPerPage={perPage}
            totalItemsCount={count}
            onChange={onChangePage}
          />
        </Grid>
      )}
    </Grid>
  );
}

export default connect(
  (state) => ({
    alerts: state.alerts.pending,
    user: state.user,
    project: state.project,
  }),
)(ProjectsPage);
