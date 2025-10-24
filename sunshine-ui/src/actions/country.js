import { SELECT_COUNTRY_REQUEST,SELECT_LANGUAGE_SUCCESS, SELECT_COUNTRY_SUCCESS, SELECT_COUNTRY_FAILURE } from '../constants/actionTypes';


function requestCountry(){
  return {
    type: SELECT_COUNTRY_REQUEST
  }
}

function countrySuccess(lang){

 
  return {
    type: SELECT_COUNTRY_SUCCESS,
    country: lang
  }
}
function langError(){
  return {
    type: SELECT_COUNTRY_FAILURE
  }
}

export function errorMSGreset(formName){
  if(formName){
    return {
      type: '@@redux-form/CHANGE',
      meta: {
        form: formName
      },
      payload: Math.random().toString(36).substring(2, 5)
    }
  } else {
    return {
      type: '@@redux-form/CHANGE'
    }
  }
}

export default function toggleCountry(lang, formName){
  return (dispatch) => {
    dispatch(requestCountry());
   
    //i18next.changeLanguage(lang, (err, t) => {
      //if (err) dispatch(langError());
      // dispatch(langSuccess(languageName));
      dispatch(countrySuccess(lang));
      if(formName){
        dispatch(errorMSGreset(formName));
      }
    //});
  }
}
