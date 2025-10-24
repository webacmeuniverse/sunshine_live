import React, { useState, useReducer, useRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import {
  Grid,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  makeStyles
 } from '@material-ui/core';
import {
  Print as PrintIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Replay as ReplayIcon,
  WrapText as FillDemoDataIcon,
} from '@material-ui/icons';

import Tooltip from '../TooltipWrapper';
import { validateData, demoData } from './utils';
import reducer, { initialState } from './reducer';
import {
  EnergyDataForm,
  DataForm,
} from './Forms';
import CalculatorResults from './CalculationResults';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  },
  title: {
    paddingBottom: theme.spacing(6),
    '& .logo': {
      maxWidth: theme.spacing(12),
    },
  },
  resetButton: {
    marginRight: theme.spacing(1),
  },
  buttonsGrid: {
    '& > *': {
      marginRight: theme.spacing(1),

      '&:last-child': {
        marginRight: 0,
      }
    },
  },
}));

const pagePrintStyle = `
  @page {
    size:  A4 portrait;
    margin: 0;
  }
  @media all {
    .pagebreak {
      display: none;
    }
  }
  @media print {
    .hide-non-print: {
      display: block !important;
    }
  }
`;

const steps = [
  {
    label: 'energyCalculator.labels.buildingData',
    title: 'energyCalculator.titles.buildingData',
    key: 'buildingData',
    requiredFields: ['project', 'heatedArea'],
    formComponent: DataForm,
  },
  {
    label: 'energyCalculator.labels.energyData',
    title: 'energyCalculator.titles.energyData',
    key: 'energyData',
    formComponent: EnergyDataForm,
  },
  {
    label: 'energyCalculator.labels.economicData',
    title: 'energyCalculator.titles.economicData',
    key: 'economicData',
    formComponent: DataForm,
  },
  {
    label: 'energyCalculator.labels.maintenanceData',
    title: 'energyCalculator.titles.maintenanceData',
    key: 'maintenanceData',
    formComponent: DataForm,
  },
  {
    label: 'energyCalculator.labels.investmentData',
    title: 'energyCalculator.titles.investmentData',
    key: 'investmentData',
    requiredFields: ['administrationFee', 'maintenanceFee', 'insuranceFee'],
    formComponent: DataForm,
  },
  {
    label: 'energyCalculator.labels.result',
    title: 'energyCalculator.titles.result',
    key: 'result',
    component: CalculatorResults,
  },
];

function Calculator() {
  const [data, dispatch] = useReducer(reducer, initialState);
  const [activeStep, setActiveStep] = useState(0);
  const classes = useStyles();
  const { t } = useTranslation('translations');

  const FormComponent = steps[activeStep].formComponent;
  const Component = steps[activeStep].component;

  const activeComponentRef = useRef();


  return (
    <Paper className={classes.root} elevation={1}>
      <Grid container spacing={4}>
        <Grid item xs={12} className="btn-print-wrapper">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(({ label, key }) => (
              <Step key={key}>
                <StepLabel>{t(label)}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>

        <Grid item xs={12}>
          <Grid container justify="center" alignItems="center" className={classes.title}>
            <Typography className={classes.title} variant="h5" align="center">
              {t(steps[activeStep].title)}
            </Typography>
          </Grid>

          {FormComponent && (
            <FormComponent
              data={data[steps[activeStep].key]}
              errors={data.validationErrors}
              setData={(d) => dispatch({ type: `set#${steps[activeStep].key}`, data: d })}
            />
          )}
          {Component && (
            <Component
              data={data}
              ref={activeComponentRef}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <NavigationButtons
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            onNavigateNextStep={() => {
              const errors = validateData(data[steps[activeStep].key], steps[activeStep].requiredFields || []);
              if (Object.values(errors).length === 0) {
                setActiveStep(activeStep + 1);
              } else {
                Object.keys(errors).forEach(item => {
                  errors[item] = t(errors[item]);
                });
                dispatch({ type: 'setValidationErrors', errors });
              }
            }}
            onReset={() => {
              dispatch({ type: 'resetData' });
              setActiveStep(0);
            }}
            fillSampleData={() => dispatch({
              type: `set#${steps[activeStep].key}`,
              data: demoData[steps[activeStep].key]
            })}
            ref={activeComponentRef}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

const NavigationButtons = forwardRef((props, ref) => {
  const {
    activeStep,
    setActiveStep,
    onNavigateNextStep,
    onReset,
    fillSampleData,
  } = props;

  const classes = useStyles();
  const { t } = useTranslation('translations');

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    pageStyle: pagePrintStyle,
  });

  if (activeStep === steps.length - 1) {
    return (
      <Grid container direction="row" className="btn-print-wrapper">
        <Grid item xs={4}>
          <Tooltip title="Clicking `Reset` will clear all data!">
            <Button
              variant="contained"
              color="primary"
              startIcon={<ReplayIcon />}
              className={classes.resetButton}
              onClick={onReset}
            >
             {t('navigation.reset')}
            </Button>
          </Tooltip>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<NavigateBeforeIcon />}
            onClick={() => setActiveStep(activeStep - 1)}
          >
            {t('navigation.back')}
          </Button>
        </Grid>
        <Grid item xs={4} align="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<PrintIcon color="inherit" />}
            onClick={handlePrint}
            fullWidth
          >
            {t('navigation.print')}
          </Button>
        </Grid>
        <Grid item xs={3} />
      </Grid>
    );
  }

  return (
    <Grid container justify="space-between">
      <Grid item>
        {activeStep < steps.length && activeStep > 0 && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<NavigateBeforeIcon />}
            onClick={() => setActiveStep(activeStep - 1)}
          >
            {t('navigation.backTo')}&nbsp;<strong>{t(steps[activeStep - 1].title)}</strong>
          </Button>
        )}
      </Grid>
      <Grid item className={classes.buttonsGrid}>
        <Tooltip
          title={t('energyCalculator.sampleDataButton', {
            button: `${t('navigation.continueTo')} ${t(steps[activeStep + 1].title)}`,
          })}
        >
          <Button
            variant="outlined"
            color="default"
            startIcon={<FillDemoDataIcon />}
            onClick={fillSampleData}
          >
            {t("energyCalculator.sampleData")}
          </Button>
        </Tooltip>

        <Button
          variant="outlined"
          color="primary"
          endIcon={<NavigateNextIcon />}
          onClick={onNavigateNextStep}
        >
          {activeStep !== steps.length - 2 && <span>{t('navigation.continueTo')}&nbsp;</span>}
          <strong>{t(steps[activeStep + 1].title)}</strong>
        </Button>
      </Grid>
    </Grid>
  );
});

export default Calculator;
