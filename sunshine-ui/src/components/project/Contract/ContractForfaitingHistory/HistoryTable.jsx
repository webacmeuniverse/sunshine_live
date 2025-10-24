import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableContainer,
    TableCell,
    Paper,
    Typography,
    makeStyles
} from '@material-ui/core';

import { SERVER } from '../../../../constants/endpoints';

const useStyles = makeStyles({
    container: {
        padding: '30px 0px',
    },
    table: {
        maxHeight: 680
    },
});

function HistoryTable(props) {
    const { files, title } = props;
    const { t } = useTranslation('translations');
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Typography variant="h5" align="center" gutterBottom>
                {title}
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            {files.length === 0 ?
                                <TableCell align="center">{t('documents.noContractsUploaded')}</TableCell> :
                                <React.Fragment>
                                    <TableCell>{t('documents.name')}</TableCell>
                                    <TableCell align="right">{t('documents.uploadedAt')}</TableCell>
                                </React.Fragment>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.map((f) => <RenderRow key={f.ID} file={f} />)}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

function RenderRow(props) {
    const { file } = props;

    return (
        <TableRow key={file.ID}>
            <TableCell component="th" scope="row">
                <a target="_blank" rel="noopener noreferrer" href={`${SERVER}/project/${file.Owner}/${file.name}`}>
                    {decodeURI(file.name)}
                </a>
            </TableCell>
            <TableCell align="right">{moment(file.CreatedAt).format('DD-MM-YYYY')}</TableCell>
        </TableRow>
    );
}

export default HistoryTable;
