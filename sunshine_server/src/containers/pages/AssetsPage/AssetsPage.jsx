import React, { useCallback, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
  Grid,
  makeStyles,
} from '@material-ui/core';

import { countries } from '../../../constants/countries';
import { assetTypeOptions } from './../../../constants/assetTypes';
import { countriesMap } from '../../../constants/countries';
import {
  getAllAssets as getAllAssetsAction,
  getMyAssets as getMyAssetsAction,
} from '../../../actions/assets';
import { parseQuery } from '../../../utils/url';
import useFetching from '../../../utils/useFetching';
import NavContainer from '../../smartcomponents/navcontainer';
import SearchAndFilter from '../../smartcomponents/SearchAndFilter';
import MarkdownText from '../../../components/utils/MarkdownText';
import SeparatorMenu from '../../../components/utils/SeparatorMenu';
import UserTooltip from '../../../components/utils/UserTooltip';
import Pagination from '../../../components/utils/Pagination/Pagination';
import AssetEditor from '../../../components/asset/AssetEditor/AssetEditor';
import RegisterAssetCard from '../../../components/asset/AssetCard/RegisterAssetCard';
import AssetCard from '../../../components/asset/AssetCard/AssetCard';
import SnackbarNotification from '../../smartcomponents/SnackbarNotification';
import { retrieveOrganizationRoles } from '../../../utils/userRoles';

import Loader from '../../../components/utils/Loader';

const useStyles = makeStyles({
  gridRoot: {
    marginLeft: 30,
    marginTop: 30,
  },
});

const tabs = [
  {
    labelKey: 'translations:assets.myAssets',
    hash: '#private',
    perPage: 11,
    withCreateButton: true,
    getNodes: (state) => {
      if (state.myAssets?.length > 0) {
        return { nodes: state.myAssets, count: parseInt(state.myAssetsNumber, 10) || 0 };
      }
      return { nodes: [], count: 0 };
    },
  },
  {
    labelKey: 'translations:assets.allAssets',
    hash: '#all',
    perPage: 12,
    getNodes: (state) => {
      if (state.allAssets?.length > 0) {
        return { nodes: state.allAssets, count: parseInt(state.allAssetsNumber, 10) || 0 };
      }
      return { nodes: [], count: 0 };
    },
  },
];

function AssetsPage(props) {
  const {
    user,
    asset,
    alerts,
  } = props;
  const userID = user.profileInfo?._id;

  const classes = useStyles();
  const { t } = useTranslation('translations');
  const dispatch = useDispatch();
  const { hash } = useLocation();

  const [state, setState] = useState({
    page: parseQuery(window.location.search).page || 1,
    activeTabIDX: hash === '#all' ? 1 : 0,
  });
  const { page, activeTabIDX } = state;

  const onTabChange = useCallback((idx) => {
    window.location.hash = tabs[idx].hash;
    setState({ activeTabIDX: idx, page: 1 });
  }, [setState]);
  const onPageChange = useCallback((p) => {
    setState({ activeTabIDX, page: p });
  }, [setState, activeTabIDX]);
  const { nodes: activeNodes, count } = tabs[activeTabIDX].getNodes(asset);
  const perPage = tabs[activeTabIDX].perPage;
  const offset = (page - 1) * perPage;

  const userAssetsFetcher = useCallback((params) => {
    if (!userID) {
      return null;
    }
    return getMyAssetsAction(userID, { ...params, offset, limit: perPage });
  }, [userID, offset, perPage]);
  const allAssetsFetcher = useCallback((params) => {
    return getAllAssetsAction({ ...params, offset, limit: perPage });
  }, [offset, perPage]);

  useFetching(allAssetsFetcher);
  useFetching(userAssetsFetcher);

  const fetchFn = useCallback(() => {
    if (activeTabIDX > 0) {
      return allAssetsFetcher;
    }
    return userAssetsFetcher;
  }, [activeTabIDX, userAssetsFetcher, allAssetsFetcher]);

  const onFilterChange = useCallback((params) => {
    if (params?.country) {
      params.country = encodeURIComponent(countriesMap[params.country]);
    }
    dispatch(fetchFn(params));
  }, [dispatch, fetchFn]);

  const loading = asset.isFetchingList;

  return (
    <React.Fragment>
      {alerts && alerts.map((msg, index) => (
        <SnackbarNotification open alert={msg} key={index} />
      ))}
      <Helmet title="Energy Service Companies | SUNShINEx" />
      <NavContainer />
      <SearchAndFilter
        onChange={onFilterChange}
        filters={[
          { label: t('assets.country'), name: 'country', options: countries },
          { label: t('assets.assetType'), name: 'building_type', options: assetTypeOptions },
        ]}
        tooltip={<MarkdownText text={t('tooltips:assets.info', { returnObjects: true })} />}
        searchInfoTooltip={
          <MarkdownText text={t('tooltips:assets.publicSearchHint', { returnObjects: true })} gutterBottom={false} />
        }
        searchPlaceholder={t('utils.searchAssetAddress')}
      />
      <SeparatorMenu
        items={tabs.map(({ labelKey }) => t(labelKey))}
        active={activeTabIDX}
        onChange={onTabChange}
      />
      <div className={classes.gridRoot}>
        <AssetsGrid
          loading={loading}
          nodes={activeNodes}
          withCreateButton={tabs[activeTabIDX].withCreateButton && userID}
          page={page}
          perPage={tabs[activeTabIDX].perPage}
          count={count}
          onChangePage={onPageChange}
          userID={userID}
        />
      </div>
    </React.Fragment>
  );
}

function AssetsGrid(props) {
  const {
    loading,
    nodes,
    withCreateButton,
    page,
    perPage,
    count,
    onChangePage,
    userID
  } = props;

  const { t } = useTranslation('translations');
  const [editorOpen, setEditorOpen] = useState(false);
  const toggleEditorOpen = useCallback(() => {
    setEditorOpen(!editorOpen);
  }, [editorOpen, setEditorOpen]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container item xs={12} spacing={4}>
      {withCreateButton && (
        <Grid item lg={3} sm={4} xs={12}>
          <AssetEditor
            open={editorOpen}
            handleClose={toggleEditorOpen}
            title={t('assets.registerAsset')}
          />
          <UserTooltip
            html
            title={<MarkdownText text={t('tooltips:assets.register', { returnObjects: true })} />}
            placement="right-start"
          >
            <RegisterAssetCard
              onClick={toggleEditorOpen}
            />
          </UserTooltip>
        </Grid>
      )}
      {nodes.map((node) => {
        const isResident =
          retrieveOrganizationRoles(userID, node.data.owner)[0] !== 'unsigned' ||
          retrieveOrganizationRoles(userID, node.data.esco)[0] !== 'unsigned';

        return (
          <Grid item lg={3} sm={4} xs={12} key={node._id}>
            <AssetCard data={node} claimResidencyButton={!isResident} />
          </Grid>
        );
      })}
      {count > perPage && (
        <Grid item xs={12} align="center">
          <Pagination
            activePage={page}
            itemsCountPerPage={perPage}
            totalItemsCount={count}
            onChange={onChangePage}
          />
        </Grid>
      )}
    </Grid>
  );
}

export default connect(
  (state) => ({
    alerts: state.alerts.pending,
    user: state.user,
    asset: state.asset,
  }),
)(AssetsPage);
