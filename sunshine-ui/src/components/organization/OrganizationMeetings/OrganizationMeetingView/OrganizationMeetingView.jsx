import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  ArrowBack as ArrowBackIcon,
  BusinessCenter as OrganizationIcon,
  Equalizer as ProjectIcon,
  Event as DateIcon,
  Language as URLIcon,
  MergeType as TypeIcon,
  Room as LocationIcon,
  SupervisedUserCircle as MeetingIcon,
} from '@material-ui/icons';

import apolloClient from '../../../../utils/apolloClient';
import { validateFields } from '../../../../utils/validation';
import { UPDATE_MEETING } from '../../../../actions/organizationsMutations';
import { LIST_MEETINGS, GET_MEETING } from '../../../../actions/organizationsQueries';
import { addAlert as addAlertAction } from '../../../../actions/alerts';
import { uploadAndDeleteFiles } from '../../../../actions/uploads';
import {
  organizationMeetingTypes,
  projectMeetingTypes
} from '../../../../constants/legalStatusTypes';
import {
  meetingTypesAliases,
  meetingsUploadTypes,
} from '../../../../constants/meetings';
import FilesManager from '../../../../containers/smartcomponents/FilesManager/FilesManager';
import Input from '../../../utils/Input';
import TextWithIcon from '../../../utils/TextWithIcon';
import MeetingGuestManager from '../MeetingGuestManager';
import styles from './styles';
import { canEditProject } from '../../../../utils/can';
import { refetchSingleProject } from '../../../../actions/projects';

const useStyles = makeStyles(styles);

const validations = { name: ['nonEmpty'], location: ['nonEmpty'], date: ['nonEmpty'], topic: ['nonEmpty'] };



function OrganizationMeetingView(props) {
  const {
    meeting,
    refetchMeeting,
    processFiles,
    user,
    addAlert,
    project,
  } = props;
  const isProjectMeeting = (meeting.project ? true : false);
  const canEdit = (isProjectMeeting ? canEditProject(project, user) : true);
  useEffect(() => {
    // is the meeting for project
    if (isProjectMeeting) {
      refetchSingleProject(meeting.project.ID);
    }
  }, [meeting.project, isProjectMeeting]);

  const routeHistory = useHistory();

  const { t } = useTranslation('translations');
  const classes = useStyles();

  const useAlias = meetingTypesAliases[meeting.topic] && { [meetingTypesAliases[meeting.topic][0]]: meeting.topic };

  const [data, setData] = useState({
    ...meeting,
    topic: useAlias ? meetingTypesAliases[meeting.topic][0] : meeting.topic,
    guests: meeting.guests?.map(g => ({
      email: g.email || '',
      name: g.name || '',
      organization: g.organization || '',
      phone: g.phone || '',
      type: g.type,
    })) || [],
  });

  const uploadTypes = meetingsUploadTypes(t)[useAlias?.[data.topic] || data.topic];

  const meetingTypes = (
    meeting.project ? projectMeetingTypes : organizationMeetingTypes
  ).map(o => ({ value: o.value, label: t(o.labelKey) }));

  const [updateMeeting] = useMutation(UPDATE_MEETING, {
    client: apolloClient,
    onError: err => {
      addAlert(err?.message);
    },
    onCompleted: () => addAlert({ text: t('meetings.updateSuccess'), level: 'success' }),
    refetchQueries: [
      { query: LIST_MEETINGS, variables: { id: meeting.project?.ID || meeting.host?.ID } },
      { query: GET_MEETING, variables: { id: meeting.ID } },
    ],
  });

  const [meetingFiles, setMeetingFiles] = useState(meeting.attachments || []);
  const onFileAdded = (acceptedFiles, uploadType) => {
    const files = acceptedFiles.map((f) => ({ file: f, upload_type: uploadType }));
    setMeetingFiles([...files, ...meetingFiles]);
  };
  const onFileDeleted = (f) => {
    const filtered = meetingFiles.filter(_f => (_f.file || _f).name !== f.name);
    setMeetingFiles(filtered);
  };

  const onSubmit = () => {
    const filesToDelete = meeting.attachments.filter(
      ma => !meetingFiles.some(mf => ma.ID === mf.ID)
    );
    const filesToAdd = meetingFiles.filter(
      mf => !meeting.attachments.some(ma => mf.ID === ma.ID)
    );

    processFiles({ toDelete: filesToDelete, toAdd: filesToAdd }, { ID: meeting.ID, type: 'meeting' }).then(() => {
      updateMeeting({
        variables: {
          meeting: {
            ID: meeting.ID,
            name: data.name,
            location: data.location,
            date: data.date,
            objective: data.objective,
            guests: data.guests,
            stage: data.stage,
            actions_taken: data.actions_taken,
            internalProject: data.internalProject,
            notes: data.notes,
            topic: useAlias?.[data.topic] || data.topic,
          },
        },
      }).then((res) => {
        setMeetingFiles([...res.data.updateMeeting.attachments]);
      }).then(() => refetchMeeting);
    }).catch(err => addAlert({ text: err.message, level: 'error' }));
  };

  const validationResult = validateFields(data, validations);

  return (
    <Card className={classes.root}>
      <MeetingHeader meeting={meeting} prevPath={routeHistory.location.prevPath} />
      <CardContent component={Grid} container spacing={2}>
        <Grid item sm={6} xs={12}>
          <Grid container direction="column" spacing={2}>
            <Grid container item xs={12} spacing={2}>
              <Grid item sm={6} xs={12}>
                <Input
                  label={t('meetings.meetingType')}
                  value={data.topic}
                  disabled={!canEdit}
                  startAdornment={<TypeIcon color="disabled" />}
                  options={meetingTypes}
                  onChange={e => setData({ ...data, topic: e.target.value })}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Input
                  type="datepicker"
                  disabled={!canEdit}
                  label={t('meetings.date')}
                  value={new Date( data.date)}
                  startAdornment={<DateIcon color="disabled" />}
                  onChange={e => setData({
                    ...data,
                    date: e.target.value ? e.target.value : '',
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  label={t('meetings.location')}
                  value={data.location}
                  startAdornment={<LocationIcon color="disabled" />}
                  onChange={e => setData({ ...data, location: e.target.value })}
                  disabled={!canEdit}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Input
                  label={t('meetings.internalProject')}
                  value={data.internalProject}
                  startAdornment={<ProjectIcon color="disabled" />}
                  onChange={e => setData({ ...data, internalProject: e.target.value })}
                  disabled={!canEdit}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Input
                  label={t('meetings.urlToConference')}
                  startAdornment={<URLIcon color="disabled" />}
                  value={data.stage}
                  onChange={e => setData({ ...data, stage: e.target.value })}
                  disabled={!canEdit}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <Input
                label={t('meetings.meetingObjective')}
                multiline
                rows={3}
                value={data.objective}
                disabled={!canEdit}
                onChange={e => setData({ ...data, objective: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                multiline
                rows={3}
                disabled={!canEdit}
                label={t('meetings.actionsTaken')}
                value={data.actions_taken}
                onChange={e => setData({ ...data, actions_taken: e.target.value })}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <MeetingGuestManager
            guestList={data.guests}
            addGuest={g => setData({
              ...data,
              guests: [...data.guests, { ...g }],
            })}
            editGuest={(i, guest) => setData({
              ...data,
              guests: data.guests.map((g, idx) => idx !== i ? g : { ...guest }),
            })}
            removeGuest={i => setData({
              ...data,
              guests: data.guests.filter((_, idx) => i !== idx),
            })}
          />
        </Grid>

        <Files
          meetingID={meeting.ID}
          files={meetingFiles}
          uploadTypes={uploadTypes}
          onFileAdded={onFileAdded}
          onFileDeleted={onFileDeleted}
        />

        <Grid container item xs={12} direction="row-reverse">
          <Button
            variant="contained"
            color="secondary"
            onClick={onSubmit}
            disabled={!validationResult.valid || !canEdit}
          >
            {t('meetings.save')}
          </Button>
        </Grid>

      </CardContent>
    </Card>
  );
}

function MeetingHeader(props) {
  const {
    meeting,
    prevPath
  } = props;
  const { t } = useTranslation('translations');

  const d = moment(meeting.date).format('YYYY-MM-DD HH:mm');
  const buttons = [];
  if (meeting.project) {
    buttons.push(
      <Button
        key="p"
        component={Link}
        to={prevPath ? prevPath : `/project/${meeting.project.ID}`}
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
      >
        {t('meetings.toProject')}
      </Button>
    );
  }
  buttons.push(
    <Button
      key="o"
      component={Link}
      to={`/organization/${meeting.host.ID}`}
      variant="contained"
      color="primary"
      startIcon={<ArrowBackIcon />}
    >
      {t('meetings.backToOrganization')}
    </Button>
  );

  const headerProps = {
    subheaderTitle: `${t('assets.organization')} ${meeting.host.name}`,
    subheaderIcon: OrganizationIcon,
  };

  if (meeting.project) {
    headerProps.subheaderTitle = `${t('projects.project')} ${meeting.project.name}`;
    headerProps.subheaderIcon = ProjectIcon;
  }

  return (
    <CardHeader
      avatar={
        <Avatar>
          <MeetingIcon color="action" />
        </Avatar>
      }
      title={
        <Typography variant="h5">
          {meeting.name}
        </Typography>
      }
      subheader={
        <React.Fragment>
          <TextWithIcon
            icon={<headerProps.subheaderIcon color="action" />}
            variant="caption"
          >
            {headerProps.subheaderTitle}
          </TextWithIcon>
          <TextWithIcon
            icon={<DateIcon color="action" />}
            variant="caption"
          >
            {d}
          </TextWithIcon>
        </React.Fragment>
      }
      action={
        <React.Fragment>
          {buttons.map(b => b)}
        </React.Fragment>
      }
    />
  );
}

function Files(props) {
  const {
    meetingID,
    files,
    uploadTypes,
    onFileAdded,
    onFileDeleted,
  } = props;

  const { t } = useTranslation('translations');

  if (!uploadTypes) {
    return (
      <Grid item xs={12}>
        <FilesManager
          title={t('meetings.listOfFiles')}
          subtitle={t('meetings.uploadMinutes')}
          files={files}
          entityType="meeting"
          entityID={meetingID}
          onFileAdded={onFileAdded}
          onFileDeleted={onFileDeleted}
        />
      </Grid>
    );
  }

  return (
    <React.Fragment>
      {uploadTypes.map((ut, i) => {
        return (
          <Grid item xs={12} key={ut.type}>
            <FilesManager
              title={ut.title}
              subtitle={i < 1 && t('meetings.uploadMinutes')}
              files={files.filter((f) => f.upload_type === ut.type)}
              entityType="meeting"
              entityID={meetingID}
              onFileAdded={(acceptedFiles) => onFileAdded(acceptedFiles, ut.type)}
              onFileDeleted={onFileDeleted}
            />
          </Grid>
        );
      })}
    </React.Fragment>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    project: state.project.refetchProject,

  };
};
export default connect(
  mapStateToProps,
  dispatch => ({
    addAlert: (message) => dispatch(addAlertAction(message)),
    processFiles: (toDel, toAdd, entity) => dispatch(uploadAndDeleteFiles(toDel, toAdd, entity)),

  }),
)(OrganizationMeetingView);
