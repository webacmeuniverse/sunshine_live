import React from 'react';
import { connect } from 'react-redux';
import { useLocation, useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Tabs,
  Tab,
  makeStyles,
} from '@material-ui/core';

import { canEditEntity } from '../../../utils/can';
import AdminTable from '../AdminTable/AdminTable';
import UserRoleBadge from '../../utils/UserRoleBadge';
import Tooltip from '../../utils/TooltipWrapper';
import { legalForms } from '../../../constants/legalStatusTypes';
import { assetTypeOptions } from '../../../constants/assetTypes';
import { projectPhases, validationStatuses } from '../../../constants/statusTypes';
import { countries } from '../../../constants/countries';
import PlatformRoles from '../PlatformRoles/PlatformRoles';
import Documents from '../Documents/Documents';
import styles from './styles';

const useStyles = makeStyles(styles);

const tabs = [
  { label: 'Required Approvals', labelKey: 'navigation.requiredApprovals', path: '/admin/documents' },
  { label: 'Users', labelKey: 'navigation.users', path: '/admin/users' },
  { label: 'Organizations', labelKey: 'navigation.organizations', path: '/admin/organizations' },
  { label: 'Assets', labelKey: 'navigation.assets', path: '/admin/assets' },
  { label: 'Projects', labelKey: 'navigation.projects', path: '/admin/projects' },
  { label: 'Platform roles', labelKey: 'navigation.platformRoles', path: '/admin/roles' },
];

function AdminTabs(props) {
  const { user } = props;

  const classes = useStyles();
  const { t } = useTranslation('translations');
  const h = useHistory();
  const { pathname } = useLocation();

  let tabContent;
  switch (pathname) {
    case '/admin/roles':
      tabContent = <PlatformRoles />;
      break;
    case '/admin/users':
      tabContent = (
        <AdminTable
          type="user"
          filters={[
            { label: t('assets.country'), name: 'country', options: countries },
          ]}
          itemRenderer={(entity) => <UserRoleBadge user={entity.data} />}
          wrapperRenderer={(wrapperProps) => {
            return (
              <EntityWrapper
                {...wrapperProps}
                user={user}
                title='errors.adminUserCountryNotAllowed'
              />
            );
          }}
          getLinkProps={(entity) => ({ disabled: !canEditEntity(user, entity, true) })}
        />
      );
      break;
    case '/admin/organizations':
      tabContent = (
        <AdminTable
          type="organization"
          filters={[
            { label: t('assets.country'), name: 'country', options: countries },
            { label: t('organizations.legalForm'), name: 'legal_form', options: legalForms(t, true) },
            { label: t('organizations.status'), name: 'status', options: validationStatuses(t) },
          ]}
          wrapperRenderer={(wrapperProps) => (
            <EntityWrapper
              {...wrapperProps}
              user={user}
              title='errors.adminEntityCountryNotAllowed'
              skip
            />
          )}
          getLinkProps={(entity) => ({ disabled: !canEditEntity(user, entity, true) })}
        />
      );
      break;
    case '/admin/assets':
      tabContent = (
        <AdminTable
          type="asset"
          filters={[
            { label: t('assets.country'), name: 'country', options: countries },
            { label: t('assets.assetType'), name: 'building_type', options: assetTypeOptions },
            { label: t('organizations.status'), name: 'status', options: validationStatuses(t) },
          ]}
          wrapperRenderer={(wrapperProps) => (
            <EntityWrapper
              {...wrapperProps}
              user={user}
              title='errors.adminEntityCountryNotAllowed'
              skip
            />
          )}
          getLinkProps={(entity) => ({ disabled: !canEditEntity(user, entity, true) })}
        />
      );
      break;
    case '/admin/projects':
      tabContent = (
        <AdminTable
          type="project"
          filters={[
            { label: t('assets.country'), name: 'country', options: countries },
            { label: t('projects.projectPhase'), name: 'state', options: projectPhases(t) },
          ]}
          wrapperRenderer={(wrapperProps) => (
            <EntityWrapper
              {...wrapperProps}
              user={user}
              title='errors.adminEntityCountryNotAllowed'
              skip
            />
          )}
          getLinkProps={entity => ({ disabled: !canEditEntity(user, entity, true) })}
        />
      );
      break;
    default:
      tabContent = <Documents />;
  }

  let currentTabIDX = 0;
  for (let i = 0; i < tabs.length; i++) {
    if (pathname === tabs[i].path) {
      currentTabIDX = i;
      break;
    }
  }

  return (
    <React.Fragment>
      <AppBar position="static" color="default" classes={{ root: classes.header }}>
        <Tabs
          value={currentTabIDX}
          variant="scrollable"
          classes={{
            root: classes.root,
            indicator: classes.indicator,
          }}
        >
          {tabs.map(({ labelKey, path }) => (
            <Tab
              key={path}
              label={t(labelKey)}
              onClick={() => {
                h.push(path);
              }}
              className={classes.tabLabelStyle}
            />
          ))}
        </Tabs>
      </AppBar>
      <div className={classes.tabsContainer}>
        <div className={classes.tabsContainerInner}>
          {tabContent}
        </div>
      </div>
    </React.Fragment>
  );
}

function EntityWrapper(props) {
  const {
    user,
    entity,
    title,
    skip,
  } = props;

  const { t } = useTranslation('translations');

  if (!canEditEntity(user, entity, skip)) {
    return (
      <Tooltip title={t(title, { entity: entity.type })}>
        {props.children}
      </Tooltip>
    );
  }

  return (
    <React.Fragment>{props.children}</React.Fragment>
  );
}

export default connect(
  state => ({
    user: state.user,
  }),
)(AdminTabs);
