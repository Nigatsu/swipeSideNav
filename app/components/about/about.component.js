(function()
{
    'use strict';

    function AboutController()
    {

    }

    angular.module('component-app.about', ['ngRoute']).component('about', {
        controller: AboutController,
        templateUrl: 'components/about/about.tpl.html'
    }).config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/about', {
            template: '<about></about>'
        });
    }]);
})();
