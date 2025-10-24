import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  Button,
  Fade,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  ArrowDropDown as DropDownIcon,
} from '@material-ui/icons';

import {
  frequencyPeriods,
  getFrequencyPeriod,
} from '../../constants/frequencyPeriods';

const useStyles = makeStyles((theme) => ({
  button: {
    padding: theme.spacing(1),
    textTransform: 'inherit',
    background: 'inherit',
    boxShadow: 'none',

    '&:hover': {
      background: 'inherit',
      boxShadow: 'none',
    },
    '& .MuiButton-label': {
      justifyContent: 'space-between',
      textTransform: 'inherit',
    },
    '&:focus, :hover': {
      backgroundColor: 'inherit',
    },
  },
  frequencyInput: {
    display: 'flex',
    flexDirection: 'column',

    '& .CustomFrequencyOption-inputs': {
      '& > *': {
        display: 'inline-block',
        marginRight: theme.spacing(1),

        '&:last-child': {
          marginRight: 0,
        },
      },
      '& .MuiSelect-select:focus': {
        backgroundColor: 'inherit',
      },
      '& .MuiButtonBase-root': {
        minWidth: 'inherit',
        textTransform: 'lowercase',
      },
    },
  },
  activeMenuItem: {
    backgroundColor: theme.palette.action.selected,
  },
  inputFrequencyCount: {
    maxWidth: theme.spacing(4),
  },
  sentencize: {
    '&:first-letter': {
      textTransform: 'capitalize',
    },
  },
}));

function FrequencyPeriodInput(props) {
  const {
    disableYearsOptions,
    inputProps,
    value,
  } = props;

  const classes = useStyles();
  const { t } = useTranslation('translations');
  const options = frequencyPeriods(t);

  const [frequencyValue, setFrequencyValue] = useState(value);
  const parsedValue = getFrequencyPeriod(frequencyValue, { count: 2 }, t);
  let customFrequencyOptionVal;
  if (frequencyValue && !options.some((o) => o.value === frequencyValue)) {
    customFrequencyOptionVal = parsedValue;
  }

  const [buttonAnchorEl, setButtonAnchorEl] = useState(null);
  const handleMenuOpen = useCallback((e) => {
    setButtonAnchorEl(e.currentTarget);
  }, [setButtonAnchorEl]);
  const handleMenuClose = useCallback(() => {
    setButtonAnchorEl(null);
  }, [setButtonAnchorEl]);
  const handleMenuItemClick = useCallback((e) => {
    setFrequencyValue(e.currentTarget.dataset.value);
    setButtonAnchorEl(null);
  }, [setButtonAnchorEl, setFrequencyValue]);
  const handleCustomOptionChange = useCallback((v) => {
    setFrequencyValue(v);
    setButtonAnchorEl(null);
  }, [setButtonAnchorEl, setFrequencyValue]);

  return (
    <React.Fragment>
      <Button
        fullWidth
        variant="contained"
        endIcon={<DropDownIcon />}
        className={classes.button}
        onClick={handleMenuOpen}
      >
        <Typography className={classes.sentencize} align="left">
          {parsedValue.label}
        </Typography>
      </Button>
      <input type="hidden" {...inputProps} value={parsedValue.value} />
      <Menu
        anchorEl={buttonAnchorEl}
        keepMounted
        open={Boolean(buttonAnchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        {options.map((o) => {
          return (
            <MenuItem
              key={o.value}
              data-value={o.value}
              onClick={handleMenuItemClick}
              className={clsx({ [classes.activeMenuItem]: o.value === frequencyValue })}
            >
              <ListItemText className={classes.sentencize}>{o.label}</ListItemText>
            </MenuItem>
          );
        })}
        <CustomFrequencyOption
          value={customFrequencyOptionVal}
          onChange={handleCustomOptionChange}
          className={clsx({ [classes.activeMenuItem]: customFrequencyOptionVal?.value === frequencyValue })}
          disableYearsOptions={disableYearsOptions}
        />
      </Menu>
    </React.Fragment>
  );
}

function CustomFrequencyOption(props) {
  const {
    value,
    onChange,
    className,
    disableYearsOptions,
  } = props;
  const classes = useStyles();

  const { t } = useTranslation('translations');
  const [state, setState] = useState({ count: value.count, period: value.key });
  const { count, period } = state;
  const changeHandler = useCallback((e) => {
    setState({ count, period, [e.target.name]: e.target.value });
  }, [count, period]);
  const submitHandler = useCallback(() => {
    onChange(`${count}-${period}`);
  }, [count, period, onChange]);

  const options = frequencyPeriods(t, { short: true, disableYearsOptions });
  return (
    <MenuItem
      className={clsx(classes.frequencyInput, className)}
      value="custom"
    >
      <div className="CustomFrequencyOption-inputs">
        <Typography component="p" className={classes.sentencize}>
          {t('frequencyPeriods.every')}
        </Typography>
        <TextField
          type="number"
          inputProps={{ min: 2 }}
          name="count"
          className={classes.inputFrequencyCount}
          value={count}
          onChange={changeHandler}
        />
        <Select
          native
          name="period"
          value={period}
          onChange={changeHandler}
        >
          <option value="" />
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          disabled={!count || !period}
          onClick={submitHandler}
        >
          {t('navigation.ok')}
        </Button>
      </div>
    </MenuItem>
  );
}

CustomFrequencyOption.propTypes = {
  value: PropTypes.shape({
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    key: PropTypes.string,
  }).isRequired,
};

CustomFrequencyOption.defaultProps = {
  value: { count: '', key: '' },
};

export default FrequencyPeriodInput;
