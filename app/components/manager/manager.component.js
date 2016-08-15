(function ()
{
    'use strict';

    function ManagerController()
    {
        var ctrl = this;

        this.menuControl = {};

        this.toggleMenu = function ()
        {
            ctrl.menuControl.toggle();
        }
    }

    angular.module('component-app.manager', []).component('manager', {
        controller: [ManagerController],
        templateUrl: '../components/manager/manager.tpl.html'
    });
})();
