import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import {
  TextareaAutosize,
  makeStyles,
} from '@material-ui/core';
import {
  CheckCircleOutline as CheckIcon,
  HighlightOff as CancelIcon,
} from '@material-ui/icons';

import get from '../../../utils/get';
import set from '../../../utils/set';
import { SERVER as backendURL } from '../../../constants/endpoints';
import { updateAnnexesFields } from '../../../actions/annex';
import TextWithIcon from '../../utils/TextWithIcon';

const useStyles = makeStyles(theme => ({
  input: {
    position: 'relative',
    outline: 0,
    marginLeft: 2,
    marginRight: 2,
    padding: 2,
    backgroundColor: 'transparent',
    lineHeight: 'inherit',
    fontWeight: 600,
    minWidth: 18,
    border: `1px solid ${theme.palette.divider}`,
    display: 'inline-block',

    '&:hover': {
      borderColor: theme.palette.action.hover,
    },
    '&:active, &:focus': {
      borderColor: `${theme.palette.action.focus} !important`,
    },
  },
  inlineAttachment: {
    display: 'flex',
  },
}));

const titleKeys = {
  'acquisition meeting': 'milestones.acquisitionMeeting',
  'commitment protocol meeting': 'milestones.commitmentMeeting',
  'kickoff protocol meeting': 'milestones.kickoffMeeting',
  'energy audit report': 'milestones.energyAuditReport',
  'technical inspection report': 'milestones.technicalInspectionReport',
};
const hintKeys = {
  'acquisition meeting': 'milestones.signedProtocolAcquisitionMeetingHint',
  'commitment protocol meeting': 'milestones.signedProtocolCommitmentMeetingHint',
  'kickoff protocol meeting': 'milestones.signedProtocolKickOffMeetingHint',
  'energy audit report': 'milestones.energyAuditReportHint',
  'technical inspection report': 'milestones.technicalInspectionReportHint',
  'signed epc': 'milestones.signedEPCHint',
};

function AnnexInlineInstruction(props) {
  const {
    command,
    kind,
    value,
    type,
    storeKey,
    project,
    projectSetData,
    fields,
    fieldsSetData,
    forfaitingFieldsSetData,
    disabled
  } = props;

  const projectID = project.singleProject._id;

  if (!command || !projectID) {
    return value;
  }

  if (kind === 'input') {
    return (
      <AnnexInlineInput
        projectID={projectID}
        project={project.updateData || {}}
        projectSetData={projectSetData}
        fields={fields}
        fieldsSetData={fieldsSetData}
        forfaitingFields={project.updateForfaitingFields}
        forfaitingFieldsSetData={forfaitingFieldsSetData}
        storeKey={storeKey}
        type={type}
        value={value}
        disabled={disabled}
      />
    );
  }

  const attachmentsMatch = command.match(/attachment\s?(.*)/);
  if (attachmentsMatch) {
    return (
      <AnnexInlineAttachment
        projectID={projectID}
        attachments={project.singleProject._attachments}
        uploadType={value}
        disabled={disabled}
      />
    );
  }
  return null;
}

AnnexInlineInstruction.propTypes = {
  command: PropTypes.string.isRequired,
  kind: PropTypes.oneOf(['input', 'attachment']),
  type: PropTypes.oneOf(['text', 'date', 'number', 'textarea']),
  storeKey: PropTypes.string,
  value: PropTypes.string.isRequired,
  projectID: PropTypes.string.isRequired,

};

AnnexInlineInstruction.defaultProps = {
  command: '',
  value: '',
  projectID: '',
};

function AnnexInlineAttachment(props) {
  const {
    attachments,
    uploadType,
    projectID,
    disabled
  } = props;

  const classes = useStyles();
  const { t } = useTranslation('translations');

  let file;
  for (const fn in attachments) {
    const a = attachments[fn];
    if (a.upload_type === uploadType) {
      file = {
        name: a.name,
        url: `${backendURL}/project/${projectID}/${a.name}`,
      };
      break;
    }
  }

  if (file) {
    return (
      <TextWithIcon
        icon={<CheckIcon
        color="primary" />}
        variant="caption"
        className={classes.inlineAttachment}
      >
        <React.Fragment>
          {t(titleKeys[uploadType])}&nbsp;
          <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
        </React.Fragment>
      </TextWithIcon>
    );
  }
  return (
    <TextWithIcon
      icon={<CancelIcon
      color="disabled" />}
      variant="caption"
      className={classes.inlineAttachment}
      disabled={disabled}
    >
      {t(hintKeys[uploadType])}
    </TextWithIcon>
  );
}

function AnnexInlineInput(props) {
  const {
    value,
    type,
    storeKey,
    projectID,
    disabled
  } = props;

  const classes = useStyles();

  const storeKeyParts = storeKey.split('.');

  const entity = storeKeyParts[0];
  if (!props[entity]) {
    console.warn(`${entity} not found in props!`); // eslint-disable-line no-console
    return value;
  }
  const updateAction = `${entity}SetData`;
  if (!props[updateAction]) {
    console.warn(`${updateAction} not found in props!`); // eslint-disable-line no-console
    return value;
  }

  const storeValue = get(props, storeKeyParts);

  const handleChange = (v) => {
    if (value === v) {
      return;
    }
    const data = { [entity]: { ...props[entity] } };
    set(data, storeKeyParts, v);
    props[updateAction](data[entity], projectID);
  };

  if (type === 'date') {
    return (
      <DatePicker
        onChange={handleChange}
        selected={storeValue ? new Date(storeValue) : null}
        timeIntervals={15}
        dateFormat={'dd/MM/yyyy'}
        customInput={
          <input className={clsx(classes.input, 'annex-inline-input')} />
        }
        disabled={disabled}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <TextareaAutosize
        className={clsx(classes.input, 'annex-inline-input')}
        rowsMin={3}
        rowsMax={4}
        defaultValue={storeValue}
        onBlur={(e) => {
          handleChange(e.target.value);
        }}
        disabled={disabled}
      />
    );
  }

  return (
    <input
      type={type}
      defaultValue={storeValue}
      className={clsx(classes.input, 'annex-inline-input')}
      onBlur={(e) => {
        handleChange(e.target.value);
      }}
      disabled={disabled}
    />
  );
}

AnnexInlineInput.propTypes = {
  type: PropTypes.oneOf(['text', 'date', 'number', 'textarea']),
};

AnnexInlineInput.defaultProps = {
  type: 'text',
};

export default connect(
  state => ({
    project: state.project,
    fields: state.project.annexes?.annex67?.annex67Fields || {},
  }),
  dispatch => ({
    projectSetData: (data) => dispatch({ type: 'SET_PROJECT_UPDATE_DATA', data }),
    fieldsSetData: (data, projectID) => dispatch(
      updateAnnexesFields(data, projectID, { dispatchAlerts: false }),
    ),
    forfaitingFieldsSetData: (data) => dispatch({ type: 'SET_FORFAITING_FIELDS_UPDATE_DATA', data }),
  }),
)(AnnexInlineInstruction);
