import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { getSubscribeReports as getSubscribeReportsAction } from '../../actions/users';
import { getUsersReports as getUsersReportsAction } from '../../actions/users';
import DataTable from '../utils/DataTable';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const fields = [
  { key: 'email', titleKey: 'auth.email' },
  { key: 'name', titleKey: 'projects.name' },
  { key: 'telephone', titleKey: 'organizations.phone' },
  { key: 'valid', titleKey: 'organizations.status' },
  { key: 'country', titleKey: 'auth.country' },
  { key: 'platformRoles', titleKey: 'navigation.platformRoles' },
  { key: 'organizationRoles', titleKey: 'organizations.organizationRoles' },
  { key: 'projectRoles', titleKey: 'projects.projectRoles' },
];
const fieldsEnabled = [
  'email', 'name', 'telephone', 'valid', 'country', 'platformRoles', 'organizationRoles', 'projectRoles',
];

function UsersReport(props) {
  const {
    users,
    getUsers,
    getSubscribe,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation('translations');

  useEffect(() => {
    getUsers();
    getSubscribe();
  }, [getSubscribe,getUsers]);

  if (users.isUsersFetching) {
    return (
      <div className={classes.contentWrapper}>
        <CircularProgress />
      </div>
    );
  }

  if (users.usersReports !== '' ) {
  
    const usersData = users?.usersReports?.documents.map(u => ({
      ...u.data,
      platformRoles: (u.data?.country_roles || []).map((r, i) => (
        <React.Fragment key={i}><strong>{t(`platformRoles.${r.role}`)}</strong> {r.country}</React.Fragment>
      )),
      organizationRoles: (u.data?.organization_roles || []).map((r, i) => (
        <React.Fragment key={i}><strong>{r.position?.toUpperCase()}</strong> {r.organization?.name}</React.Fragment>
      )),
      projectRoles: (u.data?.project_roles || []).map((r, i) => (
        <React.Fragment key={i}><strong>{r.position?.toUpperCase()}</strong> {r.project?.name}</React.Fragment>
      )),
    }));
    //your code here
    return (
      <DataTable
        data={usersData}
        fields={fields}
        fieldsEnabled={fieldsEnabled}
        csvFilename="users-report"
      />
    );
  }else{
  
    const usersData =[];
    return (
      <DataTable
        data={usersData}
        fields={fields}
        fieldsEnabled={fieldsEnabled}
        csvFilename="users-report"
      />
    );
  }
  

 
}

export default connect(
  state => ({
    users: state.users,
  }),
  dispatch => ({
    getSubscribe: () => dispatch(getSubscribeReportsAction()),
    getUsers: () => dispatch(getUsersReportsAction()),
  }),
)(UsersReport);
