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
import { confirmAlert } from 'react-confirm-alert';
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import styles from './styles';

class UploadFileEnergyCertificate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      documents: [],
      energyCertificateDocuments: [],
      error: '',
    };
    this.dropAccept = this.dropAccept.bind(this);
  }
  
  

  dropAccept(filesToUpload) {
    const docsToSave = [];
    for (const i in filesToUpload) {
      docsToSave.push({ document: filesToUpload[i], preview: URL.createObjectURL(filesToUpload[i]) });
    }

    this.setState({ ...this.state, documents: docsToSave });
  }
  fileUpload() {
    const files = this.state.documents;

    const logoFD = new FormData();
    logoFD.append('file', files[0].document);
    logoFD.append('kind', 'cert');
        let assetID = window.location.pathname.split('/')[3];
        const c = {
          method: 'POST',
          credentials: 'include',
        };

        
        fetch(`${ENDPOINTS.SERVER}/energy/cert/file/${this.props.entity.id}`,  { ...c, body: logoFD })
          .then(res => res.json())
          // .then((result) => result.length ? JSON.parse(text) : {})
          .then(
            (result) => {
             
              if (result != null) {
                this.setState({ documents: [], error: '' });
               
                this.props.addAlert('File uploaded successfully!', 'success');

                this.props.onSuccess();
                
              }else{
               
                this.props.addAlert('There was an error!', 'error');
              }
            },

          ).catch(error => {
            this.props.addAlert('There was an error!', 'error');
          });

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
      uploadedFileData,
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
        // for (const i in documents) {
        //   uploadDocument(files[i].document, entity, onSuccess);
        // }
   
     if(uploadedFileData.length !== 0){
      confirmAlert({
        title: "",
        message: this.props.t('translations:assetEnergyCertificate.deleteFile'),
        buttons: [
          {
            label: this.props.t('translations:navigation.yes'),
            onClick: () => this.fileUpload()
          },
          {
            label: this.props.t('translations:navigation.no'),
            //onClick: () => alert('Click No')
          }
        ]
      });
     }else{
      this.fileUpload();

     }
         
      
      }

      
    };
   
    if (buttonOnly) {
      return (
        <React.Fragment>
          <Dropzone
            onDropAccepted={(filesToUpload) => this.dropAccept(filesToUpload)}
            onDropRejected={() => addAlert(alertText, 'error')}
            accept={mimeTypes}
            className={classes.dropzoneContainer}
           

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
                     
                    >
                      {t('utils.addFile')}
                    </Button>

                    <Tooltip
                      placement="top"
                      title={(documents.length > 1 && documents.map(doc => doc.document.name).join('\n')) || 'Click the button above to add a file for upload'}
                    
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
            disabled={this.state.documents.length < 1}
          >
            {t('notifications.upload')}
          </Button>
        </React.Fragment>
      );
    }

    return (
      <div className={`${classes.root} UploadFile-root`} style={{ border: '1px solid #d3cfcf',borderRadius: '7px',height: '100px',minHeight: '100px',maxHeight: '100px' }}>
        {hint && (
          <div className={`${classes.hintContainer} row`}>
            <ButtonHint hint={hint} />
          </div>
        )}
<div className="col-md-12" >
       
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

      </div>
    );
  }
  /* eslint-enable complexity */
}

UploadFileEnergyCertificate.defaultProps = {
  mimeTypes: allowedMimeTypes,
  canDelete: true,
};

UploadFileEnergyCertificate.propTypes = {
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
)(UploadFileEnergyCertificate)));

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
      
        <div className="row" style={{ padding: '0px' }}>
          <div className="col-md-6" style={{ padding: '0px' }} >
            <Dropzone
              onDropAccepted={(filesToUpload) => {
                dropAccept(filesToUpload);
              }}
              onDropRejected={() => addAlert(alertText, 'error')}
              accept={mimeTypes}
              className={classes.dropzoneContainer}
              

            >
              {({ getInputProps, getRootProps }) => {
                if (uploads.uploading) {
                  return null;
                }
                return (
                  <section className={classes.section} style={{ marginTop: '0px', marginBottom: '0px',height: '100%'}}>

                    <div {...getRootProps()} className={classes.dropzoneInputWrapper} style={{ margin: '0px',height: '100%' }}>
                      <input {...getInputProps()} />
                      {documents.length > 0 ? documents[0].document.type === 'image/jpeg' || documents[0].document.type === 'image/png' ?
                        <React.Fragment>
                          <div className={classes.logoDropzoneContainer} style={{position: 'absolute',width: '100%'}}>
                          <div className={classes.logoDropzoneInner} style={{ margin: '0px' ,height: '100%'}}>
                            <div className={classes.dashedIconContainer} style={{    padding: '0%'}}>
                            <div style={{   marginTop: '15px',fontSize: '12px',fontWeight: '900',color: 'black'}}>
                          {documents[0].document.name}
                             </div>
                              <CloudUpload style={{ width: '15px', height: '15px', color: '#e2e3e9' }} />
                            </div>
          
                          </div>
                          {/* <div className={classes.dropzoneLabel}>
                            <MarkdownText text={t('utils.dragOrUploadCTA', { maxSize: 50 })} variant="caption" />
                          </div> */}
                        </div>
                          
                         
                        </React.Fragment> :
                        <div className={classes.logoDropzoneContainer} style={{position: 'absolute',width: '100%'}}>
                        <div className={classes.logoDropzoneInner} style={{ margin: '0px' ,height: '100%'}}>
                          <div className={classes.dashedIconContainer} style={{    padding: '0%'}}>
                          <div style={{   marginTop: '15px',fontSize: '12px',fontWeight: '900',color: 'black'}}>
                       {documents.map(doc => doc.document.name).join('\n')}
                           </div>
                            <CloudUpload style={{ width: '15px', height: '15px', color: '#e2e3e9' }} />
                          </div>
        
                        </div>
                        {/* <div className={classes.dropzoneLabel}>
                          <MarkdownText text={t('utils.dragOrUploadCTA', { maxSize: 50 })} variant="caption" />
                        </div> */}
                      </div>
                         :
                        <div className={classes.logoDropzoneContainer}>
                          <div className={classes.logoDropzoneInner} style={{ margin: '0px',  height: '100%' }}>
                            <div className={classes.dashedIconContainer} style={{ padding: '0%' }}>
                            <div style={{marginTop: '21px'}}>
                            {t('translations:assetEnergyCertificate.Dragfilehere')}
                                 
                                 </div>
                              <CloudUpload style={{ width: '15px', height: '15px', color: '#e2e3e9' }} />
                            </div>
          
                          </div>
                          {/* <div className={classes.dropzoneLabel}>
                            <MarkdownText text={t('utils.dragOrUploadCTA', { maxSize: 50 })} variant="caption" />
                          </div> */}
                        </div>
                        
                        }
                    </div>
                    
                  </section>
                );
              }}
            </Dropzone>
           
          </div>
          <div className="col-md-6" style={{paddingRight: '0px'}}>
            <Button style={{ marginTop: '7px',marginBottom: '0px',height: '100%',width: '100%',backgroundColor: '#fdcf00 !important'}}
              variant='contained'
              onClick={handleUploadDocument}
              className={`${classes.uploadButton} UploadFile-button`}
             
            >
              {t('notifications.upload')}
            </Button>
          </div>
          
        </div>

      

    </React.Fragment>
  );
}

