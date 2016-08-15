(function ()
{
    'use strict';

    function HomeController()
    {

    }

    angular.module('component-app.home', ['ngRoute']).component('home', {
        controller: HomeController,
        templateUrl: 'components/home/home.tpl.html'
    }).config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/', {
            template: '<home></home>'
        });
    }]);
})();
