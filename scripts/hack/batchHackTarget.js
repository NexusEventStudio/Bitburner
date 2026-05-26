const BATCH_OFFSET_TIME = 100
const MIN_THREAD_COUNT = 1

/** 
 * This does the batch hacking for a target.  Hack -> weaken -> grow -> weaken
 * @param {NS} ns 
 * 
 * @example ns.run("/scripts/hack/batchHackTarget.js", 1, "n00dles")
 */
export async function main(ns) {
  ns.disableLog("sleep")
  ns.ui.openTail()
  if (ns.args[0] == undefined || ns.args[0] == null) {
    ns.alert("Need to have 1 arg that is the target server")
  }

  let target = ns.args[0]

  // |------||----| hack
  // |-------------| weaken
  // |---||---------| grow
  // |||-------------| weaken
  while (true) {
    
    let delay = getDelay(ns, target)
    let threadCounts = getThreadCounts(ns, target)

    let hackPid = ns.run("/scripts/hack/timedHack.js", threadCounts.hackThreadCount, target, delay.hackDelayTime)
    let hackWeakenPid = ns.run("/scripts/hack/timedWeaken.js", threadCounts.hackWeakenThreadCount, target, delay.hackWeakenDelayTime)
    let growPid = ns.run("/scripts/hack/timedGrow.js", threadCounts.growThreadCount, target, delay.growDelayTime)
    let growWeakenPid = ns.run("/scripts/hack/timedWeaken.js", threadCounts.growWeakenThreadCount, target, delay.growWeakenDelayTime)

    if (hackPid == 0 || hackWeakenPid == 0 || growPid == 0 || growWeakenPid == 0) {
      ns.alert("Failed to start the individual batch file hack/weaken/grow/weaken maybe to RAM")
      ns.exit()
    }

    while(ns.isRunning(growWeakenPid)) {
      await ns.sleep(500)
    }
  }
}

/** 
 * Returns the caluclated delay for each batched hack/weaken/grow/weaken.
 * @param {NS} ns 
 * @param {String} target 
 * 
 * @returns 
 * 
 * @example getThreadCounts(ns, "n00dles")
 */
  function getDelay(ns, target) {
    let baseHackTime = ns.getHackTime(target)
    let baseGrowTime = ns.getGrowTime(target)
    let baseWeakenTime = ns.getWeakenTime(target)

    let totalHackTime = baseWeakenTime - BATCH_OFFSET_TIME
    let totalHackWeakenTime = baseWeakenTime
    let totalGrowTime = totalHackWeakenTime + BATCH_OFFSET_TIME
    let totalGrowWeakenTime = totalGrowTime + BATCH_OFFSET_TIME

    let hackDelayTime = totalHackTime - baseHackTime
    let hackWeakenDelayTime = totalHackWeakenTime - baseWeakenTime
    let growDelayTime = totalGrowTime - baseGrowTime
    let growWeakenDelayTime = totalGrowWeakenTime - baseWeakenTime

    return {
      hackDelayTime,
      hackWeakenDelayTime,
      growDelayTime,
      growWeakenDelayTime
    }
  }


/** 
 * Returns the caluclated thread counts needed to maximize the amount of RAM available vs the money available on target server.
 * @param {NS} ns 
 * @param {String} target 
 * 
 * @returns 
 * 
 * @example getThreadCounts(ns, "n00dles")
 */
  function getThreadCounts(ns, target) {
    return {
      hackThreadCount : MIN_THREAD_COUNT,
      hackWeakenThreadCount : MIN_THREAD_COUNT,
      growThreadCount : MIN_THREAD_COUNT,
      growWeakenThreadCount : MIN_THREAD_COUNT
    }
  }