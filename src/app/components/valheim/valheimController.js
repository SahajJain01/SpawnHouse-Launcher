// eslint-disable-next-line no-undef
angular
	.module('app')
	.controller('valheimController', function ($scope, gameManagerService) {
		$scope.statusId = 1;
		$scope.mumble = {};
		$scope.mumble.userName = 'User' + Math.floor(Math.random() * 999) + 1;
		$scope.mumble.checked = true;

		$scope.statusList = [
			'Error',
			'Download',
			'Downloading',
			'Extracting',
			'Installing',
			'Installed',
			'Play',
			'Launching',
			'Playing Now',
			'Downloading Mumble',
			'Extracting Mumble',
			'Installing Mumble',
			'Mumble Installed',
			'Starting Mumble',
		];

		$scope.download = function () {
			$scope.statusId = 2;
			gameManagerService.downloadGame({ gameId: 2 }).then(
				() => {
					$scope.statusId = 3;
					gameManagerService.extractGame({ gameId: 2 }).then(
						() => {
							$scope.statusId = 4;
							gameManagerService.installGame({ gameId: 2 }).then(
								() => {
									$scope.statusId = 5;
									isValheimInstalled();
								},
								(err) => {
									console.log(err);
								}
							);
						},
						(err) => {
							console.log(err);
						}
					);
				},
				(err) => {
					console.log(err);
				}
			);
		};

		$scope.play = function () {
			if ($scope.mumble.checked) {
				gameManagerService.isGameInstalled({ gameId: 0 }).then(
					() => {
						$scope.statusId = 13;
						gameManagerService
							.playGame({
								gameId: 0,
								params: {
									gameId: 2,
									userName: $scope.mumble.userName,
								},
							})
							.then(
								() => {
									$scope.statusId = 7;
									gameManagerService.playGame({ gameId: 2 }).then(
										() => {
											$scope.statusId = 8;
										},
										(err) => {
											console.log(err);
										}
									);
								},
								(err) => {
									if (err.status == 400) {
										console.log(err);
									}
								}
							);
					},
					(err) => {
						if (err.status == 400) {
							console.log(err);
						} else if (err.status == 500) {
							$scope.statusId = 9;
							gameManagerService.downloadGame({ gameId: 0 }).then(
								() => {
									$scope.statusId = 10;
									gameManagerService.extractGame({ gameId: 0 }).then(
										() => {
											$scope.statusId = 11;
											gameManagerService.installGame({ gameId: 0 }).then(
												() => {
													$scope.statusId = 5;
													gameManagerService
														.isGameInstalled({ gameId: 0 })
														.then(
															() => {
																$scope.statusId = 13;
																gameManagerService
																	.playGame({
																		gameId: 0,
																		params: {
																			gameId: 2,
																			userName: $scope.mumble.userName,
																		},
																	})
																	.then(
																		() => {
																			$scope.statusId = 7;
																			gameManagerService
																				.playGame({ gameId: 2 })
																				.then(
																					() => {
																						$scope.statusId = 8;
																					},
																					(err) => {
																						console.log(err);
																					}
																				);
																		},
																		(err) => {
																			if (err.status == 400) {
																				console.log(err);
																			}
																		}
																	);
															},
															(err) => {
																if (err.status == 500) {
																	$scope.statusId = 6;
																	console.log(err);
																}
															}
														);
												},
												(err) => {
													console.log(err);
												}
											);
										},
										(err) => {
											console.log(err);
										}
									);
								},
								(err) => {
									console.log(err);
								}
							);
						}
					}
				);
			} else {
				$scope.statusId = 7;
				gameManagerService.playGame({ gameId: 2 }).then(
					() => {
						$scope.statusId = 8;
					},
					(err) => {
						console.log(err);
					}
				);
			}
		};

		function isValheimInstalled() {
			gameManagerService.isGameInstalled({ gameId: 2 }).then(
				() => {
					$scope.statusId = 6;
				},
				(err) => {
					if (err.status == 400) {
						console.log(err);
					}
				}
			);
		}

		isValheimInstalled();
	});
