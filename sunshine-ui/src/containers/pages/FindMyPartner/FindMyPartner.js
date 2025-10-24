import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Chip from '@material-ui/core/Chip';

/// WRAPPERS
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

/// COMPONENTS
import NavMenu from '../../smartcomponents/LandingPageNavContainer';
import NavContainer from '../../smartcomponents/LandingPageNavContainer';
import ProgressBar from '../../../components/utils/ProgressBar';
import Footer from '../LandingPage/Footer';
import SelectLanguageModel from '../../smartcomponents/SelectLanguageModel';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
/// ACTIONS
import { registerUser } from '../../../actions/authentication';
import ENDPOINTS from '../../../constants/endpoints';

import Group610 from '../../../styles/assets/Group610.png';
import mapserchbox from '../../../styles/assets/mapserchbox.png';
import mapzom from '../../../styles/assets/mapzom.png';
import Group3790 from '../../../styles/assets/Group3790.png';
import marketingmaps from '../../../styles/assets/marketingmaps.png';
import { LEGAL_FORMS, isResidentsCommunity } from '../../../constants/legalStatusTypes';
import testlogo from '../../../images/1SUNShiNE_Main_footer.png';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Geocode from "react-geocode";
import FilterOption from './Filter';


const styles = theme => ({
	root: {
	  width: '100%',
	  maxWidth: 360,
	  backgroundColor: theme.palette.background.paper,
	},

  });
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
class FindMyPartner extends React.Component {
	

	handleToggle = value => () => {
		const { checked } = this.state;
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];
	
		if (currentIndex === -1) {
		  newChecked.push(value);
		} else {
		  newChecked.splice(currentIndex, 1);
		}
	
		this.setState({
		  checked: newChecked,
		});

	  };
	handleClick = () => {
		this.setState(state => ({ mainFilter: !state.mainFilter }));
	  };

	  handleClick1 = () => {
		this.setState(state => ({ typeoforganizationOpen: !state.typeoforganizationOpen }));
	  };
	  handleClick2 = () => {
		this.setState(state => ({ typesofservicesOpen: !state.typesofservicesOpen }));
	  };

	  
      getLatLan = () => {
		
		

	  };

	constructor(props) {
		
		super(props);
		this.state = {
			fetching: false,
		  partnerData: [],
		  organization_type:-1,
		  type_of_services: [ "Energy Audits",
		  "Technical Inspections",
		  "Project Design",
		  "Construction"],
		  oss_approved:true,
		  mainFilter: false,
		  typeoforganizationOpen: false,
		  typesofservicesOpen: false,
		  selectedIndex: 1,
		  checked: [0],
		  sort_type:'',
		  markers: [],
		  markersAddress: [],
		  organizationId: [],
		}
		this.organizationTypeChange = this.organizationTypeChange.bind(this);
		this.dataSort = this.dataSort.bind(this);
	  }
	  dataSort= () => {
		this.setState({
			fetching:true,
			
		  }) 

		  this.setState({
			partnerData:this.state.partnerData.sort((a, b) => a.services_provided > b.services_provided ? 1:-1).reverse(),
			fetching:false,
			sort_type:'Services'
			
		  }) 
		  {this.state.partnerData.map((gataGet, idx) => {
								
			Geocode.fromAddress(gataGet.address).then(
				(response) => {
				const { lat, lng } = response.results[0].geometry.location;

				const {markers} = this.state
				markers.push([lat, lng])
				this.setState({markers})
				const {markersAddress} = this.state
				markersAddress.push([gataGet.name])
				this.setState({markersAddress})

				const {organizationId} = this.state
				organizationId.push([gataGet.ID])
				this.setState({organizationId})
				
				
				},
				(error) => {
				
				}
			);

		 }
)}




		
	  };

	  dataNearMeSort= () => {
		this.setState({
			fetching:true,
			
		  }) 
		this.setState({
			partnerData:this.state.partnerData.sort((a, b) => a.services_provided > b.services_provided ? 1:-1),
			fetching:false,
			sort_type:'Near me'
			
		  }) 

		  {this.state.partnerData.map((gataGet, idx) => {
								
			Geocode.fromAddress(gataGet.address).then(
				(response) => {
				const { lat, lng } = response.results[0].geometry.location;

				const {markers} = this.state
				markers.push([lat, lng])
				this.setState({markers})
				const {markersAddress} = this.state
				markersAddress.push([gataGet.name])
				this.setState({markersAddress})

				const {organizationId} = this.state
				organizationId.push([gataGet.ID])
				this.setState({organizationId})
				
				},
				(error) => {
				
				}
			);

		 }
       )}
		
	  };
	  jjjjjjjjj= () => {
		e.preventDefault();
				var _this = $(this);
				$('.sub-menu').not(_this.next('.sub-menu')).slideUp();
				_this.next('.sub-menu').slideToggle();
		
	  };
	  organizationTypeChange (value) {
		
        this.state.organization_type = value
        this.forceUpdate()
        this.backUpList();

    }

	typeOfServicesChange (value) {
		

		if(value === 'All'){
			this.state.type_of_services = [];

		}else{

			if(this.state.type_of_services.includes(value) !== true){
				
                this.state.type_of_services.push(value);

			}else{

				let tttt = this.state.type_of_services.filter(ids => ids !== value);

				// this.setState({
				// 	type_of_services:tttt,
					
				//   }) 
				this.state.type_of_services = tttt
				this.forceUpdate()
				  
				  
			}
			

		}
		
       
        this.forceUpdate()
        this.backUpList();
		
    }

	ossApprovedChange (value) {
	

		if(  this.state.oss_approved === false){
			this.state.oss_approved = true

		}else{

			this.state.oss_approved = false
		}
        
        this.forceUpdate()
        this.backUpList();

    }



	componentDidMount(){            
    
	
		this.backUpList();    
										//
	}
	backUpList(){
		this.setState({
			fetching:true,
			
		  }) 

		const config = {
				method: 'PUT',
				credentials: 'include',
				headers: { 'Content-Type': 'text/plain' },
				body: JSON.stringify({
					"organization_type": this.state.organization_type,
					"type_of_services": String(this.state.type_of_services),
					"oss_approved":this.state.oss_approved,
					"country":this.props.userdata?this.props.userdata.country :  '' 
					//"country":            
				  })
			  };
			
			 
			  fetch(ENDPOINTS.SERVER + '/find/my/partner', config)
				  .then(res => res.json())
				 // .then((result) => result.length ? JSON.parse(text) : {})
				  .then(
					  (result) => {
					   
					
						if (result != null) {
							
							this.state.markers =[];
								   this.state.markersAddress =[];
             
								   this.forceUpdate()
							{result.map((gataGet, idx) => {
								
											Geocode.fromAddress(gataGet.address).then(
												(response) => {
												const { lat, lng } = response.results[0].geometry.location;

												const {markers} = this.state
												markers.push([lat, lng])
												this.setState({markers})
												const {markersAddress} = this.state
												markersAddress.push([gataGet.name])
												this.setState({markersAddress})

												const {organizationId} = this.state
				organizationId.push([gataGet.ID])
				this.setState({organizationId})
											
												},
												(error) => {
												
												}
											);

							             }
							  )}
							 
							
							  this.setState({
								partnerData: result,
								fetching:false,
						           })
							
							  
							}else{
							  this.setState({
								partnerData: [],
								fetching:false,
							})
							 
	  
							}
	  
					  },
					  
				  ).catch(error => {
				    this.setState({
						fetching:false,
						
					  }) 
				});
	  }
	  organizationTypeChangett= (value) => { 
		

		this.setState({
			type_of_services: value,
			
		})
		
        this.backUpList();
		// this.state.organization_type = value
        // 


	  }
	  organizationTypeChangeNew= (value) => {
		
        this.state.organization_type = value
        this.forceUpdate()
        this.backUpList();

    }
	ossApprovedChangeNew = (value) => {
	

		if(  this.state.oss_approved === false){
			this.state.oss_approved = true

		}else{

			this.state.oss_approved = false
		}
		this.state.markers =[]
             
		
        this.forceUpdate()
        this.backUpList();

	// 	 {this.state.partnerData.map((gataGet, idx) => {
								
	// 		Geocode.fromAddress(gataGet.address).then(
	// 			(response) => {
	// 			const { lat, lng } = response.results[0].geometry.location;

	// 			const {markers} = this.state
	// 			markers.push([lat, lng])
	// 			this.setState({markers})
	// 			const {markersAddress} = this.state
	// 			markersAddress.push([gataGet.name])
	// 			this.setState({markersAddress})

	// 			const {organizationId} = this.state
	// 			organizationId.push([gataGet.ID])
	// 			this.setState({organizationId})
				
	// 			},
	// 			(error) => {
				
	// 			}
	// 		);

	// 	 }
    //    )}

		

    }
	render() {
		let { register,fetching, alerts, language } = this.props;
		const { classes,t } = this.props;
		
		const myIcon = L.icon({
			iconUrl: require('../../../styles/assets/Group3790.png'),
			iconSize: [64,64],
			iconAnchor: [32, 64],
			popupAnchor: null,
			shadowUrl: null,
			shadowSize: null,
			shadowAnchor: null
		});
		const position = [56.9496, 24.1052]

		let greenIcon = new L.Icon({
			iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
			//shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		  });

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
					<section style={{ marginTop: '0px' }} >
						<div className="container">
							<div className="row ">
								<div className="col-md-8  ">
									<div className="row" id="filterRadio">
									<div className="col-md-12">	
							         <br/>   
									 <h3 style={{ fontWeight: 'bold',fontSize: '20px',fontFamily: "Open Sans, sans-serif",fontStyle: "normal" }}>{t('landingPage:FindMyPartner.FilterSort')}</h3>
											<hr></hr>
											<br></br>
										<FilterOption t={this.props.t} organizationTypeChange={this.organizationTypeChangett} organizationTypeChangeNew={this.organizationTypeChangeNew}  dataSort={this.dataSort} dataNearMeSort={this.dataNearMeSort} ossApprovedChangeNew={this.ossApprovedChangeNew}></FilterOption>																		
										     
									
								</div>													
							<div className="col-md-12">
								<hr/>
							</div>
						</div>

					
	         <div className="row " style={{ 	height: '900px',overflow: 'auto' }}>
								<div className="col-md-12  ">
									{this.state.fetching?
                                              <ProgressBar />
                                             :
                                            <>											
									{this.state.partnerData.map((userInfo,userInfoKey, arr) => {
                                    return (<>                                                                         
									<div className="row mb-2 mt-2" key={userInfoKey}>
											<div className="col-md-4 mb-2" style={{ display: 'flex',justifyContent: 'center' }}>
											 {/* <Link to={'/find-my-partner/' + userInfo.ID} > */}
													<img src={userInfo.logo ?ENDPOINTS.SERVER +userInfo.logo:testlogo} alt="" style={{ margin: 'auto'}}/>
                                              {/* </Link>										 */}
											</div>
											<div className="col-md-8 mb-2 mt-2 align-middle my-auto animate__animated animate__fadeInRight">
											<Link to={'/find-my-partner/' + userInfo.ID} >
												<div className="content-style2">
													<p className="mt-1">{t(`legalForms.${LEGAL_FORMS[userInfo.legal_form]}`) }</p>
													<h2 className="sectionTitle" style={{ fontWeight: 'bold', fontSize: '20px',textAlign: 'left',marginBottom: '0px' ,lineHeight: '20px'}} >{userInfo.name}
													</h2>
													<p className="mt-1 mb-4" style={{ fontWeight: 'normal', fontSize: '14px' ,textAlign: 'left',marginTop: '-10px'}}> {userInfo.short_summary} </p>
													{/* <ul className="rating-icons">
														<li>
															<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
																fill="#FDB200" className="bi bi-star-fill" viewBox="0 0 18 18">
																<path
																	d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
															</svg>
														</li>
														<li style={{ fontWeight: 'bold', fontSize: '14px', color: '#383C3D', lineHeight: '29PX' }} >
															4,5
														</li>
														<li style={{ fontWeight: 'bold', fontSize: '14px', color: '#383C3D', lineHeight: '29PX' }} >
															(4 Reviews)
														</li>
													</ul> */}
												</div>
												</Link>
											</div>
											
											</div>   
											<hr />                                
										</>
										);
									})
									}
									</>
                                }
								</div>
								</div>
								</div>
								<div className="col-md-4 ">
									<div className="col-md-12  " style={{height: '1000px' }}>

											<Map center={position} zoom={13} scrollWheelZoom={true}  zoomControl={true}
														touchZoom={true}
														boxZoom={true}
														keyboard={true}
														doubleClickZoom={true}													
														dragging={true}
														zoomSnap={0.1}	
														>


									<TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
												attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
												/>

                                          
											{this.state.markers.map((position, idx) => {                                           
                                                     return (
														<Marker key={`marker-${idx}`} position={position} icon={greenIcon}>
														<Popup>
															<span>{this.state.markersAddress[idx]}</span>
															<br></br>
															<br></br>
															
															<span><Link to={'/find-my-partner/' + this.state.organizationId[idx]} >{t('landingPage:slider.learnMore')}</Link></span>
														</Popup>
														</Marker>);
														}
													)}																					
                                        </Map>
									</div>
								</div>
							</div>
						</div>
					</section>




				</main>
				<Footer />
				<SelectLanguageModel />
			</div>
		)
	}
}

FindMyPartner.propTypes = {
	// userIsLogged: PropTypes.string.isRequired,
	fetching: PropTypes.bool,
	register: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
	return {
		userIsLogged: state.user.isAuthenticated,
		fetching: state.user.isFetching,
		didRegister: state.user.didRegister,
		alerts: state.alerts.pending,
		 menus: state.oss_menus,
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

export default  withStyles(styles)(withRouter(withTranslation('translations')
	(connect(mapStateToProps, mapDispatchToProps)((FindMyPartner)))));


