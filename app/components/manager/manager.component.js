(function ()
{
    'use strict';

    function ManagerController(SwipeNavDrawerControl)
    {
        var ctrl = this;

        this.menuLeft = 'Menu Left';
        this.menuRight = 'Menu Right';

        ctrl.toggleMenu = function ()
        {
            SwipeNavDrawerControl.toggleDrawer('right');
        };
    }

    angular.module('component-app.manager', []).component('manager', {
        controller: ['SwipeNavDrawerControl', ManagerController],
        templateUrl: 'components/manager/manager.tpl.html'
    });
})();
