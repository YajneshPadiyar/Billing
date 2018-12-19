myApp.factory("Data", ['$http', 'toaster', '$q',
		function ($http, toaster, $q) { // This service connects to our REST API

			//console.log(Constant);
			var serviceBase = "php/application/";

			var obj = {};
			obj.toast = function (data) {
				toaster.pop(data.status, "", data.message, 3000, 'trustedHtml');
			}
			obj.toast2 = function (type, message) {
				var config = {
					body:message,
					type:type,
					title:"",
					timeout:3000,
					bodyOutputType:'trustedHtml'
					};
				//toaster.pop(type, "", message, 3000, 'trustedHtml');
				toaster.pop(config);
			}
			obj.get = function (q) {
				return $http.get(serviceBase + q).then(function (results) {
					return results.data;
				});
			};
			obj.post = function (q, object) {
				return $http.post(serviceBase + q, object).then(function (results) {
					//console.log(results.data);
					return results.data;
				});
			};
			obj.uploadImg = function (q, object,config) {
				return $http.post(serviceBase + q, object,config).then(function (results) {
					//console.log(results.data);
					return results.data;
				});
			};
			obj.put = function (q, object) {
				return $http.put(serviceBase + q, object).then(function (results) {
					return results.data;
				});
			};
			obj.delete  = function (q) {
				return $http.delete (serviceBase + q).then(function (results) {
					return results.data;
				});
			};
			obj.getData = function (url) {
				var data = "";
				var deferred = $q.defer();

				$http.get(serviceBase + url)
				.success(function (response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function (errResp) {
					deferred.reject({
						message : "Really bad"
					});
				});
				console.log(deferred.promise);
				return deferred.promise;
			}

			return obj;
		}
	]);
