// This customization hides the Resource Sharing form on the Primo VE services page
// for titles with no holdings in the Orbis Cascade Alliance Network Zone.
(function () {
  "use strict";
  'use strict';

  var app = angular.module('viewCustom', ['angularLoad', 'hideSummit']);
  
  app.component('almaHowovpAfter', {template: '<hide-summit></hide-summit>'});
  
  // Hide the RS form for OpenURLs if...
  // a) there is no OCLC number or ISBN, or 
  // b) there are no holdings in the NZ
  angular
    .module('hideSummit', [])
    .component('hideSummit', {
      template: '<span ng-if="$ctrl.found_records">Held by: {{$ctrl.summit_list}}</span>',
      controller: function ($scope, $location, $http) {
        
        var vm = this;
        var parent_ctrl, oclc, isbn;
        const sru = 'https://na01.alma.exlibrisgroup.com/view/sru/01ALLIANCE_NETWORK?version=1.2&operation=searchRetrieve&query=';
        const institution_codes = {
          "01ALLIANCE_NETWORK": "Orbis Cascade Alliance",
          "01ALLIANCE_CC": "Clark College",
          "01ALLIANCE_CCC": "Clackamas Community College",
          "01ALLIANCE_CHEMEK": "Chemeketa Community College",
          "01ALLIANCE_COCC": "Central Oregon Community College",
          "01ALLIANCE_CWU": "Central Washington University",
          "01ALLIANCE_EOU": "Eastern Oregon University",
          "01ALLIANCE_EVSC": "Evergreen State College",
          "01ALLIANCE_EWU": "Eastern Washington University",
          "01ALLIANCE_GFOX": "George Fox University",
          "01ALLIANCE_LANECC": "Lane Community College",
          "01ALLIANCE_LCC": "Lewis & Clark College",
          "01ALLIANCE_LINF": "Linfield College",
          "01ALLIANCE_MHCC": "Mount Hood Community College",
          "01ALLIANCE_OHSU": "Oregon Health and Science University",
          "01ALLIANCE_OIT": "Oregon Institute of Technology",
          "01ALLIANCE_OSU": "Oregon State University",
          "01ALLIANCE_PCC": "Portland Community College",
          "01ALLIANCE_PSU": "Portland State University",
          "01ALLIANCE_PU": "Pacific University",
          "01ALLIANCE_REED": "Reed College",
          "01ALLIANCE_SEAU": "Seattle University",
          "01ALLIANCE_SOU": "Southern Oregon University",
          "01ALLIANCE_SPU": "Seattle Pacific University",
          "01ALLIANCE_STMU": "Saint Martin's University",
          "01ALLIANCE_UID": "University of Idaho",
          "01ALLIANCE_UO": "University of Oregon",
          "01ALLIANCE_UPORT": "University of Portland",
          "01ALLIANCE_UPUGS": "University of Puget Sound",
          "01ALLIANCE_UW": "University of Washington",
          "01ALLIANCE_WALLA": "Walla Walla University",
          "01ALLIANCE_WHITC": "Whitman College",
          "01ALLIANCE_WOU": "Western Oregon University",
          "01ALLIANCE_WPC": "Warner Pacific College",
          "01ALLIANCE_WSU": "Washington State University",
          "01ALLIANCE_WU": "Willamette University",
          "01ALLIANCE_WW": "Whitworth University",
          "01ALLIANCE_WWU": "Western Washington University",
          "01WIN_GONZAGA": "Gonzaga University"
        }
        
        this.$onInit = function() {
          // For OpenURLs only
          if ($location.path() == '/openurl') {
            vm.found_records = false;
            vm.parent_ctrl = $scope.$parent.$parent.$ctrl;
            if (angular.isDefined(vm.parent_ctrl.item)) {
              var pnx = vm.parent_ctrl.item.pnx;
              var query = null;
              vm.oclc = null;
              vm.isbn = null;
              // Check PNX for OCLC number
              if (angular.isDefined(pnx.addata.oclcid)) {
                vm.oclc = pnx.addata.oclcid[0];
              }
              // Check rft_id in URL for OCLC number or ISBN
              else if (angular.isDefined($location.search()["rft_id"])) {
                var rft_id = $location.search()["rft_id"];
                if (rft_id.constructor === String) {
                  vm.check_rft_id(rft_id);
                }
                else if (rft_id.constructor === Array) {
                  angular.forEach(rft_id, function (rft_entry) {
                    vm.check_rft_id(rft_entry);
                  });
                }
              }
              // If nothing found yet, check PNX and rft.isbn in URL for ISBN
              if (vm.oclc == null && vm.isbn == null) {
                if (angular.isDefined(pnx.addata.isbn)) {
                  vm.isbn = pnx.addata.isbn[0];
                }
                else if (angular.isDefined($location.search()["rft.isbn"])) {
                  vm.isbn = $location.search()["rft.isbn"];
                }
              }
              // Set query prioritizing OCLC number
              if (vm.oclc != null) {
                query = 'alma.oclc_control_number_035_az=' + vm.oclc;
              }
              else if (vm.isbn != null) {
                query = 'alma.isbn=' + vm.isbn;
              }
              // Hide the form if no OCLC number or ISBN anywhere
              else {
                console.log('No OCLC number or ISBN');
                vm.hide_form();
              }
              
              // If OCLC or ISBN, use SRU to check for NZ holdings
              if (query != null) {
                $http.get(sru + query).then(function (response) {
                  var parser = new DOMParser();
                  var xmlDoc = parser.parseFromString(response.data,"text/xml");
                  var numRecords = xmlDoc.getElementsByTagName('numberOfRecords');
                  if (numRecords.length > 0) {
                    var count = parseInt(numRecords[0].textContent);
                    // If no records, hide the form
                    if (count == 0) {
                      console.log('No NZ records for SRU query ' + query);
                      vm.hide_form();
                    }
                    // If records, go through each
                    else {
                      var institutions = [];
                      var recordData = xmlDoc.getElementsByTagName('recordData');
                      for (var r = 0; r < recordData.length; r++) {
                        var record = recordData[r];
                        // Check LDR/06 and 008/23 or 29 for form of item
                        var leader = record.getElementsByTagName('leader')[0].textContent;
                        const maps_and_visuals = ['e','f','g','k','o'];
                        var form_position, form_of_item;
                        if (maps_and_visuals.includes(leader.substr(6, 1))) {
                          form_position = 29;
                        }
                        else {
                          form_position = 23;
                        }
                        var controlfields = record.getElementsByTagName('controlfield');
                        for (var c = 0; c < controlfields.length; c++) {
                          var controlfield = controlfields[c];
                          if (controlfield.getAttribute('tag') == '008') {
                            form_of_item = controlfield.textContent.substr(form_position, 1);
                            break;
                          }
                        }
                        // If online format, skip this record
                        if (form_of_item == 'o') {
                          continue;
                        }
                        // For other forms, get institution
                        else {
                          var datafields = record.getElementsByTagName('datafield');
                          angular.forEach(datafields, function(datafield) {
                            if (datafield.getAttribute('tag') == '852') {
                              var subfields = datafield.getElementsByTagName('subfield');
                              angular.forEach(subfields, function(subfield) {
                                if (subfield.getAttribute('code') == 'a') {
                                  if (angular.isDefined(institution_codes[subfield.textContent])) {
                                    institutions.push(institution_codes[subfield.textContent]);
                                  }
                                }
                              });
                            }
                          });
                        }
                      }
                      if (institutions.length > 0) {
                        vm.found_records = true;
                        vm.summit_list = institutions.join(', ');
                      }
                      else {
                        console.log('No physical holdings found in SRU query ' + query);
                        vm.hide_form();
                      }
                    }
                  }
                  else {
                    console.log('Error in SRU response.');
                    console.log(sru + query);
                    vm.hide_form();
                  }
                });
              }
            }
          }
        }
        
        // Check rft_id(s) for OCLC and ISBN
        this.check_rft_id = function(rft_id) {
          if (rft_id.substring(0, 12).toLowerCase() == "info:oclcnum") {
            vm.oclc = rft_id.substr(13);
          }
          else if (rft_id.substring(0, 8).toLowerCase() == "urn:isbn") {
            vm.isbn = rft_id.substr(9);
          }
        }
        
        // Remove the RS service after servicesListIsLoading gets set to false
        this.hide_form = function() {
          $scope.$watch(
            function() {
              return vm.parent_ctrl.servicesListIsLoading;
            },
            function(newValue, oldValue) {
              if (newValue === false) {
                angular.forEach(vm.parent_ctrl.services.serviceinfo, function(service, key) {
                  if (service.type == 'AlmaResourceSharing') {
                    vm.parent_ctrl.services.serviceinfo.shift(key);
                  }
                });
              }
            }
          );
        }
        
      }
    });
  
})();
