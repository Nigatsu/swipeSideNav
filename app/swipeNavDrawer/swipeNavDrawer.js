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
                var startPoint;
                var drawerEdge = scope.swipeNavDrawer || 'left';
                var drawerFixedPoint = scope.drawerFixed || null;
                var drawerWidth = drawer.outerWidth();
                var drawerVisible = false;
                var drawerBind = {};
                var body = drawer.closest('body');
                var bodyWidth = body.width();
                var handhold = angular.element('<div class="swipeNavHandhold"></div>');
                var handholdBind = {};
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

                function start(startX)
                {
                    startPoint = startX;
                    drawerWidth = drawer.outerWidth();
                    bodyWidth = body.width();
                    body.addClass('overflowHidden');
                }

                function move(x)
                {
                    drawer.removeClass('drawerHidden drawerShown').addClass('drawerSwipe');
                    handhold.removeClass('handholdHidden handholdShown').addClass('handholdSwipe');

                    if (leftOrRight()) {
                        if (0 > x) {
                            drawer.css({'transform': 'translateX(' + x + 'px)'});
                            handhold.css({'opacity': (x + drawerWidth) / drawerWidth});
                            drawerVisible = false;
                        } else {
                            showDrawer();
                        }
                    } else {
                        if (0 < x) {
                            drawer.css({'transform': 'translateX(' + x + 'px)'});
                            handhold.css({'opacity': (-x + drawerWidth) / drawerWidth});
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
                        if ((drawerWidth / 2) < (x + drawerWidth - startPoint)) {
                            showDrawer();
                        } else {
                            hideDrawer();
                        }
                    } else {
                        if ((drawerWidth / 2) < (drawerWidth + startPoint - x)) {
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
                    start(leftOrRight() ? drawerWidth : bodyWidth - drawerWidth);
                    if (leftOrRight()) {
                        end(drawerVisible ? 0 : bodyWidth);
                    } else {
                        end(drawerVisible ? bodyWidth : 0);
                    }
                }

                function afterResize()
                {
                    if (body.width() >= drawerFixedPoint) {
                        if (!drawer.hasClass('drawerShownFixed')) {
                            drawer.unbind('mousedown mousemove mouseup touchstart touchmove touchend touchcancel');
                            drawer.removeClass('drawerHidden drawerShown').addClass('drawerShownFixed');
                            handhold.removeClass('handholdHidden handholdShown').addClass('displayNone');
                            body.removeClass('overflowHidden');
                            drawerVisible = false;
                        }
                    } else if (drawer.hasClass('drawerShownFixed')) {
                        $swipe.bind(drawer, drawerBind, ['touch']);
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

                    handholdBind = {
                        start: function ()
                        {
                            start(leftOrRight() ? drawerWidth : bodyWidth - drawerWidth);
                        },
                        move: function (cord)
                        {
                            move(cord.x - startPoint);
                        },
                        end: function (cord)
                        {
                            end(cord.x);
                        },
                        cancel: function (raw)
                        {
                            end(raw.originalEvent.touches[0].clientX);
                        }
                    };

                    drawerBind = {
                        start: function (cord)
                        {
                            start(cord.x);
                        },
                        move: function (cord)
                        {
                            move(cord.x - startPoint);
                        },
                        end: function (cord)
                        {
                            end(cord.x);
                        },
                        cancel: function (raw)
                        {
                            end(raw.originalEvent.touches[0].clientX);
                        }
                    };

                    $swipe.bind(handhold, handholdBind, ['touch']);
                    $swipe.bind(drawer, drawerBind, ['touch']);

                    if (scope.drawerFixed) {
                        angular.element($window).resize(afterResize);
                        afterResize();
                    }
                }

                init();

                scope.$on('$destroy', function ()
                {
                    deregisterDrawer(drawerEdge);
                    drawer.unbind('mousedown mousemove mouseup touchstart touchmove touchend touchcancel');
                    handhold.unbind('mousedown mousemove mouseup touchstart touchmove touchend touchcancel');
                    scope.$destroy();
                });
            }
        };
    }

    angular.module('swipeNavDrawer', ['ngTouch'])
            .service('SwipeNavDrawerControl', [SwipeNavDrawerControl])
            .directive('swipeNavDrawer', ['$swipe', '$timeout', '$window', SwipeNavDrawer]);
})();
