//#region Requires
/* eslint-disable no-unused-vars */
const { app, BrowserWindow, ipcMain, autoUpdater } = require('electron');
const path = require('path');
const request = require('superagent');
const fs = require('fs');
const admZip = require('adm-zip');
const { exec } = require('child_process');
const execFile = require('child_process').execFile;
const regedit = require('regedit');
const { ok } = require('assert');
//#endregion Requires

//#region Global variables and constants
const updateServer = 'https://appupdate.spawnhouse.com';
const url = `${updateServer}/update/${process.platform}/${app.getVersion()}`;
autoUpdater.setFeedURL({ url });

const gameList = [
	{
		id: 0,
		name: 'Mumble',
		feedUrl:
      'https://github.com/SpawnHouse/MumblePortable/releases/latest/download/Mumble.zip',
		customParams: {
			serverUrl: 'mumble.spawnhouse.com',
		},
	},
	{
		id: 1,
		name: 'Minecraft',
		feedUrl:
      'https://github.com/SpawnHouse/Minecraft/releases/latest/download/Minecraft.zip',
		customParams: {
			minecraftPath: process.env.APPDATA + '/.minecraft',
			tlauncherPath: process.env.APPDATA + '/.tlauncher',
		},
	},
	{
		id: 2,
		name: 'Valheim',
		feedUrl:
      'https://github.com/SpawnHouse/Valheim-ModPack/releases/latest/download/Valheim.zip',
		customParams: {
			serverUrl: 'v.sain.host:2458',
		},
	},
];
//#endregion Global variables and constants

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	// eslint-disable-line global-require
	app.quit();
}

//#region BrowserWindows
// be closed automatically when the JavaScript object is garbage collected.
let appWindow;
let updateWindow;

const createAppWindow = () => {
	appWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		minWidth: 1280,
		minHeight: 720,
		frame: false,
		webPreferences: {
			contextIsolation: true, // protect against prototype pollution
			enableRemoteModule: false, // turn off remote
			preload: path.join(__dirname, 'appPreload.js'), // use a preload script
			devTools: false,
			backgroundColor: '#1c1c1c',
		},
	});
	appWindow.setMenu(null), appWindow.loadFile(path.join(__dirname, 'app.html'));
	//appWindow.webContents.openDevTools();
};
const createUpdateWindow = () => {
	// Create the browser window.
	updateWindow = new BrowserWindow({
		width: 480,
		height: 640,
		contextIsolation: true, // protect against prototype pollution
		enableRemoteModule: false, // turn off remote
		titleBarStyle: 'hidden',
		frame: false,
		backgroundColor: '#1c1c1c',
		webPreferences: {
			devTools: false,
			preload: path.join(__dirname, 'updatePreload.js'),
		},
	});
	updateWindow.setMenu(null),
	updateWindow.loadFile(path.join(__dirname, 'update.html'));
	//updateWindow.webContents.openDevTools();

	autoUpdater.checkForUpdates();
};
//#endregion BroswerWindows

//#region App Listeners
app.on('ready', createUpdateWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createAppWindow();
	}
});
//#endregion App Listeners

//#region Autoupdater
autoUpdater.on('checking-for-update', () => {
	ipcMain.on('invokeAction', function (event, data) {
		event.sender.send('checking', data);
	});
});

autoUpdater.on('update-available', () => {
	ipcMain.on('invokeAction', function (event, data) {
		event.sender.send('update', data);
	});
});

autoUpdater.on('update-not-available', () => {
	ipcMain.on('invokeAction', function (event, data) {
		event.sender.send('no-update', data);
	});

	createAppWindow();
	updateWindow.close();
});

autoUpdater.on('error', () => {
	ipcMain.on('invokeAction', function (event, data) {
		event.sender.send('error', data);
	});

	setTimeout(() => {
		createAppWindow();
		updateWindow.close();
	}, 500);
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
	ipcMain.on('invokeAction', function (event, data) {
		event.sender.send('update-done', data);
	});

	autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (message) => {
	console.error('There was a problem updating the application');
	// console.error(message)
});
//#endregion Autoupdater

//#region IPC Listeners

ipcMain.on('appQuitReq', (event, args) => {
	event.reply('appQuitRes', 'data');
	appWindow.close();
});

ipcMain.on('appMinimiseReq', (event, args) => {
	event.reply('appMinimiseRes', 'data');
	appWindow.minimize();
});

ipcMain.on('appMaximiseReq', (event, args) => {
	event.reply('appMinimiseRes', 'data');

	appWindow.isMaximized() ? appWindow.unmaximize() : appWindow.maximize();
});

ipcMain.on('downloadGameReq', (event, args) => {
	request
		.get(gameList[args.gameId].feedUrl)
		.on('error', function (error) {
			event.reply('downloadGameRes', {
				status: 500,
				data: error,
			});
		})
		.pipe(fs.createWriteStream(gameList[args.gameId].name + '.zip'))
		.on('finish', function (data) {
			event.reply('downloadGameRes', {
				status: 200,
				data: data,
			});
		});
});

ipcMain.on('extractGameReq', (event, args) => {
	var zip = new admZip(gameList[args.gameId].name + '.zip');
	zip.extractAllToAsync('./' + gameList[args.gameId].name, true, (error) => {
		if (error) {
			event.reply('extractGameRes', {
				status: 500,
				data: error,
			});
		} else {
			event.reply('extractGameRes', {
				status: 200,
				data: 'ok',
			});
		}
	});
});

ipcMain.on('installGameReq', (event, args) => {
	switch (args.gameId) {
	case 0:
		event.reply('installGameRes', installMumble());
		break;

	case 1:
		event.reply('installGameRes', installMinecraft());
		break;

	case 2:
		event.reply('installGameRes', installValheim());
		break;

	default:
		event.reply('installGameRes', {
			status: 400,
			data: 'Invalid gameId',
		});
	}
});

ipcMain.on('playGameReq', (event, args) => {
	switch (args.gameId) {
	case 0:
		event.reply('playGameRes', playMumble(args.params));
		break;

	case 1:
		event.reply('playGameRes', playMinecraft());
		break;

	case 2:
		event.reply('playGameRes', playValheim());
		break;

	default:
		event.reply('playGameRes', {
			status: 400,
			data: 'Invalid args',
		});
	}
});

ipcMain.on('isGameInstalledReq', (event, args) => {
	switch (args.gameId) {
	case 0:
		event.reply('isGameInstalledRes', isMumbleInstalled());
		break;

	case 1:
		event.reply('isGameInstalledRes', isMinecraftInstalled());
		break;

	case 2:
		event.reply('isGameInstalledRes', isValheimInstalled());
		break;

	default:
		event.reply('isGameInstalledRes', {
			status: 400,
			data: 'Invalid gameId',
		});
	}
});
//#endregion IPC Listeners

//#region Install methods
function installMumble() {
	regedit.createKey(
		[
			'HKCU\\SOFTWARE\\Mumble',
			'HKCU\\SOFTWARE\\Mumble\\Mumble',
			'HKCU\\SOFTWARE\\Mumble\\Mumble\\audio',
		],
		function (err) {
			if (err) {
				return {
					status: 500,
					data: err,
				};
			}
		}
	);

	regedit.putValue(
		{
			'HKCU\\SOFTWARE\\Mumble\\Mumble': {
				lastupdate: {
					type: 'REG_DWORD',
					value: 2,
				},
			},
		},
		function (err) {
			if (err) {
				return {
					status: 500,
					data: err,
				};
			}
		}
	);
	regedit.putValue(
		{
			'HKCU\\SOFTWARE\\Mumble\\Mumble\\audio': {
				vadsource: {
					type: 'REG_DWORD',
					value: 1,
				},
				vadmin: {
					type: 'REG_BINARY',
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
					type: 'REG_BINARY',
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
					type: 'REG_BINARY',
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
					type: 'REG_BINARY',
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
					type: 'REG_SZ',
					value: 'false',
				},
				headphone: {
					type: 'REG_SZ',
					value: 'true',
				},
				input: {
					type: 'REG_SZ',
					value: 'WASAPI',
				},
				output: {
					type: 'REG_SZ',
					value: 'WASAPI',
				},
				postransmit: {
					type: 'REG_SZ',
					value: 'true',
				},
			},
		},
		function (err) {
			if (err) {
				return {
					status: 500,
					data: err,
				};
			}
		}
	);
	return {
		status: 200,
		data: 'ok',
	};
}

function installMinecraft() {
	if (!fs.existsSync(gameList[1].customParams.minecraftPath)) {
		fs.mkdirSync(gameList[1].customParams.minecraftPath);
	}
	if (!fs.existsSync(gameList[1].customParams.tlauncherPath)) {
		fs.mkdirSync(gameList[1].customParams.tlauncherPath);
	}
	if (!fs.existsSync(gameList[1].customParams.minecraftPath + '/mods')) {
		fs.mkdirSync(gameList[1].customParams.minecraftPath + '/mods');
	}
	fs.copyFile(
		'./' + gameList[1].name + '/mumblelink.jar',
		gameList[1].customParams.minecraftPath + '/mods/mumblelink.jar',
		(err) => {
			if (err) {
				return {
					status: 500,
					data: err,
				};
			}
		}
	);
	fs.copyFile(
		'./' + gameList[1].name + 'tlauncher-2.0.properties',
		gameList[1].customParams.tlauncherPath + '/tlauncher-2.0.properties',
		(err) => {
			if (err) {
				return {
					status: 500,
					data: err,
				};
			}
		}
	);
	return {
		status: 200,
		data: 'ok',
	};
}

function installValheim() {
	return {
		status: 200,
		data: 'ok',
	};
}

//#endregion Install methods

//#region Play methods
function playMumble(params) {
	exec(
		process.cwd() +
      '/' +
      gameList[0].name +
      '/mumble.exe mumble://' +
      params.userName +
      '@' +
      gameList[0].customParams.serverUrl +
      '/' +
      gameList[params.gameId].name,
		function (err) {
			if (err) {
				console.log(err);
			}
		}
	);
	return {
		status: 200,
		data: 'ok',
	};
}

function playMinecraft() {
	execFile('./' + gameList[1].name + '/TLauncher.exe', function (err, data) {
		if (err) {
			console.log(err);
		}
	});
	return {
		status: 200,
		data: 'ok',
	};
}

function playValheim() {
	execFile(
		'./' + gameList[2].name + '/valheim.exe',
		['+connect', gameList[2].customParams.serverUrl],
		function (err, data) {
			if (err) {
				return {
					status: 500,
					data: err,
				};
			}
		}
	);
	return {
		status: 200,
		data: 'ok',
	};
}
//#endregion Play methods

//#region Game Installed methods
function isMumbleInstalled() {
	if (fs.existsSync('./' + gameList[0].name + '/mumble.exe')) {
		return {
			status: 200,
			data: 'ok',
		};
	} else {
		return {
			status: 500,
			data: 'err',
		};
	}
}

function isMinecraftInstalled() {
	if (
		fs.existsSync(
			gameList[1].customParams.minecraftPath + '/mods/mumblelink.jar'
		) &&
    fs.existsSync(
    	gameList[1].customParams.tlauncherPath + '/tlauncher-2.0.properties'
    ) &&
    fs.existsSync('./' + gameList[1].name + '/TLauncher.exe')
	) {
		return {
			status: 200,
			data: 'ok',
		};
	} else {
		return {
			status: 500,
			data: 'err',
		};
	}
}

function isValheimInstalled() {
	if (fs.existsSync('./' + gameList[2].name + '/valheim.exe')) {
		return {
			status: 200,
			data: 'ok',
		};
	} else {
		return {
			status: 500,
			data: 'err',
		};
	}
}
//#endregion Game Installed Methods
