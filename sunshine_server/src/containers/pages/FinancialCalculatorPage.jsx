import React from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core';

import NavContainer from '../smartcomponents/navcontainer';
import FinancialCalculator from '../../components/utils/FinancialCalculator/FinancialCalculator';

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
  content: {
    padding: 20,
  },
});

function FinancialCalculatorPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Helmet title="Energy Savings Calculator | SUNShINE" />
      <NavContainer formName="calculator"/>
      <div className={classes.content}>
        <FinancialCalculator />
      </div>
    </div>
  );
}

export default FinancialCalculatorPage;
