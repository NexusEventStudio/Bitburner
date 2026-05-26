/**
 * This is does a hack against target args[0] using a delay of args[1]
 *  
 * @param {NS} ns 
 * 
 * @example ns.run("/scripts/hack/timedHack.js", threads, "n00dles", hackDelayTime)
 * 
 * */
export async function main(ns) {
  let target = ns.args[0]
  let delayTime = ns.args[1]
  await ns.hack(target, {additionalMsec: delayTime})
}