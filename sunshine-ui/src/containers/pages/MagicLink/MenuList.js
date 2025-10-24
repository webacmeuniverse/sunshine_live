import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withTranslation } from 'react-i18next';

import Chip from '@material-ui/core/Chip';

/// WRAPPERS
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

/// COMPONENTS
import NavMenu from '../../smartcomponents/LandingPageNavContainer';
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
import Group3814 from '../../../styles/assets/Group3814.png';
import Union from '../../../styles/assets/Union.png';
import user from '../../../styles/assets/user.png';


const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },

});

class FindMyPartner extends React.Component {


    render() {

        const { classes,t } = this.props;

      


        return (
            <div>
                <main role="main">
                    <div className="row row-eq-height">
                        <div className="col-md-6 text-center"
                            style={{ background: '#FFFFFF', marginLeft: 'auto', paddingRight: '0px', paddingLeft: '0px', marginRight: 'auto' }}>


                         
                            <section id="steps7">
                                <div className="container">

                                    <div className="row mt-5 mb-5">
                                        <div className="col-md-10" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                            <div className="mb-5">
                                                <h2 className="sectionTitle" style={{ fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '600', fontSize: '26px', lineHeight: '39px', textAlign: 'center', color: '#556775' }}>
                                                {t('landingPage:MyProjectStatus.MyprojectstatusTitle')}
                                                    
                                                
                                                </h2>
                                                <p className="font-weight-bold mb-0 mt-3" style={{
                                                    fontFamily: 'Inter',
                                                    fontStyle: 'normal',
                                                    fontWeight: 'normal',
                                                    fontSize: '16px',
                                                    lineHeight: '24px',
                                                    color: '#6B7280', textAlign: 'left',
                                                    textAlign: 'center'
                                                }}>
                                                    {t('landingPage:MyProjectStatus.title')}
                                                    </p>
                                                
                                            </div>
                                            <Link to="/register" >
                                            
                                                <div className="widBox1 mb-3">

                                                    <div className="row">
                                                        <div className="col-2 ">
                                                            <img src={Group3814} alt="EUROPA" style={{ marginTop: '7px' }} />

                                                        </div>
                                                        <div className="col-8 ">
                                                            <h4>{t('landingPage:MyProjectStatus.NewUser')}  </h4>



                                                        </div>
                                                        <div className="col-2 ">
                                                            <img src={Union} alt="EUROPA" style={{ marginTop: '12px' }} />

                                                        </div>

                                                    </div>


                                                </div>
                                                </Link>
                                                
                                                <Link to="/sign-in-with-otp" >
                                                <div className="widBox2 mb-3">

                                                    <div className="row">
                                                        <div className="col-2 ">
                                                            <img src={user} alt="EUROPA" style={{ marginTop: '7px' }} />

                                                        </div>
                                                        <div className="col-8 ">
                                                            <h4>{t('landingPage:MyProjectStatus.Signinwithotp')}  </h4>

                                                        </div>

                                                        <div className="col-2 ">
                                                            <img src={Union} alt="EUROPA" style={{ marginTop: '12px' }} />

                                                        </div>
                                                    </div>


                                                </div>
                                                </Link>

                                            <Link to="/login" >
                                                <div className="widBox2 mb-3">

                                                    <div className="row">
                                                        <div className="col-2 ">
                                                            <img src={user} alt="EUROPA" style={{ marginTop: '7px' }} />

                                                        </div>
                                                        <div className="col-8 ">
                                                            <h4>{t('landingPage:MyProjectStatus.Login')} </h4>


                                                        </div>

                                                        <div className="col-2 ">
                                                            <img src={Union} alt="EUROPA" style={{ marginTop: '12px' }} />

                                                        </div>
                                                    </div>


                                                </div>
                                                </Link>
                                        </div>


                                    </div>

                                </div>

                            </section>

                        </div>


                    </div>


                </main>
                <Footer />
                <SelectLanguageModel />
            </div>
        )
    }
}




export default withStyles(styles)(withRouter(withTranslation('translations')
    ((FindMyPartner))));


