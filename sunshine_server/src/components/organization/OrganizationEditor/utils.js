export const vlalidationRules = {
  website: { rule: 'validDomain', errorMessage: 'validation.validUrl' },
  email: { rule: 'validEmail', errorMessage: 'validation.validEmail' },
};

export const legalFormsRequiredFiles = {
  4: ['organizations.requiredDocsRC'],
  OTHER: [
    'organizations.requiredDocsRegisgration',
    'organizations.requiredDocsProofOfAddr',
    'organizations.requiredDocsVAT',
  ],
  LEAR: [
    'organizations.requiredPersonalId',
    'organizations.requiredLearApply',
  ]
};

export const detailsFormRequiredFiles = {
  INVALIDATION: [
    'navigation.documents'
  ]
};

export function requiredInvalidation(invalidated) {
  if (!invalidated) {
    return [];
  }
  return (detailsFormRequiredFiles.INVALIDATION).map((_, i) => `files.${i}`);
}

export function requiredFilesFields(legalForm) {
  if (!legalForm) {
    return [];
  }
  return (legalFormsRequiredFiles[legalForm] || legalFormsRequiredFiles.OTHER).map((_, i) => `files.${i}`);
}

export function requiredLearApply(legalForm) {
  if (!legalForm) {
    return [];
  }
  return (legalFormsRequiredFiles.LEAR).map((_, i) => `learApplyDoc.${i}`);
}