import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';

import useFetching from '../../../utils/useFetching';
import sortByKey from '../../../utils/sortByKey';
import { getProjectPhase } from '../../../constants/milestones';
import { countriesMap } from '../../../constants/countries';
import SearchAndFilter from '../../../containers/smartcomponents/SearchAndFilter';
import Loader from '../../utils/Loader';
import { CountryFlag } from '../../utils/SVGflags';
import { parseAddress } from '../../asset/utils';
import { getAllUsers as getUsersAction } from '../../../actions/users';
import { getAllOrganizations as getOrganizationsAction } from '../../../actions/organizations';
import { getAllAssets as getAllAssetsAction } from '../../../actions/assets';
import { getAllProjects as getAllProjectsAction } from '../../../actions/projects';

import styles from './styles';

const useStyles = makeStyles(styles);

const typesActionsMap = {
  user: getUsersAction,
  organization: getOrganizationsAction,
  asset: getAllAssetsAction,
  project: getAllProjectsAction,
};

const typesContentMap = {
  user: (state) => {
    return {
      loading: state.users.isUsersFetching,
      nodes: sortByKey(state.users.users?.documents, 'name') || [],
    };
  },
  organization: (state) => {
    return {
      loading: state.organization.isFetchingList,
      nodes: sortByKey(state.organization.allOrganizations, 'name') || [],
    };
  },
  asset: (state) => {
    return {
      loading: state.asset.isFetchingList,
      nodes: sortByKey(state.asset.allAssets, 'address') || [],
    };
  },
  project: (state) => {
    return {
      loading: state.project.isFetchingList,
      nodes: sortByKey(state.project.allProjects, 'name', 'desc') || [],
    };
  },
};

function AdminTable(props) {
  const {
    filters,
    type,
    getLinkProps,
    wrapperRenderer,
    itemRenderer,
    users,
    organization,
    asset,
    project,
  } = props;

  const classes = useStyles();
  const dispatch = useDispatch();

  const fetchFn = typesActionsMap[type];
  useFetching(fetchFn);
  const onFilterChange = useCallback((params) => {
    if (params?.country) {
      params.country = encodeURIComponent(countriesMap[params.country]);
    }
    dispatch(fetchFn(params));
  }, [dispatch, fetchFn]);

  const content = typesContentMap[type]?.({ users, organization, asset, project });

  if (!content) {
    return null;
  }

  return (
    <div className={classes.root}>
      <SearchAndFilter
        onChange={onFilterChange}
        filters={filters}
      />
      <div className={classes.container}>
        <TableContents
          type={type}
          loading={content.loading}
          nodes={content.nodes}
          getLinkProps={getLinkProps}
          wrapperRenderer={wrapperRenderer}
          itemRenderer={itemRenderer}
        />
      </div>
    </div>
  );
}

function TableContents(props) {
  const {
    type,
    loading,
    nodes,
    getLinkProps,
    wrapperRenderer,
    itemRenderer,
  } = props;

  const classes = useStyles();
  const { t } = useTranslation('translations');

  if (loading) {
    return (
      <Loader />
    );
  }

  if (nodes.length < 1) {
    return (
      <div className={classes.noResultsContiner}>
        <Typography>
          {t('assets.noResultsFound')}
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      {nodes.map((row, index) => {
        const linkProps = getLinkProps(row);

        let LinkComponent = Link;
        let className = null;
        if (linkProps.disabled) {
          LinkComponent = 'div';
          className = classes.rowDisabled;
        }

        return wrapperRenderer({
          key: index, entity: row, children: (
            <LinkComponent
              to={`/${type}/${row._id}`}
              style={{ textDecoration: 'none' }}
              className={className}
              target="_blank"
              rel="noopener noreferrer"
              {...linkProps}
            >
              <div className={`row ${classes.rowStyle}`} key={row._id}>
                <div className={`col-xs-6 ${classes.rowContentStyle}`}>
                  {itemRenderer(row)}
                  {type === 'asset' ? parseAddress(row.data.address) : row.data.name}
                </div>
                <div
                  className={clsx(classes.headerStatusStyle, classes.userCountry, {
                    'col-xs-3': type !== 'user',
                    'col-xs-6': type === 'user',
                  })}
                >
                  {row.data.country}
                  <CountryFlag country={row.data.country} />
                </div>
                {type !== 'user' && (
                  <div className={`col-xs-3 ${classes.headerStatusStyle}`}>
                    <RenderStatus row={row} classes={classes} entityType={type} t={t} />
                  </div>
                )}
              </div>
            </LinkComponent>
          )
        });
      })}
    </div>
  );
}

function ProjectStatus(props) {
  const { classes, project } = props;

  const { t } = useTranslation('translations');

  if (project.milestone === 'zero') {
    return (
      <div className={classes.registeredStyle}>
        {t('translations:projects.ZERO')}
      </div>
    );
  }

  const phase = getProjectPhase(project, t);
  let className;
  switch (phase.phase) {
    case 'zero':
      className = classes.registeredStyle;
      break;
    case 'aquisition':
      className = classes.validStyle;
      break;
    case 'work':
      className = classes.validStyle;
      break;
    case 'monitoring':
      className = classes.validStyle;
      break;
    case 'closed':
      className = classes.declinedStyle;
      break;
    default:
      break;
  }

  return (
    <div className={className}>
      {phase.label}
    </div>
  );
}

const Validated = ({ classes, valid, t }) => {
  let className;
  let textInside = '';
  switch (valid) {
    case 1:
      className = classes.registeredStyle;
      textInside = t('translations:validStatus.registered');
      break;
    case 2:
      className = classes.validStyle;
      textInside = t('translations:validStatus.valid');
      break;
    case 3:
      className = classes.declinedStyle;
      textInside = t('translations:validStatus.declined');
      break;
    case 4:
      className = classes.pendingStyle;
      textInside = t('translations:validStatus.pending');
      break;
    default:
      break;
  }
  return (
    <div className={className}>
      {textInside}
    </div>
  );
};

function RenderStatus(props) {
  const { entityType, row, classes } = props;
  const { t } = useTranslation('translations');

  switch (entityType) {
    case 'project':
      return <ProjectStatus project={row.data} classes={classes} />;
    default:
      return <Validated valid={row.data.valid ? row.data.valid : 3} classes={classes} t={t} />;
  }
}

const noopRenderer = () => {};

AdminTable.propTypes = {
  itemRenderer: PropTypes.func,
  wrapperRenderer: PropTypes.func.isRequired,
  getLinkProps: PropTypes.func.isRequired,
};

AdminTable.defaultProps = {
  itemRenderer: noopRenderer,
  wrapperRenderer: (props) => <React.Fragment key={props.key} children={props.children} />,
  getLinkProps: () => ({}),
};

export default connect(
  (state) => ({
    users: state.users,
    organization: state.organization,
    asset: state.asset,
    project: state.project,
  }),
)(AdminTable);
