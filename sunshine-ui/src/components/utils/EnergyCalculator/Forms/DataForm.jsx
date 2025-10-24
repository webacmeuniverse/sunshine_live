import React from 'react';
import {
  FormControl,
  Grid,
  TextField,
  Select,
  InputLabel,
  InputAdornment,
  FormHelperText,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { coefficients } from '../utils';

const fieldComponentsMap = {
  project: {
    component: SelectWrapper,
    label: 'energyCalculator.labels.buildingProject',
    options: Object.keys(coefficients),
  },
  heatedArea: { label: 'energyCalculator.labels.heatedArea', type: 'number', adornment: 'm²' },
  numFloors: { label: 'energyCalculator.labels.nrOfFloors', type: 'number' },
  numStaircases: { label: 'energyCalculator.labels.nrOfStaircases', type: 'number' },
  numFlats: { label: 'energyCalculator.labels.nrOfFlats', type: 'number' },
  energyPrice: { label: 'energyCalculator.labels.energyPrice', type: 'number', adornment: 'energyCalculator.labels.energyPriceAdornment' },
  grant: { label: 'energyCalculator.labels.grant', adornment: '%', type: 'number' },
  equityFinancing: { label: 'energyCalculator.labels.equityFinancing', adornment: '%', type: 'number' },
  debtFinancing: { label: 'energyCalculator.labels.debtFinancing', adornment: '%', type: 'number' },
  interestRate: { label: 'energyCalculator.labels.interestRate', adornment: '%', type: 'number' },
  loanTerm: { label: 'energyCalculator.labels.loanTerm', adornment: 'calculationResults.years', type: 'number' },
  epcTerm: { label: 'energyCalculator.labels.EPCTerm', adornment: 'calculationResults.years', type: 'number' },
  inflation: { label: 'energyCalculator.labels.inflation', adornment: '%', type: 'number' },
  feeBeforeRenovation: { label: 'energyCalculator.labels.feeBeforeRenovation', adornment: 'financialCalculator.labels.constructionCostsASMAdornment', type: 'number' },
  feeAfterRenovation: { label: 'energyCalculator.labels.feeAfterRenovation', adornment: 'financialCalculator.labels.constructionCostsASMAdornment', type: 'number' },
  administrationFee: { label: 'energyCalculator.labels.administrationFee', adornment: '%', type: 'number' },
  maintenanceFee: { label: 'energyCalculator.labels.maintenanceFee', adornment: '%', type: 'number' },
  insuranceFee: { label: 'energyCalculator.labels.insuranceFee', adornment: '%', type: 'number' },
  yearlyFee: { label: 'energyCalculator.labels.yearlyFee', adornment: '%', type: 'number' },
  monthlyFee: { label: 'energyCalculator.labels.monthlyFee', adornment: '%', type: 'number' },
};

function DataForm(props) {
  const {
    data,
    errors,
    setData,
  } = props;
  const { t } = useTranslation('translations');

  return (
    <Grid container spacing={2}>
      {Object.keys(data).map(key => {
        const { component, adornment, label, ...componentProps } = fieldComponentsMap[key];
        const DataField = component || TextField;

        return (
          <Grid item md={6} sm={12} key={key}>
            <FormControl
              key={key}
              variant="outlined"
              margin="normal"
              fullWidth
              error={Boolean(errors[key])}
            >
              <DataField
                {...componentProps}
                label={t(label)}
                InputProps={adornment && {
                  endAdornment: <InputAdornment position="end">{t(adornment)}</InputAdornment>,
                }}
                key={key}
                value={data[key]}
                error={Boolean(errors[key])}
                helperText={errors[key]}
                variant="outlined"
                onChange={(e) => setData({ [key]: e.target.value })}
              />

            </FormControl>
          </Grid>
        );
      })}
    </Grid>
  );
}

function SelectWrapper(props) {
  const {
    label,
    value,
    variant,
    options,
    error,
    helperText,
    onChange,
  } = props;

  const labelRef = React.useRef(null);
  const { t } = useTranslation('translations');
  const [labelWidth, setLablWidth] = React.useState(0);
  React.useEffect(() => {
    setLablWidth(labelRef.current.offsetWidth);
  }, []);

  return (
    <React.Fragment>
      <InputLabel htmlFor="project" ref={labelRef}>
        {t(label)}
      </InputLabel>
      <Select
        native
        variant={variant}
        labelWidth={labelWidth}
        value={value}
        error={error}
        onChange={onChange}
      >
        <option value="" />
        {options.map((o) => <option key={t(o)} value={o}>{t(o)}</option>)}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </React.Fragment>
  );
}

export default DataForm;
