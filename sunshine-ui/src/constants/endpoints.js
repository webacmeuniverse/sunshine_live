if (process.env.NODE_ENV === 'development') {
  module.exports = {    
         'SERVER': process.env.REACT_APP_BACKEND_URL || 'https://savehomesave.eu:8000',
         //'SERVER': process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000',
  };
} else {
  module.exports = {
    'SERVER': `${window.location.origin}:8000`
    // 'SERVER': 'http://savehomesave.eu:8001'
  };
}
