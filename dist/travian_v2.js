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
const BUILD_TIME = "2022/09/24 15:15:01";
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
    CurrentActionEnum["VILLAGE_RESET"] = "VILLAGE_RESET";
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
        autoScan: false,
        autoBuild: false,
        debug: false
    },
    nextVillageRotationTime: new Date(),
    telegramChatId: '',
    telegramToken: ''
};
class Utils {
}
_a = Utils;
Utils.parseIntIgnoreSep = (s) => {
    return parseInt(s.replace('.', '').replace(',', ''));
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
    if (action)
        state.currentAction = action;
    state.feature.debug && console.log(`Go to village - [${id}]${state.villages[id].name}`);
    $(`.listEntry[data-did="${id}"] > a`)[0].click();
    return true;
});
Navigation.goToBuilding = (state, aid, gid, action) => __awaiter(void 0, void 0, void 0, function* () {
    if (aid <= 18 && state.currentPage === CurrentPageEnum.FIELDS) {
        yield Utils.delayClick();
        if (action)
            state.currentAction = action;
        state.feature.debug && console.log(`Go to building - [aid=${aid},gid=${gid}]${GID_NAME_MAP[gid]}`);
        $(`a[href="/build.php?id=${aid}"]`)[0].click();
        return true;
    }
    else if (aid > 18 && state.currentPage === CurrentPageEnum.TOWN) {
        yield Utils.delayClick();
        if (action)
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
    if (action)
        state.currentAction = action;
    state.feature.debug && console.log('Go to fields');
    $('.village.resourceView')[0].click();
    return true;
});
Navigation.goToTown = (state, action) => __awaiter(void 0, void 0, void 0, function* () {
    yield Utils.delayClick();
    if (action)
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
        }
        
        #console .flex {
            flex: 1 1 auto;
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
const updateVillageList = (state) => {
    const villages = state.villages;
    const villageListEle = $('.villageList .listEntry');
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
        const x = Utils.parseIntIgnoreSep(((_d = coordinateAttributes.getNamedItem('data-x')) === null || _d === void 0 ? void 0 : _d.value) || '');
        const y = Utils.parseIntIgnoreSep(((_e = coordinateAttributes.getNamedItem('data-y')) === null || _e === void 0 ? void 0 : _e.value) || '');
        const villageDefaults = {
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
    let lumber = Utils.parseIntIgnoreSep($('#l1')[0].innerText);
    let clay = Utils.parseIntIgnoreSep($('#l2')[0].innerText);
    let iron = Utils.parseIntIgnoreSep($('#l3')[0].innerText);
    let crop = Utils.parseIntIgnoreSep($('#l4')[0].innerText);
    villages[currentVillageId].resources = { lumber, clay, iron, crop };
    if ([CurrentPageEnum.FIELDS, CurrentPageEnum.TOWN].includes(state.currentPage)) {
        const currentBuildTasks = [];
        $('.buildingList > ul > li').each((_, ele) => {
            const nameAndLevelEle = $(ele).find('.name').contents();
            const name = $(nameAndLevelEle[0]).text().trim();
            const level = $(nameAndLevelEle[1]).text().trim();
            const timer = $(ele).find('.timer').text();
            const timerParts = timer.split(":");
            const finishTime = Utils.addToDate(new Date(), Utils.parseIntIgnoreSep(timerParts[0]), Utils.parseIntIgnoreSep(timerParts[1]), Utils.parseIntIgnoreSep(timerParts[2]));
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
            const count = Utils.parseIntIgnoreSep($(ele).find('.mov').text());
            const timer = $(ele).find('.timer').text();
            const timerParts = timer.split(":");
            const time = Utils.addToDate(new Date(), Utils.parseIntIgnoreSep(timerParts[0]), Utils.parseIntIgnoreSep(timerParts[1]), Utils.parseIntIgnoreSep(timerParts[2]));
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
            villages[currentVillageId].incomingTroops = incomingTroops;
            villages[currentVillageId].outgoingTroops = outgoingTroops;
        });
        villages[currentVillageId].lastUpdatedTime = new Date();
    }
    state.villages = villages;
};
const alertAttack = (state) => {
    const villages = state.villages;
    const village = villages[state.currentVillageId];
    if (village.incomingTroops.find(e => e.type === TroopMovementType.ATTACK)) {
        if (!state.telegramChatId || !state.telegramToken) {
            state.feature.debug && console.log("Telegram chat id or token not set");
            return;
        }
        if (!village.alertBackoff || new Date(village.alertBackoff) < new Date()) {
            state.feature.debug && console.log(`Send alert for attack at village ${village.name}`);
            village.alertBackoff = Utils.addToDate(new Date(), 0, 5, 0);
            state.villages = villages;
            fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Village ${village.name} under attack`);
        }
        else {
            state.feature.debug && console.log(`Not alert due to backoff at ${Utils.formatDate(village.alertBackoff)}`);
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
        let params = new URLSearchParams(window.location.search);
        if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === `${task.aid}` && params.get('gid') === `${task.gid}`) {
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
        && village.currentBuildTasks.filter(task => new Date(task.finishTime) < new Date()).length < 2
        && Utils.isSufficientResources(village.pendingBuildTasks[0].resources, village.resources))
        .map(([id, _]) => id)
        .find(_ => true);
    if (nextVillageIdToBuild) {
        yield Navigation.goToVillage(state, nextVillageIdToBuild, CurrentActionEnum.VILLAGE_RESET);
    }
    else {
        state.feature.debug && console.log("Nothing to build in other villages");
        state.currentAction = CurrentActionEnum.IDLE;
    }
});
const nextVillage = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const nextRotationTIme = new Date(state.nextVillageRotationTime);
    const currentTime = new Date();
    if (new Date(state.nextVillageRotationTime) < new Date()) {
        state.nextVillageRotationTime = Utils.addToDate(new Date(), 0, Utils.randInt(5, 10), 20);
        let earliestVillageId = '';
        Object.values(state.villages)
            .forEach(village => {
            if (!village.lastUpdatedTime || !earliestVillageId || village.lastUpdatedTime < state.villages[earliestVillageId].lastUpdatedTime) {
                earliestVillageId = village.id;
            }
        });
        state.feature.debug && console.log(`Rotating to ${state.villages[earliestVillageId].name}`);
        yield Navigation.goToVillage(state, earliestVillageId);
    }
    else {
        state.feature.debug && console.log(`Not rotating, next rotation=${Utils.formatDate(nextRotationTIme)}, current=${Utils.formatDate(currentTime)}`);
    }
});
const render = (state) => {
    const villages = state.villages;
    const currentVillage = state.villages[state.currentVillageId];
    $('#console').html(`
        <div class="flex-row">
            <h4>Console</h4>
            <input id="toggleAutoScan" class="ml-5" type="checkbox" ${state.feature.autoScan ? 'checked' : ''}/> Auto scan
            <input id="toggleAutoBuild" class="ml-5" type="checkbox" ${state.feature.autoBuild ? 'checked' : ''}/> Auto build
            <input id="toggleDebug" class="ml-5" type="checkbox" ${state.feature.debug ? 'checked' : ''}/> Debug
        </div>
        <div class="flex-row">
            <div class="flex">
                <h5>Summary</h5>
                <div>Current Page: ${state.currentPage} (Last render: ${Utils.formatDate(new Date())})</div>
                <div>Current Action: ${state.currentAction}</div>
                <div>Next rotation: ${Utils.formatDate(state.nextVillageRotationTime)}</div>
                ${Object.entries(villages).map(([id, village]) => `
                    <div>
                        <h5>${village.name} (${id})</h5>
                        <div>Lumber: ${village.resources.lumber} Clay: ${village.resources.clay} Iron: ${village.resources.iron} Crop: ${village.resources.crop}</div>
                        ${village.currentBuildTasks.map(task => `
                            <div>${task.name} ${task.level} ${Utils.formatDate(task.finishTime)}</div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
            <div class="flex">
                <div class="flex-row">
                    <h5>Pending Build Tasks</h5>
                    <button id="addCurrentToPending" class="ml-5">Add Current</button>
                </div>
                ${currentVillage.pendingBuildTasks.map((task, i) => `
                    <div>
                        <span>Position: ${task.aid}</span>
                        <span>${GID_NAME_MAP[task.gid]}</span>
                        <button class="removeFromPending" idx="${i}">x</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `);
    $('#addCurrentToPending').on('click', () => {
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
        const lumber = Utils.parseIntIgnoreSep(resourceRequirementEle[0].innerText);
        const clay = Utils.parseIntIgnoreSep(resourceRequirementEle[1].innerText);
        const iron = Utils.parseIntIgnoreSep(resourceRequirementEle[2].innerText);
        const crop = Utils.parseIntIgnoreSep(resourceRequirementEle[3].innerText);
        pendingBuildTasks.push({
            aid: Utils.parseIntIgnoreSep(aid),
            gid: Utils.parseIntIgnoreSep(gid),
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
        var _c;
        const idx = (_c = ele.target.attributes.getNamedItem('idx')) === null || _c === void 0 ? void 0 : _c.value;
        if (!idx)
            return;
        const villages = state.villages;
        const pendingBuildTasks = villages[state.currentVillageId].pendingBuildTasks;
        pendingBuildTasks.splice(Utils.parseIntIgnoreSep(idx), 1);
        state.villages = villages;
    });
    $('#toggleAutoScan').on('click', () => {
        const feature = state.feature;
        feature.autoScan = !feature.autoScan;
        state.feature = feature;
    });
    $('#toggleAutoBuild').on('click', () => {
        const feature = state.feature;
        feature.autoBuild = !feature.autoBuild;
        state.feature = feature;
    });
    $('#toggleDebug').on('click', () => {
        const feature = state.feature;
        feature.debug = !feature.debug;
        state.feature = feature;
    });
};
const run = (state) => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        updateCurrentPage(state);
        updateVillageList(state);
        updateCurrentVillageStatus(state);
        alertAttack(state);
        // alertEmptyBuildQueue()
        if ([CurrentActionEnum.IDLE, CurrentActionEnum.BUILD].includes(state.currentAction) && state.feature.autoBuild) {
            state.feature.debug && console.log("Attempting build");
            yield build(state);
        }
        if (CurrentActionEnum.VILLAGE_RESET === state.currentAction) {
            if (state.currentPage === CurrentPageEnum.FIELDS)
                state.currentAction = CurrentActionEnum.IDLE;
            else
                yield Navigation.goToFields(state, CurrentActionEnum.IDLE);
        }
        // Auto farm
        if (state.currentAction === CurrentActionEnum.IDLE && state.feature.autoScan) {
            state.feature.debug && console.log("Try next village");
            yield nextVillage(state);
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
