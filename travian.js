console.log("HI")
const style = document.createElement('style');
style.textContent = `
  #console {
    background: white; 
    margin: 0 20px; 
    border-radius: 10px; 
    padding: 5px; 
    position: absolute;
    bottom: 10px;
    width: 90vw;
    z-index: 10000;
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

const PENDING_BUILD_LIST_KEY = 'pendingBuildList'
const ENABLE_AUTO_BUILD_KEY = 'enableAutoBuild'
const BUILDING_PAGE = 'Building'
const TOWN_PAGE = 'Town'
const RESOURCE_FIELD_PAGE = 'Resource fields'
const GID_MAP = {
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

$('#footer').before(`
  <div id="console"/>
`)

function getState(key, defaultValue) {
    const item = localStorage.getItem(key)
    if (item === null)
        return defaultValue
    else
        return JSON.parse(item)
}

function setState(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function parseIntIgnoreSep(s) {
  return parseInt(s.replace('.', '').replace(',', ''))
}

function addCurrentPageToPending() {
  let pendingBuildList = getState(PENDING_BUILD_LIST_KEY, [])

  let params = new URLSearchParams(window.location.search);
  let id = params.get('id')
  let gid = params.get('gid')

  if (!id || !gid) {
    return
  }

  let resourceRequirementEle = $('#contract .value')
  if (!resourceRequirementEle.length) {
    return
  }

  let woodReq = parseIntIgnoreSep(resourceRequirementEle[0].innerText)
  let brickReq = parseIntIgnoreSep(resourceRequirementEle[1].innerText)
  let metalReq = parseIntIgnoreSep(resourceRequirementEle[2].innerText)
  let grassReq = parseIntIgnoreSep(resourceRequirementEle[3].innerText)

  pendingBuildList.push({
    id,
    gid,
    woodReq,
    brickReq,
    metalReq,
    grassReq
  })

  setState(PENDING_BUILD_LIST_KEY, pendingBuildList)
  render()
}

function removeFromPending(i) {
  let pendingBuildList = getState(PENDING_BUILD_LIST_KEY, [])
  pendingBuildList.splice(i, 1)
  setState(PENDING_BUILD_LIST_KEY, pendingBuildList)
  render()
}

function toggleAutoBuild() {
  let enableAutoBuild = getState(ENABLE_AUTO_BUILD_KEY, false)
  setState(ENABLE_AUTO_BUILD_KEY, !enableAutoBuild)
  render()
}

function tryBuild(buildingList, wood, brick, metal, grass) {
  let pendingBuildList = getState(PENDING_BUILD_LIST_KEY, [])
  if (!pendingBuildList.length)
    return

  let type = getCurrentPageType()

  if ((type === RESOURCE_FIELD_PAGE || type === TOWN_PAGE) && buildingList.length < 2) {
    let id = pendingBuildList[0].id
    let gid = pendingBuildList[0].gid
    let woodReq = pendingBuildList[0].woodReq
    let brickReq = pendingBuildList[0].brickReq
    let metalReq = pendingBuildList[0].metalReq
    let grassReq = pendingBuildList[0].grassReq

    if (wood < woodReq || brick < brickReq || metal < metalReq || grass < grassReq)
        return
 
    if (parseInt(id) <= 18) {
      if (type === RESOURCE_FIELD_PAGE)
        $(`a[href="/build.php?id=${id}"]`)[0].click()
      else
        $('.village.resourceView')[0].click()
    } else {
      if (type === TOWN_PAGE)
        $(`a[href="/build.php?id=${id}&gid=${gid}"]`)[0].click()
      else
        $('.village.buildingView')[0].click()
    }
    
    return
  }
  
  // Wrong building
  let params = new URLSearchParams(window.location.search);
  if (pendingBuildList[0].id !== params.get('id') || pendingBuildList[0].gid !== params.get('gid')) {
    return
  }
  
  // Cannot find requirement
  let resourceRequirementEle = $('#contract .value')
  if (!resourceRequirementEle.length) {
    return
  }

  let woodReq = parseIntIgnoreSep(resourceRequirementEle[0].innerText)
  let brickReq = parseIntIgnoreSep(resourceRequirementEle[1].innerText)
  let metalReq = parseIntIgnoreSep(resourceRequirementEle[2].innerText)
  let grassReq = parseIntIgnoreSep(resourceRequirementEle[3].innerText)

  let bulidButton = $('.section1 > button.green')
  if (wood >= woodReq && brick >= brickReq && metal >= metalReq && grass >= grassReq && bulidButton.length) {
    removeFromPending(0)
    bulidButton.click()
  } else {
    return
  }
}

function getCurrentPageType() {
  let loc = window.location.href
  if (loc.includes('dorf1.php'))
    return RESOURCE_FIELD_PAGE
  if (loc.includes('dorf2.php'))
    return TOWN_PAGE
  if (loc.includes('build.php'))
    return BUILDING_PAGE
}

function render() {
  let pageType = getCurrentPageType()
  let pendingBuildList = getState(PENDING_BUILD_LIST_KEY, [])
  let enableAutoBuild = getState(ENABLE_AUTO_BUILD_KEY, false)

  let wood = parseIntIgnoreSep($('#l1')[0].innerText)
  let brick = parseIntIgnoreSep($('#l2')[0].innerText)
  let metal = parseIntIgnoreSep($('#l3')[0].innerText)
  let grass = parseIntIgnoreSep($('#l4')[0].innerText)
  let buildingListEle = $('.buildingList > ul > li')
  let buildingList = []

  for (let i = 0; i < buildingListEle.length; i++) {
    buildingList.push({
      name: $(buildingListEle[i]).find('.name').text(),
      time: $(buildingListEle[i]).find('.buildDuration > .timer').text()
    })
  }

  if (enableAutoBuild) {
    tryBuild(buildingList, wood, brick, metal, grass)
  }
  
  $('#console').html(`
    <h4>Console</h4>
    <div class="flex-row">
      <div class="flex">
        <h5>Summary</h5>
        <div>Current: ${pageType}</div>
        <div>${wood} ${brick} ${metal} ${grass}</div>
        ${buildingList.map(e => 
          `<div>${e.name} ${e.time}</div>`
        ).join('')}
      </div>
      <div class="flex">
        <div class="flex-row">
          <h5>Pending List</h5>
          ${pageType === BUILDING_PAGE ? '<button class="ml-5" onClick="addToPending()">Add Current</button>' : ''}
          <input class="ml-5" type="checkbox" ${enableAutoBuild ? 'checked' : ''} onChange="toggleAutoBuild()" /> Enable auto build
        </div>
        ${pendingBuildList.map((e, i) => 
          `<div><span>Position: ${e.id}</span> <span>${GID_MAP[e.gid]}</span> <button onClick="removeFromPending(${i})">x</button></div>`
        ).join('')}
      </div>
    </div>
  `)
}

render()
setInterval(render, 5000)

