const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const request = require("superagent");
const fs = require("fs");
const admZip = require("adm-zip");
const execFile = require("child_process").execFile;
const regedit = require("regedit");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"), // use a preload script
      devTools: true,
      titleBarStyle: "hidden",
      frame: false,
      backgroundColor: "#1c1c1c",
    },
  });

  mainWindow.setMenu(null),
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function downloadExtractRegisterMumble() {
  request
    .get(
      "https://github.com/SpawnHouse/MumblePortable/releases/latest/download/MumblePortable.zip"
    )
    .on("error", function (error) {
      console.log(error);
    })
    .pipe(fs.createWriteStream("MumblePortable.zip"))
    .on("finish", function () {
      var zip = new admZip("MumblePortable.zip");
      zip.extractAllTo("./MumblePortable", true);
    });

  regedit.createKey(
    [
      "HKCU\\SOFTWARE\\Mumble",
      "HKCU\\SOFTWARE\\Mumble\\Mumble",
      "HKCU\\SOFTWARE\\Mumble\\Mumble\\audio",
    ],
    function (err) {
      console.log(err);
    }
  );

  regedit.putValue(
    {
      "HKCU\\SOFTWARE\\Mumble\\Mumble": {
        lastupdate: {
          type: "REG_DWORD",
          value: 2,
        },
      },
    },
    function (err) {
      console.log(err);
    }
  );
  regedit.putValue(
    {
      "HKCU\\SOFTWARE\\Mumble\\Mumble\\audio": {
        vadsource: {
          type: "REG_DWORD",
          value: 1,
        },
        vadmin: {
          type: "REG_BINARY",
          value: [
            64,
            0,
            86,
            0,
            97,
            0,
            114,
            0,
            105,
            0,
            97,
            0,
            110,
            0,
            116,
            0,
            40,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            135,
            0,
            63,
            0,
            76,
            0,
            205,
            0,
            154,
            0,
            41,
            0,
          ],
        },
        vadmax: {
          type: "REG_BINARY",
          value: [
            64,
            0,
            86,
            0,
            97,
            0,
            114,
            0,
            105,
            0,
            97,
            0,
            110,
            0,
            116,
            0,
            40,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            135,
            0,
            63,
            0,
            122,
            0,
            225,
            0,
            246,
            0,
            41,
            0,
          ],
        },
        maxdistance: {
          type: "REG_BINARY",
          value: [
            64,
            0,
            86,
            0,
            97,
            0,
            114,
            0,
            105,
            0,
            97,
            0,
            110,
            0,
            116,
            0,
            40,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            135,
            0,
            66,
            0,
            200,
            0,
            0,
            0,
            0,
            0,
            41,
            0,
          ],
        },
        maxdistancevolume: {
          type: "REG_BINARY",
          value: [
            64,
            0,
            86,
            0,
            97,
            0,
            114,
            0,
            105,
            0,
            97,
            0,
            110,
            0,
            116,
            0,
            40,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            135,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            41,
            0,
          ],
        },
        echomulti: {
          type: "REG_SZ",
          value: "false",
        },
        headphone: {
          type: "REG_SZ",
          value: "true",
        },
        input: {
          type: "REG_SZ",
          value: "WASAPI",
        },
        output: {
          type: "REG_SZ",
          value: "WASAPI",
        },
        postransmit: {
          type: "REG_SZ",
          value: "true",
        },
      },
    },
    function (err) {
      console.log(err);
    }
  );
}

ipcMain.on("toMainInstall", (event, args) => {
  request
    .get(
      "https://github.com/SpawnHouse/Valheim-ModPack/releases/latest/download/Valheim.zip"
    )
    .on("error", function (error) {
      console.log(error);
    })
    .pipe(fs.createWriteStream("valheim.zip"))
    .on("finish", function () {
      console.log("finished downloading");
      var zip = new admZip("valheim.zip");
      console.log("start unzip");
      zip.extractAllTo("./valheim", true);
      console.log("finished unzip");
      execFile(
        "./valheim/valheim.exe",
        ["+connect", "v.sain.host:2458"],
        function (err, data) {
          console.log(err);
          console.log(data.toString());
        }
      );
    });
  mainWindow.webContents.send("fromMainInstall", { status: "ok" });
});

ipcMain.on("downloadExtractRegisterMumbleRequest", (event, args) => {
  mainWindow.webContents.send("downloadExtractRegisterMumbleResponse", {
    status: "ok",
  });
});

ipcMain.on("downloadExtractMinecraftLatestRequest", (event, args) => {
  request
    .get(
      "https://github.com/SpawnHouse/Minecraft/releases/latest/download/Minecraft.zip"
    )
    .on("error", function (error) {
      console.log(error);
    })
    .pipe(fs.createWriteStream("Minecraft.zip"))
    .on("finish", function () {
      var zip = new admZip("Minecraft.zip");
      zip.extractAllTo("./Minecraft", true);
      if (!fs.existsSync(process.env.APPDATA + "/.minecraft")) {
        fs.mkdirSync(process.env.APPDATA + "/.minecraft");
      }
      if (!fs.existsSync(process.env.APPDATA + "/.tlauncher")) {
        fs.mkdirSync(process.env.APPDATA + "/.tlauncher");
      }
      if (!fs.existsSync(process.env.APPDATA + "/.minecraft/mods")) {
        fs.mkdirSync(process.env.APPDATA + "/.minecraft/mods");
      }
      fs.copyFile(
        "./Minecraft/mumblelink-1.16.5-4.6.3.jar",
        process.env.APPDATA + "/.minecraft/mods/mumblelink-1.16.5-4.6.3.jar",
        (err) => {
          if (err) {
            console.log("Error Found:", err);
          }
        }
      );
      fs.copyFile(
        "./Minecraft/tlauncher-2.0.properties",
        process.env.APPDATA + "/.tlauncher/tlauncher-2.0.properties",
        (err) => {
          if (err) {
            console.log("Error Found:", err);
          }
        }
      );
    });
  downloadExtractRegisterMumble();
  mainWindow.webContents.send("downloadExtractMinecraftLatestResponse", {
    status: "ok",
  });
});

ipcMain.on("launchMinecraftMumbleRequest", (event, args) => {
  execFile("./Minecraft/TLauncher.exe", function (err, data) {
    console.log(err);
    console.log(data.toString());
  });
  require("child_process").exec(
    process.cwd() +
      "/MumblePortable/mumble.exe mumble://mumble.spawnhouse.com/Minecraft",
    function (err) {
      console.log(err);
    }
  );
  mainWindow.webContents.send("launchMinecraftMumbleResponse", {
    status: "ok",
  });
});
