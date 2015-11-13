'use strict';

// Declare app level module which depends on filters, and services

angular.module('nreApp', [
  'nreApp.controllers',
  'nreApp.filters',
  'nreApp.services',
  'nreApp.directives'
]).
config(function ($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);
});
