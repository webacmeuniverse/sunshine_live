import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {  useTheme } from '@material-ui/core/styles';
import Dropzone from 'react-dropzone';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input1 from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import {
  Avatar,
  Grid,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Gavel as LegalFormIcon,
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon
} from '@material-ui/icons';

import { allowedMimeTypes } from '../../../utils/mimeTypes';
import { isResidentsCommunity } from '../../../constants/legalStatusTypes';
import IconWidget from '../../../containers/smartcomponents/IconWidget/IconWidget';
import Input from '../../utils/Input';
import { shouldInvalidateOrg } from '../../../utils/can';
import styles from './styles';
import { servicesLabels } from '../../../constants/countries';

const useStyles = makeStyles(styles);
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

function OrganizationDetailsForm(props) {
  const {
    ID,
    legal_form,
    registered,
    website,
    telephone,
    vat,
    email,
	  short_summary,
    services_provided,
    logoURL,
    registration_number,
    handleSetData,
    fieldErrors,
    organization,
    address,
    name, // eslint-disable-line no-shadow
    files,
    user,
  } = props;

  const { t } = useTranslation('translations');
  const classes = useStyles();
  const [selected, setSelected] =  React.useState(options);
  const isAllSelected = options.length > 0 && selected.length === options.length;
  const shouldRenderLegalFields = !isResidentsCommunity(legal_form);
  const shouldRenderUploads = ID && shouldInvalidateOrg(
    organization,
    { orgName: name, vat, address, registration_number, legal_form },
    user,
  );
  const theme = useTheme();
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
  
  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(selected.length === options.length ? [] : options);
      //props.organizationTypeChange( options);
      return;
    }

   
    setSelected(value);
  };

  return (
    <IconWidget
      className={classes.formWidget}
      icon={<LegalFormIcon color="primary" />}
      title={
        <Typography variant="subtitle1">
          {t('organizations.information')}
        </Typography>
      }
    >
      <Grid
        container
        spacing={3}
      >
        {shouldRenderUploads && (
          <Grid item xs={12}>
            <Typography align="center" color="error" variant="h6">
              {t('organizations.changedFields')}
            </Typography>
          </Grid>
        )}
        {shouldRenderLegalFields && (
          <Grid item xs={12} sm={6}>
            <Input
              label={t('organizations.registrationDateLegal')}
              type="date"
              required
              value={registered}
              onChange={e => handleSetData({ registered: e.target.value })}
              fullWidth
              inputProps={{ max: new Date().toLocaleDateString('en-ca') }}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <ListItem component="div" ContainerComponent="div" className={classes.logoUpload}>
            <ListItemAvatar>
              <Avatar variant="square" src={logoURL}>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t('organizations.logo')}
            />
            <ListItemSecondaryAction>
              <FileUpload
                onDropAcceted={fs => handleSetData({
                  logoUpload: fs[0],
                  logoURL: URL.createObjectURL(fs[0]),
                })}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </Grid>
        {shouldRenderLegalFields && (
          <React.Fragment>
            <Grid item xs={12} sm={6}>
              <Input
                label={t('organizations.registrationNumber')}
                required
                value={registration_number}
                onChange={e => handleSetData({ registration_number: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.websiteGridWrapper}>
              <Input
                label={t('organizations.website')}
                required
                value={website.replace(/^http:\/\//, '')}
                errors={fieldErrors.website}
                onChange={e => handleSetData({ website: e.target.value })}
                startAdornment="http://"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                label={t('organizations.phonePlaceholder')}
                value={telephone}
                onChange={e => handleSetData({ telephone: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                label={t('organizations.vatNumber')}
                required
                value={vat}
                onChange={e => handleSetData({ vat: e.target.value })}
                fullWidth
              />
            </Grid>
          </React.Fragment>

        )}
        <Grid item xs={12} sm={6}>
          <Input
            label={t('organizations.email')}
            required
            value={email}
            errors={fieldErrors.email}
            onChange={e => handleSetData({ email: e.target.value })}
            fullWidth
          />
        </Grid>
		<Grid item xs={12} sm={6}>
        {/* <h3 style={{ fontSize: '1rem',fontWeight :'400'}}>{t('organizations.short_summary')}</h3>
        <CKEditor id='short_summary' name="short_summary"  required fullWidth label={t('organizations.short_summary')}
                                                                                editor={ ClassicEditor }
                                                                                data={short_summary}
                                                                                onReady={ editor => {
                                                                                    // You can store the "editor" and use when it is needed.
                                                                                   
                                                                                } }
                                                                                onChange={ ( event, editor ) => {
                                                                                    const data = editor.getData();
                                                                                   
                                                                                } }
                                                                                onBlur={e => handleSetData({ short_summary: e.target.value })}
                                                                                onFocus={ ( event, editor ) => {
                                                                                   
                                                                                } }
                                                                            /> */}
          <Input
            label={t('organizations.short_summary')}
            required
            value={short_summary}
           
            onChange={e => handleSetData({ short_summary: e.target.value })}
           
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        <InputLabel id="demo-simple-select-placeholder-label-label"> Type of Organization</InputLabel>
        <Select style={{ marginTop: '30px',width: '100%' }}
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={selected}
          onChange={handleChange}
          input={<Input1 id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
           <MenuItem
          value="all"
          classes={{
            root: isAllSelected ? classes.selectedAll : ""
          }}
        >
        
          <ListItemText
            
            primary="Select All"
          />
        </MenuItem>
        {servicesLabels.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, selected, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
        {/* <Input
          label={t('organizations.servicesProvided')}
          required
          value={servicesLabels.indexOf(props.services_provided).toString()}
          onChange={e => handleSetData({ services_provided: servicesLabels[e.target.value] })}
          multiple={true}
          options={servicesLabels.map((c, i) => ({ value: i, label: c }))}
          fullWidth
        /> */}
      </Grid>
        {shouldRenderUploads && (
          <Grid item xs={12} sm={6}>
            <VerificationUploads
              files={files}
              handleSetData={handleSetData}
            />
          </Grid>
        )}
		
		
      </Grid>
    </IconWidget>
  );
}

function FileUpload(props) {
  const {
    onDropAcceted,
    className,
  } = props;

  return (
    <Dropzone
      accept={allowedMimeTypes}
      onDrop={(acceptedFiles) => onDropAcceted(acceptedFiles)}
    >
      {({ getRootProps, getInputProps }) => {
        return (
          <div {...getRootProps()} tabIndex="none" className={className}>
            <input {...getInputProps()} />
            <IconButton>
              <UploadIcon />
            </IconButton>
          </div>
        );
      }}
    </Dropzone>
  );
}

function VerificationUploads(props) {
  const {
    files,
    handleSetData,
  } = props;

  const { t } = useTranslation('translations');
  const classes = useStyles();

  return (
    <ListItem component="div" ContainerComponent="div" className={classes.logoUpload}>
      <ListItemAvatar>
        <Avatar variant="square">
          <FileIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          files.length > 0 ?
            files.map(f => f.name + '; ') :
            t('navigation.documents')
        }
      />
      <ListItemSecondaryAction>
        <FileUpload
          onDropAcceted={fs => handleSetData({
            files: fs
          })}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default connect(
  state => ({
    organization: state.organization.publicOrgData.data,
    user: state.user
  })
)(OrganizationDetailsForm);
