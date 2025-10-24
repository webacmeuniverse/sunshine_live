import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  YAxis,
  XAxis,
} from 'recharts';
import {
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { countryCodesCountries } from '../../constants/countries';
import { resultTypes as resultTypesAvailable } from '../../constants/benchmarking';
import * as benchmarkingData from './data';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 40px',
  },
  resultSetTitle: {
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const chartSize = {
  saving: 400,
  costs: 150000000,
  time: 20,
};

function Results(props) {
  const {
    type,
    baseCountry,
    cmpCountry,
    measureType,
    resultType,
  } = props;

  const classes = useStyles();

  const data1 = filterByMeasureType(benchmarkingData[baseCountry]?.[type]?.saving, measureType);
  const data2 = filterByMeasureType(benchmarkingData[cmpCountry]?.[type]?.saving, measureType);

  const baseCountryName = baseCountry ? countryCodesCountries[baseCountry.toUpperCase()] : null;
  const cmpCountryName = cmpCountry ? countryCodesCountries[cmpCountry.toUpperCase()] : null;

  const resultTypesEnabled = getResultTypesEnabled(resultType);

  return (
    <div className={classes.root}>
      <Grid container spascing={2}>
        {resultTypesEnabled.map((rt) => {
          return (
            <React.Fragment key={rt.value}>
              <Grid item xs={6}>
                <Chart
                  title={baseCountryName && `${rt.label} - ${baseCountryName}`}
                  data={data1}
                  {...rt.settings}
                />
              </Grid>
              <Grid item xs={6}>
                <Chart
                  title={baseCountryName && `${rt.label} - ${cmpCountryName}`}
                  data={data2}
                  {...rt.settings}
                />
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </div>
  );
}

function Chart(props) {
  const {
    title,
    data,
    dataKeys,
    value,
    dataKey,
    yLabel,
  } = props;

  const classes = useStyles();

  if (!data) {
    return (
      <div className={classes.container}>
        <Typography variant="overline">
          Please select country to benchmark against
        </Typography>
      </div>
    );
  }

  if (data.length < 1) {
    return (
      <div className={classes.container}>
        {title && (
          <Typography variant="h5" className={classes.resultSetTitle}>
            {title}
          </Typography>
        )}
        <Typography variant="overline">
          Not enough data available
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      {title && (
        <Typography variant="h5" className={classes.resultSetTitle}>
          {title}
        </Typography>
      )}
      <ResponsiveContainer
        width="100%"
        height={400}
      >
        <BarChart
          data={data}
          margin={{
            top: 20, right: 10, left: 25, bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis
            dataKey={dataKey}
          />
          <YAxis
            domain={[0, chartSize[dataKey]]}
            label={
              <text x={-50} y={125} transform="rotate(270 10 120)" fill="#333" style={{ textAnchor: 'middle' }}>
                {yLabel ? yLabel : value}
              </text>
            }
          />
          <Tooltip />
          {dataKeys.map((dk) => {
            return (
              <Bar
                key={dk.dataKey}
                dataKey={dk.dataKey}
                name={dk.name}
                fill={dk.color}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function filterByMeasureType(data, measureType) {
  if (!data) {
    return null;
  }

  if (!measureType) {
    return data;
  }

  return data.filter((d) => d.measures_main === measureType);
}

function getResultTypesEnabled(resultType) {
  if (!resultType) {
    return resultTypesAvailable;
  }

  const resultTypeEnabled = resultTypesAvailable.find((rt) => rt.value === resultType);
  if (!resultTypeEnabled) {
    return [];
  }
  return [resultTypeEnabled];
}

export default Results;
