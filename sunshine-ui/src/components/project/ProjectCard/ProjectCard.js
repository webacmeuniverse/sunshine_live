import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import {
  Create as ContentCreate,
  InfoOutlined as InfoIcon
} from '@material-ui/icons';

import { canViewPublicProjects } from '../../../utils/can';
import airIcon from './../../../images/svgIcons/plant.svg';
import thermometer from './../../../images/svgIcons/thermometer.svg';
import wrench from './../../../images/svgIcons/wrench.svg';
import energy from '../../../images/svgIcons/energy.svg';
import co2 from '../../../images/svgIcons/co2.svg';


import { assetTypeImage } from '../../../constants/assetTypes';
import { parseAddress } from '../../asset/utils';
import TooltipWrapper from '../../utils/TooltipWrapper';
import UserTooltip from '../../utils/UserTooltip';
import ProjectEditor from '../ProjectEditor/ProjectEditor';
import ProjectPhaseRibbon from '../ProjectPhaseRibbon';
import styles from './styles';

import { isPayoutUnlocked, getNextMay, isTechnicalCompleted } from '../../../utils/payoutUtils';

const useStyles = makeStyles(styles);

// eslint-disable-next-line complexity
function ProjectCard(props) {
  const {
    overview, data, singleProjectReady, singleAsset, singleOrganization,
    toggleEditProjectDialog, isProjectDialogOpen,
    loggedUserRole, userIsSuperUser, projectClientName, typeOfView, user,
    forfaitingApplication
  } = props;

  const assetIMG = overview ? assetTypeImage(data.dependencies[data.data.asset].data) : assetTypeImage(data.data.asset.data); // eslint-disable-line max-len

  const { t } = useTranslation('translations');
  const classes = useStyles();

  const technicalClosingDate = data.data.MonitoringPhase.CreatedAt;
  const hasPermitionToEnter = typeOfView === 'private' || canViewPublicProjects(user, data);
  const guaranteedMetrics = {
    airtemp: data.data?.airtemp > 0 ? `${data.data.airtemp} °C` : '-',
    watertemp: data.data?.watertemp > 0 ? `${data.data.watertemp} °C` : '-',
    savings: data.data?.savings > 0 ? `${data.data.savings}%` : '-',
    co2Savings: data.data?.energy_savings > 0 ? `${data.data.energy_savings * 0.254} tonnes CO₂e` : '-',
  };
console.log(data.data);
  const CardLink = hasPermitionToEnter ? Link : 'div';

  return (
    <div>
      {overview
        ? <div className="box">
          <Card className={`box ${classes.prjCardBaseOverview}`} classes={{ root: classes.root }}>
            <div className="image">
              <img
                className={classes.objectFitFillPrivate}
                src={assetIMG}
                alt={data.data.name}
              />
            </div>
            <ProjectPhaseRibbon project={data.data} />
            {loggedUserRole === 'pm' || userIsSuperUser === true
              ? <IconButton
                className={classes.addingButtonStyle}
                onClick={toggleEditProjectDialog}
              >
                <ContentCreate />
              </IconButton>
              : null
            }
            <div className={`row ${classes.infoContainer}`} style={{ marginRight: '0px',marginLeft: '0px' }}>
              <div className={`col-xs-6 col-sm-4 col-md-4 ${classes.rowContnent}`}>
                <div className={`row ${classes.title}`} style={{ marginRight: '0px',marginLeft: '0px' }}>
                  {singleProjectReady ? data.data.name : ''}
                </div>
                <div className={`row ${classes.subTitle}`} style={{ marginRight: '0px',marginLeft: '0px' }}>
                  {t('translations:projects.name')}
                </div>
              </div>
              <div className={`col-xs-6 col-sm-4 col-md-4 ${classes.rowContnent}`}>
                <Link to={`/organization/${singleOrganization._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                  <div className={`row ${classes.title}`} style={{ marginRight: '0px',marginLeft: '0px' }}>
                    {singleProjectReady ? singleOrganization.data.name : ''}
                  </div>
                </Link>
                <div className={`row ${classes.subTitle}`} style={{ marginRight: '0px',marginLeft: '0px' }}>
                  {t('translations:projects.projectOwner')}
                </div>
              </div>
              <div className={`col-xs-6 col-sm-2 col-md-2 ${classes.rowContnent}`}>
                <div className={`row ${classes.title}`} style={{ marginRight: '0px',marginLeft: '0px' }}>
                  {singleProjectReady ? data.data.contract_term : ''} {t('translations:projects.years')}
                </div>
                <div className={`row ${classes.subTitle}`} style={{ marginRight: '0px',marginLeft: '0px' }}>
                  {t('translations:projects.contractTerms')}
                </div>
              </div>
              <div className={`col-xs-6 col-sm-2 col-md-2 ${classes.rowContnent}`}>
                <div className={`row ${classes.title}`} style={{ marginRight: '0px',marginLeft: '0px' }}>
                  {singleProjectReady ? data.data.first_year : ''}
                </div>
                <div className={`row ${classes.subTitle}`} style={{ marginRight: '0px',marginLeft: '0px' }}>
                  {t('translations:projects.firstYearOfContract')}
                </div>
              </div>
            </div>
            <Divider />
            <div className="row" style={{ padding: 10,marginRight: '0px',marginLeft: '0px' }} >
              <div className={`col-xs-12 col-sm-4 ${classes.rowContnent}`}>
                <div className={`row ${classes.title}`} style={{ marginRight: '0px',marginLeft: '0px' }}>
                  {singleProjectReady ? projectClientName : ''}
                </div>
                <div className={`row ${classes.subTitle}`} style={{ marginRight: '0px',marginLeft: '0px' }}>
                  {t('translations:projects.projectClient')}
                </div>
              </div>
              <div className={`col-xs-12 col-sm-8 ${classes.rowContnent}`}>
                <Link to={`/asset/${singleAsset._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                  <div className={`row ${classes.title}`}>
                    {singleProjectReady ? parseAddress(singleAsset.data.address) : ''}
                  </div>
                </Link>
                <div className={`row ${classes.subTitle}`}>
                  {t('translations:projects.building')}
                </div>
              </div>
            </div>
            <Divider />
            <div className="box boxes-container" style={{ padding: '0 15px' }}>
              <Typography className={classes.metricTitle} component="div">
                {t('translations:projects.guaranteedMetricsUnderContractTerms')}
                <UserTooltip
                  icon={<InfoIcon />}
                  title={t('tooltips:projects.guaranteedMetrics')}
                  action="click"
                />
              </Typography>
              <div className="row center-xs">
                <div className={`col-xs-6 col-sm-4 col-md-4 col-lg-4 ${classes.noPaddingNoMargin}`}>
                  <div className={classes.projectCardInfoBoxElement} style={{ border: '2px solid #2096F3' }}>
                    <InfoBox classes={classes} boxBackgroundColor="#2096F3" label={t('translations:projects.indoorAirTemperature')}
                      info={guaranteedMetrics.airtemp} icon={airIcon} />
                  </div>
                </div>
                <div className={`col-xs-6 col-sm-4 col-md-4 col-lg-4 ${classes.noPaddingNoMargin}`}>
                  <div className={classes.projectCardInfoBoxElement} style={{ border: '2px solid #d65b4a' }}>
                    <InfoBox classes={classes} boxBackgroundColor="#d65b4a" label={t('translations:projects.domesticWaterTemp')}
                      info={guaranteedMetrics.watertemp} icon={thermometer} />
                  </div>
                </div>
                <div className={`col-xs-6 col-sm-4 col-md-4 col-lg-4 ${classes.noPaddingNoMargin}`}>
                  <div className={classes.projectCardInfoBoxElement} style={{ border: '2px solid #8DC63E' }}>
                    <InfoBox classes={classes} boxBackgroundColor="#8DC63E" label={t('translations:projects.energySavings')} icon={energy}
                      info={guaranteedMetrics.savings} />
                  </div>
                </div>               
              </div>
            </div>            
            <Divider />            
            <div className="box boxes-container" style={{ padding: '0 15px' }}>
              <div class="container" style={{marginTop: '8px' }}>
                <div className="row justify-content-md-center" >
                  <div className={`col-xs-6 col-sm-4 col-md-4 col-lg-4 ${classes.noPaddingNoMargin}`}>
                      <div className={classes.projectCardInfoBoxElement} style={{ border: '2px solid #FEC24B' }}>
                        <InfoBox classes={classes} boxBackgroundColor="#FEC24B" label={t('translations:projects.constructionPeriod')} icon={wrench}
                          info={singleProjectReady ? moment(data.data.construction_from).format('DD.MM.YYYY') + ' ' + moment(data.data.construction_to).format('DD.MM.YYYY') : 'N/A'} />
                      </div>
                    </div>
                    <div className={`col-xs-6 col-sm-4 col-md-4 col-lg-4 ${classes.noPaddingNoMargin}`}>
                      <div className={classes.projectCardInfoBoxElement} style={{ border: '2px solid #36454F' }}>
                        <InfoBox classes={classes} boxBackgroundColor="#36454F" style={{ marginTop: '1px' }} label={t('translations:projects.co2Savings')} icon={co2}
                          info={guaranteedMetrics.co2Savings} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </Card>
          <ProjectEditor
            open={isProjectDialogOpen}
            handleClose={toggleEditProjectDialog}
            title={t('projects.editProject')}
            data={
              {
                ...data.data,
                consortium_organizations: data.data.consortium_organizations?.map(v => {
                  for (const dep in data.dependencies) {
                    if (dep === v) {
                      return { value: v, label: data.dependencies[dep].data.name };
                    }
                  }
                  return null;
                })
              }
            }
          />
        </div>
        : <TooltipWrapper title={data.data.name}>
          <Card classes={{ root: classes.root }}>
            <CardLink to={`/project/${data._id}`} style={{ textDecoration: 'none' }}>
              <CardContent className={classes.cardContentName}>
                {data.data.name}
              </CardContent>
              <div className="image">
                <img className={classes.objectFitFill} src={assetIMG} alt={data.data.name} />
              </div>
              <ProjectPhaseRibbon project={data.data} />
              <div className={classes.prjListTitles}>
                <div className="row between-xs">
                  <CardContent className={classes.cardContentTitle}>
                    {t('translations:projects.client')}
                  </CardContent>
                  <CardContent className={classes.cardContentText}>
                    {data.data.asset.data? data.data.asset.data.owner.data.name:'-'}
                  </CardContent>
                </div>
                <Divider />
                <div className="row between-xs">
                    <div className={`col-xs-4 col-sm-4 col-md-4 col-lg-4 ${classes.noPaddingNoMargin}`}>
                      <CardContent className={classes.cardContentTitle} style={{ width: '100%' }}>
                        {t('translations:projects.building')}
                      </CardContent>
                    </div>
                    <div className={`col-xs-8 col-sm-8 col-md-8 col-lg-8 ${classes.noPaddingNoMargin}`}>
                      <CardContent className={classes.cardContentText} style={{ width: '90%' }}>
                     
                        {parseAddress(data.data.asset.data? data.data.asset.data.address:'')}
                      </CardContent>
                    </div>
                
                 
                </div>
              </div>
            </CardLink>
          </Card>
        </TooltipWrapper>
      }
    </div>
  );
}

const InfoBox = ({ label, info, boxBackgroundColor, classes, icon }) => (
  <div>
    <div style={{ backgroundColor: boxBackgroundColor }} className={classes.prjCardBoxLabel}>
      {info}
    </div>
    <center><img alt="Register Asset" src={icon} width="30px" height="30px" /> </center>
    <div className={`center-xs ${classes.prjCardBoxText}`} style={{ textAlign: 'center' }}>
      {label}
    </div>
  </div>
);

export default connect(
  state => ({
    user: state.user,
  }),
)(ProjectCard);
