import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
/// WRAPPERS
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

/// COMPONENTS
import NavMenu from '../../smartcomponents/LandingPageNavContainer';
import Rating from '@material-ui/lab/Rating';

import Footer from '../LandingPage/Footer';
import SelectLanguageModel from '../../smartcomponents/SelectLanguageModel';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
/// ACTIONS
import { registerUser } from '../../../actions/authentication';
import ENDPOINTS from '../../../constants/endpoints';
import { makeStyles } from '@material-ui/core/styles';
import Group610 from '../../../styles/assets/Group610.png';
import mapserchbox from '../../../styles/assets/mapserchbox.png';
import mapzom from '../../../styles/assets/mapzom.png';
import Group3790 from '../../../styles/assets/Group3790.png';
import maps2 from '../../../styles/assets/maps2.png';
import NavContainer from '../../smartcomponents/LandingPageNavContainer';
import Group542 from '../../../styles/assets/Group542.png';

import marketingmaps from '../../../styles/assets/marketingmaps.png';
import { LEGAL_FORMS, isResidentsCommunity } from '../../../constants/legalStatusTypes';
import user from '../../../styles/assets/images/Icon/user.png';
import location from '../../../styles/assets/images/Icon/location.png';
import Server from '../../../styles/assets/images/Icon/Server.png';
import testlogo from '../../../images/1SUNShiNE_Main_footer.png';
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import Geocode from "react-geocode";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyCzEox59MeXTwwX4ZBN4MqjzE7-BesOKW8");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("es");

// set location_type filter . Its optional.
// google geocoder returns more that one address for given lat/lng.
// In some case we need one address as response for which google itself provides a location_type filter.
// So we can easily parse the result for fetching address components
// ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE are the accepted values.
// And according to the below google docs in description, ROOFTOP param returns the most accurate result.
Geocode.setLocationType("ROOFTOP");

// Enable or disable logs. Its optional.
Geocode.enableDebug();

class FindMyPartnerDetails extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      errors: {},
      errors1: {},
      partnerData: [],
      markersAddress: [],
      markers: [],
      ratingQuality: '0',
      ratingSpeed: '0',
      ratingCommunication: '0',
      ratingTotalScore: '0',
      quality_of_services: 0,
      speed_of_services: 0,
      communication: 0,
      activeRating: false,
      supportUserInformation: {
        email: this.props.userdata ? this.props.userdata.email : '',
        last_name: this.props.userdata ? this.props.userdata.name : '',
        subject: '',
        message: '',
        phone_number: this.props.userdata ? this.props.userdata.telephone : '',
      },
    }

    this.backUpList = this.backUpList.bind(this);
  }
  supportDataChange = e => {

    let nameType = e.target.name;
    let value = e.target.value;

    this.setState({
      supportUserInformation: {
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

    if (!fields["last_name"]) {
      formIsValid = false;
      errors1["last_name"] = "full name field is required";
    }
    if (!fields["phone_number"]) {
      formIsValid = false;
      errors1["phone_number"] = "phone number field is required";
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
  supportDataChange = e => {

    let nameType = e.target.name;
    let value = e.target.value;

    this.setState({
      supportUserInformation: {
        ...this.state.supportUserInformation,
        [nameType]: value
      }
    });
  }

  componentDidMount() {

    this.backUpList();
    this.getRating();					//
  }

  // componentDidUpdate() {

  //   }


  contactFinePartner = (e) => {

    if (this.supportValidation()) {
      let config = {
        method: 'POST',
         credentials: 'include',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({

          "last_name": this.state.supportUserInformation.last_name,
          "email": this.state.supportUserInformation.email,
          "phone_number": this.state.supportUserInformation.phone_number,
          "oss_admin_id": this.state.partnerData[0].data.email,
          "description": this.state.supportUserInformation.description,
          "menu_type": 'Fine My Partner Contact'

        })
      }

      fetch(ENDPOINTS.SERVER + '/book/a/call', config)
        .then(status => status.json().then(data => ({ data, status })))
        .then(({ data, status }) => {

          alert({
            text: 'You Have Successfully CONTACT A organization',
            type: 'success',
            delay: 800,
            closer: true
          });
          $(".close").trigger('click');
          // $('#findPartnerContact').hide();
          // $('.modal-backdrop').hide();

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

  ratingSave() {

    const orgId = window.location.pathname.split('/')[2];

    const config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({

        "organization_id": orgId,
        "user_id": this.props.userdata ? this.props.userdata.ID : '',
        "quality": parseFloat(this.state.quality_of_services),
        "speed": parseFloat(this.state.speed_of_services),
        "communication": parseFloat(this.state.communication)

      })
    };


    fetch(ENDPOINTS.SERVER + '/organization/rating', config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          $('#header-footer-modal-preview').hide();
          $('.modal-backdrop').hide();
          this.getRating();
        },


      ).catch(error => {

      });
  }
  getRating() {


    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    };
    //const orgId = match.params.id;
    const orgId = window.location.pathname.split('/')[2];
    fetch(ENDPOINTS.SERVER + `/organization/rating?id=${orgId}`, config)

      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          this.state.ratingQuality = result.quality;

          this.state.ratingSpeed = result.speed;
          this.state.ratingCommunication = result.communication;
          this.state.ratingTotalScore = result.total_score;


          this.forceUpdate()




        },

      ).catch(error => {

      });
  }
  backUpList() {


    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    };
    //const orgId = match.params.id;
    const orgId = window.location.pathname.split('/')[2];

    fetch(ENDPOINTS.SERVER + '/organization/' + orgId, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          this.setState({
            partnerData: [result]
          })
         
          // {result.map((gataGet, idx) => {

          Geocode.fromAddress(result.data.address).then(

            (response) => {
           
              const { lat, lng } = response.results[0].geometry.location;

              const { markers } = this.state
              markers.push([lat, lng])
              this.setState({ markers })
              const { markersAddress } = this.state
              markersAddress.push([result.data.address])
              this.setState({ markersAddress })

            },
            (error) => {

            }
          );

          // }
          //)}


        },

      ).catch(error => {

      });
  }

  toggleClass() {
    this.state.activeRating = !this.state.activeRating;


    this.forceUpdate()

    // this.setState({ active: !this.state.active });
  };

  showRatingDetails() {

    $('#superlarge-modal-size-preview').modal('show');;
    //$('.modal-backdrop').hide();
  };


  basicInformationChange = e => {
    let nameType = e.target.name;
    let value = e.target.value;


    if (nameType === 'quality_of_services') {
      this.state.quality_of_services = value;
    }

    if (nameType === 'speed_of_services') {
      this.state.speed_of_services = value;
    }

    if (nameType === 'communication') {
      this.state.communication = value;
    }
    this.forceUpdate()
  }


  render() {
    let { register, fetching, alerts, language } = this.props;
   
    const position = this.state.markers[0]

    const { classes, t } = this.props;
    let greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
      //shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    const orgId = window.location.pathname.split('/')[2];

    const array = this.props.userdata ? this.props.userdata.organization_roles : [];

    const langNode = () => {
      if (array.some(code => code.organization_id === orgId))
        return (<a href="javascript:;" data-toggle="modal" data-target="#header-footer-modal-preview" className="btn btn-primary btn-md btn-default" style={{ lineHeight: '37px', width: '50%' }}>
          {t('landingPage:FindMyPartner.AddRating')}

        </a>
        )

      else
        return ('');
    }

    return (

      <div>

        <main role="main" id="matchmaking">

          <section className="help-section mt-0">
            <div className="row">
              <div className="col-md-12 text-center">
                {t('landingPage:FindMyPartner.Discover')}
              </div>
            </div>
          </section>

          <section style={{ marginTop: '50px', marginBottom: '50px' }}>
            <div className="container">

              <svg width="5" height="11" viewBox="0 0 5 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.86377 1.43188L1.00012 5.43188L3.86377 9.43188" stroke="#B0B7C3" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>&nbsp;&nbsp;&nbsp;&nbsp;
              <Link to={'/find-my-partner'} >
                <span className="sectionTitle" style={{ fontWeight: 'bold', fontSize: '20px', color: '#8A94A6' }}>{t('landingPage:FindMyPartner.Backtothelist')}</span>
              </Link>

            </div>
          </section>
          {this.state.partnerData.map((userInfo, userInfoKey, arr) => {
            let ggg = userInfo.data.services_provided.split(',')
            return (<>
              <section style={{ marginTop: '0px' }}>
                <div className="container">
                  <div className="row " style={{ paddingLeft: '100px' }}>

                    <div className="col-md-8  animate__animated animate__fadeInLeft">


                      <div className="content-style2" style={{ paddingLeft: '0px' }}>
                        <div className="row" >
                          <div className="col-md-6" >
                            <h2 className="sectionTitle" style={{ fontWeight: 'bold', fontSize: '40px', marginTop: '-10px' }}>{userInfo.data.name}</h2>
                          </div>

                          <div className="col-md-3" >
                            <Rating name="half-rating-readO" value={this.state.ratingTotalScore} precision={0.5} readOnly size="large" />

                          </div>
                          <div className="col-md-3" >
                            <a href="javascript:;" data-toggle="modal" data-target="#superlarge-modal-size-preview" onClick={() => this.showRatingDetails()} className="btn btn-primary btn-md btn-default" style={{ lineHeight: '37px' }}>{t('landingPage:FindMyPartner.More')}</a>

                          </div>
                        </div>




                        <p className="mt-3" style={{ fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', color: '#556775', fontFamily: "Open Sans, sans-serif" }}>{t('landingPage:FindMyPartner.TypeofOrganization')}: <span
                          style={{ fontWeight: 'normal', fontSize: '14px', color: '#6B7280' }}>{t(`legalForms.${LEGAL_FORMS[userInfo.data.legal_form]}`)}</span></p>
                        <p className="mt-3" style={{ fontWeight: 'normal', fontSize: '14px', fontFamily: "Open Sans, sans-serif" }}>{userInfo.data.short_summary} </p>

                        <p className="mt-3" style={{ fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', color: '#556775', fontFamily: "Open Sans, sans-serif" }}>{t('landingPage:FindMyPartner.Services')}: <span
                          style={{ fontWeight: 'normal', fontSize: '14px', color: '#6B7280' }}>{userInfo.data.services_provided}</span></p>
                      </div>

                    </div>

                    <div className="col-md-4 ">
                      <center><img src={userInfo.data.logo ? ENDPOINTS.SERVER + userInfo.data.logo : testlogo} alt="" width="302" height="239" /> </center>
                      <br></br>
                      <br></br>
                      <center>{langNode()} </center>

                    </div>
                  </div>
                </div>
              </section>




              {/* <section>
                            <div className="container">
                                <div className="row" style={{paddingLeft: '100px'}}>
                                    <div className="col-md-12" style={{marginBottom:'30px'}}>
                                        <h2 className="sectionTitle" style={{fontWeight: 'bold',fontSize: '18px'}}>Accomplishments</h2>
                                    </div>
                                    <br/>
                                    <br/>
                                    <div className="col-md-4">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <img src={user} alt="" />
                                            </div>
                                            <div className="col-md-9 my-auto">
                                                <label
                                                    style={{fontWeight: 'bold',letterSpacing: '-0.01em',color: '#FFCC00',fontSize: '19.0728px'}}>+900K</label>
                                                <p style={{fontSize: '12px',color: '#6B7280'}}>Customers </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="row ">
                                            <div className="col-md-3">
                                                <img src={location} alt="" />
                                            </div>
                                            <div className="col-md-9 my-auto">
                                                <label
                                                    style={{fontWeight: 'bold',letterSpacing: '-0.01em',color: '#FFCC00',fontSize: '19.0728px'}}>+30</label>
                                                <p style={{fontSize: '12px',color: '#6B7280'}}>Countries </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="row ">
                                            <div className="col-md-3">
                                                <img src={Server} alt="" />
                                            </div>
                                            <div className="col-md-9 my-auto">
                                                <label
                                                   style={{fontWeight: 'bold',letterSpacing: '-0.01em',color: '#FFCC00',fontSize: '19.0728px'}}>+8</label>
                                                <p style={{fontSize: '12px',color: '#6B7280'}}>Buildings </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section> */}

              <section>
                <div className="container">
                  <div className="row row-eq-height" style={{ paddingLeft: '100px' }}>
                    <div className="col-md-6  animate__animated animate__fadeInLeft"
                      style={{ backgroundImage: `url('${maps2}')`, height: '319px' }}>
                      <Map center={position} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                        />
                        {/* <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            /> */}
                        {this.state.markers.map((position, idx) => {
                          return (
                            <Marker key={`marker-${idx}`} position={position} icon={greenIcon}>
                              <Popup>
                                <span>{this.state.markersAddress[idx]}</span>
                              </Popup>
                            </Marker>);
                        }
                        )}


                      </Map>

                    </div>
                    <div className="col-md-6 align-middle my-auto animate__animated animate__fadeInRight">
                      <div className="content-style2">
                        <h3>{t('landingPage:FindMyPartner.Services')} {t('landingPage:Footer.Contact')}</h3>
                        <p className="mt-3" style={{ fontWeight: '600', fontSize: '14px', lineHeight: '24px', color: '#6B7280' }}>
                          {t('landingPage:FindMyPartner.Address')} : <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#6B7280' }}>{userInfo.data.address}</span></p>
                        <p className="mt-3" style={{ fontWeight: '600', fontSize: '14px', lineHeight: '24px', color: '#6B7280' }}>
                          {t('landingPage:SUBSCRIBE.Email')} : <span
                            style={{ fontSize: '12px', fontWeight: 'normal', color: '#6B7280' }}>{userInfo.data.email}</span>
                        </p>
                        <p className="mt-3" style={{ fontWeight: '600', fontSize: '14px', lineHeight: '24px', color: '#6B7280' }}>
                          {t('landingPage:FindMyPartner.Phone')} : <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#6B7280' }}>{userInfo.data.telephone}</span></p>
                        <p className="mt-3" style={{ fontWeight: '600', fontSize: '14px', lineHeight: '24px', color: '#6B7280' }}>
                          Wesite: <a href={userInfo.data.website} target="_blank"><span
                            style={{ fontSize: '12px', fontWeight: 'normal', color: '#6B7280' }}>



                            {userInfo.data.website}</span></a>
                        </p>
                        <br></br>
                        <div className="d-block">
                          <button className="btn btn-primary btn-md btn-default" data-toggle="modal" data-target="#findPartnerContact"
                            style={{ width: '186px', height: '58px', background: '#FDB200', borderRadius: '30px' }}>

                            {t('landingPage:Footer.Contact')}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>


              <section className="calltoactionGray">
                <div className="container">
                  <div className="row  row-eq-height">
                    <div className="col-md-10 mx-auto" style={{ backgroundImage: `url('${Group542}')` }} >
                      <div className="calltoactionContent">
                        <div className="row pt-3 pb-3">
                          <div className="col-12 col-md-8  my-auto">
                            <h3 style={{ color: '#000000' }}>{t('landingPage:FindMyPartner.title')} </h3>
                          </div>
                          <div className="col-12  col-md-4 my-auto text-center ">

                            <Link to={'/residents'} className="btn btn-primary" style={{ background: '#fff', width: '157px', height: '40px', fontStyle: 'normal', fontWeight: 'bold', fontSize: '11.8544px', borderRadius: '26px', padding: '0px 0px', lineHeight: '40px', color: '#F18419' }}>
                              {t('landingPage:individualPrivate.LetStart')}

                            </Link>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>

            );
          })
          }
        </main>
        <Footer />
        <SelectLanguageModel />
                    //Rating Details View
        <div className="modal fade" id="superlarge-modal-size-preview" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-xl modal-dialog-centered" role="document" style={{ maxWidth: '1140px' }}>
            <div className="modal-content" >
              <div className="modal-header" style={{ background: '#FCCB00' }}>
                <h4 className="modal-title"></h4>
                <h5 className="modal-title" style={{ textTransform: 'uppercase', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 'bold', fontSize: '16.1691px', color: '#FFFFFF' }}>{t('landingPage:FindMyPartner.title1')} </h5>

                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                  style={{ padding: '0px', margin: '0px' }}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                  <div className="col-md-12" >
                    <section className="row" style={{ marginTop: '0px', marginBottom: '0px' }}>
                      <div className="container">
                        <div style={{ paddingLeft: '100px', paddingRight: '100px' }} className="row" >


                          <div className="col-md-12" style={{ marginTop: '0px', marginBottom: '10px' }}>
                            <div className="intro-y block sm:flex items-center h-10" style={{ marginTop: '20px' }}>
                              <h2 className="text-lg font-medium truncate mr-5" style={{ fontWeight: 'bold', letterSpacing: '-0.01em', color: 'rgb(0 0 0)', fontSize: '19.0728px' }}>
                                {t('landingPage:FindMyPartner.TotalScore')}
                              </h2>
                              <div className="sm:mt-0 relative text-gray-700 dark:text-gray-300">
                                <Rating name="half-rating-read" value={this.state.ratingTotalScore} precision={0.5} readOnly size="large" style={{ marginLeft: '25px' }} />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4" >
                            <div className="form-group" style={{ marginBottom: '0rem' }}>
                              <span style={{ fontWeight: 'bold', letterSpacing: '-0.01em', color: 'rgb(0 0 0)', fontSize: '19.0728px' }}>{t('landingPage:FindMyPartner.QualityofServices')}   </span>
                              <div style={{ marginTop: '10px' }}>
                                <Rating name="half-rating-read" value={this.state.ratingQuality ? this.state.ratingQuality : "0"} precision={0.5} readOnly size="large" />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4" >
                            <div className="form-group">
                              <span style={{ fontWeight: 'bold', letterSpacing: '-0.01em', color: 'rgb(0 0 0)', fontSize: '19.0728px' }}>{t('landingPage:FindMyPartner.SpeedofServices')} </span>
                              <div style={{ marginTop: '10px' }}>
                                <Rating name="half-rating-read" value={this.state.ratingSpeed} precision={0.5} readOnly size="large" />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4" >
                            <div className="form-group">
                              <span style={{ fontWeight: 'bold', letterSpacing: '-0.01em', color: 'rgb(0 0 0)', fontSize: '19.0728px' }}>{t('landingPage:FindMyPartner.Communication')}  </span>
                              <div style={{ marginTop: '10px' }}>
                                <Rating name="half-rating-read" value={this.state.ratingCommunication} precision={0.5} readOnly size="large" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        // Add Rating
        <div className="modal" id="header-footer-modal-preview">
          <div className="modal__content_rating_add" style={{ width: '75%' }}>

            <center>
              <h2 className="p-3 font-medium text-base mr-auto" style={{ fontSize: '20px', fontWeight: '900' }}> {t('landingPage:FindMyPartner.Rating')}</h2>
            </center>

            <div className="row" style={{ marginRight: '0px', marginLeft: '0px' }}>
              <div className="col-sm-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <div className="p-3 row">
                  <div className="col-sm-12" style={{ marginBottom: '10px' }}>
                    <label className="w-full sm:w-60 sm:text-right sm:mr-5" style={{ width: '60%', textAlign: 'left', fontSize: '13px', fontWeight: '700', marginTop: '-10px', verticalAlign: 'middle' }}>{t('landingPage:FindMyPartner.QualityofServices')} </label>

                    <Rating name="quality_of_services" defaultValue={0} precision={0.5} onChange={(e) => this.basicInformationChange(e)} size="large" />

                  </div>

                  <div className="col-sm-12" style={{ marginBottom: '10px' }}>
                    <label className="w-full sm:w-60 sm:text-right sm:mr-5" style={{ width: '60%', textAlign: 'left', fontSize: '13px', fontWeight: '700', marginTop: '-10px', verticalAlign: 'middle' }}>{t('landingPage:FindMyPartner.SpeedofServices')}</label>

                    <Rating name="speed_of_services" defaultValue={0} precision={0.5} onChange={(e) => this.basicInformationChange(e)} size="large" />

                  </div>

                  <div className="col-sm-12" style={{ marginBottom: '10px' }}>
                    <label className="w-full sm:w-60 sm:text-right sm:mr-5" style={{ width: '60%', textAlign: 'left', fontSize: '13px', fontWeight: '700', marginTop: '-10px', verticalAlign: 'middle' }}>{t('landingPage:FindMyPartner.Communication')}</label>

                    <Rating name="communication" defaultValue={0} precision={0.5} onChange={(e) => this.basicInformationChange(e)} size="large" />

                  </div>

                </div>
              </div>
            </div>

            <div className="px-5 py-3 text-right border-t border-gray-200 dark:border-dark-5">
              <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-1">Cancel</button>
              <button type="button" className="button w-40 bg-theme-1 text-white" onClick={() => this.ratingSave()}>{t('landingPage:FindMyPartner.Rating')} </button>
            </div>
          </div>
        </div>

        <div className="modal fade" id="findPartnerContact" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ width: '416px', height: '540px' }}>
              <div className="modal-header" style={{ background: '#FCCB00' }}>
                <center>
                  <h5 className="modal-title" style={{ padding: '1rem', margin: '-1rem -1rem -1rem 7rem', textTransform: 'uppercase', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 'bold', fontSize: '16.1691px', color: '#FFFFFF' }}>{t('landingPage:Footer.Contact')} </h5>
                </center>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                  style={{ padding: '0px', margin: '0px' }}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <hr className="mb-3" style={{ borderTop: '1px solid #FBC304' }} />
                <div className="row" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                  <div className="col-md-12 mb-2">

                    <input type="text" name="last_name" className="form-control modelTextbox" onChange={(e) => this.supportDataChange(e)} defaultValue={this.props.userdata ? this.props.userdata.name : ''} placeholder={t('translations:auth.fullName')} />
                    <span style={{ color: "red", fontFamily: 'Inter', fontStyle: 'normal', fontweight: '500', fontSize: '10.3482px' }}>{this.state.errors1["last_name"]}</span>
                  </div>
                  <div className="col-md-12 mb-2">

                    <input type="text" name="phone_number" className="form-control modelTextbox" onChange={(e) => this.supportDataChange(e)} defaultValue={this.props.userdata ? this.props.userdata.telephone : ''} placeholder={t('translations:profile.phoneNumber')} />
                    <span style={{ color: "red", fontFamily: 'Inter', fontStyle: 'normal', fontweight: '500', fontSize: '10.3482px' }}>{this.state.errors1["phone_number"]}</span>
                  </div>
                  <div className="col-md-12 mb-2">

                    <input type="text" name="email" className="form-control modelTextbox" onChange={(e) => this.supportDataChange(e)} defaultValue={this.props.userdata ? this.props.userdata.email : ''} placeholder={t('translations:auth.Email')} />
                    <span style={{ color: "red", fontFamily: 'Inter', fontStyle: 'normal', fontweight: '500', fontSize: '10.3482px' }}>{this.state.errors1["email"]}</span>
                  </div>
                  <div className="col-md-12 mb-2">

                    <input type="text" name="subject" className="form-control modelTextbox" onChange={(e) => this.supportDataChange(e)} placeholder={t('translations:suportTitle.Subject')} />
                    <span style={{ color: "red", fontFamily: 'Inter', fontStyle: 'normal', fontweight: '500', fontSize: '10.3482px' }}>{this.state.errors1["subject"]}</span>
                  </div>
                </div>
                <div className="row" style={{ marginLeft: 'auto', marginRight: 'auto' }}>


                  <div className="col-md-12 mb-2">

                    <textarea className="form-control modelTextbox" name="message" rows="4" cols="50" onChange={(e) => this.supportDataChange(e)} placeholder={t('translations:suportTitle.Message')}>  </textarea>
                    <span style={{ color: "red", fontFamily: 'Inter', fontStyle: 'normal', fontweight: '500', fontSize: '10.3482px' }}>{this.state.errors1["message"]}</span>
                  </div>

                </div>

              </div>
              <div className="px-5 py-3 border-t border-gray-200 dark:border-dark-5">
                <center> <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-1">{t('translations:utils.confirmDialogCancel')}</button>
                <button type="button" onClick={(e) => this.contactFinePartner(e)} className="button w-20 bg-theme-1 text-white">{t('translations:suportTitle.Send')}</button></center>
              </div>
            </div>
          </div>
        </div>


      </div>
    )
  }
}


FindMyPartnerDetails.propTypes = {
  // userIsLogged: PropTypes.string.isRequired,
  fetching: PropTypes.bool,
  register: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    userIsLogged: state.user.isAuthenticated,
    fetching: state.user.isFetching,
    didRegister: state.user.didRegister,
    alerts: state.alerts.pending,
    userdata: state.user.profileInfo.data,
    country: state.user.country,
    language: state.user.language,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const redirect = () => ownProps.history.push("/login");

  return {
    register: (creds) => {
      dispatch(registerUser(creds, redirect));
    }
  };
};

export default withRouter(withTranslation('translations')
  (connect(mapStateToProps, mapDispatchToProps)((FindMyPartnerDetails))));
