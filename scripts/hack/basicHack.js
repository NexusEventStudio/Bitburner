/**
 * This does the basic hacking on n00dles 
 * @param {NS} ns 
 * */
export async function main(ns) {
  let target = "n00dles"
  ns.nuke(target)
  while(true) {
    if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
      await ns.weaken(target)
    } else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
      await ns.grow(target)
    } else {
      await ns.hack(target)
    }
  }
}