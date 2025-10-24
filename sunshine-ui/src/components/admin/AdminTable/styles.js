export default {
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
    marginLeft: '20px',
    marginRight: '20px',
    border: '2px solid #dfe2e5',
    backgroundColor: '#FFFFFF',

    '& .SunshineLoader-container': {
      flexGrow: 1,
      alignItems: 'center',
    },
  },
  container: {
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& > a:last-child .row': {
      borderBottom: 0,
    },
  },
  headerStyle: {
    borderBottom: '2px solid rgba(0, 0, 0, 0.12)'
  },
  headerNameStyle: {
    color: '#7f8fa4',
    fontSize: '20px',
    textAlign: 'left',
    fontWeight: '600',
    padding: '20px',
  },
  headerStatusStyle: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: '#7f8fa4',
    fontSize: '16px',
    fontWeight: '600',
    padding: '20px',
  },
  rowStyle: {
    borderBottom: '2px solid #dfe2e5',
  },
  rowContentStyle: {
    color: '#000000',
    fontSize: '18px',
    textAlign: 'left',
    padding: '20px',
  },
  pendingStyle: {
    color: '#ffffff',
    borderRadius: '4px',
    backgroundColor: '#F7981C',
    padding: '5px',
    textAlign: 'center',
    position: 'relative',
  },
  validStyle: {
    color: '#ffffff',
    borderRadius: '4px',
    backgroundColor: '#45B854',
    padding: '5px',
    textAlign: 'center',
    position: 'relative',
  },
  declinedStyle: {
    color: '#ffffff',
    borderRadius: '4px',
    backgroundColor: '#ff0000',
    padding: '5px',
    textAlign: 'center',
    position: 'relative',
  },
  registeredStyle: {
    color: '#ffffff',
    borderRadius: '4px',
    backgroundColor: '#3366ff',
    padding: '5px',
    textAlign: 'center',
    position: 'relative',
  },
  noResultsContiner: {
    color: '#7f8fa4',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',

    '& .MuiTypography-root': {
      fontSize: 18,
    },
  },
  verified: {
    color: 'gold',
  },
  nonVerified: {
    color: 'silver'
  },
  userCountry: {
    display: 'inline-flex',
    '& > img': {
      marginLeft: 8,
    }
  },
  rowDisabled: {
    cursor: 'not-allowed',
  },
};
