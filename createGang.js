const GANG_SERVER_NAME = "gang"

const FILES = [
  "/scripts/gang/createGang.js",
  "/scripts/gang/gang.js"
]

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL")

  await createGangServer(ns);
  forceScriptToGangServer(ns);
  await joinGang(ns);
}

async function createGangServer(ns) {
  while (!ns.serverExists(GANG_SERVER_NAME)) {
    var hostName = ns.purchaseServer(GANG_SERVER_NAME, 32);
    if (hostName == "") {
      await ns.sleep(10000);
    } else {
      ns.print("Created Gang Server")
    }
  }
}

async function joinGang(ns) {
  while (!ns.gang.inGang()) {
    if (ns.singularity.joinFaction("Slum Snakes")) {
      ns.print("Joined Slum Snakes");
    }
    var isGangCreated = ns.gang.createGang("Slum Snakes");
    if (!isGangCreated) {
      await ns.sleep(10000);
    }
  }
  ns.spawn("/scripts/gang/gang.js", { spawnDelay: 0 })
}

function forceScriptToGangServer(ns) {
  if (!ns.getRunningScript(ns.getScriptName(), GANG_SERVER_NAME)) {
    restartThisScriptOnGangServer(ns);

    ns.exit();
  } else {
    ns.print("Script is running on the Gang Server")
  }
}

/** @param {NS} ns */
function restartThisScriptOnGangServer(ns) {
  ns.print("Copying Files")
  ns.scp(FILES, GANG_SERVER_NAME, "home")
  ns.print("Starting script on Gang Server")
  ns.exec(ns.getScriptName(), GANG_SERVER_NAME);
}
