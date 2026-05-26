/**
 * This is does a weaken against target args[0] using a delay of args[1]
 *  
 * @param {NS} ns 
 * 
 * @example ns.run("/scripts/hack/timedWeaken.js", threads, "n00dles", weakenDelayTime)
 * 
 * */
export async function main(ns) {
  let target = ns.args[0]
  let delayTime = ns.args[1]
  await ns.weaken(target, {additionalMsec: delayTime})
}