"use strict";
var CurrentPageEnum;
(function (CurrentPageEnum) {
    CurrentPageEnum["LOGIN"] = "LOGIN";
    CurrentPageEnum["FIELDS"] = "FIELDS";
    CurrentPageEnum["TOWN"] = "TOWN";
    CurrentPageEnum["BUILDING"] = "BUILDING";
})(CurrentPageEnum || (CurrentPageEnum = {}));
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
}
Utils.parseIntIgnoreSep = (s) => {
    return parseInt(s.replace('.', '').replace(',', ''));
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
    villageListEle.each((_, ele) => {
        var _a, _b, _c;
        const id = (_a = ele.attributes.getNamedItem('data-did')) === null || _a === void 0 ? void 0 : _a.value;
        if (!id) {
            return;
        }
        if (ele.className.includes('active'))
            currentVillageId = id;
        const name = $(ele).find('.name')[0].innerText;
        const coordinateAttributes = $(ele).find('.coordinatesGrid')[0].attributes;
        const x = parseIntIgnoreSep(((_b = coordinateAttributes.getNamedItem('data-x')) === null || _b === void 0 ? void 0 : _b.value) || '');
        const y = parseIntIgnoreSep(((_c = coordinateAttributes.getNamedItem('data-y')) === null || _c === void 0 ? void 0 : _c.value) || '');
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
            name, position: { x, y } });
    });
    state.villages = villages;
    if (currentVillageId)
        state.currentVillageId = currentVillageId;
};
const updateVillageStatus = (state) => {
    const villages = state.villages;
    const currentVillageId = state.currentVillageId;
    let lumber = Utils.parseIntIgnoreSep($('#l1')[0].innerText);
    let clay = Utils.parseIntIgnoreSep($('#l2')[0].innerText);
    let iron = Utils.parseIntIgnoreSep($('#l3')[0].innerText);
    let crop = Utils.parseIntIgnoreSep($('#l4')[0].innerText);
    villages[currentVillageId].resources = { lumber, clay, iron, crop };
    state.villages = villages;
};
const render = (state) => {
    $('#console').html(`
        <h4>Console</h4>
        <div class="flex-row">
            <div class="flex">
                <h5>Summary</h5>
                <div>Current: ${state.currentPage} (Last render: ${new Date()})</div>
                <div>${state.villages}</div>
            </div>
            <div class="flex">
                <div class="flex-row">
                <h5>Pending Build Tasks</h5>
                </div>
            </div>
        </div>
    `);
};
const run = (state) => {
    updateCurrentPage(state);
    updateVillageList(state);
    updateVillageStatus(state);
    // alertAttack()
    // tryBuild()
    // alertEmptyBuildQueue()
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
