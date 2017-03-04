(function ()
{
    'use strict';

    function SwipeNavDrawer($swipe, $timeout, $window)
    {
        return {
            restrict: 'A',
            scope: {
                swipeNavDrawer: '@',
                drawerFixed: '@?',
                drawerControl: '=?'
            },
            controller: ['$scope', function drawerController($scope)
            {
                this.fixed = false;
                this.drawerFixedPoint = $scope.drawerFixed || null;
                this.drawerEdge = $scope.swipeNavDrawer || 'left';
                this.drawerControl = $scope.drawerControl || {};
            }],
            link: function drawerLink(scope, drawer, attr, ctrl)
            {
                var leftOrRight;
                var startPoint;

                var drawerWidth = drawer.outerWidth();
                var drawerVisible = false;
                var drawerBind = {};

                var body = drawer.closest('body');
                var bodyWidth = body.width();

                var handhold = angular.element('<div class="swipe-nav-handhold"></div>');
                var handholdBind = {};

                var timeoutDelay = 300;

                function chooseLeftOrRight()
                {
                    return 'left' === ctrl.drawerEdge;
                }

                function showDrawer()
                {
                    drawer.removeClass('drawer-hidden').addClass('drawer-shown').css({'transform': ''});
                    handhold.removeClass('handhold-hidden').addClass('handhold-shown').css({'opacity': ''});
                    drawerVisible = true;
                }

                function hideDrawer()
                {
                    drawer.removeClass('drawer-shown').addClass('drawer-hidden').css({'transform': ''});
                    handhold.removeClass('handhold-shown').addClass('handhold-hidden').css({'opacity': ''});
                    body.removeClass('overflow-hidden');
                    drawerVisible = false;
                }

                function start(startX)
                {
                    startPoint = startX;
                    drawerWidth = drawer.outerWidth();
                    bodyWidth = body.width();
                    body.addClass('overflow-hidden');
                }

                function move(x)
                {
                    drawer.removeClass('drawer-hidden drawer-shown').addClass('drawer-swipe');
                    handhold.removeClass('handhold-hidden handhold-shown').addClass('handhold-swipe');

                    if (leftOrRight) {
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
                    drawer.removeClass('drawer-swipe').addClass('drawer-move');
                    handhold.removeClass('handhold-swipe').addClass('handhold-move');

                    x = leftOrRight ? x : -x;
                    startPoint = leftOrRight ? -startPoint : startPoint;

                    if ((drawerWidth / 2) < (x + drawerWidth + startPoint)) {
                        showDrawer();
                    } else {
                        hideDrawer();
                    }

                    $timeout(function ()
                    {
                        drawer.removeClass('drawer-move');
                        handhold.removeClass('handhold-move');
                    }, timeoutDelay);
                }

                function toggleDrawer()
                {
                    start(leftOrRight ? drawerWidth : bodyWidth - drawerWidth);
                    if (leftOrRight) {
                        end(drawerVisible ? 0 : bodyWidth);
                    } else {
                        end(drawerVisible ? bodyWidth : 0);
                    }
                }

                function afterResize()
                {
                    if (body.width() >= ctrl.drawerFixedPoint) {
                        if (!ctrl.fixed) {
                            ctrl.fixed = true;
                            drawer.unbind('mousedown mousemove mouseup touchstart touchmove touchend touchcancel');
                            drawer.removeClass('drawer-hidden drawer-shown').addClass('drawer-shown-fixed');
                            handhold.removeClass('handhold-hidden handhold-shown').addClass('display-none');
                            body.removeClass('overflow-hidden');
                            drawerVisible = false;
                        }
                    } else if (ctrl.fixed) {
                        ctrl.fixed = false;
                        $swipe.bind(drawer, drawerBind, ['touch']);
                        drawer.removeClass('drawer-shown-fixed').addClass('drawer-hidden');
                        handhold.removeClass('display-none').addClass('handhold-hidden');
                    }
                }

                function init()
                {
                    leftOrRight = chooseLeftOrRight();
                    ctrl.drawerControl.toggleDrawer = toggleDrawer;

                    drawer.parent().prepend(handhold);

                    drawer.addClass('swipe-nav-drawer');

                    handhold.click(function ()
                    {
                        startPoint = leftOrRight ? -startPoint : startPoint;
                        end(leftOrRight ? 0 : bodyWidth);
                    });

                    drawer.addClass((leftOrRight ? 'drawer-left' : 'drawer-right') + ' drawer-hidden');
                    handhold.addClass((leftOrRight ? 'handhold-left' : 'handhold-right') + ' handhold-hidden');

                    handholdBind = {
                        start: function ()
                        {
                            start(leftOrRight ? drawerWidth : bodyWidth - drawerWidth);
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
                            start(leftOrRight ? cord.x - 10 : cord.x + 10);
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
                    drawer.unbind('mousedown mousemove mouseup touchstart touchmove touchend touchcancel');
                    handhold.unbind('mousedown mousemove mouseup touchstart touchmove touchend touchcancel');
                    scope.$destroy();
                });
            }
        };
    }

    function DrawerCloseLink()
    {
        return {
            restrict: 'A',
            require: '^^swipeNavDrawer',
            link: function (scope, link, attr, drawerCtrl)
            {
                link.click(function ()
                {
                    if (!drawerCtrl.fixed) {
                        drawerCtrl.drawerControl.toggleDrawer();
                    }
                });
            }
        };
    }

    angular.module('swipeNavDrawer', ['ngTouch'])
            .directive('swipeNavDrawer', ['$swipe', '$timeout', '$window', SwipeNavDrawer])
            .directive('drawerCloseLink', [DrawerCloseLink]);
})();
