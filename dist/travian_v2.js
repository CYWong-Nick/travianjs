"use strict";
var CurrentPageEnum;
(function (CurrentPageEnum) {
    CurrentPageEnum["FIELDS"] = "FIELDS";
    CurrentPageEnum["TOWN"] = "TOWN";
    CurrentPageEnum["BUILDING"] = "BUILDING";
})(CurrentPageEnum || (CurrentPageEnum = {}));
class StateHandler {
    constructor() {
        this.get = (obj, prop) => {
            let item = localStorage.getItem(prop);
            if (item === null)
                return StateHandler.INITIAL_STATE[prop];
            else
                return JSON.parse(item);
        };
        this.set = (obj, prop) => {
            localStorage.setItem(prop, JSON.stringify(obj));
            return true;
        };
    }
}
StateHandler.INITIAL_STATE = {
    currentPage: CurrentPageEnum.FIELDS,
    currentVillageId: "",
    villages: {}
};
class Utils {
}
var TroopMovementType;
(function (TroopMovementType) {
    TroopMovementType["REINFORCE"] = "REINFORCE";
    TroopMovementType["ATTACK"] = "ATTACK";
})(TroopMovementType || (TroopMovementType = {}));
const state = new Proxy(StateHandler.INITIAL_STATE, new StateHandler());
const updateVillageStatus = () => {
    // state.currentVillageId = 
};
const run = () => {
    // updateVillageList()
    // updateVillageStatus()
    // alertAttack() 
    // tryBuild() 
    // alertEmptyBuildQueue()
};
