import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  CircularProgress,
} from '@material-ui/core';
import {
  Error as ErrorIcon,
} from '@material-ui/icons';

import useFetching from '../../../utils/useFetching';
import parseJSON from '../../../utils/parseJSON';
import Pagination from '../../utils/Pagination/Pagination';
import TextWithIcon from '../../utils/TextWithIcon';
import {
  getApprovedAssets as getApprovedAssetsAction,
  getMyAssets as getMyAssetsAction,
  getAllAssets as getAllAssetsAction,
} from '../../../actions/assets';
import AssetCard from '../AssetCard/AssetCard';

function AssetsGrid(props) {
  const {
    user,
    assets,
    userAssets,
    approvedUserAssets,
    filterParams,
    claimResidencyButton,
    selectable,
    value,
    itemsPerPage,
    onChange,
    requestingOrgUUID,
    requestOnly,
  } = props;

  const [activePage, setActivePage] = useState(0);
  const { t } = useTranslation('translations');
  const userID = user.isAuthenticated;

  const offset = activePage * itemsPerPage;

  const filterParamsSTR = JSON.stringify(filterParams);

  const allAssetsFetcher = useCallback(() => {
    const paginationParams = { offset, limit: itemsPerPage };
    const fp = parseJSON(filterParamsSTR);

    return getAllAssetsAction({ ...fp, ...paginationParams, status: 2 });
  }, [itemsPerPage, filterParamsSTR, offset]);
  const userAssetsFetcher = useCallback(() => {
    const paginationParams = { offset, limit: itemsPerPage };
    const fp = parseJSON(filterParamsSTR);

    return getMyAssetsAction(userID, { ...fp, ...paginationParams, status: 2 });
  }, [userID, itemsPerPage, filterParamsSTR, offset]);
  const approvedAssetsFetcher = useCallback(() => {
    return getApprovedAssetsAction(userID);
  }, [userID]);

  let entities = assets.allAssets;
  let totalCount = assets.allAssetsNumber;
  let fetchFn = allAssetsFetcher;
  if (userAssets) {
    entities = assets.myAssets;
    totalCount = assets.myAssetsNumber;
    fetchFn = userAssetsFetcher;
  }
  if (approvedUserAssets) {
    entities = assets.approvedAssets;
    totalCount = assets.approvedAssetsNumber;
    fetchFn = approvedAssetsFetcher;
  }
  useFetching(fetchFn);

  if (!entities || assets.isFetchingList) {
    return (
      <Grid container justify="center">
        <Grid item><CircularProgress /></Grid>
      </Grid>
    );
  }

  if (totalCount === 0) {
    return (
      <TextWithIcon
        icon={<ErrorIcon color="disabled" />}
        variant="h6"
        gutterBottom
      >
        {t('assets.noResultsFound')}
      </TextWithIcon>
    );
  }

  return (
    <Grid container spacing={4}>
      {entities.map(asset => (
        <Grid item xl={3} lg={4} sm={6} xs={12} key={asset._id}>
          <AssetCard
            data={asset}
            claimResidencyButton={claimResidencyButton}
            selectable={selectable}
            requestingOrgUUID={requestingOrgUUID}
            selected={value === asset._id}
            onChange={onChange}
            requestOnly={requestOnly}
          />
        </Grid>
      ))}
      {totalCount > itemsPerPage && (
        <Grid item xs={12} align="center">
          <Pagination
            activePage={activePage + 1}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={totalCount}
            onChange={p => setActivePage(p - 1)}
          />
        </Grid>
      )}
    </Grid>
  );
}

AssetsGrid.propTypes = {
  userAssets: PropTypes.bool.isRequired,
  approvedUserAssets: PropTypes.bool.isRequired,
  filterParams: PropTypes.shape({
    owner: PropTypes.string,
  }),
  itemsPerPage: PropTypes.number.isRequired,
  claimResidencyButton: PropTypes.bool.isRequired,
  selectable: PropTypes.bool.isRequired,
  requestingOrgUUID: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

AssetsGrid.defaultProps = {
  userAssets: false,
  approvedUserAssets: false,
  claimResidencyButton: true,
  selectable: false,
  filterParams: {},
  itemsPerPage: 12,
};

export default connect(
  state => ({
    user: state.user,
    assets: state.asset,
  }),
)(AssetsGrid);
