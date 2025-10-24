import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link, NavLink, } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Home as HomeIcon,
  BusinessCenter as OrganizationIcon,
  Business as AssetIcon,
  Equalizer as ProjectIcon,
  Security as AdminIcon,
  TableChart as TableChartIcon,
} from '@material-ui/icons';
import europe from '../../../images/flags/europe.svg';
import logo_footer from '../../../styles/assets/images/logo-footer.png';
import logo_footer2 from '../../../images/1_Logo_europa_main.png';
import PrivacyPolicyDialog from './PrivacyPolicyDialog';
import TermsDialog from './TermsDialog';
import ContactUsDialog from './ContactUs';

const menuItems = [
  {
    url: '/',
    exact: true,
    titleKey: 'landingPage:menu.RESIDENTS',
    items: []
  },
  {
    url: '/operators',
    exact: true,
    titleKey: 'landingPage:menu.SERVICESPROVIDER',
    items: []
  },
  {
    url: '/ees_calculator',
    matchеsRegExp: new RegExp('^/ees_calculator'),
    titleKey: 'landingPage:menu.EESCALCULATOR',
    items: []
  },


  {
    url: '/find-my-partner',
    exact: false,
    matchеsRegExp: new RegExp('^/find-my-partner'),
    titleKey: 'landingPage:menu.FindMyPartner',
    items: []

  },
  {
    url: '',
    matchеsRegExp: '',
    titleKey: 'landingPage:menu.SIMULATIONTOOL',
    items: [
      {
        url: 'ees-checklist',
        exact: true,
        titleKey: 'landingPage:menu.EESCHECKLIST',

      },
      {
        url: 'ees-refinancability-checklist',
        exact: true,
        titleKey: 'landingPage:menu.EESREFINANCEABILITYCHECKLIST',

      },
      {
        url: 'building-calculator',
        exact: true,
        titleKey: 'landingPage:menu.BUILDINGCALCULATOR',

      },


    ]

  },
  {
    url: '/resources',
    titleKey: 'landingPage:menu.RESOURCES',
    items: []
  },

];


const supportMenu = [
  {
    url: '/faq',
    exact: true,
    titleKey: 'landingPage:Footer.FAQ',
    items: []
  },
  {
    url: '/operators',

    titleKey: 'landingPage:menu.SERVICESPROVIDER',
    items: []
  },
  {
    url: '/ees_calculator',
    matchеsRegExp: new RegExp('^/ees_calculator'),
    titleKey: 'landingPage:menu.EESCALCULATOR',
    items: []
  },


];

function HomePage(props) {

  const {
    user
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [countryAdminDialogOpen, setCountryAdminDialogOpen] = useState(false);
  const toggleCountryAdminDialog = () => setCountryAdminDialogOpen(!countryAdminDialogOpen);

  const toggleOpen = () => setIsOpen(!isOpen);
  const { t } = useTranslation('translations');
  let menu_path = window.location.pathname.split('/')[1];

  return (
    <React.Fragment>
      <footer>
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h4>{t('landingPage:Footer.Partners')}</h4>

                <div className="row">
                  <div className="col-md-3">
                    <img src={europe} alt="Sunshine" style={{ height: '50px' }} />
                  </div>
                  <div className="col-md-9">
                    <p> {t('navigation.fundedByHorizon')} </p>
                  </div>
                </div>

                <div className="mb-2">

                  <center><Link to={`/`} ><img src={logo_footer2} alt="" style={{ height: '150px' }} /></Link> </center>


                </div>
                <div className="mt-2 mb-4">
                  <center><img src={logo_footer} alt="" /> </center>
                </div>

              </div>
              <div className="col-md-4">
                <h4>{t('landingPage:Footer.About')}</h4>
                <MenuList open disablePadding component="ul"  >
                  {menuItems.map((mi, i) => {




                    const { url, exact, icon, titleKey, matchеsRegExp } = mi;

                    return (

                      <li key={i}  >
                        <MenuItem key={url} component={NavLink} to={url} exact={Boolean(exact)}>
                          <ListItemText >{t(titleKey)}</ListItemText>
                        </MenuItem>
                        <ul style={{ marginLeft: '25px' }}>
                          {mi.items.map((sunmenu, i1) => {
                            const { url, exact, icon, titleKey, matchеsRegExp } = sunmenu;
                            return (<li key={i1}  >
                              <MenuItem key={url} component={NavLink} to={url} exact={Boolean(exact)}>
                                <ListItemText >{t(titleKey)}</ListItemText>
                              </MenuItem>
                            </li>
                            );

                          })}
                        </ul>
                      </li>

                    );
                  })}

                </MenuList>

              </div>
              <div className="col-md-4">
                <h4>{t('landingPage:Footer.Support')}</h4>
                <MenuList open disablePadding component="ul"  >
                    <li>
                       <MenuItem  key={111} component={NavLink} to={`/faq`} exact={Boolean(true)} >
                          <ListItemText style={{ textTransform: 'uppercase' }}>{t('landingPage:Footer.FAQ')}</ListItemText>
                        </MenuItem>
                        </li>
                 
                  <li>

                  

                 <a onClick={toggleCountryAdminDialog} style={{ cursor: 'pointer',textTransform: 'uppercase' }}>{t('landingPage:Footer.Contact')}</a> 
                  </li>
                  {user.profileInfo.data ? (
                    <>
                      {(() => {
                        if (menu_path !== 'operators') {
                          return <li>  <MenuItem  key={113} component={NavLink} to={`/projects`} exact={Boolean(true)} >
                          <ListItemText style={{ textTransform: 'uppercase' }}>{t('landingPage:Footer.GoToMyProject')}</ListItemText>
                        </MenuItem>
                            
                             </li>
                        }
                      })()}

                    </>
                  ) : (
                    <>
                      {(() => {
                        if (menu_path !== 'operators') {
                          return <li> <MenuItem  key={113} component={NavLink} to={`/go-to-my-project`} exact={Boolean(true)} >
                          <ListItemText style={{ textTransform: 'uppercase' }}>{t('landingPage:Footer.GoToMyProject')}</ListItemText>
                        </MenuItem>
                            
                             </li>
                        }
                      })()}
                    </>
                  )}


               </MenuList>
              </div>
            </div>
          </div>
        </div>

        {countryAdminDialogOpen && (
          <ContactUsDialog
            title={t('platformRoles.dataProtectionOfficers')}
            role="data_protection_officer"
            onClose={toggleCountryAdminDialog}
          />
        )}
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <p className="mb-1">{t('landingPage:Footer.Title')} <br></br><PrivacyPolicyDialog style={{ cursor: 'pointer' }} />
                  ·

                  <TermsDialog termsofservice={true} label={t('landingPage:Footer.Terms')} style={{ cursor: 'pointer' }} />
                  · <a href="#.">{t('landingPage:Footer.Sitemap')}</a></p>


                {/* <p>
                  <PrivacyPolicyDialog style={{ cursor: 'pointer' }} />
                  ·

                  <TermsDialog termsofservice={true} label={t('landingPage:Footer.Terms')} style={{ cursor: 'pointer' }} />
                  · <a href="#.">{t('landingPage:Footer.Sitemap')}</a> </p> */}
              </div>

              <div className="col-md-6">
                <ul className="social-icons">
                  <li>
                    <a href="https://www.instagram.com/europaonestop/">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                        className="bi bi-instagram" viewBox="0 0 16 16">
                        <path
                          d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                      </svg>
                    </a>
                  </li>

                  <li>
                    <a href="https://www.linkedin.com/company/europa-onestopshop/">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                        className="bi bi-linkedin" viewBox="0 0 16 16">
                        <path
                          d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com/EuropaRenovate">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                        className="bi bi-twitter" viewBox="0 0 16 16">
                        <path
                          d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="tel:+496170961709">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                        className="bi bi-telephone-fill" viewBox="0 0 16 16">
                        <path fillRule="evenodd"
                          d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </footer>
    </React.Fragment>
  );
}

export default connect(
  state => ({
    alerts: state.alerts.pending,
    user: state.user,
  }),
)(HomePage);
