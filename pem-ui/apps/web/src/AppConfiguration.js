import React, { useEffect } from 'react';
import Shell from '@b2bi/shell';

import { sideNavConfig, headerMenuList } from './modules/configurations';

const addPemHeaders = (headers) => {
  const rHeaders = headers ? headers : {};
  rHeaders['Authorization'] = generateBasicAuthToken('admin', 'password');
  //rHeaders['Content-Type'] = 'application/json';
  rHeaders['Accept'] = 'application/json';
  return rHeaders;
};

const generateBasicAuthToken = (username, password) => {
  const credentials = `${username}:${password}`;
  const encodedCredentials = btoa(credentials);
  const authToken = `Basic ${encodedCredentials}`;

  return authToken;
};

const AppConfiguration = ({ children, ...props }) => {
  const { setSideNav, setHeaderMenuList } = Shell.useConfiguration();
  const { setInterceptor } = Shell.useDataService();
  // const { user, logout } = Shell.useAuth();

  useEffect(() => {
    setHeaderMenuList([...headerMenuList, ...Shell.headerMenuList]);
    setSideNav([...sideNavConfig, ...Shell.sideNavConfig]);
  }, [setHeaderMenuList, setSideNav]);

  //setHeaderMenuList(headerMenuList);
  //setSideNav(sideNavConfig);

  useEffect(() => {
    setInterceptor({
      request: (config) => {
        if (config.url?.startsWith('/rest')) {
          config.headers = addPemHeaders(config.headers);
          config.baseURL = window.pemBackendOldBaseUrl;
        }
        return config;
      }
    });
  }, []); /* eslint-disable-line */

  return <>{children}</>;
};

export default AppConfiguration;
