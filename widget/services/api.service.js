'use strict';
(function (angular) {

    angular.module('BarcodeScanner')
    
    .factory('APIService', APIService);
 
    APIService.$inject = ['$rootScope', 'RequestService', '$location'];
    function APIService($rootScope, RequestService, $location) {
        var service = {};        
        service.get_scanned_product = get_scanned_product;
        service.get_searched_product = get_searched_product;
        return service;

        function get_scanned_product(param, callback, fallback) {
            RequestService.CallAPI1(param, '?barcode=' + param.product + '&formatted=y', function (result) {
                if (result) {
                    callback(result);
                }
            }, fallback, 'GET');
        }

        function get_searched_product(param, callback, fallback) {
            RequestService.CallAPI1(param, '?search=' + param.product + '&page=' + param.page + '&formatted=y', function (result) {
                if (result) {
                    callback(result);
                }
            }, fallback, 'GET');
        }
  
    }
 
})(window.angular);