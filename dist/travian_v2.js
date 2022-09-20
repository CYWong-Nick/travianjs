"use strict";
var CurrentPageEnum;
(function (CurrentPageEnum) {
    CurrentPageEnum["LOGIN"] = "LOGIN";
    CurrentPageEnum["FIELDS"] = "FIELDS";
    CurrentPageEnum["TOWN"] = "TOWN";
    CurrentPageEnum["BUILDING"] = "BUILDING";
})(CurrentPageEnum || (CurrentPageEnum = {}));
class StateHandler {
    constructor(render) {
        this.get = (obj, prop) => {
            let item = localStorage.getItem(prop);
            if (item === null)
                return StateHandler.INITIAL_STATE[prop];
            else
                return JSON.parse(item);
        };
        this.set = (obj, prop, value) => {
            localStorage.setItem(prop, JSON.stringify(value));
            this.render(obj);
            return true;
        };
        this.render = render;
    }
}
StateHandler.INITIAL_STATE = {
    currentPage: CurrentPageEnum.LOGIN,
    currentVillageId: '',
    villages: {}
};
const render = (state) => {
    $('#console').html(`
    <h4>Console</h4>
    <div class="flex-row">
      <div class="flex">
        <h5>Summary</h5>
        <div>Current: ${state.currentPage} (Last render: ${new Date()})</div>
      </div>
      <div class="flex">
        <div class="flex-row">
          <h5>Pending Build Tasks</h5>
        </div>
      </div>
    </div>
  `);
};
class Utils {
}
var TroopMovementType;
(function (TroopMovementType) {
    TroopMovementType["REINFORCE"] = "REINFORCE";
    TroopMovementType["ATTACK"] = "ATTACK";
})(TroopMovementType || (TroopMovementType = {}));
const updateCurrentPage = () => {
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
const run = () => {
    updateCurrentPage();
    // updateVillageStatus()
    // alertAttack()
    // tryBuild()
    // alertEmptyBuildQueue()
};
const state = new Proxy(StateHandler.INITIAL_STATE, new StateHandler(render));
$('#footer').before(`
  <div id="console"/>
`);
render(state);
run();
setInterval(run, 30000);
