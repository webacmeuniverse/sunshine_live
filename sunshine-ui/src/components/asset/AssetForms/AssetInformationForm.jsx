import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Dropzone from 'react-dropzone';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
  makeStyles,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar
} from '@material-ui/core';
import {
  Info as InfoIcon,
  InfoOutlined as InfoOutlinedIcon,
  CloudUpload as UploadIcon,
} from '@material-ui/icons';
import { allowedMimeTypes } from '../../../utils/mimeTypes';
import IconWidget from '../../../containers/smartcomponents/IconWidget/IconWidget';
import Input from '../../utils/Input';
import MarkdownText from '../../utils/MarkdownText';
import { heatingTypesMap } from '../../../constants/assetTypes';
import { isResidentsCommunity } from '../../../constants/legalStatusTypes';
import styles from './styles';
import UserTooltip from '../../utils/UserTooltip';
import { getMyOrganizations as getMyOrganizationsAction } from '../../../actions/organizations';

const useStyles = makeStyles(styles);

const fieldsGrid = [
  [
    { label: 'assets.cadastreNumber', key: 'cadastre', type: 'text', placeholder: '9832625', required: true, tooltip: 'tooltips:assets.assetFields.cadastre' }, // eslint-disable-line max-len
    { label: 'assets.ownerOfAsset', key: 'owner', required: true, options: 'myOrganizations', tooltip: 'tooltips:assets.assetFields.owner' }, // eslint-disable-line max-len
  ],
  [
    { label: 'assets.regTotalArea', key: 'area', placeholder: '0000.00', required: true, endAdornment: '㎡', tooltip: 'tooltips:assets.assetFields.totalArea' }, // eslint-disable-line max-len
    { label: 'assets.commonPartsArea', key: 'common_parts_area', placeholder: '0000.00', endAdornment: '㎡' },
    { label: 'assets.billingArea', key: 'billing_area', placeholder: '0000.00', endAdornment: '㎡', tooltip: 'tooltips:assets.assetFields.billingArea' }, // eslint-disable-line max-len
    { label: 'assets.heatedArea', key: 'heated_area', placeholder: '0000.00', endAdornment: '㎡', tooltip: 'tooltips:assets.assetFields.heatedArea' }, // eslint-disable-line max-len
  ],
  [
    { label: 'assets.numberOfFlats', key: 'flats', placeholder: '000' },
    { label: 'assets.numberOfFloors', key: 'floors', placeholder: '000' },
    { label: 'assets.numberOfStaircases', key: 'stair_cases', required: true, placeholder: '000' },
  ],
];


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
function AssetInformationForm(props) {
  const { handleSetData, getMyOrganizations, userID ,logoURL} = props;

  const { t } = useTranslation('translations');
  const classes = useStyles();

  useEffect(() => {
    getMyOrganizations(userID, true);
  }, [getMyOrganizations, userID]);

  return (
    <IconWidget
      className={classes.formWidget}
      icon={<InfoIcon color="primary" />}
      title={
        <Typography variant="subtitle1">
          {t('assets.information')}
        </Typography>
      }
    >
      <Grid
        container
        direction="column"
        spacing={2}
      >
        {fieldsGrid.map((row, i) => (
          <Grid item xs={12} key={i}>
            <Grid container direction="row" spacing={2}>
              {row.map((f) => {
                let options = null;
                if (f.options && Array.isArray(props[f.options])) {
                  options = props[f.options].map(o => ({ value: o._id, label: o.data.name }));
                }

                return (
                  <Grid item key={f.key} align="stretch" sm={12 / row.length} xs={12}>
                    <Input
                      type={f.type || 'number'}
                      options={options}
                      value={props[f.key] || ''}
                      label={t(f.label)}
                      placeholder={f.placeholder}
                      required={Boolean(f.required)}
                      endAdornment={f.endAdornment || null}
                      tooltip={f.tooltip && <MarkdownText text={t(f.tooltip, { returnObjects: true })} />}
                      onChange={e => handleSetData({ [f.key]: f.search ? e.value : e.target.value })}
                      search={f.search}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        ))}

<Grid item xs={12} sm={6}>
          <ListItem component="div" ContainerComponent="div" className={classes.logoUpload}>
            <ListItemAvatar>
              <Avatar variant="square" src={logoURL}>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t('organizations.logo1')}
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
        <Grid item xs={12}>
          <FormControl
            required
            component="fieldset"
            className={classes.formControl}
            fullWidth
          >
            <FormLabel component="legend">
              {t('assets.typeOfHeating')}
            </FormLabel>
            <RadioGroup
              value={String(props.heating_type)}
              onChange={(e => handleSetData({ heating_type: e.target.value }))}
            >
              {heatingTypesMap.map(({ id, title, tooltip }) => (
                <FormControlLabel
                  key={id}
                  value={id}
                  control={<Radio />}
                  className={classes.radioLabel}
                  label={
                    <React.Fragment>
                      {t(title)}
                      {tooltip && (
                        <UserTooltip
                          title={t(tooltip)}
                          icon={<InfoOutlinedIcon />}
                          placement="top-start"
                        />
                      )}
                    </React.Fragment>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </IconWidget>
  );
}

AssetInformationForm.propTypes = {
  handleSetData: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    myOrganizations: state.organization.myOrganizations.filter(o => !isResidentsCommunity(o.data.legal_form) && o.data.valid === 2),
    residentsCommunities: state.organization.allOrganizations.filter(o => isResidentsCommunity(o.data.legal_form)),
    userID: state.user.profileInfo._id
  }),
  dispatch => ({
    getMyOrganizations: (userID, isMine, offset = 0, limit = null) => dispatch(getMyOrganizationsAction(userID, isMine, { offset, limit }))
  })
)(AssetInformationForm);
