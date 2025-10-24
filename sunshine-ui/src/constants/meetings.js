export const meetingsUploadTypes = (t) => ({
  ACQUISITION: [
    { type: 'aquisition protocol meeting', title: t('translations:milestones.signedProtocolMeeting') },
  ],
  ACQUISITION_ACQUISITION_COMMITMENT: [ // eslint-disable-line id-length
    { type: 'aquisition protocol meeting', title: t('translations:milestones.signedProtocolMeeting') },
    { type: 'pre epc agreement', title: t('translations:milestones.preEpcAgreement') },
  ],
});

export const meetingTypesAliases = {
  ACQUISITION_ACQUISITION_COMMITMENT: ['ACQUISITION', 'ACQUISITION_COMMITMENT'], // eslint-disable-line id-length
};
