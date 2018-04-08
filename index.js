// EURO TRUCK SIMULATOR 2 - RICH PRESENCE
// Version 1.2
// Made by SgtBreadStick, Rein & Lasse

const http = require("http");
const DiscordRPC = require('discord-rpc');
var ip = require("ip");
const url = `http://${ip.address()}:25555/api/ets2/telemetry`;

const rpc = new DiscordRPC.Client({
	transport: 'ipc'
});

async function updateStatus() {
	http.get(url, res => {
	  res.setEncoding("utf8");
	  let body = "";
	  res.on("data", data => {
		body += data;
	  });
	  res.on("end", () => {
			body = JSON.parse(body);

			//Checking For Connections
			if (!rpc) console.log("Couldn't find discord-rpc!");
			if(body == undefined) console.log("Couldn't find the telemetry data!")

			if(body.game.connected === false) {
				//Game Not Connected
				//console.log("Game not connected");
				rpc.setActivity({
					details: `Game Not Started | Idle`,
					state: `Version: 1.2 BETA`,
					largeImageText: `Currently Idle`,
					largeImageKey: `ets2rpc_idle`,
				});
			} else if(body.trailer.attached === true) {
				//Game Connected - Job (Driving)
				//console.log("Yeah! A job!");
				if(body.truck.lightsBeamLowOn === true) {
					rpc.setActivity({
						state: `Delivering from ${body.job.sourceCity} to ${body.job.destinationCity}`,
						details: `Driving at ${Math.round(body.truck.speed)} km/h`,
						smallImageText: `${body.truck.make} ${body.truck.model} - At ${Math.round(body.truck.odometer)} KMs`,
						smallImageKey: `brand_${body.truck.id}`,
						largeImageText: `Estimated Income: €${body.job.income}`,
						largeImageKey: `ets2rpc_night`,
					})
				} else if(body.truck.wipersOn === true) {
					rpc.setActivity({
						state: `Delivering from ${body.job.sourceCity} to ${body.job.destinationCity}`,
						details: `Driving at ${Math.round(body.truck.speed)} km/h`,
						smallImageText: `${body.truck.make} ${body.truck.model} - At ${Math.round(body.truck.odometer)} KMs`,
						smallImageKey: `brand_${body.truck.id}`,
						largeImageText: `Estimated Income: €${body.job.income}`,
						largeImageKey: `ets2rpc_rain`,
					})
				} else {
					rpc.setActivity({
						state: `Delivering from ${body.job.sourceCity} to ${body.job.destinationCity}`,
						details: `Driving at ${Math.round(body.truck.speed)} km/h`,
						smallImageText: `${body.truck.make} ${body.truck.model} - At ${Math.round(body.truck.odometer)} KMs`,
						smallImageKey: `brand_${body.truck.id}`,
						largeImageText: `Estimated Income: €${body.job.income}`,
						largeImageKey: `ets2rpc_day`,
					})
				}
			} else {
				//Game Connected - Driving
				//console.log("Game Connected - No Job");
				if(body.truck.lightsBeamLowOn === true) {
					rpc.setActivity({
						state: `Freeroaming`,
						details: `Driving at ${Math.round(body.truck.speed)} km/h`,
						smallImageText: `${body.truck.make} ${body.truck.model} - At ${Math.round(body.truck.odometer)} KMs`,
						smallImageKey: `brand_${body.truck.id}`,
						largeImageKey: `ets2rpc_night`,
					})
				} else if(body.truck.wipersOn === true) {
					rpc.setActivity({
						state: `Freeroaming`,
						details: `Driving at ${Math.round(body.truck.speed)} km/h`,
						smallImageText: `${body.truck.make} ${body.truck.model} - At ${Math.round(body.truck.odometer)} KMs`,
						smallImageKey: `brand_${body.truck.id}`,
						largeImageKey: `ets2rpc_rain`,
					})
				} else {
					rpc.setActivity({
						state: `Freeroaming`,
						details: `Driving at ${Math.round(body.truck.speed)} km/h`,
						smallImageText: `${body.truck.make} ${body.truck.model} - At ${Math.round(body.truck.odometer)} KMs`,
						smallImageKey: `brand_${body.truck.id}`,
						largeImageKey: `ets2rpc_day`,
					})
				}
			}
		//End
		});
	});
}

rpc.on('ready', () => {
	console.log(`http://${ip.address()}:25555/api/ets2/telemetry`);
	console.log(`Presence Started. Don't forget to put node as currently playing in Discord settings.`);
	updateStatus();
	setInterval(() => {
		updateStatus();
	}, 1000); //Fetching information every 10 seconds
});

rpc.login("426512878108016647").catch(console.error);
