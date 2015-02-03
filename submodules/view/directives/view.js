'use strict';


module.exports = function(app) {

	app.directive('pdView', ['$parse', function($parse){

		return {
			restrict: 'C', // E = Element, A = Attribute, C = Class, M = Comment
			link: function(scope, el, attrs) {

				if(attrs.viewResize) {
					var options = $parse(attrs.viewResize)(scope) || {};

					var viewId = attrs.viewResizeId;

					if(viewId) {
						var data = scope.getViewData( viewId );
						if(data) {
							el.css('width', data.prevWidth);
							el.next().css('width', data.nextWidth);
						}
					}


					var $el = $('<div>').addClass('pd-view-resize-handler');

					el.after($el);

						$el.on('mousedown', function(e) {

							var $dragger = $(this);

							var drg_h = $dragger.outerHeight(),
								drg_w = $dragger.outerWidth(),
								pos_y = $dragger.offset().top + drg_h - e.pageY,
								pos_x = $dragger.offset().left + drg_w - e.pageX;

							var $draggerParents = $dragger.parents();
							var windowSize = $(window).width();

							var prevWidth, nextWidth;

							$draggerParents.on('mousemove.forResize', function(e) {
								var $prev = $dragger.prev();
								var $next = $dragger.next();

								var totalWidth = $dragger.parent().outerWidth();

								var leftPercentage = (((e.pageX - $prev.offset().left) + (pos_x - drg_w / 2)) / totalWidth);
								var rightPercentage = 1 - leftPercentage;

								var leftMinWidth = parseInt($prev.css('min-width')) || 0;


								if(Math.round(totalWidth * leftPercentage) <= leftMinWidth) {
									return;
								}

								prevWidth = Math.round(leftPercentage*100) +'%';
								nextWidth = Math.round(rightPercentage*100) +'%'

								$prev.css('width', prevWidth);
								$next.css('width', nextWidth);

								window.dispatchEvent(new Event('resize'));
							});

							$(document).on('mouseup.afterResize', function() {
								if( viewId ) {
									scope.saveViewData( viewId , {
										prevWidth: prevWidth,
										nextWidth: nextWidth
									});
								}

								$(document).off('mouseup.afterResize');
								$draggerParents.off('mousemove.forResize');
							});
							e.preventDefault(); // disable selection
						});



				}


	        },
	        controller: ['$scope','localStorageService', function($scope, localStorageService) {
	        	var store;
	        	function loadStore() {
	        		store = localStorageService.get('pd-view') || {};
	        	}

	        	function saveStore() {
	        		localStorageService.set('pd-view', store);
	        	}

	        	$scope.getViewData = function(id) {
	        		loadStore();
	        		return store[id];
	        	};

	        	$scope.saveViewData = function(id, obj) {

	        		loadStore();

	        		store[id] = obj;

	        		saveStore();
	        	};

	        }]
		};
	}]);

};
