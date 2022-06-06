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

            var item=$scope.$parent.$parent.$ctrl.item;
            var izMmsid=item.pnx.control.sourcerecordid[0];
            var nzMmsid=item.pnx.control.originalsourceid[0];

            var srcid=item.pnx.control.sourcerecordid[0];
            var srcSuffix=srcid.substring(srcid.length - 4)
            var origsrcid=item.pnx.control.originalsourceid[0];

            /* case - both are numeric, IZ & NZ exist */
            if(isNaN(srcid)==false && isNaN(origsrcid)==false){
              $scope.izMmsid=srcid;
              $scope.nzMmsid=origsrcid;
              $scope.izShow=true;
              $scope.nzShow=true;
            }
            /* case only srcid is numeric, must determine whether it's nz or iz */
            /* First, look for match in trailing 4 digits for IZ */
            if(isNaN(srcid)==false && isNaN(origsrcid)==true && srcSuffix==izSuffix){
              $scope.izMmsid=srcid;
              $scope.izShow=true;
              $scope.nzShow=false;
            }
            /* If no match, then assumed to be NZ*/
            if(isNaN(srcid)==false && isNaN(origsrcid)==true && srcSuffix!=izSuffix){
              $scope.nzMmsid=srcid;
              $scope.izShow=false;
              $scope.nzShow=true;
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
