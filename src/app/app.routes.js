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
    .state("home.library", {
      url: "/home/library",
      templateUrl: "app/components/library/libraryView.html",
    })
    .state("home.minecraft", {
      url: "/home/minecraft",
      templateUrl: "app/components/minecraft/minecraftView.html",
      controller: "minecraftController",
    })
    .state("home.valheim", {
      url: "/home/valheim",
      templateUrl: "app/components/valheim/valheimView.html",
      controller: "valheimController",
    });
});
