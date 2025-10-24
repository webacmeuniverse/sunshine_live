import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';
import { useParams, withRouter, Link } from 'react-router-dom';
import { Map as LeafletMap, Marker, TileLayer } from 'react-leaflet';
import {
  Grid,
  IconButton,
  Paper,
  makeStyles,
  Typography,
  Avatar,
} from '@material-ui/core';
import {
  Create as CreateIcon,
} from '@material-ui/icons';

import { VALIDATE_ASSET } from '../../../actions/assetsMutations';
import {
  getSingleAsset as getAssetAction,
  getSingleAssetEnergyCertificate as getAssetEnergyCertificateAction,
} from '../../../actions/assets';
import { addAlert } from '../../../actions/alerts';
import {
  approveEntity as canApproveAset,
  canEditEntity as canEditAsset,
  canUploadFiles,
  canDeleteFiles,
} from '../../../utils/can';
import UploadFile from '../../../containers/smartcomponents/UploadFile/UploadFile';
import Tooltip from '../../utils/TooltipWrapper';
import Loader from '../../utils/ProgressBar';
import StatusBadge from '../../utils/StatusBadge';
import ValidationStatusMenu from '../../utils/ValidationStatusMenu';
import Widget from '../../utils/Widget';
import OrganizationListItem from '../../organization/OrganizationListItem/OrganizaionListItem';
import AssetEditor from '../AssetEditor/AssetEditor';
import PublicAssetInfo from '../PublicAssetInfo/PublicAssetInfo';
import EntitiesList from '../../utils/EntitiesList';
import OrganizationLogo from '../../organization/OrganizationLogo';
import { parseAddress } from '../utils';
import styles from './styles';
import ENDPOINTS from '../../../constants/endpoints';
import { assetTypeImage, assetTypeTitleKey } from '../../../constants/assetTypes';
import {
  red,
  blue,
  green,
  orange,
} from '@material-ui/core/colors';
const useStyles = makeStyles(styles);

function AssetPublicView  (props) {
  const {
    asset,
    user,
    getAsset,
    getAssetEnergyCertificate,
    energyCertificate
  } = props;

  const classes = useStyles();
  const { t } = useTranslation('translations');
  const params = useParams();

  const assetID = params.id;
  const userID = user.isAuthenticated;

  const performGetAsset = useCallback(() => {
    getAssetEnergyCertificate(assetID, userID);
    getAsset(assetID, userID);
  }, [getAsset, getAssetEnergyCertificate, assetID, userID]);

  useEffect(() => {
    performGetAsset();
  }, [performGetAsset]);
  const refetch = () => getAsset(assetID, userID);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
 
  const handleEditAsset = () => {
    ReactGA.event({
      category: 'Super user / Lear',
      action: 'Asset',
      label: 'Open dialog for editing',
    });

    setEditDialogOpen(true);
  };

  if (asset.isFetchingSingle) {
    return <Loader />;
  }

  if (!asset?.data) {
    return null;
  }

 
  const assetTitle = parseAddress(asset.data.address || '');
  const coordinates = [asset.data.coordinates.lat, asset.data.coordinates.lng];
  const menu_path = window.location.pathname.split('/')[2];
  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid container direction="column" alignItems="stretch" item sm={7} xs={12} spacing={2}>
          <Grid item>
            <Grid container component={Paper}>
              <Grid item xs={12} className={classes.cardHeader}>
                <div className={classes.validationStatus}>
                  <StatusBadge validationStatus={asset.data.valid} />
                  {canApproveAset(user, asset) && (
                    <ValidationStatusMenu
                      entity={asset}
                      validateMutation={VALIDATE_ASSET}
                      mutationVariables={{ assetID: asset._id }}
                      refetch={refetch}
                      onError={() => addAlert(t('errors.internal'), 'error')}
                    />
                  )}
                </div>
                {canEditAsset(user, asset) && (
                  <Tooltip title={t('assets.editAsset')}>
                    <IconButton
                      onClick={() => handleEditAsset()}
                    >
                      <CreateIcon color="action" />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
              {/* <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.card}
        component={Paper} style={{ overflowWrap: 'break-word' }}
        style={{boxShadow: 'none'}}
      >
              <Grid item sm={12} xs={4} className={classes.logoWrapper}>
              <OrganizationLogo
                cover
                organization={asset.data}
              />
            </Grid>
            </Grid>   */}
              <Grid item xs={12} align="center">
                <Typography variant="h5" gutterBottom>{assetTitle}</Typography>
              </Grid>

              <Grid container item xs={12}>
                <div className={classes.mapContainer}>
                  <LeafletMap
                    center={coordinates}
                    zoom={18}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                      position={coordinates}
                    />
                  </LeafletMap>
                </div>
              </Grid>
            </Grid>
          </Grid>
          {asset.data.valid === 2 && (

            <Grid item>
              <Grid container item component={Paper}>

                <Grid item lg={8} md={8} xs={12} container dirrection="column" style={{ padding: '12px' }} aria-disabled="true">

                  <Typography variant="h5" gutterBottom style={{ fontSize: '15px', marginTop: '15px', fontWeight: '700', color: '#323030ad' }}>Energy Class:   </Typography>
                  <Typography aria-describedby="">

                    
                    <Avatar aria-describedby="" style={{ backgroundColor: '#fdcf00', width: '55px', height: '35px', marginTop: '6px', marginLeft: '4px' }}
                      variant="rounded"
                    >
                      {Object.keys(energyCertificate).length !== 0 ?energyCertificate.data.energy_class:''}
                    </Avatar>
                  </Typography>
                  <Typography variant="h5" gutterBottom style={{ fontSize: '15px', marginTop: '15px', marginLeft: '5px', color: '#323030ad' }}>
                    &nbsp;
                    {Object.keys(energyCertificate).length !== 0 ?energyCertificate.data.consumption:0}
                    &nbsp;

                    kWh/m<sup>2</sup> </Typography>
                </Grid>

                <Grid item lg={4} md={4} xs={12} container dirrection="column" align="left" style={{ marginTop: '15px', color: '#323030ad', padding: '12px' }}>
                  {user.isSuperUser === true && (
                    <Link to={`/asset/admin_energy_certificate/${asset._id}`}> Go to energy certificate</Link>

                  )}
                  {user.isSuperUser === false && (
                    <Link to={`/asset/energy_certificate/${asset._id}`}> Go to energy certificate</Link>

                  )}





                </Grid>
              </Grid>
            </Grid>
          )}
          {/* Asset uploads */}
          <Grid item>
            <Grid container direction="column" alignItems="center" component={Paper}>
              <UploadFile
                entity={{
                  id: asset._id,
                  attachments: Object.values(asset._attachments || {}),
                  type: 'asset',
                }}
                alertText={t('documents.unsupportedFileType')}
                canUpload={canUploadFiles(user, asset)}
                canDelete={canDeleteFiles(user, asset)}
                onSuccess={refetch}
              />
            </Grid>
          </Grid>

        </Grid>
        <Grid container direction="column" alignItems="stretch" item sm={5} xs={12} spacing={2}>
          <Grid item>
            <Widget title='Asset Logo' withDivider>

              <img src={asset.data.logo ? ENDPOINTS.SERVER + asset.data.logo : assetTypeImage(asset.data)} style={{ height: '250px', width: '100%' }}></img>

            </Widget>
          </Grid>

          <Grid item>
            <Widget title={t('assets.ownerOfAsset')} withDivider>
              <OrganizationListItem organization={asset.data.owner} />
            </Widget>
          </Grid>
          <Grid item>
            <Widget title={t('assets.communityOrganization')} withDivider>
              <OrganizationListItem
                organization={asset.data.esco}
                errorMessage={t('assets.noCommunityOrganization')}
              />
            </Widget>
          </Grid>
          <Grid item>
            <EntitiesList
              entities={asset.data.Projects || []}
              label={t('navigation.projects')}
              type="project"
              zeroEntriesMessage={t('utils.noProjectsInAsset')}
            />
          </Grid>
          <Grid item>
            <Grid container item component={Paper}>
              <Widget title={t('assets.assetInfo')} withDivider>
                <PublicAssetInfo singleAsset={asset} />
              </Widget>
            </Grid>
          </Grid>
        </Grid>

      </Grid>

      {editDialogOpen && (
        <AssetEditor
          title={t('assets.editAsset')}
          open
          data={asset.data}
          handleClose={() => setEditDialogOpen(false)}
        />
      )}
    </div>
  );
}

export default connect(
  state => ({
    user: state.user,
    asset: state.asset.singleAsset,
    energyCertificate: state.asset.singleAssetEnergyCertificate,
  }),
  dispatch => ({
    showError: (err) => dispatch(addAlert({ text: err.message, level: 'error' })),
    getAsset: (assetID, userID) => dispatch(getAssetAction(assetID, userID)),
    getAssetEnergyCertificate: (assetID, userID) => dispatch(getAssetEnergyCertificateAction(assetID, userID)),

  })
)(AssetPublicView);
