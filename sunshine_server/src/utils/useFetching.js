import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { parseQuery } from './url';
import { countriesMap } from '../constants/countries';

const queryKindsMap = { country: countriesMap };

function _useFetching(createActionFn) {

  const dispatch = useDispatch();
  const { search } = useLocation();

  useEffect(() => {
    if (!createActionFn()) {
      return;
    }
    const queryParams = parseQuery(search, queryKindsMap);
    dispatch(createActionFn(queryParams));
  }, [dispatch, createActionFn, search]);
}

export default _useFetching;
