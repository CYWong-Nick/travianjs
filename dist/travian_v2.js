"use strict";
var CurrentPageEnum;
(function (CurrentPageEnum) {
    CurrentPageEnum["LOGIN"] = "LOGIN";
    CurrentPageEnum["FIELDS"] = "FIELDS";
    CurrentPageEnum["TOWN"] = "TOWN";
    CurrentPageEnum["BUILDING"] = "BUILDING";
})(CurrentPageEnum || (CurrentPageEnum = {}));
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
    currentPage: CurrentPageEnum.LOGIN,
    currentVillageId: '',
    villages: {}
};
class Utils {
    constructor() {
        this.randInt = (x, y) => {
            return Math.floor(Math.random() * (y - x + 1) + x);
        };
        this.sleep = (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };
    }
}
Utils.parseIntIgnoreSep = (s) => {
    return parseInt(s.replace('.', '').replace(',', ''));
};
Utils.addToDate = (date, hour, minute, second) => {
    return new Date(date.getTime() + hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000);
};
Utils.formatDate = (dateInput) => {
    const date = new Date(dateInput);
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
var TroopMovementType;
(function (TroopMovementType) {
    TroopMovementType["REINFORCE"] = "REINFORCE";
    TroopMovementType["ATTACK"] = "ATTACK";
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
    }
};
const updateVillageList = (state) => {
    const villages = state.villages;
    const villageListEle = $('.villageList .listEntry');
    let currentVillageId;
    villageListEle.each((index, ele) => {
        var _a, _b, _c;
        const id = (_a = ele.attributes.getNamedItem('data-did')) === null || _a === void 0 ? void 0 : _a.value;
        if (!id) {
            return;
        }
        if (ele.className.includes('active'))
            currentVillageId = id;
        const name = $(ele).find('.name')[0].innerText;
        const coordinateAttributes = $(ele).find('.coordinatesGrid')[0].attributes;
        const x = Utils.parseIntIgnoreSep(((_b = coordinateAttributes.getNamedItem('data-x')) === null || _b === void 0 ? void 0 : _b.value) || '');
        const y = Utils.parseIntIgnoreSep(((_c = coordinateAttributes.getNamedItem('data-y')) === null || _c === void 0 ? void 0 : _c.value) || '');
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
    state.villages = villages;
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
    if (state.currentPage in [CurrentPageEnum.FIELDS, CurrentPageEnum.FIELDS]) {
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
    state.villages = villages;
};
const render = (state) => {
    const villages = state.villages;
    const currentVillage = state.villages[state.currentVillageId];
    $('#console').html(`
        <h4>Console</h4>
        <div class="flex-row">
            <div class="flex">
                <h5>Summary</h5>
                <div>Current: ${state.currentPage} (Last render: ${Utils.formatDate(new Date())})</div>
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
                    <button id="addCurrentToPending">Add Current</button>
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
        var _a;
        const idx = (_a = ele.target.attributes.getNamedItem('idx')) === null || _a === void 0 ? void 0 : _a.value;
        if (!idx)
            return;
        const villages = state.villages;
        const pendingBuildTasks = villages[state.currentVillageId].pendingBuildTasks;
        pendingBuildTasks.splice(Utils.parseIntIgnoreSep(idx), 1);
        state.villages = villages;
    });
};
const run = (state) => {
    updateCurrentPage(state);
    updateVillageList(state);
    updateCurrentVillageStatus(state);
    // alertAttack()
    // tryBuild()
    // alertEmptyBuildQueue()
    // tryNextVillage()
};
const initialize = () => {
    const handler = new StateHandler();
    const state = new Proxy(StateHandler.INITIAL_STATE, handler);
    handler.setCallback(() => render(state));
    createStyle();
    createContainer();
    render(state);
    run(state);
    setInterval(() => run(state), 30000);
};
initialize();
