import React from 'react';
import PropTypes from 'prop-types';

// WRAPPERS
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

// COMPONENTS
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ChangePassword from '../user/ChangePassword/ChangePassword';
import SelectLanguage from '../utils/SelectLanguage';

// ICONS
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/KeyboardArrowDown';
import defaultImage from './../../images/Profile_avatar_placeholder_large.png';
import toggleLanguage from '../../actions/language';

// BACKEND ENDPOINTS
import ENDPOINTS from '../../constants/endpoints';

import styles from './styles';
//images
import language_icon from '../../styles/assets/images/language-icon.png';
import IMG_5322 from '../../styles/assets/IMG_5322_1.png';
import { LV, EN, BG, SK, AT, RO, PL,GER,IT,PT ,FR} from '../../components/utils/SVGflags';
import {
  Home as HomeIcon,
  BusinessCenter as OrganizationIcon,
  Business as AssetIcon,
  Equalizer as ProjectIcon,
  Security as AdminIcon,
  Help as HelpIcon,
  ExitToApp as ExitToAppIcon

} from '@material-ui/icons';

class ResponsiveDrawer extends React.Component {
  
  state = {
    mobileOpen: false,
    anchorEl: null,
    open: false,
   
    oss_admin_list: [],
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
  handleNavClick() {
   
    document.getElementById("myNav").style.width = "20%";
}



//componentDidUpdate(){
  componentDidMount(){
  const config = {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'text/plain' },
};

fetch(ENDPOINTS.SERVER + '/oss/admins', config)
    .then(res => res.json())
    //.then((result) => result.length ? JSON.parse(text) : {})
    .then(
        (result) => {
           

            if (result != null) {
                let resultData = result.filter(item => item.country === this.props.country)
               
                    if(resultData.length === 0){
                        let resultData1 = result.filter(item => item.country === 'Latvia')
                        
                        this.state.oss_admin_list = resultData1;
                      
                    }else{
                      
                                     let resultData1 = result.filter(item => item.country === this.props.country)          
                        this.state.oss_admin_list = resultData1;
                      
                    }
                   
                    this.forceUpdate()
                    //this.getOssStep();
            }
        }
    )
         
   
}

handleClick = event => {
  this.setState({ anchorEl: event.currentTarget });
};

onFieldChange(event) {
  // for a regular input field, read field name and value from the event
  const fieldName = event.target.name;
  const fieldValue = event.target.value;



  this.props.onFieldChange1(fieldValue);
}
handleLogOut = () => this.props.logout(() => this.props.history.push('/login'))
  render() {
    const { anchorEl ,oss_admin_list} = this.state;
    const { classes, userdata, logged, t,
      changePassword, passwordChanged, toggleLanguage, language ,ossAdminChange, selectedOssValue,logout,country,ossAdminData} = this.props;
    // This will be shown only if the user is logged in.
    const countryNode = () => {
      if (country.includes('Italy'))
        return ("Italy");
      else if (country.includes('Germany'))
        return ("Germany");
      else if (country.includes('Portugal'))
        return ("Portugal");
      else if (country.includes('France'))
        return ("France");
      else if (country.includes('Latvia'))
        return ("Latvia");
      else if (country.includes('Poland'))
        return ("Poland");
      else if (country.includes('Spain'))
        return ("Spain");
      else if (country.includes('Lithuania'))
        return ("Lithuania");  
      else if (country.includes('Austrian'))
        return ("Austrian");
        else 
        return '';
    }

   
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
      
             <nav className="navbar navbar-expand-md" style={{float:'right',paddingTop:'0px',paddingBottom:'0px'}} >
                  <div className="float-left " id="header">
                    <div className="nav-item dropdown hLangSwitch">
                      <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="modal"
                    data-target="#exampleModalCenter1"  style={{ textTransform: 'uppercase',fontFamily: 'Open Sans, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    fontSize: '11.50833px',
                    lineHeight: '43px',
                    color: 'rgba(35, 31, 32, 0.5)',
                    marginTop: '2px',
                    padding: '5px' }}> {language} - {countryNode()} { langNode()} </a>
                      <div className="dropdown-menu" aria-labelledby="dropdown01">
                        <a className="dropdown-item" href="#">EN</a>
                        <a className="dropdown-item" href="#">IT</a>
                        <a className="dropdown-item" href="#">FR</a>
                      </div>
                    </div>


                  </div>

                  <div className="float-left " id="header">
                    <select className="select-country" name="location" id="location" style={{background:'none',color: 'black',fontWeight: '700',fontSize: '14px',borderBottom: 'solid 1px #000000'}} onChange={this.onFieldChange.bind(this)} value= {(() => {
                                                                                if (selectedOssValue != null) {
                                                                                    return selectedOssValue
                                                                                }
                                                                            })()} required>
                    {/* <option value="" >Select Organization </option> */}
                    { ossAdminData.map((subval, idx) => {
                                                                     
                                    return (
                                      <option value={subval.email} key={subval.email} >{subval.organization_name}</option>
                                        )
                                  })
                                 
                                } 


                    </select>
                  </div>

                  <div className="float-left " id="header">
                    <div className="nav-item dropdown hLangSwitch">
                      <a className="nav-link dropdown-toggle"  id="dropdown01">
                      <MenuIcon  onClick={this.handleNavClick} style={{height: '4em',width: '4em'}}/>
                        
                       </a>

                    </div>
                  </div>
                  <div className="float-left " id="header1">
                    <div className="nav-item dropdown hLangSwitch">

                      <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          {userdata
                          ? logged && userdata && userdata.data.avatar
                            ? <Avatar onClick={this.handleClick} style={{border:'1px solid #fdd833',width:"30px",height:"30px"}}
                             
                              src={ENDPOINTS.SERVER + userdata.data.avatar}>
                            </Avatar>
                            : <Avatar
                            onClick={this.handleClick}
                              src={defaultImage}>
                            </Avatar>
                          : null}
                       
                      </a>

                      <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={this.handleClose}
                          style={{ top: '50px',left: '-20px' }}
                        >
                          <div className="p-3 border-b border-theme-40 dark:border-dark-3" style={{ borderColor: '#fdcf00' }} >
                                      <div className="font-medium">{userdata?userdata.data.name :''}</div>
                                    </div>
                          <Link to='/profile' >
                            <MenuItem onClick={this.handleClose}>{t('translations:profile.profile')}</MenuItem>
                          </Link>
                        
                          <MenuItem onClick={this.handleLogOut} style={{ paddingLeft: '20px' }}>{t('translations:profile.signOut')}</MenuItem>
                      </Menu>

                      {/* <div className="dropdown-menu" aria-labelledby="dropdown01" style={{left:'-147px',width:'224px'}} >
                        <a className="dropdown-item" href="#"><b> {userdata?userdata.data.name :''}</b></a>
                        <div className="dropdown-divider"></div>
                        <Link to='profile' className="dropdown-item" ><HomeIcon/> &nbsp;&nbsp; {t('translations:profile.profile')}  </Link>
                        
                        <a className="dropdown-item" href="#"><HelpIcon/>&nbsp;&nbsp;
                          Help</a> *
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" onClick={this.handleLogOut} ><ExitToAppIcon/>&nbsp;&nbsp; {t('translations:profile.signOut')}</a>
                      </div> */}
                    </div>
                  </div>
                  </nav>
     
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.user.language,
    country: state.user.country,
  
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
)(withTranslation('translations')(ResponsiveDrawer)));
