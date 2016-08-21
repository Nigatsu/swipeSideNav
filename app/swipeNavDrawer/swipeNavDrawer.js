(function ()
{
    'use strict';

    var instanceDrawer = {};

    function registerDrawer(name, ctrl)
    {
        instanceDrawer[name] = ctrl;
    }

    function deregisterDrawer(name)
    {
        instanceDrawer[name] = undefined;
    }

    function SwipeNavDrawerControl()
    {
        this.toggle = function toggleDrawer(name)
        {
            name = name || 'left';
            return instanceDrawer[name].toggleDrawer();
        };
    }

    function SwipeNavDrawer($swipe, $timeout, $window)
    {
        return {
            restrict: 'A',
            scope: {
                swipeNavDrawer: '@',
                drawerFixed: '@'
            },
            link: function (scope, drawer)
            {
                var drawerEdge = scope.swipeNavDrawer || 'left';
                var drawerWidth = drawer.width();
                var drawerVisible = false;
                var body = drawer.closest('body');
                var bodyWidth = body.width();
                var handhold = angular.element('<div class="swipeNavHandhold"></div>');
                var timeoutDelay = 300;
                var control = {};

                function leftOrRight()
                {
                    return 'left' === drawerEdge;
                }

                function showDrawer()
                {
                    drawer.removeClass('drawerHidden').addClass('drawerShown').css({'transform': ''});
                    handhold.removeClass('handholdHidden').addClass('handholdShown').css({'opacity': ''});
                    drawerVisible = true;
                }

                function hideDrawer()
                {
                    drawer.removeClass('drawerShown').addClass('drawerHidden').css({'transform': ''});
                    handhold.removeClass('handholdShown').addClass('handholdHidden').css({'opacity': ''});
                    body.removeClass('overflowHidden');
                    drawerVisible = false;
                }

                function start()
                {
                    drawerWidth = drawer.width();
                    bodyWidth = body.width();
                    body.addClass('overflowHidden');
                }

                function move(x)
                {
                    drawer.removeClass('drawerHidden drawerShown').addClass('drawerSwipe');
                    handhold.removeClass('handholdHidden handholdShown').addClass('handholdSwipe');

                    if (leftOrRight()) {
                        if (drawerWidth > x) {
                            drawer.css({'transform': 'translateX(' + (x + 1 - drawerWidth) + 'px)'});
                            handhold.css({'opacity': (x + 1) / drawerWidth});
                            drawerVisible = false;
                        } else {
                            showDrawer();
                        }
                    } else {
                        if (drawerWidth > bodyWidth - x) {
                            drawer.css({'transform': 'translateX(' + Math.abs(bodyWidth - x - drawerWidth) + 'px)'});
                            handhold.css({'opacity': (bodyWidth - x) / drawerWidth});
                            drawerVisible = false;
                        } else {
                            showDrawer();
                        }
                    }
                }

                function end(x)
                {
                    drawer.removeClass('drawerSwipe').addClass('drawerMove');
                    handhold.removeClass('handholdSwipe').addClass('handholdMove');

                    if (leftOrRight()) {
                        if ((drawerWidth / 2) < x) {
                            showDrawer();
                        } else {
                            hideDrawer();
                        }
                    } else {
                        if ((drawerWidth / 2) < bodyWidth - x) {
                            showDrawer();
                        } else {
                            hideDrawer();
                        }
                    }

                    $timeout(function ()
                    {
                        drawer.removeClass('drawerMove');
                        handhold.removeClass('handholdMove');
                    }, timeoutDelay);
                }

                function toggleDrawer()
                {
                    start();
                    if (leftOrRight()) {
                        end(drawerVisible ? 0 : bodyWidth);
                    } else {
                        end(drawerVisible ? bodyWidth : 0);
                    }
                }

                function afterResize()
                {
                    if (body.width() >= scope.drawerFixed) {
                        drawer.removeClass('drawerHidden drawerShown').addClass('drawerShownFixed');
                        handhold.removeClass('handholdHidden handholdShown').addClass('displayNone');
                        body.removeClass('overflowHidden');
                        drawerVisible = false;
                    } else if (!drawer.hasClass('drawerShown')) {
                        drawer.removeClass('drawerShownFixed').addClass('drawerHidden');
                        handhold.removeClass('displayNone').addClass('handholdHidden');
                    }
                }

                function init()
                {
                    control.toggleDrawer = toggleDrawer;

                    registerDrawer(drawerEdge, control);

                    drawer.parent().prepend(handhold);

                    drawer.addClass('swipeNavDrawer');

                    handhold.click(function ()
                    {
                        end(leftOrRight() ? 0 : bodyWidth);
                    });

                    drawer.addClass((leftOrRight() ? 'drawerLeft' : 'drawerRight') + ' drawerHidden');
                    handhold.addClass((leftOrRight() ? 'handholdLeft' : 'handholdRight') + ' handholdHidden');

                    if (scope.drawerFixed) {
                        angular.element($window).resize(afterResize);
                        afterResize();
                    }

                    $swipe.bind(handhold, {
                        start: function ()
                        {
                            start();
                        },
                        move: function (cord)
                        {
                            move(cord.x);
                        },
                        end: function (cord)
                        {
                            end(cord.x);
                        },
                        cancel: function (raw)
                        {
                            end(raw.originalEvent.touches[0].clientX);
                        }
                    }, ['touch']);
                }

                init();

                scope.$on('$destroy', function ()
                {
                    deregisterDrawer(drawerEdge);
                    scope.$destroy();
                });
            }
        };
    }

    angular.module('swipeNavDrawer', [])
            .service('SwipeNavDrawerControl', [SwipeNavDrawerControl])
            .directive('swipeNavDrawer', ['$swipe', '$timeout', '$window', SwipeNavDrawer]);
})();
