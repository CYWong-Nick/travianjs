enum CurrentPageEnum {
    LOGIN = "LOGIN",
    FIELDS = "FIELDS",
    TOWN = "TOWN",
    BUILDING = "BUILDING"
}

interface State {
    currentPage: CurrentPageEnum
    currentVillageId: string
    villages: Record<string, Village>
}

type RenderFunction = (state: State) => void

class StateHandler implements ProxyHandler<State> {
    static INITIAL_STATE: State = {
        currentPage: CurrentPageEnum.LOGIN,
        currentVillageId: '',
        villages: {}
    }

    private render: RenderFunction

    constructor(render: RenderFunction) {
        this.render = render
    }

    get = (obj: State, prop: keyof State) => {
        let item = localStorage.getItem(prop)
        if (item === null)
            return StateHandler.INITIAL_STATE[prop]
        else
            return JSON.parse(item)
    }

    set = (obj: State, prop: string) => {
        localStorage.setItem(prop, JSON.stringify(obj))
        this.render(obj)
        return true
    }
}


const render: RenderFunction = (state: State) => {
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
  `)
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

const updateCurrentPage = () => {
    let pathname = window.location.pathname
    switch (pathname) {
        case '/dorf1.php': {
            state.currentPage = CurrentPageEnum.FIELDS
            break
        }
        case '/dorf2.php': {
            state.currentPage = CurrentPageEnum.TOWN
            break
        }
        case '/build.php': {
            state.currentPage = CurrentPageEnum.BUILDING
            break
        }
        case '/': {
            state.currentPage = CurrentPageEnum.LOGIN
            break
        }
    }
}

const run = () => {
    updateCurrentPage()
    // updateVillageStatus()
    // alertAttack()
    // tryBuild()
    // alertEmptyBuildQueue()
}

const state: State = new Proxy(StateHandler.INITIAL_STATE, new StateHandler(render))
$('#footer').before(`
  <div id="console"/>
`)
render(state)
run()
setInterval(run, 30000)