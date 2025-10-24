import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import requestPermissionSVG from '../../images/svgIcons/Project_Request_Approval.svg';
import OrganizationAssetsForm from './ProjectForms/BuildingForm/OrganizationAssetsForm';
import RegisterProjectCard from './ProjectCard/RegisterProjectCard';

const defaultData = {
  publicOrganizationQuery: '',
  publicOrganization: null,
};

function RequestAssetPermission() {
  const { t } = useTranslation('translations');
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(defaultData);

  function handleIsOpen() {
    setIsOpen(!isOpen);
    setData(defaultData);
  }

  return (
    <React.Fragment>
      <RegisterProjectCard
        label='assets.requestPermission'
        tooltip='tooltips:projects.requestPermission'
        onClick={handleIsOpen}
        imgSrc={requestPermissionSVG}
      />

      <Dialog
        open={isOpen}
        onClose={handleIsOpen}
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle>
          {t('assets.requestProjectCreationPermission')}
        </DialogTitle>
        <DialogContent>
          <OrganizationAssetsForm
            publicOrganization={data.publicOrganization}
            publicOrganizationQuery={data.publicOrganizationQuery}
            handleSetData={setData}
            ownerUUID={data.publicOrganization?.ID}
            requestOnly
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleIsOpen}
          >
            {t('utils.confirmDialogClose')}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default RequestAssetPermission;
