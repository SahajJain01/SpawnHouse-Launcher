angular.module('app').service('userService', function() {
    var userName = 'Sahaj';
    this.getUsername = function () {
      return userName;
    }
  });