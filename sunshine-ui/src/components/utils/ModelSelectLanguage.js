import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import { LV, EN, BG, SK, AT, RO, PL,GER,IT,PT } from './SVGflags';
import ENDPOINTS from '../../constants/endpoints';
import modelBackground from '../../styles/assets/images/mapa_retoque_2.png';

//Country flag icon

import Belgium from '../../styles/assets/images/country/Belgium.png';
import France from '../../styles/assets/images/country/France.png';
import Italy from '../../styles/assets/images/country/Italy.png';
import Latvia from '../../styles/assets/images/country/Latvia.png';
import Portugal from '../../styles/assets/images/country/Portugal.png';
import Spain from '../../styles/assets/images/country/Spain.png';
import UK from '../../styles/assets/images/country/UK.png';
import GermanFlag from '../../images/flags/germany.svg';
import AustriaFlag from '../../images/flags/austria.svg';

import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import Switch from '../../styles/assets/images/Switch.png';

class ModelSelectLanguage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      errors: {},  
      errors1: {},
      bookACallUserInformation: {       
        name:'',
        last_name:'',
        email:'',
        phone_number:'',
        description:'',    
                                      
      },
     supportUserInformation: {       
      email:'',
      subject:'',
      message:'',
         
                                      
      },
    };
  }

  bookACallDataChange = e => {

      let nameType  = e.target.name;
      let value = e.target.value;
      
    this.setState({
      bookACallUserInformation:{
        ...this.state.bookACallUserInformation,
        [nameType]: value
      }
    });     
  }

  supportDataChange = e => {

    let nameType  = e.target.name;
    let value = e.target.value;
    
  this.setState({
    supportUserInformation:{
      ...this.state.supportUserInformation,
      [nameType]: value
    }
  });     
}

supportValidation() {

 
  let fields = this.state.supportUserInformation;
  let errors1 = {};
  let formIsValid = true;
          //Email
          if (!fields["email"]) {
            formIsValid = false;
            errors1["email"] = "Email field is required";
          }
          if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf("@");
            let lastDotPos = fields["email"].lastIndexOf(".");
            if (
              !(
                lastAtPos < lastDotPos &&
                lastAtPos > 0 &&
                fields["email"].indexOf("@@") == -1 &&
                lastDotPos > 2 &&
                fields["email"].length - lastDotPos > 2
              )
            ) {
              formIsValid = false;
              errors1["email"] = "Email is not valid";
            }
          }
        
       

      if (!fields["subject"]) {
        formIsValid = false;
        errors1["subject"] = "subject field is required";
      }
      if (!fields["message"]) {
        formIsValid = false;
        errors1["message"] = "message field is required";
      }


       this.setState({ errors1: errors1 });
      return formIsValid;

    }

  supportFormSubmit = (e) => {
      if (this.supportValidation()) {
      
        let config = {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            "email":this.state.supportUserInformation.email,
            "subject":this.state.supportUserInformation.subject,
            "message": this.state.supportUserInformation.message,
            "menu_type":this.props.residentsType
            
          })
        }

         fetch(ENDPOINTS.SERVER + '/support/api', config)
            .then(status => status.json().then(data => ({ data, status })))
            .then(({ data, status }) => {
           
              alert({
                text: 'You Have Successfully Support',
                type: 'success',
                delay: 800,
                closer: true
              });
            
             $('#supportModel').hide();
             $('.modal-backdrop').hide();
             
            })
            .catch(error => {
              alert({
                text: 'There was an error!',
                type: 'error',
                delay: 800,
                closer: true
              });
          });
  
        }
    };

  handleValidation() {
    let fields = this.state.bookACallUserInformation;
    let errors = {};
    let formIsValid = true;

            //Name
            if (!fields["name"]) {
              formIsValid = false;
              errors["name"] = "Name field is required";
            }

        
            //surname
            if (!fields["last_name"]) {
              formIsValid = false;
              errors["last_name"] = "Last Name field is required";
            }

            //Email
            if (!fields["email"]) {
              formIsValid = false;
              errors["email"] = "Email field is required";
            }
            if (typeof fields["email"] !== "undefined") {
              let lastAtPos = fields["email"].lastIndexOf("@");
              let lastDotPos = fields["email"].lastIndexOf(".");
              if (
                !(
                  lastAtPos < lastDotPos &&
                  lastAtPos > 0 &&
                  fields["email"].indexOf("@@") == -1 &&
                  lastDotPos > 2 &&
                  fields["email"].length - lastDotPos > 2
                )
              ) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
              }
            }
          
            //phoneNumber
            if (!fields["phone_number"] ) {
              formIsValid = false;
              errors["phone_number"] = "Phone Number field is required";
            }
            let pattern = new RegExp(/^[0-9\b]+$/);

            if (!pattern.test(fields["phone_number"])) {

              formIsValid = false;

              errors["phone_number"] = "Please enter only number.";

            }else if(fields["phone_number"].length  <= 8 ){

                formIsValid = false;

                errors["phone_number"] = "Please enter valid phone number.";

            }else if(fields["phone_number"].length  >= 13 ){

                formIsValid = false;

                errors["phone_number"] = "Please enter valid phone number.";

              }

              
          if (!fields["description"]) {
            formIsValid = false;
            errors["description"] = "description field is required";
          }


         this.setState({ errors: errors });
        return formIsValid;

      }

  bookACallFormSubmit = (e) => {
    if (this.handleValidation()) {
    
  
      let config = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          "name":this.state.bookACallUserInformation.name,
          "last_name":this.state.bookACallUserInformation.last_name,
          "email": this.state.bookACallUserInformation.email,
          "phone_number":this.state.bookACallUserInformation.phone_number,
          "oss_admin_id":this.props.selectedOssAdmin,
          "description":this.state.bookACallUserInformation.description,
          "menu_type":this.props.residentsType
         
        })
      }

       fetch(ENDPOINTS.SERVER + '/book/a/call', config)
          .then(status => status.json().then(data => ({ data, status })))
          .then(({ data, status }) => {
         
            alert({
              text: 'You Have Successfully Book A Call',
              type: 'success',
              delay: 800,
              closer: true
            });
          
           $('#bookCallExampleModalCenter').hide();
           $('.modal-backdrop').hide();
           
          })
          .catch(error => {
            alert({
              text: 'There was an error!',
              type: 'error',
              delay: 800,
              closer: true
            });
        });

      }
  }; 

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

 

  render() {
    let { toggleLanguage, lang ,toggleCountry,country,residentsType,t} = this.props;
    
    const handleSelect = (lng) => {
     
      toggleLanguage(lng);
  this.props.onFieldChange(lng);
      
    }
   
    const handleSelectCountry = (country) => {
    
      toggleCountry(country);
    }

    const langNode = () => {
      if (lang.includes('en'))
        return (<EN width={21} height={21} padding={0} />)
      else if (lang.includes('lv'))
        return (<LV width={21} height={21} padding={0} />);
      else if (lang.includes('bg'))
        return (<BG width={21} height={21} padding={0} />);
      else if (lang.includes('sk'))
        return (<SK width={21} height={21} padding={0} />);
      else if (lang.includes('at'))
        return (<AT width={21} height={21} padding={0} />);
      else if (lang.includes('ro'))
        return (<RO width={21} height={21} padding={0} />);
      else if (lang.includes('pl'))
        return (<PL width={21} height={21} padding={0} />);
      else if (lang.includes('it'))
        return (<IT width={21} height={21} padding={0} />);
      else if (lang.includes('de'))
        return (<GER width={21} height={21} padding={0} />);
      else if (lang.includes('pt'))
        return (<PT width={21} height={21} padding={0} />);  
      else 
        return (<img src={language_icon} alt=""style={{maxWidth: 'unset'}} />);
    }
    return (
      <>
      <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered  modal-lg" role="document" style={{width:'749px'}} >
        <div className="modal-content">
          <div className="modal-header" style={{height:'139px',backgroundImage:`url(${modelBackground})`,backgroundRepeat:'no-repeat'}}>

            <div className="row" style={{marginLeft:'auto',marginRight:'auto',marginTop:'auto',marginBottom:'auto'}} >

              <img src={Belgium} alt="Belgium" />
              <img src={France} alt="France" />
              <img src={Italy} alt="Italy" />
              <img src={Latvia} alt="Latvia" />
              <img src={Portugal} alt="Portugal" />
              <img src={Spain} alt="Spain" />
              <img src={UK} alt="UK" />
              <img src={GermanFlag} alt="German" style={{ height: '34px',width: '45px' }}/>
              <img src={AustriaFlag} alt="Austrian"  style={{ height: '34px',width: '45px' }}/>
              

            </div>

            <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{margin:'-1rem -1rem 0rem 0px'}}
             >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="container-fluid">

              <div className="row">
                <div className="col-sm-10" style={{marginLeft:'auto',marginRight:'auto'}} >
                  <h2 className="modelH2"> <img src={Switch} alt="Switch" />&nbsp;&nbsp;&nbsp;
                 
                  {t('translations:ossOnboardingTitle.Suggestedlanguage')} 
                  
                  </h2>
                  {/* {lang && langNode()} */}
                  <br/>
                  <div className="row">
                  <div className="col-md-3" id="step5chk">
                      <input type="radio" id="language1" name="language"  defaultChecked={lang === "en" || lang === "en-US"} onClick={() => handleSelect("en")}/>
                      <label htmlFor="language1">English</label>
                    </div>
                    <div className="col-md-3" id="step5chk">
                      <input type="radio" id="language2" name="language" defaultChecked={lang === "lv"}  onClick={() => handleSelect("lv")}/>
                      <label htmlFor="language2">Latvian</label>
                    </div>
                    <div className="col-md-3" id="step5chk">
                      <input type="radio" id="language8c" name="language"  defaultChecked={lang === "de"}  onClick={() => handleSelect("de")}/>
                      <label htmlFor="language8c">German</label>
                    </div>
                    <div className="col-md-3" id="step5chk">
                      <input type="radio" id="language7c" name="language"  defaultChecked={lang === "it"}  onClick={() => handleSelect("it")}/>
                      <label htmlFor="language7c">Italian</label>
                    </div>
                    <div className="col-md-3" id="step5chk">
                      <input type="radio" id="language9c" name="language"  defaultChecked={lang === "pt"}  onClick={() => handleSelect("pt")}/>
                      <label htmlFor="language9c">Portuguese</label>
                    </div>
                    <div className="col-md-3" id="step5chk">
                      <input type="radio" id="language99c" name="language" defaultChecked={lang === "fr"}  onClick={() => handleSelect("fr")}/>
                      <label htmlFor="language99c">French</label>
                    </div>
                    {/* <div className="col-md-3" id="step5chk1">
                      <input type="radio" id="language4" name="language"  defaultChecked={lang === "at"}  onClick={() => handleSelect("at")}/>
                      <label htmlFor="language4" >Austrian</label>
                    </div> */}
                    <div className="col-md-3" id="step5chk1">
                      <input type="radio" id="language3" name="language"  defaultChecked={lang === "sk"}  onClick={() => handleSelect("sk")}/>
                      <label htmlFor="language3" >Slovak</label>
                    </div>                   
                    <div className="col-md-3" id="step5chk1">
                      <input type="radio" id="language5" name="language"  defaultChecked={lang === "ro"}  onClick={() => handleSelect("ro")}/>
                      <label htmlFor="language5" >Romanian</label>
                    </div>
                    <div className="col-md-3" id="step5chk1">
                      <input type="radio" id="language6" name="language"  defaultChecked={lang === "pl"}  onClick={() => handleSelect("pl")}/>
                      <label htmlFor="language6" >Polish</label>
                    </div>
                    <div className="col-md-3" id="step5chk1">
                      <input type="radio" id="language" name="language"  defaultChecked={lang === "bg"} onClick={() => handleSelect("bg")} />
                      <label htmlFor="language" >Bulgarian</label>
                    </div>                                   
                  </div>
                  <br></br>
                  <hr/>
                  <br></br>
                  <h2 className="modelH2"> <img src={Switch} alt="Switch" />&nbsp;&nbsp;&nbsp;{t('translations:ossOnboardingTitle.Chooseyourcountry')}  </h2>
                  <br/>
                  <div className="row">
                  <div className="col-md-3" id="step5chk">
                  {(() => {

                    if (this.props.country === "Latvia") {
                                                                
                         return (<input type="radio" id="country1" name="country" value="Latvia" defaultChecked={this.props.country === "Latvia"} onClick={() => handleSelectCountry("Latvia")} checked />);
                      }else {
                          return (<input type="radio" id="country1" name="country" value="Latvia"  onClick={() => handleSelectCountry("Latvia")} />);                                      
                      
                      }

                    })()}

                      <label htmlFor="country1">Latvia</label>
                    </div>
                    <div className="col-md-3" id="step5chk">
                      <input type="radio" id="country2" name="country"  defaultChecked={country === "Italy"} onClick={() => handleSelectCountry("Italy")}/>
                      <label htmlFor="country2">Italy</label>
                    </div>
                    <div className="col-md-3" id="step5chk">
                      <input type="radio" id="countryMain3" name="country"  defaultChecked={country === "Germany"} onClick={() => handleSelectCountry("Germany")}/>
                      <label htmlFor="countryMain3">Germany</label>
                    </div>
                    <div className="col-md-3" id="step5chk">
                      <input type="radio" id="countryMain4" name="country"  defaultChecked={country === "Portugal"} onClick={() => handleSelectCountry("Portugal")}/>
                      <label htmlFor="countryMain4">Portugal</label>
                    </div>
                    <div className="col-md-3" id="step5chk">
                      <input type="radio" id="countryMain5" name="country"  defaultChecked={country === "France"}  onClick={() => handleSelectCountry("France")}/>
                      <label htmlFor="countryMain5">France</label>
                    </div>
                    
                    <div className="col-md-3" id="step5chk">
                      <input type="radio" id="countryMain6" name="country"  defaultChecked={country === "Poland"} onClick={() => handleSelectCountry("Poland")}/>
                      <label htmlFor="countryMain6">Poland</label>
                    </div>
                    <div className="col-md-3" id="step5chk">
                      <input type="radio" id="countryMain7" name="country" defaultChecked={country === "Spain"} onClick={() => handleSelectCountry("Spain")}/>
                      <label htmlFor="countryMain7">Spain</label>
                    </div>
                    <div className="col-md-3" id="step5chk">
                      <input type="radio" id="countryMain8" name="country" defaultChecked={country === "Lithuania"} onClick={() => handleSelectCountry("Lithuania")}/>
                      <label htmlFor="countryMain8">Lithuania</label>
                    </div>
                    <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="countryMain9" name="country" defaultChecked={country === "Austrian"} onClick={() => handleSelectCountry("Austrian")}/>
                                                    <label htmlFor="countryMain9">Austrian</label>
                                                </div>

                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

            <div className="modal fade" id="bookCallExampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content" style={{width: '416px',height: '460px' }}>
                    <div className="modal-header" style={{background: '#FCCB00'}}>
                        <center>
                            <h5 className="modal-title" style={{padding: '1rem',margin:'-1rem -1rem -1rem 7rem',textTransform: 'uppercase',fontFamily: 'Inter',fontStyle: 'normal',fontWeight: 'bold',fontSize: '16.1691px',color:'#FFFFFF'}}>{t('translations:ossOnboardingTitle.Bookacall')} </h5>
                        </center>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            style={{padding: '0px',margin: '0px'}}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <h2 className="mb-3" style={{fontFamily: 'Inter',fontStyle: 'normal',fontWeight: '800',fontSize: '18.0073px',lineHeight: '32px',textAlign: 'center',color: '#4B4B4A'}}>{t('translations:dpfText.title12')} </h2>

                        <hr  className="mb-3" style={{borderTop: '1px solid #FBC304'}}/>
                        <div className="row" style={{marginLeft: 'auto',marginRight: 'auto'}}>

                            <div className="col-md-6 mb-4">

                                <input type="text" name="name"  className="form-control modelTextbox" onChange={(e) => this.bookACallDataChange(e)} placeholder={t('translations:documents.name')}/>
                                <span style={{ color: "red",fontFamily: 'Inter',fontStyle: 'normal',fontweight: '500',fontSize: '10.3482px' }}>{this.state.errors["name"]}</span> 
                            </div>
                            <div className="col-md-6 mb-4">

                                <input type="text" name="last_name"  className="form-control modelTextbox" onChange={(e) => this.bookACallDataChange(e)} placeholder={t('translations:auth.lastName')}/>
                                <span style={{ color: "red",fontFamily: 'Inter',fontStyle: 'normal',fontweight: '500',fontSize: '10.3482px' }}>{this.state.errors["last_name"]}</span> 
                            </div>
                        </div>
                        <div className="row" style={{marginLeft: 'auto',marginRight: 'auto'}}>
                            <div className="col-md-6 mb-4">

                                <input type="text" name="email"  className="form-control modelTextbox" onChange={(e) => this.bookACallDataChange(e)} placeholder={t('translations:auth.email')}/>
                                <span style={{ color: "red",fontFamily: 'Inter',fontStyle: 'normal',fontweight: '500',fontSize: '10.3482px' }}>{this.state.errors["email"]}</span> 
                            </div>
                            <div className="col-md-6 mb-4">

                                <input type="text" name="phone_number"  className="form-control modelTextbox" onChange={(e) => this.bookACallDataChange(e)} placeholder={t('translations:organizations.phone')}/>
                                <span style={{ color: "red",fontFamily: 'Inter',fontStyle: 'normal',fontweight: '500',fontSize: '10.3482px' }}>{this.state.errors["phone_number"]}</span> 
                            </div>
                            <div className="col-md-12 mb-4">
                            
                                <input type="text" name="description"  className="form-control modelTextbox" onChange={(e) => this.bookACallDataChange(e)} placeholder={t('translations:suportTitle.Message')}/>
                                <span style={{ color: "red",fontFamily: 'Inter',fontStyle: 'normal',fontweight: '500',fontSize: '10.3482px' }}>{this.state.errors["description"]}</span> 
                            </div>

                        </div>

                    </div>
                    <div className="px-5 py-3 border-t border-gray-200 dark:border-dark-5">
                                               
                                            <center>    <button type="button" onClick={(e) => this.bookACallFormSubmit(e)}   className="button w-20 bg-theme-1 text-white">{t('translations:suportTitle.Send')}</button>
                                                &nbsp;            &nbsp;
                                                <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-1">{t('translations:utils.confirmDialogCancel')}</button>
                                                </center> 
                                            </div>
                </div>
            </div>
            </div>

            <div className="modal fade" id="supportModel" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content" style={{width: '416px',height: '460px' }}>
                    <div className="modal-header" style={{background: '#FCCB00'}}>
                        <center>
                            <h5 className="modal-title" style={{padding: '1rem',margin:'-1rem -1rem -1rem 7rem',textTransform: 'uppercase',fontFamily: 'Inter',fontStyle: 'normal',fontWeight: 'bold',fontSize: '16.1691px',color:'#FFFFFF'}}>{t('translations:suportTitle.Support')} </h5>
                        </center>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            style={{padding: '0px',margin: '0px'}}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                      
                        <hr  className="mb-3" style={{borderTop: '1px solid #FBC304'}}/>
                        <div className="row" style={{marginLeft: 'auto',marginRight: 'auto'}}>

                            <div className="col-md-12 mb-4">

                                <input type="text" name="email" className="form-control modelTextbox" onChange={(e) => this.supportDataChange(e)} placeholder={t('translations:auth.email')}/>
                                <span style={{ color: "red",fontFamily: 'Inter',fontStyle: 'normal',fontweight: '500',fontSize: '10.3482px' }}>{this.state.errors1["email"]}</span> 
                            </div>
                            <div className="col-md-12 mb-4">

                                <input type="text" name="subject" className="form-control modelTextbox" onChange={(e) => this.supportDataChange(e)} placeholder={t('translations:suportTitle.Subject')}/>
                                <span style={{ color: "red",fontFamily: 'Inter',fontStyle: 'normal',fontweight: '500',fontSize: '10.3482px' }}>{this.state.errors1["subject"]}</span> 
                            </div>
                        </div>
                        <div className="row" style={{marginLeft: 'auto',marginRight: 'auto'}}>
                           
                          
                            <div className="col-md-12 mb-4">
                           
                            <textarea className="form-control modelTextbox" name="message" rows="4" cols="50" onChange={(e) => this.supportDataChange(e)}  placeholder={t('translations:suportTitle.Message')} value="">  </textarea>
                            <span style={{ color: "red",fontFamily: 'Inter',fontStyle: 'normal',fontweight: '500',fontSize: '10.3482px' }}>{this.state.errors1["message"]}</span> 
                            </div>

                        </div>

                    </div>
                    <div className="px-5 py-3 text-right border-t border-gray-200 dark:border-dark-5">
                                                <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-1">{t('translations:utils.confirmDialogCancel')}</button>
                                                <button type="button"  onClick={(e) => this.supportFormSubmit(e)} className="button w-20 bg-theme-1 text-white">{t('translations:suportTitle.Send')}</button>
                                            </div>
                </div>
            </div>
            </div>
            </>
    );
  }
}

ModelSelectLanguage.propTypes = {
  toggleLanguage: PropTypes.func.isRequired,
  lang: PropTypes.string,
  toggleCountry: PropTypes.func.isRequired,
  countryName: PropTypes.string
};

export default withTranslation('translations')(ModelSelectLanguage);
