import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  CircularProgress,
  makeStyles,
} from '@material-ui/core';

import { getProjectsReports } from '../../actions/projects';
import { parseAddress } from '../../components/asset/utils';
import { milestonePhase, getMilestoneLabel } from '../../constants/milestones';
import DataTable from '../utils/DataTable';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const fields = [
  { key: 'name', titleKey: 'projects.name' },
  { key: 'owner', titleKey: 'projects.owner' },
  { key: 'asset', titleKey: 'assets.asset' },
  { key: 'phase', titleKey: 'projects.phase' },
  { key: 'milestone', titleKey: 'projects.milestone' },
  { key: 'airtemp', titleKey: 'projects.indoorAirTempPlaceholder' },
  { key: 'watertemp', titleKey: 'projects.hotWaterSupplyTempPlaceholder' },
  { key: 'savings', titleKey: 'projects.energySavingsPlaceholder' },
  { key: 'construction_period', titleKey: 'projects.construction_period' },
  { key: 'contract_term', titleKey: 'projects.contractTermsInYears' },
  { key: 'first_year', titleKey: 'projects.firstYearOfContract' },
  { key: 'country', titleKey: 'auth.country' },
  { key: 'portfolio_director', titleKey: 'platformRoles.portfolio_director' },
  { key: 'fund_manager', titleKey: 'platformRoles.fund_manager' },
  { key: 'consortium_organizations', titleKey: 'projects.consortiumOrganizations' },
  { key: 'createdAt', titleKey: 'assets.createdAt' },
  { key: 'construction_from', titleKey: 'projects.construction_from' },
  { key: 'construction_to', titleKey: 'projects.construction_to' },
  { key: 'organizations_number', titleKey: 'projects.organizations_number' },
  { key: 'energy_savings', titleKey: 'projects.energy_savings' },
  { key: 'IsFAApproved', titleKey: 'projects.IsFAApproved' },
  { key: 'total_investment', titleKey: 'projects.total_investment' },
  { key: 'money_paid_month', titleKey: 'projects.money_paid_month' },
];
const fieldsEnabled = [
  'name',
  'owner',
  'phase',
  'asset',
  'construction_period',
  'country',
  'portfolio_director',
  'fund_manager',
  'consortium_organizations',
];

function ProjectsReport(props) {
  const {
    projects,
    getProjectsReports,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation('translations');

  const getProjects = useCallback(() => {
    getProjectsReports();
  }, [getProjectsReports]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  if (projects.isFetchingReports) {
    return (
      <div className={classes.contentWrapper}>
        <CircularProgress />
      </div>
    );
  }

  const pKey = 'projectReports';

  const projectsData = projects[pKey].map(p => ({
    ...p.data,
    owner: p.data?.owner?.data?.name,
    asset: parseAddress(p.data?.asset?.data?.address),
    portfolio_director: p.data?.portfolio_director?.data?.name,
    fund_manager: p.data?.fund_manager?.data?.name,
    construction_period: `
      ${moment(p.data?.construction_from).format('DD/MM/YYYY')}
      -
      ${moment(p.data?.construction_to).format('DD/MM/YYYY')}
    `,
    phase: t(milestonePhase(p.data?.milestone, { returnObject: true }).labelKey),
    milestone: getMilestoneLabel(p.data?.milestone, t),
    consortium_organizations: p.data?.consortium_organizations?.length || 0,
    createdAt: p.data?.CreatedAt,
    organizations_number: p.data?.consortium_organizations?.length + 1,
    money_paid_month: p.data?.total_investment / p.data?.contract_term,
  }));

  return (
    <DataTable
      data={projectsData}
      fields={fields}
      fieldsEnabled={fieldsEnabled}
      csvFilename="projects-report"
    />
  );
}

export default connect(
  state => ({
    user: state.user,
    projects: state.project,
  }),
  dispatch => ({
    getProjectsReports: () => dispatch(getProjectsReports()),
  }),
)(ProjectsReport);
