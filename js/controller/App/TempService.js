myApp.factory('DataStore', function() {
 var savedData = {}
 function set(data,type) {
   savedData[type] = data;
   //console.log(get(type));
 }
 function get(type) {
  return savedData[type];
 }

 return {
  set: set,
  get: get
 }

});