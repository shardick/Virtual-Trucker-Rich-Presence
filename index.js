// EURO TRUCK SIMULATOR 2 - RICH PRESENCE
// Version 1.1
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
					details: `Game Not Started`,
					state: `Waiting for Game...`,
					largeImageKey: `large_image_1`,
				});
			} else if(body.trailer.attached === true) {
				//Game Connected - Job (Driving)
				//console.log("Yeah! A job!");
				rpc.setActivity({
					state: `Delivering from ${body.job.sourceCity} to ${body.job.destinationCity}`,
					details: `Driving at ${Math.round(body.truck.speed)} km/h in a ${body.navigation.speedLimit} km/h`,
					smallImageText: `${body.truck.make} ${body.truck.model} - Driven ${Math.round(body.truck.odometer)} KMs`,
					smallImageKey: `brand_${body.truck.id}`,
					largeImageKey: `large_image_1`,
					largeImageText: `Estimated Income: ${body.job.income}`,
				});
			} else {
				//Game Connected - Driving
				//console.log("Game Connected - No Job");
				rpc.setActivity({
					state: `Driving`,
					details: `Driving at ${Math.round(body.truck.speed)} km/h in a ${body.navigation.speedLimit} km/h`,
					smallImageText: `${body.truck.make} ${body.truck.model} - Driven ${Math.round(body.truck.odometer)} KMs`,
					smallImageKey: `brand_${body.truck.id}`,
					largeImageKey: `large_image_1`,
				});
			}
		//End
		});
	});
}

rpc.on('ready', () => {
	console.log(`http://${ip.address()}:25555/api/ets2/telemetry`);
	console.log(`Starting Presence...`);
	updateStatus();
	setInterval(() => {
		updateStatus();
	}, 1000); //Fetching information every second
});

rpc.login("426512878108016647").catch(console.error);