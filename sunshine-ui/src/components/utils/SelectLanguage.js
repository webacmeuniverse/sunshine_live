import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';
import SelectLanguageModel from '../../containers/smartcomponents/SelectLanguageModel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';


import { LV, EN, BG, SK, AT, RO, PL,GER,IT,PT,FR } from './SVGflags';
import language_icon from '../../styles/assets/images/language-icon.png';
class SelectLanguage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  popupOpen = () => {
    $('#exampleModalCenter').modal('show');
    $('.modal-backdrop').hide();
    $(".modal").css("background-color","rgb(20 19 19 / 46%)");
  };

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    // this.setState({
    //   open: true,
    //   anchorEl: event.currentTarget,
    // });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    let { toggleLanguage, lang ,country} = this.props;

    const handleSelect = (lng) => {
      this.handleRequestClose();
      toggleLanguage(lng);
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
        else if (lang.includes('fr'))
        return (<FR width={21} height={21} padding={0} />);  
      else 
        return (<img src={language_icon} alt=""style={{maxWidth: 'unset'}} />);
    }

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
  
    return (
      <>
     
     {/* <span style={{ textTransform: 'uppercase',display: 'inline-block',lineHeight: '64px',fontFamily: 'Inter',fontStyle: 'normal',fontWeight: '600',fontSize: '11.50833px',color: 'rgba(35, 31, 32, 0.5)' }}>
                            {lang} 
                            
                            </span>  */}
        <IconButton onClick={() => this.popupOpen()}
        
        >
           
          {lang && langNode()}
        </IconButton>
        <Menu
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleRequestClose}
        >
          <MenuItem onClick={() => handleSelect("bg")}>
            <ListItemIcon>
              <BG width={21} height={21} padding={0} />
            </ListItemIcon>
            &nbsp;&nbsp; Bulgarian
          </MenuItem>
          <MenuItem onClick={() => handleSelect("en")}>
            <ListItemIcon>
              <EN width={21} height={21} padding={0} />
            </ListItemIcon>
            &nbsp;&nbsp; English
          </MenuItem>
          <MenuItem onClick={() => handleSelect("lv")}>
            <ListItemIcon>
              <LV width={21} height={21} padding={0} />
            </ListItemIcon>
            &nbsp;&nbsp; Latvian
          </MenuItem>
          <MenuItem onClick={() => handleSelect("sk")}>
            <ListItemIcon>
              <SK width={21} height={21} padding={0} />
            </ListItemIcon>
            &nbsp;&nbsp; Slovak
          </MenuItem>
          <MenuItem onClick={() => handleSelect("at")}>
            <ListItemIcon>
              <AT width={21} height={21} padding={0} />
            </ListItemIcon>
            &nbsp;&nbsp; Austrian
          </MenuItem>
          <MenuItem onClick={() => handleSelect("ro")}>
            <ListItemIcon>
              <RO width={21} height={21} padding={0} />
            </ListItemIcon>
            &nbsp;&nbsp; Romanian
          </MenuItem>
          <MenuItem onClick={() => handleSelect("pl")}>
            <ListItemIcon>
              <PL width={21} height={21} padding={0} />
            </ListItemIcon>
            &nbsp;&nbsp; Polish
          </MenuItem>
        </Menu>
     
       <SelectLanguageModel />
       </>
    );
  }
}

SelectLanguage.propTypes = {
  toggleLanguage: PropTypes.func.isRequired,
  lang: PropTypes.string
};

export default withTranslation('translations')(SelectLanguage);
