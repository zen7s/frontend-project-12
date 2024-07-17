import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL, USER } from '../shared/constants';

const $api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const user = localStorage.getItem(USER);

      if (user) {
        const { token } = JSON.parse(user);
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: () => ({}),
});

export default $api;
