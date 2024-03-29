(function (angular, location) {
    "use strict";
    //created BarcodeScanner module
    angular
        .module('BarcodeScannerPluginFilters', [])
        .filter('convertTimeFormat', [function () {
            return function (time) {
                var formattedTime = time;
                if (time && time.indexOf('a few seconds ago') != -1) {
                    formattedTime = formattedTime.replace('a few seconds ago', 'just now');
                } else if(time && time.indexOf('in a few seconds') != -1) {
	                formattedTime = formattedTime.replace('in a few seconds', 'just now');
	            } else if(time && time.indexOf('a second ago') != -1) {
                    formattedTime = formattedTime.replace('a second ago', '1s');
                } else if(time && time.indexOf(' seconds ago') != -1) {
                    formattedTime = formattedTime.replace('seconds ago', 's');
                } else if(time && time.indexOf('a minute ago') != -1) {
                    formattedTime = formattedTime.replace('a minute ago', '1 mi');
                } else if(time && time.indexOf(' minutes ago') != -1) {
                    formattedTime = formattedTime.replace('minutes ago', 'mi');
                } else if(time && time.indexOf('an hour ago') != -1) {
                    formattedTime = formattedTime.replace('an hour ago', '1h');
                } else if(time && time.indexOf(' hours ago') != -1) {
                    formattedTime = formattedTime.replace('hours ago', 'h');
                } else if(time && time.indexOf('a day ago') != -1) {
                    formattedTime = formattedTime.replace('a day ago', '1d');
                } else if(time && time.indexOf(' days ago') != -1) {
                    formattedTime = formattedTime.replace('days ago', 'd');
                } else if(time && time.indexOf('a month ago') != -1) {
                    formattedTime = formattedTime.replace('a month ago', '1 mo');
                } else if(time && time.indexOf(' months ago') != -1) {
                    formattedTime = formattedTime.replace('months ago', 'mo');
                } else if(time && time.indexOf('a year ago') != -1) {
                    formattedTime = formattedTime.replace('a year ago', '1y');
                } else if(time && time.indexOf(' years ago') != -1) {
                    formattedTime = formattedTime.replace('years ago', 'y');
                }
                return formattedTime;

            };
        }])
        .filter('newLine', ['$sce', function ($sce) {
            return function (html) {
                if (html) {
                    html = html.replace(/\n/g, '<br />');
                    return $sce.trustAsHtml(html);
                }
                else {
                    return "";
                }
            };
        }])
})(window.angular, window.location);