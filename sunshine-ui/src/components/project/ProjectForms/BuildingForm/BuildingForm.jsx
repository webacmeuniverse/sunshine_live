import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  Grid,
  Tabs,
  Tab,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Apartment as ApartmentIcon,
} from '@material-ui/icons';

import IconWidget from '../../../../containers/smartcomponents/IconWidget/IconWidget';
import AssetsGrid from '../../../asset/AssetsGrid/AssetsGrid';
import { parseAddress } from '../../../asset/utils';
import { assetTypeTitleKey } from '../../../../constants/assetTypes';
import SelectedAsset from './SelectedAsset';

const useStyles = makeStyles({
  tabsContent: {
    position: 'relative',
  },
});

function BuildingForm(props) {
  const {
    assetUUID,
    ownerUUID,
    handleSetData,
  } = props;

  const { t } = useTranslation('translations');
  const [showSelectedAsset, setShowSelectedAsset] = useState(Boolean(assetUUID));
  const cancelSelectedAssetView = useCallback(() => {
    setShowSelectedAsset(false);
    handleSetData({ assetUUID: '', name: '' });
  }, [setShowSelectedAsset, handleSetData]);
  const [activeTab, setActiveTab] = useState(0);

  const handleSetAsset = (a) => {
    let projectName = '';
    let uuid = '';
    if (a) {
      const prefix = moment().format('YYYY-MM');
      projectName = `${prefix} ${parseAddress(a.address, { short: true })}, ${t(`assets.${assetTypeTitleKey(a)}`)}`;
      uuid = a.ID;
    }
    handleSetData({
      assetUUID: uuid,
      name: projectName,
    });
  };

  return (
    <IconWidget
      icon={<ApartmentIcon color="primary" />}
      title={
        <Typography variant="subtitle1">
          {t('projects.building')}
        </Typography>
      }
    >
      <FormComponent
        assetUUID={assetUUID}
        ownerUUID={ownerUUID}
        showSelectedAsset={showSelectedAsset}
        onChangeSelectedAssetView={cancelSelectedAssetView}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleSetData={handleSetData}
        handleSetAsset={handleSetAsset}
      />
    </IconWidget>
  );
}

function FormComponent(props) {
  const {
    assetUUID,
    ownerUUID,
    showSelectedAsset,
    onChangeSelectedAssetView,
    activeTab,
    setActiveTab,
    handleSetData,
    handleSetAsset,
  } = props;

  const { t } = useTranslation('translations');
  const classes = useStyles();

  if (showSelectedAsset && assetUUID) {
    return (
      <SelectedAsset
        assetUUID={assetUUID}
        onChangeSelectedAssetView={onChangeSelectedAssetView}
      />
    );
  }

  return (
    <Grid
      container
      spacing={2}
    >
      <Grid item sm={2}>
        <Tabs
          orientation="vertical"
          value={activeTab}
          onChange={(_, idx) => setActiveTab(idx) || handleSetData({ assetUUID: '', name: '' })}
        >
          <Tab label={t('assets.ownerOrgAssets')} />
          <Tab label={t('assets.otherOrgAssets')} />
        </Tabs>
      </Grid>
      <Grid item sm={10} className={classes.tabsContent}>
        {activeTab === 0 && (
          <AssetsGrid
            filterParams={{ owner: ownerUUID }}
            claimResidencyButton={false}
            selectable
            value={assetUUID}
            onChange={handleSetAsset}
          />
        )}
        {activeTab === 1 && (
          <AssetsGrid
            filterParams={{ owner: ownerUUID }}
            claimResidencyButton={false}
            selectable
            value={assetUUID}
            onChange={handleSetAsset}
            approvedUserAssets
          />
        )}
      </Grid>
    </Grid>
  );
}

export default BuildingForm;
