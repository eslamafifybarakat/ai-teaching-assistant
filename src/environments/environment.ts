// Default (development) environment. Replaced at build time by one of its
// siblings via angular.json's `fileReplacements` — see README §19.
// Keep this shape generic: build-time configuration only, never business data
// (courses, lectures, question banks live in the domain layer, not here).
export const environment = {
  production: false,
  environmentName: 'development',
  siteUrl: 'http://localhost:4200',
  apiUrl: '',
  defaultLanguage: 'ar',
};
