(function ()
{
    'use strict';

    function SwipeNavDrawer($swipe, $timeout)
    {
        return {
            restrict: 'A',
            scope: {
                swipeNavDrawerEdge: '@',
                swipeNavDrawerControl: '='
            },
            link: function (scope, elem)
            {
                var menuWidth = elem.width();
                var dragTargetWidth = '10px';
                var menuVisible = false;
                var timeoutDelay = 300;
                var animationDelay = 200;

                function showDrawer()
                {
                    elem.css({transform: 'translateX(0px)'});
                    dragTarget.css({opacity: 1});
                    menuVisible = true;
                }

                function hideDrawer()
                {
                    elem.css({
                        transform: 'translateX(-100%)',
                        'box-shadow': '0 0 0'
                    });
                    dragTarget.css({opacity: 0});

                    $timeout(function ()
                    {
                        dragTarget.css({width: dragTargetWidth});
                        body.css({overflow: ''});
                    }, timeoutDelay);
                    menuVisible = false;
                }

                function start()
                {
                    elem.css({'will-change': 'transform'});
                    dragTarget.css({
                        width: '100%',
                        'will-change': 'opacity'
                    });
                    body.css({overflow: 'hidden'});
                }

                function end(x)
                {
                    elem.css({transition: 'transform ' + animationDelay + 'ms, box-shadow ' + animationDelay + 'ms'});
                    dragTarget.css({transition: 'opacity ' + animationDelay + 'ms'});

                    (menuWidth / 2) < x ? showDrawer() : hideDrawer();

                    $timeout(function ()
                    {
                        var cleanUp = {
                            transition: '',
                            'will-change': ''
                        };

                        elem.css(cleanUp);
                        dragTarget.css(cleanUp);
                    }, timeoutDelay)
                }

                function toggleDrawer()
                {
                    start();
                    elem.css({'box-shadow': '-2px 0 10px'});
                    menuVisible ? end(0) : end(menuWidth);
                }

                scope.swipeNavDrawerControl = {toggle: toggleDrawer};

                var body = elem.closest("body");
                var dragTarget = angular.element('<div class="drag-target"></div>');
                elem.parent().append(dragTarget);

                elem.css({
                    transform: 'translateX(-100%)',
                    'overflow-y': 'scroll',
                    height: 'calc(100% + 60px)',
                    'padding-bottom': '60px',
                    position: 'fixed',
                    top: 0,
                    'z-index': 9999
                });

                dragTarget.css({
                    background: 'rgba(0, 0, 0, .5)',
                    width: dragTargetWidth,
                    height: 'calc(100% + 60px)',
                    'padding-bottom': '60px',
                    opacity: 0,
                    position: 'fixed',
                    top: 0,
                    'z-index': 9998
                }).click(function ()
                {
                    end(0);
                });

                $swipe.bind(dragTarget, {
                    start: function ()
                    {
                        start();
                    },
                    move: function (cord)
                    {
                        if (menuWidth > cord.x) {
                            elem.css({
                                transform: 'translateX(' + (cord.x + 1 - menuWidth) + 'px)',
                                'box-shadow': '-2px 0 10px'
                            });
                            dragTarget.css({opacity: (cord.x + 1) / menuWidth});
                        }
                    },
                    end: function (cord)
                    {
                        end(cord.x);
                    },
                    cancel: function (raw)
                    {
                        end(raw.originalEvent.touches[0].clientX)
                    }
                }, ['touch']);
            }
        };
    }

    angular.module('swipeNavDrawer', []).directive('swipeNavDrawer', ['$swipe', '$timeout', SwipeNavDrawer]);
})();
