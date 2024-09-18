import React from 'react';
import './App.scss';
import * as Shell from '@b2bi/shell';
import { routes as PemRoutes } from './modules/routes';
import { sidePages as PemSidePages } from './modules/sidePages';
import AppAuthHandler from './AppAuthHandler';
import AppConfiguration from './AppConfiguration';
// import { modals as PocModals } from '@b2bi/poc';
import { modals as PEMModals } from './modules/modals';

const flattenRoutes = (flattenedRoutes, nestedRoutes, parentPath) => {
  nestedRoutes.forEach((nestedRoute) => {
    const { path, children, ...routeAttr } = nestedRoute;
    if (routeAttr.group !== true) {
      flattenedRoutes.push({
        path: parentPath + path,
        ...routeAttr
      });
    }

    if (children && children.length > 0) {
      flattenRoutes(flattenedRoutes, children, parentPath + path);
    }
  });
};
const flattenedRoutes = [];
flattenRoutes(flattenedRoutes, PemRoutes, '/');
flattenRoutes(flattenedRoutes, Shell.routes, '/');

const routes = [
  {
    path: '/login',
    element: <Shell.Login />
  },
  {
    path: '/',
    breadcrumb: null,
    element: <Shell.Container />,
    children: [...flattenedRoutes]
  }
];

function App() {
  return (
    <React.StrictMode>
      <Shell.EnvironmentProvider config={{}}>
        <Shell.DataServiceProvider>
          <Shell.ApplicationInfoProvider>
            <Shell.AuthProvider handler={AppAuthHandler()}>
              <Shell.ConfigurationProvider locales={Shell.SupportedLocales} locale={'en_US'}>
                <Shell.ResourceProvider resourceMappings={{}}>
                  <Shell.ModalProvider modals={[...PEMModals]}>
                    <Shell.SidePageProvider sidePages={[...PemSidePages]}>
                      <Shell.NotificationProvider>
                        <AppConfiguration>
                          <Shell.RouterProvider routes={routes} />
                        </AppConfiguration>
                      </Shell.NotificationProvider>
                    </Shell.SidePageProvider>
                  </Shell.ModalProvider>
                </Shell.ResourceProvider>
              </Shell.ConfigurationProvider>
            </Shell.AuthProvider>
          </Shell.ApplicationInfoProvider>
        </Shell.DataServiceProvider>
      </Shell.EnvironmentProvider>
    </React.StrictMode>
  );
}

export default App;
