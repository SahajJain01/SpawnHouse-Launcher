// eslint-disable-next-line no-undef
angular.module('app').controller('minecraftController', function ($scope, $http, gameManagerService) {
	$scope.statusId = 1;
	$scope.mumble = {};
	$scope.mumble.userName = 'User' + Math.floor(Math.random() * 999) + 1;
	$scope.mumble.checked = true;

	$scope.statusList = [
		'Error',
		'Not Installed',
		'Downloading',
		'Extracting',
		'Installing',
		'Installed',
		'Playable',
		'Starting Game',
		'Started',
		'Downloading Mumble',
		'Extracting Mumble',
		'Installing Mumble',
		'Mumble Installed',
		'Starting Mumble'
	];

	$scope.download = function () {
		$scope.statusId = 2;
		gameManagerService.downloadGame({'gameId': 1})
			.then(() => {
				$scope.statusId = 3;
				gameManagerService.extractGame({'gameId': 1})
					.then(() => {
						$scope.statusId = 4;
						gameManagerService.installGame({'gameId': 1})
							.then(() => {
								$scope.statusId = 5;
								isMinecraftInstalled();
							},(err) => {
								console.log(err);
							});
					},(err) => {
						console.log(err);
					});
			},(err) => {
				console.log(err);
			});
	};

	$scope.play = function () {
		if($scope.mumble.checked) {
			gameManagerService.isGameInstalled({'gameId': 0})
				.then(() => {
					$scope.statusId = 13;
					gameManagerService.playGame({
						'gameId': 0,
						'params': {
							'gameId': 1,
							'userName': $scope.mumble.userName
						}
					})
						.then(() => {
							$scope.statusId = 7;
							gameManagerService.playGame({'gameId': 1})
								.then(() => {
									$scope.statusId = 8;
								},(err) => {
									console.log(err);
								});
						},(err) => {
							if(err.status == 400) {
								console.log(err);
							}
						});
				},(err) => {
					if(err.status == 400) {
						console.log(err);
					} else if (err.status == 500) {
						$scope.statusId = 9;
						gameManagerService.downloadGame({'gameId': 0})
							.then(() => {
								$scope.statusId = 10;
								gameManagerService.extractGame({'gameId': 0})
									.then(() => {
										$scope.statusId = 11;
										gameManagerService.installGame({'gameId': 0})
											.then(() => {
												$scope.statusId = 5;
												gameManagerService.isGameInstalled({'gameId': 0})
													.then(() => {
														$scope.statusId = 13;
														gameManagerService.playGame({
															'gameId': 0,
															'params': {
																'gameId': 1,
																'userName': $scope.mumble.userName
															}
														})
															.then(() => {
																$scope.statusId = 7;
																gameManagerService.playGame({'gameId': 1})
																	.then(() => {
																		$scope.statusId = 8;
																	},(err) => {
																		console.log(err);
																	});
															},(err) => {
																if(err.status == 400) {
																	console.log(err);
																}
															});
													},(err) => {
														if(err.status == 400) {
															console.log(err);
														}
													});
											},(err) => {
												console.log(err);
											});
									},(err) => {
										console.log(err);
									});
							},(err) => {
								console.log(err);
							});
					}
				});
		}
		else {
			$scope.statusId = 7;
			gameManagerService.playGame({'gameId': 1})
				.then(() => {
					$scope.statusId = 8;
				},(err) => {
					console.log(err);
				});
		}
	};

	function fetchStats() {
		$http
			.get('https://plan.sain.host/v1/serverOverview?server=de07eaca-346a-4c3b-ae62-8a75004da1f9')
			.then(function (response) {
				$scope.game = response.data;
			});
	}

	function isMinecraftInstalled() {
		gameManagerService.isGameInstalled({'gameId': 1})
			.then(() => {
				$scope.statusId = 6;
			},(err) => {
				if(err.status == 400) {
					console.log(err);
				}
			});
	}

	fetchStats();
	isMinecraftInstalled();
});