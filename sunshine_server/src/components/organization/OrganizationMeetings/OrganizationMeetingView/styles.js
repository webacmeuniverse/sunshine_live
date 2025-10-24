export default (theme) => ({
    root: {
      margin: theme.spacing(4),
      '& .MuiCardHeader-action': {
        margin: 0,
        '& > *': {
          marginRight: theme.spacing(1),
          '&:last-child': {
            marginRight: 0,
          },
        },
      },
      '& .MuiCardHeader-avatar': {
        '& .MuiAvatar-root': {
          backgroundColor: 'transparent',
          width: 50,
          height: 50,
        },
        '& .MuiSvgIcon-root': {
          width: '100%',
          height: '100%',
        },
      },
      '& .MuiCardHeader-subheader': {
        display: 'flex',
        flexDirection: 'column',

        '& .MuiSvgIcon-root': {
          width: '1rem',
          height: '1rem',
        },
      },
      '& .UploadFile-root': {
        marginTop: 0,

        '& section': {
          height: 'auto',
        },
        '& .UploadedFile-container': {
          height: 'auto',

          '& td': {
            wordBreak: 'break-all',
          },
        },
        '& .UploadFile-button': {
          height: 'auto',
        },
      },
    },
  });
