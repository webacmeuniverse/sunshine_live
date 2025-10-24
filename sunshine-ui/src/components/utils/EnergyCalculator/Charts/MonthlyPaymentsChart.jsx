import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { colors } from '../utils';

const useStyles = makeStyles({
  root: {
    '& .recharts-legend-wrapper': {
      marginLeft: 10,
    },
  },
});

function MonthlyPaymentsChart({ before, after, noDataComponent }) {
  const classes = useStyles();
  const { t } = useTranslation('translations');

  if (!before || !after) {
    return noDataComponent;
  }

  const data = [
    { ...after, name: t('energyDataForm.exPost') },
    { ...before, name: t('energyDataForm.today') },
  ];

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        className={classes.root}
        data={data}
        margin={{
          top: 20, right: 30, left: 10, bottom: 20,
        }}
        layout="vertical"
      >
        <Tooltip />
        <XAxis
          type="number"
          label={{
            value: 'Eur/m2',
            offset: 70,
            dy: 20,
            fill: '#333',
          }}
        />
        <YAxis type="category" dataKey="name" />
        <Bar
          dataKey="sh"
          name={t('energyDataForm.spaceHeating')}
          stackId={1}
          fill={colors.sh}
          maxBarSize={30}
        />
        <Bar
          dataKey="dhwcl"
          name={t('energyDataForm.domesticHotWater') +"&"+ t('energyDataForm.circulationLosses')}
          stackId={1}
          fill={colors.dhwcl}
          maxBarSize={30}
        />
        <Bar
          dataKey="maintenance"
          name={t('energyDataForm.houseMaintenance')}
          stackId={1}
          fill={colors.maintenance}
          maxBarSize={30}
        />
        <Bar
          dataKey="debtService"
          name={t('energyDataForm.debtService')}
          stackId={1}
          fill={colors.debtService}
          maxBarSize={30}
        />
        <Bar
          dataKey="fees"
          name={t('energyDataForm.fees')}
          stackId={1}
          fill={colors.fees}
          maxBarSize={30}
        />
        <Legend
          payload={[
            { value: t('energyDataForm.heating'), id: 'sh', type: 'circle', color: colors.sh },
            { value: t('energyDataForm.hotWater') + t('energyDataForm.losses'), id: 'dhwcl', type: 'circle', color: colors.dhwcl },
            { value: t('energyDataForm.maintenance'), id: 'maintenance', type: 'circle', color: colors.maintenance },
            { value: t('energyDataForm.fees'), id: 'fees', type: 'circle', color: colors.fees },
          ]}
          verticalAlign="bottom"
          wrapperStyle={{
            bottom: 0,
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

const propTypeGroup = PropTypes.shape({
  sh: PropTypes.number.isRequired,
  dhwcl: PropTypes.number.isRequired,
  maintenance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fees: PropTypes.number,
});

MonthlyPaymentsChart.propTypes = {
  before: propTypeGroup,
  after: propTypeGroup,
};

export default MonthlyPaymentsChart;
