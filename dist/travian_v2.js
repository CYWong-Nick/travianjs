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
const BUILD_TIME = "2022/09/28 11:03:12";
const RUN_INTERVAL = 10000;
const GID_NAME_MAP = {
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
    "40": "Wonder of the World"
};
var CurrentPageEnum;
(function (CurrentPageEnum) {
    CurrentPageEnum["LOGIN"] = "LOGIN";
    CurrentPageEnum["FIELDS"] = "FIELDS";
    CurrentPageEnum["TOWN"] = "TOWN";
    CurrentPageEnum["BUILDING"] = "BUILDING";
    CurrentPageEnum["UNKNOWN"] = "UNKNOWN";
})(CurrentPageEnum || (CurrentPageEnum = {}));
var CurrentActionEnum;
(function (CurrentActionEnum) {
    CurrentActionEnum["IDLE"] = "IDLE";
    CurrentActionEnum["BUILD"] = "BUILD";
    CurrentActionEnum["NAVIGATE_TO_FIELDS"] = "NAVIGATE_TO_FIELDS";
    CurrentActionEnum["FARM"] = "FARM";
    CurrentActionEnum["CUSTOM_FARM"] = "CUSTOM_FARM";
})(CurrentActionEnum || (CurrentActionEnum = {}));
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
        autoFarm: false,
        autoCustomFarm: false,
        debug: false
    },
    nextVillageRotationTime: new Date(),
    nextFarmTime: new Date(),
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
    yield Utils.sleep(Utils.randInt(1000, 5000));
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
            $('#villageContent > div.buildingSlot.a40.g33.top.gaul > svg > g.hoverShape > path').trigger('click');
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
        }
        
        #console .ml-5 {
            margin-left: 5px;
        }
        
        #console .mr-5 {
            margin-right: 5px;
        }
        
        #console button {
            border: 1px solid black;
            border-radius: 3px;
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
            }
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
        villages[currentVillageId].nextCustomFarmTime = villages[currentVillageId].nextCustomFarmTime || new Date();
    }
    state.villages = villages;
};
const alertAttack = (state) => {
    const villages = state.villages;
    const village = villages[state.currentVillageId];
    const attack = village.incomingTroops.find(e => e.type === TroopMovementType.ATTACK);
    if (attack) {
        if (!state.telegramChatId || !state.telegramToken) {
            state.feature.debug && console.log("Telegram chat id or token not set");
            return;
        }
        if (!village.attackAlertBackoff || new Date(village.attackAlertBackoff) < new Date()) {
            state.feature.debug && console.log(`Send alert for attack at village ${village.name}`);
            village.attackAlertBackoff = Utils.addToDate(new Date(), 0, 5, 0);
            state.villages = villages;
            fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Village ${village.name} under attack at ${Utils.formatDate(attack.time)}`);
        }
        else {
            state.feature.debug && console.log(`Not alerting attack due to backoff at ${Utils.formatDate(village.attackAlertBackoff)}`);
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
    if (village.pendingBuildTasks.length > 0) {
        const task = village.pendingBuildTasks[0];
        if (village.currentBuildTasks.length < 2
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
        if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === `${task.aid}` && params.get('gid') === `${task.gid}`) {
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
        && village.currentBuildTasks.filter(task => new Date(task.finishTime) > new Date()).length < 2
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
const farm = (state) => __awaiter(void 0, void 0, void 0, function* () {
    if (new Date(state.nextFarmTime) < new Date()) {
        const params = new URLSearchParams(window.location.search);
        if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') === '99') {
            const startButtonEle = $('.startButton[value=Start]');
            for (let i = 0; i < startButtonEle.length; i++) {
                yield Utils.delayClick();
                startButtonEle[i].click();
            }
            state.nextFarmTime = Utils.addToDate(new Date(), 0, Utils.randInt(30, 40), 0);
            yield Navigation.goToFields(state, CurrentActionEnum.IDLE);
            return;
        }
        else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') !== '99') {
            yield Utils.delayClick();
            $('a[href="/build.php?id=39&gid=16&tt=99"]')[0].click();
            return;
        }
        else if (state.currentPage === CurrentPageEnum.TOWN) {
            yield Navigation.goToBuilding(state, 39, 16, CurrentActionEnum.FARM);
            return;
        }
        else {
            yield Navigation.goToTown(state, CurrentActionEnum.FARM);
            return;
        }
    }
});
const executeCustomFarm = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const params = new URLSearchParams(window.location.search);
    const villages = state.villages;
    const village = villages[state.currentVillageId];
    const customFarm = village === null || village === void 0 ? void 0 : village.customFarm;
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
                Object.keys(customFarm.troops).forEach(troopKey => {
                    const troopInputEle = $(`input[name="${troopKey}"]`);
                    troopInputEle[0].click();
                    troopInputEle.val(customFarm.troops[troopKey]);
                });
                $("#xCoordInput").val(customFarm.position.x);
                $("#yCoordInput").val(customFarm.position.y);
                $("#build > div > form > div.option > label:nth-child(5) > input")[0].click();
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
            village.nextCustomFarmTime = Utils.addToDate(new Date(), 0, Utils.randInt(customFarm.farmIntervalMinutes.min, customFarm.farmIntervalMinutes.max), Utils.randInt(0, 59));
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
    // Check current village custom farm
    if (villages[state.currentVillageId].customFarm &&
        villages[state.currentVillageId].nextCustomFarmTime) {
        // @ts-ignore
        if (new Date(villages[state.currentVillageId].nextCustomFarmTime) < new Date()) {
            state.feature.debug && console.log("Execute custom farm");
            yield executeCustomFarm(state);
            return;
        }
    }
    // Check other villages
    const nextVillageIdToCustomFarm = Object.entries(state.villages)
        .filter(([_, village]) => village.id !== state.currentVillageId &&
        village.customFarm &&
        village.nextCustomFarmTime &&
        new Date(village.nextCustomFarmTime) < new Date())
        .map(([id, _]) => id)
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
    if (state.currentPage === CurrentPageEnum.BUILDING && $('#addCurrentToPendingInBuilding').length === 0) {
        $('.upgradeBuilding').after('<button id="addCurrentToPendingInBuilding" class="addCurrentToPending">Add to queue</button>');
    }
    const villages = state.villages;
    const params = new URLSearchParams(window.location.search);
    $('#console').html(`
        <div class="flex-row">
            <h4>Console</h4>
            <input id="toggleAutoLogin" class="ml-5" type="checkbox" ${state.feature.autoLogin ? 'checked' : ''}/> Auto login
            <input id="toggleAutoScan" class="ml-5" type="checkbox" ${state.feature.autoScan ? 'checked' : ''}/> Auto scan
            <input id="toggleAutoBuild" class="ml-5" type="checkbox" ${state.feature.autoBuild ? 'checked' : ''}/> Auto build
            <input id="toggleAutoFarm" class="ml-5" type="checkbox" ${state.feature.autoFarm ? 'checked' : ''}/> Auto farm
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
            <div>Next rotation: ${Utils.formatDate(state.nextVillageRotationTime)}</div>
            <div>Next farm: ${Utils.formatDate(state.nextFarmTime)}</div>
        </div>
        <br />
        <div class="flex-row">
            ${Object.entries(villages).map(([id, village]) => {
        var _c, _d, _e, _f;
        return `
                <div class="village-container">
                    <h4>${village.name} (id: ${id}) (${village.position.x}, ${village.position.y})</h4>
                    <br />
                    <div>Last update: ${Utils.formatDate(village.lastUpdatedTime)}</div>
                    <div>Attack alert backoff: ${Utils.formatDate(village.attackAlertBackoff)}</div>
                    <div>Empty build queue alert backoff: ${Utils.formatDate(village.emptyBuildQueueAlertBackoff)}</div>
                    <br />
                    <div class="flex-row">
                        <div>Next custom farm time: ${Utils.formatDate(village.nextCustomFarmTime)}</div>
                    </div>
                    ${state.currentPage === CurrentPageEnum.BUILDING && state.currentVillageId === village.id
            && params.get('gid') === '16' && params.get('tt') === '2' ?
            `<div class="flex-row">
                                        <input id="minCustomFarmMinutes" style="width: 5%">min</input>
                                        <input id="maxCustomFarmMinutes" style="width: 5%">max</input>
                                        <button id="addCurrentToCustomFarm" class="ml-5">Add Current</button>
                                    </div>`
            : ''}
                    ${village.customFarm ?
            `<div>Target: (${(_c = village.customFarm) === null || _c === void 0 ? void 0 : _c.position.x}|${(_d = village.customFarm) === null || _d === void 0 ? void 0 : _d.position.y})</div>
                                <div>Troops: ${Object.keys(village.customFarm.troops).filter(key => { var _c; return (_c = village.customFarm) === null || _c === void 0 ? void 0 : _c.troops[key]; }).map(key => { var _c; return key + ": " + ((_c = village.customFarm) === null || _c === void 0 ? void 0 : _c.troops[key]); }).join(", ")}</div>
                                <div>Interval Range: ${(_e = village.customFarm) === null || _e === void 0 ? void 0 : _e.farmIntervalMinutes.min}mins - ${(_f = village.customFarm) === null || _f === void 0 ? void 0 : _f.farmIntervalMinutes.max}mins</div>`
            : ''}
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
            `;
    }).join('')}
        </div>
    `);
    state.currentPage === CurrentPageEnum.BUILDING && params.get('gid') === '16' && params.get('tt') === '2' &&
        $('#addCurrentToCustomFarm').on('click', () => {
            const villages = state.villages;
            let customFarm = {
                position: {
                    "x": -999,
                    "y": -999
                },
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
                if (troopKey && troopInput) {
                    customFarm.troops[troopKey] = troopCount;
                }
            });
            customFarm.position.x = parseInt($("#xCoordInput").val());
            customFarm.position.y = parseInt($("#yCoordInput").val());
            customFarm.farmIntervalMinutes.min = parseInt($("#minCustomFarmMinutes").val());
            customFarm.farmIntervalMinutes.max = parseInt($("#maxCustomFarmMinutes").val());
            villages[state.currentVillageId].customFarm = customFarm;
            state.villages = villages;
        });
    state.currentPage === CurrentPageEnum.BUILDING && $('.addCurrentToPending').on('click', () => {
        const villages = state.villages;
        const pendingBuildTasks = villages[state.currentVillageId].pendingBuildTasks;
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
    handleFeatureToggle('#toggleAutoLogin', state, 'autoLogin');
    handleFeatureToggle('#toggleAutoScan', state, 'autoScan');
    handleFeatureToggle('#toggleAutoBuild', state, 'autoBuild');
    handleFeatureToggle('#toggleAutoFarm', state, 'autoFarm');
    handleFeatureToggle('#toggleAutoCustomFarm', state, 'autoCustomFarm');
    handleFeatureToggle('#toggleAlertAttack', state, 'alertAttack');
    handleFeatureToggle('#toggleAlertEmptyBuildQueue', state, 'alertEmptyBuildQueue');
    handleFeatureToggle('#toggleAlertResourceCapacityFull', state, 'alertResourceCapacityFull');
    handleFeatureToggle('#toggleDebug', state, 'debug');
};
const run = (state) => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        updateCurrentPage(state);
        if ([CurrentPageEnum.LOGIN].includes(state.currentPage) && state.feature.autoLogin) {
            state.feature.debug && console.log("Attempt login");
            yield login(state);
        }
        if ([CurrentPageEnum.FIELDS, CurrentPageEnum.TOWN, CurrentPageEnum.BUILDING].includes(state.currentPage)) {
            updateVillageList(state);
            updateCurrentVillageStatus(state);
            if (state.feature.alertAttack) {
                state.feature.debug && console.log("Checking for attacks");
                alertAttack(state);
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
