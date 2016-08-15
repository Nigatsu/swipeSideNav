(function ()
{
    'use strict';

    function ManagerController()
    {
        this.menu = {
            pl: 'menu',
            en: 'menu'
        };

        this.about = {
            pl: 'o nas',
            en: 'about'
        };

        this.contact = {
            pl: 'kontakt',
            en: 'contact'
        };
        
        this.language = {
            pl: 'pl',
            en: 'en'
        };
    }

    angular.module('component-app.manager', []).component('manager', {
        controller: [ManagerController],
        templateUrl: '../components/manager/manager.tpl.html'
    });
})();
