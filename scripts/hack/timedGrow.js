/**
 * This is does a grow against target args[0] using a delay of args[1]
 *  
 * @param {NS} ns 
 * 
 * @example ns.run("/scripts/hack/timedGrow.js", threads, "n00dles", growDelayTime)
 * 
 * */
export async function main(ns) {
  let target = ns.args[0]
  let delayTime = ns.args[1]
  await ns.grow(target, {additionalMsec: delayTime})
}