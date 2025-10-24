import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';

import get from '../../../utils/get';
import logoIMG from '../../../images/Sunshine-Logo-Platform.png';
import TextWithIcon from '../TextWithIcon';
import { results as styles } from './styles';
import { calc } from './utils';

const numberFormatter = new Intl.NumberFormat('en-EN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const minimalNumberFormatter = new Intl.NumberFormat('en-EN', { maximumFractionDigits: 0 });

const useStyles = makeStyles(styles);

function calculate(rows, data, rowsCalcFnMap) {
  const calcData = {};
  for (let i = 0; i < rows.length; i++) {
    if (rowsCalcFnMap?.[i]) {
      const calcFn = rowsCalcFnMap[i];
      if (!calc[calcFn]) {
        console.warn(`Calc function ${calcFn} does not exist.`); // eslint-disable-line no-console
        continue;
      }

      calcData[calcFn] = calc[calcFn](data, { num: rows[i].length - 1 });
      continue;
    }

    for (const field of rows[i]) {
      if (field.indexOf('data.calc') !== 0) {
        continue;
      }
      const calcFn = field.split('.')[2];
      if (!calc[calcFn]) {
        console.warn(`Calc function for ${field} does not exist.`); // eslint-disable-line no-console
        continue;
      }
      calcData[calcFn] = calc[calcFn](data);
    }
  }
  return calcData;
}

const FinancialResults = forwardRef((props, ref) => {
  const {
    data,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation('translations');

  const constructionHeaders = [
  '',
  t('financialCalculator.columns.costUnitExVAT'),
  t('financialCalculator.columns.unit'),
  t('financialCalculator.columns.vat'),
  t('financialCalculator.columns.costUnitInclVAT'),
  t('financialCalculator.columns.unit'),
  t('financialCalculator.columns.totalsExVAT'),
  t('financialCalculator.columns.totalsInclVAT'),
];
const constructionRows = [
  [
    t('financialCalculator.labels.constructionCostsEEM'),
    'data.calc.constrCostsEEMWOVAT',
    '€/m2',
    'data.economic.energyVAT',
    'data.calc.constrCostsEEMWVAT',
    '€/m2',
    'data.calc.constrCostsEEMTotalWOVAT',
    'data.calc.constrCostsEEMTotalWVAT',
  ],
  [
    t('financialCalculator.labels.constructionCostsASM'),
    'data.calc.constrCostsASMWOVAT',
    '€/m2',
    'data.economic.energyVAT',
    'data.calc.constrCostsASMWVAT',
    '€/m2',
    'data.calc.constrCostsASMTotalWOVAT',
    'data.calc.constrCostsASMTotalWVAT',
  ],
  [
    t('financialCalculator.labels.managementAndSupervision'),
    'data.calc.mngmtCostsWOVAT',
    '€/m2',
    'data.economic.energyVAT',
    'data.calc.mngmtCostsWVAT',
    '€/m2',
    'data.calc.mngmtCostsTotalWOVAT',
    'data.calc.mngmtCostsTotalWVAT',
  ],
  [
    t('financialCalculator.labels.unforseenCosts'),
    'data.calc.unknownCostsWOVAT',
    '€/m2',
    'data.economic.energyVAT',
    'data.calc.unknownCostsWVAT',
    '€/m2',
    'data.calc.unknownCostsTotalWOVAT',
    'data.calc.unknownCostsTotalWVAT',
  ],
  [
    t('financialCalculator.labels.totalConstructionCosts'),
    'data.calc.constrCostsTotalUnitWOVAT',
    '€/m2',
    'data.economic.energyVAT',
    'data.calc.constrCostsTotalUnitWVAT',
    '€/m2',
    'data.calc.constrCostsTotalWOVAT',
    'data.calc.constrCostsTotalWVAT',
  ],
  [
    t('financialCalculator.labels.subsidy'),
    '',
    '',
    '',
    '',
    '',
    '',
    'data.calc.subsidy',
  ],
  [
    t('financialCalculator.labels.totalConstructionCostsSubsidy'),
    '',
    '',
    '',
    '',
    '',
    '',
    'data.calc.afterSubsidyTotal',
  ],
];

const savingsHeaders = [
  '',
  '%',
  t('financialCalculator.columns.unit'),
  t('financialCalculator.columns.vat'),
  t('financialCalculator.columns.tariffInclVAT'),
  t('financialCalculator.columns.unit'),
  t('financialCalculator.columns.energyUseForBuilding'),
  t('financialCalculator.columns.unit'),
];

const savingsRows = [
  [
    t('financialCalculator.labels.districtHeatingTariff'),
    '',
    '',
    'data.economic.energyVAT',
    'data.calc.districtHeatTariffWVAT',
    '€/MWh',
    '',
    '',
  ],
  [
    t('financialCalculator.labels.preEnergyUseHeating'),
    '',
    '',
    '',
    '',
    '',
    'data.calc.preRenovationHeating',
    'MWh/year'
  ],
  [
    t('financialCalculator.labels.postEnergyUseHeating'),
    '',
    '',
    '',
    '',
    '',
    'data.calc.postRenovationHeating',
    'MWh/year',
  ],
  [
    t('financialCalculator.labels.energySavingsRatio'),
    'data.calc.savingsRatioPercent',
    '%',
    '',
    '',
    '',
    '',
    ''
  ],
  [
    t('financialCalculator.labels.energySavingsGuaranteeEnPC'),
    'data.calc.savingsGuranteePercent',
    '%',
    '',
    '',
    '',
    'data.calc.savingsGuranteeMwH',
    'MWh/year',
  ],
];

const yearlyHeaders = [
  '',
  { title: t('financialCalculator.columns.yearlyDistributionOfCosts'), colSpan: 25 },
];
const yearlyRowsRoot = [
  [
    t('financialCalculator.labels.years'),
  ],
  [
    t('financialCalculator.labels.costOfHeating'),
  ],
  [
    t('financialCalculator.labels.costOfHousingMaintenance'),
  ],
  [
    t('financialCalculator.labels.reserveFund'),
  ],
  [
    t('financialCalculator.labels.totalCostBuilding'),
  ],
  [
    t('financialCalculator.labels.costPerM2PerMonth'),
  ],
];

const yearlyRowsCalcFnMap = {
  1: 'yearlyCostsHeating',
  2: 'yearlyCostsMaint',
  3: 'yearlyCostsResFund',
  4: 'yearlyCostsTotal',
  5: 'yearlyCostsSqMPMonth',
};

const yearlyRows = yearlyRowsRoot.slice().map((row, i) => {
  if (i === 0) {
    return (new Array(26).fill(null)).map((_, j) => {
      if (j === 0) {
        return row[j];
      }
      return j.toString();
    });
  }
  const cols = [row[0]];
  for (let j = 0; j < 25; j++) {
    if (yearlyRowsCalcFnMap[i]) {
      cols.push({ title: `data.calc.${yearlyRowsCalcFnMap[i]}.${j}`, numberFormat: 'minimal' });
      continue;
    }
    cols.push('-');
  }
  return cols;
});

  const yearlyRowsCalcData = calculate(yearlyRows, data, yearlyRowsCalcFnMap);
  const calcData = calculate([...constructionRows, ...savingsRows], data);
  const calculatedData = { ...calcData, ...yearlyRowsCalcData };

  return (
    <div ref={ref} className={classes.resultsRoot}>
      <ResultsTable
        className={classes.constructionTable}
        headers={constructionHeaders}
        rows={constructionRows}
        data={{ ...data, calc: calculatedData }}
      />
      <ResultsTable
        className={classes.savingsTable}
        headers={savingsHeaders}
        rows={savingsRows}
        data={{ ...data, calc: calculatedData }}
      />
      <ResultsTable
        className={`${classes.yearlyTable} page-full-width`}
        headers={yearlyHeaders}
        rows={yearlyRows}
        data={{ ...data, calc: calculatedData }}
      />
    </div>
  );
});

function ResultsTable(props) {
  const {
    headers,
    rows,
    data,
    className,
    disableLogoHeader,
    disablePageBreak,
  } = props;

  const { t } = useTranslation('translations');
  const classes = useStyles();

  return (
    <div className={classes.resultsEntryWrapper}>
      {!disableLogoHeader && (
        <TextWithIcon
          className={classes.resultsLogoWrapper}
          variant="h6"
          align="center"
          icon={<img src={logoIMG} alt="SUNShINE" />}
        >
          {t('financialCalculator.titles.resultsPrint')}
        </TextWithIcon>
      )}
      <TableContainer component={Paper} className={clsx(classes.tableContainer, className)}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              {headers.map((h, i) => {
                return (
                  <ResultsTableCell align="center" key={i} title={h} />
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => {
                  const align = j > 0 ? 'center' : 'left';
                  return (
                    <ResultsTableCell align={align} key={j} title={cell} data={data} />
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!disablePageBreak && <div className="pagebreak" />}
    </div>
  );
}

function ResultsTableCell(props) {
  const {
    title,
    data,
    numberFormat,
    ...cellProps
  } = props;
  if (typeof title === 'object') {
    const { title: cellTitle, titleNumberFormat, ...cellTitleProps } = title;
    return (
      <ResultsTableCell
        title={cellTitle}
        data={data}
        numberFormat={titleNumberFormat}
        {...cellProps}
        {...cellTitleProps}
      />
    );
  }

  if (typeof title === 'string' && title.indexOf('data.') > -1) {
    const titleDataPath = title.split('.');
    const value = get({ data }, titleDataPath, title);

    const nf = numberFormat === 'minimal' ? minimalNumberFormatter : numberFormatter;

    return (
      <TableCell {...cellProps}>{nf.format(value)}</TableCell>
    );
  }

  return (
    <TableCell {...cellProps}>{title}</TableCell>
  );
}

export default FinancialResults;
