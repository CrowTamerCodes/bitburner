/** @param {NS} ns */
/*
             /'{>
         ____) (____
       //'--;   ;--'\\
      ///////\_/\\\\\\\
             m m
          CROWCODES
		Bitburner V2.2.1 javascript
Fenrir herald
Workflow:

retrieve fenrir.js with wget
		wget https://raw.githubusercontent.com/CrowTamerCodes/bitburner/main/fenrir.js fenrir.js
rename to include hostname
	mv fenrir.js fenrir+hostname.js
run fenrir+hostname.js
return home
*/
export async function main(ns) {

	ns.tail(ns.getScriptName());
	ns.clearLog();
	ns.disableLog('ALL');
	ns.wget("https://raw.githubusercontent.com/CrowTamerCodes/bitburner/main/fenrir.js", "fenrir.js", ns.getHostname());
	

	var servers = ns.scan();
	//ns.print("Servers in Range: ");
	for (var i = 0; i < servers.length; i++)
	{
		if (ns.isRunning('fenrir.js', servers[i]))
		{
			ns.print(servers[i] + " | Activated");
		} else {
			//get latest versions
			ns.wget("https://raw.githubusercontent.com/CrowTamerCodes/bitburner/main/fenrir.js", "fenrir.js", servers[i])
			ns.exec('fenrir.js', servers[i]);
			if (ns.isRunning('fenrir.js', servers[i]))
			{
				ns.print(servers[i] + " | Activated");
			} else {
				//get legacy versions
				ns.scp("fenrir.js", servers[i], 'home')
				ns.exec('fenrir.js', servers[i]);
				if (ns.isRunning('fenrir.js', servers[i]))
				{
					ns.print(servers[i] + " | Legacy");
				} else {
					ns.print(servers[i] + " | Error");
				}
			}
			
		}
		
	}

	
}