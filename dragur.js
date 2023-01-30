/** @param {NS} ns */
/*
             /'{>
         ____) (____
       //'--;   ;--'\\
      ///////\_/\\\\\\\
             m m
          CROWCODES
		Bitburner V2.2.1 javascript
Dragur: Server Manager
Workflow:
*/
export async function main(ns) { 
  
  ns.tail(ns.getScriptName());
  var numberOfPServers = ns.getPurchasedServers().length;
  var maxRam = ns.getPurchasedServerMaxRam();
  var serverName = "pServer-";

  if(numberOfPServers < ns.getPurchasedServerLimit()) {
    ns.print("Under purchased server max. Attempting to buy new server");
    var createdServer = ns.purchaseServer(serverName + numberOfPServers, 2);
    var uLoop = true;
    var upgrades = 0;
    var ramUpgrade = 2;
    ns.print("Upgrading to max amount..")
    while(uLoop) {
      ramUpgrade *= 2;
      uLoop = ns.upgradePurchasedServer(createdServer, ramUpgrade);
    }

    ns.print("Created server " + createdServer + " with " + ramUpgrade + "GB of RAM.")
  }

  ns.print("Adding jormanagdr.js to Server.");
  await ns.wget("https://raw.githubusercontent.com/CrowTamerCodes/bitburner/main/jormangandr.js", "jormangandr.js", createdServer);
	var serverMaxRam = ns.getServerMaxRam(createdServer);
	var scriptRam = ns.getScriptRam("jormangandr.js", createdServer);
	var threads = parseInt(serverMaxRam / scriptRam);
  ns.print("Executing jormangandr.js with " + threads + " threads.")
	await ns.exec('jormangandr.js', createdServer, threads);

  ns.print("New server installation complete.");

}