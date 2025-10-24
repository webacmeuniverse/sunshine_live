import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { workPhase } from '../../../constants/milestones';
import { GET_WORK_PHASE } from '../../../actions/projectsQueries';

import apolloClient from '../../../utils/apolloClient';
import Milestones from './Milestones';

import {
    REVIEW_WORK_PHASE,
    ADVANCE_PROJECT_TO_MONITORING_PHASE,
    COMMENT_PROJECT
} from '../../../actions/projectsMutations';
import { getMaintenanceRows } from '../../../actions/projects';

function WorkPhaseWrapper(props) {
    const { getMaintenanceData, project } = props;
    const { t } = useTranslation('translations');
    const technicalClosingMilestone = 'TECHNICAL_CLOSING';

    useEffect(() => {
        getMaintenanceData(project?._id);
    }, [getMaintenanceData, project]);

    const { loading, data, refetch } = useQuery(GET_WORK_PHASE, {
        client: apolloClient,
        variables: {
            id: props.project?.data?.WorkPhase.ID,
        },
    });

    const [reviewWorkPhase] = useMutation(REVIEW_WORK_PHASE, {
        client: apolloClient,
        onCompleted: () => refetch()
    });

    const [commentProject] = useMutation(COMMENT_PROJECT, {
        client: apolloClient,
        onCompleted: () => refetch()
    });

    const [advanceProjectToMonitoringPhase] = useMutation(ADVANCE_PROJECT_TO_MONITORING_PHASE, {
        client: apolloClient,
        onCompleted: (response) => {
            commentProject({
                variables: {
                    id: project._id,
                    comment: `${t('milestones.technicalClosing')} ${t('milestones.completedOn')} ${new Date().toLocaleString('de-DE')}`,
                    topic: technicalClosingMilestone
                }
            });
            props.history.push(`/project/${response.advanceProjectToMonitoringPhase.project}/results-monitoring`);
        }
    });

    if (loading) {
        return null;
    }

    // Set phase to `false` if no phase yet, so that
    // `canEdit` checks can know that the phaes is not
    // reached yet.
    const phase = data?.getWorkPhase || false;

    return (
        <Milestones
            milestones={workPhase(t)}
            phase={phase}
            disabled={!phase}
            handleReview={reviewWorkPhase}
            refetchPhase={refetch}
            advanceToNextPhase={advanceProjectToMonitoringPhase}
            unlocked
            labelIconBlank
        />
    );
}

export default withRouter(connect(
    state => ({
        project: state.project.singleProject
    }),
    dispatch => ({
        getMaintenanceData: (projectID) => dispatch(getMaintenanceRows(projectID))
    })
)(WorkPhaseWrapper));
