(function(){
"use strict";
"use strict";

/*  Make sure `showMmsid` is added to app declaration, as below   */
  var app = angular.module('viewCustom', ['angularLoad', 'showMmsid']);


/**** begin code to be copied to custom.js ***/
  app.component('prmRecordCollectionPathsAfter', {
    template: '<show-mmsid></show-mmsid>'
  });

  angular
    .module('showMmsid', [])
    .component('showMmsid', {
      bindings: { parentCtrl: '<' },
      controller: function controller($scope, $http, $element, showMmsidOptions) {
          this.$onInit = function() {
            $scope.izShow=false;
            $scope.nzShow=false;
            var izSuffix=showMmsidOptions.izSuffix;
            $scope.izLabel=showMmsidOptions.izLabel;
            $scope.nzLabel=showMmsidOptions.nzLabel;
            var srcid=$scope.$parent.$parent.$ctrl.item.pnx.control.sourcerecordid[0];
            var origsrcid=$scope.$parent.$parent.$ctrl.item.pnx.control.originalsourceid[0];
            evalString(srcid);
            evalString(origsrcid);

            function evalString(string){
              if(string.substring(0,2)=="99"){ //1st two digits - 99 implies mmsid
                if(string.substring(string.length - 4)==izSuffix){ //match for IZ suffix
                  $scope.izMmsid=string;
                  $scope.izShow=true;
                }
                else{
                  $scope.nzMmsid=string;
                  $scope.nzShow=true;
                }
              }
            }

          };

      },
    template: `<div  layout="row" layout-xs="column" class="layout-block-xs layout-xs-column layout-row" ng-show="{{izShow}}">
  	<div flex-gt-sm="20" flex-gt-xs="25" flex="" class="flex-gt-xs-25 flex-gt-sm-20 flex">
  		<span class="bold-text word-break" data-details-label="mms"   title="Alma">{{izLabel}}</span>
  	</div>
  	<div class="item-details-element-container flex" flex="">{{izMmsid}}
  	</div>
  </div>
  <div  layout="row" layout-xs="column" class="layout-block-xs layout-xs-column layout-row" ng-show="{{nzShow}}">
  <div flex-gt-sm="20" flex-gt-xs="25" flex="" class="flex-gt-xs-25 flex-gt-sm-20 flex">
    <span class="bold-text word-break" data-details-label="mms"   title="Alma">{{nzLabel}}</span>
  </div>
  <div class="item-details-element-container flex" flex="">{{nzMmsid}}
  </div>
  </div>`
  });


  /* Custom options for labels, and institution-specific trailing 4-digits for IZ MMS ID  */
  app.constant('showMmsidOptions', {
    "izLabel": "MMS ID (IZ)", /* Field value for Institution Zone MMS ID */
    "nzLabel": "MMS ID (NZ)", /* Field value for Network Zone MMS ID */
    "izSuffix": "1844" /*institution-specific trailing 4 digits*/
  });

/**** end code to be copied to custom.js ***/


})();
