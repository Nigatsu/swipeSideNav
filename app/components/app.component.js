(function ()
{
    'use strict';

    angular.module('component-app', ['ngResource', 'ui.bootstrap', 'ngAnimate', 'angular-loading-bar', 'ngTouch', 'swipeNavDrawer',
        // internal components
            'component-app.manager',
            'component-app.home'
    ]).component('app', {
        templateUrl: '../components/app.tpl.html'
    });
})();

