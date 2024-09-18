import Shell from '@b2bi/shell';
const AppAuthHandler = () => {
  return {
    onPreAuthenticate: () => {},
    onAuthenticate: (loginUser) => {
      return Shell.HttpService.send({
        url: '/identity/userauth/v1/authenticate',
        method: 'post',
        data: loginUser,
        baseURL: window.sfgIdentityBaseUrl
      }).then(
        (response) => {
          if (response?.data?.authenticated) {
          }
          return response.data;
        },
        (rejectedResponse) => {
          console.error(rejectedResponse);
          return rejectedResponse.response;
        }
      );
    },
    onPostAuthenticate: () => {
      //const { setAppDetails} = Shell.useApplicationInfo();
      window.sessionStorage.setItem('defaultRoute', '/directories/partners');
      window.sessionStorage.setItem('orgContext', JSON.stringify({ organization: { organizationKey: 'DEFAULT', organizationName: 'Default Organization' } }));
      //setAppDetails({defaultRoute: '/manage/myorganization'})
    },
    onPreUnauthenticate: () => {},
    onUnauthenticate: () => {},
    onPostUnauthenticate: () => {}
  };
};

export default AppAuthHandler;
