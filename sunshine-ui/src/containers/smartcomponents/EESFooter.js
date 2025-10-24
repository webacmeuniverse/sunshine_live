import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// WRAPPERS
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  Home as HomeIcon,
  BusinessCenter as OrganizationIcon,
  Business as AssetIcon,
  Equalizer as ProjectIcon,
  Security as AdminIcon,
  TableChart as TableChartIcon,
  Delete as DeleteIcon,
  CalendarTodaySharp as PlusIcon,
  Message as MessageIcon
} from '@material-ui/icons';
// COMPONENTS
import Navigation from '../../components/EESNavigation/Navigation';

// ACTIONS
import { logoutUser } from '../../actions/authentication';
import toggleLanguageAction from '../../actions/language';
import { changePassword as changePasswordAction } from '../../actions/authentication';

class EESFooter extends React.Component {
  render() {
    const {
      userIsLogged,
      logout,
      userdata,
      language,
      toggleLanguage,
      userIsSuperUser,
      changePassword,
      passwordChanged,
    } = this.props;

    return (
      <footer>
          <div className="footer-bottom">
              <div className="container">
                  <div className="row">
                      <div className="col-md-12">
                      <Link to={`/`} style={{ background: '#f59c11',lineHeight: '25px',fontSize: '12px',fontWeight: '900' ,width: '50px'}} id="myBtnsupport" title="Go to home"><HomeIcon style={{marginTop:'1px',width: '2em',height: '2em'}}/></Link>
                     
                         {/* <a href="#"  data-toggle="modal" data-target="#supportModel" id="myBtn" title="Support"><MessageIcon style={{marginTop:'10px'}}/></a> */}

                         {/* <a href="/" id="myBtnsupport" title="Go to home"><HomeIcon style={{marginTop:'10px'}}/> Homepage</a> */}
                      </div>

                  </div>
              </div>
          </div>
      </footer>
    );
  }
}

EESFooter.propTypes = {
  userIsLogged: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired,
  ]),
  logout: PropTypes.func.isRequired,
  userIsSuperUser: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {
    userIsLogged: state.user.isAuthenticated,
    userIsSuperUser: state.user.isSuperUser,
    userdata: state.user.profileInfo,
    language: state.user.language,
    passwordChanged: state.auth.passwordChanged,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: (redirect) => {
      dispatch(logoutUser(redirect));
    },
    toggleLanguage: (lng) => {
      if (ownProps.formName) {
        dispatch(toggleLanguageAction(lng, ownProps.formName));
      } else {
        dispatch(toggleLanguageAction(lng));
      }
    },
    changePassword: (creds) => {
      dispatch(changePasswordAction(creds));
    },
  };
};

export default withTranslation('translations')(connect(
  mapStateToProps,
  mapDispatchToProps,
)(EESFooter));
