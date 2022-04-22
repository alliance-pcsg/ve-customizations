(function(){
"use strict";
"use strict";

  var app = angular.module('viewCustom', ['angularLoad']);

  app.component('prmAdvancedSearchAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller() {
      
      var _self;
      var rowArray;
      var buffer;
      
      // Remove additional space and attach handlers
      this.$onInit = function () {
        _self = this;
        rowArray = _self.parentCtrl.rowArray;
        buffer = '  ';
        _self.trim_inputs();
        _self.add_form_handler();
        _self.add_input_handlers();
      }
      
      // Attach form handler to trim values and attach handlers to new text inputs
      this.add_form_handler = function() {
        var search_form = document.querySelector('form.search-element');
        search_form.addEventListener('submit', function() {
          _self.trim_inputs();
          _self.add_input_handlers();
        });
      }
      
      // Attach handlers to text inputs to always set the first character as a space
      this.add_input_handlers = function() {
        if (_self.check_search() == true) {
          var interval = setInterval(find_inputs, 100);
          function find_inputs() {
            var inputs = document.querySelectorAll('.string-field input');
            if (inputs.length > 0) {
              clearInterval(interval);
              if (inputs.item(0).value.substring(0, buffer.length) != buffer) {
                _self.add_buffer(inputs.item(0));
              }
              inputs.item(0).addEventListener('keyup', function() {
                if (this.value.substring(0, buffer.length) != buffer) {
                  _self.add_buffer(this);
                }
                else if (this.value.length < buffer.length) {
                  this.value == buffer; 
                }
              });
            }
          }
        }
      }
      
      // Add a space to the beginning of a text input and adjust the size
      this.add_buffer = function(input) {
        input.value = buffer + input.value.trim();
        var width = input.style.width;
        var new_width = parseInt(width.substring(0, width.length-2)) + 3 * (buffer.length);
        input.style.width = new_width.toString() + 'px';
      }
      
      // Check if a search has been submitted
      this.check_search = function() {
        var has_search = false;
        for (var a = 0; a < rowArray.length; a++) {
          var searchQuery = rowArray[a].searchQuery;
          if (searchQuery != '') {
            has_search = true;
          }
        }
        return has_search;
      }
      
      // Trim added space from query terms
      this.trim_inputs = function() {
        for (var a = 0; a < rowArray.length; a++) {
          rowArray[a].searchQuery = rowArray[a].searchQuery.trim();
        }
      }
    }
  });

})();
