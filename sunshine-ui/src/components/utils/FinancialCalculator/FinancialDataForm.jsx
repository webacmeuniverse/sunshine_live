import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  TextField,
  InputLabel,
  Typography,
  makeStyles,
} from '@material-ui/core';

const fieldsComponentsMap = {
  // building data
  numDwellings: { label: 'financialCalculator.labels.numDwellings' },
  billingArea: { label: 'financialCalculator.labels.billingArea', adornment: 'm²' },
  constructionCostsEEM: { label: 'financialCalculator.labels.constructionCostsEEM', adornment: 'financialCalculator.labels.constructionCostsEEMAdornment' },
  constructionCostsASM: { label: 'financialCalculator.labels.constructionCostsASM', adornment: 'financialCalculator.labels.constructionCostsASMAdornment' },
  managementAndSupervision: {
    label: 'financialCalculator.labels.managementAndSupervision',
    adornmentKey: 'financialCalculator.labels.constructionCostsPercent',
  },
  unforseenCosts: {
    label: 'financialCalculator.labels.unforseenCosts',
    adornmentKey: 'financialCalculator.labels.constructionCostsPercent',
  },
  subsidy: {
    label: 'financialCalculator.labels.subsidy',
    adornmentKey: 'financialCalculator.labels.constructionCostsPercentInclVAT',
  },
  // energy drivers
  districtHeatingTariff: { label: 'financialCalculator.labels.districtHeatingTariff', adornment: 'financialCalculator.labels.districtHeatingTariffAdornment' },
  preEnergyUseHeating: { label: 'financialCalculator.labels.preEnergyUseHeating', adornment: 'financialCalculator.labels.preEnergyUseHeatingAdornment' },
  postEnergyUseHeating: { label: 'financialCalculator.labels.postEnergyUseHeating', adornment: 'financialCalculator.labels.postEnergyUseHeatingAdornment' },
  energySavingsMargin: { label: 'financialCalculator.labels.energySavingsMargin', adornment: '%' },
  // maintenance
  maintenanceFee: {
    label: 'financialCalculator.labels.maintenanceFee',
    adornmentKey: 'financialCalculator.labels.feeSqmMonthExclVAT',
  },
  reserveFunds: {
    label: 'financialCalculator.labels.reserveFunds',
    adornmentKey: 'financialCalculator.labels.feeSqmMonthExclVAT',
  },
  // economic
  consumerPriceInflation: { label: 'financialCalculator.labels.consumerPriceInflation', adornment: '%' },
  energyPriceInflation: { label: 'financialCalculator.labels.energyPriceInflation', adornment: '%' },
  energyVAT: { label: 'financialCalculator.labels.energyVAT', adornment: '%' },
  constructionVAT: { label: 'financialCalculator.labels.constructionVAT', adornment: '%' },
  profitTax: { label: 'financialCalculator.labels.profitTax', adornment: '%' },
};

const useStyles = makeStyles((theme) => ({
  row: {
    '&:hover': {
      '& .MuiTypography-root, .MuiInputLabel-root': {
        fontWeight: 600,
      },
    },
  },
  adornment: {
    marginLeft: -theme.spacing(1.5),
  },
}));

function FinancialDataForm(props) {
  const {
    data,
    errors,
    setData,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation('translations');

  return (
    <Grid container spacing={1}>
      {Object.keys(data).map((key) => {
        const { adornment, adornmentKey, label, ...componentProps } = fieldsComponentsMap[key];
        const endAdornment = adornmentKey ? t(adornmentKey) : adornment;

        return (
          <Grid container item xs={12} spacing={2} className={classes.row} alignItems="center" key={key}>
            <Grid item xs={5}>
              <InputLabel required>{t(label)}</InputLabel>
            </Grid>
            <Grid item xs={3}>
              <TextField
                {...componentProps}
                fullWidth
                size="small"
                value={data[key]}
                error={Boolean(errors[key])}
                helperText={errors[key]}
                variant="outlined"
                type="number"
                onChange={(e) => setData({ [key]: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={4}>
              {endAdornment && <Typography variant="caption" className={classes.adornment}>{t(endAdornment)}</Typography>}
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default FinancialDataForm;
