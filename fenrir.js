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

async function serverWeaken(ns, currentSecurity, minSecurity, currentServer){
	
	//var targetSecurityLvl = (ns.getServer(currentServer).baseDifficulty / 2);
	var targetSecurityLvl = (minSecurity * 3);
	if (currentSecurity >= targetSecurityLvl)
	{	
		
		ns.print("security too high");
		var iterations = 0;
		while (currentSecurity >= targetSecurityLvl)
		{
			await ns.weaken(currentServer);
			currentSecurity = ns.getServerSecurityLevel(currentServer);
			iterations++;
			ns.print("running weaken step " + iterations);
		}
		ns.print("Server Broken")
	}
}

async function growth(ns, minMoney, currentMoney, maxMoney, currentServer){
	
	if (currentMoney <= minMoney)
	{
		ns.print("funds below threshold");
		while (currentMoney <= maxMoney)
		{
			await ns.grow(currentServer);
			currentMoney = ns.getServerMoneyAvailable(currentServer);
		}
		ns.print("Server Full")
	}
	
}

async function jobSelect(ns, currentServer){

	var timeToHack = ns.getHackTime();
	var timeToWeaken = ns.getWeakenTime();
	var timeToGrow = ns.getGrowTime();
	//might need to change order and make weaken the default method.

	if (timeToGrow <= timeToWeaken && timeToGrow <= timeToHack)
	{
		await ns.grow(currentServer);

	} else if (timeToWeaken <= timeToHack && timeToWeaken <= timeToGrow) {

		await ns.weaken(currentServer);

	} else {

		await ns.hack(currentServer);

	}

}

export async function main(ns) {
	/*
	var currentServer = ns.getHostname();
	var maxMoney = ns.getServerMaxMoney(currentServer);
	var currentMoney = ns.getServerMoneyAvailable(currentServer);
	var moneyThreshold = 50000;
	var minSecurity = ns.getServerMinSecurityLevel(currentServer);
	var currentSecurity = ns.getServerSecurityLevel(currentServer);
	*/
	//ns.tail(ns.getScriptName());

	while(true) {
		//currentMoney = ns.getServerMoneyAvailable(currentServer);
		//currentSecurity = ns.getServerSecurityLevel(currentServer);
		//await serverWeaken(ns, currentSecurity, minSecurity, currentServer);
		//await growth(ns, moneyThreshold, currentMoney, maxMoney, currentServer);
		//await ns.hack(currentServer);
		await jobSelect(ns, currentServer);
	}
}
