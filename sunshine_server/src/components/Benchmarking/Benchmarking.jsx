import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  Button,
  Grid,
  Paper,
  Tabs,
  Tab,
  TextField,
  makeStyles,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { supportedCountriesOptions } from '../../constants/countries';
import {
  types,
  measureTypes,
  resultTypes,
} from '../../constants/benchmarking';
import TextWithIcon from '../utils/TextWithIcon';
import Results from './Results';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  header: {
    width: '100%',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  buildingTypeSwitcher: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',

    '& .TypeSwitcherButton-root': {
      backgroundColor: theme.palette.action.hover,
      padding: '8px 12px',
      width: '50%',

      '&:first-child': {
        borderRadius: '4px 0 0 4px',
      },
      '&:last-child': {
        borderRadius: '0 4px 4px 0',
      },
    },
    '& .TypeSwitcherButton-active': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  tabs: {
    margin: theme.spacing(2),
  },
  results: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
}));

const defaultState = {
  type: 'building',
  baseCountry: '',
  cmpCountry: 'eu',
  measureType: { building: '', industry: '' },
  buildingType: '',
  resultType: '',
};

function Benchmarking() {
  const classes = useStyles();
  const params = useParams();
  const [state, setState] = useState({ ...defaultState, baseCountry: params.country });

  return (
    <div className={classes.root}>
      <Paper className={classes.header}>
        <Grid container spacing={4}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <TypeSwitcher
              active={state.type}
              onChange={(type) => setState({ ...state, type })}
            />
          </Grid>
          <Grid item lg={9} md={8} sm={6} xs={12}>
            <Grid container spacing={4}>
              <Grid item sm={8}>
                <Grid container>
                  <Grid item xs={6}>
                    <Input
                      size="small"
                      label="Country"
                      options={supportedCountriesOptions}
                      value={state.baseCountry}
                      onChange={(_, v) => setState({ ...state, baseCountry: v?.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      size="small"
                      label="Country"
                      options={supportedCountriesOptions}
                      value={state.cmpCountry}
                      onChange={(_, v) => setState({ ...state, cmpCountry: v?.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={4}>
                <Input
                  size="small"
                  label="Measure Type"
                  options={measureTypes[state.type]}
                  value={state.measureType[state.type]}
                  onChange={(_, v) => setState({
                    ...state,
                    measureType: {
                      ...state.measureType,
                      [state.type]: v?.value,
                    },
                  })}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <div className={classes.tabs}>
        <Paper>
          <Tabs
            indicatorColor="primary"
            value={state.resultType}
            onChange={(_, v) => setState({ ...state, resultType: v })}
          >
            <Tab label="All reports" value="" />
            {resultTypes.map((rt) => {
              return (
                <Tab label={rt.label} value={rt.value} key={rt.value} />
              );
            })}
          </Tabs>
        </Paper>
      </div>
      <div className={classes.results}>
        <Paper>
          <Results
            type={state.type}
            baseCountry={state.baseCountry}
            cmpCountry={state.cmpCountry}
            measureType={state.measureType[state.type]}
            buildingType={state.buildingType}
            resultType={state.resultType}
          />
        </Paper>
      </div>
    </div>
  );
}

function TypeSwitcher(props) {
  const {
    active,
    onChange,
  } = props;
  const classes = useStyles();

  return (
    <div className={classes.buildingTypeSwitcher}>
      {types.map((type) => {
        return (
          <TextWithIcon
            key={type.value}
            icon={<type.Icon />}
            component={Button}
            className={clsx('TypeSwitcherButton-root', { 'TypeSwitcherButton-active': active === type.value })}
            onClick={() => onChange(type.value)}
          >
            {type.label}
          </TextWithIcon>
        );
      })}
    </div>
  );
}
function Input(props) {
  const {
    label,
    options,
    value,
    onChange,
  } = props;

  const classes = useStyles();
  const selected = (value && options.find((o) => o.value === value)) || null;

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label}
      renderInput={(params) =>
        <TextField
          {...params}
          label={label}
          className={classes.input}
        />
      }
      onChange={onChange}
      value={selected}
    />
  );
}

export default Benchmarking;
