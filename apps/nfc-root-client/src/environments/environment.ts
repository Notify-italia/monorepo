// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3110/api',
  profilesUrl: 'http://localhost:4200',
  companyUrl: 'http://localhost:4220',
  agentUrl: 'http://localhost:4210',
  socketUrl: 'http://localhost:3100',
  apiKeyKey: 'dev.apikey',
  socketIdKey: 'dev.socketId',
  stripeKey:
    'pk_test_51PhT9ARxRGHcCuklficCjch8Kk9SU73gLyLJh5D69uQwqd0tzUMnA2HzK3buGpzJazcjD6kwSZ30sHO5CIziJmFP00SqKqtR85',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
