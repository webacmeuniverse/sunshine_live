import i18n from 'i18next';

import ENDPOINTS from '../constants/endpoints';
import { isResidentsCommunity } from '../constants/legalStatusTypes';
import {STEP_ADD_REQUEST,STEP_ADD_SUCCESS,STEP_ADD_FAILURE,
  SET_ORGANIZATION_TYPE_FILTER,
  SEARCH_ORGANIZATIONS_REQUEST, SEARCH_ORGANIZATIONS_SUCCESS, SEARCH_ORGANIZATIONS_FAILURE,
  ALL_ORGANIZATIONS_REQUEST, ALL_ORGANIZATIONS_SUCCESS, ALL_ORGANIZATIONS_FAILURE,
  GET_SINGLE_ORGANIZATION_REQUEST, GET_SINGLE_ORGANIZATION_SUCCESS, GET_SINGLE_ORGANIZATION_FAILURE,
  MY_ORGANIZATIONS_REQUEST, MY_ORGANIZATIONS_SUCCESS, MY_ORGANIZATIONS_FAILURE,
  SET_LOGGED_USER_ROLE_IN_ORGANIZATION, SET_ALL_ORGANIZATIONS_NUMBER,
  SET_MY_ORGANIZATIONS_NUMBER, SEARCH_MY_ORGANIZATIONS_REQUEST,
  SEARCH_MY_ORGANIZATIONS_FAILURE, SEARCH_MY_ORGANIZATIONS_SUCCESS,
  ISFETCHING_SINGLE_ORGANIZATION_SET_DEFAULT, ISFETCHING_LIST_ORGANIZATION_SET_DEFAULT,
  THEIR_ORGANIZATIONS_REQUEST, THEIR_ORGANIZATIONS_SUCCESS, THEIR_ORGANIZATIONS_FAILURE
} from '../constants/actionTypes';
import { addAlert } from './alerts';
import { retrieveOrganizationRole } from '../utils/userRoles';


export function getStepDataGet(data) {
    
    
    const req = stepGetRequest(data);

  const config = {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(req),
  };

  return (dispatch) => {
    dispatch({ type: STEP_ADD_REQUEST });
   
    return fetch(ENDPOINTS.SERVER + `/onboarding/residents/step`, config)
      .then(response => {
       
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
      
        // if (userIsLogged) {
        //   const role = retrieveOrganizationRole(userIsLogged, data);
        //   dispatch({ type: SET_LOGGED_USER_ROLE_IN_ORGANIZATION, payload: role });
        // }
        dispatch({ type: STEP_ADD_SUCCESS, payload: data });
      })
      .catch(() => {
        dispatch({ type: STEP_ADD_FAILURE });
      }
      );
  };
}

function stepGetRequest(data) {
    const req = {
        oss_admin_id: data.oss_admin_id,
        lang: data.lang,
     
    };
  
    return req;
  }
