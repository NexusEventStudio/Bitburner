const IDLE_STATE_STRING = "IDLE"
const STR_STATE_STRING = "STR"

const STR_CUT_OFF = 100
const DEF_CUT_OFF = 100
const DEX_CUT_OFF = 100
const AGI_CUT_OFF = 100
const HACK_CUT_OFF = 50

/** @param {NS} ns */
export async function main(ns) {
  ns.clearLog();

    if (ns.gang.inGang()) {
      spawnNextPlayerAutomation(ns);
    }

  while (true) {
    playerStateMachine.processTick(ns);
    await ns.sleep(5000);
  }
}

const idleState = {
  /** @param {NS} ns */
  onEnter: function (machine, ns) {
    this.onTick(machine, ns);
  },
  /** @param {NS} ns */
  onTick: function (machine, ns) {
    if (ns.getPlayer().skills.strength < STR_CUT_OFF) {
      machine.changeState(ns, STR_STATE_STRING);
    } else if (ns.getPlayer().skills.defense < DEF_CUT_OFF) {
      machine.changeState(ns, "DEF");
    } else if (ns.getPlayer().skills.dexterity < DEX_CUT_OFF) {
      machine.changeState(ns, "DEX");
    } else if (ns.getPlayer().skills.agility < AGI_CUT_OFF) {
      machine.changeState(ns, "AGI");
    } else if (ns.getPlayer().skills.hacking < HACK_CUT_OFF) {
      machine.changeState(ns, "HACK");
    } else {
      ns.singularity.commitCrime("Homicide", false)
      spawnNextPlayerAutomation(ns);
    }
  }
}

/** @param {NS} ns */
function spawnNextPlayerAutomation(ns) {
  /**@type {SpawnOptions} */
  var spawnOptions = {};
  spawnOptions.spawnDelay = 0
  ns.spawn("/scripts/gang/createGang.js", spawnOptions)
}

const strState = {
  /** @param {NS} ns */
  onEnter: function (machine, ns) {
    ns.print("STR onEnter");
    ns.singularity.gymWorkout("powerhouse gym", "str", false);
  },
  /** @param {NS} ns */
  onTick: function (machine, ns) {
    ns.print("STR onTick");
    if (ns.getPlayer().skills.strength > STR_CUT_OFF) {
      machine.changeState(ns, IDLE_STATE_STRING);
    }
  },
  /** @param {NS} ns */
  onExit: function (machine, ns) {
    ns.print("STR onExit");
    ns.singularity.stopAction();
  }
}

const defState = {
  /** @param {NS} ns */
  onEnter: function (machine, ns) {
    ns.print("DEF onEnter");
    ns.singularity.gymWorkout("powerhouse gym", "def", false);
  },
  /** @param {NS} ns */
  onTick: function (machine, ns) {
    ns.print("DEF onTick");
    if (ns.getPlayer().skills.defense > DEF_CUT_OFF) {
      machine.changeState(ns, IDLE_STATE_STRING);
    }
  },
}

const dexState = {
  /** @param {NS} ns */
  onEnter: function (machine, ns) {
    ns.print("DEX onEnter");
    ns.singularity.gymWorkout("powerhouse gym", "dex", false);
  },
  /** @param {NS} ns */
  onTick: function (machine, ns) {
    ns.print("DEX onTick");
    if (ns.getPlayer().skills.dexterity > DEX_CUT_OFF) {
      machine.changeState(ns, IDLE_STATE_STRING);
    }
  },
}

const agiState = {
  /** @param {NS} ns */
  onEnter: function (machine, ns) {
    ns.print("AGI onEnter");
    ns.singularity.gymWorkout("powerhouse gym", "agi", false);
  },
  /** @param {NS} ns */
  onTick: function (machine, ns) {
    ns.print("AGI onTick");
    if (ns.getPlayer().skills.agility > AGI_CUT_OFF) {
      machine.changeState(ns, IDLE_STATE_STRING);
    }
  },
}

const hackState = {
  /** @param {NS} ns */
  onEnter: function (machine, ns) {
    ns.print("HACK onEnter");
    ns.singularity.universityCourse("rothman university", "Algorithms", false)
  },
  /** @param {NS} ns */
  onTick: function (machine, ns) {
    ns.print("HACK onTick");
    if (ns.getPlayer().skills.hacking > HACK_CUT_OFF) {
      machine.changeState(ns, IDLE_STATE_STRING);
    }
  },
}


const playerStateMachine = {
  currentState: IDLE_STATE_STRING,
  states: {
    IDLE: idleState,
    STR: strState,
    DEF: defState,
    DEX: dexState,
    AGI: agiState,
    HACK: hackState
  },
  /** @param {NS} ns */
  processTick(ns) {
    if (this.states[this.currentState].onTick) {
      this.states[this.currentState].onTick(this, ns);
    } else {
      ns.alert(this.currentState + " is missing onTick method");
    }
  },
  /** @param {NS} ns */
  changeState(ns, newState) {
    if (newState == this.currentState) {
      ns.print("State: " + newState + " is the same as the existing state");
      return;
    }

    if (! this.states[newState]) {
      ns.alert("New state of " + newState + " does not exist");
      return;
    }

    if (this.states[this.currentState].onExit) {
      this.states[this.currentState].onExit(this, ns);
    }

    this.currentState = newState;

    if (this.states[this.currentState].onEnter) {
      this.states[this.currentState].onEnter(this, ns);
    }
  }
}
