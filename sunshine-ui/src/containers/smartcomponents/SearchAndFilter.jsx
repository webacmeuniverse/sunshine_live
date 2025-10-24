import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
} from '@material-ui/core';
import {
  Clear as ClearIcon,
  Info as InfoIcon,
  InfoOutlined as SearchInfoIcon,
  Search as SearchIcon,
} from '@material-ui/icons';

import { query, parseQuery } from '../../utils/url';
import Input from '../../components/utils/Input';
import UserTooltip from '../../components/utils/UserTooltip';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: '10px 30px',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    zIndex: 1,

    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: '#DFE2E5',
    },
    '& .MuiFormControl-fullWidth': {
      '& .MuiSelect-root': {
        paddingTop: 10,
        paddingBottom: 10,
      },
    },
  },
  searchButtonRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: 4,

    '&:hover': {
      borderColor: 'rgba(0, 0, 0, 0.87)',
    },
  },
  searchButtonInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  searchButtonIconButton: {
    padding: 2,
  },
  searchButtonDivider: {
    height: 20,
    margin: 2,
  },
}));

const defaultState = {
  filterValues: {},
  search: '',
  searchInput: '',
  initialized: false,
  performed: false,
};

function SearchAndFilter(props) {
  const {
    filters,
    tooltip,
    searchInfoTooltip,
    onChange,
    searchPlaceholder,
 
  } = props;
  const { t } = useTranslation('translations');
  const classes = useStyles();
  const h = useHistory();
  const windowLocation = useLocation();

  const defaultFilterValues = {};
  for (const f of filters) {
    defaultFilterValues[f.name] = defaultFilterValues[f.name] ?? '';
  }
  const activeFilterValues = { ...defaultFilterValues, ...parseQuery(windowLocation.search) };

  const [state, setState] = useState({ ...defaultState, filterValues: activeFilterValues });

  const { filterValues, search, searchInput } = state;

  const performSearch = (queryParams) => {
    if (!queryParams) {
      if (windowLocation.search) {
        h.push(windowLocation.pathname + windowLocation.hash);
      }
      onChange();
      return;
    }
    const qp = { search, ...queryParams };
    h.push(`${windowLocation.pathname}?${query(qp)}${windowLocation.hash}`);

    onChange(qp);
  };

  const hasFilterValues = Object.values(state.filterValues).filter((v) => Boolean(v)).length > 0;

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {filters.map((f) => {
          if (f.name === 'country') {
            return (
              <Grid item key={f.name} md={3} xs={6}>
  
  
                <Input
                  placeholder={f.placeholder}
                  label={f.label}
                  options={f.options.map(o => ({ value: o.value, label: t('translations:countriesRegisterKeys.'+o.label)  }))} 
                  //options={f.options.map(o => ({ value: o.value, label: o.label  }))} 
                  value={filterValues[f.name]}
                  onChange={e => {
                    const updFilterValues = { ...state.filterValues, [f.name]: e.target.value };
                    setState({ ...state, filterValues: updFilterValues });
                    performSearch(updFilterValues);
                  }}
                />
              </Grid>
            );
          }else{
            return (
              <Grid item key={f.name} md={3} xs={6}>
  
  
                <Input
                  placeholder={f.placeholder}
                  label={f.label}
                  options={f.options}
                  value={filterValues[f.name]}
                  onChange={e => {
                    const updFilterValues = { ...state.filterValues, [f.name]: e.target.value };
                    setState({ ...state, filterValues: updFilterValues });
                    performSearch(updFilterValues);
                  }}
                />
              </Grid>
            );

          }
         
        })}
        <Grid item md={3} xs={6}>
          <Box
            component="form"
            className={classes.searchButtonRoot}
            onSubmit={e => {
              e.preventDefault();

              setState({ ...state, search: searchInput });
              performSearch({ ...state.filterValues, search: searchInput });
            }}
          >
            <InputBase
              placeholder={searchPlaceholder}
              className={classes.searchButtonInput}
              inputProps={{
                value: searchInput,
                onChange: (e) => setState({ ...state, search: '', searchInput: e.target.value }),
              }}
            />
            <IconButton
              color="primary"
              type="submit"
              className={classes.searchButtonIconButton}
            >
              <SearchIcon />
            </IconButton>
            <Divider className={classes.searchButtonDivider} orientation="vertical" />
            <ClearButton
              tooltip={searchInfoTooltip}
              withTooltip={!searchInput && !hasFilterValues}
              onClear={() => {
                setState({ ...defaultState, filterValues: { ...defaultFilterValues } });
                performSearch();
              }}
            />
          </Box>
        </Grid>
        {tooltip && (
          <Grid item align="right" style={{ flexGrow: 1 }}>
            <UserTooltip
              action="click"
              icon={<InfoIcon />}
              title={tooltip}
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
}

function ClearButton(props) {
  const {
    tooltip,
    withTooltip,
    onClear,
  } = props;

  const classes = useStyles();

  if (withTooltip && tooltip) {
    return (
      <UserTooltip
        action="click"
        icon={<SearchInfoIcon />}
        iconButtonProps={{ color: 'default', size: 'small' }}
        title={tooltip}
      />
    );
  }

  return (
    <IconButton
      className={classes.searchButtonIconButton}
      onClick={onClear}
    >
      <ClearIcon />
    </IconButton>
  );
}

SearchAndFilter.propTypes = {
  tooltip: PropTypes.node,
  searchInfoTooltip: PropTypes.node,
  filters: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
};

SearchAndFilter.defaultProps = {
  filters: [],
  onChange: () => {},
};

export default SearchAndFilter;
