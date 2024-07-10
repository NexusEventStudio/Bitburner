import { getServers } from "/scripts/lib/helperMethods.js"

//  └ ┴ ┘  ├ ─ ┼ ─ ┤  │   ┌ ┬ ┐   ascii 

const reset = "\u001b[0m";
const red = "\u001b[31m";

/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  ns.disableLog("ALL")
  ns.clearLog();

  while (true) {
    ns.clearLog();

    printHeader(ns);
    printServerInfo(ns);
    printBottomBoarder(ns);

    await ns.sleep(1000);
  }

}

function getLeftAlignedSection(value, sectionWidth, color) {
  var section = " " + value;
  section = section.padEnd(sectionWidth);

  if (color) {
    section = `${color}${section}${reset}`;
  }
  return section;
}

function getRightAlignedSection(value, sectionWidth, color) {
  var section = value + " ";
  section = section.padStart(sectionWidth);

  if (color) {
    section = `${color}${section}${reset}`;
  }
  return section;
}

function getHorizontalBoarder(width) {
  return "".padEnd(width, "─");
}

/** @param {NS} ns */
function printHeader(ns) {
  var headerColumns = getColumnHeaderDefinitions();
  var headerTop = "┌";
  var headerMiddle = "│";
  var headerBottom = "├";

  for (var i = 0; i < headerColumns.length - 1; i++) {
    var definition = headerColumns[i];
    var name = definition.name;
    var width = definition.width;

    headerTop += getHorizontalBoarder(width) + "┬";
    headerMiddle += getLeftAlignedSection(name, width) + "│";
    headerBottom += getHorizontalBoarder(width) + "┤";
  }

  definition = headerColumns[headerColumns.length - 1];
  name = definition.name;
  width = definition.width;

  headerTop += getHorizontalBoarder(width) + "┐";
  headerMiddle += getRightAlignedSection(name, width) + "│";
  headerBottom += getHorizontalBoarder(width) + "┤";

  ns.print(headerTop + "\n" + headerMiddle + "\n" + headerBottom);
}

function sortServerByMaxMoney(a, b) {
  return a.moneyMax - b.moneyMax;
}


/** @param {NS} ns */
function printServerInfo(ns) {
  var headerColumns = getColumnHeaderDefinitions();
  var serverNames = getServers(ns);

  var servers = [];

  for (var serverName of serverNames) {
    var server = ns.getServer(serverName);
    if (server.moneyMax > 0) {
      servers.push(server);
    }
  }

  servers.sort(sortServerByMaxMoney);

  for (var server of servers) {
    var row = "│";

    for (var columnDef of headerColumns) {
      row += getServerSectionInfo(ns, columnDef, server) + "│"
    }

    ns.print(row);
  }
}

const SERVER_HEADER = { "name": "Servers", "width": 20 }
const SYMBOL_HEADER = { "name": "Sym", "width": 6 };
const RAM_HEADER = { "name": "Ram", "width": 24 };
const MONEY_HEADER = { "name": "Money", "width": 24 };
const SEC_HEADER = { "name": "Sec", "width": 7 };
const MIN_SEC_HEADER = { "name": "MinSec", "width": 8 };
const HACK_REQ_HEADER = { "name": "HackReq", "width": 9 };
const PREPPED_HEADER = { "name": "Prepped", "width": 9 };
const WEIGHT_HEADER = { "name": "Weight", "width": 8 };
const CHANCE_HEADER = { "name": "Chance", "width": 8 };

/** @param {NS} ns */
function getServerSectionInfo(ns, columnDef, server) {
  var width = columnDef.width;
  switch (columnDef.name) {
    case SERVER_HEADER.name:
      return getLeftAlignedSection(server.hostname, width);
    case SYMBOL_HEADER.name:
      return getSymbolSection(ns, server);
    case RAM_HEADER.name:
      return getRamSection(ns, server);
    case MONEY_HEADER.name:
      return getMoneySection(ns, server);
    case SEC_HEADER.name:
      return getSecuritySection(ns, server);
    case MIN_SEC_HEADER.name:
      return getMinSecuritySection(ns, server);
    case HACK_REQ_HEADER.name:
      return getHackRequiredSection(ns, server);
    case PREPPED_HEADER.name:
      return getPreppedSection(ns, server);
    case WEIGHT_HEADER.name:
      return getWeightSection(ns, server);
    case CHANCE_HEADER.name:
      return getHackChanceSection(ns, server);
    default:
      return getRightAlignedSection(" ", width);
  }

}

/** @param {NS} ns */
function getMoneySection(ns, server) {
  var width = MONEY_HEADER.width;
  var money = ns.getServerMoneyAvailable(server.hostname);
  var maxMoney = ns.getServerMaxMoney(server.hostname);
  var percent = money / maxMoney;

  var percentPadded = ns.formatPercent(percent, 0) + " ";
  percentPadded = percentPadded.padStart(5);

  var moneyPadded = ns.formatNumber(money.toFixed(2), 2).padStart(7);
  var maxPadded = ns.formatNumber(maxMoney.toFixed(2), 2).padStart(7);

  var value = `${moneyPadded} / ${maxPadded} ${percentPadded}`
  return getLeftAlignedSection(value, width);
}

/** @param {NS} ns */
function getSymbolSection(ns, server) {
  // todo: future
}

function getRamSection(ns, server) {
  // todo: future
}

/** @param {NS} ns */
function getSecuritySection(ns, server) {
  var currentSecurity = ns.getServerSecurityLevel(server.hostname);
  var minSecurity = ns.getServerMinSecurityLevel(server.hostname);
  var value = ns.formatNumber(currentSecurity - minSecurity, 2);
  return getRightAlignedSection(value, SEC_HEADER.width);
}

/** @param {NS} ns */
function getMinSecuritySection(ns, server) {
  var minSecurity = ns.getServerMinSecurityLevel(server.hostname);
  return getRightAlignedSection(minSecurity, MIN_SEC_HEADER.width);
}

/** @param {NS} ns */
function getHackRequiredSection(ns, server) {
  return getRightAlignedSection(server.requiredHackingSkill, HACK_REQ_HEADER.width);
}

/** @param {NS} ns */
function getPreppedSection(ns, server) {
  var currentSecurity = ns.getServerSecurityLevel(server.hostname);
  var minSecurity = ns.getServerMinSecurityLevel(server.hostname);
  var money = ns.getServerMoneyAvailable(server.hostname);
  var maxMoney = ns.getServerMaxMoney(server.hostname);
  var prepped = currentSecurity - minSecurity <= 0 && maxMoney - money <= 0;
  var value = prepped ? "Yes" : "";

  return getRightAlignedSection(value, PREPPED_HEADER.width);
}

/** @param {NS} ns */
function getWeightSection(ns, server) {
  var minSec = ns.getServerMinSecurityLevel(server.hostname) * 0.90;
  var hackReq = server.requiredHackingSkill * 0.10;
  var weight = minSec + hackReq;

  return getRightAlignedSection(weight.toFixed(0), WEIGHT_HEADER.width);
}

/** @param {NS} ns */
function getHackChanceSection(ns, server) {
  var percent = ns.hackAnalyzeChance(server.hostname)
  var color = percent < 0.90 ? red : undefined;
  return getRightAlignedSection(ns.formatPercent(percent, 0), CHANCE_HEADER.width, color);
}

/** @param {NS} ns */
function printBottomBoarder(ns) {
  var headerColumns = getColumnHeaderDefinitions();
  var boarder = "└";

  for (var i = 0; i < headerColumns.length - 1; i++) {
    var definition = headerColumns[i];
    var width = definition.width;
    boarder += getHorizontalBoarder(width) + "┴"
  }

  definition = headerColumns[headerColumns.length - 1];
  width = definition.width;
  boarder += getHorizontalBoarder(width) + "┘"

  ns.print(boarder);
}

function getColumnHeaderDefinitions() {
  return [
    SERVER_HEADER, MONEY_HEADER,
    SEC_HEADER, MIN_SEC_HEADER, HACK_REQ_HEADER, PREPPED_HEADER,
    WEIGHT_HEADER, CHANCE_HEADER
  ];
}
