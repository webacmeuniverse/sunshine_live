import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Grid,
    IconButton,
    makeStyles
} from '@material-ui/core';

import {
  Folder as FolderIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@material-ui/icons';

import Upload from '../../../containers/smartcomponents/UploadFile/UploadFile';
import TextWithIcon from '../../utils/TextWithIcon';
import Tooltip from '../../utils/TooltipWrapper';

import ENDPOINTS from '../../../constants/endpoints';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: 20,
  },
  heading: {
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      position: 'relative',
  },
  uploadActions: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(2),
      justifyContent: 'flex-end',
  },
}));

function OtherUploads(props) {
  const {
    attachments,
    entity,
    refetch,
    deleteDocument,
    disabled,
    project,
    comment,
    uploadType,
    type
  } = props;
  const classes = useStyles('translations');
  const { t } = useTranslation('translations');

  return (
    <Grid item sm={12} md={12} className={classes.container}>
      <props.component>
        <TextWithIcon icon={<FolderIcon color="disabled" />} className={classes.heading}>
          {t(`milestones.${type}`)}
        </TextWithIcon>
        <List dense>
          {attachments.map(a => (
            <ListItem key={a.ID}>
              <ListItemText
                secondary={a.name}
              />
              <ListItemSecondaryAction>
                <Tooltip placement="top" title={t('documents.delete')} disabled={disabled}>
                  <IconButton
                    size="small"
                    onClick={() => deleteDocument(a.name, entity, refetch)}
                    disabled={disabled}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip placement="top" title={t('documents.download')} disabled={disabled}>
                  <IconButton
                    size="small"
                    component="a"
                    href={ENDPOINTS.SERVER + `/${entity.type}/` + entity.id + '/' + a.name}
                    download
                    target="_blank"
                    disabled={disabled}
                  >
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <ListItem className={classes.uploadActions}>
            <Upload
              entity={{
                id: project._id,
                attachments: Object.values(project._attachments || []).filter(
                  (file) => file.upload_type === uploadType && file.comment === comment
                ),
                type: 'project',
                uploadType,
                comment
              }}
              loggedUserRole="member"
              buttonOnly
              canUpload
              onSuccess={refetch}
              disabled={disabled}
            />
          </ListItem>
        </List>
      </props.component>
    </Grid>
  );
}

export default OtherUploads;