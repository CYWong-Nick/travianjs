"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
const BUILD_TIME = "2022/10/29 09:30:04";
const RUN_INTERVAL = 10000;
const GID_NAME_MAP = {
    "-1": "Unknown",
    "1": "Woodcutter",
    "2": "Clay Pit",
    "3": "Iron Mine",
    "4": "Cropland",
    "5": "Sawmill",
    "6": "Brickyard",
    "7": "Iron Foundry",
    "8": "Grain Mill",
    "9": "Bakery",
    "10": "Warehouse",
    "11": "Granary",
    "13": "Smithy",
    "14": "Tournament Square",
    "15": "Main Building",
    "16": "Rally Point",
    "17": "Marketplace",
    "18": "Embassy",
    "19": "Barracks",
    "21": "Workshop",
    "23": "Cranny",
    "24": "Town Hall",
    "25": "Residence",
    "26": "Palace",
    "27": "Treasury",
    "28": "Trade Office",
    "29": "Great Barracks",
    "31": "City Wall",
    "32": "Earth Wall",
    "33": "Palisade",
    "34": "Stonemason's Lodge",
    "35": "Brewery",
    "36": "Trapper",
    "37": "Hero's Mansion",
    "38": "Great Warehouse",
    "39": "Great Granary",
    "41": "Horse Drinking Trough",
    "42": "Stone Wall",
    "43": "Makeshift Wall",
    "44": "Command Center",
    "45": "Waterworks",
    "20": "Stable",
    "22": "Academy",
    "30": "Great Stable",
    "40": "Wonder of the World",
    "46": "Hospital"
};
var CurrentPageEnum;
(function (CurrentPageEnum) {
    CurrentPageEnum["LOGIN"] = "LOGIN";
    CurrentPageEnum["FIELDS"] = "FIELDS";
    CurrentPageEnum["TOWN"] = "TOWN";
    CurrentPageEnum["BUILDING"] = "BUILDING";
    CurrentPageEnum["REPORT"] = "REPORT";
    CurrentPageEnum["OFF_REPORT"] = "OFF_REPORT";
    CurrentPageEnum["SCOUT_REPORT"] = "SCOUT_REPORT";
    CurrentPageEnum["UNKNOWN"] = "UNKNOWN";
})(CurrentPageEnum || (CurrentPageEnum = {}));
var CurrentActionEnum;
(function (CurrentActionEnum) {
    CurrentActionEnum["IDLE"] = "IDLE";
    CurrentActionEnum["BUILD"] = "BUILD";
    CurrentActionEnum["NAVIGATE_TO_FIELDS"] = "NAVIGATE_TO_FIELDS";
    CurrentActionEnum["SCOUT"] = "SCOUT";
    CurrentActionEnum["FARM"] = "FARM";
    CurrentActionEnum["EVADE"] = "EVADE";
    CurrentActionEnum["CUSTOM_FARM"] = "CUSTOM_FARM";
})(CurrentActionEnum || (CurrentActionEnum = {}));
var FarmType;
(function (FarmType) {
    FarmType["ATTACK"] = "ATTACK";
    FarmType["RAID"] = "RAID";
})(FarmType || (FarmType = {}));
class StateHandler {
    constructor() {
        this.parseState = (prop) => {
            let item = localStorage.getItem(prop);
            if (item === null)
                return StateHandler.INITIAL_STATE[prop];
            else
                return JSON.parse(item);
        };
        this.get = (obj, prop) => {
            return this.state[prop];
        };
        this.set = (obj, prop, value) => {
            localStorage.setItem(prop, JSON.stringify(value));
            //@ts-ignore
            this.state[prop] = value;
            this.callback && this.callback();
            return true;
        };
        this.setCallback = (callback) => {
            this.callback = callback;
        };
        this.state = Object.fromEntries(Object.keys(StateHandler.INITIAL_STATE)
            .map(k => [k, this.parseState(k)]));
    }
}
StateHandler.INITIAL_STATE = {
    currentAction: CurrentActionEnum.IDLE,
    currentPage: CurrentPageEnum.LOGIN,
    currentVillageId: '',
    villages: {},
    feature: {
        autoLogin: false,
        autoScan: false,
        autoBuild: false,
        alertAttack: false,
        alertEmptyBuildQueue: false,
        alertResourceCapacityFull: false,
        autoScout: false,
        autoFarm: false,
        disableReportChecking: false,
        disableStopOnLoss: false,
        autoCustomFarm: false,
        debug: false
    },
    nextVillageRotationTime: new Date(),
    nextScoutTime: new Date(),
    nextFarmTime: new Date(),
    nextCheckReportTime: new Date(),
    farmIntervalMinutes: { min: 2, max: 4 },
    plusEnabled: false,
    telegramChatId: '',
    telegramToken: '',
    username: '',
    password: ''
};
class Utils {
}
_a = Utils;
Utils.parseIntIgnoreNonNumeric = (text) => {
    return parseInt(text.replace(/[^0-9]/g, ''));
};
Utils.randInt = (x, y) => {
    return Math.floor(Math.random() * (y - x + 1) + x);
};
Utils.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
Utils.delayClick = () => __awaiter(void 0, void 0, void 0, function* () {
    yield Utils.sleep(Utils.randInt(1000, 2000));
});
Utils.addToDate = (date, hour, minute, second) => {
    return new Date(date.getTime() + hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000);
};
Utils.leftPadZero = (value, length) => {
    return String(value).padStart(length, '0');
};
Utils.formatDate = (dateInput) => {
    if (!dateInput) {
        return 'N/A';
    }
    const date = new Date(dateInput);
    return `${date.getFullYear()}/${Utils.leftPadZero(date.getMonth() + 1, 2)}/${Utils.leftPadZero(date.getDate(), 2)} ${Utils.leftPadZero(date.getHours(), 2)}:${Utils.leftPadZero(date.getMinutes(), 2)}:${Utils.leftPadZero(date.getSeconds(), 2)}`;
};
Utils.isSufficientResources = (required, own) => {
    return required.lumber <= own.lumber && required.clay <= own.clay && required.iron <= own.iron && required.crop <= own.crop;
};
Utils.sumRecord = (r1, r2) => {
    let result = {};
    Object.keys(r1).forEach(key => {
        if (!Object.keys(result).includes(key)) {
            result = Object.assign(Object.assign({}, result), { [key]: "0" });
        }
    });
    Object.keys(21).forEach(key => {
        if (!Object.keys(result).includes(key)) {
            result = Object.assign(Object.assign({}, result), { [key]: "0" });
        }
    });
    Object.entries(r1).map(([key, value]) => {
        if (!!value || !!r2[key]) {
            const r2Value = r2[key];
            result = Object.assign(Object.assign({}, result), { [key]: (parseInt(value) + parseInt(r2Value)).toString() });
        }
    });
    return result;
};
Utils.groupByAndSum = (records) => {
    return records.reduce((res, value) => Utils.sumRecord(res, value), {});
};
class Navigation {
}
_b = Navigation;
Navigation.goToVillage = (state, id, action) => __awaiter(void 0, void 0, void 0, function* () {
    yield Utils.delayClick();
    state.currentAction = action;
    state.feature.debug && console.log(`Go to village - [${id}]${state.villages[id].name}`);
    $(`.listEntry[data-did="${id}"] > a`)[0].click();
    return true;
});
Navigation.goToBuilding = (state, aid, gid, action) => __awaiter(void 0, void 0, void 0, function* () {
    if (aid <= 18 && state.currentPage === CurrentPageEnum.FIELDS) {
        yield Utils.delayClick();
        state.currentAction = action;
        state.feature.debug && console.log(`Go to building - [aid=${aid},gid=${gid}]${GID_NAME_MAP[gid]}`);
        $(`a[href="/build.php?id=${aid}"]`)[0].click();
        return true;
    }
    else if (aid > 18 && state.currentPage === CurrentPageEnum.TOWN) {
        yield Utils.delayClick();
        state.currentAction = action;
        state.feature.debug && console.log(`Go to building - [aid=${aid},gid=${gid}]${GID_NAME_MAP[gid]}`);
        if (aid === 40) { // Special case for wall
            $('#villageContent > div.buildingSlot.a40.top > svg > g.hoverShape > path').trigger('click');
        }
        else {
            $(`a[href="/build.php?id=${aid}&gid=${gid}"]`)[0].click();
        }
        return true;
    }
    else {
        state.feature.debug && console.log(`Cannot go to building - [aid=${aid},gid=${gid}]${GID_NAME_MAP[gid]}`);
        return false;
    }
});
Navigation.goToFields = (state, action) => __awaiter(void 0, void 0, void 0, function* () {
    yield Utils.delayClick();
    state.currentAction = action;
    state.feature.debug && console.log('Go to fields');
    $('.village.resourceView')[0].click();
    return true;
});
Navigation.goToTown = (state, action) => __awaiter(void 0, void 0, void 0, function* () {
    yield Utils.delayClick();
    state.currentAction = action;
    state.feature.debug && console.log('Go to town');
    $('.village.buildingView')[0].click();
    return true;
});
Navigation.goToReport = (state, action) => __awaiter(void 0, void 0, void 0, function* () {
    yield Utils.delayClick();
    state.currentAction = action;
    state.feature.debug && console.log('Go to report');
    $('.reports')[0].click();
    return true;
});
var TroopMovementType;
(function (TroopMovementType) {
    TroopMovementType["REINFORCE"] = "REINFORCE";
    TroopMovementType["ATTACK"] = "ATTACK";
    TroopMovementType["ADVENTURE"] = "ADVENTURE";
})(TroopMovementType || (TroopMovementType = {}));
const createStyle = () => {
    const style = document.createElement('style');
    style.textContent = `
        #console {
            background: white; 
            margin: 0 20px; 
            border-radius: 10px; 
            padding: 5px; 
        }
        
        #console .flex-row {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
        
        #console .village-container {
            flex: 0 1 33%;
            margin-top: 10px
        }
        
        #console .ml-5 {
            margin-left: 5px;
        }
        
        #console .mr-5 {
            margin-right: 5px;
        }
        
        .tjs-btn, #console button {
            border: 1px solid black;
            border-radius: 3px;
        }

        .tjs-pending {
            background: lightblue;
        }
    `;
    document.head.append(style);
};
const createContainer = () => {
    $('#footer').before(`
      <div id="console"/>
    `);
};
const updateCurrentPage = (state) => {
    let pathname = window.location.pathname;
    switch (pathname) {
        case '/dorf1.php': {
            state.currentPage = CurrentPageEnum.FIELDS;
            break;
        }
        case '/dorf2.php': {
            state.currentPage = CurrentPageEnum.TOWN;
            break;
        }
        case '/build.php': {
            state.currentPage = CurrentPageEnum.BUILDING;
            break;
        }
        case '/report':
        case '/report/overview': {
            state.currentPage = CurrentPageEnum.REPORT;
            break;
        }
        case '/report/offensive': {
            state.currentPage = CurrentPageEnum.OFF_REPORT;
            break;
        }
        case '/report/scouting': {
            state.currentPage = CurrentPageEnum.SCOUT_REPORT;
            break;
        }
        case '/': {
            state.currentPage = CurrentPageEnum.LOGIN;
            break;
        }
        default: {
            state.currentPage = CurrentPageEnum.UNKNOWN;
            break;
        }
    }
};
const login = (state) => __awaiter(void 0, void 0, void 0, function* () {
    if (!state.username || !state.password) {
        state.feature.debug && console.log("User name or password not set");
    }
    $('input[name=name]').val(state.username);
    $('input[name=password]').val(state.password);
    yield Utils.delayClick();
    $('button[type=submit]').trigger('click');
});
const updateVillageList = (state) => {
    const villages = state.villages;
    const villageListEle = $('.villageList .listEntry');
    if (!villageListEle.length) {
        state.feature.debug && console.log("Village list not found");
        return;
    }
    const currentVillageId = villageListEle.filter((_, ele) => ele.className.includes('active')).attr('data-did');
    const villiageIds = [];
    villageListEle.each((index, ele) => {
        var _c, _d, _e;
        const id = (_c = ele.attributes.getNamedItem('data-did')) === null || _c === void 0 ? void 0 : _c.value;
        if (!id) {
            return;
        }
        villiageIds.push(id);
        const name = $(ele).find('.name')[0].innerText;
        const coordinateAttributes = $(ele).find('.coordinatesGrid')[0].attributes;
        const x = Utils.parseIntIgnoreNonNumeric(((_d = coordinateAttributes.getNamedItem('data-x')) === null || _d === void 0 ? void 0 : _d.value) || '');
        const y = Utils.parseIntIgnoreNonNumeric(((_e = coordinateAttributes.getNamedItem('data-y')) === null || _e === void 0 ? void 0 : _e.value) || '');
        const villageDefaults = {
            id: '',
            name: '',
            position: { x: 0, y: 0 },
            index: -1,
            currentBuildTasks: [],
            pendingBuildTasks: [],
            incomingTroops: [],
            outgoingTroops: [],
            resources: {
                lumber: 0,
                clay: 0,
                iron: 0,
                crop: 0
            },
            capacity: {
                lumber: 0,
                clay: 0,
                iron: 0,
                crop: 0
            },
            autoEvade: false
        };
        villages[id] = Object.assign(Object.assign(Object.assign({}, villageDefaults), villages[id]), { id,
            name,
            index, position: { x, y } });
    });
    state.villages = Object.fromEntries(Object.entries(villages).filter(([id, _]) => villiageIds.includes(id)));
    if (currentVillageId)
        state.currentVillageId = currentVillageId;
};
const updateCurrentVillageStatus = (state) => {
    const villages = state.villages;
    const currentVillageId = state.currentVillageId;
    let lumber = Utils.parseIntIgnoreNonNumeric($('#l1')[0].innerText);
    let clay = Utils.parseIntIgnoreNonNumeric($('#l2')[0].innerText);
    let iron = Utils.parseIntIgnoreNonNumeric($('#l3')[0].innerText);
    let crop = Utils.parseIntIgnoreNonNumeric($('#l4')[0].innerText);
    villages[currentVillageId].resources = { lumber, clay, iron, crop };
    const warehouseCapacity = Utils.parseIntIgnoreNonNumeric($('.warehouse .capacity > div').text());
    const granaryCapacity = Utils.parseIntIgnoreNonNumeric($('.granary .capacity > div').text());
    villages[currentVillageId].capacity = {
        lumber: warehouseCapacity,
        clay: warehouseCapacity,
        iron: warehouseCapacity,
        crop: granaryCapacity
    };
    if ([CurrentPageEnum.FIELDS, CurrentPageEnum.TOWN].includes(state.currentPage)) {
        const currentBuildTasks = [];
        $('.buildingList > ul > li').each((_, ele) => {
            const nameAndLevelEle = $(ele).find('.name').contents();
            const name = $(nameAndLevelEle[0]).text().trim();
            const level = $(nameAndLevelEle[1]).text().trim();
            const timer = $(ele).find('.timer').text();
            const timerParts = timer.split(":");
            const finishTime = Utils.addToDate(new Date(), Utils.parseIntIgnoreNonNumeric(timerParts[0]), Utils.parseIntIgnoreNonNumeric(timerParts[1]), Utils.parseIntIgnoreNonNumeric(timerParts[2]));
            currentBuildTasks.push({
                name,
                level,
                finishTime
            });
        });
        villages[currentVillageId].currentBuildTasks = currentBuildTasks;
    }
    if (state.currentPage === CurrentPageEnum.FIELDS) {
        const incomingTroops = [];
        const outgoingTroops = [];
        $('#movements tr').each((_, ele) => {
            var _c;
            const typeEle = $(ele).find('.typ img');
            if (!typeEle.length)
                return;
            const type = (_c = typeEle[0].attributes.getNamedItem('class')) === null || _c === void 0 ? void 0 : _c.value;
            const count = Utils.parseIntIgnoreNonNumeric($(ele).find('.mov').text());
            const timer = $(ele).find('.timer').text();
            const timerParts = timer.split(":");
            const time = Utils.addToDate(new Date(), Utils.parseIntIgnoreNonNumeric(timerParts[0]), Utils.parseIntIgnoreNonNumeric(timerParts[1]), Utils.parseIntIgnoreNonNumeric(timerParts[2]));
            switch (type) {
                case 'def1':
                    incomingTroops.push({
                        type: TroopMovementType.REINFORCE,
                        count,
                        time
                    });
                    break;
                case 'hero_on_adventure':
                    outgoingTroops.push({
                        type: TroopMovementType.ADVENTURE,
                        count,
                        time
                    });
                    break;
                case 'att2':
                    outgoingTroops.push({
                        type: TroopMovementType.ATTACK,
                        count,
                        time
                    });
                    break;
                case 'att1':
                    if (villages[currentVillageId].autoEvade && villages[currentVillageId].evadeRaidPosition) {
                        villages[currentVillageId].evadeTime = Utils.addToDate(time, 0, -1, 0);
                    }
                case 'att3':
                    incomingTroops.push({
                        type: TroopMovementType.ATTACK,
                        count,
                        time
                    });
                    break;
            }
        });
        villages[currentVillageId].incomingTroops = incomingTroops;
        villages[currentVillageId].outgoingTroops = outgoingTroops;
        villages[currentVillageId].lastUpdatedTime = new Date();
    }
    state.villages = villages;
};
const alertAttack = (state, village, attackTime) => {
    const villages = state.villages;
    if (!state.telegramChatId || !state.telegramToken) {
        state.feature.debug && console.log("Telegram chat id or token not set");
        return;
    }
    if (village) {
        if (!village.attackAlertBackoff || new Date(village.attackAlertBackoff) < new Date()) {
            state.feature.debug && console.log(`Send alert for attack at village ${village.name}`);
            village.attackAlertBackoff = Utils.addToDate(new Date(), 0, 5, 0);
            state.villages = villages;
            fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Village ${village.name} under attack ${attackTime && `at ${Utils.formatDate(attackTime)}`}`);
        }
        else {
            state.feature.debug && console.log(`Not alerting attack due to backoff at ${Utils.formatDate(village.attackAlertBackoff)}`);
        }
    }
    else {
        fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Village is under attack`);
    }
};
const informTroopsEvaded = (state, village) => {
    const villages = state.villages;
    if (!state.telegramChatId || !state.telegramToken) {
        state.feature.debug && console.log("Telegram chat id or token not set");
        return;
    }
    if (village) {
        fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Village ${village.name} troops evaded at ${new Date()}`);
    }
    else {
        fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Troops evaded at ${new Date()}`);
    }
};
const checkIncomingAttack = (state) => {
    var _c;
    const villages = state.villages;
    const village = villages[state.currentVillageId];
    const attack = village.incomingTroops.find(e => e.type === TroopMovementType.ATTACK);
    if (attack) {
        alertAttack(state, village, attack.time);
    }
    const plusNoAttack = $('.sidebar #sidebarBoxVillagelist .content .villageList .listEntry:not(.attack) .iconAndNameWrapper svg.attack').filter((_, attack) => $(attack).css('visibility') === 'hidden');
    const villageIdBeingAttacked = (_c = $('div.listEntry.attack').find('.attack').parent().parent().parent().attr('href')) === null || _c === void 0 ? void 0 : _c.split('newdid=')[1].split('&')[0];
    if (plusNoAttack.length !== Object.keys(villages).length && villageIdBeingAttacked) {
        const villageBeingAttacked = villages[villageIdBeingAttacked];
        if (!villageBeingAttacked.attackAlertBackoff || new Date(villageBeingAttacked.attackAlertBackoff) < new Date()) {
            alertAttack(state, !!villageIdBeingAttacked ? villages[villageIdBeingAttacked] : undefined);
            villageIdBeingAttacked && villageIdBeingAttacked !== state.currentVillageId && Navigation.goToVillage(state, villageIdBeingAttacked, CurrentActionEnum.IDLE);
        }
    }
};
const alertEmptyBuildQueue = (state) => {
    const villages = state.villages;
    const village = villages[state.currentVillageId];
    if (!village.currentBuildTasks.length) {
        if (!state.telegramChatId || !state.telegramToken) {
            state.feature.debug && console.log("Telegram chat id or token not set");
            return;
        }
        if (!village.emptyBuildQueueAlertBackoff || new Date(village.emptyBuildQueueAlertBackoff) < new Date()) {
            state.feature.debug && console.log(`Send alert for attack at village ${village.name}`);
            village.emptyBuildQueueAlertBackoff = Utils.addToDate(new Date(), 0, 5, 0);
            state.villages = villages;
            fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Village ${village.name} build queue is empty`);
        }
        else {
            state.feature.debug && console.log(`Not alerting empty build queue due to backoff at ${Utils.formatDate(village.emptyBuildQueueAlertBackoff)}`);
        }
    }
};
const alertResourceCapacityFull = (state) => {
    const villages = state.villages;
    const village = villages[state.currentVillageId];
    let fullResourceType = '';
    if (village.resources.lumber === village.capacity.lumber) {
        fullResourceType = 'lumber';
    }
    if (village.resources.clay === village.capacity.clay) {
        fullResourceType = 'clay';
    }
    if (village.resources.iron === village.capacity.iron) {
        fullResourceType = 'iron';
    }
    if (village.resources.crop === village.capacity.crop) {
        fullResourceType = 'crop';
    }
    if (fullResourceType) {
        if (!state.telegramChatId || !state.telegramToken) {
            state.feature.debug && console.log("Telegram chat id or token not set");
            return;
        }
        if (!village.resourceCapacityFullAlertBackoff || new Date(village.resourceCapacityFullAlertBackoff) < new Date()) {
            state.feature.debug && console.log(`Send alert for capacity full for ${fullResourceType} at village ${village.name}`);
            village.resourceCapacityFullAlertBackoff = Utils.addToDate(new Date(), 0, 5, 0);
            state.villages = villages;
            fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Village ${village.name} ${fullResourceType} is at capacity`);
        }
        else {
            state.feature.debug && console.log(`Not alerting capacity full due to backoff at ${Utils.formatDate(village.resourceCapacityFullAlertBackoff)}`);
        }
    }
};
const build = (state) => __awaiter(void 0, void 0, void 0, function* () {
    // Try building in current village
    const villages = state.villages;
    const village = villages[state.currentVillageId];
    const buildQueueThreshold = state.plusEnabled ? 2 : 1;
    if (village.pendingBuildTasks.length > 0) {
        const task = village.pendingBuildTasks[0];
        if (village.currentBuildTasks.length < buildQueueThreshold
            && [CurrentPageEnum.FIELDS, CurrentPageEnum.TOWN].includes(state.currentPage)
            && Utils.isSufficientResources(task.resources, village.resources)) {
            const success = yield Navigation.goToBuilding(state, task.aid, task.gid, CurrentActionEnum.BUILD);
            if (!success) {
                if (state.currentPage === CurrentPageEnum.FIELDS)
                    yield Navigation.goToTown(state, CurrentActionEnum.BUILD);
                else
                    yield Navigation.goToFields(state, CurrentActionEnum.BUILD);
            }
            return;
        }
        const params = new URLSearchParams(window.location.search);
        const aid = params.get('id');
        const gid = params.get('gid');
        if (state.currentPage === CurrentPageEnum.BUILDING
            && aid === `${task.aid}`
            && (gid === `${task.gid}` || task.gid === -1)) {
            // Prevent infinite loop due to mismatch in resources requirements
            const resourceRequirementEle = $('#contract .value');
            if (!resourceRequirementEle.length) {
                return;
            }
            const lumber = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[0].innerText);
            const clay = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[1].innerText);
            const iron = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[2].innerText);
            const crop = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[3].innerText);
            village.pendingBuildTasks[0].resources = { lumber, clay, iron, crop };
            state.villages = villages;
            const bulidButton = $('.section1 > button.green');
            if (bulidButton.length) {
                yield Utils.delayClick();
                state.currentAction = CurrentActionEnum.IDLE;
                village.pendingBuildTasks.splice(0, 1);
                state.villages = villages;
                bulidButton.trigger('click');
                return;
            }
        }
    }
    // Check if need to build in another village
    const nextVillageIdToBuild = Object.entries(state.villages)
        .filter(([_, village]) => village.pendingBuildTasks.length > 0
        && village.currentBuildTasks.filter(task => new Date(task.finishTime) > new Date()).length < buildQueueThreshold
        && Utils.isSufficientResources(village.pendingBuildTasks[0].resources, village.resources))
        .map(([id, _]) => id)
        .find(_ => true);
    if (nextVillageIdToBuild) {
        yield Navigation.goToVillage(state, nextVillageIdToBuild, CurrentActionEnum.NAVIGATE_TO_FIELDS);
    }
    else {
        state.feature.debug && console.log("Nothing to build in other villages");
        state.currentAction = CurrentActionEnum.IDLE;
    }
});
const scout = (state) => __awaiter(void 0, void 0, void 0, function* () {
    if (new Date(state.nextScoutTime) < new Date()) {
        const params = new URLSearchParams(window.location.search);
        if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') === '99') {
            const startButtonEle = $('.startButton[value=Start]').filter((_, button) => {
                return $(button).parent().parent().find('.listName').find('span').text() === "Scout";
            });
            for (let i = 0; i < startButtonEle.length; i++) {
                yield Utils.delayClick();
                startButtonEle[i].click();
            }
            state.nextScoutTime = Utils.addToDate(new Date(), 0, Utils.randInt(30, 40), 0);
            yield Navigation.goToFields(state, CurrentActionEnum.IDLE);
            return;
        }
        else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') !== '99') {
            yield Utils.delayClick();
            $('a[href="/build.php?id=39&gid=16&tt=99"]')[0].click();
            return;
        }
        else if (state.currentPage === CurrentPageEnum.TOWN) {
            yield Navigation.goToBuilding(state, 39, 16, CurrentActionEnum.SCOUT);
            return;
        }
        else {
            yield Navigation.goToTown(state, CurrentActionEnum.SCOUT);
            return;
        }
    }
});
const farm = (state) => __awaiter(void 0, void 0, void 0, function* () {
    if (new Date(state.nextFarmTime) < new Date()) {
        const params = new URLSearchParams(window.location.search);
        if (state.currentPage === CurrentPageEnum.REPORT) {
            yield Utils.delayClick();
            $('a[href="/report/offensive"]')[0].click();
            return;
        }
        else if (state.currentPage === CurrentPageEnum.OFF_REPORT) {
            const unreadReports = $("#overview > tbody").find(".messageStatusUnread");
            // const unreadReports = $("#overview > tbody").find(".messageStatusUnread")
            //     .filter((_, msg) => !$($(msg).parent().parent().find('a')[2]).text().includes("Unoccupied oasis"))
            state.feature.debug && console.log("Unread report: " + unreadReports.length);
            if (unreadReports.length > 0) {
                if (!state.feature.disableStopOnLoss) {
                    const feature = state.feature;
                    feature.autoFarm = false;
                    state.feature = feature;
                }
                fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Losses occurred, please check the offensive report`);
            }
            state.nextCheckReportTime = Utils.addToDate(new Date(), 0, 1, 0);
            yield Navigation.goToTown(state, CurrentActionEnum.FARM);
            return;
        }
        else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') === '99') {
            const startButtonEle = $('.startButton[value=Start]').filter((_, button) => {
                return $(button).parent().parent().find('.listName').find('span').text() !== "Scout";
            });
            for (let i = 0; i < startButtonEle.length; i++) {
                yield Utils.delayClick();
                startButtonEle[i].click();
            }
            state.nextFarmTime = Utils.addToDate(new Date(), 0, Utils.randInt(state.farmIntervalMinutes.min, state.farmIntervalMinutes.max), Utils.randInt(0, 59));
            yield Navigation.goToFields(state, CurrentActionEnum.IDLE);
            return;
        }
        else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') !== '99') {
            yield Utils.delayClick();
            $('a[href="/build.php?id=39&gid=16&tt=99"]')[0].click();
            return;
        }
        else if (state.currentPage === CurrentPageEnum.TOWN) {
            if (new Date(state.nextCheckReportTime) < new Date() && !state.feature.disableReportChecking) {
                yield Navigation.goToReport(state, CurrentActionEnum.FARM);
            }
            else {
                yield Navigation.goToBuilding(state, 39, 16, CurrentActionEnum.FARM);
            }
            return;
        }
        else {
            if (new Date(state.nextCheckReportTime) < new Date() && !state.feature.disableReportChecking) {
                yield Navigation.goToReport(state, CurrentActionEnum.FARM);
            }
            else {
                yield Navigation.goToTown(state, CurrentActionEnum.FARM);
            }
            return;
        }
    }
});
const checkAutoEvade = (state) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const params = new URLSearchParams(window.location.search);
    const villages = state.villages;
    const villageRequireEvade = Object.values(villages).filter(v => !!v.evadeTime).find(v => v.autoEvade && new Date(v.evadeTime) < new Date());
    if (villageRequireEvade) {
        if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') !== '2') {
            yield Utils.delayClick();
            $('a[href="/build.php?id=39&gid=16&tt=2"]')[0].click();
            return;
        }
        else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('gid') === '16' && params.get('tt') === '2') {
            if (state.currentVillageId !== villageRequireEvade.id) {
                yield Navigation.goToVillage(state, villageRequireEvade.id, CurrentActionEnum.EVADE);
                return;
            }
            yield Utils.delayClick();
            const sendTroopButton = $("#ok");
            const confirmButton = $("#checksum");
            if (sendTroopButton.length > 0) {
                $("#troops > tbody").find("td").each((column, td) => {
                    const troopInput = $(td).find("input");
                    troopInput.val('99999');
                });
                if (((_c = villageRequireEvade.evadeRaidPosition) === null || _c === void 0 ? void 0 : _c.x) && ((_d = villageRequireEvade.evadeRaidPosition) === null || _d === void 0 ? void 0 : _d.y)) {
                    $("#xCoordInput").val(villageRequireEvade.evadeRaidPosition.x);
                    $("#yCoordInput").val(villageRequireEvade.evadeRaidPosition.y);
                }
                $('.radio')[2].click();
                sendTroopButton[0].click();
            }
            else if (confirmButton.length > 0) {
                yield Utils.delayClick();
                confirmButton[0].click();
            }
            return;
        }
        else if (state.currentPage === CurrentPageEnum.BUILDING && state.currentAction === CurrentActionEnum.EVADE
            && params.get('gid') === '16' && params.get('tt') === '1') {
            informTroopsEvaded(state, villageRequireEvade);
            delete villageRequireEvade.evadeTime;
            state.villages = villages;
            yield Navigation.goToFields(state, CurrentActionEnum.IDLE);
            return;
        }
        else if (state.currentPage === CurrentPageEnum.TOWN) {
            console.log("Go to building");
            yield Navigation.goToBuilding(state, 39, 16, CurrentActionEnum.EVADE);
            return;
        }
        else {
            yield Navigation.goToTown(state, CurrentActionEnum.EVADE);
            return;
        }
    }
});
const executeCustomFarm = (state, idx) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const params = new URLSearchParams(window.location.search);
    const villages = state.villages;
    const village = villages[state.currentVillageId];
    const customFarm = (_e = village.customFarms) === null || _e === void 0 ? void 0 : _e[idx];
    if (customFarm) {
        if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') !== '2') {
            yield Utils.delayClick();
            $('a[href="/build.php?id=39&gid=16&tt=2"]')[0].click();
            return;
        }
        else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('gid') === '16' && params.get('tt') === '2') {
            yield Utils.delayClick();
            const sendTroopButton = $("#ok");
            const confirmButton = $("#checksum");
            if (sendTroopButton.length > 0) {
                for (const troopKey of Object.keys(customFarm.troops)) {
                    if (customFarm.troops[troopKey]) {
                        state.feature.debug && (console.log("Troop Key: ", troopKey));
                        const troopInputEle = $(`input[name="${troopKey}"]`);
                        if (troopInputEle.prop('disabled')) {
                            village.customFarms[idx].nextCustomFarmTime = Utils.addToDate(new Date(), 0, 1, 0);
                            state.villages = villages;
                            yield Navigation.goToTown(state, CurrentActionEnum.IDLE);
                            return;
                        }
                        troopInputEle[0].click();
                        troopInputEle.val(customFarm.troops[troopKey]);
                    }
                }
                $("#xCoordInput").val(customFarm.position.x);
                $("#yCoordInput").val(customFarm.position.y);
                if (customFarm.type === FarmType.ATTACK) {
                    $('.radio')[1].click();
                }
                else {
                    $('.radio')[2].click();
                }
                yield Utils.delayClick();
                sendTroopButton[0].click();
            }
            else if (confirmButton.length > 0) {
                yield Utils.delayClick();
                confirmButton[0].click();
            }
            return;
        }
        else if (state.currentPage === CurrentPageEnum.BUILDING && state.currentAction === CurrentActionEnum.CUSTOM_FARM
            && params.get('gid') === '16' && params.get('tt') === '1') {
            village.customFarms[idx].nextCustomFarmTime = Utils.addToDate(new Date(), 0, Utils.randInt(customFarm.farmIntervalMinutes.min, customFarm.farmIntervalMinutes.max), Utils.randInt(0, 10));
            state.villages = villages;
            yield Navigation.goToFields(state, CurrentActionEnum.IDLE);
            return;
        }
        else if (state.currentPage === CurrentPageEnum.TOWN) {
            yield Navigation.goToBuilding(state, 39, 16, CurrentActionEnum.CUSTOM_FARM);
            return;
        }
        else {
            yield Navigation.goToTown(state, CurrentActionEnum.CUSTOM_FARM);
            return;
        }
    }
});
const customFarm = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const villages = state.villages;
    const customFarms = villages[state.currentVillageId].customFarms || [];
    // Check current village custom farm
    for (const idxStr in customFarms) {
        const idx = parseInt(idxStr);
        const customFarm = customFarms[idx];
        if (customFarm.nextCustomFarmTime) {
            // @ts-ignore
            if (new Date(customFarm.nextCustomFarmTime) < new Date()) {
                state.feature.debug && console.log("Execute custom farm");
                yield executeCustomFarm(state, idx);
                return;
            }
        }
    }
    // Check other villages
    const nextVillageIdToCustomFarm = Object.entries(state.villages)
        .filter(([_, village]) => village.id !== state.currentVillageId &&
        village.customFarms &&
        village.customFarms.length > 0 &&
        village.customFarms.some(customFarm => customFarm.nextCustomFarmTime && new Date(customFarm.nextCustomFarmTime) < new Date())).map(([id, _]) => id)
        .find(_ => true);
    if (nextVillageIdToCustomFarm) {
        state.feature.debug && console.log("Go to village");
        yield Navigation.goToVillage(state, nextVillageIdToCustomFarm, CurrentActionEnum.NAVIGATE_TO_FIELDS);
    }
    else {
        state.feature.debug && console.log("No custom farm required in other villages");
        state.currentAction = CurrentActionEnum.IDLE;
    }
});
const nextVillage = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const nextRotationTime = new Date(state.nextVillageRotationTime);
    const currentTime = new Date();
    if (nextRotationTime < new Date()) {
        state.nextVillageRotationTime = Utils.addToDate(new Date(), 0, Utils.randInt(5, 10), 0);
        let earliestVillageId = Object.keys(state.villages)[0];
        Object.values(state.villages)
            .forEach(village => {
            var _c;
            const earliestUpdatedTime = (_c = state.villages[earliestVillageId]) === null || _c === void 0 ? void 0 : _c.lastUpdatedTime;
            if (!village.lastUpdatedTime || (earliestUpdatedTime && village.lastUpdatedTime < earliestUpdatedTime)) {
                earliestVillageId = village.id;
            }
        });
        state.feature.debug && console.log(`Rotating to ${state.villages[earliestVillageId].name}`);
        yield Navigation.goToVillage(state, earliestVillageId, CurrentActionEnum.NAVIGATE_TO_FIELDS);
    }
    else {
        state.feature.debug && console.log(`Not rotating, next rotation=${Utils.formatDate(nextRotationTime)}, current=${Utils.formatDate(currentTime)}`);
    }
});
const handleFeatureToggle = (selector, state, key) => {
    $(selector).on('click', () => {
        const feature = state.feature;
        feature[key] = !feature[key];
        state.feature = feature;
    });
};
const render = (state) => {
    if (state.currentPage === CurrentPageEnum.BUILDING) {
        const btn = '<button id="addCurrentToPendingInBuilding" class="tjs-btn addCurrentToPending">Add to queue</button>';
        if ($('#addCurrentToPendingInBuilding').length === 0)
            $('.upgradeBuilding').after(btn);
        else
            $('#addCurrentToPendingInBuilding').replaceWith(btn);
    }
    const villages = state.villages;
    const currentVillage = villages[state.currentVillageId];
    const params = new URLSearchParams(window.location.search);
    if (currentVillage && [CurrentPageEnum.FIELDS, CurrentPageEnum.TOWN].includes(state.currentPage)) {
        const records = currentVillage.pendingBuildTasks.reduce((group, task) => {
            group[task.aid] = group[task.aid] || 0;
            group[task.aid]++;
            return group;
        }, {});
        const classNamePrefix = state.currentPage === CurrentPageEnum.FIELDS ? "buildingSlot" : "aid";
        $('.tjs-pending').remove();
        Object.entries(records).forEach(([id, count]) => {
            const div = `<div class="tjs-pending">+${count}</div>`;
            if ($(`.${classNamePrefix}${id} .tjs-pending`).length === 0) {
                $(`.${classNamePrefix}${id} .labelLayer`).after(div);
            }
            else {
                $(`.${classNamePrefix}${id} .tjs-pending`).replaceWith(div);
            }
        });
    }
    if ([CurrentPageEnum.REPORT, CurrentPageEnum.OFF_REPORT, CurrentPageEnum.SCOUT_REPORT].includes(state.currentPage)) {
        const resourcesFromReport = {
            lumber: 0,
            clay: 0,
            iron: 0,
            crop: 0
        };
        resourcesFromReport.lumber = Utils.parseIntIgnoreNonNumeric($($('.resources').find('span.value')[0]).text());
        resourcesFromReport.clay = Utils.parseIntIgnoreNonNumeric($($('.resources').find('span.value')[1]).text());
        resourcesFromReport.iron = Utils.parseIntIgnoreNonNumeric($($('.resources').find('span.value')[2]).text());
        resourcesFromReport.crop = Utils.parseIntIgnoreNonNumeric($($('.resources').find('span.value')[3]).text());
        const sum = resourcesFromReport.lumber + resourcesFromReport.clay + resourcesFromReport.iron + resourcesFromReport.crop;
        const cranny = Utils.parseIntIgnoreNonNumeric($('.rArea').text());
        const troops70 = `<div id="troops-required-70">Troops Required: ${Math.ceil((sum - cranny * 4) / 70)} | ${Math.ceil((sum - (cranny * 0.85) * 4) / 70)} with hero (70 per troop)</div>`;
        if ($('#troops-required-70').length === 0)
            $(".additionalInformation").after(troops70);
        else
            $('#troops-required-70').replaceWith(troops70);
        const troops50 = `<div id="troops-required-50">Troops Required: ${Math.ceil((sum - cranny * 4) / 50)} | ${Math.ceil((sum - (cranny * 0.85) * 4) / 50)} with hero (50 per troop)</div>`;
        if ($('#troops-required-50').length === 0)
            $(".additionalInformation").after(troops50);
        else
            $('#troops-required-50').replaceWith(troops50);
        let total = 0;
        // @ts-ignore
        $('.reportInfo.carry').each((_, carry) => total += parseInt($(carry).attr("alt").split('/')[0] || '0'));
        const totalResources = `<div id="total-res">Total Resouces: ${total}</div>`;
        if ($('#total-res').length === 0)
            $(".footer").after(totalResources);
        else
            $('#total-res').replaceWith(totalResources);
    }
    if (state.currentPage === CurrentPageEnum.BUILDING && params.get('gid') === '16' && params.get('tt') === '2') {
        const x = parseInt($("#xCoordInput").val());
        const y = parseInt($("#yCoordInput").val());
        if ((currentVillage.customFarms || []).find(customFarm => customFarm.position.x === x && customFarm.position.y === y)) {
            const customFarmWarning = `<div id="custom-farm-warning"><br/><br/>This position is included in custom farm already</div>`;
            if ($('#custom-farm-warning').length === 0)
                $("#ok").after(customFarmWarning);
            else
                $('#custom-farm-warning').replaceWith(customFarmWarning);
        }
    }
    $('#console').html(`
        <div class="flex-row">
            <h4>Console</h4>
            <input id="toggleAutoLogin" class="ml-5" type="checkbox" ${state.feature.autoLogin ? 'checked' : ''}/> Auto login
            <input id="toggleAutoScan" class="ml-5" type="checkbox" ${state.feature.autoScan ? 'checked' : ''}/> Auto village rotation
            <input id="toggleAutoBuild" class="ml-5" type="checkbox" ${state.feature.autoBuild ? 'checked' : ''}/> Auto build
            <input id="toggleAutoScout" class="ml-5" type="checkbox" ${state.feature.autoScout ? 'checked' : ''}/> Auto scout
            <input id="toggleAutoFarm" class="ml-5" type="checkbox" ${state.feature.autoFarm ? 'checked' : ''}/> Auto farm
            <input id="toggleDisableReportChecking" class="ml-5" type="checkbox" ${state.feature.disableReportChecking ? 'checked' : ''}/> Disable report checking
            <input id="toggleDisableStopOnLoss" class="ml-5" type="checkbox" ${state.feature.disableStopOnLoss ? 'checked' : ''}/> Disable stop on loss
            <input id="toggleAutoCustomFarm" class="ml-5" type="checkbox" ${state.feature.autoCustomFarm ? 'checked' : ''}/> Auto custom farm
            <input id="toggleAlertAttack" class="ml-5" type="checkbox" ${state.feature.alertAttack ? 'checked' : ''}/> Alert attack
            <input id="toggleAlertEmptyBuildQueue" class="ml-5" type="checkbox" ${state.feature.alertEmptyBuildQueue ? 'checked' : ''}/> Alert empty build queue
            <input id="toggleAlertResourceCapacityFull" class="ml-5" type="checkbox" ${state.feature.alertResourceCapacityFull ? 'checked' : ''}/> Alert resource capacity full
            <input id="toggleDebug" class="ml-5" type="checkbox" ${state.feature.debug ? 'checked' : ''}/> Debug
        </div>
        <div>
            <h4>Summary (Build: ${BUILD_TIME})</h4>
            <div>Current Page: ${state.currentPage} (Last render: ${Utils.formatDate(new Date())})</div>
            <div>Current Action: ${state.currentAction}</div>
            <div>Interval Range: ${state.farmIntervalMinutes.min}mins - ${state.farmIntervalMinutes.max}mins</div>
            <div class="flex-row">
                <input id="minFarmMinutes" style="width: 5%">min</input>
                <input id="maxFarmMinutes" style="width: 5%">max</input>
                <button id="updateFarmInterval" class="ml-5">Update</button>
            </div>
            <div>Next rotation: ${Utils.formatDate(state.nextVillageRotationTime)}</div>
            <div>Next scout: ${Utils.formatDate(state.nextScoutTime)}</div>
            <div>Next farm: ${Utils.formatDate(state.nextFarmTime)}</div>
        </div>
        <div>
            <h4>Action</h4>
            ${state.currentPage === CurrentPageEnum.FIELDS ? '<button id="addAllFields">Add all fields</button>' : ''}
        </div>
        <br />
        <div class="flex-row">
            ${Object.entries(villages).map(([id, village]) => `
                <div class="village-container">
                    <h4>${village.name} (id: ${id}) (${village.position.x}, ${village.position.y})</h4>
                    <br />
                    <div>Last update: ${Utils.formatDate(village.lastUpdatedTime)}</div>
                    <div>Attack alert backoff: ${Utils.formatDate(village.attackAlertBackoff)}</div>
                    <div>Empty build queue alert backoff: ${Utils.formatDate(village.emptyBuildQueueAlertBackoff)}</div>
                    ${village.customFarms && `<div>
                            Custom farm summary: ${Object.entries(Utils.groupByAndSum(village.customFarms.map(customFarm => customFarm.troops))).map((key, value) => `<div>${key}: ${value}</div>`)}
                    </div>`}
                    <br />
                    ${state.currentPage === CurrentPageEnum.BUILDING && state.currentVillageId === village.id && params.get('gid') === '16' && params.get('tt') === '2' ?
        `<div class="flex-row">
                            <input id="minCustomFarmMinutes" style="width: 5%">min</input>
                            <input id="maxCustomFarmMinutes" style="width: 5%">max</input>
                            <button id="addCurrentToCustomFarm" class="ml-5">Add Current</button>
                        </div>`
        : ''}
                    ${(village.customFarms || []).map((customFarm, idx) => `                    
                    <div class="flex-row">
                        <div>Next custom farm time: ${Utils.formatDate(customFarm.nextCustomFarmTime)}</div>
                    </div>
                        <div>Target: (${customFarm.position.x}|${customFarm.position.y})</div>
                        <div>Troops: ${Object.keys(customFarm.troops).filter(key => customFarm.troops[key]).map(key => key + ": " + customFarm.troops[key]).join(", ")}</div>
                        <div>Interval Range: ${customFarm.farmIntervalMinutes.min}mins - ${customFarm.farmIntervalMinutes.max}mins</div>
                        <div>Type: ${customFarm.type === FarmType.ATTACK ? 'Attack' : 'Raid'}</div>
                        <button class="removeCustomFarm" village-id="${id}" idx="${idx}">x</button>`)}
                    <br />
                    <h5>Auto Evade</h5>
                    <div>Evade Raid Target: ${village.evadeRaidPosition ? `(${village.evadeRaidPosition.x}|${village.evadeRaidPosition.y})` : 'N/A'}</div>
                    <div class="flex-row">
                        <input id="evadeRaidTargetX-${id}" style="width: 5%">x</input>
                        <input id="evadeRaidTargetY-${id}" style="width: 5%">y</input>
                        <button id="updateEvadeRaidTarget-${id}" class="ml-5">Update</button>
                    </div>
                    <input id="toggleAutoEvade-${id}" class="ml-5" type="checkbox" ${village.autoEvade ? 'checked' : ''} />Enable Auto Evade
                    
                    <br />
                    <h5>Resources</h5>
                    <div>Lumber: ${village.resources.lumber} Clay: ${village.resources.clay} Iron: ${village.resources.iron} Crop: ${village.resources.crop}</div>
                    <br />
                    <h5>Current build tasks</h5>
                    ${village.currentBuildTasks.map(task => `
                        <div>${task.name} ${task.level} ${Utils.formatDate(task.finishTime)}</div>
                    `).join('')}
                    <br />
                    <div class="flex-row">
                        <h5>Pending build tasks</h5> 
                        ${state.currentPage === CurrentPageEnum.BUILDING && state.currentVillageId === village.id ? `<button class="addCurrentToPending" class="ml-5">Add Current</button>` : ''}
                    </div>
                    ${village.pendingBuildTasks.map((task, i) => `
                        <div>
                            <span>Position: ${task.aid}</span>
                            <span>${GID_NAME_MAP[task.gid]}</span>
                            <button class="removeFromPending" village-id="${id}" idx="${i}">x</button>
                        </div>
                    `).join('')}
                    <br />
                    <h5>Incoming Troop Movements</h5>
                    ${village.incomingTroops.map(troop => `
                        <div>${troop.type} ${troop.count} ${Utils.formatDate(troop.time)}</div>
                    `).join('')}
                    <br />
                    <h5>Outgoing Troop Movements</h5>
                    ${village.outgoingTroops.map(troop => `
                        <div>${troop.type} ${troop.count} ${Utils.formatDate(troop.time)}</div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `);
    Object.values(villages).forEach(village => {
        $(`#updateEvadeRaidTarget-${village.id}`).on('click', () => {
            const villages = state.villages;
            const positionX = parseInt($(`#evadeRaidTargetX-${village.id}`).val());
            const positionY = parseInt($(`#evadeRaidTargetY-${village.id}`).val());
            village.evadeRaidPosition = {
                x: positionX,
                y: positionY
            };
            state.villages = villages;
        });
        $(`#toggleAutoEvade-${village.id}`).on('click', () => {
            let autoEvade = village.autoEvade;
            autoEvade = !autoEvade;
            village.autoEvade = autoEvade;
            state.villages = villages;
        });
    });
    state.currentPage === CurrentPageEnum.BUILDING && params.get('gid') === '16' && params.get('tt') === '2' &&
        $('#addCurrentToCustomFarm').on('click', () => {
            const villages = state.villages;
            let customFarm = {
                position: {
                    "x": -999,
                    "y": -999
                },
                type: FarmType.RAID,
                farmIntervalMinutes: {
                    "min": 999,
                    "max": 999
                },
                troops: {}
            };
            $("#troops > tbody").find("td").each((column, td) => {
                const troopInput = $(td).find("input");
                const troopKey = troopInput.attr('name');
                const troopCount = troopInput.val();
                if (troopKey && troopInput && !!troopCount) {
                    customFarm.troops[troopKey] = troopCount;
                }
            });
            const typeString = $('input[type=radio]:checked').parent().text();
            customFarm.type = typeString.includes('Normal') ? FarmType.ATTACK : FarmType.RAID;
            customFarm.position.x = parseInt($("#xCoordInput").val());
            customFarm.position.y = parseInt($("#yCoordInput").val());
            customFarm.farmIntervalMinutes.min = parseInt($("#minCustomFarmMinutes").val());
            customFarm.farmIntervalMinutes.max = parseInt($("#maxCustomFarmMinutes").val());
            customFarm.nextCustomFarmTime = new Date();
            currentVillage.customFarms = (currentVillage.customFarms || []).concat(customFarm);
            state.villages = villages;
        });
    $('.removeCustomFarm').on('click', (ele) => {
        var _c, _d, _e;
        const idx = (_c = ele.target.attributes.getNamedItem('idx')) === null || _c === void 0 ? void 0 : _c.value;
        const villageId = (_d = ele.target.attributes.getNamedItem('village-id')) === null || _d === void 0 ? void 0 : _d.value;
        if (!idx || !villageId)
            return;
        const villages = state.villages;
        (_e = villages[villageId].customFarms) === null || _e === void 0 ? void 0 : _e.splice(Utils.parseIntIgnoreNonNumeric(idx), 1);
        state.villages = villages;
    });
    state.currentPage === CurrentPageEnum.BUILDING && $('.addCurrentToPending').on('click', () => {
        const villages = state.villages;
        const pendingBuildTasks = currentVillage.pendingBuildTasks;
        const params = new URLSearchParams(window.location.search);
        const aid = params.get('id');
        const gid = params.get('gid');
        if (!aid || !gid) {
            return;
        }
        const resourceRequirementEle = $('#contract .value');
        if (!resourceRequirementEle.length) {
            return;
        }
        const lumber = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[0].innerText);
        const clay = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[1].innerText);
        const iron = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[2].innerText);
        const crop = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[3].innerText);
        pendingBuildTasks.push({
            aid: Utils.parseIntIgnoreNonNumeric(aid),
            gid: Utils.parseIntIgnoreNonNumeric(gid),
            resources: {
                lumber,
                clay,
                iron,
                crop
            }
        });
        state.villages = villages;
    });
    $('.removeFromPending').on('click', (ele) => {
        var _c, _d;
        const idx = (_c = ele.target.attributes.getNamedItem('idx')) === null || _c === void 0 ? void 0 : _c.value;
        const villageId = (_d = ele.target.attributes.getNamedItem('village-id')) === null || _d === void 0 ? void 0 : _d.value;
        if (!idx || !villageId)
            return;
        const villages = state.villages;
        villages[villageId].pendingBuildTasks.splice(Utils.parseIntIgnoreNonNumeric(idx), 1);
        state.villages = villages;
    });
    state.currentPage === CurrentPageEnum.FIELDS && $('#addAllFields').on('click', (ele) => {
        const villages = state.villages;
        const pendingBuildTasks = currentVillage.pendingBuildTasks;
        for (let aid = 1; aid <= 18; aid++) {
            pendingBuildTasks.push({
                aid,
                gid: -1,
                resources: {
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                }
            });
        }
        state.villages = villages;
    });
    $('#updateFarmInterval').on('click', () => {
        const farmIntervalMinutes = {
            min: parseInt($("#minFarmMinutes").val()),
            max: parseInt($("#maxFarmMinutes").val())
        };
        state.farmIntervalMinutes = farmIntervalMinutes;
    });
    handleFeatureToggle('#toggleAutoLogin', state, 'autoLogin');
    handleFeatureToggle('#toggleAutoScan', state, 'autoScan');
    handleFeatureToggle('#toggleAutoBuild', state, 'autoBuild');
    handleFeatureToggle('#toggleAutoScout', state, 'autoScout');
    handleFeatureToggle('#toggleAutoFarm', state, 'autoFarm');
    handleFeatureToggle('#toggleDisableReportChecking', state, 'disableReportChecking');
    handleFeatureToggle('#toggleDisableStopOnLoss', state, 'disableStopOnLoss');
    handleFeatureToggle('#toggleAutoCustomFarm', state, 'autoCustomFarm');
    handleFeatureToggle('#toggleAlertAttack', state, 'alertAttack');
    handleFeatureToggle('#toggleAlertEmptyBuildQueue', state, 'alertEmptyBuildQueue');
    handleFeatureToggle('#toggleAlertResourceCapacityFull', state, 'alertResourceCapacityFull');
    handleFeatureToggle('#toggleDebug', state, 'debug');
};
const run = (state) => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        updateCurrentPage(state);
        state.plusEnabled = !!!$('.market.gold').length;
        if ([CurrentPageEnum.LOGIN].includes(state.currentPage) && state.feature.autoLogin) {
            state.feature.debug && console.log("Attempt login");
            yield login(state);
        }
        if ([CurrentPageEnum.FIELDS, CurrentPageEnum.TOWN, CurrentPageEnum.BUILDING, CurrentPageEnum.REPORT, CurrentPageEnum.OFF_REPORT, CurrentPageEnum.SCOUT_REPORT].includes(state.currentPage)) {
            updateVillageList(state);
            updateCurrentVillageStatus(state);
            yield checkAutoEvade(state);
            if (state.feature.alertAttack) {
                state.feature.debug && console.log("Checking for attacks");
                checkIncomingAttack(state);
            }
            if (state.feature.alertEmptyBuildQueue) {
                state.feature.debug && console.log("Checking empty build queue");
                alertEmptyBuildQueue(state);
            }
            if (state.feature.alertResourceCapacityFull) {
                state.feature.debug && console.log("Checking resource capacity full");
                alertResourceCapacityFull(state);
            }
            if ([CurrentActionEnum.IDLE, CurrentActionEnum.BUILD].includes(state.currentAction) && state.feature.autoBuild) {
                state.feature.debug && console.log("Attempting build");
                yield build(state);
            }
            if (CurrentActionEnum.NAVIGATE_TO_FIELDS === state.currentAction) {
                if (state.currentPage === CurrentPageEnum.FIELDS)
                    state.currentAction = CurrentActionEnum.IDLE;
                else
                    yield Navigation.goToFields(state, CurrentActionEnum.IDLE);
            }
            if ([CurrentActionEnum.IDLE, CurrentActionEnum.SCOUT].includes(state.currentAction)) {
                if (state.feature.autoScout) {
                    state.feature.debug && console.log("Attempting scout");
                    yield scout(state);
                }
                else {
                    state.currentAction = CurrentActionEnum.IDLE;
                }
            }
            if ([CurrentActionEnum.IDLE, CurrentActionEnum.FARM].includes(state.currentAction)) {
                if (state.feature.autoFarm) {
                    state.feature.debug && console.log("Attempting farm");
                    yield farm(state);
                }
                else {
                    state.currentAction = CurrentActionEnum.IDLE;
                }
            }
            if ([CurrentActionEnum.IDLE, CurrentActionEnum.CUSTOM_FARM].includes(state.currentAction)) {
                if (state.feature.autoCustomFarm) {
                    state.feature.debug && console.log("Attempting custom farm");
                    yield customFarm(state);
                }
                else {
                    state.currentAction = CurrentActionEnum.IDLE;
                }
            }
            if (state.currentAction === CurrentActionEnum.IDLE && state.feature.autoScan) {
                state.feature.debug && console.log("Try next village");
                yield nextVillage(state);
            }
        }
        state.feature.debug && console.log(`Awaiting ${RUN_INTERVAL}ms`);
        yield Utils.sleep(RUN_INTERVAL);
    }
});
const initialize = () => {
    const handler = new StateHandler();
    const state = new Proxy(StateHandler.INITIAL_STATE, handler);
    handler.setCallback(() => render(state));
    createStyle();
    createContainer();
    render(state);
    run(state);
};
initialize();
