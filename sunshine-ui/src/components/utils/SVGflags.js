import React from 'react';

import gbFlag from './../../images/flags/english.svg';
import latviaFlag from './../../images/flags/latvia.svg';
import bulgarianFlag from '../../images/flags/bulgaria.svg';
import slovakFlag from '../../images/flags/slovak.png';
import austrianFlag from '../../images/flags/austria.svg';
import romanianFlag from '../../images/flags/romania.svg';
import polishFlag from '../../images/flags/poland.svg';
import europeanFlag from '../../images/flags/europe.svg';
import GermanFlag from '../../images/flags/germany.svg';
import ItalyFlag from '../../images/flags/italy.svg';
import PortugalFlag from '../../images/flags/portugal.svg';
import FrenchFlag from '../../images/flags/french.svg';

export const LV = ({ alt, width, height, padding, style, className }) => (
  <img src={latviaFlag} alt={alt} className={className} style={{
    width: `${width - padding}px`,
    height: `${height - padding}px`,
    padding: `${padding}px`,
    ...style
  }} />
);

export const EN = ({ alt, width, height, padding, style, className }) => (
  <img src={gbFlag} alt={alt} className={className} style={{
    width: `${width - padding}px`,
    height: `${height - padding}px`,
    padding: `${padding}px`,
    ...style
  }} />
);

export const BG = ({ alt, width, height, padding, style, className }) => (
  <img src={bulgarianFlag} alt={alt} className={className} style={{
    width: `${width - padding}px`,
    height: `${height - padding}px`,
    padding: `${padding}px`,
    ...style
  }} />
);

export const SK = ({ alt, width, height, padding, style, className }) => (
  <img src={slovakFlag} alt={alt} className={className} style={{
    width: `${width - padding}px`,
    height: `${height - padding}px`,
    padding: `${padding}px`,
    ...style
  }} />
);

export const AT = ({ alt, width, height, padding, style, className }) => (
  <img src={austrianFlag} alt={alt} className={className} style={{
    width: `${width - padding}px`,
    height: `${height - padding}px`,
    padding: `${padding}px`,
    ...style
  }} />
);

export const RO = ({ alt, width, height, padding, style, className }) => (
  <img src={romanianFlag} alt={alt} className={className} style={{
    width: `${width - padding}px`,
    height: `${height - padding}px`,
    padding: `${padding}px`,
    ...style
  }} />
);

export const PL = ({ alt, width, height, padding, style, className }) => (
  <img src={polishFlag} alt={alt} className={className} style={{
    width: `${width - padding}px`,
    height: `${height - padding}px`,
    padding: `${padding}px`,
    ...style
  }} />
);

export const EU = ({ alt, width, height, padding, style, className }) => (
  <img src={europeanFlag} alt={alt} className={className} style={{
    width: `${width - padding}px`,
    height: `${height - padding}px`,
    padding: `${padding}px`,
    ...style
  }} />
);

export const GER = ({ alt, width, height, padding, style, className }) => (
  <img src={GermanFlag} alt={alt} className={className} style={{
    width: `${width - padding}px`,
    height: `${height - padding}px`,
    padding: `${padding}px`,
    ...style
  }} />
);

export const IT = ({ alt, width, height, padding, style, className }) => (
  <img src={ItalyFlag} alt={alt} className={className} style={{
    width: `${width - padding}px`,
    height: `${height - padding}px`,
    padding: `${padding}px`,
    ...style
  }} />
);

export const PT = ({ alt, width, height, padding, style, className }) => (
  <img src={PortugalFlag} alt={alt} className={className} style={{
    width: `${width - padding}px`,
    height: `${height - padding}px`,
    padding: `${padding}px`,
    ...style
  }} />
);


export const FR = ({ alt, width, height, padding, style, className }) => (
  <img src={FrenchFlag} alt={alt} className={className} style={{
    width: `${width - padding}px`,
    height: `${height - padding}px`,
    padding: `${padding}px`,
    ...style
  }} />
);

export function CountryFlag({ country }) {
  const flagProps = { width: 31, height: 21, padding: 0 };

  switch (country) {
    case 'England':
      return <EN {...flagProps} />;
    case 'Latvia':
      return <LV {...flagProps} />;
    case 'Bulgaria':
      return <BG {...flagProps} />;
    case 'Slovakia':
      return <SK {...flagProps} />;
    case 'Austria':
      return <AT {...flagProps} />;
    case 'Romania':
      return <RO {...flagProps} />;
    case 'Poland':
      return <PL {...flagProps} />;
    case 'Italy':
        return <IT {...flagProps} />;  
    case 'Germany':
          return <GER {...flagProps} />; 
    case 'Portugal':
          return <PT {...flagProps} />;
    case 'France':
          return <FR {...flagProps} />;     
    case 'Spain':
            return <FR {...flagProps} />;      
    case 'Lithuania':
              return <FR {...flagProps} />; 
    default:
      return <EU {...flagProps} />;
  }
}
