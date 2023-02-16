'use strict';

(function (angular) {
    angular.module('BarcodeScanner')
        .controller('WidgetSavedCtrl', ['$sce','$scope','APIService','RequestService', 'SocialDataStore', 'Modals', 'Buildfire', '$rootScope', 'Location', 'EVENTS', 'GROUP_STATUS', 'MORE_MENU_POPUP', 'FILE_UPLOAD', '$modal', 'SocialItems', '$q', '$anchorScroll', '$location', '$timeout', 'Util', 'SubscribedUsersData', function ($sce, $scope,APIService,RequestService, SocialDataStore, Modals, Buildfire, $rootScope, Location, EVENTS, GROUP_STATUS, MORE_MENU_POPUP, FILE_UPLOAD, $modal, SocialItems, $q, $anchorScroll, $location, $timeout, util, SubscribedUsersData) {
            var WidgetSaved = this;
            WidgetSaved.appTheme = null;
            WidgetSaved.loadedPlugin = false;
            WidgetSaved.SocialItems = SocialItems.getInstance();
            WidgetSaved.util = util;
            $rootScope.showThread = true;
            WidgetSaved.loading = true;
            $scope.kits_loaded = false;
            $scope.display_kits = true;
            
            setTimeout(() => {
                $scope.all_kits();
            }, 1000);
            buildfire.userData.get("savedProducts", (err, result) => {
                if (err) return console.error("Error while retrieving your data", err);
                console.log("testP record", result.data);
                $scope.products = result.data;
                if($scope.products.length == 0){
                    buildfire.dialog.alert({
                        message: `No saved items`,
                    });
                    // Location.go('#/scanner');
                  } 
              });
          
            $scope.delete_all = function(){
                $scope.savedProducts = [];
                 buildfire.userData.save(
                   $scope.savedProducts,
                   "savedProducts",
                   (err, result) => {
                    if (err) return console.error("Error while inserting your data", err);
                    $scope.$apply(function(){
                        $scope.products = [];
                    });
                  }
                );
            }

            $scope.delete_saved = function(){
                $scope.savedProducts = [];
                buildfire.userData.get("savedProducts", (err, result) => {
                   if (err) return console.error("Error while retrieving your data", err);
                   $scope.savedProducts = result.data;
                    $scope.savedProducts.splice($scope.current_product_index, 1);
                    buildfire.userData.save(
                    $scope.savedProducts,
                    "savedProducts",
                    (err, result) => {
                        if (err) return console.error("Error while inserting your data", err);
                        console.log("Insert successful", result);
                        buildfire.components.toast.showToastMessage({ text: "Product Removed" });
                        Location.go('#/saved');
                    }
                    );
                 });
            }
            $scope.all_kits = function () {
                $scope.savedKits = [];
                buildfire.userData.get("savedKits", (err, result) => {
                    if (err) return console.error("Error while retrieving your data", err);
                    if(!angular.equals(result.data, {})){
                        $scope.savedKits = result.data;
                        console.log("savedKits",result.data);
                        if(result.data.length > 0){
                            console.log("we have savedKits");
                            angular.forEach(result.data, function(value, key) {
                                $scope.kits = [];
                                buildfire.userData.get(value, (err, result) => {
                                    if (err) return console.error("Error while retrieving your data", err);
                                     $scope.kits.unshift(result);
                                     $scope.kits_loaded = true;
                                    // if(!angular.equals(result.data, {})){
                                    //     $scope.kits.unshift(result.data);
                                    //     $scope.savedKits = result.data;
                                    //     console.log("savedKits",$scope.savedKits);
                                        
                                    // }
                                });
    
                              });
                        }else{
                            console.log("we have no savedKits");
                            $scope.kits = [];
                        }
                    }
                });
            }

            $scope.view_kits = function () {
              console.log($scope.kits)
            }

            $scope.create_kit = function () {
                buildfire.input.showTextDialog(
                    {
                    placeholder: "Enter your kit name",
                    saveText: "Save",
                    maxLength: 50,
                    },
                    (err, response) => {
                    if (err) return console.error(err);
                    if (response.cancelled) return;
                
                    $scope.savedKits = [];
                    buildfire.userData.get("savedKits", (err, result) => {
                        if (err) return console.error("Error while retrieving your data", err);
                        if(!angular.equals(result.data, {})){
                            $scope.savedKits = result.data;
                            console.log("savedKits",$scope.savedKits);
                        }
                        $scope.savedKits.unshift(response.results[0].textValue);
                        buildfire.userData.save(
                            $scope.savedKits,
                            "savedKits",
                            (err, result) => {
                            if (err) return console.error("Error while inserting your data", err);
                        
                              buildfire.userData.save(
                                [],
                                response.results[0].textValue,
                                (err, result) => {
                                if (err) return console.error("Error while inserting your data", err);
                            
                                console.log("Insert successful", result);
                                buildfire.components.toast.showToastMessage({ text: "Kit Created" });
                                $scope.all_kits();
                                }
                              );
                            }
                        );
                    });


                    }
                );
            }
            
            $scope.open_kit = function(kit, index) {
                $scope.selected_kit = kit;
                $scope.selected_kit_index = index;
                $scope.display_kits = false;
                if(kit.data.length > 0){
                  $scope.products = kit.data;
                }else{
                    $scope.products = [];
                }
            }

            $scope.delete_kit = function() {
                buildfire.userData.delete($scope.selected_kit.id, $scope.selected_kit.tag, (err, result) => {
                    if (err) return console.error(err);
                    buildfire.components.toast.showToastMessage({ text: "Kit Removed" });
                    $scope.savedKits = [];
                    buildfire.userData.get("savedKits", (err, result) => {
                       if (err) return console.error("Error while retrieving your data", err);
                       $scope.savedKits = result.data;
                       let index = $scope.savedKits.indexOf($scope.selected_kit.tag);  
                        $scope.savedKits.splice(index, 1);
                        buildfire.userData.save(
                        $scope.savedKits,
                        "savedKits",
                        (err, result) => {
                            if (err) return console.error("Error while inserting your data", err);
                            $scope.all_kits();
                            buildfire.userData.get("savedProducts", (err, result) => {
                                if (err) return console.error("Error while retrieving your data", err);
                                $scope.products = result.data;
                                $scope.display_kits = true;
                              });
                        });
                     });
                  });

            }
            
            $scope.view_product = function (product, index) {
                $scope.current_product = product;
                $scope.current_product_index = index;
                $scope.product_detail = true;
            }

            $scope.back_to_results = function () {
                $scope.product_detail = false;
                $scope.display_kits = true;
                buildfire.userData.get("savedProducts", (err, result) => {
                    if (err) return console.error("Error while retrieving your data", err);
                    console.log("testP record", result.data);
                    $scope.$apply(function(){
                        $scope.products = result.data;
                    });
                    $scope.products = result.data;
                  });
                  if($scope.products.length == 0){
                    // buildfire.dialog.alert({
                    //     message: `No saved items`,
                    // });
                    // Location.go('#/scanner');
                  } 
                  
            }
            WidgetSaved.setAppTheme = function () {
                buildfire.appearance.getAppTheme((err, obj) => {
                    let elements = document.getElementsByTagName('svg');
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].style.setProperty("fill", obj.colors.icons, "important");
                    }
                    WidgetSaved.appTheme = obj.colors;
                    WidgetSaved.loadedPlugin = true;
                });
            }

            

            WidgetSaved.init = function () {
                WidgetSaved.SocialItems.getSettings((err, result) => {
                    if (err) return console.error("Fetching settings failed.", err);
                    if (result) {
                        WidgetSaved.SocialItems.items = [];
                        WidgetSaved.setAppTheme();
                        WidgetSaved.SocialItems.authenticateUser(null, (err, user) => {
                            if (err) return console.error("Getting user failed.", err);
                            if (user) {
                            } else {
                                WidgetSaved.groupFollowingStatus = false;
                            }
                        });
                    }
                });
            };

            WidgetSaved.init();
            WidgetSaved.formatLanguages = function (strings) {
                Object.keys(strings).forEach(e => {
                    strings[e].value ? WidgetWall.SocialItems.languages[e] = strings[e].value : WidgetWall.SocialItems.languages[e] = strings[e].defaultValue;
                });
            }
       

            $rootScope.$on('navigatedBack', function (event, error) {
                WidgetSaved.SocialItems.items = [];
                WidgetSaved.SocialItems.isPrivateChat = false;
                WidgetSaved.SocialItems.pageSize = 5;
                WidgetSaved.SocialItems.page = 0;
                WidgetSaved.SocialItems.wid = WidgetSaved.SocialItems.mainWallID;
                WidgetSaved.SocialItems.pluginTitle = '';
                WidgetSaved.init();
            });

            // On Login
            Buildfire.auth.onLogin(function (user) {
                console.log("NEW USER LOGGED IN", WidgetSaved.SocialItems.forcedToLogin)
                if (!WidgetSaved.SocialItems.forcedToLogin) {
                    WidgetSaved.SocialItems.authenticateUser(user, (err, userData) => {
                        if (err) return console.error("Getting user failed.", err);
                        if (userData) {
                            WidgetSaved.checkFollowingStatus();
                        }
                    });
                } else WidgetSaved.SocialItems.forcedToLogin = false;
                WidgetSaved.showUserLikes();
                if ($scope.$$phase) $scope.$digest();
            });
            
            // On Logout
            Buildfire.auth.onLogout(function () {
                console.log('User loggedOut from Widget Wall Page');
                buildfire.appearance.titlebar.show();
                WidgetSaved.SocialItems.userDetails = {};
                WidgetSaved.groupFollowingStatus = false;
                buildfire.notifications.pushNotification.unsubscribe(
                    {
                        groupName: WidgetSaved.SocialItems.wid === '' ?
                            WidgetSaved.SocialItems.context.instanceId : WidgetSaved.SocialItems.wid
                    }, () => { });
                WidgetSaved.privateChatSecurity();
                $scope.$digest();
            });

        }])
})(window.angular);
