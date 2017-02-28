var app = angular.module('myApp', []);

app.controller('customer',function($scope)
{
$scope.names = [
      { "Name" : "Vignesh Mohanraj", "City" : "Tirupur", "Country" : "India" ,"Phone" : "9789446286"},
      { "Name" : "Mohanraj Karuppusamy", "City" : "Erode", "Country" : "Indonasia", "Phone" : "9715456639" },
      { "Name" : "Thilagavathi Mohanraj", "City" : "Nammakal", "Country" : "Spain", "Phone" : "9788713369"},
      { "Name" : "Kalaiavani Mohanraj", "City" : "Erode", "Country" : "Denmark", "Phone" : "9586247598"},
      { "Name" : "Shiva Ranjini", "City" : "Tirupur", "Country" : "India", "Phone" : "9789625978"},
      { "Name" : "Santhose", "City" : "Kunnathur", "Country" : "Sweden", "Phone" : "9579523684"}
];
});