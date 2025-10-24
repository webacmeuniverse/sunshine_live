import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import NavContainer from '../smartcomponents/navcontainer';
import SnackbarNotification from '../smartcomponents/SnackbarNotification';
import Benchmarking from '../../components/Benchmarking/Benchmarking';

function BenchmarkingPage(props) {
  const {
    alerts,
  } = props;

  return (
    <React.Fragment>
      <Helmet title="Benchmarking | SUNShINE" />
      <NavContainer />
      {alerts && alerts.map((a, index) => (
        <SnackbarNotification open alert={a} key={index} />
      ))}
      <Benchmarking />
    </React.Fragment>
  );
}

export default connect(state => ({
  alerts: state.alerts.pending,
}))(BenchmarkingPage);
