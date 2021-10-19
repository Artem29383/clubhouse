import { PayloadAction } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useActionWithPayload = <T>(
  action: (payload: T) => PayloadAction<T>
) => {
  const dispatch = useDispatch();
  return useCallback(
    (payload: T) => {
      dispatch(action(payload));
    },
    [dispatch, action]
  );
};

export const useAction = (action: () => PayloadAction<undefined>) => {
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(action());
  }, [dispatch, action]);
};
