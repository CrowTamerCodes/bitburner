/** @param {NS} ns */
/*
			 /'{>
		 ____) (____
	   //'--;   ;--'\\
	  ///////\_/\\\\\\\
			 m m
		  CROWCODES
		Bitburner V2.2.1 javascript
Bifrost: program transport
workflow
network
	home 1.1
	|__ Server 2.1
	|	|__Server 3.1
	|	|	|__Server 4.1
	|	|		|__Server 5.1
	|	|			|__Server 6.1
	|	|			|__Server 6.2
	|	|			|__Server 6.3
	|	|__Server 3.2
	|__ Server 2.2
		|__Server 3.1
			|__Server 4.2
*/
async function allSight(ns) {
	var targetList = ns.scan();
	for (var i = 0; i < targetList.length; i++) {
		var connectedTargets = ns.scan(targetList[i]);
		for (var t = 0; t < connectedTargets.length; t++) {
			if ((targetList.indexOf(connectedTargets[t], 0) == -1)) {
				targetList.push(connectedTargets[t]);
			}
		}
	}
	//ns.print("Possible Targets:");
	//ns.print(targetList);
	return targetList;
}

async function openPortals(ns, servers) {
	var playerHackLvl = ns.getHackingLevel();
	var hackedServers = 0;
	for (var i = 0; i < servers.length; i++) {
		var serverHackLvl = ns.getServerRequiredHackingLevel(servers[i]);
		if (ns.hasRootAccess(servers[i])) {
			ns.print(servers[i] + " | Infiltrated");
			await heimdall(ns, servers[i]);
			hackedServers++;

		} else if (serverHackLvl <= playerHackLvl) {

			var portsRequired = ns.getServerNumPortsRequired(servers[i]);
			var portsOpen = 0;
			switch (ns.getServerNumPortsRequired(servers[i])) {
				case 4:
					if (ns.fileExists("sqlinject.exe")) { ns.sqlinject(servers[i]); portsOpen++; }
				case 3:
					if (ns.fileExists("httpworm.exe")) { ns.httpworm(servers[i]); portsOpen++; }
				case 2:
					if (ns.fileExists("ftpcrack.exe")) { ns.ftpcrack(servers[i]); portsOpen++; }
				case 1:
					if (ns.fileExists("brutessh.exe")) { ns.brutessh(servers[i]); portsOpen++; }
				default:
					if (portsOpen >= portsRequired) {
						ns.nuke(servers[i]);
						await heimdall(ns, servers[i]);
						ns.print(servers[i] + " | Hacking...");
						hackedServers++;
					} else {
						ns.print(servers[i] + " | Untouched | " + portsOpen + "/" + portsRequired + " ports open");
					}
			}
		} else {
			ns.print(servers[i] + " | Untouched | " + portsOpen + "/" + portsRequired + " ports open | Hack Level: " + playerHackLvl + "/" + serverHackLvl);
		}
	}
	return hackedServers;
}

async function heimdall(ns, server) {

	await ns.kill("fenrir.js", server);
	await ns.rm("fenrir.js", server);
	await ns.wget("https://raw.githubusercontent.com/CrowTamerCodes/bitburner/main/fenrir.js", "fenrir.js", server);
	var serverMaxRam = ns.getServerMaxRam(server);
	var scriptRam = ns.getScriptRam("fenrir.js", server);
	var threads = parseInt(serverMaxRam / scriptRam);
	if (threads > 0) {
		await ns.exec('fenrir.js', server, threads);
	}

}



export async function main(ns) {

	var progress = 0;
	var totalServers = 0;

	while(true){
		ns.tail(ns.getScriptName());
		ns.clearLog();
		ns.disableLog('ALL');
		//var depth = await ns.prompt('Depth to run bifrost on?', { type: "text" });
		var allServers = await allSight(ns);
		totalServers = allServers.length;
		progress = await openPortals(ns, allServers);
		ns.print("Current hack progress: " + progress + "/" + totalServers + " servers.")
		await ns.sleep(5 * 1000 * 60);
	}

}