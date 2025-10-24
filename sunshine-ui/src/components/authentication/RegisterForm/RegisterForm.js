import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';
import { Field, reduxForm } from 'redux-form';

import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

import { Link } from 'react-router-dom';
import { countries,countriesMobileCode } from '../../../constants/countries';

import PopUp from '../../utils/PopUp';
import CustomSelect from '../../../containers/smartcomponents/CustomSelect';

import { emailRe } from './../../../constants/authConsts';
import styles from './styles';

const validate = (values, props) => {
  let { t } = props;
  const errors = {}

  if (!values.fieldOne) {
    errors.fieldOne = t('auth.required');
  } else if (!emailRe.test(values.fieldOne)) {
    errors.fieldOne = t('auth.invalidEmail');
  }

  if (!values.fieldTwo) {
    errors.fieldTwo = t('auth.required');
  } else if (values.fieldTwo && values.fieldTwo.length <= 8) {
    errors.fieldTwo = t('auth.passwordShort');
  } else if (values.fieldTwo !== values.fieldFive) {
    errors.fieldFive = t('auth.passwordMatch')
  }

  if (!values.fieldThree) {
    errors.fieldThree = t('auth.required');
  }

  if (!values.fieldFour) {
    errors.fieldFour = t('auth.required');
  }

  return errors
};

const warn = (values, props) => {
  let t = props.t;
  const warnings = {};

  if (values.fieldTwo && values.fieldTwo.length <= 8) {
    warnings.fieldTwo = t('auth.passwordWeak');
  }

  return warnings
};

class RegisterForm extends React.Component {
  state = {
    agreeToTerms: false,
    country: '',
    errors: true,
  }

  updateCheck() {
    this.setState((oldState) => {
      return {
        agreeToTerms: !oldState.agreeToTerms,
      };
    });
  }

  handleCountry = (country) => this.setState({ country })

  renderField = ({ input, label, placeholder, type, meta: { touched, error, warning } }) => (
    <div>
      <div style={{ marginTop: '10px' }} className="start-xs"><label style={{ float:'left' }} className={this.props.classes.authLabel}>{label}</label></div>
      <input {...input} placeholder={placeholder} type={type} className="form-control mb-1" />
      {touched && ((error && <span className={`row center-xs ${this.props.classes.authError}`}>{error}</span>)
        || (warning && <span className={`row center-xs ${this.props.classes.authWarning}`}>{warning}</span>))}
    </div>
  );

  renderField1 = ({ input, label, placeholder, type, meta: { touched, error, warning } }) => (
    <div>
      <div style={{ marginTop: '10px' }} className="start-xs"><label style={{ float:'left' }} className={this.props.classes.authLabel}>{label}</label></div>
       {/* <Field name="fieldSeven" component={this.renderCountryMobileCode} />  */}
      <input {...input} placeholder={placeholder} type={type} className="form-control mb-1"  />
      {touched && ((error && <span className={`row center-xs ${this.props.classes.authError}`}>{error}</span>)
        || (warning && <span className={`row center-xs ${this.props.classes.authWarning}`}>{warning}</span>))}
    </div>
  );

  renderCountry = ({ input, label, placeholder, type, meta: { touched, error, warning } }) => {
    const { onChange } = input
    const _onChange = country => {
      onChange(country.label)
      this.handleCountry(country)
    }
    
    return (
      <div style={{ width: '100%' }}>
        <div style={{ marginTop: '20px' }} className="start-xs"><label className={this.props.classes.authLabel}>{label}</label></div>
        <CustomSelect
          isSearchable={false}
          options={countries}
          placeholder={placeholder}
          value={this.state.country}
          handleChange={_onChange}
      
          backgroundColor="#F8FAFC"
        />
        {touched && ((error && <span className={`row center-xs ${this.props.classes.authError}`}>{error}</span>)
          || (warning && <span className={`row center-xs ${this.props.classes.authWarning}`}>{warning}</span>))}
      </div>
    )
  };

  renderCountryMobileCode = ({ input, label, placeholder, type, meta: { touched, error, warning } }) => {
    const { onChange } = input
    const _onChange = country => {
      onChange(country.label)
      this.handleCountry(country)
    }
    return (
      <>
       
        <CustomSelect
          isSearchable={false}
          options={countriesMobileCode}
          placeholder={placeholder}
          value={this.state.country}
          handleChange={_onChange}
          backgroundColor="#F8FAFC"
        />
        {touched && ((error && <span className={`row center-xs ${this.props.classes.authError}`}>{error}</span>)
          || (warning && <span className={`row center-xs ${this.props.classes.authWarning}`}>{warning}</span>))}
     </>
    )
  };

  renderCheckbox = ({ checked, label, checkAgree }) => (
    <div className="start-xs" style={{ display: 'inline-flex' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={() => checkAgree()}
            style={{ marginTop: '20px', textAlign: 'justified' }}
          />
        }
      />
      <div style={{ marginTop: '20px' }}>{label}</div>
    </div>
  )

  render() {
    const { classes, handleSubmit, handleFormSubmit, t, message } = this.props;

    return (
      <form style={{width: '100%'}} onSubmit={handleSubmit(handleFormSubmit.bind(this))}>
        <div className="col-md-6" style={{marginLeft: 'auto', marginRight: 'auto'}}>
                      
                        <div className="form-group">
                      
                        <Field name="fieldOne" type="email" component={this.renderField} className={`col-xs ${classes.specialInput}`} className="form-control mb-3" label={t('auth.email')} placeholder={t('auth.email')} />
                      </div>

                      <div className="form-group">
                        <Field name="fieldTwo" type="password" component={this.renderField}  className="form-control mb-3"label={t('auth.password')} placeholder={t('auth.password')} />
                      </div>

                      <div className="form-group">
                        <Field name="fieldFive" type="password" component={this.renderField} label={t('auth.confirmPassword')} placeholder={t('auth.passwordConfirm')} />
                      </div>

                      <div className="form-group">
                        <Field name="fieldThree" component={this.renderField} label={t('auth.fullName')} placeholder={t('auth.fullName')} />
                      </div>

                     
                       <div className="form-group">
                    
                        <Field name="fieldSix" type="number" component={this.renderField1} label={t('profile.phoneNumber')} placeholder={t('profile.phoneNumber')} />
                      </div> 
                      <div className="form-group">
                        <Field name="fieldFour" component={this.renderCountry} label={t('auth.country')} placeholder={t('auth.country')} />
                      </div>
                      <div className="form-group">
                        {this.renderCheckbox({ checked: this.state.agreeToTerms, label: <PopUp termsofservice={true} size={18} label={t('auth.agree')} />, checkAgree: this.updateCheck.bind(this) })}
                      </div>
                        <button type="submit" className="btn btn-primary btn-md btn-default next-step mb-3" style={{width: '100%', background: '#F18419', borderRadius: '30px'}}> {t('translations:auth.register')}</button>
            </div>

            <div className="center-xs" style={{ marginBottom: '40px' }}>
              <Link to="/login" className={`col-xs ${classes.primaryRedirect}`}>
                {t('auth.loginMessage')}
              </Link>
          </div>
      </form>
    );
  }
}

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func
};

export default withTranslation('translations',
 'serverMessages')(
  reduxForm({
    form: 'registerForm',
    fields: ['fieldOne', 'fieldTwo', 'fieldThree', 'fieldFour', 'agreetoterms'],
    enableReinitialize: true,
    validate,                // <--- Synchronous validation
    warn                     // <--- Synchronous warning
  })(withStyles(styles, { withTheme: true })(RegisterForm))
);
