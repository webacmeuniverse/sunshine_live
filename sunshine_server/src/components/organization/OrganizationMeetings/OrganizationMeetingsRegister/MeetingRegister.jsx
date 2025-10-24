import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import Dropzone from 'react-dropzone';
import DatePicker from 'react-datepicker';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    Paper,
    Chip,
    Typography,
    makeStyles
} from '@material-ui/core';
import {
    CloudUpload as UploadIcon,
} from '@material-ui/icons';

import apolloClient from '../../../../utils/apolloClient';
import TooltipWrapper from '../../../utils/TooltipWrapper';
import { canFinish } from '../../../../utils/can';
import { allowedMimeTypes } from '../../../../utils/mimeTypes';
import { LIST_MEETINGS } from '../../../../actions/organizationsQueries';
import { CREATE_MEETING } from '../../../../actions/organizationsMutations';
import { uploadFile } from '../../../../actions/uploads';
import { addAlert as addAlertAction } from '../../../../actions/alerts';

import {
    organizationMeetingTypes,
    projectMeetingTypes
} from '../../../../constants/legalStatusTypes';
import { meetingsUploadTypes } from '../../../../constants/meetings';

import deleteEmpty from '../../../../utils/deleteEmpty';

import styles from './styles';

const useStyles = makeStyles(styles);

const defaultState = {
    name: '',
    date: new Date(),
    next_contact: null,
    location: '',
    guests: [],
    host: '',
    topic: '',
    notes: '',
    stakeholder: 'PUBLIC_ORGANIZATION',
    internalProject: '',
    attachments: {},
};

const requiredFields = [
    'name',
    'host',
    'date',
    'type',
    'location',
    'topic',
];

function MeetingRegister(props) {
    const {
        project,
        open, // eslint-disable-line no-shadow
        organization,
        myOrgs,
        uploadDocument,
        meetingType,
        meetingTypesAliases,
        navigateOnCompleted,
        addAlert,
    } = props;

    const classes = useStyles();
    const { t } = useTranslation('translations');
    const [meetingData, setMeetingData] = useState({
        ...defaultState,
        host: props.host,
        topic: (meetingType && !Array.isArray(meetingType) ? meetingType : ''),
    });

    const uploadTypes = meetingsUploadTypes(t)[meetingTypesAliases[meetingData.topic]]
        ? meetingsUploadTypes(t)[meetingTypesAliases[meetingData.topic]]
        : [meetingData.topic];

    const listMeetingsState = useQuery(
        LIST_MEETINGS,
        {
            client: apolloClient,
            variables: {
                id: project ? project : meetingData.host,
            },
        },
    );

    const [registerMeeting] = useMutation(
        CREATE_MEETING,
        {
            client: apolloClient,
            onCompleted: response => {
                const meetingId = response.createMeeting.ID;

                const attachmentTypes = Object.keys(meetingData.attachments);

                Promise.all(attachmentTypes.map((uploadType) => {
                    return Promise.all(meetingData.attachments[uploadType].map((f) => {
                        if (uploadType === 'default') {
                            return uploadDocument(f, { id: meetingId, type: 'meeting' });
                        }
                        return uploadDocument(f, { id: meetingId, type: 'meeting', uploadType });
                    }));
                }))
                .then(() => {
                    return listMeetingsState.refetch();
                }).then(() => {
                    handleClearState();
                    if (navigateOnCompleted) {
                        props.history.push(`/meeting/${meetingId}`);
                    }
                });
            },
        },
    );

    function handleSubmit(e) {
        e.preventDefault();

        const {
            name, // eslint-disable-line no-shadow
            host,
            date,
            next_contact,
            location, // eslint-disable-line no-shadow
            guests,
            topic,
            notes,
            stakeholder,
            internalProject,
        } = meetingData;

        const meeting = {
            meeting: {
                host,
                name,
                date,
                guests,
                next_contact,
                topic: meetingTypesAliases[topic] ? meetingTypesAliases[topic] : topic,
                location,
                notes,
                project,
                stakeholder,
                internalProject,
            },
        };

        deleteEmpty(meeting.meeting);
        registerMeeting({ variables: meeting });
    }

    function handleClearState() {
        setMeetingData({
            ...defaultState,
            host: props.host,
            topic: (meetingType && !Array.isArray(meetingType) ? meetingType : ''),
        });
        props.handleClose();
    }

    if (myOrgs?.length === 0) {
        return null;
    }

    const values = project ? projectMeetingTypes : organizationMeetingTypes;
    return (
        <Dialog
            open={open}
            onClose={handleClearState}
            maxWidth='md'
            fullWidth={true}
            component={Paper}
            className={classes.dialog}
        >
            <DialogTitle
                className={classes.headerFooterColor}
            >
                {t('meetings.createNewMeeting')}
            </DialogTitle>
            <DialogContent
                className={classes.dialogContent}
            >
                <Grid
                    container
                    spacing={4}
                >
                    <Grid
                        item
                        xs={6}
                    >
                        <TextFieldWrapper
                            label={t('meetings.purpose')}
                            value={meetingData.name}
                            onChange={v => setMeetingData({ ...meetingData, name: v })}
                            required
                        />
                    </Grid>
                    <Grid
                        item
                        xs={6}
                    >
                        <FormControl
                            variant="outlined"
                            className={classes.textField}
                            required
                        >
                            <InputLabel className={classes.customSelect}>{t('assets.organization')}</InputLabel>
                            <Select
                                native
                                className={classes.customSelect}
                                onChange={e => setMeetingData({ ...meetingData, host: e.target.value })}
                                value={meetingData.host}
                            >
                                {organization ?
                                    <React.Fragment>
                                        <option value="" />
                                        <option
                                            key={organization.id}
                                            value={organization.id}
                                        >
                                            {typeof(organization.name) === 'object' ? organization.name.data.name : organization.name}
                                        </option>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <option value="" />
                                        {myOrgs.map((org, i) => (
                                            <option
                                                key={i}
                                                value={org._id}
                                            >
                                                {org.data.name}
                                            </option>
                                        ))}
                                    </React.Fragment>
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                    >
                        <DatePicker
                            selected={meetingData.date}
                            onChange={d => setMeetingData({ ...meetingData, date: d })}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="dd/MM/yyyy H:mm"
                            customInput={<TextField label={t('meetings.date')} variant="outlined" />}
                            className={classes.textField}
                            required
                        />
                    </Grid>
                    <Grid
                        item
                        xs={6}
                    >
                        <TextFieldWrapper
                            label={t('meetings.internalProject')}
                            value={meetingData.internal_project}
                            onChange={v => setMeetingData({ ...meetingData, internalProject: v })}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={6}
                    >
                        <FormControl
                            variant="outlined"
                            className={classes.textField}
                            required
                        >
                            <InputLabel className={classes.customSelect}>{t('meetings.meetingType')}</InputLabel>
                            <Select
                                native
                                className={classes.customSelect}
                                onChange={e => setMeetingData({ ...meetingData, topic: e.target.value })}
                                defaultValue={meetingData.topic}
                            >
                                <option value="" />
                                {values.map((item) => (
                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {t(item.labelKey)}
                                    </option>
                                ))}
                                </Select>
                            </FormControl>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                            >
                                <TextFieldWrapper
                                    label={t('meetings.location')}
                                    value={meetingData.location}
                                    onChange={v => setMeetingData({ ...meetingData, location: v })}
                                    required
                                />
                            </Grid>
                            <Documents
                                uploadTypes={uploadTypes}
                                onChange={(uploadType, ...f) => {
                                    setMeetingData({
                                        ...meetingData,
                                        attachments: {
                                            ...meetingData.attachments,
                                            [uploadType]: [...(meetingData.attachments[uploadType] || []), ...f],
                                        },
                                    });
                                }}
                                onDelete={(uploadType, f) => {
                                    const filtered = (meetingData.attachments[uploadType] || []).filter(
                                        (d) => d.name !== f.name
                                    );
                                    setMeetingData({
                                        ...meetingData,
                                        attachments: {
                                            ...meetingData.attachments,
                                            [uploadType]: filtered,
                                        },
                                    });
                                }}
                                documents={meetingData.attachments}
                                onError={(err) => {
                                    addAlert(err.message, 'error');
                                }}
                            />
                        </Grid>
                    </DialogContent>
                    <DialogActions
                        className={classes.headerFooterColor}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.cancelButton}
                            onClick={handleClearState}
                        >
                            {t('utils.confirmDialogCancel')}
                        </Button>
                        <Button
                            className={classes.createButton}
                            disabled={canFinish(meetingData, requiredFields)}
                            onClick={handleSubmit}
                        >
                            {t('meetings.create')}
                        </Button>
                    </DialogActions>
                </Dialog>
    );
}

MeetingRegister.propTypes = {
    navigateOnCompleted: PropTypes.bool.isRequired,
    meetingTypesAliases: PropTypes.object.isRequired,
};

MeetingRegister.defaultProps = {
    navigateOnCompleted: true,
    meetingTypesAliases: {},
};

function TextFieldWrapper(props) {
    const classes = useStyles();
    const { onChange, ...textFieldProps } = props;

    return (
        <Grid
            item
            xs={12}
        >
            <TextField
                variant="outlined"
                className={classes.textField}
                onChange={e => onChange(e.target.value)}
                {...textFieldProps}
            />
        </Grid>
    );
}

function Documents(props) {
    const {
        uploadTypes,
        documents,
        ...UploadDocumentProps
    } = props;

    if (uploadTypes) {
        return (
            <React.Fragment>
                {uploadTypes.map((uploadType) => {
                    return (
                        <Grid item key={uploadType.type} xs={12} sm={12 / uploadTypes.length}>
                            {uploadType.title && <Typography varint="subtitle2">{uploadType.title}</Typography>}
                            <UploadDocument
                                documents={documents[uploadType.type] || documents.default}
                                uploadType={uploadType.type}
                                {...UploadDocumentProps}
                            />
                        </Grid>
                    );
                })}
            </React.Fragment>
        );
    }

    return (
        <Grid item xs={12}>
            <UploadDocument documents={documents.default} {...UploadDocumentProps} />
        </Grid>
    );
}

function UploadDocument(props) {
    const classes = useStyles();
    const { t } = useTranslation('translations');
    const {
        onChange,
        onDelete,
        onError,
        documents,
        uploadType,
    } = props;

    const handleDelete = (doc) => () => {
        onDelete(uploadType, doc);
    };

    return (
        <React.Fragment>
            <Dropzone
                onDrop={(acceptedFiles, rejectedFiles) => {
                    if (rejectedFiles.length > 0) {
                        onError(new Error(t('documents.unsupportedFileType')));
                        return;
                    }
                    onChange(uploadType, ...acceptedFiles);
                }}
                accept={allowedMimeTypes}
            >
                {({ getRootProps, getInputProps }) => {
                    return (
                        <div {...getRootProps()} tabIndex="none">
                            <input {...getInputProps()} />
                            <Button
                                variant="text"
                                color="primary"
                                className={classes.uploadButton}
                                startIcon={<UploadIcon />}
                                disableRipple
                            >
                                {t('documents.uploadDocument')}
                            </Button>
                        </div>
                    );
                }}
            </Dropzone>
            <ul className={classes.documentsList}>
                {documents.map((doc, i) => {
                    return (
                        <TooltipWrapper key={i} title={doc.name}>
                            <li>
                                <Chip
                                    label={doc.name}
                                    onDelete={handleDelete(doc)}
                                    className={classes.chip}
                                />
                            </li>
                        </TooltipWrapper>

                    );
                })}
            </ul>
        </React.Fragment>
    );
}

UploadDocument.defaultProps = {
    uploadType: 'default',
    documents: [],
};

export default withRouter(connect(
    null,
    dispatch => ({
        addAlert: (message, severity) => dispatch(
            addAlertAction({ text: message, level: severity })
        ),
        uploadDocument: (file, entity, onSuccess) => dispatch(
            uploadFile(file, entity, { onSuccess, withoutAlert: true })
        ),
    })
)(MeetingRegister));
