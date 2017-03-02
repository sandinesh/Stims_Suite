var app = angular.module('myApp', []);

app.controller('DetailController',['$scope',function($scope){
$scope.details = [
{
"Reg_No" : "13IT001",
"Name" : "Dhanushya.P",
"Department" : "B.TECH_IT",
"Photo" : "Photos/1.jpg"

},
{
"Reg_No" : "13IT002",
"Name" : "Dharani.AR",
"Department" : "B.TECH_IT",
"Photo" : "Photos/2.jpg",
"color": "#d98cb3"},
{
"Reg_No" : "13IT003",
"Name" : "Dharani.P",
"Department" : "B.TECH_IT",
"Photo" : "Photos/3.jpg"

},
{
"Reg_No" : "13IT004",
"Name" : "Dhivya.S",
"Department" : "B.TECH_IT",
"Photo" : "Photos/4.jpg",

},
{
"Reg_No" : "13IT005",
"Name" : "Guga Priya",
"Department" : "B.TECH_IT",
"Photo" : "Photos/5.jpg"
},
{
"Reg_No" : "13IT006",
"Name" : "Hema latha",
"Department" : "B.TECH_IT",
"Photo" : "Photos/6.jpg"
}
];
}]);