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

const NEW_VILLAGE_LIST = [
    // {
    //     aid: 26,
    //     gid: 15,
    //     resources: {
    //         lumber: 70,
    //         clay: 40,
    //         iron: 60,
    //         crop: 20
    //     }
    // },
    {
        aid: 39,
        gid: 16,
        resources: {
            lumber: 110,
            clay: 160,
            iron: 90,
            crop: 70
        }
    },
    {
        aid: 26,
        gid: 15,
        resources: {
            lumber: 90,
            clay: 50,
            iron: 75,
            crop: 25
        }
    }, {
        aid: 26,
        gid: 15,
        resources: {
            lumber: 115,
            clay: 65,
            iron: 100,
            crop: 25
        }
    }, {
        aid: 26,
        gid: 15,
        resources: {
            lumber: 145,
            clay: 85,
            iron: 125,
            crop: 40
        }
    }, {
        aid: 26,
        gid: 15,
        resources: {
            lumber: 190,
            clay: 105,
            iron: 160,
            crop: 55
        }
    }, {
        aid: 33,
        gid: 10,
        resources: {
            lumber: 130,
            clay: 160,
            iron: 90,
            crop: 40
        }
    }, {
        aid: 33,
        gid: 10,
        resources: {
            lumber: 165,
            clay: 205,
            iron: 115,
            crop: 50
        }
    }, {
        aid: 33,
        gid: 10,
        resources: {
            lumber: 215,
            clay: 260,
            iron: 145,
            crop: 65
        }
    }, {
        aid: 25,
        gid: 11,
        resources: {
            lumber: 80,
            clay: 100,
            iron: 70,
            crop: 20
        }
    }, {
        aid: 25,
        gid: 11,
        resources: {
            lumber: 100,
            clay: 130,
            iron: 90,
            crop: 25
        }
    }, {
        aid: 33,
        gid: 10,
        resources: {
            lumber: 275,
            clay: 335,
            iron: 190,
            crop: 85
        }
    }, {
        aid: 33,
        gid: 10,
        resources: {
            lumber: 350,
            clay: 430,
            iron: 240,
            crop: 105
        }
    }, {
        aid: 33,
        gid: 10,
        resources: {
            lumber: 445,
            clay: 550,
            iron: 310,
            crop: 135
        }
    }, {
        aid: 25,
        gid: 11,
        resources: {
            lumber: 130,
            clay: 165,
            iron: 115,
            crop: 35
        }
    }, {
        aid: 25,
        gid: 11,
        resources: {
            lumber: 170,
            clay: 210,
            iron: 145,
            crop: 40
        }
    }, {
        aid: 26,
        gid: 15,
        resources: {
            lumber: 240,
            clay: 135,
            iron: 205,
            crop: 70
        }
    }, {
        aid: 26,
        gid: 15,
        resources: {
            lumber: 310,
            clay: 175,
            iron: 265,
            crop: 90
        }
    }, {
        aid: 26,
        gid: 15,
        resources: {
            lumber: 395,
            clay: 225,
            iron: 340,
            crop: 115
        }
    }, {
        aid: 26,
        gid: 15,
        resources: {
            lumber: 505,
            clay: 290,
            iron: 430,
            crop: 145
        }
    }, {
        aid: 26,
        gid: 15,
        resources: {
            lumber: 645,
            clay: 370,
            iron: 555,
            crop: 185
        }
    }, {
        aid: 33,
        gid: 10,
        resources: {
            lumber: 570,
            clay: 705,
            iron: 375,
            crop: 175
        }
    }, {
        aid: 33,
        gid: 10,
        resources: {
            lumber: 730,
            clay: 900,
            iron: 505,
            crop: 225
        }
    }, {
        aid: 33,
        gid: 10,
        resources: {
            lumber: 935,
            clay: 1155,
            iron: 650,
            crop: 290
        }
    }, {
        aid: 25,
        gid: 11,
        resources: {
            lumber: 215,
            clay: 270,
            iron: 190,
            crop: 55
        }
    }, {
        aid: 25,
        gid: 11,
        resources: {
            lumber: 275,
            clay: 345,
            iron: 240,
            crop: 70
        }
    }, {
        aid: 27,
        gid: 17,
        resources: {
            lumber: 80,
            clay: 70,
            iron: 120,
            crop: 70
        }
    }, {
        aid: 27,
        gid: 17,
        resources: {
            lumber: 100,
            clay: 90,
            iron: 155,
            crop: 90
        }
    }, {
        aid: 27,
        gid: 17,
        resources: {
            lumber: 130,
            clay: 115,
            iron: 195,
            crop: 115
        }
    }, {
        aid: 27,
        gid: 17,
        resources: {
            lumber: 170,
            clay: 145,
            iron: 250,
            crop: 145
        }
    }, {
        aid: 27,
        gid: 17,
        resources: {
            lumber: 215,
            clay: 190,
            iron: 320,
            crop: 190
        }
    }, {
        aid: 27,
        gid: 17,
        resources: {
            lumber: 275,
            clay: 240,
            iron: 410,
            crop: 240
        }
    }, {
        aid: 27,
        gid: 17,
        resources: {
            lumber: 350,
            clay: 310,
            iron: 530,
            crop: 310
        }
    },
]

enum CurrentPageEnum {
    LOGIN = "LOGIN",
    FIELDS = "FIELDS",
    TOWN = "TOWN",
    BUILDING = "BUILDING",
    REPORT = "REPORT",
    OFF_REPORT = "OFF_REPORT",
    SCOUT_REPORT = "SCOUT_REPORT",
    POSITION_DETAILS = "POSITION_DETAILS",
    UNKNOWN = "UNKNOWN"
}

enum CurrentActionEnum {
    IDLE = "IDLE",
    BUILD = "BUILD",
    NAVIGATE_TO_FIELDS = "NAVIGATE_TO_FIELDS",
    SCOUT = "SCOUT",
    FARM = "FARM",
    OASIS_FARM = "OASIS_FARM",
    EVADE = "EVADE",
    CUSTOM_FARM = "CUSTOM_FARM"
}

type BuildingResources = {
    name: string,
    resources: Resource
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
    autoFarmOasis: boolean
    disableReportChecking: boolean
    disableStopOnLoss: boolean
    autoCustomFarm: boolean
    randomAction: boolean
    disableDelayClick: boolean
    removeLostFromFarmList: boolean
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
    nextFarmOasisTime: Date
    nextCheckReportTime: Date
    farmIntervalMinutes: { min: number, max: number }
    farmOasisIntervalMinutes: { min: number, max: number }
    plusEnabled: boolean
    telegramChatId: string
    telegramToken: string
    discordWebhookUrl: string
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
            autoFarmOasis: false,
            disableReportChecking: false,
            disableStopOnLoss: false,
            autoCustomFarm: false,
            randomAction: false,
            disableDelayClick: false,
            removeLostFromFarmList: false,
            debug: false
        },
        nextVillageRotationTime: new Date(),
        nextScoutTime: new Date(),
        nextFarmTime: new Date(),
        nextFarmOasisTime: new Date(),
        nextCheckReportTime: new Date(),
        farmIntervalMinutes: {min: 8, max: 12},
        farmOasisIntervalMinutes: {min: 2, max: 4},
        plusEnabled: false,
        telegramChatId: '',
        telegramToken: '',
        discordWebhookUrl: '',
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

    static delayClick = async (enabled?: boolean) => {
        if (enabled) await Utils.sleep(Utils.randInt(1000, 1000))
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

    static sumRecord = (r1: Record<string, string>, r2: Record<string, string>): Record<string, string> => {
        let result = {} as Record<string, string>
        Object.keys(r1).forEach(key => {
            if (!Object.keys(result).includes(key)) {
                result = {
                    ...result,
                    [key]: "0"
                }
            }
        })
        Object.keys(21).forEach(key => {
            if (!Object.keys(result).includes(key)) {
                result = {
                    ...result,
                    [key]: "0"
                }
            }
        })

        Object.entries(r1).map(([key, value]) => {
            if (!!value || !!r2[key]) {
                const r2Value = r2[key]
                result = {
                    ...result,
                    [key]: (parseInt(value) + parseInt(r2Value)).toString()
                }
            }
        })

        return result
    }

    static groupByAndSum = (records: Record<string, string>[]): Record<string, string> => {
        return records.reduce((res, value) => Utils.sumRecord(res, value), {});
    }

    static waitForElement = (selector: string, timeout: number = 5000): Promise<JQuery<HTMLElement>> => {
        return new Promise(resolve => {
            if ($(selector) && $(selector).length > 0) {
                return resolve($(selector));
            }

            const timeoutCallback = setTimeout(
                () => {
                    observer.disconnect()
                    Promise.reject()
                },
                timeout
            )

            const onDomChange = (mutations: MutationRecord[], observer: MutationObserver) => {
                if ($(selector) && $(selector).length > 0) {
                    console.log("Found")
                    resolve($(selector))
                    clearTimeout(timeoutCallback)
                    observer.disconnect();
                } else {
                    console.log("Checking")
                }
            }

            const observer = new MutationObserver(onDomChange);

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

        });
    }
}

class Navigation {
    static goToVillage = async (state: State, id: string, action: CurrentActionEnum): Promise<boolean> => {
        await Utils.delayClick(!state.feature.disableDelayClick)
        state.currentAction = action
        state.feature.debug && console.log(`Go to village - [${id}]${state.villages[id].name}`)
        $(`.listEntry[data-did="${id}"] > a`)[0].click()
        return true
    }

    static goToBuilding = async (state: State, aid: number, gid: number, action: CurrentActionEnum): Promise<boolean> => {
        if (aid <= 18 && state.currentPage === CurrentPageEnum.FIELDS) {
            await Utils.delayClick(!state.feature.disableDelayClick)
            state.currentAction = action
            state.feature.debug && console.log(`Go to building - [aid=${aid},gid=${gid}]${GID_NAME_MAP[gid]}`)
            $(`a[href="/build.php?id=${aid}"]`)[0].click()
            return true
        } else if (aid > 18 && state.currentPage === CurrentPageEnum.TOWN) {
            await Utils.delayClick(!state.feature.disableDelayClick)
            state.currentAction = action
            state.feature.debug && console.log(`Go to building - [aid=${aid},gid=${gid}]${GID_NAME_MAP[gid]}`)
            if (aid === 40) { // Special case for wall
                $('#villageContent > div.buildingSlot.a40.top > svg > g.hoverShape > path').trigger('click')
            } else {
                window.location.href = `/build.php?id=${aid}`
            }
            return true
        } else {
            state.feature.debug && console.log(`Cannot go to building - [aid=${aid},gid=${gid}]${GID_NAME_MAP[gid]}`)
            return false
        }
    }

    static goToFields = async (state: State, action: CurrentActionEnum): Promise<boolean> => {
        await Utils.delayClick(!state.feature.disableDelayClick)
        state.currentAction = action
        state.feature.debug && console.log('Go to fields')
        $('.village.resourceView')[0].click()
        return true
    }

    static goToTown = async (state: State, action: CurrentActionEnum): Promise<boolean> => {
        await Utils.delayClick(!state.feature.disableDelayClick)
        state.currentAction = action
        state.feature.debug && console.log('Go to town')
        $('.village.buildingView')[0].click()
        return true
    }

    static goToReport = async (state: State, action: CurrentActionEnum): Promise<boolean> => {
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
    checksum: string
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
    isRoman?: boolean
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
            left: 30px;
            position: absolute;
            top: -10px;
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
    await Utils.delayClick(!state.feature.disableDelayClick)
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
            checksum: '',
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
            },
            autoEvade: false,
            customFarms: []
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
                    if (villages[currentVillageId].autoEvade && villages[currentVillageId].evadeRaidPosition) {
                        villages[currentVillageId].evadeTime = Utils.addToDate(time, 0, -1, 0)
                    }
                case 'att3':
                    incomingTroops.push({
                        type: TroopMovementType.ATTACK,
                        count,
                        time
                    })
                    break
            }
        })

        villages[currentVillageId].incomingTroops = incomingTroops
        villages[currentVillageId].outgoingTroops = outgoingTroops
        villages[currentVillageId].lastUpdatedTime = new Date()
    } else if (state.currentPage === CurrentPageEnum.TOWN) {
        const mainBuilding = $('.buildingSlot.g15')[0]
        if (mainBuilding)
            villages[currentVillageId].isRoman = mainBuilding.className.includes('roman')
    }

    state.villages = villages
}

const alertAttack = (state: State, village?: Village, attackTime?: Date) => {
    const villages = state.villages

    if (state.discordWebhookUrl) {
        if (village) {
            if (!village.attackAlertBackoff || new Date(village.attackAlertBackoff) < new Date()) {
                state.feature.debug && console.log(`Send alert for attack at village ${village.name}`)
                village.attackAlertBackoff = Utils.addToDate(new Date(), 0, 5, 0)
                state.villages = villages

                const message = `[${$('.playerName').text()}] Village ${village.name} under attack${attackTime ? ` at ${Utils.formatDate(attackTime)}`: ""}`
                fetch(state.discordWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: message})
                })
            } else {
                state.feature.debug && console.log(`Not alerting attack due to backoff at ${Utils.formatDate(village.attackAlertBackoff)}`)
            }
        } else {
            const message = `[${$('.playerName').text()}] Village is under attack`
            fetch(state.discordWebhookUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: message})
            })
        }
    } else if (state.telegramChatId && state.telegramToken) {
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
        }
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

const informFarmListInactivated = (state: State, target: string) => {
    if (!state.telegramChatId || !state.telegramToken) {
        state.feature.debug && console.log("Telegram chat id or token not set")
        return
    }

    fetch(`https://api.telegram.org/bot${state.telegramToken}/sendMessage?chat_id=${state.telegramChatId}&text=Target: ${target} lost as attacker in the latest report, inactivated from farm list`)
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
    const villageIdBeingAttacked = $('div.listEntry.attack').find('.attack').parent().parent().parent().attr('href')?.split('newdid=')[1].split('&')[0]

    if (plusNoAttack.length !== Object.keys(villages).length && villageIdBeingAttacked) {
        const villageBeingAttacked = villages[villageIdBeingAttacked]
        if (!villageBeingAttacked.attackAlertBackoff || new Date(villageBeingAttacked.attackAlertBackoff) < new Date()) {
            alertAttack(state, !!villageIdBeingAttacked ? villages[villageIdBeingAttacked] : undefined)
            villageIdBeingAttacked && villageIdBeingAttacked !== state.currentVillageId && Navigation.goToVillage(state, villageIdBeingAttacked, CurrentActionEnum.IDLE)
        }
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

const getNextBuildTask = (village: Village, plusEnabled: boolean) => {
    const effectiveCurrentTasks = village.currentBuildTasks.filter(task => new Date(task.finishTime) > new Date())
    let targetTask
    if (village.isRoman) {
        if (effectiveCurrentTasks.length < 3) {
            let fieldCount = 0
            let buildingCount = 0
            effectiveCurrentTasks.forEach(task => {
                if (["Woodcutter", "Clay Pit", "Iron Mine", "Cropland"].includes(task.name))
                    fieldCount += 1
                else
                    buildingCount += 1
            })

            targetTask = village.pendingBuildTasks.find(
                task => (task.gid <= 4 && fieldCount <= (plusEnabled ? 1 : 0)) || (task.gid > 4 && buildingCount <= (plusEnabled ? 1 : 0))
            )
        }
    } else {
        if (effectiveCurrentTasks.length < (plusEnabled ? 2 : 1))
            targetTask = village.pendingBuildTasks[0]
    }

    if (targetTask && Utils.isSufficientResources(targetTask.resources, village.resources))
        return targetTask
}

const build = async (state: State) => {
    // Try building in current village
    const villages = state.villages
    const village = villages[state.currentVillageId]
    const task = getNextBuildTask(village, state.plusEnabled)
    if (task) {
        const taskIdx = village.pendingBuildTasks.findIndex(t => t.aid === task.aid && t.gid === task.gid)
        if ([CurrentPageEnum.FIELDS, CurrentPageEnum.TOWN].includes(state.currentPage)) {
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

            village.pendingBuildTasks[taskIdx].resources = {lumber, clay, iron, crop}
            state.villages = villages

            const bulidButton = $('.section1 > button.green')
            if (bulidButton.length) {
                const villageChecksum = bulidButton.attr('onclick')?.split('checksum=')[1].split("'")[0]
                village.checksum = villageChecksum || ''

                await Utils.delayClick(!state.feature.disableDelayClick)
                state.currentAction = CurrentActionEnum.IDLE
                village.pendingBuildTasks.splice(taskIdx, 1)
                state.villages = villages
                bulidButton.trigger('click')
                return
            }
        } else if (state.currentPage === CurrentPageEnum.BUILDING
            && !gid) {
            const checksum = village.checksum
            if (checksum) {
                window.location.href = `/dorf2.php?id=${task.aid}&gid=${task.gid}&action=build&checksum=${checksum}`
            }
        }
    }

    // Check if need to build in another village
    const nextVillageIdToBuild = Object.entries(state.villages)
        .filter(([_, village]) => getNextBuildTask(village, state.plusEnabled))
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
                await Utils.delayClick(!state.feature.disableDelayClick)
                startButtonEle[i].click()
            }
            state.nextScoutTime = Utils.addToDate(new Date(), 0, Utils.randInt(30, 40), 0)
            await Navigation.goToFields(state, CurrentActionEnum.IDLE);
            return
        } else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') !== '99') {
            await Utils.delayClick(!state.feature.disableDelayClick)
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

const farm = async (state: State, targetPrefix?: "Oasis") => {
    if ((new Date(state.nextFarmTime) < new Date() && !targetPrefix) || (new Date(state.nextFarmOasisTime) < new Date() && targetPrefix)) {
        const params = new URLSearchParams(window.location.search);
        state.currentAction = !targetPrefix ? CurrentActionEnum.FARM : CurrentActionEnum.OASIS_FARM

        if ([CurrentActionEnum.FARM, CurrentActionEnum.OASIS_FARM].includes(state.currentAction)) {
            let shortcut = undefined as HTMLElement | undefined
            $('#sidebarBoxLinklist li').each((_, ele) => {
                const name = $(ele).find('.name').text().trim()
                const href = $(ele).find('a').attr('href')
                if (name === "Farm List") {
                    shortcut = $(`a[href='${href}']`)[0]

                    return
                }
            })

            if (!(state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') === '99')) {
                if (shortcut) {
                    state.currentAction = !targetPrefix ? CurrentActionEnum.FARM : CurrentActionEnum.OASIS_FARM
                    shortcut.click()
                } else {
                    if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') !== '99') {
                        await Utils.delayClick(!state.feature.disableDelayClick)
                        $('a[href="/build.php?id=39&gid=16&tt=99"]')[0].click()
                        return
                    } else if (state.currentPage === CurrentPageEnum.TOWN) {
                        await Navigation.goToBuilding(state, 39, 16, !targetPrefix ? CurrentActionEnum.FARM : CurrentActionEnum.OASIS_FARM)
                        return
                    } else {
                        await Navigation.goToTown(state, !targetPrefix ? CurrentActionEnum.FARM : CurrentActionEnum.OASIS_FARM)
                        return
                    }
                }
            }

            if ((state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') === '99')) {
                await Utils.delayClick(!state.feature.disableDelayClick)
                const allStartButtons = await Utils.waitForElement('.startButton[value=Start]')

                if (state.feature.removeLostFromFarmList) {
                    await Utils.delayClick(!state.feature.disableDelayClick)
                    const lastRaidLost = $('td.lastRaid > div > img.iReport.iReport3').filter((_, ele) => $(ele).parent().parent().css('opacity') !== '0.4')

                    if (lastRaidLost.length > 0) {
                        lastRaidLost.each((_, ele) => {
                            const row = $(ele).parent().parent().parent()
                            const target = row.find('a').first().text().trim()
                            informFarmListInactivated(state, target)

                            row.find('input')[0].click()
                        })

                        await Utils.delayClick(!state.feature.disableDelayClick)
                        const deactivateButtons = await Utils.waitForElement('button:contains("Deactivate selected")')
                        deactivateButtons.each((_, ele) => $(ele)[0].click())
                    }
                }

                const allStartButtonsEle = allStartButtons.filter((_, button) => {
                    const text = $(button).parent().parent().find('.listName').find('span').text();
                    return text !== "Scout" && ((!targetPrefix && !text.startsWith("Oasis")) || (!!targetPrefix && text.startsWith(targetPrefix)))
                })

                for (let i = 0; i < allStartButtonsEle.length; i++) {
                    await Utils.delayClick(!state.feature.disableDelayClick)
                    allStartButtonsEle[i].click()
                }
                if (!targetPrefix) {
                    state.nextFarmTime = Utils.addToDate(new Date(), 0, Utils.randInt(state.farmIntervalMinutes.min, state.farmIntervalMinutes.max), Utils.randInt(0, 59))
                } else if (targetPrefix === "Oasis") {
                    state.nextFarmOasisTime = Utils.addToDate(new Date(), 0, Utils.randInt(state.farmOasisIntervalMinutes.min, state.farmOasisIntervalMinutes.max), Utils.randInt(0, 30))
                }
                await Navigation.goToFields(state, CurrentActionEnum.IDLE);
                return
            }

        }
    }
}

const checkAutoEvade = async (state: State) => {
    const params = new URLSearchParams(window.location.search);
    const villages = state.villages
    const villageRequireEvade = Object.values(villages).filter(v => !!v.evadeTime).find(v => v.autoEvade && new Date(v.evadeTime!) < new Date())

    if (villageRequireEvade) {
        if (state.currentPage === CurrentPageEnum.BUILDING && params.get('id') === '39' && params.get('gid') === '16' && params.get('tt') !== '2') {
            await Utils.delayClick(!state.feature.disableDelayClick)
            $('a[href="/build.php?id=39&gid=16&tt=2"]')[0].click()
            return
        } else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('gid') === '16' && params.get('tt') === '2') {
            if (state.currentVillageId !== villageRequireEvade.id) {
                await Navigation.goToVillage(state, villageRequireEvade.id, CurrentActionEnum.EVADE)
                return
            }
            if ((await Utils.waitForElement('.error', 2000)).length > 0) {
                await Navigation.goToFields(state, CurrentActionEnum.IDLE)
                return
            }

            await Utils.delayClick(!state.feature.disableDelayClick);

            const sendTroopButton = $("#ok")
            const confirmButton = $("#checksum")

            if (sendTroopButton.length > 0) {
                let needSendTroop = false
                $("#troops > tbody").find("td").each((column, td) => {
                    const troopInput = $(td).find("input")
                    if (troopInput.length > 0 || !troopInput.prop('disabled')) {
                        troopInput.val('99999')
                        needSendTroop = true
                    }
                })

                if (villageRequireEvade.evadeRaidPosition?.x && villageRequireEvade.evadeRaidPosition?.y) {
                    $("#xCoordInput").val(villageRequireEvade.evadeRaidPosition.x)
                    $("#yCoordInput").val(villageRequireEvade.evadeRaidPosition.y)
                }

                if (needSendTroop) {
                    $('.radio')[2].click()
                    sendTroopButton[0].click();
                } else {
                    delete villageRequireEvade.evadeTime
                }

            } else if (confirmButton.length > 0) {
                await Utils.delayClick(!state.feature.disableDelayClick)
                confirmButton[0].click()
            }

            return;
        } else if (state.currentPage === CurrentPageEnum.BUILDING && state.currentAction === CurrentActionEnum.EVADE
            && params.get('gid') === '16' && params.get('tt') === '1') {
            informTroopsEvaded(state, villageRequireEvade)
            delete villageRequireEvade.evadeTime

            state.villages = villages

            await Utils.delayClick(!state.feature.disableDelayClick)
            await Navigation.goToFields(state, CurrentActionEnum.IDLE);
            return;
        } else if (state.currentPage === CurrentPageEnum.TOWN) {
            console.log("Go to building")
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
            await Utils.delayClick(!state.feature.disableDelayClick)
            $('a[href="/build.php?id=39&gid=16&tt=2"]')[0].click()
            return
        } else if (state.currentPage === CurrentPageEnum.BUILDING && params.get('gid') === '16' && params.get('tt') === '2') {
            await Utils.delayClick(!state.feature.disableDelayClick);

            const sendTroopButton = $("#ok")
            const confirmButton = $("#checksum")
            if (sendTroopButton.length > 0) {
                for (const troopKey of Object.keys(customFarm.troops)) {
                    if (customFarm.troops[troopKey]) {
                        state.feature.debug && (console.log("Troop Key: ", troopKey))
                        const troopInputEle = $(`input[name="${troopKey}"]`);

                        if (troopInputEle.prop('disabled') || parseInt($('input[name="troop[t1]"]').parent().find('a').text().replace(/\D/g, "")) < parseInt(customFarm.troops[troopKey])) {
                            village.customFarms![idx].nextCustomFarmTime = Utils.addToDate(
                                new Date(),
                                0,
                                1,
                                0
                            );

                            state.villages = villages

                            await Navigation.goToTown(state, CurrentActionEnum.IDLE);
                            return
                        }

                        troopInputEle[0].click();
                        troopInputEle.val(customFarm.troops[troopKey]);
                    }
                }

                $("#xCoordInput").val(customFarm.position.x)
                $("#yCoordInput").val(customFarm.position.y)

                if (customFarm.type === FarmType.ATTACK) {
                    $('.radio')[1].click()
                } else {
                    $('.radio')[2].click()
                }

                await Utils.delayClick(!state.feature.disableDelayClick);
                sendTroopButton[0].click();

            } else if (confirmButton.length > 0) {
                await Utils.delayClick(!state.feature.disableDelayClick)
                confirmButton[0].click()
            }

            return;
        } else if (state.currentPage === CurrentPageEnum.BUILDING && state.currentAction === CurrentActionEnum.CUSTOM_FARM
            && params.get('gid') === '16' && params.get('tt') === '1') {
            village.customFarms![idx].nextCustomFarmTime = Utils.addToDate(
                new Date(),
                0,
                Utils.randInt(customFarm.farmIntervalMinutes.min, customFarm.farmIntervalMinutes.max),
                Utils.randInt(0, 10)
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

const randomAction = async (state: State) => {
    state.feature.debug && console.log("Do random action")

    const actions: string[] = []
    $('#sidebarBoxLinklist li').each((_, ele) => {
        const name = $(ele).find('.name').text()
        const href = $(ele).find('a').attr('href')
        if (!name.startsWith('#') && href) {
            actions.push(href)
        }
    })

    const target = actions[Math.floor(Math.random() * actions.length)];
    await Utils.delayClick(!state.feature.disableDelayClick)
    state.currentAction = CurrentActionEnum.NAVIGATE_TO_FIELDS
    state.feature.debug && console.log(`Go to ${target}`)
    $(`a[href='${target}']`)[0].click()

}

// const autoAdventure = () => {
//     const adventureButton = $('a[href="/hero/adventures"]')
//     const adventureCount = adventureButton.parent().find('div[class="content"]')
//
//
// }

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
        const cranny = Utils.parseIntIgnoreNonNumeric($('.rArea').text());
        // const troops70 = `<div id="troops-required-70">Troops Required: ${Math.ceil((sum - cranny * 4) / 70)} | ${Math.ceil((sum - (cranny * 0.85) * 4) / 70)} with hero (70 per troop)</div>`;
        // if ($('#troops-required-70').length === 0)
        //     $(".additionalInformation").after(troops70);
        // else
        //     $('#troops-required-70').replaceWith(troops70);
        // const troops50 = `<div id="troops-required-50">Troops Required: ${Math.ceil((sum - cranny * 4) / 50)} | ${Math.ceil((sum - (cranny * 0.85) * 4) / 50)} with hero (50 per troop)</div>`;
        // if ($('#troops-required-50').length === 0)
        //     $(".additionalInformation").after(troops50);
        // else
        //     $('#troops-required-50').replaceWith(troops50);

        const troops60 = `<div id="troops-required-60">Troops Required: ${Math.ceil((resourcesFromReport.lumber - cranny) / 60) +
        Math.ceil((resourcesFromReport.clay - cranny) / 60) +
        Math.ceil((resourcesFromReport.iron - cranny) / 60) +
        Math.ceil((resourcesFromReport.crop - cranny) / 60)} | ${Math.ceil((resourcesFromReport.lumber - cranny * 0.8) / 60) +
        Math.ceil((resourcesFromReport.clay - cranny * 0.8) / 60) +
        Math.ceil((resourcesFromReport.iron - cranny * 0.8) / 60) +
        Math.ceil((resourcesFromReport.crop - cranny * 0.8) / 60)
        } with hero (60 per troop)</div>`;
        if ($('#troops-required-60').length === 0)
            $(".additionalInformation").after(troops60);
        else
            $('#troops-required-60').replaceWith(troops60);


        let total = 0;
        // @ts-ignore
        $('.reportInfo.carry').each((_, carry) => total += parseInt($(carry).attr("alt").split('/')[0] || '0'));
        const totalResources = `<div id="total-res">Total Resouces: ${total}</div>`
        if ($('#total-res').length === 0)
            $(".footer").after(totalResources);
        else
            $('#total-res').replaceWith(totalResources);
    }

    if (state.currentPage === CurrentPageEnum.BUILDING && params.get('gid') === '16' && params.get('tt') === '2') {
        const x = parseInt($("#xCoordInput").val() as string)
        const y = parseInt($("#yCoordInput").val() as string)

        if ((currentVillage.customFarms || []).find(customFarm => customFarm.position.x === x && customFarm.position.y === y)) {
            const customFarmWarning = `<div id="custom-farm-warning"><br/><br/>This position is included in custom farm already</div>`
            if ($('#custom-farm-warning').length === 0)
                $("#ok").after(customFarmWarning)
            else
                $('#custom-farm-warning').replaceWith(customFarmWarning);
        }
    }


    $('#console').html(`
        <div class="flex-row">
            <h4>Console</h4>
            <input id="toggleAutoLogin" class="ml-5" type="checkbox" ${state.feature.autoLogin ? 'checked' : ''}/> Auto login
            <input id="toggleAutoScan" class="ml-5" type="checkbox" ${state.feature.autoScan ? 'checked' : ''}/> Auto village rotation
            <input id="toggleAutoBuild" class="ml-5" type="checkbox" ${state.feature.autoBuild ? 'checked' : ''}/> Auto build
            <input id="toggleAutoScout" class="ml-5" type="checkbox" ${state.feature.autoScout ? 'checked' : ''}/> Auto scout
            <input id="toggleAutoFarm" class="ml-5" type="checkbox" ${state.feature.autoFarm ? 'checked' : ''}/> Auto farm
            <input id="toggleAutoFarmOasis" class="ml-5" type="checkbox" ${state.feature.autoFarmOasis ? 'checked' : ''}/> Auto farm oasis
            <input id="toggleAutoCustomFarm" class="ml-5" type="checkbox" ${state.feature.autoCustomFarm ? 'checked' : ''}/> Auto custom farm
            <input id="toggleAlertAttack" class="ml-5" type="checkbox" ${state.feature.alertAttack ? 'checked' : ''}/> Alert attack
            <input id="toggleAlertEmptyBuildQueue" class="ml-5" type="checkbox" ${state.feature.alertEmptyBuildQueue ? 'checked' : ''}/> Alert empty build queue
            <input id="toggleAlertResourceCapacityFull" class="ml-5" type="checkbox" ${state.feature.alertResourceCapacityFull ? 'checked' : ''}/> Alert resource capacity full
            <input id="toggleRemoveLostFromFarmList" class="ml-5" type="checkbox" ${state.feature.removeLostFromFarmList ? 'checked' : ''}> Remove Lost From Farm List
            <input id="toggleRandomAction" class="ml-5" type="checkbox" ${state.feature.randomAction ? 'checked' : ''}/> Random Action
            <input id="toggleDebug" class="ml-5" type="checkbox" ${state.feature.debug ? 'checked' : ''}/> Debug
        </div>
        <div>
            <h4>Summary (Build: ${BUILD_TIME})</h4>
            <div>Current Page: ${state.currentPage} (Last render: ${Utils.formatDate(new Date())})</div>
            <div>Current Action: ${state.currentAction}</div>
            <div>Interval Range [Farm]: ${state.farmIntervalMinutes.min}mins - ${state.farmIntervalMinutes.max}mins</div>
            <div class="flex-row">
                <input id="minFarmMinutes" style="width: 5%">min</input>
                <input id="maxFarmMinutes" style="width: 5%">max</input>
                <button id="updateFarmInterval" class="ml-5">Update</button>
            </div>
            <div>Interval Range [Oasis]: ${state.farmOasisIntervalMinutes.min}mins - ${state.farmOasisIntervalMinutes.max}mins</div>
            <div class="flex-row">
                <input id="minFarmOasisMinutes" style="width: 5%">min</input>
                <input id="maxFarmOasisMinutes" style="width: 5%">max</input>
                <button id="updateFarmOasisInterval" class="ml-5">Update</button>
            </div>
            <div>Next rotation: ${Utils.formatDate(state.nextVillageRotationTime)}</div>
            <div>Next scout: ${Utils.formatDate(state.nextScoutTime)}</div>
            <div>Next farm: ${Utils.formatDate(state.nextFarmTime)}</div>
            <div>Next farm oasis: ${Utils.formatDate(state.nextFarmOasisTime)}</div>
        </div>
        <div>
            <h4>Action</h4>
            ${state.currentPage === CurrentPageEnum.FIELDS ? '<button id="addAllFields">Add all fields</button>' : ''}
            <button id="addListBuildings">Add List Buildings</button>
            <button id="copyState">Copy State</button>
            <button id="pasteState">Paste State</button>
        </div>
        <br />
        <div class="flex-row">
            ${Object.entries(villages).map(([id, village]) => `
                <div class="village-container">
                    <h4>${village.name} (id: ${id}) (${village.position.x}, ${village.position.y})</h4>
                    <br />
                    <div>Checksum: ${village.checksum}</div>
                    <div>Last update: ${Utils.formatDate(village.lastUpdatedTime)}</div>
                    <div>Attack alert backoff: ${Utils.formatDate(village.attackAlertBackoff)}</div>
                    <div>Empty build queue alert backoff: ${Utils.formatDate(village.emptyBuildQueueAlertBackoff)}</div>
                    ${village.customFarms && `<div>
                            Custom farm summary: ${Object.entries(Utils.groupByAndSum(village.customFarms.map(customFarm => customFarm.troops))).map((key, value) => `<div>${key}: ${value}</div>`)}
                    </div>`}
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

            village.evadeRaidPosition = {
                x: positionX,
                y: positionY
            } as Position

            state.villages = villages
        })
        $(`#toggleAutoEvade-${village.id}`).on('click', () => {
            let autoEvade = village.autoEvade
            autoEvade = !autoEvade
            village.autoEvade = autoEvade
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

                if (troopKey && troopInput && !!troopCount) {
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

    $('#addListBuildings').on('click', (ele) => {
        const villages = state.villages
        const pendingBuildTasks = currentVillage.pendingBuildTasks

        let buildingCount = 0

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 5; j++) {
                if (buildingCount < NEW_VILLAGE_LIST.length) {
                    pendingBuildTasks.push(NEW_VILLAGE_LIST[buildingCount++])
                }
            }

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

    $('#updateFarmOasisInterval').on('click', () => {
        const farmOasisIntervalMinutes = {
            min: parseInt($("#minFarmOasisMinutes").val() as string),
            max: parseInt($("#maxFarmOasisMinutes").val() as string)
        }
        state.farmOasisIntervalMinutes = farmOasisIntervalMinutes
    })

    $('#copyState').on('click', () => {
        navigator.clipboard.writeText(JSON.stringify(localStorage))
            .then(() =>
                alert("Copied!")
            )
    })

    $('#pasteState').on('click', () => {
        navigator.clipboard.readText()
            .then(JSON.parse)
            .then(Object.entries)
            .then(entries =>
                entries.forEach(([k, v]) =>
                    localStorage.setItem(k, v)
                )
            ).then(() => window.location.reload())
    })

    handleFeatureToggle('#toggleAutoLogin', state, 'autoLogin')
    handleFeatureToggle('#toggleAutoScan', state, 'autoScan')
    handleFeatureToggle('#toggleAutoBuild', state, 'autoBuild')
    handleFeatureToggle('#toggleAutoScout', state, 'autoScout')
    handleFeatureToggle('#toggleAutoFarm', state, 'autoFarm')
    handleFeatureToggle('#toggleAutoFarmOasis', state, 'autoFarmOasis')
    handleFeatureToggle('#toggleAutoCustomFarm', state, 'autoCustomFarm')
    handleFeatureToggle('#toggleAlertAttack', state, 'alertAttack')
    handleFeatureToggle('#toggleAlertEmptyBuildQueue', state, 'alertEmptyBuildQueue')
    handleFeatureToggle('#toggleAlertResourceCapacityFull', state, 'alertResourceCapacityFull')
    handleFeatureToggle('#toggleRandomAction', state, 'randomAction')
    handleFeatureToggle('#toggleDisableDelayClick', state, 'disableDelayClick')
    handleFeatureToggle('#toggleRemoveLostFromFarmList', state, 'removeLostFromFarmList')
    handleFeatureToggle('#toggleDebug', state, 'debug')
}

const run = async (state: State) => {
    while (true) {
        updateCurrentPage(state)
        state.plusEnabled = !!!$('.market.gold').length

        if ([CurrentPageEnum.LOGIN].includes(state.currentPage) && state.feature.autoLogin) {
            state.feature.debug && console.log("Attempt login")
            await login(state)
        }

        if (CurrentActionEnum.NAVIGATE_TO_FIELDS === state.currentAction) {
            if (state.currentPage === CurrentPageEnum.FIELDS)
                state.currentAction = CurrentActionEnum.IDLE
            else
                await Navigation.goToFields(state, CurrentActionEnum.IDLE)
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
                    await farm(state, undefined)
                } else {
                    state.currentAction = CurrentActionEnum.IDLE
                }
            }

            if ([CurrentActionEnum.IDLE, CurrentActionEnum.OASIS_FARM].includes(state.currentAction)) {
                if (state.feature.autoFarmOasis) {
                    state.feature.debug && console.log("Attempting farm oasis")
                    await farm(state, "Oasis")
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

            if (state.currentAction === CurrentActionEnum.IDLE && state.feature.randomAction) {
                if (Math.random() > 0.9)
                    await randomAction(state)
            }
        }

        state.feature.debug && console.log(`Awaiting ${RUN_INTERVAL}ms`)
        await Utils.sleep(RUN_INTERVAL)
    }
}

const initialize = () => {
    const handler = new StateHandler()
    const state: State = new Proxy(StateHandler.INITIAL_STATE, handler)

    if ($('#logo').length === 0) {
        location.reload();
    }

    handler.setCallback(() => render(state))

    createStyle()
    createContainer()
    render(state)
    run(state)
}

initialize()