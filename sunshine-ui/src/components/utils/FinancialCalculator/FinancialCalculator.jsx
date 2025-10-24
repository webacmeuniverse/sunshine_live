import React, { forwardRef, useState, useReducer, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import {
  Grid,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  makeStyles
 } from '@material-ui/core';
import {
  Print as PrintIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Replay as ReplayIcon,
  WrapText as FillDemoDataIcon,
} from '@material-ui/icons';

import logoIMG from '../../../images/Sunshine-Logo-Platform.png';
import Tooltip from '../TooltipWrapper';
import TextWithIcon from '../TextWithIcon';

import { validateData } from '../EnergyCalculator/utils';
import { demoData } from './utils';
import reducer, { initialState } from './reducer';

import DataForm from './FinancialDataForm';
import FinancialResults from './FinancialResults';

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
    size:  A4 landscape;
    margin: 0;
  }
  @media all {
    .pagebreak {
      display: none;
    }
  }
  @media print {
    .pagebreak {
      display: block !important;
      page-break-after: always;
    }
  }
`;

const steps = [
  {
    label: 'financialCalculator.titles.buildingDataAndConstruction',
    title: 'financialCalculator.titles.buildingData',
    key: 'buildingData',
  },
  {
    label: 'financialCalculator.titles.energyDrivers',
    title: 'financialCalculator.titles.energyDrivers',
    key: 'energyDrivers',
  },
  { label: 'projects.projectMaintenance', title: 'projects.projectMaintenance', key: 'maintenance' },
  { label: 'financialCalculator.titles.economic', title: 'financialCalculator.titles.economic', key: 'economic' },
  { label: 'financialCalculator.titles.results', title: 'financialCalculator.titles.results', key: 'results' },
];

function FinancialCalculator() {
  const { t } = useTranslation('translations');
  const classes = useStyles();
  const [data, dispatch] = useReducer(reducer, initialState);
  const [activeStep, setActiveStep] = useState(0);
  const activeComponentRef = useRef();

  return (
    <Paper className={classes.root}  style={{    border: '1px solid rgb(0 0 0 / 36%)'}}elevation={1}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
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
            <TextWithIcon
              variant="h5"
              align="center"
              icon={<img src={logoIMG} alt="Sunshine" className="logo hide-non-print" />}
            >
              {t(steps[activeStep].title)}
            </TextWithIcon>
          </Grid>

          <ActiveStepContent
            ref={activeComponentRef}
            data={data}
            step={steps[activeStep]}
            dispatch={dispatch}
          />
        </Grid>

        <Grid item xs={12}>
          <NavigationButtons
            ref={activeComponentRef}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            onNavigateNextStep={() => {
              const errors = validateData(data[steps[activeStep].key], steps[activeStep].requiredFields || []);
              if (Object.values(errors).length === 0) {
                setActiveStep(activeStep + 1);
              } else {
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
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

const ActiveStepContent = forwardRef((props, ref) => {
  const {
    step,
    data,
    dispatch,
  } = props;

  if (step.key === 'results') {
    return (
      <FinancialResults
        ref={ref}
        data={data}
      />
    );
  }

  return (
    <DataForm
      data={data[step.key]}
      errors={data.validationErrors}
      setData={(d) => dispatch({ type: `set#${step.key}`, data: d })}
    />
  );
});

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
      <Grid container direction="row">
        <Grid item xs={4}>
          <Tooltip title={t('navigation.resetHint')}>
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
          title={t('financialCalculator.sampleDataButton', {
            button: `${t('navigation.continueTo')} ${t(steps[activeStep + 1].title)}`,
          })}
        >
          <Button
            variant="outlined"
            color="default"
            startIcon={<FillDemoDataIcon />}
            onClick={fillSampleData}
          >
            {t('financialCalculator.sampleData')}
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

export default FinancialCalculator;
