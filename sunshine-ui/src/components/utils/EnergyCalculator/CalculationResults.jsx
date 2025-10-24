import React, { forwardRef } from 'react';
import {
  Grid,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import logoIMG from '../../../images/Sunshine-Logo-Platform.png';
import {
  MonthlyConsumptionChart,
  EnergyComparisonChart,
  MonthlyPaymentsChart,
  GenericPieChart,
} from './Charts';
import { getCalculatedData,coefficients } from './utils';
import _ from "lodash";

const useStyles = makeStyles(theme => ({
  root: {
    '@media print': {
      '& .MuiGrid-container': {
        display: 'block',

        '& .MuiGrid-grid-sm-6': {
          maxWidth: '100%',
        },
      },
      '& .recharts-responsive-container': {
        width: '100%',

        '& .recharts-wrapper': {
          margin: '0 auto',
        },
      },
    },
  },
  widgetWrapper: {
    '@media print': {
      marginLeft: '1cm',
      marginRight: '1cm',
    },
  },
  widget: {
    padding: theme.spacing(2),
  },
  title: {
    paddingBottom: theme.spacing(2),
  },
  logoWrapper: {
    justifyContent: 'center',
    display: 'none',

    '@media print': {
      display: 'flex',
      pageBreakBefore: 'always',
      paddingTop: '1cm !important',
    },
  },
  logo: {
    maxWidth: theme.spacing(12),
  },
}));

const CalculationResults = forwardRef((props, ref) => {
  const { data } = props;

  const classes = useStyles();
  const { t } = useTranslation('translations');
  let new_coeficients = {}
  Object.keys(coefficients).forEach(item => {
    new_coeficients[t(item)] = coefficients[item];
  });
  let dataTranslated = _.cloneDeep(data);
  Object.keys(dataTranslated).forEach(item => {
    if (item === "buildingData") {
        Object.keys(dataTranslated[item]).forEach(indx => {
          dataTranslated[item][indx] = t(data[item][indx]);
        });
    }
  });
  const calculatedData = getCalculatedData(dataTranslated,new_coeficients);

  return (
    <div ref={ref} className={classes.root}>
      <Grid
        container
        direction="row"
        spacing={4}
      >
        <Grid item xs={12} className={classes.logoWrapper}>
          <img src={logoIMG} alt="Sunshine" className={classes.logo} />
        </Grid>
        <Widget title={t('calculationResults.baseYearEnergyConsumptionPerMonth')}>
          <MonthlyConsumptionChart
            data={calculatedData.monthlyConsumption}
            noDataComponent={
              <Typography variant="overline">
                {t('energyCalculator.titles.pleaseFill')} <strong>{t('energyCalculator.titles.energyData')}</strong> {t('energyCalculator.titles.fields')}
              </Typography>
            }
          />
        </Widget>
        <Widget title={t('calculationResults.baseYearEnergyConsumption')}>
          <GenericPieChart
            data={calculatedData.yearlyConsumption}
            valueType="MWh"
            labelTotal={t('calculationResults.inTotal')}
            noDataComponent={
              <Typography variant="overline">
                {t('energyCalculator.titles.pleaseFill')} <strong>{t('energyCalculator.titles.energyData')}</strong> {t('energyCalculator.titles.fields')}
              </Typography>
            }
          />
        </Widget>
        <Grid item xs={12} className={classes.logoWrapper}>
          <img src={logoIMG} alt="Sunshine" className={classes.logo} />
        </Grid>
        <Widget title={t('calculationResults.energyAnalysis')}>
          <EnergyComparisonChart
            noDataComponent={
              <Typography variant="overline">
                {t('energyCalculator.titles.pleaseFill')} <strong>{t('financialCalculator.titles.buildingData')}</strong> {t('energyCalculator.titles.and')} <strong>{t('energyCalculator.titles.energyData')}</strong> {t('energyCalculator.titles.fields')}.
              </Typography>
            }
            {...calculatedData.energyAnalysis}
          />
        </Widget>
        <Widget title={t('calculationResults.avrMonthlyPayments')}>
          <MonthlyPaymentsChart
            noDataComponent={
              <Typography variant="overline">
                {t('energyCalculator.titles.pleaseFill')} <strong>{t('financialCalculator.titles.buildingData')}</strong>,&nbsp;
                <strong>{t('energyCalculator.titles.energyData')}</strong>, <strong>{t('energyCalculator.titles.economicData')}</strong> {t('energyCalculator.titles.and')} <strong>{t('energyCalculator.titles.feesData')}</strong> {t('energyCalculator.titles.fields')}.
              </Typography>
            }
            {...calculatedData.monthlyPayments}
          />
        </Widget>
        <Grid item xs={12} className={classes.logoWrapper}>
          <img src={logoIMG} alt="Sunshine" className={classes.logo} />
        </Grid>
        <Widget title={t('calculationResults.financing')}>
          <GenericPieChart
            data={calculatedData.totalInvestments}
            valueType="EUR"
            labelTotal={t('calculationResults.totalInvestment')}
            noDataComponent={
              <Typography variant="overline">
                {t('energyCalculator.titles.pleaseFill')} <strong>{t('financialCalculator.titles.buildingData')}</strong>,&nbsp;
                <strong>{t('energyCalculator.titles.energyData')}</strong>, <strong>{t('energyCalculator.titles.economicData')}</strong> {t('energyCalculator.titles.and')} <strong>{t('energyCalculator.titles.feesData')}</strong> {t('energyCalculator.titles.fields')}.
              </Typography>
            }
          />
        </Widget>
        <Widget title={t('calculationResults.feesForEnergyEfficiencyInvestments')}>
          <GenericPieChart
            data={calculatedData.fees}
            valueType="EUR"
            labelTotal={t('calculationResults.totalAnnualFee')}
            noDataComponent={
              <Typography variant="overline">
                {t('energyCalculator.titles.pleaseFill')} <strong>{t('financialCalculator.titles.buildingData')}</strong>,&nbsp;
                <strong>{t('energyCalculator.titles.energyData')}</strong>, <strong>{t('energyCalculator.titles.economicData')}</strong> {t('energyCalculator.titles.and')} <strong>{t('energyCalculator.titles.feesData')}</strong> {t('energyCalculator.titles.fields')}.
              </Typography>
            }
          />
        </Widget>
        <Grid item xs={12} className={classes.logoWrapper}>
          <img src={logoIMG} alt="Sunshine" className={classes.logo} />
        </Grid>
        <Widget title={t('calculationResults.summary')} sm={12}>
          <Grid
            container
            justify="space-between"
            alignItems="flex-end"
          >
            <Grid item xs={12}>
              <Typography variant="h6">
                {t('calculationResults.annualEnergySavings')} <strong>{calculatedData.results.aesMwH.toFixed(2)}&nbsp;
                MWh or {calculatedData.results.aesPercent}%</strong>
              </Typography>
              <Typography variant="h6">
                {t('calculationResults.annualReduction')} <strong>{calculatedData.results.tCO2Reduction.toFixed()} {t('calculationResults.tones')}</strong>
              </Typography>
              <Typography variant="h6">
                {t('calculationResults.annualMoneySaving')} <strong>{calculatedData.results.ams.toFixed(2)} €</strong>
              </Typography>
              <Typography variant="h6">
                {t('calculationResults.paybackPeriod')} <strong>{calculatedData.results.paybackPeriod.toFixed(1)} {t('calculationResults.years')}</strong>
              </Typography>
              <Typography variant="h6">
                {t('calculationResults.totalInvestmentCost')} <strong>{calculatedData.results.totalInvestment.toFixed(2)} €</strong>
              </Typography>
              <Typography variant="h6">
                {t('calculationResults.investmentCost')} <strong>{calculatedData.results.investment.toFixed(2)} €</strong>
              </Typography>
            </Grid>
          </Grid>
        </Widget>
      </Grid>
    </div>
  );
});

function Widget(props) {
  const {
    title,
    children,
    ...gridProps
  } = props;

  const classes = useStyles();

  return (
    <Grid item {...gridProps} className={classes.widgetWrapper}>
      <Paper
        variant="outlined"
        elevation={1}
        className={classes.widget}
      >
        <Typography
          className={classes.title}
          variant="h5"
        >
          {title}
        </Typography>
        {children}
      </Paper>
    </Grid>
  );
}

Widget.defaultProps = {
  xs: 12,
  sm: 6,
};

export default CalculationResults;
