(function(){
"use strict";
"use strict";

  var app = angular.module('viewCustom', ['angularLoad']);

  app.component('prmActionListAfter', {
    bindings: {
      parentCtrl: '<'
    },
    controller: function($scope) {
      this.$onInit = function () {
        if (this.parentCtrl.activeAction.length > 0) {
          var action_list = this.parentCtrl.$element[0];
          var interval = setInterval(find_items, 100);
          function find_items() {
            let items = action_list.getElementsByTagName('button');
            if (items.length > 0) {
              clearInterval(interval);
              for (let i = 0; i < items.length; i++) {
                items[i].addEventListener('mouseenter', function(e) {
                  this.focus();
                });
              }
            }
          }
        }
      }
    }
  });

})();
