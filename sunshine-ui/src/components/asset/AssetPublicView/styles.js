import {
  red,
  blue,
  green,
  orange,
} from '@material-ui/core/colors';

export default theme => ({
  root: {
    margin: theme.spacing(1),
  },
  cardHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  validationStatus: {
    display: 'inline-flex',
  },
  mapContainer: {
    width: '100%',
    height: 'calc(100vh / 2)',
  },
  logoWrapper: {
    width: '50%',
  },
  statusBadgeValid_bg: {
    backgroundColor: green[300],
  },
  statusBadgeValid_fg: {
    '& .MuiBadge-badge': {
      color: '#ffffff',
      backgroundColor: green[300],
    },
  },
  statusBadgeRegistered_bg: {
    backgroundColor: blue[300],
  },
  statusBadgeRegistered_fg: {
    '& .MuiBadge-badge': {
      color: '#ffffff',
      backgroundColor: blue[300],
    },
  },
  statusBadgePending_bg: {
    backgroundColor: orange[300],
  },
  statusBadgePending_fg: {
    '& .MuiBadge-badge': {
      color: '#ffffff',
      backgroundColor: orange[300],
    },
  },
  statusBadgeDeclined_bg: {
    backgroundColor: red[300],
  },
  statusBadgeDeclined_fg: {
    '& .MuiBadge-badge': {
      color: '#ffffff',
      backgroundColor: red[300],
    },
  },
});
