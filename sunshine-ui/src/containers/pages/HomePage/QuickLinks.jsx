import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Grid,
  Paper,
  makeStyles,
} from '@material-ui/core';

import ImageTypePicker from './../../../components/utils/ImageTypePicker';
import infoTypes from './../../../constants/infoTypes';
import aboutUsLat from './../../../images/Rokasgramata_LAT_final.pdf';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.background.paper,
    display: 'inline-block',
    width: '100%',
    height: '100%',
    textDecoration: 'none',
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: 16,
  },
  imageTypePicker: {
    padding: `${theme.spacing(4)}px 0`,
    height: '100%',
  },
  homeGrid: {
    '& .MuiGrid-grid-lg-1': {
      maxWidth: '14%',
      flexBasis: '14%',
    },
  },
}));

// const aboutUsEng = 'http://ekubirojs.lv/wp-content/uploads/2021/03/D2-05_Handbook_BuildingDeepRenovation-EN.pdf';

let imageLinks = {
  new: { href: 'http://ekubirojs.lv/wp-content/uploads/2021/03/D2-05_Handbook_BuildingDeepRenovation-EN.pdf', target: '_blank', rel: 'noopener noreferrer' },
  funding: { href: 'https://fcubed.eu/beef/', target: '_blank', rel: 'noopener noreferrer' },
  participate: { to: '/calculator' },
  costs: { to: '/financial-calculator' },
  demo: { href: 'mailto:info@fcubed.eu', target: '_blank', rel: 'noopener noreferrer' },
  support: { href: 'mailto:sunshinehelp@ekubirojs.lv', target: '_blank', rel: 'noopener noreferrer' },
  manual: { href: 'https://drive.google.com/file/d/1stbdZiHXk7wvMOebe0alEEYoN83nlW06/view', target: '_blank', rel: 'noopener noreferrer'  },
};

function QuickLinks() {
  const { t } = useTranslation('translations');
  const classes = useStyles();
  const iLang = window.localStorage.getItem('i18nextLng');
  if (iLang === 'lv') {
    imageLinks = {
      ...imageLinks,
      new: { href: aboutUsLat, target: '_blank', rel: 'noopener noreferrer' },
    };
  } else {
    imageLinks = {
      ...imageLinks,
      new: { href: 'http://ekubirojs.lv/wp-content/uploads/2021/03/D2-05_Handbook_BuildingDeepRenovation-EN.pdf', target: '_blank', rel: 'noopener noreferrer' },
    };
  }

  return (
    <Grid container item spacing={2} className={classes.homeGrid} >
      {
        Object.keys(infoTypes).map((type) => {
          return (
            <Grid item lg={1} md={2} sm={4} xs={6} key={type}>
              <Paper
                component={imageLinks[type].to ? Link : 'a'}
                className={classes.button}
                {...imageLinks[type]}
              >
                <ImageTypePicker
                  rootClass={classes.imageTypePicker}
                  imgStyle={{ height: '50px', width: '50px', marginBottom: '10px' }}
                  text={t(`info.${type}`)}
                  imgSrc={infoTypes[type]}
                />
              </Paper>
            </Grid>
          );
        })
      }
    </Grid>
  );
}

export default QuickLinks;
