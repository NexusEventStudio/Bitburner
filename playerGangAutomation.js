
let currentAction = "";

/** @param {NS} ns */
export async function main(ns) {

  if (ns.gang.inGang()) {
    spawnNextPlayerAutomation(ns);
  }

  while (true) {
    await ns.sleep(10000);

    if (buildingStr(ns)) {
      continue;
    } else if (buildingDef(ns)) {
      continue;
    } else if (buildingDex(ns)) {
      continue;
    } else if (buildingAgi(ns)) {
      continue;
    } else if (buildHacking(ns)) {
      continue;
    } else if (doHomicide(ns)) {
      // run script to manage non player automation
      continue;
    }

    if (ns.gang.createGang("Slum Snakes")) {
      spawnNextPlayerAutomation(ns);
    }
  }
}

/** @param {NS} ns */
function buildingStr(ns) {
  if (ns.getPlayer().skills.strength < 100) {
    if (currentAction != "str") {
      if (ns.singularity.gymWorkout("powerhouse gym", "str", false)) {
        currentAction = "str"
      }
    }
    return true;
  }
  return false;
}

function buildingDef(ns) {
  if (ns.getPlayer().skills.defense < 100) {
    if (currentAction != "def") {
      if (ns.singularity.gymWorkout("powerhouse gym", "def", false)) {
        currentAction = "def"
      }
    }
    return true;
  }
  return false;
}

function buildingDex(ns) {
  if (ns.getPlayer().skills.dexterity < 100) {
    if (currentAction != "dex") {
      if (ns.singularity.gymWorkout("powerhouse gym", "dex", false)) {
        currentAction = "dex"
      }
    }
    return true;
  }
  return false;
}

function buildingAgi(ns) {
  if (ns.getPlayer().skills.agility < 100) {
      if (currentAction != "agi") {
        if (ns.singularity.gymWorkout("powerhouse gym", "agi", false)) {
          currentAction = "agi"
        }
      }
      return true;
    }
    return false;
}

/** @param {NS} ns */
function buildHacking(ns) {
  if (ns.getPlayer().skills.hacking < 100) {
      if (currentAction != "hack") {
        if (ns.singularity.universityCourse("rothman university", "Algorithms", false)) {
          currentAction = "hack"
        }
      }
      return true;
    }
    return false;
}

/** @param {NS} ns */
function doHomicide(ns) {
  if (ns.getPlayer().karma < 52000) {
      if (currentAction != "Homicide") {
        if (ns.singularity.commitCrime("Homicide", false)) {
          currentAction = "Homicide"
        }
      }
      return true;
    }
    return false;
}


/** @param {NS} ns */
function spawnNextPlayerAutomation(ns) {
  ns.exit();
  // TODO spawn next step
}
