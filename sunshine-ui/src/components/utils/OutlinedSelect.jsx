import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormHelperText,
  Select,
  OutlinedInput,
  makeStyles,
} from '@material-ui/core';

import OutlinedInputLabel from '../utils/OutlinedInputLabel';

const useStyles = makeStyles({
  'SunshineOutlinedSelect-small': {
    '& .MuiSelect-select': {
      padding: '10px 26px 10px 12px',
    },
  },
  'SunshineOutlinedSelect-default': {},
});

function OutlinedSelect(props) {
  const {
    label,
    tooltip,
    value,
    required,
    disableNotched,
    options,
    helperText,
    onChange,
    startAdornment,
    endAdornment,
    inputProps,
    size,
    disabled,
  } = props;

  const classes = useStyles();

  const [labelWidth, setLabelWidth] = React.useState(0);

  return (
    <FormControl
      variant="outlined"
      fullWidth
      required={required}
    >
      {label && (
        <OutlinedInputLabel
          shrink={disableNotched ? undefined : true}
          tooltip={tooltip}
          setLabelWidth={setLabelWidth}
        >
          {label}
        </OutlinedInputLabel>
      )}
      <Select
        native
        labelWidth={labelWidth}
        value={value}
        onChange={onChange}
        inputProps={inputProps}
        disabled={disabled}
        className={classes[`SunshineOutlinedSelect-${size}`]}
        input={
          <OutlinedInput
            notched={disableNotched ? undefined : true}
            labelWidth={labelWidth}
            startAdornment={startAdornment}
            endAdornment={endAdornment}
          />
        }
      >
        <option value="" />
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

OutlinedSelect.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  options: PropTypes.array,
  helperText: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  disableNotched: PropTypes.bool.isRequired,
  size: PropTypes.oneOf(['small', 'default']).isRequired,
};

OutlinedSelect.defaultProps = {
  required: true,
  disableNotched: false,
  size: 'default',
};

export default OutlinedSelect;
