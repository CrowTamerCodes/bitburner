/** @param {NS} ns */
/*
             /'{>
         ____) (____
       //'--;   ;--'\\
      ///////\_/\\\\\\\
             m m
          CROWCODES
		Bitburner V2.2.1 javascript
Single server hack with weaken and grow mechanics
*/

async function jobSelect(ns, currentServer){

	//Money Vars
	var maxMoney = ns.getServerMaxMoney(currentServer);
	var currentMoney = ns.getServerMoneyAvailable(currentServer);
	//Security Vars
	var currentSec = ns.getServerSecurityLevel(currentServer);
	var minSec = ns.getServerMinSecurityLevel(currentServer);
	//might need to change order and make weaken the default method.

	if (currentMoney <= maxMoney * 0.75)
	{
		await ns.grow(currentServer);

	} else if (currentSec >= minSec *2) {

		await ns.weaken(currentServer);

	} else {

		await ns.hack(currentServer);

	}

}

export async function main(ns) {

	while(true) {
		//await ns.hack(currentServer);
		var currentServer = ns.getHostname();
		await jobSelect(ns, currentServer);
	}
}
