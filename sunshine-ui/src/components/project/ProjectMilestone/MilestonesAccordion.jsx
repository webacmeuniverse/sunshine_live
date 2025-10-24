import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import {
    Button,
    IconButton,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader,
    Typography,
    LinearProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Accordion,
    AccordionSummary,
    FormControlLabel,
    Checkbox,
    makeStyles,
} from '@material-ui/core';
import {
    HighlightOff as HighlightOffIcon,
    TrendingUp as TrendingUpIcon,
    Delete as DeleteIcon,
    CloudDownload as DownloadIcon,
    ExpandMore as ExpandMoreIcon,
    Group as GroupIcon,
    GroupAdd as GroupAddIcon,
    InfoOutlined as InfoIcon,
} from '@material-ui/icons';

import apolloClient from '../../../utils/apolloClient';
import parseTitle from '../../../utils/parseJSONi18n';
import ENDPOINTS from '../../../constants/endpoints';
import { refetchSingleProject, createOrUpdateProject } from '../../../actions/projects';
import { addAlert } from '../../../actions/alerts';
import { deleteFile } from '../../../actions/uploads';
import { ADVANCE_TO_MILESTONE } from '../../../actions/projectsMutations';
import calcTablePercentage from '../../../functions/calcTablePercentage';
import ForfaitingForm from '../ForfaitingAgreement/ForfaitingForm';
import Upload from '../../../containers/smartcomponents/UploadFile/UploadFile';
import Tooltip from '../../utils/TooltipWrapper';
import TextWithIcon from '../../utils/TextWithIcon';
import UserTooltip from '../../utils/UserTooltip';
import { MaintenanceYear } from '../utils';
import FAReviews from '../ForfaitingAgreement/FAReviews';
import FAReview from '../ForfaitingAgreement/FAReview';
import TableForm from '../../../containers/smartcomponents/TableWrappers/EnergyTableWrapper';
import MeetingRegister from '../../organization/OrganizationMeetings/OrganizationMeetingsRegister/MeetingRegister';
import { stepStatus } from './utils';
import MilestoneStepIcon from './MilestoneStepIcon';
import BuildingMaintenanceTable from './MonitoringPhase/BuildingMaintenanceTable';
import ContractTable from '../Contract/ContractTable';
import CommentsAndUploads from './CommentsAndUploads';
import PaymentDetails from '../PaymentDetails';
import ForfaitingApplication from '../ForfaitingAgreement/ForfaitingApplication';
import {
    canSignProject,
    isMaintenanceReady,
    canReviewFA
} from '../../../utils/can';

import { ADVANCE_PROJECT_TO_WORK_PHASE, COMMENT_PROJECT } from '../../../actions/projectsMutations';

import {
    canEditProject,
    isMilestoneEnabled,
    canCompleteFP,
    canCommentMilestone,
} from '../../../utils/can';

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: 20,
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
    },
    progressRoot: {
        flexGrow: 1,
    },
    disabledContainer: {
        marginBottom: theme.spacing(2),
    },
    energyProgressLabel: {
        margin: '10px 0'
    },
    linearProgress: {
        height: 10
    },
    progressValue: {
        color: '#848c98',
        fontSize: '14px',
        textAlign: 'center',
        marginTop: 10
    },
    completeMilestoneWrapper: {
        display: 'flex',
        padding: `${theme.spacing(4)}px ${theme.spacing(2)}px ${theme.spacing(2)}px 0`,
        justifyContent: 'flex-end',
        alignItems: 'center',

        '& .UserTooltip-grow': {
            marginRight: theme.spacing(1),
        },
    },
    list: {
        '& .MuiListItem-container': {
            padding: `${theme.spacing(2)}px 0`,
        },
        '& .ListItem-progress': {
            borderBottom: `1px solid ${theme.palette.divider}`,
            width: '100%',
            '&:last-child': {
                borderBottom: 0,
            },
        },
        '& .MuiListItem-secondaryAction': {
            paddingRight: 320,
        },
        '& .MuiListItemText-secondary': {
            maxHeight: 100,
            overflowY: 'auto',
            marginTop: 15,
            display: 'grid',
            '& > span': {
                alignItems: 'center',
                '&:hover': {
                    color: theme.palette.text.primary,
                },
            },
            '& .MuiIconButton-sizeSmall': {
                padding: 1,
                '&:first-child': {
                    marginLeft: theme.spacing(2),
                },
            },
        },
    },
    reviewsLabel: {
        marginTop: 25,
        marginLeft: 15,
        fontSize: '1.2rem'
    },
    commentBody: {
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
    },
    commentBy: {
        textAlign: 'right',
        marginBottom: 20,
    },
    noCommentsColor: {
        color: '#7f8fa4',
    },
    textField: {
        width: '100%'
    },
    submitButton: {
        float: 'right',
        marginTop: 10,
    },
    disabledTitle: {
        width: '100%',
        justifyContent: 'center',
    },
    borderBottom: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:last-child': {
            borderBottom: 0,
        },
    },
    meetingsList: {
        marginTop: 10,
        maxHeight: 170,
        display: 'grid',
        overflowY: 'auto'
    },
    meetingListItem: {
        alignItems: 'start',
        display: 'inline-flex',
        justifyContent: 'space-between',
    },
    meetingListItemText: {
        marginLeft: 55,
        width: '50%'
    },
    meetingLink: {
        textDecoration: 'none',
        color: 'grey',
        display: 'inline-flex',
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        }
    },
    meetingButtonWrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    meetingAlsoLabel: {
        '& .MuiFormControlLabel-label': {
            fontSize: 12,
        },
    },
    emptyMeetings: {
        marginTop: 15,
        color: 'grey',
        fontSize: 14
    },
    uploadsListItem: {
        '& .MuiTypography-body1': {
            fontSize: '0.855rem'
        }
    },
    stepHint: {
        fontSize: '0.8rem',
        marginTop: 10,
        color: '#333',
    },
    floatRight: {
        float: 'right',
    },
    redirectLabel: {
        marginLeft: 16,
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        '&:hover': {
            color: theme.palette.text.primary,
        }
    },
    signEpc: {
        marginRight: 6,
    },
}));

const commissioningRequired = [
    'project management contract',
    'construction works company contract',
    'engineering networks company contract',
    'supervision contract',
    'energy management system company',
    'monthly construction company report',
    'building audit document',
    'building inspection document',
    'work acceptance document',
    'defects declarations',
];

// eslint-disable-next-line complexity
function MilestonesAccordion(props) {
    const classes = useStyles();
    const {
        sections,
        label,
        milestones,
        milestone,
        singleProject,
        userIsSuperUser,
        annex3Ready,
        refetchSingleProjectAction, // eslint-disable-line id-length
        deleteDocument,
        unlocked,
        disabled,
        annex3,
        phase,
        handleReview,
        advanceToNextPhase,
        updateMonitoringTable,
        monitoringTable,
        handleStepChange,
        canCompleteMilestone,
        meetings,
        user,
        shouldRenderCompletePhase,
        onSuccessfulUpdate,
        createOrUpdateProjectAction, // eslint-disable-line id-length
        buildingMaintenance,
        periodicActivitiesRows,
    } = props;

    const preDefinedExpanded = window.location.hash.split('-')[1];

    const { t } = useTranslation('translations');
    const [expanded, setExpanded] = useState(preDefinedExpanded ? parseInt(preDefinedExpanded, 10) : null);
    const [registerOpen, setRegisterOpen] = useState(null);
    const [includesMeetings, setIncludesMeetings] = useState({});

    const organization = {
        name: Object.values(singleProject.dependencies).find(dep => dep._id === singleProject.data.owner),
        id: singleProject.data.owner
    };

    const [commentProject] = useMutation(COMMENT_PROJECT, {
        client: apolloClient,
        onCompleted: () => refetch()
    });

    const [advanceToMilestone] = useMutation(ADVANCE_TO_MILESTONE, {
        client: apolloClient,
        onCompleted: () => {
            handleStepChange();
            commentProject({
                variables: {
                    id: singleProject._id,
                    comment: `${milestone.label} ${t('milestones.completedOn')} ${new Date().toLocaleString('de-DE')}`,
                    topic: milestone.milestoneEnum
                }
            });
        },
    });

    const [advanceProjectToWorkPhase] = useMutation(ADVANCE_PROJECT_TO_WORK_PHASE, {
        client: apolloClient,
        onCompleted: (response) => {
            commentProject({
                variables: {
                    id: singleProject._id,
                    comment: `${milestone.label} ${t('milestones.completedOn')} ${new Date().toLocaleString('de-DE')}`,
                    topic: milestone.milestoneEnum
                }
            });
            props.history.push(`/project/${response.advanceProjectToWorkPhase.project}/works-phase`);
        }
    });

    if (!annex3Ready) {
        return null;
    }

    function handleRegisterOpen(step) {
        if (!step?.meeting) {
            setRegisterOpen(null);
            return;
        }

        const meetingTypesAliases = {};
        if (includesMeetings[step.meeting]) {
            meetingTypesAliases[step.meeting] = includesMeetings[step.meeting].meetingType;
        }

        setRegisterOpen({ ...step, meetingType: step.meeting, meetingTypesAliases });
    }

    const energyTableMetrics = annex3Ready && calcTablePercentage(annex3);
    const refetch = () => refetchSingleProjectAction(singleProject._id);
    const entity = { id: singleProject._id, type: 'project' };

    const energyTables = [
        annex3.table4,
    ];

    const canReview = canReviewFA(user, singleProject.data.country);
    const canEdit = canEditProject(singleProject, user);
    const milestoneEnabled = isMilestoneEnabled(singleProject, milestone, milestones, phase);
    const isDisabled = disabled || !canEdit || !milestoneEnabled;
    const canComment = !isDisabled || canCommentMilestone({
        user,
        project: singleProject,
        milestone,
        milestones,
        phase,
    });

    let allStepsValid = true;

    function canCompleteCommissioning() {
        let counter = 0;

        commissioningRequired.map(req =>
            Object.values(singleProject._attachments || []).forEach(
                file => file.upload_type === req && counter++
            )
        );

        return counter >= commissioningRequired.length && canCompleteMilestone;
    }

    function canCompleteAfterCommissioning() {
        return singleProject.data.milestone !== 'commissioning' && phase?.__typename === 'WorkPhase';
    }

    function disableDeleteCommissioning() {
        if (singleProject.data.milestone === 'commissioning' && (
            milestone.milestoneEnum === 'COMMISSIONING' ||
            milestone.milestoneEnum === 'RENOVATION_AND_ENGINEERING_WORKS' ||
            milestone.milestoneEnum === 'SIGNED_CONSTRUCTIONS_AND_SUBCONTRACTING_CONTRACTS'
        )) {
            return true;
        }
        return false;
    }

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} className={classes.disabledContainer}>
                <Typography variant="h5" gutterBottom align="center">
                    {label}
                </Typography>
                {!milestoneEnabled && canEdit && (
                    <TextWithIcon
                        icon={<HighlightOffIcon color="error" />}
                        className={classes.disabledTitle}
                        gutterBottom
                    >
                        {t('projects.milestoneDisabledInfo')}
                    </TextWithIcon>
                )}
            </Grid>
            <Grid item xs={12}>
                {milestone.milestoneEnum === 'FORFAITING_ANNUAL_CHECK' &&
                    <Typography align="center" variant="h6">
                        {t('projects.documentsProvidedEsco')}
                    </Typography>
                }
                <List className={classes.list}>
                    {/* eslint-disable-next-line complexity */}
                    {sections.map((step, index) => {
                        const validStatus = stepStatus(step, singleProject._attachments, meetings);

                        if (!validStatus.valid) {
                            allStepsValid = false;
                        }
                        if (step.paymentDetails) {
                            const requiredUpload = Object.values(singleProject?._attachments || {}).filter(a => a.upload_type === 'proof of transfer');
                            const isMilestoneCompleted = singleProject.data.milestone === 'forfaiting_payment';
                            return (
                                <React.Fragment key={index}>
                                    <PaymentDetails
                                        disabled={disabled || isMilestoneCompleted}
                                    />
                                    <CompleteMilestone
                                        nextMilestone={milestone.milestoneEnum}
                                        milestoneLabel={milestone.label}
                                        buttonLabelKey="milestones.completeForfaitingPayout"
                                        projectId={singleProject._id}
                                        completeMilestone={() => advanceToMilestone({
                                            variables: {
                                                projectID: singleProject._id,
                                                nextMilestone: milestone.milestoneEnum,
                                            }
                                        }).then(onSuccessfulUpdate)}
                                        disabled={
                                            !canCompleteFP(singleProject.data.ForfaitingApplication, requiredUpload) ||
                                            disabled ||
                                            isMilestoneCompleted
                                        }
                                    />
                                </React.Fragment>
                            );
                        }
                        if (step.forfaitingAnnualCheck) {
                            return (
                                <Grid key={index} style={{ padding: '0px 16px' }} >
                                    {monitoringTable.map((_, i) => (
                                        <Accordion
                                            key={i} expanded={expanded === i}
                                            onChange={() => {
                                                window.location.href = `/project/${singleProject._id}/results-monitoring#2-${i}`;
                                                setExpanded(expanded === i ? null : i);
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                            >
                                                <Typography>
                                                    <MaintenanceYear
                                                        project={singleProject}
                                                        year={i}
                                                    />
                                                </Typography>
                                            </AccordionSummary>
                                            <React.Fragment>
                                                <Typography
                                                    className={classes.redirectLabel}
                                                    onClick={() => handleStepChange(0, i)}
                                                >
                                                    {t('milestones.relatedMonitoringTable')}
                                                </Typography>
                                                {step.uploadTypeList.map((u, j) => {
                                                    const files = Object.values(singleProject._attachments || []).filter(
                                                        f => f.upload_type === u.uploadType && f.comment === u.uploadType + i
                                                    );
                                                    const isVlaid = files.length > 0;
                                                    return (
                                                        <ListItem disabled={isDisabled} key={j}>
                                                            <ListItemIcon>
                                                                <MilestoneStepIcon
                                                                    validStatus={{ valid: isVlaid, complete: isVlaid }}
                                                                    disabled={isDisabled}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography>
                                                                        {u.label}
                                                                    </Typography>
                                                                }
                                                                secondary={
                                                                    files.map(attachment => {
                                                                        return (
                                                                            <span key={attachment.ID} >
                                                                                {decodeURI(attachment.name)}
                                                                                <Tooltip placement="top" title={t('documents.download')} disabled={isDisabled}>
                                                                                    <IconButton
                                                                                        size="small"
                                                                                        component="a"
                                                                                        href={ENDPOINTS.SERVER + `/${entity.type}/` + entity.id + '/' + attachment.name}
                                                                                        download
                                                                                        target="_blank"
                                                                                    >
                                                                                        <DownloadIcon />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                                {!disableDeleteCommissioning() &&
                                                                                    <DeleteUpload
                                                                                        isDisabled={isDisabled}
                                                                                        attachment={attachment}
                                                                                        entity={entity}
                                                                                        refetch={refetch}
                                                                                        deleteDocument={deleteDocument}
                                                                                    />
                                                                                }
                                                                            </span>
                                                                        );
                                                                    })
                                                                }
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <Upload
                                                                    entity={{
                                                                        id: singleProject._id,
                                                                        attachments: Object.values(singleProject._attachments || []).filter(
                                                                            (file) => file.upload_type === u.uploadType && file.comment === u.uploadType + i
                                                                        ),
                                                                        type: 'project',
                                                                        uploadType: u.uploadType,
                                                                        comment: u.uploadType + i
                                                                    }}
                                                                    loggedUserRole="member"
                                                                    userIsSuperUser={userIsSuperUser}
                                                                    buttonOnly
                                                                    canUpload
                                                                    disabled={isDisabled}
                                                                    onSuccess={refetch}
                                                                />
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                    );
                                                })}
                                                <ListItem className="ListItem-progress">
                                                    <CommentsAndUploads
                                                        renderElements={['uploads']}
                                                        uploadType={milestone.otherUploadType}
                                                        commentsTopic={milestone.milestoneEnum}
                                                        comment={milestone.otherUploadType + i}
                                                        entity={{
                                                            id: singleProject._id,
                                                            attachments: singleProject.attachments,
                                                            type: 'project'
                                                        }}
                                                        disabled={!canComment || isDisabled}
                                                    />
                                                </ListItem>
                                                <ListItem key={i} className="ListItem-progress">
                                                    <Grid
                                                        xs={12}
                                                        item
                                                    >
                                                        <FAReview
                                                            handleReview={(approved, type, comment, ID) => {
                                                                return handleReview({
                                                                    variables: {
                                                                        ID: phase.ID,
                                                                        review: { ID, approved, type, comment },
                                                                    },
                                                                });
                                                            }
                                                            }
                                                            review={phase.reviews?.[i] || {}}
                                                            projectID={singleProject._id}
                                                            disabled={isDisabled || !canReview}
                                                        />
                                                    </Grid>
                                                </ListItem>
                                            </React.Fragment>
                                        </Accordion>
                                    ))}
                                </Grid>
                            );
                        }

                        if (step.progress) {
                            return (
                                <ListItem key="progress" className="ListItem-progress">
                                    <ListItemIcon>
                                        <TrendingUpIcon />
                                    </ListItemIcon>
                                    <div className={classes.progressRoot}>
                                        <Typography className={classes.energyProgressLabel}>
                                            {t('transitionRequests.progressEnergy')}
                                        </Typography>
                                        <LinearProgress
                                            className={classes.linearProgress}
                                            variant="determinate"
                                            value={energyTableMetrics.resultInPercentage}
                                            color="primary"
                                        />
                                        <Typography className={classes.progressValue}>
                                            {`${energyTableMetrics.resultInPercentage.toFixed(2)} %`}
                                        </Typography>
                                        <Button
                                            component={Link}
                                            to={`/project/${singleProject._id}/annexes#3`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            variant="outlined" className={classes.floatRight}
                                        >
                                            {t('transitionRequests.completeEnergyBaseline')}
                                        </Button>
                                    </div>
                                </ListItem>
                            );
                        }

                        if (step.table) {
                            return (
                                <ListItem key="work_phase_table" style={{ display: 'table' }}>
                                    {step.table === 'workPhase_scope_renovation' ?
                                        <ContractTable
                                            table="workPhase_scope_renovation"
                                            disabled={isDisabled}
                                            component={'div'}
                                        /> :
                                        energyTables.map((el, i) => <ListOfTasks key={i} table={el} locale={user.language} />)
                                    }
                                </ListItem>
                            );
                        }

                        if (step.editableTable === 'monitoring_phase_table') {
                            return (
                                <ListItem key="editable-table" style={{ display: 'table' }}>
                                    {monitoringTable.map((el, i) => (
                                        <Accordion
                                            key={i} expanded={expanded === i}
                                            onChange={() => {
                                                window.location.href = `/project/${singleProject._id}/results-monitoring#0-${i}`;
                                                setExpanded(expanded === i ? null : i);
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                            >
                                                <Typography>
                                                    <MaintenanceYear
                                                        project={singleProject}
                                                        year={parseInt(el[1][0][0], 10) - 1}
                                                    />
                                                </Typography>
                                            </AccordionSummary>
                                            <TableForm
                                                key={i}
                                                data={el}
                                                handleFormSubmit={updateMonitoringTable}
                                                singleProject={singleProject}
                                                disabled={disabled}
                                            />
                                        </Accordion>
                                    ))}
                                </ListItem>
                            );
                        }

                        if (step.editableTable === 'maitenance_log') {
                            return (
                                <ListItem key="building-maintenance-table">
                                    <BuildingMaintenanceTable
                                        // Milestone (or phase) could be disabled, but the milestone
                                        // can be explicitly enabled (eg. via `unlocksOn` prop). If
                                        // this is the case we'd want to have the table enabled.
                                        disabled={isDisabled && !milestoneEnabled}
                                    />
                                </ListItem>
                            );
                        }

                        if (step.reviews) {
                            const buttonLabels = {};
                            if (milestone.milestoneEnum === 'FORFAITING_PAYMENT') {
                                buttonLabels.EXECUTIVE = 'Review Forfaiting payment';
                            }
                            return (
                                <React.Fragment key={step.label}>
                                    <Typography className={classes.reviewsLabel}>
                                        {step.label}
                                    </Typography>
                                    <FAReviews
                                        reviewTypes={step.reviews}
                                        faReviews={phase?.reviews}
                                        buttonLabels={buttonLabels}
                                        projectID={singleProject._id}
                                        disabled={isDisabled || !canReview}
                                        handleReview={(approved, type, comment, ID) => {
                                            return handleReview({
                                                variables: {
                                                    ID: phase.ID,
                                                    review: { ID, approved, type, comment }
                                                }
                                            }).then(onSuccessfulUpdate);
                                        }}
                                        reviewProps={{
                                            ReviewComponent: ListItem,
                                            className: 'ListItem-progress',
                                        }}
                                    />
                                </React.Fragment>
                            );
                        }

                        if (step.meeting) {
                            const stepMeetings = meetings?.filter((meeting) => {
                                if (meeting.topic === step.meeting) {
                                    return true;
                                }
                                if (meeting.topic === step.meetingAlias) {
                                    return true;
                                }
                                return false;
                            }) || [];

                            return (
                                <ListItem key={step.label} disabled={isDisabled}>
                                    
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography>
                                                <ListItemIcon>
                                        <MilestoneStepIcon validStatus={validStatus} disabled={isDisabled} />
                                    </ListItemIcon> {step.label}
                                                    {step.required &&
                                                        <span style={{ fontSize: 13, fontStyle: 'italic' }}> ({t('auth.required')})</span>
                                                    }
                                                </Typography>
                                                {step.uploadsList &&
                                                    <List subheader={<ListSubheader>{t('documents.requiredDocuments')}</ListSubheader>}>
                                                        {step.uploadsList.map((el, i) => (
                                                            <ListItem key={i} style={{ padding: '0px 20px' }}>
                                                                <ListItemText className={classes.uploadsListItem}>
                                                                    {`- ${el}`}
                                                                </ListItemText>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                }
                                                {step.attendants &&
                                                    <List subheader={<ListSubheader>{t('milestones.requiredAttendants')}</ListSubheader>}>
                                                        {step.attendants.map((el, i) => (
                                                            <ListItem key={i} style={{ padding: '0px 20px' }}>
                                                                <ListItemText className={classes.uploadsListItem}>
                                                                    {`- ${el}`}
                                                                </ListItemText>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                }
                                            </React.Fragment>
                                        }

                                    />

                                    <ListItemText
                                        className={classes.meetingListItemText}
                                        primary={
                                            <React.Fragment>
                                                <Typography>
                                                    {t('meetings.listOfMeetings')}:
                                                </Typography>
                                                <Grid className={classes.meetingsList}>
                                                    {
                                                        stepMeetings.length > 0 ?
                                                            stepMeetings.map(m => (
                                                                <Link
                                                                    to={{
                                                                        pathname: `/meeting/${m.ID}`,
                                                                        prevPath: `${props.history.location.pathname}${props.history.location.hash}`
                                                                    }}
                                                                    className={classes.meetingLink}
                                                                    key={m.ID}
                                                                >
                                                                    <GroupIcon color="inherit" style={{ marginRight: 15 }} />
                                                                    {m.name}
                                                                </Link>
                                                            )) :
                                                            <Typography className={classes.emptyMeetings}>
                                                                {t('meetings.noMeetings')}
                                                            </Typography>
                                                    }
                                                </Grid>
                                            </React.Fragment>
                                        }
                                    />

                                    <ListItemSecondaryAction>
                                        <div className={classes.meetingButtonWrapper}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<GroupAddIcon />}
                                                onClick={() => handleRegisterOpen(step)}
                                                disabled={isDisabled}
                                            >
                                                {t('meetings.createNewMeeting')}
                                            </Button>
                                            {step.includesMeeting && (
                                                <FormControlLabel
                                                    value="top"
                                                    control={
                                                        <Checkbox
                                                            color="primary"
                                                            onChange={(e) => {
                                                                if (!e.target.checked) {
                                                                    setIncludesMeetings({ ...includesMeetings, [step.meeting]: undefined });
                                                                    return;
                                                                }
                                                                setIncludesMeetings({
                                                                    ...includesMeetings,
                                                                    [step.meeting]: { meetingType: step.includesMeeting.meeting },
                                                                });
                                                            }}
                                                        />
                                                    }
                                                    label={t('milestones.alsoMeeting', { meetingType: step.includesMeeting.meetingLabel })}
                                                    labelPlacement="end"
                                                    className={classes.meetingAlsoLabel}
                                                />
                                            )}
                                        </div>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        }
                        return (
                            <Grid
                                item
                                className={classes.borderBottom}
                                key={step.label}
                            >
                                <ListItem disabled={isDisabled}>
                                    
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography>
                                                <ListItemIcon>
                                        <MilestoneStepIcon validStatus={validStatus} disabled={isDisabled} />
                                    </ListItemIcon> {step.label}
                                                    {step.required &&
                                                        <span style={{ fontSize: 13, fontStyle: 'italic' }}> ({t('auth.required')})</span>
                                                    }
                                                </Typography>
                                                {step.hint && (
                                                    <Typography className={classes.stepHint}>
                                                        {step.hint}
                                                    </Typography>
                                                )}
                                                {step.uploadsList &&
                                                    <List subheader={<ListSubheader>{t('documents.requiredDocuments')}</ListSubheader>}>
                                                        {step.uploadsList.map((el, i) => (
                                                            <ListItem key={i} style={{ padding: '0px 20px' }}>
                                                                <ListItemText className={classes.uploadsListItem}>
                                                                    {`- ${el}`}
                                                                </ListItemText>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                }
                                            </React.Fragment>
                                        }
                                        secondary={
                                            validStatus.files?.length > 0 ? validStatus.files?.map((attachment) => {
                                                return (
                                                    <span key={attachment.ID} >
                                                        {decodeURI(attachment.name)}
                                                        <Tooltip placement="top" title={t('documents.download')} disabled={isDisabled}>
                                                            <IconButton
                                                                size="small"
                                                                component="a"
                                                                href={ENDPOINTS.SERVER + `/${entity.type}/` + entity.id + '/' + attachment.name}
                                                                download
                                                                target="_blank"
                                                            >
                                                                <DownloadIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {!disableDeleteCommissioning() &&
                                                            <DeleteUpload
                                                                isDisabled={isDisabled}
                                                                attachment={attachment}
                                                                entity={entity}
                                                                refetch={refetch}
                                                                deleteDocument={deleteDocument}
                                                            />
                                                        }
                                                    </span>
                                                );
                                            }) : undefined
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        {(step.uploadType === 'signed epc' && canSignProject(user, singleProject)) &&
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                disabled={disabled || !milestoneEnabled || singleProject.data.epc_signed}
                                                className={classes.signEpc}
                                                onClick={() => createOrUpdateProjectAction({ ID: singleProject._id, epc_signed: true })}
                                            >
                                                {t('projects.epcHasBeenSigned')}
                                            </Button>
                                        }
                                        <Upload
                                            entity={{
                                                id: singleProject._id,
                                                attachments: Object.values(singleProject._attachments || []).filter(
                                                    (file) => file.upload_type === step.uploadType
                                                ),
                                                type: 'project',
                                                uploadType: step.uploadType
                                            }}
                                            loggedUserRole="member"
                                            userIsSuperUser={userIsSuperUser}
                                            buttonOnly
                                            canUpload
                                            disabled={isDisabled}
                                            hint={step.hint}
                                            onSuccess={refetch}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </Grid>
                        );
                    })}
                </List>
            </Grid>
            <Grid
                item
                xs={6}
                align="left"
            >
                {milestone.milestoneEnum === 'PROJECT_PREPARATION' && (!singleProject?.data?.ForfaitingApplication ?
                    <ForfaitingForm disabled={isDisabled} refetch={refetch} /> :
                    <ForfaitingApplication
                        forfaitingApplication={singleProject?.data?.ForfaitingApplication}
                        disabled={(!unlocked && !Boolean(singleProject?.data?.ForfaitingApplication)) || disabled || isDisabled}
                    />)
                }
            </Grid>
            <Grid
                item
                xs={6}
                align="right"
            >
                {milestone.milestoneEnum === 'COMMISSIONING' && singleProject.data.milestone !== 'commissioning' &&
                    <CompleteMilestone
                        nextMilestone={milestone.milestoneEnum}
                        buttonLabelKey="milestones.completeCommissioning"
                        milestoneLabel={milestone.label}
                        projectID={singleProject._id}
                        completeMilestone={() => advanceToMilestone({
                            variables: {
                                projectID: singleProject._id,
                                nextMilestone: milestone.milestoneEnum,
                            }
                        }).then(onSuccessfulUpdate)}
                        disabled={!canCompleteCommissioning()}
                    />
                }
                {shouldRenderCompletePhase ?
                    <AdvanceToNextPhase
                        projectId={singleProject._id}
                        advanceToNextPhase={advanceToNextPhase ? advanceToNextPhase : advanceProjectToWorkPhase}
                        phaseType={phase?.__typename}
                        disabled={isDisabled || canCompleteAfterCommissioning()}
                        unlocked={unlocked}
                        tooltipTitle={t('tooltips:maintenanceTableNotReady')}
                        buildingMaintenance={buildingMaintenance}
                        periodicActivitiesRows={periodicActivitiesRows}
                    /> :
                    unlocked ?
                        null
                        :
                        singleProject.data?.WorkPhase?.ID === '00000000-0000-0000-0000-000000000000' &&
                        <CompleteMilestone
                            nextMilestone={milestone.milestoneEnum}
                            milestoneLabel={milestone.label}
                            projectId={singleProject._id}
                            completeMilestone={() => advanceToMilestone({
                                variables: {
                                    projectID: singleProject._id,
                                    nextMilestone: milestone.milestoneEnum
                                }
                            })}
                            disabled={!canCompleteMilestone || isDisabled || !allStepsValid}
                        />
                }
            </Grid>
            {registerOpen && (
                <MeetingRegister
                    open
                    host={singleProject.data.owner}
                    handleClose={handleRegisterOpen}
                    organization={organization}
                    project={singleProject._id}
                    meetingType={registerOpen.meetingType}
                    meetingTypesAliases={registerOpen.meetingTypesAliases}
                    navigateOnCompleted={false}
                />
            )}
        </Grid>
    );
}

function CompleteMilestone(props) {
    const classes = useStyles();
    const { t } = useTranslation('translations');
    const [isOpen, setIsOpen] = useState(false);
    const {
        nextMilestone,
        milestoneLabel,
        buttonLabelKey,
        projectId,
        completeMilestone,
        disabled,
    } = props;

    const handleIsOpen = () => {
        setIsOpen(!isOpen);
    };

    const title = nextMilestone === 'COMMISSIONING'
        ? `${t('tooltips:projects.epc.assetAcquisitionCompleteMilestone')} ${t('tooltips:projects.epc.commissioningDateDisclamer')}`
        : t('tooltips:projects.epc.assetAcquisitionCompleteMilestone');

    return (
        <div className={classes.completeMilestoneWrapper}>
            <UserTooltip
                icon={<InfoIcon />}
                iconButtonProps={{ size: 'small', color: 'primary', component: 'span' }}
                title={title}
                action="click"
            />
            <Button
                onClick={handleIsOpen}
                variant="contained"
                color="secondary"
                disabled={disabled}
            >
                {t(buttonLabelKey)}
            </Button>
            <Dialog
                open={isOpen}
                onClose={handleIsOpen}
            >
                <DialogTitle>{t('transitionRequests.pleaseConfirm')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`${t('transitionRequests.areYouSure', { milestone: milestoneLabel })}`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleIsOpen}
                        color="primary"
                    >
                        {t('utils.confirmDialogCancel')}
                    </Button>
                    <Button
                        onClick={() => {
                            handleIsOpen();
                            completeMilestone({
                                variables: {
                                    project: projectId,
                                    to: nextMilestone
                                }
                            });
                        }}
                        color="primary"
                        autoFocus
                    >
                        {t('transitionRequests.completeMilestone')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

CompleteMilestone.defaultProps = {
    disabled: false,
    buttonLabelKey: 'transitionRequests.completeMilestone',
};

function AdvanceToNextPhase(props) {
    const classes = useStyles();
    const { t } = useTranslation('translations');
    const [isOpen, setIsOpen] = useState(false);
    const {
        projectId,
        advanceToNextPhase,
        phaseType,
        disabled,
        unlocked,
        tooltipTitle,
        buildingMaintenance,
        periodicActivitiesRows,
    } = props;

    const handleIsOpen = () => {
        setIsOpen(!isOpen);
    };

    const maintenanceReady = isMaintenanceReady(buildingMaintenance.data, periodicActivitiesRows);

    return (
        <div className={classes.completeMilestoneWrapper}>
            {phaseType === 'WorkPhase' &&
                <UserTooltip
                    icon={<InfoIcon />}
                    iconButtonProps={{ size: 'small', color: 'primary', component: 'span' }}
                    title={tooltipTitle}
                    action="click"
                />
            }
            <Button
                onClick={handleIsOpen}
                variant="contained"
                color="secondary"
                disabled={
                    phaseType === 'WorkPhase' ?
                        disabled || !maintenanceReady :
                        disabled
                }
            >
                {unlocked ? t('milestones.completeConstructionPhase') : t('milestones.completePhase')}
            </Button>
            <Dialog
                open={isOpen}
                onClose={handleIsOpen}
            >
                <DialogTitle>
                    {phaseType ? t('milestones.completeWorkPhase') : t('milestones.completeAssetAquisition')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {phaseType ? t('milestones.completeAndAdvanceToMonitoringPhase') : t('milestones.completeAndAdvanceToWorkPhase')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleIsOpen}
                        color="primary"
                    >
                        {t('utils.confirmDialogCancel')}
                    </Button>
                    <Button
                        onClick={() => {
                            handleIsOpen();
                            advanceToNextPhase({
                                variables: {
                                    ID: projectId
                                }
                            });
                        }}
                        color="primary"
                        autoFocus
                    >
                        {t('milestones.advance')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

AdvanceToNextPhase.defaultProps = {
    disabled: false,
};

function ListOfTasks(props) {
    const { table, locale } = props;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    {table.columns.map((c, i) => (
                        <TableCell
                            key={i}
                            align={i > 0 ? 'right' : 'left'}
                        >
                            {parseTitle(c?.name, locale)}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {table.rows.map((r, index) => (
                    <TableRow key={index}>
                        {r.map((c, i) => (
                            <TableCell key={i} component="th" scope="row" align={i === 0 ? 'left' : 'right'}>
                                {parseTitle(c, locale)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function DeleteUpload(props) {
    const { t } = useTranslation('translations');
    const {
        isDisabled,
        deleteDocument,
        attachment,
        entity,
        refetch
    } = props;
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);

    return (
        <React.Fragment>
            <Tooltip
                placement="top"
                title={t('documents.delete')}
                disabled={isDisabled}
            >
                <IconButton
                    disabled={isDisabled}
                    size="small"
                    onClick={handleOpen}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Dialog
                open={isOpen}
                onClose={handleClose}
            >
                <DialogTitle>
                    {t('documents.pleaseConfirm')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('documents.areYouSure', { name: decodeURI(attachment.name) })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClose}
                    >
                        {t('utils.confirmDialogCancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            deleteDocument(attachment.name, entity, refetch);
                            handleClose();
                        }}
                        autoFocus
                    >
                        {t('notifications.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        userIsSuperUser: state.user.isSuperUser,
        singleProject: state.project.refetchProject,
        annex3: state.project.annexes.annex3,
        annex3Ready: state.project.annexes.annex3.annex3Ready,
        user: state.user,
        buildingMaintenance: state.buildingMaintenance,
        periodicActivitiesRows: state.project.annexes.annex4.table1.rows,
    };
};

const mapDispatchToProps = (dispatch) => ({
    refetchSingleProjectAction: (projectId) => dispatch(refetchSingleProject(projectId)),
    deleteDocument: (documentName, entity, onSuccess) => dispatch(deleteFile(documentName, entity, { onSuccess })),
    addAlert: (a) => dispatch(addAlert(a)),
    onSuccessfulUpdate: () => dispatch(addAlert({
        titleKey: 'projects.projectUPDATESuccessTitle',
        textKey: 'projects.projectUPDATESuccessInfo',
        level: 'success',
        alertType: 'notificationBox',
    })),
    createOrUpdateProjectAction: (data) => dispatch(createOrUpdateProject(data))
});

MilestonesAccordion.defaultProps = {
    periodicActivitiesRows: [],
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MilestonesAccordion));
