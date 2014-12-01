var BlacksmithFilters = angular.module('BlacksmithFilters');

BlacksmithFilters.filter('fromNow', function() {
  return function(input) {
    var updatedSince = 'undefined'
    if(input !== undefined){
      updatedSince = moment(input).fromNow();
    }
    return updatedSince;
  }
});
