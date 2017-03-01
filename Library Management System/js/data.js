var app = angular.module('myApp', []);

app.controller('books',function($scope)
{
$scope.names = [
    { "Book ID" : "BID00001", "ISBN" : "81-219-2041", "Title" : "Programming in C#" , "Availability" : "Available" ,"Author" : "Vignesh Mohanraj", "Edition" : "1st", "Add Date" : "2017-01-24"},
    
    { "Book ID" : "BID00002", "ISBN" : "82-209-2030", "Title" : "Harry Potter" , "Availability" : "Unavailable" ,"Author" : "William", "Edition" : "3rd", "Add Date" : "2017-03-24"},
    
    { "Book ID" : "BID00003", "ISBN" : "88-209-1999", "Title" : "The Lord of War" , "Availability" : "Available" ,"Author" : "Geetha", "Edition" : "6th", "Add Date" : "2017-01-26"},
    
    { "Book ID" : "BID00004", "ISBN" : "80-222-3352", "Title" : "Accountancy" , "Availability" : "UnAvailable" ,"Author" : "Ravi", "Edition" : "9th", "Add Date" : "2015-01-16"},
    
    { "Book ID" : "BID00005", "ISBN" : "69-325-5528", "Title" : "Grammer" , "Availability" : "Available" ,"Author" : "Siranjeevi raja", "Edition" : "3rd", "Add Date" : "2018-06-18"},
];
});