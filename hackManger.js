
const WEAKEN_EFFECT_VALUE = 0.05;

const HACK_SCRIPT_PATH = "scripts/hgw/single/hack.js";
const GROW_SCRIPT_PATH = "scripts/hgw/single/grow.js";
const WEAKEN_SCRIPT_PATH = "scripts/hgw/single/weaken.js";


/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  ns.disableLog("ALL");
  ns.clearLog();
  var targetServerName = ns.args[0];

  while(true) {
    var currentSecurity = ns.getServerSecurityLevel(targetServerName);
    var minSecurity = ns.getServerMinSecurityLevel(targetServerName);
    var moneyAvailable = ns.getServer(targetServerName).moneyAvailable;
    var moneyMax = ns.getServer(targetServerName).moneyMax;

    if (currentSecurity > minSecurity) {
      ns.print("Starting weaken section")
      await handleWeakenSection(ns, currentSecurity, minSecurity, targetServerName);
    } else if (moneyAvailable < moneyMax) {
      ns.print("Starting grow section")
      await handleGrowSection(ns, targetServerName);
    } else {
      ns.print("Starting hack section")
      await handleHackSection(ns, targetServerName);
    }
  }
}

/** @param {NS} ns */
async function handleWeakenSection(ns, currentSecurity, minSecurity, targetServerName) {
  var threadsUsed = 0;
  var threadsNeeded = getWeakenThreadsNeeded(ns, minSecurity, currentSecurity);
  var ourServerNames = ns.getPurchasedServers();

  for (var i = 0; i < ourServerNames.length; i++) {
    if (threadsUsed >= threadsNeeded) {
      break;
    }

    var scriptServerName = ourServerNames[i];
    var server = ns.getServer(scriptServerName);
    var freeRam = server.maxRam - server.ramUsed;
    var threadsAvailable = Math.floor(freeRam/ns.getScriptRam(WEAKEN_SCRIPT_PATH));
    if (threadsAvailable <= 0) {
      continue;
    }

    var threadsRemaining = threadsNeeded - threadsUsed;
    if (threadsRemaining < threadsAvailable) {
      threadsAvailable = threadsRemaining;
    }

    ns.print(`Doing weaken with thread count of ${threadsAvailable} on server ${scriptServerName} for a total ram usage of ${ns.formatRam(threadsAvailable*ns.getScriptRam(WEAKEN_SCRIPT_PATH))}`);
    copyScripts(ns, scriptServerName);
    var pid = ns.exec(WEAKEN_SCRIPT_PATH, scriptServerName, threadsAvailable, targetServerName);
    if (pid != 0) {
      threadsUsed += threadsAvailable;
    }
  }

  await ns.sleep(ns.getWeakenTime(targetServerName) + 50);
}

/** @param {NS} ns */
async function handleGrowSection(ns, targetServerName) {
  var moneyAvailable = ns.getServer(targetServerName).moneyAvailable;
  var moneyMax = ns.getServer(targetServerName).moneyMax;
  var moneyPercent = moneyAvailable / moneyMax;

  var multiplier = 100 / (moneyPercent*100);

  ns.print(`Muliplier: ${multiplier}`);

  var threadsUsed = 0;
  var threadsNeeded = Math.ceil(ns.growthAnalyze(targetServerName, multiplier));
  ns.print (`Threads needed: ${threadsNeeded}`);

  var ourServerNames = ns.getPurchasedServers();
  for (var i = 0; i < ourServerNames.length; i++) {
    if (threadsUsed >= threadsNeeded) {
      break;
    }

    var scriptServerName = ourServerNames[i];
    var server = ns.getServer(scriptServerName);
    var freeRam = server.maxRam - server.ramUsed;
    var threadsAvailable = Math.floor(freeRam/ns.getScriptRam(GROW_SCRIPT_PATH));
    if (threadsAvailable <= 0) {
      continue;
    }

    var threadsRemaining = threadsNeeded - threadsUsed;
    if (threadsRemaining < threadsAvailable) {
      threadsAvailable = threadsRemaining;
    }

    ns.print(`Doing GROW with thread count of ${threadsAvailable} on server ${scriptServerName} for a total ram usage of ${ns.formatRam(threadsAvailable*ns.getScriptRam(GROW_SCRIPT_PATH))}`);
    copyScripts(ns, scriptServerName);
    var pid = ns.exec(GROW_SCRIPT_PATH, scriptServerName, threadsAvailable, targetServerName);
    if (pid != 0) {
      threadsUsed += threadsAvailable;
    }
  }
  await ns.sleep(ns.getGrowTime(targetServerName) + 50);
}

/** @param {NS} ns */
async function handleHackSection(ns, targetServerName) {
  var threadsUsed = 0;
  var threadsNeeded = threadsNeededForHack(ns, targetServerName);
  ns.print (`Threads needed: ${threadsNeeded}`);

  var ourServerNames = ns.getPurchasedServers();
  for (var i = 0; i < ourServerNames.length; i++) {
    if (threadsUsed >= threadsNeeded) {
      break;
    }

    var scriptServerName = ourServerNames[i];
    var server = ns.getServer(scriptServerName);
    var freeRam = server.maxRam - server.ramUsed;
    var threadsAvailable = Math.floor(freeRam/ns.getScriptRam(HACK_SCRIPT_PATH));
    if (threadsAvailable <= 0) {
      continue;
    }

    var threadsRemaining = threadsNeeded - threadsUsed;
    if (threadsRemaining < threadsAvailable) {
      threadsAvailable = threadsRemaining;
    }

    ns.print(`Doing HACK with thread count of ${threadsAvailable} on server ${scriptServerName} for a total ram usage of ${ns.formatRam(threadsAvailable*ns.getScriptRam(HACK_SCRIPT_PATH))}`);
    copyScripts(ns, scriptServerName);
    var pid = ns.exec(HACK_SCRIPT_PATH, scriptServerName, threadsAvailable, targetServerName);
    if (pid != 0) {
      threadsUsed += threadsAvailable;
    }
  }

  var money = ns.getServer(targetServerName).moneyAvailable;
  var money = money * threadsUsed * ns.hackAnalyze(targetServerName);

  ns.print(`Expected cash from hack is ${ns.formatNumber(money) }`);
  await ns.sleep(ns.getGrowTime(targetServerName) + 50);
}

/** @param {NS} ns */
function threadsNeededForHack(ns, targetServerName) {
  var percent = ns.hackAnalyze(targetServerName);
  var threadsNeeded = 0.75/percent;

  return Math.ceil(threadsNeeded);
}

/** @param {NS} ns */
function copyScripts(ns, desitinationServerName) {
  var files = [
    WEAKEN_SCRIPT_PATH,
    GROW_SCRIPT_PATH,
    HACK_SCRIPT_PATH
  ]
  ns.scp(files, desitinationServerName);
}

/** @param {NS} ns */
function getWeakenThreadsNeeded(ns, minSecurity, currentSecurity) {
  var securityDifference = currentSecurity - minSecurity;
  var expectedThreads = Math.ceil(securityDifference / WEAKEN_EFFECT_VALUE);

  while (ns.weakenAnalyze(expectedThreads) < securityDifference) {
    expectedThreads += 2;
  }
  ns.print(`The weaken will require ${expectedThreads} of threads to get to min.`);
  return expectedThreads
}
