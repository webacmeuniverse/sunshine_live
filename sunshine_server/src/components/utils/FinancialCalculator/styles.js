export const results = (theme) => ({
  tableContainer: {
    marginBottom: theme.spacing(6),
  },
  resultsRoot: {
    '@media print': {
      '& .page-full-width td, .page-full-width th': {
        fontSize: '70%',
        padding: 2,
      },
    },
  },
  resultsEntryWrapper: {
    '@media print': {
      padding: '1cm',
    },
  },
  constructionTable: {
    '& .MuiTableHead-root': {
      '& .MuiTableCell-head:not(:first-child)': {
        background: '#9cc2e5',
      },
    },
    '& .MuiTableBody-root': {
      '& .MuiTableCell-body:first-child': {
        background: '#9cc2e5',
        fontWeight: 600,
      },
      '& .MuiTableCell-body:last-child': {
        fontWeight: 600,
      },
      '& .MuiTableCell-body': {
        background: '#deeaf6',
      },
      '& .MuiTableRow-root:nth-child(n+5)': {
        '& .MuiTableCell-body': {
          background: '#e2efd9',
        },
      },
      '& .MuiTableRow-root:nth-child(n+6)': {
        '& .MuiTableCell-body': {
          background: 'none !important',
          '&:first-child, &:last-child': {
            background: '#e2efd9 !important',
          }
        },
      },
    },
  },
  savingsTable: {
    '& .MuiTableHead-root': {
      '& .MuiTableCell-head:not(:first-child)': {
        background: '#9cc2e5',
      },
    },
    '& .MuiTableBody-root': {
      '& .MuiTableCell-body': {
        '&:first-child': {
          background: '#9cc2e5',
          fontWeight: 600,
        },
      },
      '& .MuiTableRow-root:nth-child(1)': {
        '& .MuiTableCell-root:nth-child(4), .MuiTableCell-root:nth-child(5), .MuiTableCell-root:nth-child(6)': {
          background: '#deeaf6',
        },
      },
      '& .MuiTableRow-root:nth-child(2), .MuiTableRow-root:nth-child(3)': {
        '& .MuiTableCell-root:nth-child(7), .MuiTableCell-root:nth-child(8)': {
          background: '#deeaf6',
        },
      },
      '& .MuiTableRow-root:nth-child(1n + 4)': {
        '& .MuiTableCell-root:nth-child(2), .MuiTableCell-root:nth-child(3)': {
          background: '#e2efd9',
        },
      },
      '& .MuiTableRow-root:last-child': {
        '& .MuiTableCell-root:nth-child(7), .MuiTableCell-root:nth-child(8)': {
          background: '#deeaf6',
        },
      }
    },
  },
  yearlyTable: {
    '& .MuiTableHead-root': {
      '& .MuiTableCell-head:not(:first-child)': {
        background: '#f4b083',
      },
    },
    '& .MuiTableBody-root': {
      '& .MuiTableCell-body': {
        background: '#fbe4d5',
      },
      '& .MuiTableCell-body:first-child': {
        background: '#f7caac',
        fontWeight: 600,
      },
      '& .MuiTableRow-root:first-child': {
        '& .MuiTableCell-body': {
          background: '#f7caac',
        },
      },
    },
  },
  resultsLogoWrapper: {
    width: '100%',
    justifyContent: 'center',
    marginBottom: 32,
    display: 'none',

    '& img': {
      maxWidth: 120,
      marginRight: theme.spacing(4),
    },

    '@media print': {
      display: 'inline-flex',
    }
  },
});
