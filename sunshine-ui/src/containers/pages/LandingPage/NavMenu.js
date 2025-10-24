import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Link
} from "react-router-dom";

import { withTranslation } from 'react-i18next';
import {
  Grid,
  makeStyles,
} from '@material-ui/core';

import { LV, EN, BG, SK, AT, RO, PL,GER,IT,PT,FR } from '../../../components/utils/SVGflags';
import Logo_europa_main from '../../../styles/assets/images/Logo_europa_main.png';
import language_icon from '../../../styles/assets/images/language-icon.png';

class NavMenu extends React.Component {

  state = {
    mobileOpen: false,
    anchorEl: null,
    open: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handlePasswordOpen = () => {
    this.setState({ open: true });
  };

  handlePasswordClose = () => {
    this.setState({ open: false });
  };

  handleLogOut = () => this.props.logout(() => this.props.history.push('/login'))
  render() {
    const { anchorEl } = this.state;
    
    const { classes, userdata, logged, t,
      changePassword, passwordChanged, toggleLanguage, language } = this.props;

      const langNode = () => {
        if (language.includes('en'))
          return (<EN width={21} height={21} padding={0} />)
        else if (language.includes('lv'))
          return (<LV width={21} height={21} padding={0} />);
        else if (language.includes('bg'))
          return (<BG width={21} height={21} padding={0} />);
        else if (language.includes('sk'))
          return (<SK width={21} height={21} padding={0} />);
        else if (language.includes('at'))
          return (<AT width={21} height={21} padding={0} />);
        else if (language.includes('ro'))
          return (<RO width={21} height={21} padding={0} />);
        else if (language.includes('pl'))
          return (<PL width={21} height={21} padding={0} />);
        else if (language.includes('it'))
          return (<IT width={21} height={21} padding={0} />);
        else if (language.includes('de'))
          return (<GER width={21} height={21} padding={0} />);
        else if (language.includes('pt'))
          return (<PT width={21} height={21} padding={0} />);  
          else if (language.includes('fr'))
          return (<FR width={21} height={21} padding={0} />);
        else 
          return (<img src={language_icon} alt=""style={{maxWidth: 'unset'}} />);
      }
    return (
    <React.Fragment>
         <nav className="navbar navbar-expand-md">
            <div className="container">
              <a className="navbar-brand" href="#">
                <img src={Logo_europa_main} alt="EUROPA" />
              </a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
                aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list"
                  viewBox="0 0 16 16">
                  <path fillRule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                </svg>
              </button>

              <div className="collapse navbar-collapse" id="navbarsExampleDefault">
              {userdata.name}
              
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item active">
                  <Link to="/index" className="nav-link">{t('landingPage:menu.RESIDENTS')} </Link>
                  
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#howItWorks">{t('landingPage:menu.HOWITWORKS')}</a>
                  </li>
                  <li className="nav-item">
                    
                    <a className="nav-link" href="/ees_calculator">{t('landingPage:menu.EESCALCULATOR')}</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="Market-Operator.html">{t('landingPage:menu.SERVICESPROVIDER')}</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="matchmaking">{t('landingPage:menu.MATCHMAKING')}</a>
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link" to={`/resources`} >{t('landingPage:menu.RESOURCES')}</Link>
                  </li>
                  <li className="nav-item  ml-5 pull-right">
                    <a className="btn btn-primary btn-default btn-sm " href="/projects">Go to my project</a>
                  </li>
                </ul>
               
              </div>
              <div className="float-right drop-hLang">
                <div className="nav-item dropdown hLangSwitch">
               
                  <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="modal"
                    data-target="#exampleModalCenter">{language} { langNode()}  <img src={language_icon} alt="" /> </a>
                  <div className="dropdown-menu" aria-labelledby="dropdown01">
                    <a className="dropdown-item" href="#">EN</a>
                    <a className="dropdown-item" href="#">IT</a>
                    <a className="dropdown-item" href="#">FR</a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
    </React.Fragment>
     );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.user.language,
    
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLanguage: (lang) => {
      dispatch(toggleLanguage(lang));
    }
  };
};
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation('translations')(NavMenu)));
