import React from 'react';
import { connect } from 'react-redux';

import { useTranslation } from 'react-i18next';
import {
  Divider,
  Grid,
  makeStyles,
} from '@material-ui/core';
import {
  InfoOutlined as InfoIcon,
} from '@material-ui/icons';

import { assetTypeTitleKey } from './../../../constants/assetTypes';

import UserTooltip from '../../utils/UserTooltip';

import { canViewAssetPrivateInfo } from '../../../utils/can';
import styles from './styles';

const useStyles = makeStyles(styles);

function PublicAssetInfo(props) {
  const {
    singleAsset,
    user,
  } = props;
  const { t } = useTranslation('translations');
  const classes = useStyles();

  return (
    <div className={classes.pubAssetInfoContainer}>
      <Grid container spacing={2}>
        {canViewAssetPrivateInfo(user, singleAsset) && (
          <Grid item lg={4} md={6} xs={12} container dirrection="column">
            <InfoBox
              label={t('translations:assets.cadastreNumber')}
              info={singleAsset.data?.cadastre || 'N/A'}
              addStyle={{ fontSize: 16 }}
            />
          </Grid>
        )}
        <Grid item lg={4} md={6} xs={12} container dirrection="column">
          <InfoBox
            label={t('translations:assets.assetType')}
            info={t(`translations:assets.${assetTypeTitleKey(singleAsset.data)}`)}
          />
        </Grid>
        <Grid item lg={4} md={6} xs={12} container dirrection="column">
          <InfoBox
            label={t('translations:assets.numberOfFlats')}
            info={singleAsset.data ? singleAsset.data.flats : ''}
          />
        </Grid>
        <Grid item lg={4} md={6} xs={12} container dirrection="column">
          <InfoBox
            label={t('translations:assets.totalArea')}
            info={singleAsset.data ? `${singleAsset.data.area} \u33A1` : ''}
            tooltip={t('tooltips:assets.assetInformation.totalArea')}
          />
        </Grid>
        <Grid item lg={4} md={6} xs={12} container dirrection="column">
          <InfoBox
            label={t('translations:assets.heatedArea')}
            info={singleAsset.data ? `${singleAsset.data.heated_area} \u33A1` : ''}
            tooltip={t('tooltips:assets.assetInformation.heatedArea')}
          />
        </Grid>
        <Grid item lg={4} md={6} xs={12} container dirrection="column">
          <InfoBox
            label={t('translations:assets.billingArea')}
            info={singleAsset.data ? `${singleAsset.data.billing_area} \u33A1` : ''}
            tooltip={t('tooltips:assets.assetInformation.billingArea')}
          />
        </Grid>
        <Grid item lg={4} md={6} xs={12} container dirrection="column">
          <InfoBox
            label={t('translations:assets.commonPartsArea')}
            info={singleAsset.data ? `${singleAsset.data.common_parts_area} \u33A1` : ''}
          />
        </Grid>
        <Grid item lg={4} md={6} xs={12} container dirrection="column">
          <InfoBox
            label={t('translations:assets.numberOfFloors')}
            info={singleAsset.data ? singleAsset.data.floors : ''}
          />
        </Grid>
        <Grid item lg={4} md={6} xs={12} container dirrection="column">
          <InfoBox
            label={t('translations:assets.numberOfStaircases')}
            info={singleAsset.data ? singleAsset.data.stair_cases : ''}
          />
        </Grid>
      </Grid>
    </div>
  );
}

function InfoBox(props) {
  const {
    label,
    info,
    addStyle,
    tooltip,
  } = props;
  const classes = useStyles();

  return (
    <div className={classes.pubAssetInfoBoxElement}>
      <div className={classes.pubAssetBoxLabelContainer}>
        <p className={classes.pubAssetBoxLabel}>
          {label}
          {tooltip && (
            <UserTooltip
              title={tooltip}
              icon={<InfoIcon />}
              iconButtonProps={{ size: 'small', color: 'primary' }}
              placement="bottom-end"
            />
          )}
        </p>
      </div>
      <Divider />
      <div className={classes.pubAssetBoxText} style={{ ...addStyle }}>
        <span>{info}</span>
      </div>
    </div>
  );
}

export default connect(
  state => ({
    user: state.user,
  })
)(PublicAssetInfo);
