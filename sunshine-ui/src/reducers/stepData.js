import {STEP_ADD_REQUEST,STEP_ADD_SUCCESS,STEP_ADD_FAILURE,
    SET_ORGANIZATION_TYPE_FILTER,
    ALL_ORGANIZATIONS_REQUEST, ALL_ORGANIZATIONS_SUCCESS, ALL_ORGANIZATIONS_FAILURE,
    SEARCH_ORGANIZATIONS_REQUEST, SEARCH_ORGANIZATIONS_SUCCESS, SEARCH_ORGANIZATIONS_FAILURE,
    ORGANIZATION_REGISTER_REQUEST, ORGANIZATION_REGISTER_SUCCESS, ORGANIZATION_REGISTER_FAILURE,
    GET_SINGLE_ORGANIZATION_REQUEST, GET_SINGLE_ORGANIZATION_SUCCESS, GET_SINGLE_ORGANIZATION_FAILURE,
    ORGANIZATION_UPDATE_REQUEST, ORGANIZATION_UPDATE_SUCCESS, ORGANIZATION_UPDATE_FAILURE,
    MY_ORGANIZATIONS_REQUEST, MY_ORGANIZATIONS_SUCCESS, MY_ORGANIZATIONS_FAILURE,
    UPLOAD_ORGANIZATION_LOGO_REQUEST, UPLOAD_ORGANIZATION_LOGO_SUCCESS, UPLOAD_ORGANIZATION_LOGO_FAILURE,
    SET_LOGGED_USER_ROLE_IN_ORGANIZATION, UNSET_LOGGED_USER_ROLE_IN_ORGANIZATION, SET_ALL_ORGANIZATIONS_NUMBER, SET_MY_ORGANIZATIONS_NUMBER,
    SEARCH_MY_ORGANIZATIONS_REQUEST, SEARCH_MY_ORGANIZATIONS_FAILURE, SEARCH_MY_ORGANIZATIONS_SUCCESS,
    ISFETCHING_LIST_ORGANIZATION_SET_DEFAULT, ISFETCHING_SINGLE_ORGANIZATION_SET_DEFAULT,
    THEIR_ORGANIZATIONS_REQUEST, THEIR_ORGANIZATIONS_SUCCESS, THEIR_ORGANIZATIONS_FAILURE
  } from './../constants/actionTypes';
  
  // eslint-disable-next-line complexity
  export default function stepDataReducer(state = {
    isFetchingList: true,
    isFetchingSingle: true,
    isFetchingMine: true,
    legalFormFilterValue: null,
    allOrganizationsReady: false,
    allStepData: [],
    error: null,
  }, action) {
    switch (action.type) {
    
      case STEP_ADD_REQUEST:
        return Object.assign({}, state, {
          isFetchingSingle: true,
          singleOrganizationReady: false
        });
      case STEP_ADD_SUCCESS:
     
        return Object.assign({}, state, {
          isFetchingSingle: false,
          singleOrganizationReady: true,
          allStepData: action.payload,
          registered: ''
        });
        case STEP_ADD_FAILURE:
            return Object.assign({}, state, {
              isFetchingSingle: false,
              singleOrganizationReady: false
            });
      default:
        return state;
    }
  }
  