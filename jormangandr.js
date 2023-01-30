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

	while (true) {

		var targetList = await createTargetList(ns);
		var currentGrowTarget = await findGrowTarget(ns, targetList);
		var currentWeakenTarget = await findWeakenTarget(ns, targetList);
		var currentHackTarget = await findHackTarget(ns, targetList);


		//Grow Target
		ns.print("Growing " + currentGrowTarget + " with " + parseInt(ns.getServerMaxMoney(currentGrowTarget)) + " maximum funds.");
		if (ns.getServerMoneyAvailable(currentGrowTarget) >= ns.getServerMaxMoney(currentGrowTarget) * .75) {
			var growAmount = await ns.grow(currentGrowTarget);
			ns.print("Increased funds by " + growAmount + " on target.");
		}
		//Weaken Target
		if (ns.getServerSecurityLevel(currentWeakenTarget) >= ns.getServerMinSecurityLevel(currentWeakenTarget) * 1.25) {
			ns.print("Weakening " + currentWeakenTarget + " with a security level of " + parseInt(ns.getServerSecurityLevel(currentWeakenTarget)));
			var weakAmount = await ns.weaken(currentWeakenTarget);
			ns.print("Weakend " + weakAmount + " security levels from target.");
		}
		
		//Hack Target
		ns.print("Hacking " + currentHackTarget + " with " + parseInt(ns.getServerMoneyAvailable(currentHackTarget)) + " available funds.");
		var hackedAmount = await ns.hack(currentHackTarget);
		ns.print("Taken " + hackedAmount + " from target.");

		//ns.run();

	}

}

async function createTargetList(ns) {

	var targetList = ns.scan();
	for (var i = 0; i < targetList.length; i++) {
		if (ns.hasRootAccess(targetList[i])) {
			//ns.print(targetList[i] + " | Infiltrated");
			var connectedTargets = ns.scan(targetList[i]);
			for (var t = 0; t < connectedTargets.length; t++) {
				if ((targetList.indexOf(connectedTargets[t], 0) == -1) && ns.hasRootAccess(connectedTargets[t]) == true) {
					targetList.push(connectedTargets[t]);
				}
			}
		} else {
			ns.print(targetList[i] + " | No Root")
		}
	}
	ns.print("Possible Targets:");
	ns.print(targetList);
	return targetList;
}

async function findGrowTarget(ns, servers) {
	var reRunFlag = true;
	var finalTarget = servers[0];
	while (reRunFlag) {
		for (var t = 0; t < servers.length; t++) {
			if (serverMoneyRatio(ns, finalTarget) > serverMoneyRatio(ns, servers[t]) && serverMoneyRatio(ns, finalTarget) > 0) {
				finalTarget = servers[t];
			} else {
				reRunFlag = false;
			}
		}
	}
	return finalTarget;
}

async function findWeakenTarget(ns, servers) {
	var reRunFlag = true;
	var finalTarget = servers[0];
	while (reRunFlag) {
		for (var t = 0; t < servers.length; t++) {
			if (serverSecurityRatio(ns, finalTarget) > serverSecurityRatio(ns, servers[t])) {
				finalTarget = servers[t];
			} else {
				reRunFlag = false;
			}
		}
	}
	return finalTarget;
}

async function findHackTarget(ns, servers) {
	var reRunFlag = true;
	var finalTarget = servers[0];
	while (reRunFlag) {
		for (var t = 0; t < servers.length; t++) {
			if (ns.getServerMoneyAvailable(finalTarget) < ns.getServerMoneyAvailable(servers[t]) && servers[t] != 'home') {
				finalTarget = servers[t];
			} else {
				reRunFlag = false;
			}
		}
	}
	return finalTarget;
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
		var securityRatio = ns.getServerMinSecurityLevel(server) / ns.getServerSecurityLevel(server);
	} else {
		securityRatio = 99999;
	}
	return securityRatio;
}
