export const projectStatusTypes = (t) => [
  { value: '1', label: t('validStatus.planning') },
  { value: '2', label: t('validStatus.inProgress') },
  { value: '3', label: t('validStatus.finished') },
  { value: '4', label: t('validStatus.abandoned') },
];

export const projectPhases = (t) => {
  return [
    { value: 'zero', label: t('translations:projects.ZERO') },
    { value: 'asset_acquisition', label: t('translations:projects.AQUISITION') },
    { value: 'work_phase', label: t('translations:projects.WORK') },
    { value: 'monitoring_phase', label: t('translations:projects.MONITORING') },
  ];
};

export const transitionRequestStatus = {
  forReview: 'FOR_REVIEW',
  accepted: 'ACCEPTED',
  rejected: 'REJECTED',
  requestForChanges: 'REQUEST_FOR_CHANGES',
};

export const validStatus = 2;

export const validationStatuses = (t) => [
  { value: '1', label: t('translations:validStatus.registered') },
  { value: '2', label: t('translations:validStatus.valid') },
  { value: '3', label: t('translations:validStatus.declined') },
  { value: '4', label: t('translations:validStatus.pending') },
];

export const workStatuses = (t) => [
  { value: '1', label: t('translations:workStatus.scheduled') },
  { value: '2', label: t('translations:workStatus.inProgress') },
  { value: '3', label: t('translations:workStatus.completed') },
  { value: '4', label: t('translations:workStatus.late') },
  { value: '5', label: t('translations:workStatus.cancelled') },
  { value: '6', label: t('translations:workStatus.postponed') },
];
