const hackFactions = ["CyberSec", "NiteSec", "The Black Hand", "BitRunners"];

const backdoorScript = "/backdoorAuto.js"

/** @param {NS} ns */
export async function main(ns) {
  ns.clearLog();
  ns.disableLog("ALL");
  var index = 0;
  
  while (true) {
    var targetFaction = hackFactions[index];
    ns.print("Target Faction is: " + targetFaction);
    joinAvailableFactions(ns);

    if (!ns.getPlayer().factions.includes(targetFaction)) {
      ns.run(backdoorScript);
    } else {
      workTowardFactionRep(ns, targetFaction);
      await purchaseFactionAugs(ns, targetFaction);
      index++;
      if (hackFactions.length <= index) {
        ns.exit();
      }
    }
    installAugments(ns);
    await ns.sleep(10000);
  }
}

/** @param {NS} ns */
function installAugments(ns) {
  var totalCount = ns.singularity.getOwnedAugmentations(true);
  var ownedCount = ns.singularity.getOwnedAugmentations(false);

  var purchasedCount = totalCount - ownedCount;
  if (purchasedCount > 10) {
    ns.singularity.installAugmentations("/start.js");
  }
}

/** @param {NS} ns */
function joinAvailableFactions(ns) {
  var factionNames = ns.singularity.checkFactionInvitations();
  for (var factionName of factionNames) {
    ns.singularity.joinFaction(factionName);
  }
}

/** @param {NS} ns */
function workTowardFactionRep(ns, factionName) {
  var maxRep = -1;

  var augNames = ns.singularity.getAugmentationsFromFaction(factionName);

  for (var augName of augNames) {
    var rep = ns.singularity.getAugmentationRepReq(augName);
    if (rep > maxRep) {
      maxRep = rep;
    }
  }

  var factionRep = ns.singularity.getFactionRep(factionName);
  if (factionRep < maxRep) {
    ns.singularity.workForFaction(factionName, "hacking", true);
  }
}

/** @param {NS} ns */
async function purchaseFactionAugs(ns, factionName) {
  var hasAugToBuy = true;
  while (hasAugToBuy) {
    installAugments(ns);
    var augName = getMostExpensive(ns, factionName);

    if (augName == null) {
      hasAugToBuy = false;
      continue;
    }
    ns.print("Attempting to buy aug: " + augName);
    var isBought = ns.singularity.purchaseAugmentation(factionName, augName);
    if (isBought) {
      continue;
    }

    await ns.sleep(10000);
  }
}

/** @param {NS} ns */
function getMostExpensive(ns, factionName) {
  var includePurchasedAugs = true;
  var mostExpensiveAug = null;
  var maxPrice = -1;
  var augNames = ns.singularity.getAugmentationsFromFaction(factionName);

  for (var augName of augNames) {
    var ownedAugs = ns.singularity.getOwnedAugmentations(includePurchasedAugs);
    if (ownedAugs.includes(augName)) {
      continue;
    }

    var preReqs = ns.singularity.getAugmentationPrereq(augName);
    for (var preReq of preReqs) {
      if (! ownedAugs.includes(preReq)) {
        continue;
      }
    }
    
    var price = ns.singularity.getAugmentationPrice(augName);
    if (price > maxPrice) {
      maxPrice = price;
      mostExpensiveAug = augName;
    }
  }

  return mostExpensiveAug;
}
