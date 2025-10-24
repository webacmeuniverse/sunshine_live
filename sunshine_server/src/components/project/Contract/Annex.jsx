import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Grid,
  makeStyles,
} from '@material-ui/core';
import {
  Warning as WarningIcon,
} from '@material-ui/icons';

import parseSpecialSymbols from '../../../utils/parseSpecialSymbols';
import { createOrUpdateProject } from '../../../actions/projects';
import TextWithIcon from '../../utils/TextWithIcon';
import ContractTable from './ContractTable';
import AnnexInlineInstruction from './AnnexInlineInstruction';
import { canEditProject } from '../../../utils/can';

const useStyles = makeStyles(theme => ({
  root: {
    '& .epc-inline-table': {
      width: '100%',
      borderSpacing: 0,
      borderCollapse: 'collapse',
      marginBottom: theme.spacing(2),

      '& tbody > tr': {
        border: `1px solid ${theme.palette.divider}`,

        '&:last-child': {
          marginBottom: 0,
        },

        '& > td': {
          borderRight: `1px solid ${theme.palette.divider}`,
          padding: `${theme.spacing(0.1)}px ${theme.spacing(0.5)}px`,

          '&:last-child': {
            borderRight: 0,
            width: '50%',
            paddingLeft: theme.spacing(1),
          },
          '&:empty::after': {
            content: '"\\00a0"',
          },
          '& > span': {
            display: 'flex',
          },
        },
      },
    },

    '& .react-datepicker-wrapper': {
      width: 'auto',
      '& .react-datepicker__input-container': {
        width: 'auto',
      },
    },

    '& ol': {
      counterReset: 'item',

      '& > li': {
        paddingTop: theme.spacing(1),
        display: 'block',

        '&:before': {
          content: 'counters(item, ".") ". "',
          counterIncrement: 'item',
        },
        '& > h4, > h5': {
          display: 'inline-flex',
          margin: `${theme.spacing(0.5)}px 0`,
        },
        '& > p': {
          display: 'inline',
        },
      },
    },
  },
  disclaimer: {
    width: '100%',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: 5,
  },
}));

function Annex(props) {
  const {
    items,
    annex,
    project,
    language,
    updateProject,
    disabled,
    user,
    saveAction,
  } = props;

  const classes = useStyles();
  const { t } = useTranslation('translations');
  delete project.updateData.epc_signed;
  delete project.updateData.fa_signed;
  const canEdit = canEditProject(project?.singleProject, user);
  const isDisabled = !canEdit || disabled;
  return (
    <props.component className={classes.root}>
      {[1, 10].indexOf(annex) > -1 && (
        <TextWithIcon
          className={classes.disclaimer}
          icon={<WarningIcon color="error" />}
          variant="overline"
          align="center"
        >
          {t('annexes.filesDisclaimer')}
        </TextWithIcon>
      )}
      {items.map((item, i) => {
        return (
          <Renderer
            key={i}
            item={item}
            annex={annex}
            keyID={`${annex}-${i}`}
            language={language}
            disabled={isDisabled}
          />
        );
      })}
      <SaveButton
        annex={annex}
        saveProject={() => updateProject(project.updateData)}
        saveAction={saveAction}
        disabled={isDisabled}
      />
    </props.component>
  );
}

Annex.defaultProps = {
  component: 'div',
};

function SaveButton(props) {
  const {
    annex,
    saveProject,
    saveAction,
    disabled
  } = props;

  const { t } = useTranslation('translations');

  let clickHandler;
  if (saveAction) {
    clickHandler = saveAction;
  } else if ([0, 3, 4, 9].indexOf(annex) > -1) {
    clickHandler = saveProject;
  }

  if (!clickHandler) {
    return null;
  }

  return (
    <Grid container justify="flex-end">
      <Button
        variant="contained"
        color="secondary"
        onClick={clickHandler}
        disabled={disabled}
      >
        {t('meetings.save')}
      </Button>
    </Grid>
  );
}

function Renderer(props) {
  const {
    item,
    annex,
    keyID,
    language,
    disabled,
  } = props;

  const childrenAfter = [];

  if (typeof item === 'string' && (item.match(/_\{.*\}/) || item.match(/[a-zA-Z]{1,3}_[a-zA-Z]{1,3}/))) {
    return <span dangerouslySetInnerHTML={{ __html: parseSpecialSymbols(item) }} />;
  }

  if (typeof item === 'string' || React.isValidElement(item)) {
    return item;
  }

  if (item.kind === 'table') {
    return (
      <ContractTable
        table={item.value}
        language={language}
        disabled={disabled}
      />
    );
  }

  if (item.kind === 'instruction') {
    return (
      <AnnexInlineInstruction
        command={item.command}
        kind={item.commandKind}
        type={item.type}
        value={item.value}
        disabled={disabled}
        storeKey={item.storeKey}
      />
    );
  }

  if (Array.isArray(item)) {
    return item.map((c, i) => (
      <Renderer
        key={i}
        item={c}
        annex={annex}
        keyID={`${keyID}-${i}`}
        language={language}
        disabled={disabled}
      />
    ));
  }

  if (item.component && item.props && !item.children) {
    return (
      <item.component {...item.props} />
    );
  }

  if (!item.children) {
    return null;
  }

  return (
    <React.Fragment>
      <item.component {...item.props}>
        {item.children.map((c, i) => {
          return (
            <Renderer
              key={i}
              item={c}
              annex={annex}
              keyID={`${keyID}-${i}`}
              language={language}
              disabled={disabled}
            />
          );
        }
        )}
      </item.component>
      {childrenAfter.map((c, i) => <React.Fragment key={i}>{c}</React.Fragment>)}
    </React.Fragment>
  );
}

Renderer.defaultProps = {
  keyID: '',
};

export default connect(
  state => ({
    project: state.project,
    user: state.user,
  }),
  dispatch => ({
    updateProject: data => data.ID && dispatch(createOrUpdateProject(data)),
  }),
)(Annex);
