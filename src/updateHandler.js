var ipc = require("electron").ipcRenderer;

ipc.send("invokeAction", "someData");

ipc.once("new-update", function (event, response) {
  let msg = document.getElementById("msg");
  msg.innerHTML = "<span> Downloading Latest Version </span>";
});

ipc.once("checking", function (event, response) {
  let msg = document.getElementById("msg");

  msg.innerHTML = "<span> Checking For Updates </span>";
});

ipc.once("update-done", function (event, response) {
  let msg = document.getElementById("msg");
  msg.innerHTML = "<span> Installing </span>";
});

ipc.once("update", function (event, response) {
  let msg = document.getElementById("msg");
  msg.innerHTML = "<span> Updating </span>";
});

ipc.once("no-update", function (event, response) {
  let msg = document.getElementById("msg");
  msg.innerHTML = "<span> Launching Latest Version </span>";
});

ipc.once("error", function (event, response) {
  let msg = document.getElementById("msg");
  msg.innerHTML = "<span> Error </span>";
});
