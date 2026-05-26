/** @param {NS} ns */
export async function main(ns) {
  ns.killall()
  try {
    ns.singularity.isFocused()
  } catch(ex) {
    ns.spawn("/scripts/startBasic.js", {spawnDelay: 0})
  }
  ns.spawn("/scripts/startSigularity.js", {spawnDelay: 0})
}