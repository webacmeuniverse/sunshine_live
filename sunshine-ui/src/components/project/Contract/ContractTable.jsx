import React, { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  makeStyles,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Clear as ClearIcon,
  Remove as RemoveIcon,
} from '@material-ui/icons';



import get from '../../../utils/get';
import set from '../../../utils/set';
import parseTitle from '../../../utils/parseJSONi18n';
import insertJSONi18n from '../../../utils/insertJSONi18n';
import parseSpecialSymbols from '../../../utils/parseSpecialSymbols';
import useLocale from '../../../utils/useLocale';
import { updateAnnexTable } from '../../../actions/annex';
import Input from '../../utils/Input';
import FrequencyPeriodInput from '../../utils/FrequencyPeriodInput';
import tables from './tables';

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: `${theme.spacing(1)}px 0`,
    display: 'flex',
    flexDirection: 'column',

    '& .control': {
      diplay: 'flex',
      flexDirection: 'row',
    },
    '& .actions': {
      display: 'flex',
      flexDirection: 'row-reverse',
    }
  },
  root: {
    overflow: 'visible',
    '& .MuiTableCell-sizeSmall': {
      padding: 0,
    },
    '& .MuiTableCell-root': {
      border: '1px solid rgba(224, 224, 224, 1)',
      position: 'relative',

      '& > span': {
        display: 'table-cell',
        padding: theme.spacing(0.5),
      },

      '& .MuiInputBase-root': {
        '& input': {
          padding: `0 ${theme.spacing(0.5)}px`
        },

        '& .MuiTypography-root': {
          paddingRight: theme.spacing(0.5),
        },
      },

      '& .MuiOutlinedInput-notchedOutline': {
        border: 0,
      },
      '& .MuiSelect-outlined.MuiSelect-outlined': {
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        paddingLeft: theme.spacing(0.5),
        minWidth: theme.spacing(8),
      }
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root': {
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      },
    },
  },
  removeRowIcon: {
    position: 'absolute',
    right: -theme.spacing(2.8),
    top: theme.spacing(0.5),
    bottom: theme.spacing(0.5),
    width: theme.spacing(3),
    background: '#fff',
    borderRadius: '10%',
    border: `1px solid ${theme.palette.divider}`,

    '&:hover': {
      backgroundColor: '#fafafa',
    },
  },
  hint: {
    fontWeight: 600,
    fontStyle: 'italic',
  },
  sentencize: {
    '&:first-letter': {
      textTransform: 'capitalize',
    },
  },
  filtersContainer: {
    marginBottom: theme.spacing(2),

    '& .MuiSelect-outlined.MuiSelect-outlined': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    }
  },
}));

const kindsInputs = {
  2: {
    inputProps: { type: 'number', min: 0, step: 'any' },
  },
  3: {
    adornment: <Typography color="textSecondary" key="euro" component="span">€</Typography>,
    inputProps: { type: 'number', min: 0, step: 'any' },
  },
  4: {
    adornment: <Typography color="textSecondary" key="m3" component="span">°C</Typography>,
    inputProps: { type: 'number', step: 'any' },
  },
  5: {
    inputProps: { type: 'number', min: 0, step: 'any' },
  },
  6: {
    adornment: <Typography color="textSecondary" key="m3" component="span">m³</Typography>,
    inputProps: { type: 'number', min: 0, step: 'any' },
  },
  7: {
    adornment: <Typography color="textSecondary" key="mwh" component="span">MWh</Typography>,
    inputProps: { type: 'number', min: 0, step: 'any' },
  },
  8: {
    adornment: <Typography color="textSecondary" key="m2" component="span">㎡</Typography>,
    inputProps: { type: 'number', min: 0, step: 'any' },
  },
};

const specialSymbolRe = /[_|^|$]\{?(.*?)\}?\$?/;

function ContractTable(props) {
  const {
    project,
    table
  } = props;

  if (!project) {
    return null;
  }

  const config = tables[table];
  if (!config) {
    return null;
  }

  if (Array.isArray(config)) {
    return config.map((c, i) => <I18nTable {...props} config={c} key={i} />);
  }

  return <I18nTable {...props} config={config} />;
}

ContractTable.propTypes = {
  table: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  component: PropTypes.elementType,
};

ContractTable.defaultProps = {
  component: Paper,
};

function I18nTable(props) {
  const {
    project,
    language,
    update,
    config,
    disabled,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation('translations');

  const loc = useLocale(language, project?.singleProject?.data.country);

  const [filters, setFilters] = useState({});
  const handleFilterChange = useCallback((e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }, [filters, setFilters]);
  const clearFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  const formRef = useRef();

  const keyParts = config.key.split('.');
  const { data, fixedRowsNum: frn } = getData(project, keyParts, config.useRowsFrom);
  const fixedRowsNum = config.fixedRowsNum || frn;

  const [rowsDataObj, setRowsDataObj] = useState({ rowsData: null, initialRowsDataStr: null });
  const { rowsData, initialRowsDataStr } = rowsDataObj;
  const setRowsData = (rd) => {
    setRowsDataObj({ ...rowsDataObj, rowsData: rd });
  };

  if (!data || Object.keys(data).length < 1) {
    return null;
  }

  if (rowsData === null || JSON.stringify(data.rows) !== initialRowsDataStr) {
    setRowsDataObj({
      rowsData: data.rows,
      initialRowsDataStr: JSON.stringify(data.rows),
    });
  }

  if (!rowsData) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    const entries = formData.entries();
    const d = { rows: rowsData.slice() };
    for (const [idxs, v] of entries) {
      const inputRefCurrent = formRef.current.elements[idxs];
      const value = inputRefCurrent?.dataset.value || v;

      const idxParts = idxs.split('-');
      if (idxParts[1].match(/^title[0-9]+$/)) {
        if (!d.title) {
          d.title = value;
          continue;
        }
        d.title = `${d.title} ${value}`;
        continue;
      }

      set(d.rows, idxParts, value);
    }

    update({
      projectID: project.singleProject._id,
      path: config.path,
      storeAnnexKey: keyParts[0],
      storeAnnexTableKey: keyParts[1],
      data: d,
    });
  };

  const addRow = () => {
    const nd = rowsData.slice().concat([(new Array(config.legend.length).fill('')) ]);
    setRowsData(nd);
  };

  const removeRow = (i) => {
    const nd = rowsData.slice();
    nd.splice(i, 1);
    setRowsData(nd);
  };

  const headersLength = data.columns.find(c => Boolean(c.headers))?.headers.length;
  return (
    <TableContainer component={props.component} className={classes.root}>
      {config.columnFilters && (
        <Grid
          container
          direction="row-reverse"
          className={classes.filtersContainer}
          spacing={1}
          alignItems="center"
        >
          <Grid item>
            <IconButton size="small" onClick={clearFilters}>
              <ClearIcon />
            </IconButton>
          </Grid>
          {config.columnFilters.map((idx) => {
            const InputProps = config.inputPropsIndexMap[idx];
            const options = getOptionsFromInputProps(InputProps, t);
            return (
              <Grid item key={idx}>
                <Input
                  label={parseTitle(data.columns[idx].name, loc)}
                  type={InputProps.type}
                  options={options}
                  value={filters[idx] || ''}
                  onChange={handleFilterChange}
                  name={idx}
                  inputProps={{ ...InputProps.inputProps, name: idx.toString() }}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
      <form
        action={window.location.href}
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <Title
          config={config}
          data={data}
          annexesData={project.annexes}
        />

        <Table size="small">
          <TableHead>
            <TableRow>
              {data.columns && data.columns.map((c, i) => {
                return (
                  <TableCell key={i}>
                    <CellTitle title={c.name} loc={loc} />
                  </TableCell>
                );
              })}
            </TableRow>
            {headersLength && data.columns && (new Array(headersLength)).fill(null).map((_, i) => (
              <TableRow key={i}>
                {data.columns && data.columns.map((c, j) => {
                  return (
                    <TableCell key={j}>
                      <CellTitle title={c.headers?.[i] || ''} loc={loc} />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {rowsData.map((r, i) => {
              const canEditRow = fixedRowsNum <= i;
              const disabledInputs = config.disabledInputRows?.indexOf(i) > -1;

              for (const idx in filters) {
                if (!filters[idx]) {
                  continue;
                }
                if (r[idx] !== filters[idx]) {
                  return null;
                }
              }

              return (
                <TableRow key={`${i}-${rowsData.length}`}>
                  {r.map((c, j) => {
                    const canEditCell = config.legend[j] === '\\' ||
                      (!disabledInputs && config.legend[j] === '/') ||
                      (config.legend[j] === '//' && i >= fixedRowsNum);
                    const endAdornments = [];
                    let inputProps;
                    if (j + 1 === r.length && canEditRow) {
                      endAdornments.push(
                        <IconButton
                          key="del"
                          size="small"
                          className={classes.removeRowIcon}
                          onClick={() => removeRow(i)}
                          disabled={disabled}
                        >
                          <RemoveIcon />
                        </IconButton>
                      );
                    }
                    if (data.columns[j]?.kind in kindsInputs) {
                      if (kindsInputs[data.columns[j].kind].adornment) {
                        endAdornments.push(kindsInputs[data.columns[j].kind].adornment);
                      }
                      if (kindsInputs[data.columns[j].kind].inputProps) {
                        inputProps = kindsInputs[data.columns[j].kind].inputProps;
                      }
                    }

                    const inputID = `${i}-${j}`;
                    return (
                      <TableCell key={inputID}>
                        <CellWrapper
                          value={c}
                          loc={loc}
                          withInput={canEditCell}
                          withI18n={!config.disableI18n}
                          endAdornment={<React.Fragment>{endAdornments}</React.Fragment>}
                          inputProps={{ ...inputProps, name: inputID }}
                          InputProps={{ ...config.inputPropsIndexMap?.[j] }}
                          disabled={disabled}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className={classes.footer}>
          {config.addRows && (
            <div className="control">
              <Button size="small"
                startIcon={<AddIcon />}
                variant="outlined"
                disableElevation
                onClick={addRow}
                disabled={disabled}
              >
                {t('utils.addRow')}
              </Button>
            </div>
          )}
          <div className="actions">
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              disabled={disabled}
            >
              {t('meetings.save')}
            </Button>
          </div>
        </div>
      </form>
    </TableContainer>
  );
}

const useCellWrapperStyles = makeStyles({
  noInputWrapper: {
    display: 'flex !important',
    justifyContent: 'space-between',
    '& > span:first-child': {
      minWidth: 16,
    },
  },
});

function CellWrapper(props) {
  const {
    value,
    loc,
    withInput,
    withI18n,
    endAdornment,
    inputProps,
    InputProps,
    disabled
  } = props;

  const classes = useCellWrapperStyles();

  let v = parseTitle(value, loc);
  if (!withInput) {
    if (v.match(specialSymbolRe)) {
      v = parseSpecialSymbols(v);
    }
    return (
      <span className={classes.noInputWrapper}>
        <span dangerouslySetInnerHTML={{ __html: v }} />
        {endAdornment}
      </span>
    );
  }

  return (
    <I18nInput
      value={value}
      loc={loc}
      endAdornment={endAdornment}
      inputProps={inputProps}
      InputProps={InputProps}
      withI18n={withI18n}
      disabled={disabled}
    />
  );
}

CellWrapper.propTypes = {
  endAdornment: PropTypes.node,
};

CellWrapper.defaultProps = {
  endAdornment: null,
};

function CellTitle(props) {
  const { title, headers, loc } = props;

  let n = parseTitle(title, loc);
  if (n.match(specialSymbolRe)) {
    n = parseSpecialSymbols(n);
  }

  if (!headers) {
    return <span dangerouslySetInnerHTML={{ __html: n }} />;
  }
  return (
    <span>
      <span dangerouslySetInnerHTML={{ __html: n }} />
      <Divider />
      {headers.map((h, i) => {
        let ct = parseTitle(h, loc);
        if (ct.match(specialSymbolRe)) {
          ct = parseSpecialSymbols(ct);
        }
        return (
          <React.Fragment key={i}>
            <span dangerouslySetInnerHTML={{ __html: ct }} />
            <br />
          </React.Fragment>
        );
      })}
    </span>
  );
}

function Title(props) {
  const {
    config,
    data,
    annexesData,
  } = props;

  const classes = useStyles();
  const { t } = useTranslation('translations');

  let subtitle = null;
  if (config.titleStoreKey) {
    subtitle = get(annexesData, config.titleStoreKey.split('.'));
  }

  return (
    <React.Fragment>
      {config.title && (
        <Typography variant="h5" gutterBottom className={classes.sentencize}>
          {t(...(typeof config.title === 'string' ? [config.title] : config.title))}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="subtitle2" component="p" gutterBottom>
          {subtitle}
        </Typography>
      )}
      {config.hint && (
        <Typography variant="caption" component="p" gutterBottom className={classes.hint}>
          {t(config.hint)}
        </Typography>
      )}
      {config.titleInput && (
        <Input
          {...config.titleInput.inputProps}
          value={data[config.titleInput.key]}
        />
      )}
    </React.Fragment>
  );
}

function I18nInput(props) {
  const {
    value,
    loc,
    endAdornment,
    inputProps,
    InputProps,
    withI18n,
    disabled
  } = props;

  const { t } = useTranslation('translations');

  const onKeyDown = useCallback((e) => {
    if (inputProps.type !== 'number') {
      return;
    }
    // e.keyCode 69 is the "e" key on the keyboard, which
    // is valid as number input can accept floating-point numbers,
    // including negative symbols and the e or E character.
    if (e.keyCode === 69) {
      e.preventDefault();
    }
  }, [inputProps.type]);

  const [jsonValue, setJSONValue] = useState(value);
  const displayValue = parseTitle(jsonValue, loc);

  const onChange = useCallback((e) => {
    if (!withI18n) {
      return;
    }

    if (InputProps.type === 'datepicker') {
      setJSONValue(e.target.value?.toString() || '');
      return;
    }

    if (InputProps.type) {
      setJSONValue(e.target.value);
      return;
    }

    const updated = insertJSONi18n(jsonValue, e.target.value, loc, { initDefault: true });
    setJSONValue(updated);
  }, [withI18n, jsonValue, loc, setJSONValue, InputProps.type]);

  if (InputProps.type === 'frequency-range') {
    return (
      <FrequencyPeriodInput
        inputProps={inputProps}
        disableYearsOptions={InputProps.disableYearsOptions}
        value={displayValue}
        disabled={disabled}
      />
    );
  }

  if (InputProps.type) {
    const options = getOptionsFromInputProps(InputProps, t);
    return (
      <Input
        type={InputProps.type}
        options={options}
        value={displayValue}
        onChange={onChange}
        inputProps={{ ...inputProps, ...InputProps.inputProps }}
        disabled={disabled}
      />
    );
  }

  if (!withI18n || (inputProps.type && inputProps.type !== 'text')) {
    return (
      <InputBase
        defaultValue={displayValue}
        endAdornment={endAdornment}
        inputProps={inputProps}
        onKeyDown={onKeyDown}
        fullWidth
        autoComplete="off"
        disabled={disabled}
      />
    );
  }

  return (
    <InputBase
      endAdornment={endAdornment}
      inputProps={{ ...inputProps, 'data-value': jsonValue }}
      onKeyDown={onKeyDown}
      value={displayValue}
      onChange={onChange}
      fullWidth
      autoComplete="off"
      disabled={disabled}
    />
  );
}

I18nInput.propTypes = {
  inputProps: PropTypes.object,
  InputProps: PropTypes.shape({ type: PropTypes.string }),
};

I18nInput.defaultProps = {
  inputProps: {},
  InputProps: {},
};

function getOptionsFromInputProps(props, t) {
  if (props.options) {
    return props.options;
  }
  if (props.optionsI18nFn) {
    return props.optionsI18nFn(t);
  }
  return null;
}

function getData(project, keyParts, useRowsFrom) {
  const tableData = get(project.annexes, keyParts);
  // If we won't be using other tables to use rows from (eg.
  // maintenance tables from annes 2 are used in work phase "table
  // with the works") - simply return the original data.
  if (!useRowsFrom) {
    return { data: tableData, fixedRowsNum: null };
  }

  const data = { columns: tableData.columns, rows: [] };
  let idx = 0;
  for (const tableName of useRowsFrom) {
    const d = get(project.annexes, tableName.split('.'));
    if (!d?.rows) {
      continue;
    }

    for (const row of d.rows) {
      // If we have inconsistent data where actual table is saved, but
      // not rows are less than the rows from the joint table - add
      // new entry to the data array.
      if (!tableData.rows[idx]) {
        const fillerArr = new Array(tableData.rows[0].length - 1).fill('');
        data.rows.push([row[0], ...fillerArr]);
        idx++;
        continue;
      }

      data.rows.push([row[0], ...tableData.rows[idx].slice(1)]);
      idx++;
    }
  }

  // If we have more data in the original table - this data
  // is custom data we'd want to append to the end of the
  // table.rows slice and present it to the user.
  if (idx < tableData.rows.length) {
    data.rows.push(...tableData.rows.slice(idx));
  }

  return { data, fixedRowsNum: idx };
}

export default connect(
  (state) => ({
    project: state.project,
  }),
  (dispatch) => ({
    update: (params) => dispatch(updateAnnexTable(params)),
  })
)(ContractTable);
