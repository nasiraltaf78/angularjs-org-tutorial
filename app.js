// Define the 'phonecatApp' module
angular.module('phonecatApp', ['ngRoute', 'ngAnimate', 'core', 'phoneList', 'phoneDetail']);


// App config/routing
angular.module('phonecatApp').config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {

        $routeProvider.
            when('/phones', {
                template: '<phone-list></phone-list>'
            }).
            when('/phones/:phoneId', {
                template: '<phone-detail></phone-detail>'
            }).
            otherwise('/phones');
    }
]);


// Core module ... GETS JSON
angular.module('core.phone', ['ngResource']);

// Core service called 'Phone', anon function returns 'phones.json' if no ID present else specific phone JSON in phones directory
angular.module('core.phone').factory('Phone', ['$resource', function ($resource) {
    return $resource('phones/:phoneId.json', {
        query: {
            method: 'GET',
            params: { phoneId: 'phones' },
            isArray: true
        }
    });
}]);


// phoneList module  ...'core.phone' injected as a dependancy for this module
angular.module('phoneList', ['core.phone']);

// phoneList component
angular.module('phoneList').component('phoneList', {
    templateUrl: 'phonelist.template.html',
    controller: ['Phone', function PhoneListController(Phone) {
        this.phones = Phone.query();
        this.orderProp = 'age';
    }]
});


// phoneDetail module  ...'core.phone' injected as a dependancy for this module
angular.module('phoneDetail', ['ngRoute', 'core.phone']);

// phoneDetail component
angular.module('phoneDetail').component('phoneDetail', {
    templateUrl: 'phonedetail.template.html',
    controller: ['$routeParams', 'Phone', function PhoneDetailController($routeParams, Phone) {
        var self = this;

        // Get phone ID passed in by service
        self.phone = Phone.get({ phoneId: $routeParams.phoneId }, function (phone) {

            // Set default image by extracting from specfic phones JSON
            self.setImage(phone.images[0]);
        });

        // Function to set the main image to whatever image url is passed to it
        self.setImage = function setImage(imageUrl) {
            self.mainImageUrl = imageUrl;
        };
    }]
});


// Custom filter to add a tick or cross if the phone has a certain feature or not
angular.module('core', []);
angular.module('core').filter('checkmark', function () {
    return function (input) {
        return input ? '\u2713' : '\u2718';
    };
});