import { getAllServers, getInfilServers } from "toolbox.js";
import { WeakenJob, GrowJob, HackJob } from "jobs.js";
/** @param {NS} ns */
/*
             /'{>
         ____) (____
       //'--;   ;--'\\
      ///////\_/\\\\\\\
             m m
          CROWCODES
        Bitburner V2.2.1 javascript
gungnir: Job creation and distribution
Workflow:
*/
export async function main(ns) {
  ns.tail();
  let serverList = getInfilServers(ns);
  let jobList = [];
  let pidList = [];
  ns.clearLog();
  ns.disableLog('ALL');
  let threadsUsed;
  let ramBudget = getLeftoverRam(ns, jobList);
  while(true) {
    let jobList = [];
      //create all weaken first
    for (let i = 0; i < serverList.length; i++) {
      let weakenThreads = calculateServerWeakenT(ns, serverList[i]);
      if( weakenThreads > 0 ) {
        threadsUsed += weakenThreads;
        let weakenJob = new WeakenJob(serverList[i], weakenThreads);
        jobList.push(weakenJob);
      }
    }
    //create all grow
    for (let i = 0; i < serverList.length; i++) {
      let growThreads = 400;
      if (ns.fileExists("formulas.exe")) { growThreads = ns.growthAnalyze(serverList[i], 2); }
      let serverMoney = ns.getServerMoneyAvailable(serverList[i]);
      let serverMaxMoney = ns.getServerMaxMoney(serverList[i]);
      if(serverMoney <= serverMaxMoney * 0.50) {
        //threadsUsed += growThreads;
        let growJob = new GrowJob(serverList[i], growThreads);
        jobList.push(growJob);
      }
    }
    //create leftover hack
    for (let i = 0; i < serverList.length; i++) {
      let serverMoney = ns.getServerMoneyAvailable(serverList[i]);
      let serverMaxMoney = ns.getServerMaxMoney(serverList[i]);
      if(serverMoney > serverMaxMoney * 0.75) {
        let hackThreads = 200;
        if (ns.fileExists("formulas.exe")) { 
          let hackAmount = ns.getServerMaxMoney(serverList[i]) / 4
          hackThreads = ns.hackAnalyzeThreads(serverList[i], hackAmount); 
        }
        //threadsUsed += hackThreads;
        let hackJob = new HackJob(serverList[i], hackThreads);
        jobList.push(hackJob);
      }
    }
    ns.print(jobList);
    pidList = await createJobs(ns,jobList);

    await ns.sleep(30000);
  }
}
  

/** @param {NS} ns */
async function createJobs(ns, jobList) {
  let pidArray = null;
  for (let i = 0; i < jobList.length; i++) {
    if (jobList[i].action == "w" && jobList[i].threads > 0) {
      let jobTarget = jobList[i].target;
      let jobThreads = jobList[i].threads;
      let weakenArg = { server: jobTarget };
      let jobPID = await ns.run("singleWeak.js", jobThreads, JSON.stringify(weakenArg));
      //if(jobPID != 0) { pidArray.push(jobPID); }
    } else if (jobList[i].action == "g" && jobList[i].threads > 0) {
      let jobTarget = jobList[i].target;
      let jobThreads = jobList[i].threads;
      let growArg = { server: jobTarget };
      let jobPID = await ns.run("singleGrow.js", jobThreads, JSON.stringify(growArg));
      //if(jobPID != 0) { pidArray.push(jobPID); }
    } else if (jobList[i].action == "h" && jobList[i].threads > 0) {
      let jobTarget = jobList[i].target;
      let jobThreads = jobList[i].threads;
      let hackArg = { server: jobTarget };
      let jobPID = await ns.run("singleHack.js", jobThreads, JSON.stringify(hackArg));
      //if(jobPID != 0) { pidArray.push(jobPID); }
    }
  }
  return pidArray;
}

/** @param {NS} ns */
function getLeftoverRam(ns, jobList) {
  let currentHostName = ns.getHostname();
  let maxRam = ns.getServerMaxRam(currentHostName);
  let ramBudgetModifier = 0.8;
  for (let i = 0; i < jobList.lenght; i++) {
    let scriptRam = ns.getRunningScript(jobList[i], currentHostName);
    maxRam -= scriptRam;
  }
  maxRam -= ns.getScriptRam(ns.getScriptName(), currentHostName)
  return maxRam * ramBudgetModifier;
}

/** @param {NS} ns */
function calculateServerGrowT(ns, server) {
  let growthRate = ns.getServerGrowth(server);
  let moneyMax = ns.getServerMaxMoney(server);
  let moneyCurrent = ns.getServerMoneyAvailable(server);
  let percentFull = (moneyCurrent / moneyMax * 100);
  let d = ns.getServerSecurityLevel(server);
  //h = player's grow() multiplier (out of 1), d = the server's hack difficulty, and g = the server's growthRate
  //threads = exp(ln(growth) / (ln(min(1 + 0.03 / d, 1.0035)) * (g / 100) * h))
  //threads = Math.exp(Math.log)
  let threadsNeeded = (moneyMax / (growthRate * moneyCurrent));
  ns.print("Server is " + Math.ceil(percentFull) + "% full with a growth rate of " + growthRate + "%")
  ns.print("Server will need " + Math.ceil(threadsNeeded) + " threads to reach 100%.")
  ns.print("==============================");
}

/** @param {NS} ns */

function calculateServerHackt(ns, server) {
  let beginningMoney = ns.getServerMoneyAvailable(server);
  //await ns.weaken(server);
  //let playerHackMulti = ns.getPlayer();
  ns.print("Player hack multi: " + playerHackMulti.super(getHackingMultipliers()));
  //let hackAmount = await ns.hack(server, { threads: 107 });
  let endMoney = ns.getServerMoneyAvailable(server);
  let percentHacked = hackAmount / beginningMoney;

  ns.print("A single thread hack took " + percentHacked * 100 + "%");
}

/** @param {NS} ns */
function calculateServerWeakenT(ns, server) {
  let currentSecurity = ns.getServerSecurityLevel(server);
  let minSecurity = ns.getServerMinSecurityLevel(server);
  let threadsNeeded = Math.floor((currentSecurity - minSecurity) / 0.05);
  ns.print(server + " is at " + Math.floor(currentSecurity) + " / " + minSecurity + " and will need " + threadsNeeded + " threads to minimum.")
  return threadsNeeded;
  //0.05 multiplied by the number of script threads
}