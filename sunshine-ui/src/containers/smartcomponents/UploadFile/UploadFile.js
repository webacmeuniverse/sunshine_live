import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { withTranslation } from 'react-i18next';
import {
  Typography,
  Avatar,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Fab,
  withStyles
} from '@material-ui/core';
import {
  CloudUpload,
  CloudDownload,
  DeleteForever,
} from '@material-ui/icons';

import ENDPOINTS from '../../../constants/endpoints';
import Tooltip from '../../../components/utils/TooltipWrapper';
import { allowedMimeTypes } from '../../../utils/mimeTypes';
import { addAlert as alertAction } from '../../../actions/alerts';
import { uploadFile, deleteFile } from '../../../actions/uploads';
import ProgressBar from '../../../components/utils/ProgressBar';
import ButtonHint from '../../../components/utils/ButtonHint';
import MarkdownText from '../../../components/utils/MarkdownText';

import styles from './styles';

class UploadFile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      documents: [],
      error: '',
    };
    this.dropAccept = this.dropAccept.bind(this);
  }

  dropAccept(filesToUpload) {
    const docsToSave = [];
    for (const i in filesToUpload) {
      docsToSave.push({ document: filesToUpload[i], preview: URL.createObjectURL(filesToUpload[i]) });
    }

    this.setState({...this.state, documents: docsToSave});
  }

  /* eslint-disable complexity */
  render() {
    const {
      classes,
      addAlert,
      entity,
      uploadDocument,
      alertText,
      canUpload,
      canDelete,
      disabled,
      deleteDocument,
      mimeTypes,
      onSuccess,
      uploads,
      hint,
      buttonOnly,
      t,
    } = this.props;

    const { documents } = this.state;

    const handleUploadDocument = () => {
      const files = this.state.documents;

      if (files.length < 1) {
        addAlert(t('translations:documents.missingFile'), 'error');
      } else if (this.state.error) {
        addAlert(alertText, 'error');
      } else {
        for (const i in documents) {
          uploadDocument(files[i].document, entity, onSuccess);
        }
      }

      this.setState({ documents: [], error: '' });
    };

    if (buttonOnly) {
      return (
        <React.Fragment>
          <Dropzone
            onDropAccepted={(filesToUpload) => this.dropAccept(filesToUpload)}
            onDropRejected={() => addAlert(alertText, 'error')}
            accept={mimeTypes}
            className={classes.dropzoneContainer}
            disabled={disabled}
            
          >
            {({ getInputProps, getRootProps }) => {
              return (
                <div {...getRootProps()}
                  style={{
                    display: 'inline-flex',
                    marginRight: 6,
                  }}
                >
                  <input {...getInputProps()} />
                  <span>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={uploads.uploading || disabled}
                    >
                      {t('utils.addFile')}
                    </Button>

                    <Tooltip
                      placement="top"
                      title={(documents.length > 1 && documents.map(doc => doc.document.name).join('\n')) || 'Click the button above to add a file for upload'}
                      disabled={disabled}
                    >
                      <Typography
                        variant="caption"
                        component="p"
                        gutterBottom={false}
                        style={{
                          position: 'absolute',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                          width: 200
                        }}
                      >
                        {documents.length < 1 ? t('utils.noFileAdded') : documents.map(doc => doc.document.name).join('; ')}
                      </Typography>
                    </Tooltip>
                  </span>
                </div>
              );
            }}
          </Dropzone>
          <Button
            variant="contained"
            onClick={handleUploadDocument}
            color="secondary"
            endIcon={<CloudUpload />}
            disabled={uploads.uploading || this.state.documents.length < 1}
          >
            {t('notifications.upload')}
          </Button>
        </React.Fragment>
      );
    }

    return (
      <div className={`${classes.root} UploadFile-root`}>
        {hint && (
          <div className={`${classes.hintContainer} row`}>
            <ButtonHint hint={hint} />
          </div>
        )}
        <div className="row" style={{ marginRight: '0px',marginLeft: '0px' }}>
          <div className={`col-xs-12 col-lg-4 ${classes.dropzoneOuterContainer}`}>
            {
              dropZoneUpload({
                classes,
                uploads,
                mimeTypes,
                addAlert,
                alertText,
                handleUploadDocument,
                documents,
                canUpload,
                t,
              }, this.dropAccept)}
          </div>
          <div
            className={`col-xs-12 col-lg-8 UploadedFile-container ${classes.uploadedFilesContainer}`}
          >
            {
              uploads.deleting &&
              <div className={`${classes.dropzoneLoading} ${classes.dropzoneDeleteOverlay}`}>
                <ProgressBar addStyle={{ marginLeft: null }} />
              </div>
            }
            {listOfUploads({ classes, entity, canUpload, deleteDocument, onSuccess, canDelete, t })}
          </div>
        </div>
      </div>
    );
  }
  /* eslint-enable complexity */
}

UploadFile.defaultProps = {
  mimeTypes: allowedMimeTypes,
  canDelete: true,
};

UploadFile.propTypes = {
  entity: PropTypes.shape({
    id: PropTypes.string,
    attachments: PropTypes.array,
    type: PropTypes.string,
  }).isRequired,
  mimeTypes: PropTypes.string,
  onSuccess: PropTypes.func,
  canDelete: PropTypes.bool.isRequired,
};

export default withStyles(styles)(withTranslation('translations')(connect(
  state => ({
    uploads: state.uploads,
  }),
  dispatch => ({
    uploadDocument: (file, entity, onSuccess) => dispatch(uploadFile(file, entity, { onSuccess })),
    deleteDocument: (name, entity, onSuccess) => dispatch(deleteFile(name, entity, { onSuccess })), // eslint-disable-line no-shadow
    addAlert: (text, level) => dispatch(alertAction({ text, level })),
  })
)(UploadFile)));

function dropZoneUpload(props, dropAccept) {
  const {
    classes,
    uploads,
    mimeTypes,
    addAlert,
    alertText,
    handleUploadDocument,
    documents,
    canUpload,
    t,
  } = props;
  return (
    <React.Fragment>
      {uploads.uploading &&
        <div className={classes.dropzoneLoading}>
          <ProgressBar addStyle={{ marginLeft: null }} />
        </div>
      }
      <Dropzone
        onDropAccepted={(filesToUpload) => {
          dropAccept(filesToUpload);
        }}
        onDropRejected={() => addAlert(alertText, 'error')}
        accept={mimeTypes}
        className={classes.dropzoneContainer}
        disabled={!canUpload}

      >
        {({ getInputProps, getRootProps }) => {
          if (uploads.uploading) {
            return null;
          }
          return (
            <section className={classes.section} style={{ marginTop: '0px',marginBottom: '0px' }}>
              <div {...getRootProps()} className={classes.dropzoneInputWrapper} style={{ margin: '10px' }}>
                <input {...getInputProps()} />
                {documents.length > 0 ? documents[0].document.type === 'image/jpeg' || documents[0].document.type === 'image/png' ?
                  <React.Fragment>
                    <Avatar
                      className={classes.avatar}
                      src={documents.length > 0
                        ? documents[0].preview
                        : null
                      }
                    />
                    <div className={classes.selectedFileOnHoverMessage}>
                      <MarkdownText text={t('utils.dragOrUploadCTA', { maxSize: 50 })} variant="caption" />
                    </div>
                  </React.Fragment> :
                  <div className={classes.droppedFileContainer}>
                    <div className={classes.droppedFileDocumentStyle}>
                      <span className={classes.dropzoneLabelSpan}>{documents.map(doc => doc.document.name).join('\n')}</span>
                    </div>
                    <div className={classes.selectedFileOnHoverMessage}>
                      <MarkdownText text={t('utils.dragOrUploadCTA', { maxSize: 50 })} variant="caption" />
                    </div>
                  </div> :
                  <div className={classes.logoDropzoneContainer}>
                    <div className={classes.logoDropzoneInner}>
                      <div className={classes.dashedIconContainer}>
                        <CloudUpload style={{ width: '45px', height: '45px', color: '#e2e3e9' }} />
                      </div>
                    </div>
                    <div className={classes.dropzoneLabel}>
                      <MarkdownText text={t('utils.dragOrUploadCTA', { maxSize: 50 })} variant="caption" />
                    </div>
                  </div>}
              </div>
            </section>
          );
        }}
      </Dropzone>
      <Button style={{ margin: '6px' }}
        variant='contained'
        onClick={handleUploadDocument}
        className={`${classes.uploadButton} UploadFile-button`}
        disabled={uploads.uploading || !canUpload}
      >
        {t('notifications.upload')}
      </Button>
    </React.Fragment>
  );
}

function listOfUploads(props) {
  const { classes, entity, canUpload, deleteDocument, onSuccess, canDelete, t } = props;
  if (!entity.attachments) {
    return (
      <div className={classes.noUploads}>
        {t('utils.noUploadedFilesYet')}
      </div>
    );
  }
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell padding="none" className={classes.fileNames}>{t('documents.fileNames')}</TableCell>
          <TableCell padding="none" className={classes.actions} align="right">{t('documents.actions')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(entity.attachments || []).map((attachment, i) => (
          <TableRow key={i}>
            <TableCell padding='none' scope='row'>
              {decodeURI(attachment.name)}
            </TableCell>
            <TableCell padding='none' align='right'>
              {canUpload &&
                <Fab
                  disabled={!canDelete}
                  onClick={() => deleteDocument(attachment.name, entity, onSuccess)}
                  className={classes.floatingButton}
                >
                  <DeleteForever />
                </Fab>
              }
              <a
                href={ENDPOINTS.SERVER + `/${entity.type}/` + entity.id + '/' + attachment.name}
                style={{ textDecoration: 'none' }}
                download
              >
                <Fab className={classes.floatingButton}>
                  <CloudDownload />
                </Fab>
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
