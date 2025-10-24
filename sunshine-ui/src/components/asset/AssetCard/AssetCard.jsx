import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import {
  Grid,
  Typography,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  CardHeader,
  Button,
  makeStyles,
} from '@material-ui/core';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Telegram as RequestProjectCreateIcon,
  HelpOutline as HelpIcon,
} from '@material-ui/icons';

import { assetTypeImage, assetTypeTitleKey } from '../../../constants/assetTypes';
import { canViewAssetPrivateInfo } from '../../../utils/can';
import { parseAddress } from '../utils';
import apolloClient from '../../../utils/apolloClient';
import { REQUEST_PROJECT_CREATION } from '../../../actions/projectsMutations';
import { addAlert } from '../../../actions/alerts';
import StatusBadge from '../../utils/StatusBadge';
import Tooltip from '../../utils/TooltipWrapper';
import ClaimResidencyButton from '../ClaimResidencyButton';
import styles from './styles';
import ENDPOINTS from '../../../constants/endpoints';
const useStyles = makeStyles(styles);

function AssetCard(props) {
  const {
    user,
    data: { data },
    selectable,
    selected,
    requestingOrgUUID,
    claimResidencyButton,
    actionButton,
    onChange,
    showAlert,
    requestOnly
  } = props;

  const classes = useStyles();
  const { t } = useTranslation('translations');
  const privateInfoAvailable = canViewAssetPrivateInfo(user, { data });

  const [requestProjectCreation, projectCreationState] = useMutation(REQUEST_PROJECT_CREATION, {
    client: apolloClient,
    variables: { assetID: data.ID, orgID: requestingOrgUUID },
    onError: () => showAlert({ text: t('assets.requestProjectCreationError'), level: 'error' }),
    onCompleted: () => showAlert({ text: t('assets.requestProjectCreationSuccess'), level: 'success' }),
  });

  const cardActionButtons = [];
  if (requestingOrgUUID) {
    cardActionButtons.push(
      <Button
        key="requestProjectCreation"
        className={classes.requestRegistrationButton}
        fullWidth
        variant="contained"
        color="secondary"
        disabled={projectCreationState.loading}
        endIcon={<RequestProjectCreateIcon />}
        onClick={requestProjectCreation}
      >
        <Tooltip title={t('assets.requestProjectCreationInfo')}>
          <HelpIcon className={classes.requestRegistrationInfo} />
        </Tooltip>
        {t('assets.requestProjectCreation')}
      </Button>
    );
  }
  if (claimResidencyButton) {
    cardActionButtons.push(
      <ClaimResidencyButton key="claimAssetResidency" asset={data} />
    );
  }

  if (actionButton) {
    cardActionButtons.push(actionButton);
  }

  const title = parseAddress(data.address);

  const WrapperComponent = (user.profileInfo?._id && !requestOnly && privateInfoAvailable) || selectable ? Link : 'div';

  return (
    <Card className={clsx(classes.root, { selected }, { locked: !privateInfoAvailable && !selectable })}>
      <WrapperComponent
        to={'asset/' + data.ID}
        className={classes.content}
        onClick={(e) => {
          if (selectable) {
            e.preventDefault();
            onChange(selected ? '' : data);
          }
        }}
      >
        <div>
          <CardHeader
            action={
              <HeaderAction
                selectable={selectable}
                validationStatus={data.valid}
                selected={selected}
                user={user}
              />
            }
            title={<Typography variant="subtitle2">{title}</Typography>}
          />
          <CardMedia
            className={classes.media}
            image={data.logo ?ENDPOINTS.SERVER + data.logo : assetTypeImage(data)}
            title={title}
          />
        </div>
        <CardContent>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <Typography color="textSecondary">{t('assets.assetType')}</Typography>
            </Grid>
            <Grid item xs={6} align="right">
              <Typography>{t(`assets.${assetTypeTitleKey(data)}`)}</Typography>
            </Grid>
            {privateInfoAvailable && (
              <React.Fragment>
                <Grid item xs={6}>
                  <Typography color="textSecondary">{t('assets.cadastreNumber')}</Typography>
                </Grid>
                <Grid item xs={6} align="right">
                  <Typography>{data.cadastre}</Typography>
                </Grid>
              </React.Fragment>
            )}
          </Grid>
        </CardContent>
      </WrapperComponent>
      {cardActionButtons.length > 0 && (
        <CardActions>
          {cardActionButtons.map(b => b)}
        </CardActions>
      )}
    </Card>
  );
}

function HeaderAction(props) {
  const {
    selectable,
    selected,
    validationStatus,
    user,
  } = props;

  if (!user?.profileInfo?._id) {
    return null;
  }

  if (selectable) {
    return selected ? <CheckBoxIcon size="large" /> : <CheckBoxOutlineBlankIcon size="large" />;
  }

  return <StatusBadge validationStatus={validationStatus} />;
}

AssetCard.propTypes = {
  selectable: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  requestingOrgUUID: PropTypes.string,
  claimResidencyButton: PropTypes.bool,
  actionButton: PropTypes.element,
  onChange: PropTypes.func,
};

AssetCard.defaultProps = {
  selectable: false,
  selected: false,
  claimResidencyButton: true,
};

export default connect(
  state => ({
    user: state.user
  }),
  dispatch => ({
    showAlert: (params) => dispatch(addAlert(params)),
  }),
)(AssetCard);
