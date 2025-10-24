import React from 'react';
import PropTypes from 'prop-types';

// WRAPPERS
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Field, reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';

// COMPONENTS
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

// Actions
import { loginUser } from './../../../actions/authentication';

import styles from './styles';

class LoginForm extends React.Component {

 render() {
   const { handleFormSubmit, handleSubmit } = this.props;
   const { classes,t } = this.props;
   return (
     <form onSubmit={handleSubmit(handleFormSubmit.bind(this))} style={{width: '100%'}} >
         <div className="col-md-6" style={{marginLeft: 'auto', marginRight: 'auto'}}>
                            <div className="start-xs" style={{marginTop: '10px',float:'left'}}><label className="RegisterForm-authLabel-44">{t('translations:auth.email')}</label></div>
                            <Field className={`col-xs ${classes.specialInput}`} name='email' type='email' className="form-control mb-3" component='input' placeholder={t('translations:auth.email')}/>                  
                            <div className="start-xs" style={{marginTop: '10px',float:'left'}}><label className="RegisterForm-authLabel-44">{t('translations:auth.password')}</label></div>
                            <Field className={`col-xs ${classes.specialInput}`} name='password' type='password' className="form-control mb-3" component='input' placeholder={t('translations:auth.password')}/>                  
                            <button type="submit" className="btn btn-primary btn-md btn-default next-step mb-3" style={{width: '100%', background: '#F18419', borderRadius: '30px'}}> {t('translations:auth.login')}</button>
                        </div>

        {this.props.registerAction && (
          <div  style={{ fontFamily: 'Inter',fontStyle:'normal',fontWeight:'600',fontSize:'16px',lineHeight:'39px',textAlign:'center',color:'#556775' }}>
          <Link to='/register' className="sectionTitle">
            {t('translations:auth.registerMessage')}
          </Link>
        </div>
        )}
      </form>
    );
  }
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  registerAction: PropTypes.bool.isRequired,
};

LoginForm.defaultProps = {
  registerAction: true,
};

const mapDispatchToProps = dispatch => ({
  handleFormSubmit: (creds) => {
    dispatch(loginUser(creds));
  },
});

export default (
  withTranslation('translations',
 'serverMessages')(
  reduxForm({form: 'loginForm'})(
  withStyles(styles, { withTheme: true })(
  connect(null, mapDispatchToProps)(LoginForm))))
);
