enum CurrentPageEnum {
    LOGIN = "LOGIN",
    FIELDS = "FIELDS",
    TOWN = "TOWN",
    BUILDING = "BUILDING",
    UNKNOWN = "UNKNOWN"
}

enum CurrentActionEnum {
    IDLE = "IDLE",
    BUILD = "BUILD",
    VILLAGE_RESET = "VILLAGE_RESET"
}

interface Feature {
    autoScan: boolean
    autoBuild: boolean
    debug: boolean
}
interface State {
    currentAction: CurrentActionEnum
    currentPage: CurrentPageEnum
    currentVillageId: string
    villages: Record<string, Village>
    feature: Feature
    nextVillageRotationTime: Date
}

const GID_NAME_MAP: Record<string, string> = {
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
}

class StateHandler implements ProxyHandler<State> {
    static INITIAL_STATE: State = {
        currentAction: CurrentActionEnum.IDLE,
        currentPage: CurrentPageEnum.LOGIN,
        currentVillageId: '',
        villages: {},
        feature: {
            autoScan: false,
            autoBuild: false,
            debug: false
        },
        nextVillageRotationTime: new Date()
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
        //@ts-ignore
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

    static randInt = (x: number, y: number) => {
        return Math.floor(Math.random() * (y - x + 1) + x)
    }

    static sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static delayClick = async () => {
        await Utils.sleep(Utils.randInt(1000, 5000))
    }

    static addToDate = (date: Date, hour: number, minute: number, second: number) => {
        return new Date(date.getTime() + hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000)
    }

    static leftPadZero = (value: string | number, length: number) => {
        return String(value).padStart(length, '0')
    }

    static formatDate = (dateInput: Date) => {
        const date = new Date(dateInput)
        return `${date.getFullYear()}/${Utils.leftPadZero(date.getMonth() + 1, 2)}/${Utils.leftPadZero(date.getDate(), 2)} ${Utils.leftPadZero(date.getHours(), 2)}:${Utils.leftPadZero(date.getMinutes(), 2)}:${Utils.leftPadZero(date.getSeconds(), 2)}`
    }
}

class Navigation {
    static goToVillage = async (state: State, id: string): Promise<boolean> => {
        await Utils.delayClick()
        state.currentAction = CurrentActionEnum.VILLAGE_RESET
        state.feature.debug && console.log(`Go to village - [${id}]${state.villages[id].name}`)
        $(`.listEntry[data-did="${id}"] > a`)[0].click()
        return true
    }

    static goToBuilding = async (state: State, aid: number, gid: number): Promise<boolean> => {
        if (aid <= 18 && state.currentPage === CurrentPageEnum.FIELDS) {
            await Utils.delayClick()
            state.feature.debug && console.log(`Go to building - [aid=${aid},gid=${gid}]${GID_NAME_MAP[gid]}`)
            $(`a[href="/build.php?id=${aid}"]`)[0].click()
            return true
        } else if (aid > 18 && state.currentPage === CurrentPageEnum.TOWN) {
            await Utils.delayClick()
            state.feature.debug && console.log(`Go to building - [aid=${aid},gid=${gid}]${GID_NAME_MAP[gid]}`)
            if (aid === 40) { // Special case for wall
                $('#villageContent > div.buildingSlot.a40.g33.top.gaul > svg > g.hoverShape > path').trigger('click')
            } else {
                $(`a[href="/build.php?id=${aid}&gid=${gid}"]`)[0].click()
            }
            return true
        } else {
            return false
        }
    }

    static goToFields = async (state: State): Promise<boolean> => {
        await Utils.delayClick()
        state.feature.debug && console.log('Go to fields')
        $('.village.resourceView')[0].click()
        return true
    }

    static goToTown = async (state: State): Promise<boolean> => {
        await Utils.delayClick()
        state.feature.debug && console.log('Go to town')
        $('.village.buildingView')[0].click()
        return true
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
    ATTACK = "ATTACK",
    ADVENTURE = "ADVENTURE"
}

interface TroopMovement {
    type: TroopMovementType
    count: number
    time: Date
}

interface Village {
    id: string
    name: string
    position: Position
    index: number
    currentBuildTasks: CurrentBuildTask[]
    pendingBuildTasks: PendingBuildTask[]
    resources: Resource
    incomingTroops: TroopMovement[]
    outgoingTroops: TroopMovement[]
    lastUpdatedTime: Date
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
        default: {
            state.currentPage = CurrentPageEnum.UNKNOWN
            break
        }
    }
}

const updateVillageList = (state: State) => {
    const villages = state.villages

    const villageListEle = $('.villageList .listEntry')
    const currentVillageId = villageListEle.filter((_, ele) => ele.className.includes('active')).attr('data-did')
    const villiageIds: string[] = []

    villageListEle.each((index, ele) => {
        const id = ele.attributes.getNamedItem('data-did')?.value
        if (!id) {
            return
        }

        villiageIds.push(id)

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
            index,
            position: { x, y },
        }
    })

    state.villages = Object.fromEntries(Object.entries(villages).filter(([id, _]) => villiageIds.includes(id)))
    if (currentVillageId)
        state.currentVillageId = currentVillageId
}

const updateCurrentVillageStatus = (state: State) => {
    const villages = state.villages
    const currentVillageId = state.currentVillageId

    let lumber = Utils.parseIntIgnoreSep($('#l1')[0].innerText)
    let clay = Utils.parseIntIgnoreSep($('#l2')[0].innerText)
    let iron = Utils.parseIntIgnoreSep($('#l3')[0].innerText)
    let crop = Utils.parseIntIgnoreSep($('#l4')[0].innerText)

    villages[currentVillageId].resources = { lumber, clay, iron, crop }

    if ([CurrentPageEnum.FIELDS, CurrentPageEnum.TOWN].includes(state.currentPage)) {
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

        const incomingTroops: TroopMovement[] = []
        const outgoingTroops: TroopMovement[] = []

        $('#movements tr').each((_, ele) => {
            const typeEle = $(ele).find('.typ img')
            if (!typeEle.length)
                return

            const type = typeEle[0].attributes.getNamedItem('class')?.value
            const count = Utils.parseIntIgnoreSep($(ele).find('.mov').text())
            const timer = $(ele).find('.timer').text()

            const timerParts = timer.split(":")
            const time = Utils.addToDate(
                new Date(),
                Utils.parseIntIgnoreSep(timerParts[0]),
                Utils.parseIntIgnoreSep(timerParts[1]),
                Utils.parseIntIgnoreSep(timerParts[2])
            )

            switch (type) {
                case 'def1':
                    incomingTroops.push({
                        type: TroopMovementType.REINFORCE,
                        count,
                        time
                    })
                    break
                case 'hero_on_adventure':
                    outgoingTroops.push({
                        type: TroopMovementType.ADVENTURE,
                        count,
                        time
                    })
                    break
                case 'att2':
                    outgoingTroops.push({
                        type: TroopMovementType.ATTACK,
                        count,
                        time
                    })
                    break
            }

            villages[currentVillageId].incomingTroops = incomingTroops
            villages[currentVillageId].outgoingTroops = outgoingTroops
        })

        villages[currentVillageId].lastUpdatedTime = new Date()
    }

    state.villages = villages
}

const build = async (state: State) => {
    // Try building in current village
    const villages = state.villages
    const village = villages[state.currentVillageId]
    if (village.pendingBuildTasks.length > 0) {
        const task = village.pendingBuildTasks[0]
        if (village.currentBuildTasks.length < 2
            && [CurrentPageEnum.FIELDS, CurrentPageEnum.TOWN].includes(state.currentPage)
            && task.resources.lumber <= village.resources.lumber
            && task.resources.clay <= village.resources.clay
            && task.resources.iron <= village.resources.iron
            && task.resources.crop <= village.resources.crop
        ) {
            state.currentAction = CurrentActionEnum.BUILD
            const success = await Navigation.goToBuilding(state, task.aid, task.gid)
            if (!success) {
                if (state.currentPage === CurrentPageEnum.FIELDS)
                    await Navigation.goToTown(state)
                else
                    await Navigation.goToFields(state)
            }
            return
        }

        let params = new URLSearchParams(window.location.search);
        if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === `${task.aid}` && params.get('gid') === `${task.gid}`) {
            const bulidButton = $('.section1 > button.green')
            if (bulidButton.length) {
                await Utils.delayClick()
                state.currentAction = CurrentActionEnum.IDLE
                village.pendingBuildTasks.splice(0, 1)
                state.villages = villages
                bulidButton.trigger('click')
                return
            }
        }
    }

    // Check if need to build in another village
    const nextVillageIdToBuild = Object.entries(state.villages)
        .filter(([_, village]) =>
            village.pendingBuildTasks.length > 0 && village.currentBuildTasks.filter(t => new Date(t.finishTime) < new Date()).length < 2
        )
        .map(([id, _]) => id)
        .find(_ => true)

    if (nextVillageIdToBuild) {
        await Navigation.goToVillage(state, nextVillageIdToBuild)
    } else {
        state.currentAction = CurrentActionEnum.IDLE
    }
}

const nextVillage = async (state: State) => {
    if (new Date(state.nextVillageRotationTime) < new Date()) {
        state.nextVillageRotationTime = Utils.addToDate(new Date(), 0, Utils.randInt(5, 10), 20)

        let earliestVillageId: string = ''
        Object.values(state.villages)
            .forEach(village => {
                if (!village.lastUpdatedTime || !earliestVillageId || village.lastUpdatedTime < state.villages[earliestVillageId].lastUpdatedTime) {
                    earliestVillageId = village.id
                }
            })

        await Navigation.goToVillage(state, earliestVillageId)
    }
}

const render = (state: State) => {
    const villages = state.villages
    const currentVillage = state.villages[state.currentVillageId]

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
    `)

    $('#addCurrentToPending').on('click', () => {
        const villages = state.villages
        const pendingBuildTasks = villages[state.currentVillageId].pendingBuildTasks

        const params = new URLSearchParams(window.location.search);
        const aid = params.get('id')
        const gid = params.get('gid')

        if (!aid || !gid) {
            return
        }

        const resourceRequirementEle = $('#contract .value')
        if (!resourceRequirementEle.length) {
            return
        }

        const lumber = Utils.parseIntIgnoreSep(resourceRequirementEle[0].innerText)
        const clay = Utils.parseIntIgnoreSep(resourceRequirementEle[1].innerText)
        const iron = Utils.parseIntIgnoreSep(resourceRequirementEle[2].innerText)
        const crop = Utils.parseIntIgnoreSep(resourceRequirementEle[3].innerText)

        pendingBuildTasks.push({
            aid: Utils.parseIntIgnoreSep(aid),
            gid: Utils.parseIntIgnoreSep(gid),
            resources: {
                lumber,
                clay,
                iron,
                crop
            }
        })

        state.villages = villages
    })

    $('.removeFromPending').on('click', (ele) => {
        const idx = ele.target.attributes.getNamedItem('idx')?.value
        if (!idx)
            return

        const villages = state.villages
        const pendingBuildTasks = villages[state.currentVillageId].pendingBuildTasks
        pendingBuildTasks.splice(Utils.parseIntIgnoreSep(idx), 1)
        state.villages = villages
    })

    $('#toggleAutoScan').on('click', () => {
        const feature = state.feature
        feature.autoScan = !feature.autoScan
        state.feature = feature
    })

    $('#toggleAutoBuild').on('click', () => {
        const feature = state.feature
        feature.autoBuild = !feature.autoBuild
        state.feature = feature
    })

    $('#toggleDebug').on('click', () => {
        const feature = state.feature
        feature.debug = !feature.debug
        state.feature = feature
    })
}

const run = async (state: State) => {
    updateCurrentPage(state)
    updateVillageList(state)
    updateCurrentVillageStatus(state)
    // alertAttack()
    // alertEmptyBuildQueue()
 
    if ([CurrentActionEnum.IDLE, CurrentActionEnum.BUILD].includes(state.currentAction) && state.feature.autoBuild) {
        await build(state)
    }

    if (CurrentActionEnum.VILLAGE_RESET === state.currentAction) {
        state.currentAction = CurrentActionEnum.IDLE
        if (state.currentPage !== CurrentPageEnum.FIELDS)
            await Navigation.goToFields(state)
    }

    if (state.currentAction === CurrentActionEnum.IDLE && state.feature.autoScan) {
        await nextVillage(state)
    }
}

const initialize = () => {
    const handler = new StateHandler()
    const state: State = new Proxy(StateHandler.INITIAL_STATE, handler)
    handler.setCallback(() => render(state))

    createStyle()
    createContainer()
    render(state)
    run(state)
    setInterval(() => run(state), 10000)
}

initialize()