/** @param {NS} ns */
export async function main(ns) {
  ns.run("/scripts/hack/basicHack.js")
  ns.run("/scripts/hack/batchHackTarget.js", 1, "n00dles")
}