import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Hidden,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@material-ui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import { getMyOrganizations as getMyOrganizationsAction } from '../../actions/organizations';
import { getMyProjects as getMyProjectsAction } from '../../actions/projects';
import { isResidentsCommunity } from '../../constants/legalStatusTypes';
import PrivacyPolicyDialog from '../utils/PrivacyPolicyDialog';
import GDPRDialog from '../utils/GDPR/GDPRDialog';
import CountryRolesDialog from '../utils/CountryRolesDialog/CountryRolesDialog';
import PopUp from '../utils/PopUp';
import Input from '../utils/Input';
import { access as hasAccess } from '../../utils/can';
import logoIMG from '../../images/Sunshine-Logo-Platform.png';
import logoBannerIMG from '../../images/SUNShiNE_Black.png';
import finEERGoDomIMG from '../../images/Logo-FinEERGoDom-H-300x54.png';
import europe from '../../images/flags/europe.svg';
import MeetingRegister from '../organization/OrganizationMeetings/OrganizationMeetingsRegister/MeetingRegister';
import styles from './styles';
import Logo_europa_White from '../../images/3SUNShiNE_Black.svg';

import {
  Home as HomeIcon,
  BusinessCenter as OrganizationIcon,
  Business as AssetIcon,
  Equalizer as ProjectIcon,
  Security as AdminIcon,
  TableChart as TableChartIcon,
  Menu as MenuIcon,

} from '@material-ui/icons';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import DescriptionIcon from '@material-ui/icons/Description';
import { MenuValue } from "./MenuValue";
import { MobileMenuValue } from "./MobileMenuValue";

const useStyles = makeStyles(styles);


function MobileNavigationDrawer(props) {
  const {
    user,
    organization,
    project,
    getMyOrganizations,
    getMyProjects,
  } = props;
  const { myOrganizationsNumber } = organization;
  const { myProjectsNumber } = project;
  const userID = user?.profileInfo?._id;
  const classes = useStyles();
  const { t } = useTranslation('translations');
  const [meetingDialogType, setMeetingDialogType] = useState(null);
  const [meetingTypeValue, setMeetingTypeValue] = useState(null);
  const [countryAdminDialogOpen, setCountryAdminDialogOpen] = useState(false);
  const toggleCountryAdminDialog = () => setCountryAdminDialogOpen(!countryAdminDialogOpen);
  useEffect(() => {
    if (!userID) {
      return;
    }
    if (myOrganizationsNumber === null) {
      getMyOrganizations(userID, true);
    }
    if (myProjectsNumber === null) {
      getMyProjects(userID, true);
    }
  }, [myOrganizationsNumber, getMyOrganizations, userID, myProjectsNumber, getMyProjects]);

  const [open, setOpen] = useState(false); // eslint-disable-line no-shadow

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);


  return (
    <React.Fragment>
        <div className="mobile-menu md:hidden">
            <div className="mobile-menu-bar">
                <a href="#" className="flex mr-auto">
                    <img alt="sunshine" className="w-30" style={{ width: '60px' }} src={Logo_europa_White} />
                </a>
                <a href="javascript:;"
                onClick={() => {
                  if (open === true) {
                    handleClose()
                  }else{
                    handleOpen()

                  }                                   
                }}
                
                 id="mobile-menu-toggler"><MenuIcon /> </a>
            </div>
            <ul className={`border-t border-theme-24  ${open ? '' : 'hidden'}`}>
                <MobileMenuValue user={user} hasAccess={hasAccess} t={t}/>
            </ul>
        </div>
    </React.Fragment>
  );
}

function CreateMeetingMenu(props) {
  const { onClick } = props;

  const classes = useStyles();
  const { t } = useTranslation('translations');
  const [open, setOpen] = useState(false); // eslint-disable-line no-shadow

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <SpeedDial 
      ariaLabel="Create meeting menu"
      className={classes.createMeetingDial}
      icon={<React.Fragment ><span style={{ fontFamily: "Open Sans",fontWeight:'bold' }}>{t('navigation.createMeeting')}</span></React.Fragment>}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction="up"
      sx={{ position: 'absolute', bottom: 16, right: 16 }}
    >
      <SpeedDialAction
        icon={
          <span className="SpeedDialAction">
            <OrganizationIcon style={{marginLeft: '6px'}} />
            <span style={{ textTransform: 'capitalize',fontFamily: "Open Sans",fontWeight:'bold'}}>{t('notifications.single.organization')}</span>
          </span>
        }
        tooltipTitle={t('meetings.createOrganizationMeeting')}
        onClick={() => {
          onClick('organization');
          handleClose();
        }}
      />
      <SpeedDialAction
        icon={
          <span className="SpeedDialAction">
            <ProjectIcon style={{marginLeft: '6px'}}/>
            <span style={{ textTransform: 'capitalize',fontFamily: "Open Sans",fontWeight:'bold'}}>{t('notifications.single.project')}</span>
          </span>
        }
        tooltipTitle={t('meetings.createProjectMeeting')}
        onClick={() => {
          onClick('project');
          handleClose();
        }}
      />
    </SpeedDial>
  );
}
function MeetingTypeDialog(props) {
  const {
    type,
    open, // eslint-disable-line no-shadow
    organizations,
    projects,
    onChange,
    onClose,
  } = props;

  const { t } = useTranslation('translations');

  const [selectedResult, setSelectedResult] = useState(null);

  if (!projects || !organizations || !type) {
    return null;
  }

  let entities = [];
  let inputLabelKey = '';
  let dialogTitleKey = '';
  switch (type) {
    case 'organization':
      entities = organizations;
      inputLabelKey = 'utils.searchAndSelectOrganization';
      dialogTitleKey = 'organizations.nameOfOrganization';
      break;
    case 'project':
      entities = projects;
      inputLabelKey = 'utils.searchAndSelectProject';
      dialogTitleKey = 'transitionRequests.projectName';
      break;
    default:
      return null;
  }

  const handleClose = () => { setSelectedResult(null); onClose(); };
  const handleChange = () => { setSelectedResult(null); onChange(selectedResult); };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {t(dialogTitleKey)}
      </DialogTitle>
      <DialogContent>
        <Input
          label={t(inputLabelKey)}
          value={selectedResult?.[type].id}
          search
          options={entities.map(o => ({ value: o._id, label: o.data.name }))}
          onChange={(params) => {
            if (type === 'organization') {
              setSelectedResult({ organization: { id: params.value, name: params.label } });
              return;
            }
            if (type === 'project') {
              const p = entities.find(e => e._id === params.value);
              setSelectedResult({
                project: { id: params.value, name: params.label },
                organization: { id: p?.data.owner._id, name: p?.data.owner.data.name },
              });
              return;
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="inherit"
          onClick={handleClose}
        >
          {t('utils.confirmDialogCancel')}
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={!selectedResult}
          onClick={handleChange}
        >
          {t('navigation.ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

MobileNavigationDrawer.propTypes = {

};

MobileNavigationDrawer.defualtProps = {

};

export default connect(
  state => ({
    user: state.user,
    organization: state.organization,
    project: state.project,
  }),
  dispatch => ({
    getMyOrganizations: (userID, isMine, offset = 0, limit = null) => dispatch(getMyOrganizationsAction(userID, isMine, offset, limit)),
    getMyProjects: (userID, isMine, offset = 0, limit = null) => dispatch(getMyProjectsAction(userID, isMine, offset, limit)),
  })
)(withTranslation('translations')(MobileNavigationDrawer) );
