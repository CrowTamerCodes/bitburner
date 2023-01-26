/** @param {NS} ns */
/*
             /'{>
         ____) (____
       //'--;   ;--'\\
      ///////\_/\\\\\\\
             m m
          CROWCODES
		Bitburner V2.2.1 javascript
All Father: System Controller
Workflow:
scan current server
download latest codes
run muninn to open any servers available
run huginn to install fenrir on new servers
download allfather to new servers
run allfather on new servers
*/

export async function main(ns) {

	ns.tail(ns.getScriptName());
	ns.clearLog();
	ns.disableLog('ALL');

	//get latest files
	ns.wget("https://raw.githubusercontent.com/CrowTamerCodes/bitburner/main/fenrir.js", "fenrir.js", ns.getHostname());
	ns.wget("https://raw.githubusercontent.com/CrowTamerCodes/bitburner/main/huginn.js", "huginn.js", ns.getHostname());
	ns.wget("https://raw.githubusercontent.com/CrowTamerCodes/bitburner/main/muninn.js", "muninn.js", ns.getHostname());

	ns.exec('muninn.js', ns.getHostname());
	ns.exec('huginn.js', ns.getHostname());

	var servers = ns.scan();
	//ns.print("Servers in Range: ");
	for (var i = 0; i < servers.length; i++)
	{
		ns.wget("https://raw.githubusercontent.com/CrowTamerCodes/bitburner/main/allfather.js", "allfather.js", servers[i]);
		ns.exec('allfather.js', servers[i]);
	}





	



}