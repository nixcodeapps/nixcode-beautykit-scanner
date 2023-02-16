'use strict';

(function (angular) {
    angular.module('BarcodeScanner')
        .controller('WidgetScannerCtrl', ['$sce','$scope','APIService','RequestService', 'SocialDataStore', 'Modals', 'Buildfire', '$rootScope', 'Location', 'EVENTS', 'GROUP_STATUS', 'MORE_MENU_POPUP', 'FILE_UPLOAD', '$modal', 'SocialItems', '$q', '$anchorScroll', '$location', '$timeout', 'Util', 'SubscribedUsersData', function ($sce, $scope,APIService,RequestService, SocialDataStore, Modals, Buildfire, $rootScope, Location, EVENTS, GROUP_STATUS, MORE_MENU_POPUP, FILE_UPLOAD, $modal, SocialItems, $q, $anchorScroll, $location, $timeout, util, SubscribedUsersData) {
            var WidgetScanner = this;
            WidgetScanner.appTheme = null;
            WidgetScanner.loadedPlugin = false;
            WidgetScanner.SocialItems = SocialItems.getInstance();
            WidgetScanner.util = util;
            $rootScope.showThread = true;
            WidgetScanner.loading = true;
            $scope.pageNumber = 1;
            $scope.searching = false;
            $scope.searching_item = null;
            $scope.product_detail = false;
            $scope.params = {};
            $scope.got_to_saved = function () {
                Location.go('#/saved');
            }
            $scope.got_to_history = function () {
                Location.go('#/history');
            }
           
            setTimeout(() => {
                $scope.scan();
            }, 1000);
           
            $scope.scan = function () {
                buildfire.services.camera.barcodeScanner.scan(
                    {
                      prompt: "Place a barcode inside the scan area",  
                      preferFrontCamera: false,
                      showFlipCameraButton: true,
                      formats: "QR_CODE,DATA_MATRIX,UPC_E,UPC_A,EAN_8,CODE_93,CODABAR,ITF,RSS14,RSS_EXPANDED,PDF_417,CODE_39,CODE_128,EAN_13",
                    },
                    (err, result) => {
                      if (err) return console.error(err);

                      var data = {
                        product: result.text
                      }
                    APIService.get_scanned_product(data, function (
                        result) {
                        $scope.scanned_products = result.data.products;
                        buildfire.userData.get("searchHistory", (err, res) => {
                            if (err) return console.error("Error while retrieving your data", err);
                            if(!angular.equals(res.data, {})){
                                $scope.searchHistory = res.data;
                                console.log("searchHistory record",$scope.searchHistory);
                            }
                             $scope.searchHistory.unshift(result.data.products[0].title);
                            //$scope.searchHistory.unshift(result.data.products[0]);
                            console.log("searchHistory",$scope.searchHistory);
                            buildfire.userData.save(
                                $scope.searchHistory,
                                "searchHistory",
                                (err, result) => {

                                if (err) return console.error("Error while inserting your data", err);
                                console.log("Insert successful", result);
                                }
                            );
                        });
                    }, function (response) {
                        buildfire.dialog.alert({
                            message: `Error ${response.statusText}`,
                        });
                    });
                    //   buildfire.dialog.alert({
                    //     message: `Barcode scanned! Result: ${result.text} Format: ${result.format} Cancelled: ${result.cancelled}`,
                    //   });
                       
                    });
            }


            $scope.save = function(product){
                $scope.savedKits = [];
                buildfire.userData.get("savedKits", (err, result) => {
                    if (err) return console.error("Error while retrieving your data", err);
                    if(!angular.equals(result.data, {})){
                        angular.forEach(result.data, function(value, key) {
                            let data = {
                                text: value,
                                selected: false
                            }
                            $scope.savedKits.unshift(data);
                        });
                        console.log("savedKits", $scope.savedKits);
                        $scope.savedKits.unshift({ text: "Default Kit", selected: false});
                        buildfire.components.drawer.open(
                            {
                              header: "List of Kits",
                              multiSelection: false,
                              allowSelectAll : true,
                              multiSelectionActionButton: {text: 'Save', type: 'success'},
                              enableFilter : true,
                              isHTML: true,
                              triggerCallbackOnUIDismiss: false,   
                              autoUseImageCdn: true,
                              listItems: $scope.savedKits
                            },
                            (err, result_kit) => {
                              if (err) return console.error(err);
                              buildfire.components.drawer.closeDrawer();
                              $scope.save_to_kit(product,result_kit.text)
                            }
                          );
                    }               
                });
    
               }


               $scope.save_to_kit = function (product,kit) {
                if(kit === "Default Kit"){
                    $scope.savedProducts = [];
                    buildfire.userData.get("savedProducts", (err, result) => {
                        if (err) return console.error("Error while retrieving your data", err);
                        if(!angular.equals(result.data, {})){
                            $scope.savedProducts = result.data;
                        }
                        $scope.savedProducts.unshift(product);
                        buildfire.userData.save(
                            $scope.savedProducts,
                            "savedProducts",
                            (err, result) => {
                            if (err) return console.error("Error while inserting your data", err);
                        
                            console.log("Insert successful", result);
                            buildfire.components.toast.showToastMessage({ text: "Product Saved" });
                            }
                        );
                    });
                  }else{
                    console.log(kit);
                    $scope.savedProducts = [];
                    buildfire.userData.get(kit, (err, result) => {
                        if (err) return console.error("Error while retrieving your data", err);
                        if(!angular.equals(result.data, {})){
                            $scope.savedProducts = result.data;
                        }
                        $scope.savedProducts.unshift(product);
                        buildfire.userData.save(
                            $scope.savedProducts,
                            kit,
                            (err, result) => {
                            if (err) return console.error("Error while inserting your data", err);
                        
                            console.log("Insert successful", result);
                            buildfire.components.toast.showToastMessage({ text: "Product Saved" });
                            }
                        );
                    });
                  }
               }


            $scope.check = function(){
                buildfire.services.camera.isAuthorized(null, (err, status) => {
                    if (err) return console.error(err);
                    buildfire.notifications.alert(status);
                    console.log("is Authorized:" + status);
                  });
            }

            $scope.view_product = function (product, index) {
                $scope.current_product = product;
                $scope.current_product_index = index;
                $scope.product_detail = true;
            }

            $scope.back_to_search = function () {
                $scope.product_detail = false;
            }

            $scope.authorize = function(){
                buildfire.services.camera.requestAuthorization(null, (err, result) => {
                    if (err) return console.error(err);
                  
                    console.log("request authorization:" + result);
                  });
            }
            WidgetScanner.setAppTheme = function () {
                buildfire.appearance.getAppTheme((err, obj) => {
                    let elements = document.getElementsByTagName('svg');
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].style.setProperty("fill", obj.colors.icons, "important");
                    }
                    WidgetScanner.appTheme = obj.colors;
                    WidgetScanner.loadedPlugin = true;
                });
            }

            

            WidgetScanner.init = function () {
                WidgetScanner.SocialItems.getSettings((err, result) => {
                    if (err) return console.error("Fetching settings failed.", err);
                    if (result) {
                        WidgetScanner.SocialItems.items = [];
                        WidgetScanner.setAppTheme();
                        WidgetScanner.SocialItems.authenticateUser(null, (err, user) => {
                            if (err) return console.error("Getting user failed.", err);
                            if (user) {
                            } else {
                                WidgetScanner.groupFollowingStatus = false;
                            }
                        });
                    }
                });
            };

            WidgetScanner.init();
            WidgetScanner.formatLanguages = function (strings) {
                Object.keys(strings).forEach(e => {
                    strings[e].value ? WidgetWall.SocialItems.languages[e] = strings[e].value : WidgetWall.SocialItems.languages[e] = strings[e].defaultValue;
                });
            }
       

            $rootScope.$on('navigatedBack', function (event, error) {
                WidgetScanner.SocialItems.items = [];
                WidgetScanner.SocialItems.isPrivateChat = false;
                WidgetScanner.SocialItems.pageSize = 5;
                WidgetScanner.SocialItems.page = 0;
                WidgetScanner.SocialItems.wid = WidgetScanner.SocialItems.mainWallID;
                WidgetScanner.SocialItems.pluginTitle = '';
                WidgetScanner.init();
            });

            // On Login
            Buildfire.auth.onLogin(function (user) {
                console.log("NEW USER LOGGED IN", WidgetScanner.SocialItems.forcedToLogin)
                if (!WidgetScanner.SocialItems.forcedToLogin) {
                    WidgetScanner.SocialItems.authenticateUser(user, (err, userData) => {
                        if (err) return console.error("Getting user failed.", err);
                        if (userData) {
                            WidgetScanner.checkFollowingStatus();
                        }
                    });
                } else WidgetScanner.SocialItems.forcedToLogin = false;
                WidgetScanner.showUserLikes();
                if ($scope.$$phase) $scope.$digest();
            });
            
            // On Logout
            Buildfire.auth.onLogout(function () {
                console.log('User loggedOut from Widget Wall Page');
                buildfire.appearance.titlebar.show();
                WidgetScanner.SocialItems.userDetails = {};
                WidgetScanner.groupFollowingStatus = false;
                buildfire.notifications.pushNotification.unsubscribe(
                    {
                        groupName: WidgetScanner.SocialItems.wid === '' ?
                            WidgetScanner.SocialItems.context.instanceId : WidgetScanner.SocialItems.wid
                    }, () => { });
                WidgetScanner.privateChatSecurity();
                $scope.$digest();
            });

        }])
})(window.angular);
