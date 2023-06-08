// This customization adds pagination to Collection Discovery.
// Use CSS to style the Next and Previous buttons and hide the default "Load More Items" button.
(function(){
"use strict";
'use strict';

  var app = angular.module('viewCustom', ['angularLoad']);

  app.component('prmGalleryItemsListAfter', {
    bindings: {
      parentCtrl: '<'
    },
    template: '<div id="collection-pagination" ng-if="$ctrl.itemsLoaded"><button ng-show="$ctrl.hasPreviousItems()" ng-click="$ctrl.changePage(-1)">Previous Page</button><button ng-show="$ctrl.hasNextItems()" ng-click="$ctrl.changePage(1)">Next Page</button></div>',
    controller: function ($scope, $document) {
      var vm = this;
      this.$onInit = function() {
        // Set default values
        vm.offset = 0;
        vm.perPage = 20;
        vm.itemsLoaded = false;
        // Watch for the collection item information to load
        $scope.$watch( 
          function() {
            return angular.isDefined(vm.parentCtrl.totalItems);
          },
          // When items are ready, define checks for previous and next pages
          function(newValue, oldValue) {
            if (newValue === true) {
              vm.itemsLoaded = true;
              vm.hasPreviousItems = function() {
                return vm.offset == 0 ? false : true;
              }
              vm.hasNextItems = function() {
                return vm.parentCtrl.totalItems > (vm.offset + vm.perPage) ? true : false;
              }
              // Change the page forwards or backwards
              vm.changePage = function(dir) {
                vm.offset = vm.offset + (vm.perPage * dir);
                var next_offset = vm.offset + vm.perPage;
                // If the items for the next page don't exist yet,
                // trigger the OTB function getMoreResults()
                if (vm.parentCtrl.items.length < next_offset) {
                  vm.parentCtrl.getMoreResults();
                }
                // For each gallery item HTML element, show or hide it
                // based on its index
                var gallery_items = $document[0].querySelectorAll("prm-gallery-item");
                for (var g = 0; g <= gallery_items.length; g++) {
                  if (angular.isDefined(gallery_items[g])) {
                    // Show items between the current and next offsets
                    if (g >= vm.offset && g < next_offset) {
                      gallery_items[g].style.display = "block";
                    }
                    // Hide items outside of the current "page"
                    else {
                      gallery_items[g].style.display = "none";
                    }
                  }
                }
              }
            }
          }
        )
      }
    }
  });

})();
