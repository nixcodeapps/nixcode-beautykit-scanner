'use strict';
(function (angular) {

	angular.module('BarcodeScanner')
		.factory('RequestService', RequestService);

	var BarcodeScannerUrl = 'https://corsproxy.io/?https://api.barcodelookup.com/v3/products'

	var Preferences = {
		api_key: ''
	}

	buildfire.datastore.get("barcodeScannerConfig", (err, result) => {
		if (err) return console.error("Error while retrieving your data", err);
		console.log("barcodeScannerConfig From my service", result.data);
		Preferences.api_key = result.data.api_key;
	  });


	RequestService.$inject = ['$http', '$rootScope', '$timeout', '$location'];

	function RequestService($http, $rootScope, $timeout, $location) {
		var service = {};

		service.CallAPI1 = CallAPI1;
		service.getPreferences = getPreferences;
		service.getBarcodeAPIUrl = getBarcodeAPIUrl;
		return service;

		
		function CallAPI1(data, url, success_callback, failure_callback, method, api_url,
			isFile) {
			var urlParam = method && method == 'GET' && data ? '?' + jQuery.param(data) :
				'';
			var req = {
				method: method ? method : 'POST',
				url: api_url ? api_url + url + urlParam : BarcodeScannerUrl + url + '&key=' + Preferences.api_key,
				headers: {
					'Content-Type': isFile ? undefined : 'application/json',
					// 'Access-Control-Allow-Origin' : 'http://localhost:3030',
					// 'Access-Control-Allow-Credentials' : 'true',
					// 'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS',
					// 'Access-Control-Allow-Headers' : 'Origin, Content-Type, Accept'
				},
				// data: data
			}
			$http(req).then(function (response) {
				success_callback(response);
			}, function (response) {
				if (response.status) {
					switch (response.status) {
						case 401: //Unauthorized
							$rootScope.logout();
							break;
					}
				}
				if (failure_callback)
					failure_callback(response);
			});

		}
	
	};

	function getPreferences() {
		return Preferences;
	};

	function getBarcodeAPIUrl() {
		return BarcodeScannerUrl;
	};

})(window.angular);
