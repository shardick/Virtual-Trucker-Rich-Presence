// EURO TRUCK SIMULATOR 2 - RICH PRESENCE
// Version 2.0 BETA
// Made by SgtBreadStick, Rein & Lasse
// Edited by Josh Menzel to work with ETCARS
// ETCARS plugin created by dowmeister, edited by Josh Menzel

const DiscordRPC = require('discord-rpc');
var ip = require("ip");
var ETCarsClient = require('etcars-node-client');
var fetch = require('node-fetch');
var util = require('util');
var etcars = new ETCarsClient();
const rpc = new DiscordRPC.Client({
	transport: 'ipc'
});
var mpCheckerInterval = 3 * 60 * 1000; // 1 minute
var mpInfo = null;
var lastData = null;

etcars.on('data', function (data) {
	if (!rpc) console.log("Couldn't find discord-rpc!");
	//use a try / catch as sometimes the data isn't there when first connecting...plus it's json parsing...
	try {
		lastData = data;
		if (typeof (data.telemetry) != 'undefined' && data.telemetry) {
			var activity = null;
			if (typeof data.telemetry.job != 'undefined' && data.telemetry.job && data.telemetry.job.onJob === true) {
				//Game Connected - Job (Driving)
				//console.log("Yeah! A job!");
				if (data.telemetry.truck.lights.lowBeam === true) {
					activity = {
						state: `${data.telemetry.job.sourceCity} to ${data.telemetry.job.destinationCity}`,
						details: `Driving at ${Math.round(data.telemetry.truck.speed * 2.23694)} mph`,
						smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - At ${Math.round(data.telemetry.truck.odometer * 0.621371)} Miles`,
						smallImageKey: `brand_${data.telemetry.truck.makeID}`,
						largeImageText: `Estimated Income: €${data.telemetry.job.income}`,
						largeImageKey: `ets2rpc_night`,
					}
				} else if (data.telemetry.truck.wipersOn === true) {
					activity = {
						state: `${data.telemetry.job.sourceCity} to ${data.telemetry.job.destinationCity}`,
						details: `Driving at ${Math.round(data.telemetry.truck.speed * 2.23694)} mph`,
						smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - At ${Math.round(data.telemetry.truck.odometer * 0.621371)} Miles`,
						smallImageKey: `brand_${data.telemetry.truck.makeID}`,
						largeImageText: `Estimated Income: €${data.telemetry.job.income}`,
						largeImageKey: `ets2rpc_rain`,
					};
				} else {
					activity = {
						state: `${data.telemetry.job.sourceCity} to ${data.telemetry.job.destinationCity}`,
						details: `Driving at ${Math.round(data.telemetry.truck.speed * 2.23694)} mph`,
						smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - At ${Math.round(data.telemetry.truck.odometer * 0.621371)} Miles`,
						smallImageKey: `brand_${data.telemetry.truck.makeID}`,
						largeImageText: `Estimated Income: €${data.telemetry.job.income}`,
						largeImageKey: `ets2rpc_day`,
					}
				}
			} else {
				//Game Connected - Driving
				//console.log("Game Connected - No Job");
				if (data.telemetry.truck.lights.lowBeam === true) {
					activity = {
						state: `Freeroaming`,
						details: `Driving at ${Math.round(data.telemetry.truck.speed * 2.23694)} mph`,
						smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - At ${Math.round(data.telemetry.truck.odometer * 0.621371)} Miles`,
						smallImageKey: `brand_${data.telemetry.truck.makeID}`,
						largeImageKey: `ets2rpc_night`,
					};
				} else if (data.telemetry.truck.wipersOn === true) {
					activity = {
						state: `Freeroaming`,
						details: `Driving at ${Math.round(data.telemetry.truck.speed * 2.23694)} mph`,
						smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - At ${Math.round(data.telemetry.truck.odometer * 0.621371)} Miles`,
						smallImageKey: `brand_${data.telemetry.truck.makeID}`,
						largeImageKey: `ets2rpc_rain`,
					};
				} else {
					activity = {
						state: `Freeroaming`,
						details: `Driving at ${Math.round(data.telemetry.truck.speed * 2.23694)} mph`,
						smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - At ${Math.round(data.telemetry.truck.odometer * 0.621371)} Miles`,
						smallImageKey: `brand_${data.telemetry.truck.makeID}`,
						largeImageKey: `ets2rpc_day`,
					};
				}
			}

			if (activity != null) {
				if (mpInfo != null && mpInfo.online && mpInfo.server) {
					//console.log('Adding Multiplayer info');
					activity.state += ' - online on ' + mpInfo.server.shortname;

					if (mpInfo.location) {
						activity.state += ' near ' + mpInfo.location.realName;
					}
				}

				rpc.setActivity(activity);
			}
		}
	} catch (error) {
		console.log(error);
	}
});

etcars.on('connect', function (data) {
	rpc.setActivity({
		details: `Game Started`,
		state: `Waiting for data...`,
		largeImageKey: `ets2rpc_idle`,
		largeImageText: `Version: 2.0 BETA`,
	});
});

etcars.on('error', function (data) {
	rpc.setActivity({
		details: `Plugin Error`,
		state: `Waiting for Game...`,
		largeImageKey: `ets2rpc_idle`,
		largeImageText: `Version: 2.0 BETA`,
	});
});

rpc.on('ready', () => {
	console.log(`Presence Starting. Don't forget to put node as currently playing in Discord settings.`);
	rpc.setActivity({
		details: `Game Not Started`,
		state: `Waiting for Game...`,
		largeImageKey: `ets2rpc_idle`,
		largeImageText: `Version: 2.0 BETA`,
	});

	if (process.env.NODE_ENV == 'development') {
		etcars.enableDebug = true;
	}

	etcars.connect();
});

function checkMpInfo() {

	if (lastData != null) {
		if (lastData.telemetry && lastData.telemetry.game && lastData.telemetry.game.isMultiplayer &&
			lastData.telemetry.user) {

			var url = util.format('https://api.truckyapp.com/v1/richpresence/playerInfo?query=%s', lastData.telemetry.user.steamID);

			//console.log(url);
			fetch(url).then((body) => {
				return body.json()
			}).then((json) => {

				if (!json.error) {
					var response = json.response;
					if (response.onlineState.online) {
						mpInfo = {
							online: true,
							location: response.onlineState.location.poi,
							server: response.onlineState.serverDetails
						};
					} else {
						mpInfo = {
							online: false
						}
					};
				} else {
					mpInfo = null;
				}
			});
		}
	}
}
setInterval(checkMpInfo, mpCheckerInterval);

rpc.login("426512878108016647").catch(console.error);