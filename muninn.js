/** @param {NS} ns */
/*
             /'{>
         ____) (____
       //'--;   ;--'\\
      ///////\_/\\\\\\\
             m m
          CROWCODES
		Bitburner V2.2.1 javascript
Network scout and port opener
Workflow:
scan
find first without root access
connect
check ports for nuke
nuke.exe
backdoor
*/
export async function main(ns) {

	ns.tail(ns.getScriptName());
	ns.clearLog();
	ns.disableLog('ALL');

	var playerHackLvl = ns.getHackingLevel();
	var servers_Lvl1 = ns.scan();
	ns.print("Servers in Range: ");
	for (var i = 0; i < servers_Lvl1.length; i++)
	{
		var serverHackLvl = ns.getServerRequiredHackingLevel(servers_Lvl1[i]);
		if (ns.hasRootAccess(servers_Lvl1[i]))
		{
			ns.print(servers_Lvl1[i] + " | Infiltrated");

		} else if (serverHackLvl <= playerHackLvl) {

			//ns.print(servers_Lvl1[i] + " | Untouched");
			var serverPortsNeeded = ns.getServerNumPortsRequired(servers_Lvl1[i]);
			var serverPortsOpen = ns.getServer(servers_Lvl1[i]).openPortCount;

			if(serverPortsOpen  >= serverPortsNeeded)
			{
				ns.nuke(servers_Lvl1[i]);

			} else {

				ns.ftpcrack(servers_Lvl1[i]);
				ns.brutessh(servers_Lvl1[i]);
				//ns.installBackdoor(servers_Lvl1[i]);
				ns.nuke(servers_Lvl1[i]);
			}
		}
	}

	
}
