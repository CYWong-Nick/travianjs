const BUILD_TIME = "@@BUILD_TIME@@"
const RUN_INTERVAL = 10000
const GID_NAME_MAP: Record<string, string> = {
    "-1": "Unknown",
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
    "40": "Wonder of the World",
    "46": "Hospital"
}

enum CurrentPageEnum {
    LOGIN = "LOGIN",
    FIELDS = "FIELDS",
    TOWN = "TOWN",
    BUILDING = "BUILDING",
    REPORT = "REPORT",
    OFF_REPORT = "OFF_REPORT",
    SCOUT_REPORT = "SCOUT_REPORT",
    UNKNOWN = "UNKNOWN"
}

enum CurrentActionEnum {
    IDLE = "IDLE",
    BUILD = "BUILD",
    NAVIGATE_TO_FIELDS = "NAVIGATE_TO_FIELDS",
    SCOUT = "SCOUT",
    FARM = "FARM",
    EVADE = "EVADE",
    CUSTOM_FARM = "CUSTOM_FARM"
}

interface Feature {
    autoLogin: boolean
    autoScan: boolean
    autoBuild: boolean
    alertAttack: boolean
    alertEmptyBuildQueue: boolean
    alertResourceCapacityFull: boolean
    autoScout: boolean
    autoFarm: boolean
    disableStopOnLoss: boolean
    autoCustomFarm: boolean
    debug: boolean
}

enum FarmType {
    ATTACK = 'ATTACK',
    RAID = 'RAID'
}

interface CustomFarm {
    nextCustomFarmTime?: Date,
    position: Position,
    farmIntervalMinutes: { min: number, max: number },
    troops: Record<string, string>,
    type: FarmType
}

interface State {
    currentAction: CurrentActionEnum
    currentPage: CurrentPageEnum
    currentVillageId: string
    villages: Record<string, Village>
    feature: Feature
    nextVillageRotationTime: Date
    nextScoutTime: Date
    nextFarmTime: Date
    nextCheckReportTime: Date
    farmIntervalMinutes: { min: number, max: number }
    alertedPlusIncomingAttack: boolean
    telegramChatId: string
    telegramToken: string
    username: string
    password: string
}

class StateHandler implements ProxyHandler<State> {
    static INITIAL_STATE: State = {
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
            autoScout: false,
            autoFarm: false,
            disableStopOnLoss: false,
            autoCustomFarm: false,
            debug: false
        },
        nextVillageRotationTime: new Date(),
        nextScoutTime: new Date(),
        nextFarmTime: new Date(),
        nextCheckReportTime: new Date(),
        farmIntervalMinutes: {min: 2, max: 4},
        alertedPlusIncomingAttack: false,
        telegramChatId: '',
        telegramToken: '',
        username: '',
        password: ''
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
    static parseIntIgnoreNonNumeric = (text: string) => {
        return parseInt(text.replace(/[^0-9]/g, ''))
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

    static addToDate = (date: Date, hour: number, minute: number, second: number): Date => {
        return new Date(date.getTime() + hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000)
    }

    static leftPadZero = (value: string | number, length: number) => {
        return String(value).padStart(length, '0')
    }

    static formatDate = (dateInput?: Date) => {
        if (!dateInput) {
            return 'N/A'
        }
        const date = new Date(dateInput)
        return `${date.getFullYear()}/${Utils.leftPadZero(date.getMonth() + 1, 2)}/${Utils.leftPadZero(date.getDate(), 2)} ${Utils.leftPadZero(date.getHours(), 2)}:${Utils.leftPadZero(date.getMinutes(), 2)}:${Utils.leftPadZero(date.getSeconds(), 2)}`
    }

    static isSufficientResources = (required: Resource, own: Resource) => {
        return required.lumber <= own.lumber && required.clay <= own.clay && required.iron <= own.iron && required.crop <= own.crop
    }
}

class Navigation {
    static goToVillage = async (state: State, id: string, action: CurrentActionEnum): Promise<boolean> => {
        await Utils.delayClick()
        state.currentAction = action
        state.feature.debug && console.log(`Go to village - [${id}]${state.villages[id].name}`)
        $(`.listEntry[data-did="${id}"] > a`)[0].click()
        return true
    }

    static goToBuilding = async (state: State, aid: number, gid: number, action: CurrentActionEnum): Promise<boolean> => {
        if (aid <= 18 && state.currentPage === CurrentPageEnum.FIELDS) {
            await Utils.delayClick()
            state.currentAction = action
            state.feature.debug && console.log(`Go to building - [aid=${aid},gid=${gid}]${GID_NAME_MAP[gid]}`)
            $(`a[href="/build.php?id=${aid}"]`)[0].click()
            return true
        } else if (aid > 18 && state.currentPage === CurrentPageEnum.TOWN) {
            await Utils.delayClick()
            state.currentAction = action
            state.feature.debug && console.log(`Go to building - [aid=${aid},gid=${gid}]${GID_NAME_MAP[gid]}`)
            if (aid === 40) { // Special case for wall
                $('#villageContent > div.buildingSlot.a40.top > svg > g.hoverShape > path').trigger('click')
            } else {
                $(`a[href="/build.php?id=${aid}&gid=${gid}"]`)[0].click()
            }
            return true
        } else {
            state.feature.debug && console.log(`Cannot go to building - [aid=${aid},gid=${gid}]${GID_NAME_MAP[gid]}`)
            return false
        }
    }

    static goToFields = async (state: State, action: CurrentActionEnum): Promise<boolean> => {
        await Utils.delayClick()
        state.currentAction = action
        state.feature.debug && console.log('Go to fields')
        $('.village.resourceView')[0].click()
        return true
    }

    static goToTown = async (state: State, action: CurrentActionEnum): Promise<boolean> => {
        await Utils.delayClick()
        state.currentAction = action
        state.feature.debug && console.log('Go to town')
        $('.village.buildingView')[0].click()
        return true
    }

    static goToReport = async (state: State, action: CurrentActionEnum): Promise<boolean> => {
        await Utils.delayClick()
        state.currentAction = action
        state.feature.debug && console.log('Go to report')
        $('.reports')[0].click()
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
    capacity: Resource
    incomingTroops: TroopMovement[]
    outgoingTroops: TroopMovement[]
    autoEvade?: boolean
    evadeRaidPosition?: Position
    evadeTime?: Date
    lastUpdatedTime?: Date
    attackAlertBackoff?: Date
    emptyBuildQueueAlertBackoff?: Date
    resourceCapacityFullAlertBackoff?: Date
    customFarms?: CustomFarm[]
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
            flex-wrap: wrap;
        }
        
        #console .village-container {
            flex: 0 1 33%;
            margin-top: 10px
        }
        
        #console .ml-5 {
            margin-left: 5px;
        }
        
        #console .mr-5 {
            margin-right: 5px;
        }
        
        .tjs-btn, #console button {
            border: 1px solid black;
            border-radius: 3px;
        }

        .tjs-pending {
            background: lightblue;
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
        case '/report':
        case '/report/overview': {
            state.currentPage = CurrentPageEnum.REPORT
            break
        }
        case '/report/offensive': {
            state.currentPage = CurrentPageEnum.OFF_REPORT
            break
        }
        case '/report/scouting': {
            state.currentPage = CurrentPageEnum.SCOUT_REPORT
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

const login = async (state: State) => {
    if (!state.username || !state.password) {
        state.feature.debug && console.log("User name or password not set")
    }

    $('input[name=name]').val(state.username)
    $('input[name=password]').val(state.password)
    await Utils.delayClick()
    $('button[type=submit]').trigger('click')
}

const updateVillageList = (state: State) => {
    const villages = state.villages

    const villageListEle = $('.villageList .listEntry')
    if (!villageListEle.length) {
        state.feature.debug && console.log("Village list not found")
        return
    }
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
        const x = Utils.parseIntIgnoreNonNumeric(coordinateAttributes.getNamedItem('data-x')?.value || '')
        const y = Utils.parseIntIgnoreNonNumeric(coordinateAttributes.getNamedItem('data-y')?.value || '')

        const villageDefaults: Village = {
            id: '',
            name: '',
            position: {x: 0, y: 0},
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
        }

        villages[id] = {
            ...villageDefaults,
            ...villages[id],
            id,
            name,
            index,
            position: {x, y},
        }
    })

    state.villages = Object.fromEntries(Object.entries(villages).filter(([id, _]) => villiageIds.includes(id)))
    if (currentVillageId)
        state.currentVillageId = currentVillageId
}

const updateCurrentVillageStatus = (state: State) => {
    const villages = state.villages
    const currentVillageId = state.currentVillageId

    let lumber = Utils.parseIntIgnoreNonNumeric($('#l1')[0].innerText)
    let clay = Utils.parseIntIgnoreNonNumeric($('#l2')[0].innerText)
    let iron = Utils.parseIntIgnoreNonNumeric($('#l3')[0].innerText)
    let crop = Utils.parseIntIgnoreNonNumeric($('#l4')[0].innerText)

    villages[currentVillageId].resources = {lumber, clay, iron, crop}

    const warehouseCapacity = Utils.parseIntIgnoreNonNumeric($('.warehouse .capacity > div').text())
    const granaryCapacity = Utils.parseIntIgnoreNonNumeric($('.granary .capacity > div').text())
    villages[currentVillageId].capacity = {
        lumber: warehouseCapacity,
        clay: warehouseCapacity,
        iron: warehouseCapacity,
        crop: granaryCapacity
    }

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
                Utils.parseIntIgnoreNonNumeric(timerParts[0]),
                Utils.parseIntIgnoreNonNumeric(timerParts[1]),
                Utils.parseIntIgnoreNonNumeric(timerParts[2])
            )

            currentBuildTasks.push({
                name,
                level,
                finishTime
            })
        })
        villages[currentVillageId].currentBuildTasks = currentBuildTasks
    }

    if (state.currentPage === CurrentPageEnum.FIELDS) {
        const incomingTroops: TroopMovement[] = []
        const outgoingTroops: TroopMovement[] = []

        $('#movements tr').each((_, ele) => {
            const typeEle = $(ele).find('.typ img')
            if (!typeEle.length)
                return

            const type = typeEle[0].attributes.getNamedItem('class')?.value
            const count = Utils.parseIntIgnoreNonNumeric($(ele).find('.mov').text())
            const timer = $(ele).find('.timer').text()

            const timerParts = timer.split(":")
            const time = Utils.addToDate(
                new Date(),
                Utils.parseIntIgnoreNonNumeric(timerParts[0]),
                Utils.parseIntIgnoreNonNumeric(timerParts[1]),
                Utils.parseIntIgnoreNonNumeric(timerParts[2])
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
                case 'att1':
                case 'att3':
                    incomingTroops.push({
                        type: TroopMovementType.ATTACK,
                        count,
                        time
                    })
                    if (villages[currentVillageId].autoEvade && villages[currentVillageId].evadeRaidPosition) {
                        villages[currentVillageId].evadeTime = Utils.addToDate(time, 0, -1, 0)
                    }
                    break
            }
        })

        villages[currentVillageId].incomingTroops = incomingTroops
        villages[currentVillageId].outgoingTroops = outgoingTroops
        villages[currentVillageId].lastUpdatedTime = new Date()
    }

    state.villages = villages
}

const alertAttack = (state: State, village?: Village, attackTime?: Date) => {
    const villages = state.villages

    if (!state.telegramChatId || !state.telegramToken) {
        state.feature.debug && console.log("Telegram chat id or token not set")
        return
    }
    if (village) {
        if (!village.attackAlertBackoff || new Date(village.attackAlertBackoff) < new Date()) {
            state.feature.debug && console.log(`Send alert for attack at village ${village.name}`)
            village.attackAlertBackoff = Utils.addToDate(new Date(), 0, 5, 0)
            state.villages = villages
            fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Village ${village.name} under attack ${attackTime && `at ${Utils.formatDate(attackTime)}`}`)
        } else {
            state.feature.debug && console.log(`Not alerting attack due to backoff at ${Utils.formatDate(village.attackAlertBackoff)}`)
        }
    } else {
        fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Village is under attack`)
        state.alertedPlusIncomingAttack = true
    }
}

const informTroopsEvaded = (state: State, village?: Village) => {
    const villages = state.villages

    if (!state.telegramChatId || !state.telegramToken) {
        state.feature.debug && console.log("Telegram chat id or token not set")
        return
    }
    if (village) {
        fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Village ${village.name} troops evaded at ${new Date()}`)
    } else {
        fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Troops evaded at ${new Date()}`)
    }
}

const checkIncomingAttack = (state: State) => {
    const villages = state.villages
    const village = villages[state.currentVillageId]
    const attack = village.incomingTroops.find(e => e.type === TroopMovementType.ATTACK)
    if (attack) {
        alertAttack(state, village, attack.time)
    }

    const plusNoAttack = $('.sidebar #sidebarBoxVillagelist .content .villageList .listEntry:not(.attack) .iconAndNameWrapper svg.attack').filter((_, attack) =>
        $(attack).css('visibility') === 'hidden')
    if (plusNoAttack.length !== Object.keys(villages).length && !state.alertedPlusIncomingAttack) {
        const villageIdBeingAttacked = $('div.listEntry.attack').find('.attack').parent().parent().parent().attr('href')?.split('newdid=')[1].split('&')[0]
        alertAttack(state, !!villageIdBeingAttacked ? villages[villageIdBeingAttacked] : undefined)
        villageIdBeingAttacked && villageIdBeingAttacked !== state.currentVillageId && Navigation.goToVillage(state, villageIdBeingAttacked, CurrentActionEnum.IDLE)
    } else if (plusNoAttack.length === Object.keys(villages).length && state.alertedPlusIncomingAttack) {
        state.alertedPlusIncomingAttack = false
    }
}

const alertEmptyBuildQueue = (state: State) => {
    const villages = state.villages
    const village = villages[state.currentVillageId]
    if (!village.currentBuildTasks.length) {
        if (!state.telegramChatId || !state.telegramToken) {
            state.feature.debug && console.log("Telegram chat id or token not set")
            return
        }
        if (!village.emptyBuildQueueAlertBackoff || new Date(village.emptyBuildQueueAlertBackoff) < new Date()) {
            state.feature.debug && console.log(`Send alert for attack at village ${village.name}`)
            village.emptyBuildQueueAlertBackoff = Utils.addToDate(new Date(), 0, 5, 0)
            state.villages = villages
            fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Village ${village.name} build queue is empty`)
        } else {
            state.feature.debug && console.log(`Not alerting empty build queue due to backoff at ${Utils.formatDate(village.emptyBuildQueueAlertBackoff)}`)
        }
    }
}

const alertResourceCapacityFull = (state: State) => {
    const villages = state.villages
    const village = villages[state.currentVillageId]

    let fullResourceType = ''
    if (village.resources.lumber === village.capacity.lumber) {
        fullResourceType = 'lumber'
    }

    if (village.resources.clay === village.capacity.clay) {
        fullResourceType = 'clay'
    }

    if (village.resources.iron === village.capacity.iron) {
        fullResourceType = 'iron'
    }

    if (village.resources.crop === village.capacity.crop) {
        fullResourceType = 'crop'
    }

    if (fullResourceType) {
        if (!state.telegramChatId || !state.telegramToken) {
            state.feature.debug && console.log("Telegram chat id or token not set")
            return
        }
        if (!village.resourceCapacityFullAlertBackoff || new Date(village.resourceCapacityFullAlertBackoff) < new Date()) {
            state.feature.debug && console.log(`Send alert for capacity full for ${fullResourceType} at village ${village.name}`)
            village.resourceCapacityFullAlertBackoff = Utils.addToDate(new Date(), 0, 5, 0)
            state.villages = villages
            fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Village ${village.name} ${fullResourceType} is at capacity`)
        } else {
            state.feature.debug && console.log(`Not alerting capacity full due to backoff at ${Utils.formatDate(village.resourceCapacityFullAlertBackoff)}`)
        }
    }
}

const build = async (state: State) => {
    // Try building in current village
    const villages = state.villages
    const village = villages[state.currentVillageId]
    if (village.pendingBuildTasks.length > 0) {
        const task = village.pendingBuildTasks[0]
        if (village.currentBuildTasks.length < 2
            && [CurrentPageEnum.FIELDS, CurrentPageEnum.TOWN].includes(state.currentPage)
            && Utils.isSufficientResources(task.resources, village.resources)
        ) {
            const success = await Navigation.goToBuilding(state, task.aid, task.gid, CurrentActionEnum.BUILD)
            if (!success) {
                if (state.currentPage === CurrentPageEnum.FIELDS)
                    await Navigation.goToTown(state, CurrentActionEnum.BUILD)
                else
                    await Navigation.goToFields(state, CurrentActionEnum.BUILD)
            }
            return
        }

        const params = new URLSearchParams(window.location.search);
        const aid = params.get('id')
        const gid = params.get('gid')

        if (state.currentPage === CurrentPageEnum.BUILDING
            && aid === `${task.aid}`
            && (gid === `${task.gid}` || task.gid === -1)
        ) {

            // Prevent infinite loop due to mismatch in resources requirements
            const resourceRequirementEle = $('#contract .value')
            if (!resourceRequirementEle.length) {
                return
            }

            const lumber = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[0].innerText)
            const clay = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[1].innerText)
            const iron = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[2].innerText)
            const crop = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[3].innerText)

            village.pendingBuildTasks[0].resources = {lumber, clay, iron, crop}
            state.villages = villages

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
            village.pendingBuildTasks.length > 0
            && village.currentBuildTasks.filter(task => new Date(task.finishTime) > new Date()).length < 2
            && Utils.isSufficientResources(village.pendingBuildTasks[0].resources, village.resources)
        )
        .map(([id, _]) => id)
        .find(_ => true)

    if (nextVillageIdToBuild) {
        await Navigation.goToVillage(state, nextVillageIdToBuild, CurrentActionEnum.NAVIGATE_TO_FIELDS)
    } else {
        state.feature.debug && console.log("Nothing to build in other villages")
        state.currentAction = CurrentActionEnum.IDLE
    }
}

const scout = async (state: State) => {
    if (new Date(state.nextScoutTime) < new Date()) {
        const params = new URLSearchParams(window.location.search);
        if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') === '99') {
            const startButtonEle = $('.startButton[value=Start]').filter((_, button) => {
                return $(button).parent().parent().find('.listName').find('span').text() === "Scout"
            })
            for (let i = 0; i < startButtonEle.length; i++) {
                await Utils.delayClick()
                startButtonEle[i].click()
            }
            state.nextScoutTime = Utils.addToDate(new Date(), 0, Utils.randInt(30, 40), 0)
            await Navigation.goToFields(state, CurrentActionEnum.IDLE);
            return
        } else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') !== '99') {
            await Utils.delayClick()
            $('a[href="/build.php?id=39&gid=16&tt=99"]')[0].click()
            return
        } else if (state.currentPage === CurrentPageEnum.TOWN) {
            await Navigation.goToBuilding(state, 39, 16, CurrentActionEnum.SCOUT)
            return
        } else {
            await Navigation.goToTown(state, CurrentActionEnum.SCOUT)
            return
        }
    }
}

const farm = async (state: State) => {
    if (new Date(state.nextFarmTime) < new Date()) {
        const params = new URLSearchParams(window.location.search);
        if (state.currentPage === CurrentPageEnum.REPORT) {
            await Utils.delayClick()
            $('a[href="/report/offensive"]')[0].click()
            return
        } else if (state.currentPage === CurrentPageEnum.OFF_REPORT) {
            const unreadReports = $("#overview > tbody").find(".messageStatusUnread")
            // const unreadReports = $("#overview > tbody").find(".messageStatusUnread")
            //     .filter((_, msg) => !$($(msg).parent().parent().find('a')[2]).text().includes("Unoccupied oasis"))
            state.feature.debug && console.log("Unread report: " + unreadReports.length)
            if (unreadReports.length > 0) {
                const feature = state.feature;
                feature.autoFarm = false;
                state.feature = feature;
                fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Losses occurred, please check the offensive report`)
            }
            state.nextCheckReportTime = Utils.addToDate(new Date(), 0, 1, 0)
            await Navigation.goToTown(state, CurrentActionEnum.FARM)
            return
        } else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') === '99') {
            const startButtonEle = $('.startButton[value=Start]').filter((_, button) => {
                return $(button).parent().parent().find('.listName').find('span').text() !== "Scout"
            })
            for (let i = 0; i < startButtonEle.length; i++) {
                await Utils.delayClick()
                startButtonEle[i].click()
            }
            state.nextFarmTime = Utils.addToDate(new Date(), 0, Utils.randInt(state.farmIntervalMinutes.min, state.farmIntervalMinutes.max), Utils.randInt(0, 59))
            await Navigation.goToFields(state, CurrentActionEnum.IDLE);
            return
        } else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') !== '99') {
            await Utils.delayClick()
            $('a[href="/build.php?id=39&gid=16&tt=99"]')[0].click()
            return
        } else if (state.currentPage === CurrentPageEnum.TOWN) {
            if (!state.feature.disableStopOnLoss && new Date(state.nextCheckReportTime) < new Date()) {
                await Navigation.goToReport(state, CurrentActionEnum.FARM)
            } else {
                await Navigation.goToBuilding(state, 39, 16, CurrentActionEnum.FARM)
            }
            return
        } else {
            if (!state.feature.disableStopOnLoss && new Date(state.nextCheckReportTime) < new Date()) {
                await Navigation.goToReport(state, CurrentActionEnum.FARM)
            } else {
                await Navigation.goToTown(state, CurrentActionEnum.FARM)
            }
            return
        }
    }
}

const checkAutoEvade = async (state: State) => {
    const params = new URLSearchParams(window.location.search);
    const villages = state.villages
    const villageRequireEvade = Object.values(villages).filter(v => !!v.evadeTime).find(v => v.evadeTime! < new Date())

    if (villageRequireEvade) {
        if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') !== '2') {
            await Utils.delayClick()
            $('a[href="/build.php?id=39&gid=16&tt=2"]')[0].click()
            return
        } else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('gid') === '16' && params.get('tt') === '2') {
            await Utils.delayClick();

            const sendTroopButton = $("#ok")
            const confirmButton = $("#checksum")

            if (sendTroopButton.length > 0) {
                $("#troops > tbody").find("td").each((column, td) => {
                        const troopInput = $(td).find("input")
                        troopInput.val('99999')
                    }
                )

                if (villageRequireEvade.evadeRaidPosition?.x && villageRequireEvade.evadeRaidPosition?.y) {
                    $("#xCoordInput").val(villageRequireEvade.evadeRaidPosition.x)
                    $("#yCoordInput").val(villageRequireEvade.evadeRaidPosition.y)
                }

                $('.radio')[2].click()

                await Utils.delayClick();
                sendTroopButton[0].click();

            } else if (confirmButton.length > 0) {
                await Utils.delayClick()
                confirmButton[0].click()
            }

            return;
        } else if (state.currentPage === CurrentPageEnum.BUILDING && state.currentAction === CurrentActionEnum.EVADE
            && params.get('gid') === '16' && params.get('tt') === '1') {
            informTroopsEvaded(state, villageRequireEvade)

            await Navigation.goToFields(state, CurrentActionEnum.IDLE);
            return;
        } else if (state.currentPage === CurrentPageEnum.TOWN) {
            await Navigation.goToBuilding(
                state,
                39,
                16,
                CurrentActionEnum.EVADE
            );
            return;
        } else {
            await Navigation.goToTown(state, CurrentActionEnum.EVADE);
            return;
        }
    }
}

const executeCustomFarm = async (state: State, idx: number) => {
    const params = new URLSearchParams(window.location.search);
    const villages = state.villages
    const village = villages[state.currentVillageId]
    const customFarm = village.customFarms?.[idx]

    if (customFarm) {
        if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') !== '2') {
            await Utils.delayClick()
            $('a[href="/build.php?id=39&gid=16&tt=2"]')[0].click()
            return
        } else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('gid') === '16' && params.get('tt') === '2') {
            await Utils.delayClick();

            const sendTroopButton = $("#ok")
            const confirmButton = $("#checksum")
            if (sendTroopButton.length > 0) {
                Object.keys(customFarm.troops).forEach(troopKey => {
                    if (customFarm.troops[troopKey]) {
                        state.feature.debug && (console.log("Troop Key: ", troopKey))
                        const troopInputEle = $(`input[name="${troopKey}"]`);
                        troopInputEle[0].click();
                        troopInputEle.val(customFarm.troops[troopKey]);
                    }
                })
                $("#xCoordInput").val(customFarm.position.x)
                $("#yCoordInput").val(customFarm.position.y)

                if (customFarm.type === FarmType.ATTACK) {
                    $('.radio')[1].click()
                } else {
                    $('.radio')[2].click()
                }

                await Utils.delayClick();
                sendTroopButton[0].click();

            } else if (confirmButton.length > 0) {
                await Utils.delayClick()
                confirmButton[0].click()
            }

            return;
        } else if (state.currentPage === CurrentPageEnum.BUILDING && state.currentAction === CurrentActionEnum.CUSTOM_FARM
            && params.get('gid') === '16' && params.get('tt') === '1') {
            village.customFarms![idx].nextCustomFarmTime = Utils.addToDate(
                new Date(),
                0,
                Utils.randInt(customFarm.farmIntervalMinutes.min, customFarm.farmIntervalMinutes.max),
                Utils.randInt(0, 59)
            );

            state.villages = villages

            await Navigation.goToFields(state, CurrentActionEnum.IDLE);
            return;
        } else if (state.currentPage === CurrentPageEnum.TOWN) {
            await Navigation.goToBuilding(
                state,
                39,
                16,
                CurrentActionEnum.CUSTOM_FARM
            );
            return;
        } else {
            await Navigation.goToTown(state, CurrentActionEnum.CUSTOM_FARM);
            return;
        }
    }
}

const customFarm = async (state: State) => {
    const villages = state.villages
    const customFarms = villages[state.currentVillageId].customFarms || []

    // Check current village custom farm
    for (const idxStr in customFarms) {
        const idx = parseInt(idxStr)
        const customFarm = customFarms[idx]
        if (customFarm.nextCustomFarmTime) {
            // @ts-ignore
            if (new Date(customFarm.nextCustomFarmTime) < new Date()) {
                state.feature.debug && console.log("Execute custom farm")
                await executeCustomFarm(state, idx)
                return
            }
        }
    }


    // Check other villages
    const nextVillageIdToCustomFarm = Object.entries(state.villages)
        .filter(([_, village]) =>
            village.id !== state.currentVillageId &&
            village.customFarms &&
            village.customFarms.length > 0 &&
            village.customFarms.some(customFarm => customFarm.nextCustomFarmTime && new Date(customFarm.nextCustomFarmTime) < new Date())
        ).map(([id, _]) => id)
        .find(_ => true)

    if (nextVillageIdToCustomFarm) {
        state.feature.debug && console.log("Go to village")
        await Navigation.goToVillage(state, nextVillageIdToCustomFarm, CurrentActionEnum.NAVIGATE_TO_FIELDS)
    } else {
        state.feature.debug && console.log("No custom farm required in other villages")
        state.currentAction = CurrentActionEnum.IDLE
    }
}

const nextVillage = async (state: State) => {
    const nextRotationTime = new Date(state.nextVillageRotationTime)
    const currentTime = new Date()
    if (nextRotationTime < new Date()) {
        state.nextVillageRotationTime = Utils.addToDate(new Date(), 0, Utils.randInt(5, 10), 0)

        let earliestVillageId: string = Object.keys(state.villages)[0]
        Object.values(state.villages)
            .forEach(village => {
                const earliestUpdatedTime = state.villages[earliestVillageId]?.lastUpdatedTime
                if (!village.lastUpdatedTime || (earliestUpdatedTime && village.lastUpdatedTime < earliestUpdatedTime)) {
                    earliestVillageId = village.id
                }
            })

        state.feature.debug && console.log(`Rotating to ${state.villages[earliestVillageId].name}`)
        await Navigation.goToVillage(state, earliestVillageId, CurrentActionEnum.NAVIGATE_TO_FIELDS)
    } else {
        state.feature.debug && console.log(`Not rotating, next rotation=${Utils.formatDate(nextRotationTime)}, current=${Utils.formatDate(currentTime)}`)
    }
}

const handleFeatureToggle = (selector: string, state: State, key: keyof Feature) => {
    $(selector).on('click', () => {
        const feature = state.feature
        feature[key] = !feature[key]
        state.feature = feature
    })
}

const render = (state: State) => {
    if (state.currentPage === CurrentPageEnum.BUILDING) {
        const btn = '<button id="addCurrentToPendingInBuilding" class="tjs-btn addCurrentToPending">Add to queue</button>'
        if ($('#addCurrentToPendingInBuilding').length === 0)
            $('.upgradeBuilding').after(btn)
        else
            $('#addCurrentToPendingInBuilding').replaceWith(btn)
    }

    const villages = state.villages
    const currentVillage = villages[state.currentVillageId]
    const params = new URLSearchParams(window.location.search);

    if (currentVillage && [CurrentPageEnum.FIELDS, CurrentPageEnum.TOWN].includes(state.currentPage)) {
        const records = currentVillage.pendingBuildTasks.reduce((group, task) => {
            group[task.aid] = group[task.aid] || 0
            group[task.aid]++
            return group
        }, {} as Record<number, number>)

        const classNamePrefix = state.currentPage === CurrentPageEnum.FIELDS ? "buildingSlot" : "aid"

        $('.tjs-pending').remove()
        Object.entries(records).forEach(([id, count]) => {
            const div = `<div class="tjs-pending">+${count}</div>`
            if ($(`.${classNamePrefix}${id} .tjs-pending`).length === 0) {
                $(`.${classNamePrefix}${id} .labelLayer`).after(div)
            } else {
                $(`.${classNamePrefix}${id} .tjs-pending`).replaceWith(div)
            }
        })
    }

    if ([CurrentPageEnum.REPORT, CurrentPageEnum.OFF_REPORT, CurrentPageEnum.SCOUT_REPORT].includes(state.currentPage)) {
        const resourcesFromReport = {
            lumber: 0,
            clay: 0,
            iron: 0,
            crop: 0
        };
        resourcesFromReport.lumber = Utils.parseIntIgnoreNonNumeric($($('.resources').find('span.value')[0]).text());
        resourcesFromReport.clay = Utils.parseIntIgnoreNonNumeric($($('.resources').find('span.value')[1]).text());
        resourcesFromReport.iron = Utils.parseIntIgnoreNonNumeric($($('.resources').find('span.value')[2]).text());
        resourcesFromReport.crop = Utils.parseIntIgnoreNonNumeric($($('.resources').find('span.value')[3]).text());
        const sum = resourcesFromReport.lumber + resourcesFromReport.clay + resourcesFromReport.iron + resourcesFromReport.crop;
        const cranny = Utils.parseIntIgnoreNonNumeric($('.rArea').text());
        const troops70 = `<div id="troops-required-70">Troops Required: ${Math.ceil((sum - cranny * 4) / 70)} | ${Math.ceil((sum - (cranny * 0.85) * 4) / 70)} with hero (70 per troop)</div>`;
        if ($('#troops-required-70').length === 0)
            $(".additionalInformation").after(troops70);
        else
            $('#troops-required-70').replaceWith(troops70);
        const troops50 = `<div id="troops-required-50">Troops Required: ${Math.ceil((sum - cranny * 4) / 50)} | ${Math.ceil((sum - (cranny * 0.85) * 4) / 50)} with hero (50 per troop)</div>`;
        if ($('#troops-required-50').length === 0)
            $(".additionalInformation").after(troops50);
        else
            $('#troops-required-50').replaceWith(troops50);
    }

    $('#console').html(`
        <div class="flex-row">
            <h4>Console</h4>
            <input id="toggleAutoLogin" class="ml-5" type="checkbox" ${state.feature.autoLogin ? 'checked' : ''}/> Auto login
            <input id="toggleAutoScan" class="ml-5" type="checkbox" ${state.feature.autoScan ? 'checked' : ''}/> Auto village rotation
            <input id="toggleAutoBuild" class="ml-5" type="checkbox" ${state.feature.autoBuild ? 'checked' : ''}/> Auto build
            <input id="toggleAutoScout" class="ml-5" type="checkbox" ${state.feature.autoScout ? 'checked' : ''}/> Auto scout
            <input id="toggleAutoFarm" class="ml-5" type="checkbox" ${state.feature.autoFarm ? 'checked' : ''}/> Auto farm
            <input id="toggleDisableStopOnLoss" class="ml-5" type="checkbox" ${state.feature.disableStopOnLoss ? 'checked' : ''}/> Disable stop on loss
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
            <div>Interval Range: ${state.farmIntervalMinutes.min}mins - ${state.farmIntervalMinutes.max}mins</div>
            <div class="flex-row">
                <input id="minFarmMinutes" style="width: 5%">min</input>
                <input id="maxFarmMinutes" style="width: 5%">max</input>
                <button id="updateFarmInterval" class="ml-5">Update</button>
            </div>
            <div>Next rotation: ${Utils.formatDate(state.nextVillageRotationTime)}</div>
            <div>Next scout: ${Utils.formatDate(state.nextScoutTime)}</div>
            <div>Next farm: ${Utils.formatDate(state.nextFarmTime)}</div>
        </div>
        <div>
            <h4>Action</h4>
            ${state.currentPage === CurrentPageEnum.FIELDS ? '<button id="addAllFields">Add all fields</button>' : ''}
        </div>
        <br />
        <div class="flex-row">
            ${Object.entries(villages).map(([id, village]) => `
                <div class="village-container">
                    <h4>${village.name} (id: ${id}) (${village.position.x}, ${village.position.y})</h4>
                    <br />
                    <div>Last update: ${Utils.formatDate(village.lastUpdatedTime)}</div>
                    <div>Attack alert backoff: ${Utils.formatDate(village.attackAlertBackoff)}</div>
                    <div>Empty build queue alert backoff: ${Utils.formatDate(village.emptyBuildQueueAlertBackoff)}</div>
                    <br />
                    ${state.currentPage === CurrentPageEnum.BUILDING && state.currentVillageId === village.id && params.get('gid') === '16' && params.get('tt') === '2' ?
        `<div class="flex-row">
                            <input id="minCustomFarmMinutes" style="width: 5%">min</input>
                            <input id="maxCustomFarmMinutes" style="width: 5%">max</input>
                            <button id="addCurrentToCustomFarm" class="ml-5">Add Current</button>
                        </div>`
        : ''
    }
                    ${(village.customFarms || []).map((customFarm, idx) => `                    
                    <div class="flex-row">
                        <div>Next custom farm time: ${Utils.formatDate(customFarm.nextCustomFarmTime)}</div>
                    </div>
                        <div>Target: (${customFarm.position.x}|${customFarm.position.y})</div>
                        <div>Troops: ${Object.keys(customFarm.troops).filter(key => customFarm.troops[key]).map(key => key + ": " + customFarm.troops[key]).join(", ")}</div>
                        <div>Interval Range: ${customFarm.farmIntervalMinutes.min}mins - ${customFarm.farmIntervalMinutes.max}mins</div>
                        <div>Type: ${customFarm.type === FarmType.ATTACK ? 'Attack' : 'Raid'}</div>
                        <button class="removeCustomFarm" village-id="${id}" idx="${idx}">x</button>`)}
                    <br />
                    <h5>Auto Evade</h5>
                    <div>Evade Raid Target: ${village.evadeRaidPosition ? `(${village.evadeRaidPosition.x}|${village.evadeRaidPosition.y})` : 'N/A'}</div>
                    <div class="flex-row">
                        <input id="evadeRaidTargetX-${id}" style="width: 5%">x</input>
                        <input id="evadeRaidTargetY-${id}" style="width: 5%">y</input>
                        <button id="updateEvadeRaidTarget-${id}" class="ml-5">Update</button>
                    </div>
                    <input id="toggleAutoEvade-${id}" class="ml-5" type="checkbox" ${village.autoEvade ? 'checked' : ''} />Enable Auto Evade
                    
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
            `).join('')}
        </div>
    `)

    Object.values(villages).forEach(village => {
        $(`#updateEvadeRaidTarget-${village.id}`).on('click', () => {
            const villages = state.villages
            const positionX = parseInt($(`#evadeRaidTargetX-${village.id}`).val() as string)
            const positionY = parseInt($(`#evadeRaidTargetY-${village.id}`).val() as string)

            currentVillage.evadeRaidPosition = {
                x: positionX,
                y: positionY
            } as Position

            state.villages = villages
        })
        $(`#toggleAutoEvade-${village.id}`).on('click', () => {
            const villages = state.villages
            currentVillage.autoEvade = !currentVillage.autoEvade
            state.villages = villages
        })
    })


    state.currentPage === CurrentPageEnum.BUILDING && params.get('gid') === '16' && params.get('tt') === '2' &&
    $('#addCurrentToCustomFarm').on('click', () => {
        const villages = state.villages
        let customFarm = {
            position: {
                "x": -999,
                "y": -999
            },
            type: FarmType.RAID,
            farmIntervalMinutes: {
                "min": 999,
                "max": 999
            },
            troops: {}
        } as CustomFarm

        $("#troops > tbody").find("td").each((column, td) => {
                const troopInput = $(td).find("input")
                const troopKey = troopInput.attr('name')
                const troopCount = troopInput.val() as string

                if (troopKey && troopInput) {
                    customFarm.troops[troopKey] = troopCount
                }
            }
        )

        const typeString = $('input[type=radio]:checked').parent().text()
        customFarm.type = typeString.includes('Normal') ? FarmType.ATTACK : FarmType.RAID

        customFarm.position.x = parseInt($("#xCoordInput").val() as string)
        customFarm.position.y = parseInt($("#yCoordInput").val() as string)

        customFarm.farmIntervalMinutes.min = parseInt($("#minCustomFarmMinutes").val() as string)
        customFarm.farmIntervalMinutes.max = parseInt($("#maxCustomFarmMinutes").val() as string)

        customFarm.nextCustomFarmTime = new Date()

        currentVillage.customFarms = (currentVillage.customFarms || []).concat(customFarm)
        state.villages = villages
    })

    $('.removeCustomFarm').on('click', (ele) => {
        const idx = ele.target.attributes.getNamedItem('idx')?.value
        const villageId = ele.target.attributes.getNamedItem('village-id')?.value
        if (!idx || !villageId) return

        const villages = state.villages
        villages[villageId].customFarms?.splice(Utils.parseIntIgnoreNonNumeric(idx), 1)
        state.villages = villages
    })

    state.currentPage === CurrentPageEnum.BUILDING && $('.addCurrentToPending').on('click', () => {
        const villages = state.villages
        const pendingBuildTasks = currentVillage.pendingBuildTasks

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

        const lumber = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[0].innerText)
        const clay = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[1].innerText)
        const iron = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[2].innerText)
        const crop = Utils.parseIntIgnoreNonNumeric(resourceRequirementEle[3].innerText)

        pendingBuildTasks.push({
            aid: Utils.parseIntIgnoreNonNumeric(aid),
            gid: Utils.parseIntIgnoreNonNumeric(gid),
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
        const villageId = ele.target.attributes.getNamedItem('village-id')?.value
        if (!idx || !villageId)
            return

        const villages = state.villages
        villages[villageId].pendingBuildTasks.splice(Utils.parseIntIgnoreNonNumeric(idx), 1)
        state.villages = villages
    })

    state.currentPage === CurrentPageEnum.FIELDS && $('#addAllFields').on('click', (ele) => {
        const villages = state.villages
        const pendingBuildTasks = currentVillage.pendingBuildTasks

        for (let aid = 1; aid <= 18; aid++) {
            pendingBuildTasks.push({
                aid,
                gid: -1,
                resources: {
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                }
            })
        }

        state.villages = villages
    })

    $('#updateFarmInterval').on('click', () => {
        const farmIntervalMinutes = {
            min: parseInt($("#minFarmMinutes").val() as string),
            max: parseInt($("#maxFarmMinutes").val() as string)
        };
        state.farmIntervalMinutes = farmIntervalMinutes;
    });

    handleFeatureToggle('#toggleAutoLogin', state, 'autoLogin')
    handleFeatureToggle('#toggleAutoScan', state, 'autoScan')
    handleFeatureToggle('#toggleAutoBuild', state, 'autoBuild')
    handleFeatureToggle('#toggleAutoScout', state, 'autoScout')
    handleFeatureToggle('#toggleAutoFarm', state, 'autoFarm')
    handleFeatureToggle('#toggleDisableStopOnLoss', state, 'disableStopOnLoss');
    handleFeatureToggle('#toggleAutoCustomFarm', state, 'autoCustomFarm')
    handleFeatureToggle('#toggleAlertAttack', state, 'alertAttack')
    handleFeatureToggle('#toggleAlertEmptyBuildQueue', state, 'alertEmptyBuildQueue')
    handleFeatureToggle('#toggleAlertResourceCapacityFull', state, 'alertResourceCapacityFull')
    handleFeatureToggle('#toggleDebug', state, 'debug')
}

const run = async (state: State) => {
    while (true) {
        updateCurrentPage(state)

        if ([CurrentPageEnum.LOGIN].includes(state.currentPage) && state.feature.autoLogin) {
            state.feature.debug && console.log("Attempt login")
            await login(state)
        }

        if ([CurrentPageEnum.FIELDS, CurrentPageEnum.TOWN, CurrentPageEnum.BUILDING, CurrentPageEnum.REPORT, CurrentPageEnum.OFF_REPORT, CurrentPageEnum.SCOUT_REPORT].includes(state.currentPage)) {
            updateVillageList(state)
            updateCurrentVillageStatus(state)

            await checkAutoEvade(state)

            if (state.feature.alertAttack) {
                state.feature.debug && console.log("Checking for attacks")
                checkIncomingAttack(state)
            }

            if (state.feature.alertEmptyBuildQueue) {
                state.feature.debug && console.log("Checking empty build queue")
                alertEmptyBuildQueue(state)
            }

            if (state.feature.alertResourceCapacityFull) {
                state.feature.debug && console.log("Checking resource capacity full")
                alertResourceCapacityFull(state)
            }

            if ([CurrentActionEnum.IDLE, CurrentActionEnum.BUILD].includes(state.currentAction) && state.feature.autoBuild) {
                state.feature.debug && console.log("Attempting build")
                await build(state)
            }

            if (CurrentActionEnum.NAVIGATE_TO_FIELDS === state.currentAction) {
                if (state.currentPage === CurrentPageEnum.FIELDS)
                    state.currentAction = CurrentActionEnum.IDLE
                else
                    await Navigation.goToFields(state, CurrentActionEnum.IDLE)
            }

            if ([CurrentActionEnum.IDLE, CurrentActionEnum.SCOUT].includes(state.currentAction)) {
                if (state.feature.autoScout) {
                    state.feature.debug && console.log("Attempting scout")
                    await scout(state)
                } else {
                    state.currentAction = CurrentActionEnum.IDLE
                }
            }

            if ([CurrentActionEnum.IDLE, CurrentActionEnum.FARM].includes(state.currentAction)) {
                if (state.feature.autoFarm) {
                    state.feature.debug && console.log("Attempting farm")
                    await farm(state)
                } else {
                    state.currentAction = CurrentActionEnum.IDLE
                }
            }

            if ([CurrentActionEnum.IDLE, CurrentActionEnum.CUSTOM_FARM].includes(state.currentAction)) {
                if (state.feature.autoCustomFarm) {
                    state.feature.debug && console.log("Attempting custom farm")
                    await customFarm(state)
                } else {
                    state.currentAction = CurrentActionEnum.IDLE
                }
            }

            if (state.currentAction === CurrentActionEnum.IDLE && state.feature.autoScan) {
                state.feature.debug && console.log("Try next village")
                await nextVillage(state)
            }
        }

        state.feature.debug && console.log(`Awaiting ${RUN_INTERVAL}ms`)
        await Utils.sleep(RUN_INTERVAL)
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
}

initialize()