import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter, Link } from 'react-router-dom';
import NavContainer from '../../../smartcomponents/ossnavcontainer';
import MobileNavContainer from '../../../smartcomponents/ossMobileNavContainer';
import ProgressBar from '../../../../components/utils/ProgressBar';
import '../../../../styles/ossAdmin/dist/css/app.css';
//import '../../../../styles/custom.css';
import TopBar from '../../../../components/ossnavigation/TopBar';
import PersonIcon from '@material-ui/icons/Person';
import ENDPOINTS from '../../../../constants/endpoints';
import { withTranslation, useTranslation } from 'react-i18next';
import {
  Home as HomeIcon,
  BusinessCenter as OrganizationIcon,
  Business as AssetIcon,
  Equalizer as ProjectIcon,
  Security as AdminIcon,
  TableChart as TableChartIcon,
  Delete as DeleteIcon,
  CalendarTodaySharp as PlusIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


class DashboardPage extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      dashboardDesign: 'OSS',
      dashboardData: '0',
      fetching: true,
      projectCount: '0',
      assetsCount: '0',
      employeesCount: '0',
      residentsCount: '0',
      associationsCount: '0',
      operatorsCount: '0',
      calculatorsCount: '0',
      checklistCount: '0',
      checklistrefCount: '0',
      showModal: false,
      orgListData: [],
      open: false

    }
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleClose = this.handleClose.bind(this);

  }

  //const [open, setOpen] = React.useState(false);

  handleClickOpen = () => {
    this.setState({
      open: true,

    })

  };
  handleClose = () => {
    this.setState({
      open: false,

    })
  };


  handleCloseClick() {
    const { handleModalCloseClick } = this.props;
    $('#exampleModal').modal('hide');

  }

  componentDidMount() {

    this.dashboardDataGet();
    this.userOrganizationsGet();
    if (this.props.user.organizationServices !== null) {

      this.props.user.organizationServices.filter(item => item.services_provided === false || item.short_summary === false).map(function (d, idx) {

        //if(d.services_provided === false || d.short_summary === false){
        ///this.state.showModal = true;

        if (sessionStorage.getItem('alreadyShow') !== 'alredy shown') {
          $('#exampleModal').modal('show');
          sessionStorage.setItem('alreadyShow', 'alredy shown');

        }


      })

      // this.forceUpdate();

    }

    //localStorage.setItem('dashboardPopupSession',(Math.random() + 1).toString(36).substring(2))
    $('#exampleModal').on('hidden.bs.modal', this.handleModalCloseClick);
  }




  changeUserType = event => {


    if (event.target.value === 'OSS') {
      this.state.dashboardDesign = event.target.value;

      this.forceUpdate();
      this.setState({
        fetching: true,

      })

      let config = {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          "oss_admin_id": this.props.userdata.email,

        })
      };

      fetch(ENDPOINTS.SERVER + '/oss/admins', config)
        .then(res => res.json())
        // .then((result) => result.length ? JSON.parse(text) : {})
        .then(
          (result) => {

            if (result != null) {

              this.state.projectCount = result.projects_count;
              this.state.assetsCount = result.assets_count;
              this.state.employeesCount = result.employees_count;
              this.state.residentsCount = result.residents_count;
              this.state.associationsCount = result.associations_count;
              this.state.operatorsCount = result.operators_count;
              this.state.calculatorsCount = result.calculators_count;
              this.state.checklistCount = result.checklist_count;
              this.state.checklistrefCount = result.checklist_ref_count;
              this.forceUpdate();


            }
            this.setState({
              fetching: false,

            })
          },

        ).catch(error => {


        });

    } else {
      this.state.dashboardDesign = 'Organization';
      this.forceUpdate();
      this.setState({
        fetching: true,
      })
      let config = {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          "organization_id": event.target.value
        })
      };

      fetch(ENDPOINTS.SERVER + '/oss/admins', config)
        .then(res => res.json())
        // .then((result) => result.length ? JSON.parse(text) : {})
        .then(
          (result) => {

            if (result != null) {

              this.state.projectCount = result.projects_count;
              this.state.assetsCount = result.assets_count;
              this.state.employeesCount = result.employees_count;
              this.state.residentsCount = result.residents_count;
              this.state.associationsCount = result.associations_count;
              this.state.operatorsCount = result.operators_count;
              this.state.calculatorsCount = result.calculators_count;
              this.state.checklistCount = result.checklist_count;
              this.state.checklistrefCount = result.checklist_ref_count;
              this.forceUpdate();
              this.setState({
                fetching: false,

              })

            }

          },

        ).catch(error => {


        });

    }




  }



  userOrganizationsGet = () => {

    const config = {
      method: 'get',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    };

    fetch(ENDPOINTS.SERVER + `/user/${this.props.userdata.ID}/organizations?offset=0&limit=11`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          this.setState({
            orgListData: result.documents
          })
          //setOrgListData(result.documents);


        },

      ).catch(error => {


      });


  }

  //Step Function Start

  //Step Function Start
  dashboardDataGet = () => {

    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "oss_admin_id": this.props.userdata.email,

      })
    };


    fetch(ENDPOINTS.SERVER + '/oss/admins', config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {

            this.state.projectCount = result.projects_count;
            this.state.assetsCount = result.assets_count;
            this.state.employeesCount = result.employees_count;
            this.state.residentsCount = result.residents_count;
            this.state.associationsCount = result.associations_count;
            this.state.operatorsCount = result.operators_count;
            this.state.calculatorsCount = result.calculators_count;
            this.state.checklistCount = result.checklist_count;
            this.state.checklistrefCount = result.checklist_ref_count;

            this.forceUpdate();

          }
          this.setState({
            fetching: false,

          })
        },

      ).catch(error => {
        this.setState({
          fetching: false,

        })

      });


  }
  render() {


    const { userdata, t, user } = this.props;

    return (
      <React.Fragment>
        <Helmet>
          <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style>
        </Helmet>
        <MobileNavContainer />
        <div className="flex">
          <NavContainer />
          <div className="content oss-admin">
            <TopBar userdata={userdata} pageTitle={t('translations:ossMenu.Dashboard')} />
            <br />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">

                {(() => {
                  if (userdata.is_oss_admin === true) {

                    return <>
                      <div className="row" style={{ marginRight: '0px', marginLeft: '0px' }}>
                        <div className="col-md-12 col-sm-12">
                          <select className="select-country" onChange={(e) => this.changeUserType(e)} name="legal_rep_org" id="location" style={{ width: '100%', background: 'white', marginTop: '10px', color: '#6B7280', fontWeight: '500', fontSize: '11.602px' }} required>
                            <option value="OSS">  OSS Default  </option>
                            {this.state.orgListData.map((user) => (
                              <option value={user.data.ID} key={user.data.ID}>{user.data.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  }


                })()}

                {this.state.fetching
                  ?
                  <ProgressBar />
                  : <>

                    {(() => {
                      if (this.state.dashboardDesign === 'OSS' && userdata.is_oss_admin === true) {

                        return <><div className="row" style={{ marginRight: '0px', marginLeft: '0px' }}>
                          <div className="col-md-4 col-sm-4">
                            <div className="row">
                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                <h2 className="text-1xl font-bold leading-8 text-center mt-6" style={{ fontSize: '17px' }}>
                                  {t('translations:ossDashboardTitle.title1')}
                                </h2>
                              </div>
                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                  <Link to={`/oss/onboarding/records`} className="block font-medium mt-2 text-center truncate">  {t('translations:ossMenu.Resident')} </Link>
                                  <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.residentsCount}</div>
                                </div>
                              </div>
                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                  <Link to={`/oss/onboarding/records`} className="block font-medium mt-2 text-center truncate">{t('translations:ossMenu.HousingAssociation')}</Link>
                                  <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.associationsCount}</div>
                                </div>
                              </div>
                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                  <Link to={`/oss/onboarding/records`} className="block font-medium mt-2 text-center truncate">{t('translations:ossMenu.Operator')}</Link>
                                  <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.operatorsCount}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 col-sm-4">
                            <div className="row">

                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                <h2 className="text-2xl font-bold leading-8 text-center mt-6" style={{ fontSize: '17px' }}>
                                  {t('translations:ossDashboardTitle.title2')}
                                </h2>
                              </div>

                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                  <Link to={`/oss/onboarding/records`} className="block font-medium mt-2 text-center truncate">{t('translations:ossMenu.RenovationCostCalculator')}</Link>
                                  <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.calculatorsCount}</div>
                                </div>
                              </div>

                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                  <Link to={`/oss/onboarding/records`} className="block font-medium mt-2 text-center truncate">{t('translations:ossMenu.EESChecklist')}</Link>
                                  <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.checklistCount}</div>
                                </div>
                              </div>

                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                  <Link to={`/oss/onboarding/records`} className="block font-medium mt-2 text-center truncate">{t('translations:ossMenu.EESRefinanceabilityChecklist')}</Link>
                                  <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.checklistrefCount}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-4">
                            <div className="row">

                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                <h2 className="text-2xl font-bold leading-8 text-center mt-6" style={{ fontSize: '17px' }}>
                                  {t('translations:ossDashboardTitle.title3')}
                                </h2>
                              </div>
                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                <Link to={`/oss/onboarding/residents`}><button className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.7rem 1.75rem' }}>{t('translations:ossMenu.Onboarding')}: {t('translations:ossMenu.Resident')}</button></Link>
                                <Link to={`/oss/onboarding/housing`}><button className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.7rem 1.75rem' }}>{t('translations:ossMenu.Onboarding')}: {t('translations:ossMenu.HousingAssociation')}</button></Link>
                                <Link to={`/oss/onboarding/operator`}><button className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.7rem 1.75rem' }}>{t('translations:ossMenu.Onboarding')}: {t('translations:ossMenu.Operator')}</button></Link>
                                <Link to={`/oss/eesCalculator`}> <button className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.7rem 1.75rem' }}>{t('translations:ossMenu.RenovationCostCalculator')}</button></Link>
                                <Link to={`/oss/ees-checklist`}><button className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.7rem 1.75rem' }}>{t('translations:ossMenu.EESChecklist')}</button></Link>
                                <Link to={`/oss/simulation/refinancability-Checklist`}><button className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.7rem 1.75rem' }}>{t('translations:ossMenu.EESRefinanceabilityChecklist')}</button></Link>
                              </div>
                            </div>
                          </div>
                        </div>

                          <div className="row" style={{ marginRight: '0px', marginLeft: '0px' }}>
                            <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                              <h2 className="text-1xl font-bold leading-8 text-center mt-6" style={{ fontSize: '17px' }}>
                                {t('translations:ossDashboardTitle.title4')}

                              </h2>
                            </div>
                            <div className="col-md-12 col-sm-12">
                              <center>  <Link to={`/oss/onboarding/records`}><button className="button w-50 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem', width: '22%!' }}>{t('translations:ossMenu.Records')}</button></Link></center>
                            </div>
                          </div>

                        </>
                      } else if (this.state.dashboardDesign === 'Organization' && userdata.is_oss_admin === true) {
                        return <><div className="row" style={{ marginRight: '0px', marginLeft: '0px' }}>
                          <div className="col-md-4 col-sm-4">
                            <div className="row">

                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                <h2 className="text-1xl font-bold leading-8 text-center mt-6" style={{ fontSize: '17px' }}>
                                  {t('translations:ossDashboardTitle.title1')}
                                </h2>
                              </div>

                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                  <Link 
                                  
                                  
                                  
                                  className="block font-medium mt-2 text-center truncate">   {t('translations:ossMenu.Projects')}  </Link>
                                  <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.projectCount}</div>
                                </div>
                              </div>

                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                  <Link to={`/assets`} className="block font-medium mt-2 text-center truncate"> {t('translations:ossMenu.Assets')}</Link>
                                  <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.assetsCount}</div>
                                </div>
                              </div>

                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                  <Link to={`/dashboard`} className="block font-medium mt-2 text-center truncate">{t('translations:ossMenu.Employees')}</Link>
                                  <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.employeesCount}</div>
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                <h2 className="text-1xl font-bold leading-8 text-center mt-6" style={{ fontSize: '17px' }}>
                                  {t('translations:ossDashboardTitle.title4')}
                                </h2>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                <center>  <Link to={`/reports`}><button className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem', width: '22%!' }}>{t('translations:ossMenu.ReportingModule')}</button></Link></center>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-8 col-sm-8">

                            <div className="row">

                              <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1" style={{ marginTop: '50px' }}>
                                <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>

                                  <div className="row">
                                    <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                      <h2 className="text-2xl font-bold leading-8 text-center mt-3" style={{ fontSize: '17px' }}>
                                        {t('translations:ossMenu.SimulationTools')}
                                      </h2>
                                    </div>
                                    <div className="col-md-6 col-sm-6 px-3 pt-1 pb-1">
                                      <Link to={`/ees_calculator`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.RenovationCostCalculator')}</button></Link>
                                      <Link to={`#`} onClick={this.handleClickOpen} ><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.OTHERTOOLS')}</button></Link>
                                    </div>
                                    <div className="col-md-6 col-sm-6 px-3 pt-1 pb-1">
                                      <Link to={`/ees-checklist`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.EESChecklist')}</button></Link>
                                      <Link to={`/ees-refinancability-checklist`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.EESRefinanceabilityChecklist')}</button></Link>
                                    </div>
                                  </div>

                                  <div className="row">
                                    <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                      <h2 className="text-2xl font-bold leading-8 text-center mt-4" style={{ fontSize: '17px' }}>
                                        {t('translations:ossDashboardTitle.title3')}
                                      </h2>
                                    </div>
                                    <div className="col-md-6 col-sm-6 px-3 pt-1 pb-1">
                                      <Link to={`/organizations`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.Organization')}</button></Link>
                                      <Link to={`/assets`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.Assets')}</button></Link>
                                    </div>
                                    <div className="col-md-6 col-sm-6 px-3 pt-1 pb-1">
                                      <Link to={`/projects`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.Projects')}</button></Link>
                                      <Link to={`/dashboard`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.Meeting')}</button></Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>


                        </div>
                        </>
                      } else if (userdata.is_oss_admin === false && this.props.userdata.superuser === true) {
                        return <>
                          <div className="row" style={{ marginRight: '0px', marginLeft: '0px' }}>
                            <div className="col-md-4 col-sm-4">
                              <div className="row">

                                <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                  <h2 className="text-1xl font-bold leading-8 text-center mt-6" style={{ fontSize: '17px' }}>
                                    {t('translations:ossDashboardTitle.title1')}
                                  </h2>
                                </div>

                                <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                  <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                    <Link to={`/projects`} className="block font-medium mt-2 text-center truncate">   {t('translations:ossMenu.Projects')}  </Link>
                                    <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.projectCount}</div>
                                  </div>
                                </div>

                                <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                  <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                    <Link to={`/assets`} className="block font-medium mt-2 text-center truncate"> {t('translations:ossMenu.Assets')}</Link>
                                    <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.assetsCount}</div>
                                  </div>
                                </div>

                                <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                  <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                    <Link to={`/dashboard`} className="block font-medium mt-2 text-center truncate">{t('translations:ossMenu.Employees')}</Link>
                                    <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.employeesCount}</div>
                                  </div>
                                </div>
                              </div>


                            </div>

                            <div className="col-md-8 col-sm-8">

                              <div className="row">

                                <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1" style={{ marginTop: '50px' }}>
                                  <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>

                                    <div className="row">
                                      <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                        <h2 className="text-2xl font-bold leading-8 text-center mt-3" style={{ fontSize: '17px' }}>
                                          {t('translations:ossMenu.SimulationTools')}
                                        </h2>
                                      </div>
                                      <div className="col-md-6 col-sm-6 px-3 pt-1 pb-1">
                                        <Link to={`/oss/eesCalculator`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.RenovationCostCalculator')}</button></Link>
                                        <Link to={`#`} onClick={this.handleClickOpen} ><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.OTHERTOOLS')}</button></Link>
                                      </div>
                                      <div className="col-md-6 col-sm-6 px-3 pt-1 pb-1">
                                        <Link to={`/oss/ees-checklist`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.EESChecklist')}</button></Link>
                                        <Link to={`/oss/simulation/refinancability-Checklist`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.EESRefinanceabilityChecklist')}</button></Link>
                                      </div>
                                    </div>

                                    <div className="row">
                                      <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                        <h2 className="text-2xl font-bold leading-8 text-center mt-4" style={{ fontSize: '17px' }}>
                                          {t('translations:ossDashboardTitle.title3')}
                                        </h2>
                                      </div>
                                      <div className="col-md-6 col-sm-6 px-3 pt-1 pb-1">
                                        <Link to={`/organizations`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.Organization')}</button></Link>
                                        <Link to={`/assets`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.Assets')}</button></Link>
                                      </div>
                                      <div className="col-md-6 col-sm-6 px-3 pt-1 pb-1">
                                        <Link to={`/projects`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.Projects')}</button></Link>
                                        <Link to={`/dashboard`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.Meeting')}</button></Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      } else {
                        return <>
                          <div className="row" style={{ marginRight: '0px', marginLeft: '0px' }}>
                            <div className="col-md-4 col-sm-4">
                              <div className="row">

                                <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                  <h2 className="text-1xl font-bold leading-8 text-center mt-6" style={{ fontSize: '17px' }}>
                                    {t('translations:ossDashboardTitle.title1')}
                                  </h2>
                                </div>

                                <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                  <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                    <Link to={`/projects`} className="block font-medium mt-2 text-center truncate">   {t('translations:ossMenu.Projects')}  </Link>
                                    <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.projectCount}</div>
                                  </div>
                                </div>

                                <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                  <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                    <Link to={`/assets`} className="block font-medium mt-2 text-center truncate"> {t('translations:ossMenu.Assets')}</Link>
                                    <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.assetsCount}</div>
                                  </div>
                                </div>

                                <div className="col-md-12 col-sm-12 px-3 pt-1 pb-3">
                                  <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>
                                    <Link to={`/dashboard`} className="block font-medium mt-2 text-center truncate">{t('translations:ossMenu.Employees')}</Link>
                                    <div className="text-3xl font-bold leading-8 text-center mt-3 pb-3">{this.state.employeesCount}</div>
                                  </div>
                                </div>
                              </div>


                            </div>

                            <div className="col-md-8 col-sm-8">

                              <div className="row">

                                <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1" style={{ marginTop: '50px' }}>
                                  <div className="file box rounded-md px-3 pt-1 pb-1 px-3 sm:px-5 relative" style={{ boxShadow: '7px 11px #d7dbdd' }}>

                                    <div className="row">
                                      <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                        <h2 className="text-2xl font-bold leading-8 text-center mt-3" style={{ fontSize: '17px' }}>
                                          {t('translations:ossMenu.SimulationTools')}
                                        </h2>
                                      </div>
                                      <div className="col-md-6 col-sm-6 px-3 pt-1 pb-1">
                                        <Link to={`/ees_calculator`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.RenovationCostCalculator')}</button></Link>
                                        <Link to={`#`} onClick={this.handleClickOpen}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.OTHERTOOLS')}</button></Link>
                                      </div>
                                      <div className="col-md-6 col-sm-6 px-3 pt-1 pb-1">
                                        <Link to={`/ees-checklist`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.EESChecklist')}</button></Link>
                                        <Link to={`/ees-refinancability-checklist`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.EESRefinanceabilityChecklist')}</button></Link>
                                      </div>
                                    </div>

                                    <div className="row">
                                      <div className="col-md-12 col-sm-12 px-3 pt-1 pb-1">
                                        <h2 className="text-2xl font-bold leading-8 text-center mt-4" style={{ fontSize: '17px' }}>
                                          {t('translations:ossDashboardTitle.title3')}
                                        </h2>
                                      </div>
                                      <div className="col-md-6 col-sm-6 px-3 pt-1 pb-1">
                                        <Link to={`/organizations`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.Organization')}</button></Link>
                                        <Link to={`/assets`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.Assets')}</button></Link>
                                      </div>
                                      <div className="col-md-6 col-sm-6 px-3 pt-1 pb-1">
                                        <Link to={`/projects`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.Projects')}</button></Link>
                                        <Link to={`/dashboard`}><button id="dashboardButton" className="button w-100 mr-1 mb-3 bg-theme-12 text-white" style={{ padding: '0.6rem 1.75rem' }}>{t('translations:ossMenu.Meeting')}</button></Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>


                          </div>
                        </>

                      }


                    })()}


                  </>
                }
              </div>
            </div>
          </div>

          <div>

            <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.open}>
              <DialogTitle id="customized-dialog-title" style={{ background: '#FCCB00' }} onClose={this.handleClose}>
                <h3 class='col-12 modal-title text-center' style={{ color: '#fff',fontSize: '1em',fontWeight: '600',fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',fontStyle: 'normal', }}>
                  {t('translations:ossMenu.OTHERTOOLS')}

                </h3>
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  <p className="mb-3" style={{ fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '500', fontSize: '16.0073px', lineHeight: '32px', textAlign: 'center', color: '#4B4B4A' }}>{t('translations:ossMenu.otherToolsTitle')}</p>
                </Typography>
                <Typography gutterBottom>
                  <div className="row mt-5" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <div className="col-md-12 mb-4 ">
                      <Link to="/building-calculator" type="button" style={{ background: '#EAEBED', fontWeight: '600' }} id="otherToolsButton" className="button  w-100 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-2" >{t('translations:ossMenu.BuildingCalculator')}</Link>
                    </div>
                    <div className="col-md-12 mb-4 ">
                      <Link to="/financial-calculator" type="button" style={{ background: '#EAEBED', fontWeight: '600' }} id="otherToolsButton" className="button  w-100 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-2" >{t('translations:ossMenu.CostEstimationCalculator')}</Link>
                    </div>
                    <div className="col-md-12 mb-4 ">
                      <Link to="/national-benchmarking" type="button" style={{ background: '#EAEBED', fontWeight: '600' }} id="otherToolsButton" className="button  w-100 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-2" >{t('translations:ossMenu.NationalBenchmarking')}</Link>
                    </div>
                  </div>
                </Typography>


              </DialogContent>

            </Dialog>

            {/* <div className="modal fade" id="otherTools" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content" style={{ width: '516px', height: '400px' }}>
            <div className="modal-header" style={{ background: '#FCCB00' }}>
              <h3 class='col-12 modal-title text-center' style={{ textTransform: 'uppercase', fontFamily: 'Poppins', fontStyle: 'normal', fontWeight: 'bold', fontSize: '19.1691px', color: '#FFFFFF' }}>
              {t('translations:ossMenu.OTHERTOOLS')}
                <button type='button' class='close' data-dismiss='modal' aria-label='Close' style={{ padding: '0px', margin: '0px' }}>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </h3>


            </div>
            <div className="modal-body">
              <p className="mb-3" style={{ fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '500', fontSize: '16.0073px', lineHeight: '32px', textAlign: 'center', color: '#4B4B4A' }}>{t('translations:ossMenu.otherToolsTitle')}</p>
              <div className="row mt-5" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <div className="col-md-12 mb-4 ">
                  <Link to="/building-calculator"  id="otherToolsButton"type="button" style={{ background: '#EAEBED', fontWeight: '600' }} className="button  w-100 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-2" >{t('translations:ossMenu.BuildingCalculator')} </Link>
                </div>
                <div className="col-md-12 mb-4 ">
                  <Link to="/financial-calculator" id="otherToolsButton" type="button" style={{ background: '#EAEBED', fontWeight: '600' }} className="button  w-100 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-2" >{t('translations:ossMenu.CostEstimationCalculator')}</Link>
                </div>
                <div className="col-md-12 mb-4 ">
                  <Link to="/national-benchmarking" id="otherToolsButton" type="button" style={{ background: '#EAEBED', fontWeight: '600' }} className="button  w-100 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-2" >{t('translations:ossMenu.NationalBenchmarking')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria- labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">{t('translations:dpfText.title13')}
                    </h5>
                    <button type="button" className="close" data- dismiss="modal" aria-label="Close" onClick={this.handleCloseClick}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>{t('translations:dpfText.title14')} </p>
                    <br></br>
                    <br></br>
                    <table className="table-responsive table">
                      <thead>
                        <tr style={{ textAlign: 'center' }}>

                          <th scope="col">{t('translations:navigation.organizations')}</th>
                          <th scope="col">{t('translations:organizations.servicesProvided')}</th>
                          <th scope="col">{t('translations:organizations.short_summary')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.user.organizationServices.filter(item => item.services_provided === false || item.short_summary === false).map((userInfo1, userInfoKey) => {
                          return (<>
                            <tr style={{ textAlign: 'center' }} key={userInfo1.ID}>
                              <th scope="row"> <a href={`/organizations`}>{userInfo1.org_name} </a></th>
                              {(() => {
                                if (userInfo1.services_provided === true) {
                                  return (<> <th scope="row"><center><CheckCircleIcon style={{ color: '#06cd06' }} /></center></th>
                                  </>

                                  );
                                } else {
                                  return (<> <th scope="row"><center><CancelIcon style={{ color: 'red' }} /></center></th>
                                  </>

                                  );
                                }
                              })()}

                              {(() => {
                                if (userInfo1.short_summary === true) {
                                  return (<> <th scope="row"><center><CheckCircleIcon style={{ color: '#06cd06' }} /></center></th>
                                  </>

                                  );
                                } else {
                                  return (<> <th scope="row"><center><CancelIcon style={{ color: 'red' }} /></center></th>
                                  </>

                                  );
                                }
                              })()}

                            </tr>
                          </>);
                        })
                        }
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data- dismiss="modal" onClick={this.handleCloseClick}>Close</button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(state => ({
  alerts: state.alerts.pending,
  userdata: state.user.profileInfo.data,
  user: state.user
}))(withTranslation('translations')(DashboardPage));
