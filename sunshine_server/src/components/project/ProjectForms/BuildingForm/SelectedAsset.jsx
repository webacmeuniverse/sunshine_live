import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Grid,
} from '@material-ui/core';

import useFetching from '../../../../utils/useFetching';
import { getSingleAsset as getSingleAssetAction } from '../../../../actions/assets';
import Loader from '../../../utils/Loader';
import AssetCard from '../../../asset/AssetCard/AssetCard';

function SelectedAsset(props) {
  const {
    assetUUID,
    onChangeSelectedAssetView,
    asset,
  } = props;

  const { t } = useTranslation('translations');

  const getAssetFetcher = useCallback(() => {
    return getSingleAssetAction(assetUUID);
  }, [assetUUID]);
  useFetching(getAssetFetcher);

  if (asset.isFetchingSingle) {
    return <Loader />;
  }

  return (
    <Grid container justify="center" spacing={2}>
      <Grid item md={4} sm={6} xs={12}>
        <AssetCard
          selectable
          selected
          onChange={noopFn}
          data={asset.singleAsset}
          claimResidencyButton={false}
          actionButton={
            <Button
              onClick={onChangeSelectedAssetView}
              key="changeAsset"
              color="primary"
              variant="outlined"
              fullWidth
            >
              {t('navigation.change')}
            </Button>
          }
        />
      </Grid>
    </Grid>
  );
}

const noopFn = () => {};

SelectedAsset.propTypes = {
  assetUUID: PropTypes.string.isRequired,
  onChangeSelectedAssetView: PropTypes.func.isRequired,
  asset: PropTypes.shape({
    isFetchingSingle: PropTypes.bool.isRequired,
    singleAsset: PropTypes.object,
  }).isRequired,
};

SelectedAsset.defaultProps = {
  assetUUID: '',
  onChangeSelectedAssetView: noopFn,
};

export default connect(
  (state) => ({
    asset: state.asset,
  }),
)(SelectedAsset);
