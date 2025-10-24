import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles
} from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import HistoryHeader from './HistoryHeader';
import HistoryTable from './HistoryTable';
import Disclaimer from '../Disclaimer';

const useStyles = makeStyles({
  container: {
    padding: '0px 30px'
  }
});

function ContractForfaitingHistory(props) {
  const { project } = props;
  const classes = useStyles();
  const { t } = useTranslation('translations');
  const [view, setView] = useState(window.location.hash ? window.location.hash.replace('#', '') : 'epc');

  const config = tableConfig;

  config.epc[0].files = Object.values(project._attachments || {}).filter(
    f => f.upload_type === 'signed epc').sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt),
  );
  config.epc[1].files = Object.values(project._attachments || {}).filter(
    f => f.upload_type === 'epc contracts').sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt),
  );
  config.fa[0].files = Object.values(project._attachments || {}).filter(
    f => f.upload_type === 'fa contracts').sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt),
  );

  return (
    <div className={classes.container}>
      <HistoryHeader
        view={view}
        onViewChange={setView}
        disableSign={config.fa[0].files.length === 0}
      />
      {config[view].map((table, index) => (
        <HistoryTable
          title={t(table.title)}
          files={table.files || []}
          key={index}
        />
      ))}
      <Disclaimer />
    </div>
  );
}

const tableConfig = {
  epc: [
    {
      title: 'milestones.signedEpc',
      upload_type: 'signed epc',
      files: []
    },
    {
      title: 'projects.amendments',
      upload_type: 'epc contracts',
      files: []
    }
  ],
  fa: [
    {
      title: 'projects.signedForfaiting',
      upload_type: 'fa contracts',
      files: []
    }
  ]
};

export default connect(
  state => ({
    project: state.project.refetchProject,
  })
)(ContractForfaitingHistory);
