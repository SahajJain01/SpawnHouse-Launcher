angular.module("app").config(function ($stateProvider) {
  $stateProvider
    .state("splash", {
      url: "/",
      templateUrl: "app/components/splash/splashView.html",
      controller: "splashController",
    })
    .state("home", {
      url: "/home",
      templateUrl: "app/components/home/homeView.html",
    })
    .state("minecraft", {
      url: "/minecraft",
      templateUrl: "app/components/minecraft/minecraftView.html",
      controller: "minecraftController",
    })
    .state("valheim", {
      url: "/valheim",
      templateUrl: "app/components/valheim/valheimView.html",
      controller: "valheimController",
    });
});
