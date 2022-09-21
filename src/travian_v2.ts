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

    private state: State
    private callback?: () => any

    constructor() {
        this.state = Object.fromEntries(
            Object.keys(StateHandler.INITIAL_STATE)
                .map(k => [k, this.parseState(k as keyof State)])
        ) as State
    }

    private parseState = (prop: keyof State) => {
        let item = localStorage.getItem(prop)
        if (item === null)
            return StateHandler.INITIAL_STATE[prop]
        else
            return JSON.parse(item)
    }

    get = (obj: State, prop: keyof State) => {
        return this.state[prop]
    }

    set = (obj: State, prop: keyof State, value: any) => {
        localStorage.setItem(prop, JSON.stringify(value))
        this.state[prop] = value
        this.callback && this.callback()
        return true
    }

    setCallback = (callback: () => any) => {
        this.callback = callback
    }
}

class Utils {
    static parseIntIgnoreSep = (s: string) => {
        return parseInt(s.replace('.', '').replace(',', ''))
    }

    static addToDate = (date: Date, hour: number, minute: number, second: number) => {
        return new Date(date.getTime() + hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000)
    }

    static formatDate = (dateInput: Date) => {
        const date = new Date(dateInput)
        return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
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
}

const createContainer = () => {
    $('#footer').before(`
      <div id="console"/>
    `)
}

const updateCurrentPage = (state: State) => {
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

const updateVillageList = (state: State) => {
    const villages = state.villages

    const villageListEle = $('.villageList .listEntry')
    let currentVillageId

    villageListEle.each((_, ele) => {
        const id = ele.attributes.getNamedItem('data-did')?.value
        if (!id) {
            return
        }

        if (ele.className.includes('active'))
            currentVillageId = id
        const name = $(ele).find('.name')[0].innerText
        const coordinateAttributes = $(ele).find('.coordinatesGrid')[0].attributes
        const x = Utils.parseIntIgnoreSep(coordinateAttributes.getNamedItem('data-x')?.value || '')
        const y = Utils.parseIntIgnoreSep(coordinateAttributes.getNamedItem('data-y')?.value || '')

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
        }

        villages[id] = {
            ...villageDefaults,
            ...villages[id],
            id,
            name,
            position: { x, y },
        }
    })

    state.villages = villages
    if (currentVillageId)
        state.currentVillageId = currentVillageId
}

const updateVillageStatus = (state: State) => {
    const villages = state.villages
    const currentVillageId = state.currentVillageId

    let lumber = Utils.parseIntIgnoreSep($('#l1')[0].innerText)
    let clay = Utils.parseIntIgnoreSep($('#l2')[0].innerText)
    let iron = Utils.parseIntIgnoreSep($('#l3')[0].innerText)
    let crop = Utils.parseIntIgnoreSep($('#l4')[0].innerText)

    villages[currentVillageId].resources = { lumber, clay, iron, crop }

    const currentBuildTasks: CurrentBuildTask[] = []
    $('.buildingList > ul > li').each((_, ele) => {
        const nameAndLevelEle = $(ele).find('.name').contents()
        const name = $(nameAndLevelEle[0]).text().trim()
        const level = $(nameAndLevelEle[1]).text().trim()
        const timer = $(ele).find('.timer').text()

        const timerParts = timer.split(":")
        const finishTime = Utils.addToDate(
            new Date(),
            Utils.parseIntIgnoreSep(timerParts[0]),
            Utils.parseIntIgnoreSep(timerParts[1]),
            Utils.parseIntIgnoreSep(timerParts[2])
        )

        currentBuildTasks.push({
            name,
            level,
            finishTime
        })
    })

    villages[currentVillageId].currentBuildTasks = currentBuildTasks
    state.villages = villages
}

const render: RenderFunction = (state: State) => {
    const villages = state.villages
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
                </div>
            </div>
        </div>
    `)
}

const run = (state: State) => {
    updateCurrentPage(state)
    updateVillageList(state)
    updateVillageStatus(state)
    // alertAttack()
    // tryBuild()
    // alertEmptyBuildQueue()
}

const initialize = () => {
    const handler = new StateHandler()
    const state: State = new Proxy(StateHandler.INITIAL_STATE, handler)
    handler.setCallback(() => render(state))

    createStyle()
    createContainer()
    render(state)
    run(state)
    setInterval(() => run(state), 30000)
}

initialize()