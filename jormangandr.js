/** @param {NS} ns */
/*
			 /'{>
		 ____) (____
	   //'--;   ;--'\\
	  ///////\_/\\\\\\\
			 m m
		  CROWCODES
		Bitburner V2.2.1 javascript
Jormangandr: server eater
Workflow:
Scan for root access
find server with the max money
determine strongest server stat
use all available threads to destroy stat
drain server
*/
export async function main(ns) {

	ns.tail(ns.getScriptName());
	ns.clearLog();
	ns.disableLog('ALL');
	var currentMaxRam = ns.getServerMaxRam(ns.getHostname());
	var currentScriptRam = ns.getScriptRam(ns.getScriptName());
	var threadBudget = parseInt((currentMaxRam * .95) / currentScriptRam);
	ns.print("Suggested thread count for server: " + threadBudget);
	

	//while (true) {

		var targetList = await createTargetList(ns);
		
		var currentWeakenTarget = await findWeakenTarget(ns, targetList);
		//var currentGrowTarget = await findGrowTarget(ns, targetList);
		var currentHackTarget = await findHackTarget(ns, targetList);
}

async function getTotalList(ns) {
	var totalList = ns.scan();
	for (var i = 0; i < totalList.length; i++) {
		var connectedTargets = ns.scan(totalList[i]);
		for (var t = 0; t < connectedTargets.length; t++) {
			if ((totalList.indexOf(connectedTargets[t], 0) == -1)) {
				totalList.push(connectedTargets[t]);
			}
		}
	}
	//ns.print("Total Servers:");
	//ns.print(totalList);
	return totalList;
}

async function createTargetList(ns) {
	var ignoreList = ns.getPurchasedServers();
	ignoreList.push("home");
	ignoreList.push("darkweb");
	ns.print("Ignored Targets:");
	ns.print(ignoreList);
	var serverList = await getTotalList(ns);
	var targetList = [];
	
	for (var t = 0; t < serverList.length; t++) {
		if(ignoreList.indexOf(serverList[t]) == -1 && ns.hasRootAccess(serverList[t])) {
			targetList.push(serverList[t]);
		}
	}
	//ns.print("Possible Targets:");
	//ns.print(targetList);
	return targetList;
}

async function findGrowTarget(ns, servers) {
	var reRunFlag = true;
	var currentGrowTarget = servers[0];
	for (var t = 0; t < servers.length; t++) {
		if (serverMoneyRatio(ns, currentGrowTarget) > serverMoneyRatio(ns, servers[t]) && serverMoneyRatio(ns, currentGrowTarget) > 0) {
			currentGrowTarget = servers[t];
		}
	}
	//Grow Target
	ns.print("Growing " + currentGrowTarget + " with " + parseInt(ns.getServerMaxMoney(currentGrowTarget)) + " maximum funds.");
	if (ns.getServerMoneyAvailable(currentGrowTarget) <= ns.getServerMaxMoney(currentGrowTarget) * 0.75) {
		var growAmount = await ns.grow(currentGrowTarget);
		ns.print("Increased funds by " + growAmount + " on target.");
	}
	return finalTarget;
}

async function findWeakenTarget(ns, servers) {
	var reRunFlag = true;
	var finalWeakTarget = servers[0];
	ns.print("Initial weaken target: " + finalWeakTarget + " | " + ns.getServerSecurityLevel(finalWeakTarget));
	for (var t = 0; t < servers.length; t++) {
		if (serverSecurityRatio(ns, finalWeakTarget) < serverSecurityRatio(ns, servers[t])) {
			finalWeakTarget = servers[t];
			ns.print("New weaken target: " + finalWeakTarget  + " | " + ns.getServerSecurityLevel(finalWeakTarget));
		}
	}
	ns.print("Final weaken target: " + finalWeakTarget + " | " + ns.getServerSecurityLevel(finalWeakTarget) + "/" + ns.getServerMinSecurityLevel(finalWeakTarget));
	//Weaken Target
	if (ns.getServerSecurityLevel(finalWeakTarget) >= ns.getServerMinSecurityLevel(finalWeakTarget) * 1.5) {
		ns.print("Weakening " + finalWeakTarget + " with a security level of " + parseInt(ns.getServerSecurityLevel(finalWeakTarget)));
		var weakAmount = await ns.weaken(finalWeakTarget);
		ns.print("Weakend " + weakAmount + " security levels from target.");
	} else {
		ns.print("No targets to weaken.");
	}
	return finalWeakTarget;
}

async function findHackTarget(ns, servers) {
	var reRunFlag = true;
	var finalHackTarget = servers[0];
	for (var z = 0; z < servers.length; z++) {
		if (ns.getServerMoneyAvailable(finalHackTarget) < ns.getServerMoneyAvailable(servers[z])) {
			finalHackTarget = servers[z];
		} else {
			reRunFlag = false;
		}
	}
	//Hack Target
	ns.print("Hacking " + finalHackTarget + " with " + parseInt(ns.getServerMoneyAvailable(finalHackTarget)) + " available funds.");
	var hackedAmount = await ns.hack(finalHackTarget);
	ns.print("Taken " + hackedAmount + " from target.");
	return finalHackTarget;
}

function serverMoneyRatio(ns, server) {
	var serverMaxMoney = ns.getServerMaxMoney(server);
	if (serverMaxMoney != 0) {
		var serverRatio = ns.getServerMoneyAvailable(server) / serverMaxMoney;
	} else {
		serverRatio = 99999;
	}

	return serverRatio;
}

function serverSecurityRatio(ns, server) {
	if (ns.getServerMinSecurityLevel(server) != 0) {
		var securityRatio = ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server);
	} else {
		securityRatio = 99999;
	}
	return securityRatio;
}
