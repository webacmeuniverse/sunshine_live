import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import ListItemIcon from "@material-ui/core/ListItemIcon";
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 520,
    maxWidth: 500,
  },
  formControl1: {
    margin: theme.spacing(1),
    minWidth: 150,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 150
      }
    },
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "center"
    },
    variant: "menu"
  };

const   options = [
    "Energy Audits",
    "Technical Inspections",
    "Project Design",
    "Construction"
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

 function MultipleSelect(props) {

    const classes = useStyles();
    const [selected, setSelected] =  React.useState(options);
    const [organizationValue, setOrganizationValue] =  React.useState(-1);
    const [ossApprovedValue, setOSSApprovedValue] =  React.useState(false);
    const [sortValue, setSortValue] =  React.useState('');
    const theme = useTheme();
    const isAllSelected =
      options.length > 0 && selected.length === options.length;
      
    const handleChange = (event) => {
      const value = event.target.value;
      if (value[value.length - 1] === "all") {
        setSelected(selected.length === options.length ? [] : options);
        props.organizationTypeChange( options);
        return;
      }

      
    props.organizationTypeChange(value);
      setSelected(value);
    };
    const handleChangeTypeOrganization = (event) => {
        setOrganizationValue(event.target.value);

        props.organizationTypeChangeNew(event.target.value);
      };

      const handleChangeOSSApproved = (event) => {
        setOSSApprovedValue(event.target.value);

        props.ossApprovedChangeNew(event.target.value);
      };


      const handleChangeSort = (event) => {
        setSortValue(event.target.value);

        if(event.target.value === 'Near me'){

            props.dataNearMeSort();

        }else{

            props.dataSort();

        }

      };
  return (
    <div>
         <FormControl className={classes.formControl1}>
            <InputLabel id="demo-simple-select-placeholder-label-label">{props.t('landingPage:FindMyPartner.TypeofOrganization')} </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={organizationValue}
                onChange={handleChangeTypeOrganization}
              >
                <MenuItem value={-1}>{props.t('translations:assets.all')}</MenuItem>
                <MenuItem value={9}>{props.t('translations:legalForms.Professional')}</MenuItem>
                <MenuItem value={10}>{props.t('translations:legalForms.Craftsman')}</MenuItem>
                <MenuItem value={11}>{props.t('translations:legalForms.Operator')}</MenuItem>
              </Select>
         </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-chip-label">{props.t('landingPage:FindMyPartner.TypesofServices')} </InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={selected}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
      <MenuItem value="all" classes={{ root: isAllSelected ? classes.selectedAll : ""}}>       
        <ListItemText primary={props.t('translations:legalForms.ALL')}/>
          </MenuItem>
            {options.map((name) => (
              <MenuItem key={name} value={name} style={getStyles(name, selected, theme)}>
               {props.t(`translations:legalForms.${name}`)}  
              </MenuItem>
            ))}
          </Select>
      </FormControl>


      {/* <FormControl className={classes.formControl}>
      <InputLabel id="mutiple-select-label">Types of Services</InputLabel>
      <Select
        labelId="mutiple-select-label"
        multiple
        value={selected}
        onChange={handleChange}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        <MenuItem
          value="all"
          classes={{
            root: isAllSelected ? classes.selectedAll : ""
          }}
        >
          <ListItemIcon>
            <Checkbox
              classes={{ indeterminate: classes.indeterminateColor }}
              checked={isAllSelected}
              indeterminate={
                selected.length > 0 && selected.length < options.length
              }
            />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.selectAllText }}
            primary="Select All"
          />
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <ListItemIcon>
              <Checkbox checked={selected.indexOf(option) > -1} />
            </ListItemIcon>
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl> */}

    <FormControl className={classes.formControl1}>
        <InputLabel id="demo-simple-select-label">{props.t('landingPage:FindMyPartner.OSSApproved')} </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={ossApprovedValue}
          onChange={handleChangeOSSApproved}
        >
            
             <MenuItem value={true}>{props.t('translations:ossPreviewTitle.Yes')}</MenuItem>
             <MenuItem value={false}>{props.t('translations:ossPreviewTitle.No')}</MenuItem>
          
        </Select>
      </FormControl>
     
      
      <FormControl className={classes.formControl1}>
        <InputLabel id="demo-simple-select-label">{props.t('landingPage:FindMyPartner.Sort')} </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sortValue}
          onChange={handleChangeSort}
          label="Sort"
        >
          <MenuItem value="">
            <em></em>
          </MenuItem>
          <MenuItem value={'Near me'}>{props.t('landingPage:FindMyPartner.Nearme')}  </MenuItem>
          <MenuItem value={'Services'}>{props.t('landingPage:FindMyPartner.Services')}</MenuItem>
         
        </Select>
      </FormControl>
     
    </div>
  );
}


export default connect(
    state => ({
      user: state.user,
    }),
  )(MultipleSelect);