(function ()
{
    'use strict';

    function SwipeSideNav($swipe, $timeout)
    {
        return {
            restrict: 'A',
            scope: {
                swipeSideNavEdge: '@'
            },
            link: function (scope, elem)
            {
                var menuWidth = elem.width();
                var dragTargetWidth = '10px';
                var menuVisible = false;
                var timeoutDelay = 300;
                var animationDelay = 200;

                function showNav()
                {
                    elem.css({transform: 'translateX(0px)'});
                    dragTarget.css({opacity: 1});
                    menuVisible = true;
                }

                function hideNav()
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

                var body = elem.closest("body");
                var dragTarget = angular.element('<div class="drag-target"></div>');
                elem.parent().append(dragTarget);

                elem.css({
                    transform: 'translateX(-100%)',
                    'overflow-y': 'scroll',
                    height: '100%',
                    position: 'fixed',
                    top: 0,
                    'z-index': 999
                });
                dragTarget.css({
                    background: 'rgba(0, 0, 0, .5)',
                    width: dragTargetWidth,
                    height: '100%',
                    opacity: 0,
                    position: 'fixed',
                    top: 0,
                    'z-index': 998
                }).click(function ()
                {
                    hideNav();
                });

                $swipe.bind(dragTarget, {
                    start: function ()
                    {
                        dragTarget.css({width: '100%'});
                        body.css({overflow: 'hidden'});
                    },
                    move: function (cord)
                    {
                        if (menuWidth > cord.x) {
                            elem.css({
                                transform: 'translateX(' + (cord.x + 1 - menuWidth) + 'px)',
                                'box-shadow': '0 0 15px'
                            });
                            dragTarget.css({opacity: (cord.x + 1) / menuWidth});
                        }
                    },
                    end: function (cord)
                    {
                        elem.css({transition: 'transform ' + animationDelay + 'ms, box-shadow ' + animationDelay + 'ms'});
                        dragTarget.css({transition: 'opacity ' + animationDelay + 'ms'});

                        (menuWidth / 2) < cord.x ? showNav() : hideNav();

                        $timeout(function ()
                        {
                            elem.css({transition: ''});
                            dragTarget.css({transition: ''});
                        }, timeoutDelay)
                    },
                    cancel: function ()
                    {
                        console.log('cancel');
                    }
                }, ['touch']);
            }
        };
    }

    angular.module('swipeSideNav', []).directive('swipeSideNav', ['$swipe', '$timeout', SwipeSideNav]);
})();
