(function ()
{
    'use strict';

    angular.module('component-app', ['ngResource', 'ui.bootstrap', 'angular-loading-bar', 'swipeNavDrawer',
        // internal components
            'component-app.manager',
            'component-app.home',
            'component-app.about'
    ]).component('app', {
        templateUrl: 'components/app.tpl.html'
    });
})();

