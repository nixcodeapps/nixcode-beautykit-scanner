'use strict';

(function (angular) {
    angular.module('BarcodeScanner')
        .controller('WidgetHistoryCtrl', ['$sce','$scope','APIService','RequestService', 'SocialDataStore', 'Modals', 'Buildfire', '$rootScope', 'Location', 'EVENTS', 'GROUP_STATUS', 'MORE_MENU_POPUP', 'FILE_UPLOAD', '$modal', 'SocialItems', '$q', '$anchorScroll', '$location', '$timeout', 'Util', 'SubscribedUsersData', function ($sce, $scope,APIService,RequestService, SocialDataStore, Modals, Buildfire, $rootScope, Location, EVENTS, GROUP_STATUS, MORE_MENU_POPUP, FILE_UPLOAD, $modal, SocialItems, $q, $anchorScroll, $location, $timeout, util, SubscribedUsersData) {
            var WidgetHistory = this;
            WidgetHistory.appTheme = null;
            WidgetHistory.loadedPlugin = false;
            WidgetHistory.SocialItems = SocialItems.getInstance();
            WidgetHistory.util = util;
            $rootScope.showThread = true;
            WidgetHistory.loading = true;
            $scope.product_detail = false;
            buildfire.userData.get("searchHistory", (err, result) => {
                if (err) return console.error("Error while retrieving your data", err);
                console.log("searchHistory", result.data);
                $scope.histories = result.data;
                console.log($scope.histories)
                if($scope.histories.length == 0){
                    buildfire.dialog.alert({
                        message: `No history`,
                    });
                    // Location.go('#/scanner');
                  } 
              });

            $scope.view_product = function (product) {
                $scope.current_product = product;
                var data = {
                    product: product,
                    page: $scope.pageNumber
                }
                APIService.get_searched_product(data, function (result) {
                    $scope.products = result.data.products;
                    if(result.data.products.length > 9) {
                    	$scope.searching = true;
                    }
                }, function (response) {
                    buildfire.dialog.alert({
                    	message: `Error ${response.statusText}`,
                    });
                });
            }
      
            $scope.delete_all = function(){
                $scope.searchHistory = [];
                 buildfire.userData.save(
                   $scope.searchHistory,
                   "searchHistory",
                   (err, result) => {
                    if (err) return console.error("Error while inserting your data", err);
                    $scope.$apply(function(){
                        $scope.histories = [];
                    });
                  });
            }

            $scope.delete_history = function(index){
                $scope.searchHistory = [];
                buildfire.userData.get("searchHistory", (err, result) => {
                   if (err) return console.error("Error while retrieving your data", err);
                   $scope.searchHistory = result.data;
                    $scope.searchHistory.splice(index, 1);
                    buildfire.userData.save(
                    $scope.searchHistory,
                    "searchHistory",
                    (err, result) => {
                        if (err) return console.error("Error while inserting your data", err);
                        console.log("Insert successful", result);
                        $scope.$apply(function(){
                            $scope.histories = result.data;
                           })
                    });
                 });
            }
            $scope.back_to_results = function () {
                $scope.product_detail = false;
            }
           
            WidgetHistory.setAppTheme = function () {
                buildfire.appearance.getAppTheme((err, obj) => {
                    let elements = document.getElementsByTagName('svg');
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].style.setProperty("fill", obj.colors.icons, "important");
                    }
                    WidgetHistory.appTheme = obj.colors;
                    WidgetHistory.loadedPlugin = true;
                });
            }

            

            WidgetHistory.init = function () {
                WidgetHistory.SocialItems.getSettings((err, result) => {
                    if (err) return console.error("Fetching settings failed.", err);
                    if (result) {
                        WidgetHistory.SocialItems.items = [];
                        WidgetHistory.setAppTheme();
                        WidgetHistory.SocialItems.authenticateUser(null, (err, user) => {
                            if (err) return console.error("Getting user failed.", err);
                            if (user) {
                            } else {
                                WidgetHistory.groupFollowingStatus = false;
                            }
                        });
                    }
                });
            };

            WidgetHistory.init();
            WidgetHistory.formatLanguages = function (strings) {
                Object.keys(strings).forEach(e => {
                    strings[e].value ? WidgetWall.SocialItems.languages[e] = strings[e].value : WidgetWall.SocialItems.languages[e] = strings[e].defaultValue;
                });
            }
       

            $rootScope.$on('navigatedBack', function (event, error) {
                WidgetHistory.SocialItems.items = [];
                WidgetHistory.SocialItems.isPrivateChat = false;
                WidgetHistory.SocialItems.pageSize = 5;
                WidgetHistory.SocialItems.page = 0;
                WidgetHistory.SocialItems.wid = WidgetHistory.SocialItems.mainWallID;
                WidgetHistory.SocialItems.pluginTitle = '';
                WidgetHistory.init();
            });

            // On Login
            Buildfire.auth.onLogin(function (user) {
                console.log("NEW USER LOGGED IN", WidgetHistory.SocialItems.forcedToLogin)
                if (!WidgetHistory.SocialItems.forcedToLogin) {
                    WidgetHistory.SocialItems.authenticateUser(user, (err, userData) => {
                        if (err) return console.error("Getting user failed.", err);
                        if (userData) {
                            WidgetHistory.checkFollowingStatus();
                        }
                    });
                } else WidgetHistory.SocialItems.forcedToLogin = false;
                WidgetHistory.showUserLikes();
                if ($scope.$$phase) $scope.$digest();
            });
            
            // On Logout
            Buildfire.auth.onLogout(function () {
                console.log('User loggedOut from Widget Wall Page');
                buildfire.appearance.titlebar.show();
                WidgetHistory.SocialItems.userDetails = {};
                WidgetHistory.groupFollowingStatus = false;
                buildfire.notifications.pushNotification.unsubscribe(
                    {
                        groupName: WidgetHistory.SocialItems.wid === '' ?
                            WidgetHistory.SocialItems.context.instanceId : WidgetHistory.SocialItems.wid
                    }, () => { });
                WidgetHistory.privateChatSecurity();
                $scope.$digest();
            });

        }])
})(window.angular);
