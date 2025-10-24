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
import Moment from 'moment';
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
  // { key: 'public_ip', titleKey: 'dpfText.public_ip' },
  { key: 'CreatedAt', titleKey: 'meetings.date' },

];
const fieldsEnabled = [
  'email',  'CreatedAt'
];

function SubscribeReport(props) {
  const {
    users,
    getSubscribe,
    getUsers,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation('translations');

  useEffect(() => {
    getSubscribe();
    getUsers();
  }, [getSubscribe,getUsers]);

  if (users.isUsersFetching) {
    return (
      <div className={classes.contentWrapper}>
        <CircularProgress />
      </div>
    );
  }
 
 if (users.subscribeReports !=='' ) {
  const usersData = users?.subscribeReports?.documents.map(u => ({
    ...u.data,
    email: u.data?.email,
    CreatedAt: Moment(u.data?.CreatedAt).format('YYYY-MM-DD') ,
    
  }));
  return (
    <DataTable
    data={usersData}
      fields={fields}
      fieldsEnabled={fieldsEnabled}
      csvFilename="subscribe-report"
    />
  );
  //your code here
}else{

  const usersData =[];
  return (
    <DataTable
    data={usersData}
      fields={fields}
      fieldsEnabled={fieldsEnabled}
      csvFilename="subscribe-report"
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
)(SubscribeReport);
