(function(){
"use strict";
"use strict";

/*  Make sure `showMmsid` is added to app declaration, as below   */
  var app = angular.module('viewCustom', ['angularLoad', 'sameTabMenuLinks']);


/**** begin code to be copied to custom.js ***/
app.component('prmTopNavBarLinksAfter', {
    template: '<same-tab-menu-links></same-tab-menu-links>'
  });

  angular.module('sameTabMenuLinks', []).component('sameTabMenuLinks', {
    bindings: {parentCtrl: '<'},
    controller: function controller($document, $scope) {
      this.$onInit = function() {
            /*Must wait for menu items to appear*/
            var elCheck = setInterval(updateLinks, 1000);
            function updateLinks() {
              //console.log("anythihng")
              if( $document[0].querySelectorAll("div.top-nav-bar-links > div").length>0 ){
                var menuItems=$document[0].querySelectorAll("div.top-nav-bar-links > div")
                for (var i = 0; i < menuItems.length; i++) {
                  var mItem = menuItems[i];
                  var anchor = mItem.querySelector("div > a");
                  anchor.target="_self"
                }
                clearInterval(elCheck);
                //return;
              }

            }

          }
    }
  });
/**** end code to be copied to custom.js ***/


})();
