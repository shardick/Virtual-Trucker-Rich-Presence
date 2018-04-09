// EURO TRUCK SIMULATOR 2 - RICH PRESENCE
// Version 1.1
// Made by SgtBreadStick, Rein & Lasse
// Edited by Josh Menzel to work with ETCARS
// ETCARS plgugin created by dowmeister, edited by Josh Menzel

//const http = require("http");
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
		if(data.telemetry.job.onJob === true) {
			//Game Connected - Job (Driving)
			//console.log("Yeah! A job!");
			rpc.setActivity({
				state: `Delivering from ${data.telemetry.job.sourceCity} to ${data.telemetry.job.destinationCity}`,
				details: `Driving at ${Math.round(data.telemetry.truck.speed * 2.23694)} mph`,
				smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - At ${Math.round(data.telemetry.truck.odometer * 0.621371)} Miles`,
				smallImageKey: `brand_${data.telemetry.truck.makeID}`,
				largeImageText: `Estimated Income: €${data.telemetry.job.income}`,
				largeImageKey: `large_image_1`,
			});
		} else {
			//Game Connected - Driving
			//console.log("Game Connected - No Job");
			rpc.setActivity({
				state: `Driving`,
				details: `Driving at ${Math.round(data.telemetry.truck.speed * 2.23694)} mph`,
				smallImageText: `${data.telemetry.truck.make} ${data.telemetry.truck.model} - Driven ${Math.round(data.telemetry.truck.odometer * 0.621371)} Miles`,
				smallImageKey: `brand_${data.telemetry.truck.makeID}`,
				largeImageKey: `large_image_1`,
			});
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
		largeImageKey: `large_image_1`,
	});
});
 
etcars.on('error', function(data) {
    rpc.setActivity({
		details: `Plugin Error`,
		state: `Waiting for Game...`,
		largeImageKey: `large_image_1`,
	});
});



rpc.on('ready', () => {
	console.log(`Starting Presence...`);
	rpc.setActivity({
		details: `Game Not Started`,
		state: `Waiting for Game...`,
		largeImageKey: `large_image_1`,
	});
	etcars.connect();
});
rpc.login("426512878108016647").catch(console.error);