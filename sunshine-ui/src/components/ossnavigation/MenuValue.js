import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
 
  Divider
 
} from '@material-ui/core';
import {
  Home as HomeIcon,
  BusinessCenter as OrganizationIcon,
  Business as AssetIcon,
  Equalizer as ProjectIcon,
  Security as AdminIcon,
  TableChart as TableChartIcon,

} from '@material-ui/icons';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import DescriptionIcon from '@material-ui/icons/Description';
import { access as hasAccess } from '../../utils/can';
import { hasChildren } from "./utils";
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';



const menuItems = [
  {
    url: '/dashboard',
    exact: true,
    titleKey: 'translations:ossMenu.Dashboard',
    icon: <HomeIcon />,

  },
  
  {
    url: '/organizations',
    matchеsRegExp: new RegExp('^/organization'),
    titleKey: 'translations:ossMenu.Organization',
    icon: <OrganizationIcon />,
  },
  {
    url: '/assets',
    matchеsRegExp: new RegExp('^/assets'),
    titleKey: 'translations:ossMenu.Assets',
    icon: <HomeWorkIcon />,
  },
  // {
  //   url: '/serviceoperator',
  //   matchеsRegExp: new RegExp('^/serviceoperator'),
  //   titleKey: 'Service Operator',
  //   icon: <OrganizationIcon />,
  // },

  {
    url: '/projects',
    matchеsRegExp: new RegExp('^/project'),
    titleKey: 'translations:ossMenu.Projects',
    icon: <ProjectIcon />,
    authCheck: 'loggedin',


  },
  
  {
   
    
    titleKey: 'translations:ossMenu.SimulationTools',
    icon: <HomeIcon />,
    authCheck: {ossAdmin:true,admin: false},
    items: [
      {
        url: '/oss/eesCalculator',
        exact: true,
        titleKey: 'translations:ossMenu.RenovationCostCalculator',
        icon: <HomeIcon />,
      },
      {
        url: '/calculator',
        exact: true,
        titleKey: 'translations:ossMenu.BuildingCalculator',
        icon: <HomeIcon />,
      },
      {
        url: '/oss/ees-checklist',
        exact: true,
        titleKey: 'translations:ossMenu.EESChecklist',
        icon: <HomeIcon />,
      },
      
      {
        url: '/oss/simulation/refinancability-Checklist',
        exact: true,
        titleKey: 'translations:ossMenu.EESRefinanceabilityChecklist',
        icon: <HomeIcon />,
      },
     
     


    ]

  },

  {
    url: '/',
    exact: true,
    titleKey: 'translations:ossMenu.Onboarding',
    icon: <HomeIcon />,
    authCheck: { ossAdmin:true },
    items: [
      {
        url: '/oss/onboarding/residents',
        exact: true,
        titleKey: 'translations:ossMenu.Resident',
        icon: <HomeIcon />,
      },
      {
        url: '/oss/onboarding/housing',
        exact: true,
        titleKey: 'translations:ossMenu.HousingAssociation',
        icon: <HomeIcon />,
      },


      {
        url: '/oss/onboarding/operator',
        exact: true,
        titleKey: 'translations:ossMenu.Operator',
        icon: <HomeIcon />,
      },
      
      


    ]

  },
// Admin Menu

{
  url: '/oss/onboarding/records',
  matchеsRegExp: new RegExp('^/oss/onboarding/records'),
  titleKey: 'translations:ossMenu.Records',
  icon: <ProjectIcon />,
  authCheck: {ossAdmin:true },


},
  

  {
    url: '/oss/onboarding/backup',
    matchеsRegExp: new RegExp('^/oss/onboarding/backup'),
    titleKey: 'translations:ossMenu.Backup',
    icon: <ProjectIcon />,
    authCheck: { ossAdmin:true},


  },
  // {
  //   url: '/reports',
  //   matchеsRegExp: new RegExp('^/reports'),
  //   titleKey: 'translations:ossMenu.ReportingModule',
  //   icon: <ProjectIcon />,
  //   authCheck: 'loggedin',


  // },

  {
    url: '/oss/support',
    matchеsRegExp: new RegExp('^/support'),
    titleKey: 'translations:ossMenu.Support',
    icon: <ProjectIcon />,
    authCheck: { ossAdmin:true },


  },
  {
    url: '/user/support',
    matchеsRegExp: new RegExp('^/support'),
    titleKey: 'translations:ossMenu.Support',
    icon: <ProjectIcon />,
    authCheck: 'loggedin',


  },
  {
    divider: true,
    authCheck: 'loggedin',
  },
  {
    url: '/reports',
    titleKey: 'translations:ossMenu.Report',
    icon: <TableChartIcon />,
    authCheck: 'loggedin',

    //authCheck: { admin: true, countryRole: ['country_admin'] },
  },
  {
    url: '/admin',
    titleKey: 'translations:ossMenu.Admin',
    icon: <AdminIcon />,
    authCheck: { admin: true, countryRole: ['country_admin'] },
  },
  {
    url: '/onboarding',
    matchеsRegExp: new RegExp('^/onboarding'),
    titleKey: 'translations:ossMenu.Onboarding',
    icon: <ProjectIcon />,
    authCheck: { admin: true, countryRole: ['country_admin'] },
  },
  {
    url: '/simulationTools',
    matchеsRegExp: new RegExp('^/simulationTools'),
    titleKey: 'translations:ossMenu.SimulationTools',
    icon: <ProjectIcon />,
    authCheck: { admin: true, countryRole: ['country_admin'] },
  },
  
];


const MenuValue = (props) => {
 
  return menuItems.map((item, key) =>{
 
    if (!hasAccess(props.user, item.authCheck)) {
    return null;
  }
  if (item.divider) {
    return <Divider variant="middle" key={key} />;
  }

  if (item.url == '/user/support' && props.user.isOssAdmin == false && props.user.isSuperUser == false) {
    return <MenuItem key={key} item={item} />;
  }else if(item.url == '/user/support' && props.user.isOssAdmin == true ){

    return '';
  }else if(item.url == '/user/support' && props.user.isSuperUser == true ){

    return '';
  }
  else{
    return <MenuItem key={key} item={item} />;

  }
   
    });
}



const MenuItem = ({ item }) => {
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return <Component item={item} />;
};

const SingleLevel = ({item}) => {
  const { t } = useTranslation('translations');
  return (
    <li>
    <ListItem button component={NavLink} className="side-menu" to={item.url}  exact={Boolean(item.exact)}>
      <ListItemIcon className="side-menu__icon">{item.icon}</ListItemIcon>
      <ListItemText className="side-menu__title" primary={t(item.titleKey)}  />
    </ListItem>
    </li>
  );
};

const MultiLevel = ({ item }) => {
  const { items: children } = item;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };
  const { t } = useTranslation('translations');
  return (
    <React.Fragment>
       <li >
      <ListItem button onClick={handleClick}  className="side-menu"  exact={Boolean(item.exact)}>
        <ListItemIcon className="side-menu__icon">{item.icon}</ListItemIcon>
        <ListItemText className="side-menu__title" primary={t(item.titleKey)} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      
      <Collapse in={open} timeout="auto" unmountOnExit >
       <ul className="side-menu__sub-open" >
        <List component="li"  disablePadding style={{ marginLeft:'14PX' }}>
          {children.map((child, key) => (
           
              <MenuItem key={key} item={child}
              className="side-menu"
           
            component={NavLink}
            to={child.url}
            exact={Boolean(child.exact)} />
           
          ))}
        </List>
        </ul>
      </Collapse>
      
      </li>
    </React.Fragment>
  );
};

export { MenuValue };
