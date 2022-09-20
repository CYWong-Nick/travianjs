class StateHandler implements ProxyHandler<State> {
    static INITIAL_STATE: State = {
        currentBuildingList: [],
        pendingBuildingList: []
    }

    get = (obj: State, prop: string) => {
        let item = localStorage.getItem(prop)
        if (item === null)
            return StateHandler.INITIAL_STATE[prop]
        else
            return JSON.parse(item)
    }

    set = (obj: State, prop: string) => {
        localStorage.setItem(prop, JSON.stringify(obj))
        return true
    }
}

class Utils {

}

interface Resource {
    lumber: number
    clay: number
    iron: number
    crop: number
}

interface Position {
    x: number
    y: number
}

enum TroopMovementType {
    REINFORCE = "REINFORCE",
    ATTACK = "ATTACK"
}

interface TroopMovement {
    type: TroopMovementType
}

interface Village {
    id: string
    name: string
    position: Position
    currentBuildTasks: CurrentBuildTask[]
    pendingBuildTasks: PendingBuildTask[]
    resources: Resource
    incomingTroops: TroopMovement[]
    outgoingTroops: TroopMovement[]
}

interface CurrentBuildTask {
    name: string
    level: string
    finishTime: Date
}

interface PendingBuildTask {
    aid: number
    gid: number
    resources: Resource
}

enum CurrentPageEnum {
    FIELDS = "FIELDS",
    TOWN = "TOWN",
    BUILDING = "BUILDING"
}

interface State {
    currentVillageId: string
    currentPage: CurrentPageEnum
    villages: Record<string, Village>
}

const state: State = new Proxy(StateHandler.INITIAL_STATE, new StateHandler())

const render = () => {
    updateVillageStatus()
    alertAttack() 
    tryBuild() 
    alertEmptyBuildQueue()
}