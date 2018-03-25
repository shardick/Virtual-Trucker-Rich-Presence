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
					details: `${body.trailer.name}: ${body.job.sourceCity} -> ${body.job.destinationCity}`,
					state: `${body.truck.parkBrakeOn ? `Parking Brake` : `${Math.round(body.truck.speed)} km/h`}`,
					smallImageText: `${body.truck.make} ${body.truck.model}`,
					smallImageKey: `brand_${body.truck.id}`,
					largeImageKey: `large_image_1`,
					largeImageText: `Estimated Income: ${body.job.income}`,
				});
			} else {
				//Game Connected - Idle (Driving)
				//console.log("Game Connected - No Job");
				rpc.setActivity({
					state: `${body.truck.parkBrakeOn ? `Parking Brake` : `${Math.round(body.truck.speed)} km/h`}`,
					details: `No Job`,
					smallImageText: `${body.truck.make} ${body.truck.model}`,
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
