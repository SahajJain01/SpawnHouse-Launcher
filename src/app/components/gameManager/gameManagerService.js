// eslint-disable-next-line no-undef
angular.module('app').service('gameManagerService', function($q) {
	this.downloadGame = function(args) {
		var q = $q.defer();
		window.api.receive('downloadGameRes', (res) => {
			if (res.status == 200)
				q.resolve(res);
			else 
				q.reject(res);
		});
		window.api.send('downloadGameReq', args);
		return q.promise;
	};

	this.extractGame = function(args) {
		var q = $q.defer();
		window.api.receive('extractGameRes', (res) => {
			if (res.status == 200)
				q.resolve(res);
			else 
				q.reject(res);
		});
		window.api.send('extractGameReq', args);
		return q.promise;
	};

	this.installGame = function(args) {
		var q = $q.defer();
		window.api.receive('installGameRes', (res) => {
			if (res.status == 200)
				q.resolve(res);
			else 
				q.reject(res);
		});
		window.api.send('installGameReq', args);
		return q.promise;
	};

	this.playGame = function(args) {
		var q = $q.defer();
		window.api.receive('playGameRes', (res) => {
			if (res.status == 200)
				q.resolve(res);
			else 
				q.reject(res);
		});
		window.api.send('playGameReq', args);
		return q.promise;
	};

	this.isGameInstalled = function(args) {
		var q = $q.defer();
		window.api.receive('isGameInstalledRes', (res) => {
			if (res.status == 200)
				q.resolve(res);
			else 
				q.reject(res);
		});
		window.api.send('isGameInstalledReq', args);
		return q.promise;
	};
}); 