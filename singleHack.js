/** @param {NS} ns */
/*
             /'{>
         ____) (____
       //'--;   ;--'\\
      ///////\_/\\\\\\\
             m m
          CROWCODES
        Bitburner V2.2.1 javascript
singleGrow: Helper command to optimize threads
Workflow:
*/
export async function main(ns) {
	var args = JSON.parse(ns.args);
	await ns.hack(args.server);
}