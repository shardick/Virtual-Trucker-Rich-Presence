// EURO TRUCK SIMULATOR 2 - RICH PRESENCE
// Version 2.0 BETA
// Made by SgtBreadStick, Rein & Lasse
// Edited by Josh Menzel to work with ETCARS
// ETCARS plugin created by dowmeister, edited by Josh Menzel

const DiscordRPC = require('discord-rpc');
var ip = require("ip");
var ETCarsClient = require('etcars-node-client');
var etcars = new ETCarsClient();
const rpc = new DiscordRPC.Client({
	transport: 'ipc'
});

etcars.on('data', function(data) {
	if (!rpc) console.log("Couldn't find discord-rpc!");
	//use a try / catch as sometimes the data isn't there when first connecting...plus it's json parsing...
		try{
			if(data.telemetry.trailerConnected === true) {
				//Game Connected - Job (Driving)
				//console.log("Yeah! A job!");
				if(data.telemetry.truck.lights.lowBeam === true) {
					rpc.setActivity({
						state: `Delivering from ${data.telemetry.job.sourceCity} to ${data.telemetry.job.destinationCity}`,
						details: `Driving at ${Math.round(data.telemetry.speed * 2.23694)} mph`,
						smallImageText: `${data.telemetry.make} ${data.telemetry.model} - At ${Math.round(data.telemetry.odometer)} Miles`,
						smallImageKey: `brand_${data.telemetry.truck.makeID}`,
						largeImageText: `Estimated Income: €${data.telemetry.income}`,
						largeImageKey: `ets2rpc_night`,
					});
				} else if(data.telemetry.truck.wipersOn === true) {
					rpc.setActivity({
						state: `Delivering from ${data.telemetry.job.sourceCity} to ${data.telemetry.job.destinationCity}`,
						details: `Driving at ${Math.round(data.telemetry.truck.speed * 2.23694)} mph`,
						smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - At ${Math.round(data.telemetry.truck.odometer)} Miles`,
						smallImageKey: `brand_${data.telemetry.truck.makeID}`,
						largeImageText: `Estimated Income: €${data.telemetry.job.income}`,
						largeImageKey: `ets2rpc_rain`,
					});
				} else {
					rpc.setActivity({
						state: `Delivering from ${data.truck.telemetry.job.sourceCity} to ${data.truck.telemetry.job.destinationCity}`,
						details: `Driving at ${Math.round(data.telemetry.speed * 2.23694)} mph`,
						smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - At ${Math.round(data.telemetry.truck.odometer)} Miles`,
						smallImageKey: `brand_${data.telemetry.truck.makeID}`,
						largeImageText: `Estimated Income: €${data.telemetry.job.income}`,
						largeImageKey: `ets2rpc_day`,
					});
				}
			} else {
				//Game Connected - Driving
				//console.log("Game Connected - No Job");
				if(data.telemetry.truck.lights.lowBeam === true) {
					rpc.setActivity({
						state: `Freeroaming`,
						details: `Driving at ${Math.round(data.telemetry.truck.speed * 2.23694)} mph`,
						smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - At ${Math.round(data.telemetry.truck.odometer)} Miles`,
						smallImageKey: `brand_${data.telemetry.truck.makeID}`,
						largeImageKey: `ets2rpc_night`,
					});
				} else if(data.telemetry.truck.wipersOn === true) {
					rpc.setActivity({
						state: `Freeroaming`,
						details: `Driving at ${Math.round(data.telemetry.truck.speed * 2.23694)} mph`,
						smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - At ${Math.round(data.telemetry.truck.odometer)} Miles`,
						smallImageKey: `brand_${data.telemetry.truck.makeID}`,
						largeImageKey: `ets2rpc_rain`,
					});
				} else {
					rpc.setActivity({
						state: `Freeroaming`,
						details: `Driving at ${Math.round(data.telemetry.truck.speed * 2.23694)} mph`,
						smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - At ${Math.round(data.telemetry.truck.odometer)} Miles`,
						smallImageKey: `brand_${data.telemetry.truck.makeID}`,
						largeImageKey: `ets2rpc_day`,
					});
				}
			}
		}
    catch(error)
    {
		console.log(error);
	}
});
 
etcars.on('connect', function(data) {
    rpc.setActivity({
		details: `Game Started`,
		state: `Waiting for data...`,
		largeImageKey: `ets2rpc_idle`,
		largeImageText: `Version: 2.0 BETA`,
	});
});
 
etcars.on('error', function(data) {
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
	etcars.connect();
});

rpc.login("426512878108016647").catch(console.error);
