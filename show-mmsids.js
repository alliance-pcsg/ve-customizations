(function(){
"use strict";
"use strict";

/*  Make sure `showMmsid` is added to app declaration, as below   */
  var app = angular.module('viewCustom', ['angularLoad', 'showMmsid']);


/**** begin code to be copied to custom.js ***/
  app.component('prmServiceDetailsAfter', {
    template: '<show-mmsid></show-mmsid>'
  });

  angular
    .module('showMmsid', [])
    .component('showMmsid', {
      bindings: { parentCtrl: '<' },
      controller: function controller($scope, $http, $element, showMmsidOptions) {
          this.$onInit = function() {
            /* seems to work better to default to show, and hide when unavailable*/
            $scope.izShow=true;
            $scope.nzShow=true;
            $scope.nzClass="ng-show";
            $scope.izClass="ng-show";
            var izSuffix=showMmsidOptions.izSuffix;
            $scope.izLabel=showMmsidOptions.izLabel;
            $scope.nzLabel=showMmsidOptions.nzLabel;
            var srcid=$scope.$parent.$parent.$ctrl.item.pnx.control.sourcerecordid[0];

            //srcid is nz mmsid, implies no iz mmsid
            if(srcid.substring(0,2)=="99" && srcid.substring(srcid.length - 4)!=izSuffix){
              $scope.nzShow=true;
              $scope.nzMmsid=srcid;
              $scope.izShow=false;
              $scope.izClass="ng-hide";
            }
            //srcid is iz mmsid, check sru for nz mmsid
            if(srcid.substring(0,2)=="99" && srcid.substring(srcid.length - 4)==izSuffix){
              $scope.izShow=true;
              $scope.izMmsid=srcid;
              sruCall(srcid);

            }
            /*  make SRU call w/iz mmsid to check for nz mms id*/
            function sruCall(string){
              var instCode=showMmsidOptions.instCode;
              var url="https://na01.alma.exlibrisgroup.com/view/sru/"+instCode+"?version=1.2&operation=searchRetrieve&query=alma.mms_id="+string;
              $http.get(url).then(function (response) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(response.data,"text/xml");
                var fields=xmlDoc.getElementsByTagName("datafield")
                var success=false;
                for (var j=0;j<fields.length;j++){
                  var field=fields[j]
                  var attr=field.getAttribute("tag");
                  if(attr=="035"){
                    var subfield=field.getElementsByTagName("subfield")[0].childNodes[0].nodeValue;
                    //console.log(subfield)
                    if(subfield.includes("(EXLNZ-01ALLIANCE_NETWORK)")){
                      var pieces=subfield.split(")")
                      $scope.nzMmsid=pieces[1]
                      success=true;
                      break;
                    }
                  }

                }
                if(success==false){
                  $scope.nzShow=false;
                  $scope.nzClass="ng-hide";
                }
              });
            } /* end sruCall*/

          };
      },
    template: `<div  layout="row" layout-xs="column" class="layout-block-xs layout-xs-column layout-row {{izClass}}" ng-show="{{izShow}}">
    <div flex-gt-sm="20" flex-gt-xs="25" flex="" class="flex-gt-xs-25 flex-gt-sm-20 flex">
      <span class="bold-text word-break" data-details-label="mms"   title="Alma">{{izLabel}}</span>
    </div>
    <div class="item-details-element-container flex" flex="">{{izMmsid}}
    </div>
  </div>
  <div  layout="row" layout-xs="column" class="layout-block-xs layout-xs-column layout-row {{nzClass}}" ng-show="{{nzShow}}">
  <div flex-gt-sm="20" flex-gt-xs="25" flex="" class="flex-gt-xs-25 flex-gt-sm-20 flex">
    <span class="bold-text word-break" data-details-label="mms"   title="Alma">{{nzLabel}}</span>
  </div>
  <div class="item-details-element-container flex" flex="">{{nzMmsid}}
  </div>
  </div>`
  });

  /* Custom options for labels, institution-specific trailing 4-digits for IZ MMS ID, and institution code  */
  app.constant('showMmsidOptions', {
    "izLabel": "MMS ID (IZ)", /* Field value for Institution Zone MMS ID */
    "nzLabel": "MMS ID (NZ)", /* Field value for Network Zone MMS ID */
    "izSuffix": "xxxx", /*institution-specific trailing 4 digits*/
    "instCode":"01ALLIANCE_XXX" /* institution code, e.g. 01ALLIANCE_LCC*/
  });

/**** end code to be copied to custom.js ***/


})();
