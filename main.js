'use strict';

var app = angular.module('anomaliForm', []);


app.controller('mainController', function($scope, mainService, $http){
    /*fields must be entered.. if not entered ask user to fill in those fields
        validate email address
        if country selectd is US dd of states enabled
        password (1 uppercase, 1 lovercase 1 special char, at least 8 chars)
        validate phone number
     */

    //form is the model attached to the form
    $scope.form = {};
    $scope.stateDisabled = true;
    $scope.showError = false;
    $scope.stateRequired = false;

    $scope.industries = ['Health Care', 'Software', 'Real Estate', 'Retail'];

    $scope.selectedCountry = function(country){
        if((country.localeCompare('United States')) === 0){

            mainService.getStates().then(
                function success(data){
                    $scope.states = data;
                    $scope.stateDisabled = false;
                    $scope.stateRequired = true;
                },
                function error(error){
                    console.log(error);
                }
            );
        }
        else{
            $scope.stateDisabled = true;
            $scope.stateRequired = false;
        }
    };

    $scope.$watch('form.country', function(newVal, oldVal){
        if(newVal){
            $scope.selectedCountry(newVal.name);
        }
    });

    //get all the countries on page load
    (function getAllCountries(){
        mainService.getCountries().then(
            function success(data){
                $scope.countries = data;
            },
            function error(error){
                console.log(error);
            }
        );
    })();



})
app.service('mainService', function($http){
    function getCountries(){
       return  $http({
            method: 'GET',
            url: 'https://restcountries.eu/rest/v1/all'
        }).then(function successCallback(response) {
           return response.data;
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
           // called asynchronously if an error occurs
           // or server returns response with an error status.
            return response;

        });
    }
    function getStates(){
        return $http({
            method: 'GET',
            url:' http://services.groupkt.com/state/get/usa/all'
        }).then(function success(response) {
            return response.data.RestResponse.result;

        },
        function error(error){
            return error;
        });
    }

    return {
        getCountries: getCountries,
        getStates: getStates
    }
})






