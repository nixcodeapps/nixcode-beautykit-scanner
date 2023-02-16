'use strict';

(function (angular) {
    angular.module('BarcodeScanner')
        .controller('WidgetSearchCtrl', ['$sce','$scope','APIService','RequestService', 'SocialDataStore', 'Modals', 'Buildfire', '$rootScope', 'Location', 'EVENTS', 'GROUP_STATUS', 'MORE_MENU_POPUP', 'FILE_UPLOAD', '$modal', 'SocialItems', '$q', '$anchorScroll', '$location', '$timeout', 'Util', 'SubscribedUsersData', function ($sce, $scope,APIService,RequestService, SocialDataStore, Modals, Buildfire, $rootScope, Location, EVENTS, GROUP_STATUS, MORE_MENU_POPUP, FILE_UPLOAD, $modal, SocialItems, $q, $anchorScroll, $location, $timeout, util, SubscribedUsersData) {
            var WidgetSearch = this;
            WidgetSearch.appTheme = null;
            WidgetSearch.loadedPlugin = false;
            WidgetSearch.SocialItems = SocialItems.getInstance();
            WidgetSearch.util = util;
            $rootScope.showThread = true;
            WidgetSearch.loading = true;
            $scope.pageNumber = 1;
            $scope.show_text = true;
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
            
            $scope.clearText = function() {
              $scope.params.text = null;
            }
            $scope.showMore = function(){
                $scope.pageNumber = $scope.pageNumber + 1;
                var data = {
                    product: $scope.searching_item,
                    page: $scope.pageNumber 
                  }
                APIService.get_searched_product(data, function (
                    result) {
                    $scope.products = result.data.products;
                    // buildfire.dialog.alert({
                    //     message: `Result: ${result.data.products[0].title}`,
                    // });
                }, function (response) {
                    buildfire.dialog.alert({
                        message: `Error ${response.statusText}`,
                    });
                });
            }
            $scope.search = function ($event) {
                $scope.searching_item =  $event.target.value;
                if($event.target.value === ""){
                    $scope.show_text = true;
                    $scope.products = [];
                    buildfire.dialog.alert({
                        message: `Please type something`,
                    });
                }else{
                    $scope.show_text = false;
                    $scope.searchHistory = [];
                    buildfire.userData.get("searchHistory", (err, result) => {
                        if (err) return console.error("Error while retrieving your data", err);
                        if(!angular.equals(result.data, {})){
                            $scope.searchHistory = result.data;
                            console.log("searchHistory record",$scope.searchHistory);
                        }
                        $scope.searchHistory.unshift($scope.searching_item);
                        console.log("searchHistory record",$scope.searchHistory);
                        buildfire.userData.save(
                            $scope.searchHistory,
                            "searchHistory",
                            (err, result) => {
                            if (err) return console.error("Error while inserting your data", err);
                        
                            console.log("Insert successful", result);
                            }
                        );
                    });
                    // $scope.products = [
                    //     {
                    //     barcode_number: "753759978396",
                    //     barcode_formats: "UPC-A 753759978396, EAN-13 0753759978396",
                    //     mpn: "010-00989-01",
                    //     model: "010-00989-01",
                    //     asin: "B00VXW2CCI",
                    //     title: "Garmin Nuvi 30 GPS Navigation System",
                    //     category: "Electronics > GPS Navigation Systems",
                    //     manufacturer: "Garmin Nvi 30 Automotive GPS UK & Ireland",
                    //     brand: "Garmin",
                    //     contributors: [ ],
                    //     age_group: "adult",
                    //     ingredients: "",
                    //     nutrition_facts: "",
                    //     energy_efficiency_class: "",
                    //     color: "",
                    //     gender: "",
                    //     material: "",
                    //     pattern: "",
                    //     format: "",
                    //     multipack: "",
                    //     size: "",
                    //     length: "",
                    //     width: "",
                    //     height: "",
                    //     weight: "90",
                    //     release_date: "",
                    //     description: "This black Garmin Nuvi 30 portable GPS will help you get anywhere you need to go. The device also has a speaker, so you won't have to read the directions while you drive.",
                    //     features: [ ],
                    //     images: [
                    //     "https://images.barcodelookup.com/4311/43110521-1.jpg"
                    //     ],
                    //     last_update: "2021-08-25 21:29:53",
                    //     stores: [
                    //     {
                    //     name: "OnBuy.com",
                    //     country: "GB",
                    //     currency: "GBP",
                    //     currency_symbol: "£",
                    //     price: "19.99",
                    //     sale_price: "",
                    //     tax: [ ],
                    //     link: "https://www.onbuy.com/gb/sat-navs/garmin-nuvi-30-automotive-gps-uk-and-ireland~c9493~p14332309/?condition=used&exta=cjunct&stat=eyJpcCI6IjE5Ljk5IiwiZHAiOjAsImxpZCI6IjE5NTEwMTg0IiwicyI6IjEiLCJ0IjoxNTgxODcyNTIzLCJibWMiOjB9",
                    //     item_group_id: "",
                    //     availability: "",
                    //     condition: "",
                    //     shipping: [ ],
                    //     last_update: "2021-06-22 03:55:30"
                    //     },
                    //     {
                    //     name: "OnBuy.com UK",
                    //     country: "GB",
                    //     currency: "GBP",
                    //     currency_symbol: "£",
                    //     price: "19.99",
                    //     sale_price: "",
                    //     tax: [ ],
                    //     link: "https://www.onbuy.com/gb/garmin-nuvi-30-automotive-gps-uk-and-ireland~c9493~p14332309/?condition=used&exta=cjunct&stat=eyJpcCI6IjE5Ljk5IiwiZHAiOjAsImxpZCI6IjE5NTEwMTg0IiwicyI6IjEiLCJ0IjoxNTkyMTEwODY3LCJibWMiOjB9",
                    //     item_group_id: "",
                    //     availability: "",
                    //     condition: "",
                    //     shipping: [ ],
                    //     last_update: "2021-06-22 02:34:30"
                    //     },
                    //     {
                    //     name: "Barnes & Noble",
                    //     country: "US",
                    //     currency: "USD",
                    //     currency_symbol: "$",
                    //     price: "103.70",
                    //     sale_price: "",
                    //     tax: [ ],
                    //     link: "https://www.barnesandnoble.com/w/garmin-nuvi-30-gps-35-lcd-touchscreen-widescreen-points-of-inter/1108618186?ean=0753759978396",
                    //     item_group_id: "",
                    //     availability: "",
                    //     condition: "",
                    //     shipping: [ ],
                    //     last_update: "2021-06-22 03:34:52"
                    //     },
                    //     {
                    //     name: "Overstock.com",
                    //     country: "US",
                    //     currency: "USD",
                    //     currency_symbol: "$",
                    //     price: "122.99",
                    //     sale_price: "",
                    //     tax: [ ],
                    //     link: "https://www.overstock.com/Electronics/Automotive-GPS/28211/subcat.html?featuredproduct=6395110&featuredoption=8643313",
                    //     item_group_id: "6395110",
                    //     availability: "out of stock",
                    //     condition: "new",
                    //     shipping: [ ],
                    //     last_update: "2021-08-25 21:29:53"
                    //     },
                    //     {
                    //     name: "Shoplet.com",
                    //     country: "US",
                    //     currency: "USD",
                    //     currency_symbol: "$",
                    //     price: "157.55",
                    //     sale_price: "",
                    //     tax: [ ],
                    //     link: "https://www.shoplet.com/afred2.xgi?ue=1&pt=cj&",
                    //     item_group_id: "",
                    //     availability: "",
                    //     condition: "",
                    //     shipping: [ ],
                    //     last_update: "2021-06-22 02:29:18"
                    //     }
                    //     ],
                    //     reviews: [ ]
                    //     },
                    //     {
                    //     barcode_number: "636926065177",
                    //     barcode_formats: "UPC-A 636926065177, EAN-13 0636926065177",
                    //     mpn: "1fl6.002.06",
                    //     model: "1fl6.002.06",
                    //     asin: "B00CL9UMKG",
                    //     title: "TomTom GO 6000 Europe GPS Navigation System",
                    //     category: "Electronics > GPS Navigation Systems",
                    //     manufacturer: "Tom Tom",
                    //     brand: "Tom Tom",
                    //     contributors: [ ],
                    //     age_group: "",
                    //     ingredients: "",
                    //     nutrition_facts: "",
                    //     energy_efficiency_class: "",
                    //     color: "",
                    //     gender: "",
                    //     material: "",
                    //     pattern: "",
                    //     format: "",
                    //     multipack: "",
                    //     size: "",
                    //     length: "6.65",
                    //     width: "0.79",
                    //     height: "4.13",
                    //     weight: "64",
                    //     release_date: "",
                    //     description: "Tomtom Go 6000 6-inch Sat Nav With Eiropean Maps And Liftime Map And Traffic Up.",
                    //     features: [ ],
                    //     images: [
                    //     "https://images.barcodelookup.com/4220/42203636-1.jpg"
                    //     ],
                    //     last_update: "2021-06-22 03:07:08",
                    //     stores: [
                    //     {
                    //     name: "OnBuy.com",
                    //     country: "GB",
                    //     currency: "GBP",
                    //     currency_symbol: "£",
                    //     price: "110.00",
                    //     sale_price: "",
                    //     tax: [ ],
                    //     link: "https://www.onbuy.com/gb/sat-navs/tomtom-go-6000-europe-gps-navigation-system~c9493~p17636030/?condition=used&exta=cjunct&stat=eyJpcCI6IjExMC4wMCIsImRwIjowLCJsaWQiOiIyMzIxMjE0MCIsInMiOiIxIiwidCI6MTU4MTg3MjU0NSwiYm1jIjowf",
                    //     item_group_id: "",
                    //     availability: "",
                    //     condition: "",
                    //     shipping: [ ],
                    //     last_update: "2021-06-22 03:55:14"
                    //     },
                    //     {
                    //     name: "OnBuy.com UK",
                    //     country: "GB",
                    //     currency: "GBP",
                    //     currency_symbol: "£",
                    //     price: "120.00",
                    //     sale_price: "",
                    //     tax: [ ],
                    //     link: "https://www.onbuy.com/gb/tomtom-go-6000-europe-gps-navigation-system~c9493~p17636030/?condition=used&exta=cjunct&stat=eyJpcCI6IjEyMC4wMCIsImRwIjowLCJsaWQiOiIyMzIxMjE0MCIsInMiOiIyIiwidCI6MTU5MjExMDg5NiwiYm1jIjowfQ==",
                    //     item_group_id: "",
                    //     availability: "",
                    //     condition: "",
                    //     shipping: [ ],
                    //     last_update: "2021-06-22 02:34:24"
                    //     }
                    //     ],
                    //     reviews: [ ]
                    //     },
                    //     {
                    //     barcode_number: "613815594628",
                    //     barcode_formats: "UPC-A 613815594628, EAN-13 0613815594628",
                    //     mpn: "",
                    //     model: "",
                    //     asin: "B007BG0DPS",
                    //     title: "DNX5190 Automobile Audio/Video GPS Navigation System",
                    //     category: "Electronics > GPS Navigation Systems",
                    //     manufacturer: "Kenwood",
                    //     brand: "",
                    //     contributors: [ ],
                    //     age_group: "",
                    //     ingredients: "",
                    //     nutrition_facts: "",
                    //     energy_efficiency_class: "",
                    //     color: "",
                    //     gender: "",
                    //     material: "",
                    //     pattern: "",
                    //     format: "",
                    //     multipack: "",
                    //     size: "",
                    //     length: "",
                    //     width: "",
                    //     height: "",
                    //     weight: "",
                    //     release_date: "",
                    //     description: "",
                    //     features: [ ],
                    //     images: [
                    //     "https://images.barcodelookup.com/5492/54922199-1.jpg"
                    //     ],
                    //     last_update: "2021-06-22 03:50:46",
                    //     stores: [ ],
                    //     reviews: [ ]
                    //     }]
                    var data = {
                        product: $event.target.value,
                        page: $scope.pageNumber
                      }
                    APIService.get_searched_product(data, function (
                        result) {
                            console.log(result)
                        $scope.products = result.data.products;
                        if(result.data.products.length > 9){
                            $scope.searching = true;
                        }
                    }, function (response) {
                        buildfire.dialog.alert({
                            message: `Error ${response.statusText}`,
                        });
                    });
                }
                




                 
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

            $scope.view_product = function (product, index) {
                $scope.current_product = product;
                $scope.current_product_index = index;
                $scope.product_detail = true;
            }

            $scope.back_to_search = function () {
                $scope.product_detail = false;
            }

            WidgetSearch.setAppTheme = function () {
                buildfire.appearance.getAppTheme((err, obj) => {
                    let elements = document.getElementsByTagName('svg');
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].style.setProperty("fill", obj.colors.icons, "important");
                    }
                    WidgetSearch.appTheme = obj.colors;
                    WidgetSearch.loadedPlugin = true;
                });
            }

            Buildfire.datastore.onUpdate(function (response) {
                if (response.tag === "Social") {
                    WidgetSearch.setSettings(response);
                    setTimeout(function () {
                        if (!response.data.appSettings
                            .disableHomeText) {
                                                   }
                    }, 100);
                } else if (response.tag === "languages")
                    WidgetSearch.SocialItems.formatLanguages(response);
                $scope.languages = WidgetSearch.SocialItems.languages;
                console.log($scope.languages, WidgetSearch.SocialItems
                    .languages)

                $scope.$digest();
            });

            WidgetSearch.setSettings = function (settings) {
                // console.log("Set setting")
                WidgetSearch.SocialItems.appSettings = settings.data && settings
                    .data.appSettings ? settings.data.appSettings : {};
                if (WidgetSearch.SocialItems.appSettings &&
                    typeof WidgetSearch.SocialItems.appSettings.pinnedPost !==
                    'undefined') {
                    WidgetSearch.pinnedPost = WidgetSearch.SocialItems
                        .appSettings.pinnedPost;
                    pinnedPost.innerHTML = WidgetSearch.pinnedPost;
                    $scope.pinnedPost = pinnedPost.innerHTML;
                }
            }

           

            WidgetSearch.init = function () {
                WidgetSearch.SocialItems.getSettings((err, result) => {
                    if (err) return console.error("Fetching settings failed.", err);
                    if (result) {
                        WidgetSearch.SocialItems.items = [];
                        WidgetSearch.setSettings(result);
                        WidgetSearch.setAppTheme();
                        WidgetSearch.SocialItems.authenticateUser(null, (err, user) => {
                            if (err) return console.error("Getting user failed.", err);
                            if (user) {
                            } else {
                                WidgetSearch.groupFollowingStatus = false;
                            }
                        });
                    }
                });
            };

            WidgetSearch.init();
            WidgetSearch.formatLanguages = function (strings) {
                Object.keys(strings).forEach(e => {
                    strings[e].value ? WidgetWall.SocialItems.languages[e] = strings[e].value : WidgetWall.SocialItems.languages[e] = strings[e].defaultValue;
                });
            }
       

            $rootScope.$on('navigatedBack', function (event, error) {
                WidgetSearch.SocialItems.items = [];
                WidgetSearch.SocialItems.isPrivateChat = false;
                WidgetSearch.SocialItems.pageSize = 5;
                WidgetSearch.SocialItems.page = 0;
                WidgetSearch.SocialItems.wid = WidgetSearch.SocialItems.mainWallID;
                WidgetSearch.SocialItems.pluginTitle = '';
                WidgetSearch.init();
            });

            // On Login
            Buildfire.auth.onLogin(function (user) {
                console.log("NEW USER LOGGED IN", WidgetSearch.SocialItems.forcedToLogin)
                if (!WidgetSearch.SocialItems.forcedToLogin) {
                    WidgetSearch.SocialItems.authenticateUser(user, (err, userData) => {
                        if (err) return console.error("Getting user failed.", err);
                        if (userData) {
                            WidgetSearch.checkFollowingStatus();
                        }
                    });
                } else WidgetSearch.SocialItems.forcedToLogin = false;
                WidgetSearch.showUserLikes();
                if ($scope.$$phase) $scope.$digest();
            });
            
            // On Logout
            Buildfire.auth.onLogout(function () {
                console.log('User loggedOut from Page');
                buildfire.appearance.titlebar.show();
                WidgetSearch.SocialItems.userDetails = {};
                WidgetSearch.groupFollowingStatus = false;
                buildfire.notifications.pushNotification.unsubscribe(
                    {
                        groupName: WidgetSearch.SocialItems.wid === '' ?
                            WidgetSearch.SocialItems.context.instanceId : WidgetSearch.SocialItems.wid
                    }, () => { });
                WidgetSearch.privateChatSecurity();
                $scope.$digest();
            });

        }])
})(window.angular);
