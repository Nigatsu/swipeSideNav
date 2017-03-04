(function ()
{
    'use strict';

    function ManagerController()
    {
        var ctrl = this;

        this.menuLeft = 'Menu Left';
        this.menuRight = 'Menu Right';

        this.menuLeftControl = {};
        this.menuRightControl = {};

        ctrl.toggleMenuRight = function ()
        {
            ctrl.menuRightControl.toggleDrawer();
        };

        ctrl.toggleMenuLeft = function ()
        {
            ctrl.menuLeftControl.toggleDrawer();
        };
    }

    angular.module('component-app.manager', []).component('manager', {
        controller: [ManagerController],
        templateUrl: 'components/manager/manager.tpl.html'
    });
})();
