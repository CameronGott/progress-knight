var gameData = {
    taskData: {},
    itemData: {},

    coins: 0,
    days: 365 * 14,
    evil: 0,
    paused: false,
    timeWarpingEnabled: true,

    rebirthOneCount: 0,
    rebirthTwoCount: 0,

    currentJob: null,
    currentSkill: null,
    currentProperty: null,
    currentMisc: null,
}

var tempData = {}

var skillWithLowestMaxXp = null

const autoPromoteElement = document.getElementById("autoPromote")
const autoLearnElement = document.getElementById("autoLearn")

const updateSpeed = 20

const baseLifespan = 365 * 70

const jobTabButton = document.getElementById("jobTabButton")

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}
  
function getBindedTaskEffect(taskName) {
    var task = gameData.taskData[taskName]
    return task.getEffect.bind(task)
}

function getBindedItemEffect(itemName) {
    var item = gameData.itemData[itemName]
    return item.getEffect.bind(item)
}

function addMultipliers() {
    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]

        task.xpMultipliers = []
        if (task instanceof Job) task.incomeMultipliers = []

        task.xpMultipliers.push(task.getMaxLevelMultiplier.bind(task))
        task.xpMultipliers.push(getHappiness)
        task.xpMultipliers.push(getBindedTaskEffect("Dark influence"))
        task.xpMultipliers.push(getBindedTaskEffect("Demon training"))

        if (task instanceof Job) {
            task.incomeMultipliers.push(task.getLevelMultiplier.bind(task))
            task.incomeMultipliers.push(getBindedTaskEffect("Demon's wealth"))
            task.xpMultipliers.push(getBindedTaskEffect("Productivity"))
            task.xpMultipliers.push(getBindedItemEffect("Personal squire"))    
        } else if (task instanceof Skill) {
            task.xpMultipliers.push(getBindedTaskEffect("Concentration"))
            task.xpMultipliers.push(getBindedItemEffect("Rag Clothing"))
            task.xpMultipliers.push(getBindedItemEffect("Book"))
            task.xpMultipliers.push(getBindedItemEffect("Study desk"))
            task.xpMultipliers.push(getBindedItemEffect("Library"))
        }

        if (jobCategories["Military"].includes(task.name)) {
            task.incomeMultipliers.push(getBindedTaskEffect("Strength"))
            task.xpMultipliers.push(getBindedTaskEffect("Battle tactics"))
            task.xpMultipliers.push(getBindedItemEffect("Steel longsword"))
        } else if (jobCategories["The Order of Discovery"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("Novel Knowledge"));
            task.xpMultipliers.push(getBindedTaskEffect("Unusual Insight"));
        } else if(task.name == "Farmer") { //trying to make hand tools increase farmer income
            task.incomeMultipliers.push(getBindedItemEffect("Basic Farm Tools"));
            task.xpMultipliers.push(getBindedItemEffect("Small Field"));
            task.incomeMultipliers.push(getBindedItemEffect("Small Field"));
            task.incomeMultipliers.push(getBindedItemEffect("Ox-driven Plow"));
            task.xpMultipliers.push(getBindedItemEffect("Ox-driven Plow"));
            task.incomeMultipliers.push(getBindedItemEffect("Livestock-derived Fertilizer"));
        } else if (task.name == "Fisherman") { // Fishing rod boosts both income and fishing xp (bigger fish baby!)
            task.incomeMultipliers.push(getBindedItemEffect("Cheap Fishing Rod"));
            task.xpMultipliers.push(getBindedItemEffect("Cheap Fishing Rod"));
        } else if (task.name == "Miner") { //lantern boosts income and miner xp by 1.5x
            task.incomeMultipliers.push(getBindedItemEffect("Miner's Lantern"));
            task.xpMultipliers.push(getBindedItemEffect("Miner's Lantern"));
        } else if (task.name == "Blacksmith") { //crappy anvil boosts income and xp of blacksmith by 1.5x
            task.incomeMultipliers.push(getBindedItemEffect("Crappy Anvil"));
            task.xpMultipliers.push(getBindedItemEffect("Crappy Anvil"));
        } else if (task.name == "Merchant") {
            task.incomeMultipliers.push(getBindedItemEffect("Pack Horse"));
            task.incomeMultipliers.push(getBindedTaskEffect("Trade Psychology"));
            task.xpMultipliers.push(getBindedItemEffect("Pack Horse"));
            task.incomeMultipliers.push(getBindedItemEffect("Small Shop"));
            task.xpMultipliers.push(getBindedItemEffect("Small Shop"));
            task.incomeMultipliers.push(getBindedItemEffect("Weapon Outlet"));
            task.xpMultipliers.push(getBindedItemEffect("Weapon Outlet"));
        } else if (task.name == "Strength") {
            task.xpMultipliers.push(getBindedTaskEffect("Muscle memory"))
            task.xpMultipliers.push(getBindedItemEffect("Dumbbells"))
        } else if (skillCategories["Magic"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("Sapphire charm"));
            task.xpMultipliers.push(getBindedTaskEffect("Novel Knowledge"));
            task.xpMultipliers.push(getBindedTaskEffect("Unusual Insight"));
        } else if (jobCategories["The Arcane Association"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("Mana control"));
            task.xpMultipliers.push(getBindedTaskEffect("Novel Knowledge"));
            task.xpMultipliers.push(getBindedTaskEffect("Unusual Insight"));
        } else if (skillCategories["Dark magic"].includes(task.name)) {
            task.xpMultipliers.push(getEvil)
        }
    }

    for (itemName in gameData.itemData) {
        var item = gameData.itemData[itemName]
        item.expenseMultipliers = []
        item.expenseMultipliers.push(getBindedTaskEffect("Bargaining"))
        item.expenseMultipliers.push(getBindedTaskEffect("Intimidation"))
    }
}

function setCustomEffects() {
    var bargaining = gameData.taskData["Bargaining"];
    bargaining.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, bargaining.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    };

    var intimidation = gameData.taskData["Intimidation"];
    intimidation.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, intimidation.level + 1) / 10
        if (multiplier < 0.1) {
            multiplier = 0.1;
        }
        return multiplier;
    };

    //          ***    HISTORICAL NOTES    ***
    // All gamespeed modifying effects are currently combined into this single Time warping multiplier
    // for simplicity's sake. As of this writing, the two relevant skills are Time warping and Flow.
    // As of June 23rd 2021, gameSpeed effects are broken out into their respective effects and functions
    // to increase clarity for players. The old method of combining effects into Time Warping caused Flow
    // to change the Time Warping skill description, which led to confusion. 
    var timeWarping = gameData.taskData["Time warping"];
    var flow = gameData.taskData["Flow"];
    // This re-defined getEffect() function is called in the getGameSpeed() function.
    timeWarping.getEffect = function() {
        var multiplier = 1 + getBaseLog(13, timeWarping.level + 1);
        return multiplier;
    }

    flow.getEffect = function () {
        var multiplier = 1 + getBaseLog(100, flow.level + 1) / 1.3;
        return multiplier;
    }

    var immortality = gameData.taskData["Immortality"]
    immortality.getEffect = function() {
        var multiplier = 1 + getBaseLog(33, immortality.level + 1) 
        return multiplier
    }
}

function getHappiness() {
    var meditationEffect = getBindedTaskEffect("Meditation");
    var butlerEffect = getBindedItemEffect("Butler");
    var happiness = meditationEffect() * butlerEffect() * gameData.currentProperty.getEffect();
    return happiness;
}

function getEvil() {
    return gameData.evil;
}

function applyMultipliers(value, multipliers) {
    var finalMultiplier = 1;
    multipliers.forEach(function(multiplierFunction) {
        var multiplier = multiplierFunction();
        finalMultiplier *= multiplier;
    });
    var finalValue = Math.round(value * finalMultiplier);
    return finalValue;
}

function applySpeed(value) {
    finalValue = value * getGameSpeed() / updateSpeed;
    return finalValue;
}

function getEvilGain() {
    var evilControl = gameData.taskData["Evil control"]
    var bloodMeditation = gameData.taskData["Blood meditation"]
    var evil = evilControl.getEffect() * bloodMeditation.getEffect()
    return evil
}

function getAllTimeMultipliers() {
    var timeWarping = gameData.taskData["Time warping"];
    var flow = gameData.taskData["Flow"];
    var flowSpeed = flow.getEffect();
    var timeWarpingSpeed = gameData.timeWarpingEnabled ? timeWarping.getEffect() : 1;
    var totalTimeMultiplier = flowSpeed * timeWarpingSpeed;
    return totalTimeMultiplier;
    
}

function getGameSpeed() {
    var gameSpeed = baseGameSpeed * +!gameData.paused * +isAlive() * getAllTimeMultipliers();
    return gameSpeed;
}

function applyExpenses() {
    var coins = applySpeed(getExpense())
    gameData.coins -= coins
    if (gameData.coins < 0) {    
        goBankrupt()
    }
}

function getExpense() {
    var expense = 0
    expense += gameData.currentProperty.getExpense()
    for (misc of gameData.currentMisc) {
        expense += misc.getExpense()
    }
    return expense
}

function goBankrupt() {
    gameData.coins = 0
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []
}

function setTab(element, selectedTab) {

    var tabs = Array.prototype.slice.call(document.getElementsByClassName("tab"))
    tabs.forEach(function(tab) {
        tab.style.display = "none"
    })
    document.getElementById(selectedTab).style.display = "block"

    var tabButtons = document.getElementsByClassName("tabButton")
    for (tabButton of tabButtons) {
        tabButton.classList.remove("w3-blue-gray")
    }
    element.classList.add("w3-blue-gray")
}

function setPause() {
    gameData.paused = !gameData.paused
}

function setTimeWarping() {
    gameData.timeWarpingEnabled = !gameData.timeWarpingEnabled
}

function setTask(taskName) {
    var task = gameData.taskData[taskName]
    task instanceof Job ? gameData.currentJob = task : gameData.currentSkill = task
}

function setProperty(propertyName) {
    var property = gameData.itemData[propertyName]
    gameData.currentProperty = property
}

function setMisc(miscName) {
    var misc = gameData.itemData[miscName]
    if (gameData.currentMisc.includes(misc)) {
        for (i = 0; i < gameData.currentMisc.length; i++) {
            if (gameData.currentMisc[i] == misc) {
                gameData.currentMisc.splice(i, 1)
            }
        }
    } else {
        gameData.currentMisc.push(misc)
    }
}

function createData(data, baseData) {
    for (key in baseData) {
        var entity = baseData[key]
        createEntity(data, entity)
    }
}

function createEntity(data, entity) {
    if ("income" in entity) {data[entity.name] = new Job(entity)}
    else if ("maxXp" in entity) {data[entity.name] = new Skill(entity)}
    else {data[entity.name] = new Item(entity)}
    data[entity.name].id = "row " + entity.name
}

function createRequiredRow(categoryName) {
    var requiredRow = document.getElementsByClassName("requiredRowTemplate")[0].content.firstElementChild.cloneNode(true)
    requiredRow.classList.add("requiredRow")
    requiredRow.classList.add(removeSpaces(categoryName))
    requiredRow.id = categoryName
    return requiredRow
}

function createHeaderRow(templates, categoryType, categoryName) {
    var headerRow = templates.headerRow.content.firstElementChild.cloneNode(true)
    headerRow.getElementsByClassName("category")[0].textContent = categoryName
    if (categoryType != itemCategories) {
        headerRow.getElementsByClassName("valueType")[0].textContent = categoryType == jobCategories ? "Income/day" : "Effect"
    }

    headerRow.style.backgroundColor = headerRowColors[categoryName]
    headerRow.style.color = "#ffffff"
    headerRow.classList.add(removeSpaces(categoryName))
    headerRow.classList.add("headerRow")
    
    return headerRow
}

function createRow(templates, name, categoryName, categoryType) {
    var row = templates.row.content.firstElementChild.cloneNode(true)
    row.getElementsByClassName("name")[0].textContent = name
    row.getElementsByClassName("tooltipText")[0].textContent = tooltips[name]
    row.id = "row " + name
    if (categoryType != itemCategories) {
        row.getElementsByClassName("progressBar")[0].onclick = function() {setTask(name)}
    } else {
        row.getElementsByClassName("button")[0].onclick = categoryName == "Properties" ? function() {setProperty(name)} : function() {setMisc(name)}
    }

    return row
}

function createAllRows(categoryType, tableId) {
    var templates = {
        headerRow: document.getElementsByClassName(categoryType == itemCategories ? "headerRowItemTemplate" : "headerRowTaskTemplate")[0],
        row: document.getElementsByClassName(categoryType == itemCategories ? "rowItemTemplate" : "rowTaskTemplate")[0],
    }

    var table = document.getElementById(tableId)

    for (categoryName in categoryType) {
        var headerRow = createHeaderRow(templates, categoryType, categoryName)
        table.appendChild(headerRow)
        
        var category = categoryType[categoryName]
        category.forEach(function(name) {
            var row = createRow(templates, name, categoryName, categoryType)
            table.appendChild(row)       
        })

        var requiredRow = createRequiredRow(categoryName)
        table.append(requiredRow)
    }
}

function updateQuickTaskDisplay(taskType) {
    var currentTask = taskType == "job" ? gameData.currentJob : gameData.currentSkill
    var quickTaskDisplayElement = document.getElementById("quickTaskDisplay")
    var progressBar = quickTaskDisplayElement.getElementsByClassName(taskType)[0]
    progressBar.getElementsByClassName("name")[0].textContent = currentTask.name + " lvl " + currentTask.level
    progressBar.getElementsByClassName("progressFill")[0].style.width = currentTask.xp / currentTask.getMaxXp() * 100 + "%"
}

/*
*   ******* REFACTOR SORELY NEEDED *******
*   ******* DOCUMENTATION SORELY NEEDED *******
*/

/*
*   This function gets called three times. Once with jobs, once with skills, and once for items.
*   Execution: this function first gathers a list of all possible required rows.
*   It then parses through each and every possible required row.
*   
*/
function updateRequiredRows(data, categoryType) {
    var requiredRows = document.getElementsByClassName("requiredRow")
    for (requiredRow of requiredRows) {
        var nextEntity = null
        var category = categoryType[requiredRow.id] //requiredRow.id is simple the category name. For items, it's either the array Property or Misc
        if (category == null) {continue}

        // Once we have the array of items, skills or jobs through the category variable, we iterate through each item within the array
        // with the goal of finding the next entity within the array that has not met it's requirements. 
        // So this for loop is responsible for choosing the row we use as the required row, and is a good target for changing the logic of 
        // required row display.
        if(categoryType.Misc == undefined) {
            for (i = 0; i < category.length; i++) {
                var entityName = category[i] //first we grab the name, like "Beggar" or "Rag Clothing"
                if (i >= category.length - 1) break
                var requirements = gameData.requirements[entityName] //grab any requirements
                if (requirements && i == 0) { //if the thing has requirements, its the first in the array, and they aren't completed, set this thing as the nextEntity
                    if (!requirements.isCompleted()) {
                        nextEntity = data[entityName]
                        break
                    }
                }

                var nextIndex = i + 1
                if (nextIndex >= category.length) {break}
                var nextEntityName = category[nextIndex]
                nextEntityRequirements = gameData.requirements[nextEntityName]

                if (!nextEntityRequirements.isCompleted()) {
                    nextEntity = data[nextEntityName]
                    break
                }       
            }
    }
    //separate decision logic for nextEntity within the Shop
    // Step one: 
    // Step two: then we'll 
    else if (categoryType.Misc != undefined) {
        for (i = 0; i < category.length; i++) {
            var entityName = category[i]; //first we grab the name, like "Beggar" or "Rag Clothing"
            if (i >= category.length - 1) break;
            var requirements = gameData.requirements[entityName]; //grab any requirements
            if (requirements && i == 0) { //if the thing has requirements, its the first in the array, and they aren't completed, set this thing as the nextEntity
                if (!requirements.isCompleted()) {
                    nextEntity = data[entityName];
                        break;
                    
                }
            }

            var nextIndex = i + 1;
            if (nextIndex >= category.length) {break;}
            var nextEntityName = category[nextIndex];
            nextEntityRequirements = gameData.requirements[nextEntityName];

            if (!nextEntityRequirements.isCompleted()) {
                nextEntity = data[nextEntityName]
                break
            }    


            //decision logic for setting the item to be up next, and therefore used for the required row
            //if the current job doesn't match the job in the entity's TaskRequirement, continue to the next loop iteration
            //if the current job matches the item, display that item in the required rows

            /* var requirementObject = nextEntityRequirements; //grab the containing requirement object, like TaskRequirement or CoinRequirement
            if( (requirementObject instanceof TaskRequirement) && gameData.currentJob == requirementObject.requirements[0].task && !requirementObject.isCompleted()) {
                //i++;
                nextEntity = data[nextEntityName];
                break;
            } else if( (requirementObject instanceof TaskRequirement) && gameData.currentJob != requirementObject.requirements[0].task) {
                continue;
            }  else if(requirementObject instanceof CoinRequirement && !nextEntityRequirements.isCompleted()) {
                nextEntity = data[nextEntityName];
                break;
            } */ 
            
                  
        }
    }

        //If we didn't find an object within the array that has requirements left to fulfill, we don't display any
        //required row. We do this by setting the required row to hiddenTask so it doesn't display.
        if (nextEntity == null) {
            requiredRow.classList.add("hiddenTask")      
        
        //Otherwise, we do have an object to display a required row for. This following code is the code
        //that decides what exactly gets displayed into the requiredRow template.
        } else {
            requiredRow.classList.remove("hiddenTask")
            var requirementObject = gameData.requirements[nextEntity.name] //grab the containing requirement object, like TaskRequirement or CoinRequirement
            var requirements = requirementObject.requirements //get the inner object, like {task: Concentration, requirement: 85}

            //grab references to <span> elements within the template
            var coinElement = requiredRow.getElementsByClassName("coins")[0]
            var levelElement = requiredRow.getElementsByClassName("levels")[0]
            var evilElement = requiredRow.getElementsByClassName("evil")[0]

            //start by setting all spans to hidden
            coinElement.classList.add("hiddenTask")
            levelElement.classList.add("hiddenTask")
            evilElement.classList.add("hiddenTask")

            var finalText = ""
            if (data == gameData.taskData) {
                //display logic for a Job or Skill required row
                if (requirementObject instanceof EvilRequirement) {
                    evilElement.classList.remove("hiddenTask")
                    evilElement.textContent = format(requirements[0].requirement) + " evil"
                } else {
                    levelElement.classList.remove("hiddenTask")

                    //for each mini-object, like {task: Concentration, requirement: 10} inside the containing object like TaskRequirement
                    for (requirement of requirements) {
                        var task = gameData.taskData[requirement.task]
                        //why not just use the already-built requirement.isCompleted check?
                        if (task.level >= requirement.requirement) continue
                        var text = " " + requirement.task + " level " + format(task.level) + "/" + format(requirement.requirement) + ","
                        finalText += text
                    }
                    finalText = finalText.substring(0, finalText.length - 1)
                    levelElement.textContent = finalText
                }
                //Item requirement row display logic
                
            /*
            *   So once we're here, there are two cases.
            *   The first case is a simple item with only a CoinRequirement. In this case, we use the original display logic.
            *   Second case, the item has a TaskRequirement and no CoinRequirement. So as-is, the display logic somehow displays
            *   the item's expense even though it isn't accessed through a CoinRequirement. Weird as hell. No idea how it's doing that for the
            *   items that only have TaskRequirements, unless this whole time it's actually been displaying the Task level requirement as the coin cost.
            *   I think that is what has been happening. Lmao. Oops.
            *  
            */
            } else if (data == gameData.itemData) {
                if(requirementObject instanceof CoinRequirement) {
                    coinElement.classList.remove("hiddenTask");
                    levelElement.classList.remove("hiddenTask");
                    formatCoins(requirements[0].requirement, coinElement);
                }
                else if(requirementObject instanceof TaskRequirement) {
                    levelElement.classList.remove("hiddenTask");
                    for (requirement of requirements) {
                        var task = gameData.taskData[requirement.task];
                        //why not just use the already-built requirement.isCompleted check?
                        if (task.level >= requirement.requirement) continue;
                        var text = " " + requirement.task + " level " + format(task.level) + "/" + format(requirement.requirement) + ",";
                        finalText += text;
                    }
                    finalText = finalText.substring(0, finalText.length - 1);
                    levelElement.textContent = finalText;
                    
                }

            }
        }   
    }
}

function updateTaskRows() {
    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        var row = document.getElementById("row " + task.name)
        row.getElementsByClassName("level")[0].textContent = task.level
        row.getElementsByClassName("xpGain")[0].textContent = format(task.getXpGain())
        row.getElementsByClassName("xpLeft")[0].textContent = format(task.getXpLeft())

        var maxLevel = row.getElementsByClassName("maxLevel")[0]
        maxLevel.textContent = task.maxLevel
        gameData.rebirthOneCount > 0 ? maxLevel.classList.remove("hidden") : maxLevel.classList.add("hidden")

        var progressFill = row.getElementsByClassName("progressFill")[0]
        progressFill.style.width = task.xp / task.getMaxXp() * 100 + "%"
        task == gameData.currentJob || task == gameData.currentSkill ? progressFill.classList.add("current") : progressFill.classList.remove("current")

        var valueElement = row.getElementsByClassName("value")[0]
        valueElement.getElementsByClassName("income")[0].style.display = task instanceof Job
        valueElement.getElementsByClassName("effect")[0].style.display = task instanceof Skill

        var skipSkillElement = row.getElementsByClassName("skipSkill")[0]
        skipSkillElement.style.display = task instanceof Skill && autoLearnElement.checked ? "block" : "none"

        if (task instanceof Job) {
            formatCoins(task.getIncome(), valueElement.getElementsByClassName("income")[0])
        } else {
            valueElement.getElementsByClassName("effect")[0].textContent = task.getEffectDescription()
        }
    }
}

function updateItemRows() {
    for (key in gameData.itemData) {
        var item = gameData.itemData[key]
        var row = document.getElementById("row " + item.name)
        var button = row.getElementsByClassName("button")[0]
        button.disabled = gameData.coins < item.getExpense()
        var active = row.getElementsByClassName("active")[0]
        var color = itemCategories["Properties"].includes(item.name) ? headerRowColors["Properties"] : headerRowColors["Misc"]
        active.style.backgroundColor = gameData.currentMisc.includes(item) || item == gameData.currentProperty ? color : "white"
        row.getElementsByClassName("effect")[0].textContent = item.getEffectDescription()
        formatCoins(item.getExpense(), row.getElementsByClassName("expense")[0])
    }
}

function updateHeaderRows(categories) {
    for (categoryName in categories) {
        var className = removeSpaces(categoryName)
        var headerRow = document.getElementsByClassName(className)[0]
        var maxLevelElement = headerRow.getElementsByClassName("maxLevel")[0]
        gameData.rebirthOneCount > 0 ? maxLevelElement.classList.remove("hidden") : maxLevelElement.classList.add("hidden")
        var skipSkillElement = headerRow.getElementsByClassName("skipSkill")[0]
        skipSkillElement.style.display = categories == skillCategories && autoLearnElement.checked ? "block" : "none"
    }
}

function updateText() {
    //Sidebar
    document.getElementById("ageDisplay").textContent = daysToYears(gameData.days);
    document.getElementById("dayDisplay").textContent = getDay();
    document.getElementById("lifespanDisplay").textContent = daysToYears(getLifespan());
    document.getElementById("pauseButton").textContent = gameData.paused ? "Play" : "Pause";

    formatCoins(gameData.coins, document.getElementById("coinDisplay"));
    setSignDisplay();
    formatCoins(getNet(), document.getElementById("netDisplay"));
    formatCoins(getIncome(), document.getElementById("incomeDisplay"));
    formatCoins(getExpense(), document.getElementById("expenseDisplay"));

    document.getElementById("happinessDisplay").textContent = getHappiness().toFixed(1);

    document.getElementById("evilDisplay").textContent = gameData.evil.toFixed(1);
    document.getElementById("evilGainDisplay").textContent = getEvilGain().toFixed(1);

    document.getElementById("timeWarpingDisplay").textContent = "x" + getAllTimeMultipliers().toFixed(2);
    document.getElementById("timeWarpingButton").textContent = gameData.timeWarpingEnabled ? "Disable warp" : "Enable warp";
}

function setSignDisplay() {
    var signDisplay = document.getElementById("signDisplay")
    if (getIncome() > getExpense()) {
        signDisplay.textContent = "+"
        signDisplay.style.color = "green"
    } else if (getExpense() > getIncome()) {
        signDisplay.textContent = "-"
        signDisplay.style.color = "red"
    } else {
        signDisplay.textContent = ""
        signDisplay.style.color = "gray"
    }
}

function getNet() {
    var net = Math.abs(getIncome() - getExpense())
    return net
}

function hideEntities() {
    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        var completed = requirement.isCompleted()
        for (element of requirement.elements) {
            if (completed) {
                element.classList.remove("hidden")
            } else {
                element.classList.add("hidden")
            }
        }
    }
}

function createItemData(baseData) {
    for (var item of baseData) {
        gameData.itemData[item.name] = "happiness" in item ? new Property(task) : new Misc(task)
        gameData.itemData[item.name].id = "item " + item.name
    }
}

function doCurrentTask(task) {
    task.increaseXp()
    if (task instanceof Job) {
        increaseCoins()
    }
}

function getIncome() {
    var income = 0
    income += gameData.currentJob.getIncome()
    return income
}

function increaseCoins() {
    var coins = applySpeed(getIncome())
    gameData.coins += coins
}

function daysToYears(days) {
    var years = Math.floor(days / 365)
    return years
}

function getCategoryFromEntityName(categoryType, entityName) {
    for (categoryName in categoryType) {
        var category = categoryType[categoryName]
        if (category.includes(entityName)) {
            return category
        }
    }
}

function getNextEntity(data, categoryType, entityName) {
    var category = getCategoryFromEntityName(categoryType, entityName)
    var nextIndex = category.indexOf(entityName) + 1
    if (nextIndex > category.length - 1) return null
    var nextEntityName = category[nextIndex]
    var nextEntity = data[nextEntityName]
    return nextEntity
}

function autoPromote() {
    if (!autoPromoteElement.checked) return
    var nextEntity = getNextEntity(gameData.taskData, jobCategories, gameData.currentJob.name)
    if (nextEntity == null) return
    var requirement = gameData.requirements[nextEntity.name]
    if (requirement.isCompleted()) gameData.currentJob = nextEntity
}

function checkSkillSkipped(skill) {
    var row = document.getElementById("row " + skill.name)
    var isSkillSkipped = row.getElementsByClassName("checkbox")[0].checked
    return isSkillSkipped
}

function setSkillWithLowestMaxXp() {
    var xpDict = {}

    for (skillName in gameData.taskData) {
        var skill = gameData.taskData[skillName]
        var requirement = gameData.requirements[skillName]
        /*
        Getting an autolearn error, and the dev console says there is an uncaught
        TypeError at this line of code below during the requirement.isCompleted() call. 
        I think the error is saying that when calling requirement.isCompleted, requirement is undefined.
        This would make sense if I have a skill that doesn't have any unlock requirements, which I think
        is true of Novel Knowledge for table rendering reasons. So the game logic assumes each skill has a requirement
        without actually checking if requirement is non-null. 
        */
        if (skill instanceof Skill) {
            //This check on the requirement variable is here to handle the case of a skill
            //having no requirements. By setting requirement equal to Concentration's requirements, 
            //we prevent unchecked TypeErrors that have been breaking the auto learn feature. 
            
            // NOTE : FRAGILE FIX
            // This fix will break if the Concentration skill is either removed from the game, renamed, or the requirement is no
            // longer immediately satisfied upon starting a new game. 
            if(requirement == null) {
                requirement = gameData.requirements["Concentration"];
            }
            if (requirement.isCompleted() && !checkSkillSkipped(skill)) {
                xpDict[skill.name] = skill.level //skill.getMaxXp() / skill.getXpGain()
            }
        }
    }

    if (xpDict == {}) {
        skillWithLowestMaxXp = gameData.taskData["Concentration"]
        return
    }

    var skillName = getKeyOfLowestValueFromDict(xpDict)
    skillWithLowestMaxXp = gameData.taskData[skillName]
}

function getKeyOfLowestValueFromDict(dict) {
    var values = []
    for (key in dict) {
        var value = dict[key]
        values.push(value)
    }

    values.sort(function(a, b){return a - b})

    for (key in dict) {
        var value = dict[key]
        if (value == values[0]) {
            return key
        }
    }
}

function autoLearn() {
    if (!autoLearnElement.checked || !skillWithLowestMaxXp) return
    gameData.currentSkill = skillWithLowestMaxXp
}

function yearsToDays(years) {
    var days = years * 365
    return days
}
 
function getDay() {
    var day = Math.floor(gameData.days - daysToYears(gameData.days) * 365)
    return day
}

function increaseDays() {
    var increase = applySpeed(1)
    gameData.days += increase
}

function format(number) {

    // what tier? (determines SI symbol)
    var tier = Math.log10(number) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier == 0) return number;

    // get suffix and determine scale
    var suffix = units[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
}

function formatCoins(coins, element) {
    var tiers = ["p", "g", "s"]
    var colors = {
        "p": "#79b9c7",
        "g": "#E5C100",
        "s": "#a8a8a8",
        "c": "#a15c2f"
    }
    var leftOver = coins
    var i = 0
    for (tier of tiers) {
        var x = Math.floor(leftOver / Math.pow(10, (tiers.length - i) * 2))
        var leftOver = Math.floor(leftOver - x * Math.pow(10, (tiers.length - i) * 2))
        var text = format(String(x)) + tier + " "
        element.children[i].textContent = x > 0 ? text : ""
        element.children[i].style.color = colors[tier]
        i += 1
    }
    if (leftOver == 0 && coins > 0) {element.children[3].textContent = ""; return}
    var text = String(Math.floor(leftOver)) + "c"
    element.children[3].textContent = text
    element.children[3].style.color = colors["c"]
}

function getTaskElement(taskName) {
    var task = gameData.taskData[taskName]
    var element = document.getElementById(task.id)
    return element
}

function getItemElement(itemName) {
    var item = gameData.itemData[itemName]
    var element = document.getElementById(item.id)
    return element
}

function getElementsByClass(className) {
    var elements = document.getElementsByClassName(removeSpaces(className))
    return elements
}

function setLightDarkMode() {
    var body = document.getElementById("body")
    body.classList.contains("dark") ? body.classList.remove("dark") : body.classList.add("dark")
}

function removeSpaces(string) {
    var string = string.replace(/ /g, "")
    return string
}

function rebirthOne() {
    gameData.rebirthOneCount += 1

    rebirthReset()
}

function rebirthTwo() {
    gameData.rebirthTwoCount += 1
    gameData.evil += getEvilGain()

    rebirthReset()

    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]
        task.maxLevel = 0
    }    
}

function rebirthReset() {
    setTab(jobTabButton, "jobs")

    gameData.coins = 0
    gameData.days = 365 * 14
    gameData.currentJob = gameData.taskData["Beggar"]
    gameData.currentSkill = gameData.taskData["Concentration"]
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []

    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]
        if (task.level > task.maxLevel) task.maxLevel = task.level
        task.level = 0
        task.xp = 0
    }

    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        if (requirement.completed && permanentUnlocks.includes(key)) continue
        requirement.completed = false
    }
}

function getLifespan() {
    var immortality = gameData.taskData["Immortality"]
    var superImmortality = gameData.taskData["Super immortality"]
    var lifespan = baseLifespan * immortality.getEffect() * superImmortality.getEffect()
    return lifespan
}

function isAlive() {
    var condition = gameData.days < getLifespan()
    var deathText = document.getElementById("deathText")
    if (!condition) {
        gameData.days = getLifespan()
        deathText.classList.remove("hidden")
    }
    else {
        deathText.classList.add("hidden")
    }
    return condition
}

function assignMethods() {

    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        if (task.baseData.income) {
            task.baseData = jobBaseData[task.name]
            task = Object.assign(new Job(jobBaseData[task.name]), task)
            
        } else {
            task.baseData = skillBaseData[task.name]
            task = Object.assign(new Skill(skillBaseData[task.name]), task)
        } 
        gameData.taskData[key] = task
    }

    for (key in gameData.itemData) {
        var item = gameData.itemData[key]
        item.baseData = itemBaseData[item.name]
        item = Object.assign(new Item(itemBaseData[item.name]), item)
        gameData.itemData[key] = item
    }

    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        if (requirement.type == "task") {
            requirement = Object.assign(new TaskRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "coins") {
            requirement = Object.assign(new CoinRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "age") {
            requirement = Object.assign(new AgeRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "evil") {
            requirement = Object.assign(new EvilRequirement(requirement.elements, requirement.requirements), requirement)
        }

        var tempRequirement = tempData["requirements"][key]
        requirement.elements = tempRequirement.elements
        requirement.requirements = tempRequirement.requirements
        gameData.requirements[key] = requirement
    }

    gameData.currentJob = gameData.taskData[gameData.currentJob.name]
    gameData.currentSkill = gameData.taskData[gameData.currentSkill.name]
    gameData.currentProperty = gameData.itemData[gameData.currentProperty.name]
    var newArray = []
    for (misc of gameData.currentMisc) {
        newArray.push(gameData.itemData[misc.name])
    }
    gameData.currentMisc = newArray
}

function replaceSaveDict(dict, saveDict) {
    for (key in dict) {
        if (!(key in saveDict)) {
            saveDict[key] = dict[key]
        } else if (dict == gameData.requirements) {
            if (saveDict[key].type != tempData["requirements"][key].type) {
                saveDict[key] = tempData["requirements"][key]
            }
        }
    }

    for (key in saveDict) {
        if (!(key in dict)) {
            delete saveDict[key]
        }
    }
}

function saveGameData() {
    localStorage.setItem("gameDataSave", JSON.stringify(gameData))
}

function loadGameData() {
    var gameDataSave = JSON.parse(localStorage.getItem("gameDataSave"))

    if (gameDataSave !== null) {
        replaceSaveDict(gameData, gameDataSave)
        replaceSaveDict(gameData.requirements, gameDataSave.requirements)
        replaceSaveDict(gameData.taskData, gameDataSave.taskData)
        replaceSaveDict(gameData.itemData, gameDataSave.itemData)

        gameData = gameDataSave
    }

    assignMethods()
}

function updateUI() {
    updateTaskRows()
    updateItemRows()
    updateRequiredRows(gameData.taskData, jobCategories)
    updateRequiredRows(gameData.taskData, skillCategories)
    updateRequiredRows(gameData.itemData, itemCategories)
    updateHeaderRows(jobCategories)
    updateHeaderRows(skillCategories)
    updateQuickTaskDisplay("job")
    updateQuickTaskDisplay("skill")
    hideEntities()
    updateText()
}

function update() {
    increaseDays()
    autoPromote()
    autoLearn()
    doCurrentTask(gameData.currentJob)
    doCurrentTask(gameData.currentSkill)
    applyExpenses()
    updateUI()
}

function resetGameData() {
    localStorage.clear()
    location.reload()
}

function importGameData() {
    var importExportBox = document.getElementById("importExportBox")
    var data = JSON.parse(window.atob(importExportBox.value))
    gameData = data
    saveGameData()
    location.reload()
}

function exportGameData() {
    var importExportBox = document.getElementById("importExportBox")
    importExportBox.value = window.btoa(JSON.stringify(gameData))
}

//Init

createAllRows(jobCategories, "jobTable")
createAllRows(skillCategories, "skillTable")
createAllRows(itemCategories, "itemTable") 

createData(gameData.taskData, jobBaseData)
createData(gameData.taskData, skillBaseData)
createData(gameData.itemData, itemBaseData) 

gameData.currentJob = gameData.taskData["Beggar"]
gameData.currentSkill = gameData.taskData["Concentration"]
gameData.currentProperty = gameData.itemData["Homeless"]
gameData.currentMisc = []

gameData.requirements = {
    //Other
    "The Arcane Association": new TaskRequirement(getElementsByClass("The Arcane Association"), [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    //"Mind": new TaskRequirement(getElementsByClass("Mind"), [{task: "Concentration", requirement: 700}, {task: "Meditation", requirement: 700}]),
    "Nobility": new TaskRequirement(getElementsByClass("Nobility"), [{task: "Elite knight", requirement: 10}]),
    "Dark magic": new EvilRequirement(getElementsByClass("Dark magic"), [{requirement: 1}]),
    "Shop": new CoinRequirement([document.getElementById("shopTabButton")], [{requirement: gameData.itemData["Tent"].getExpense() * 50}]),
    "Rebirth tab": new AgeRequirement([document.getElementById("rebirthTabButton")], [{requirement: 25}]),
    "Rebirth note 1": new AgeRequirement([document.getElementById("rebirthNote1")], [{requirement: 45}]),
    "Rebirth note 2": new AgeRequirement([document.getElementById("rebirthNote2")], [{requirement: 65}]),
    "Rebirth note 3": new AgeRequirement([document.getElementById("rebirthNote3")], [{requirement: 200}]),
    "Evil info": new EvilRequirement([document.getElementById("evilInfo")], [{requirement: 1}]),
    "Time warping info": new TaskRequirement([document.getElementById("timeWarping")], [{task: "Mage", requirement: 10}]),
    "Automation": new AgeRequirement([document.getElementById("automation")], [{requirement: 20}]),
    "Quick task display": new AgeRequirement([document.getElementById("quickTaskDisplay")], [{requirement: 20}]),

    //Common work
    "Beggar": new TaskRequirement([getTaskElement("Beggar")], []),
    "Farmer": new TaskRequirement([getTaskElement("Farmer")], [{task: "Beggar", requirement: 10}]),
    "Fisherman": new TaskRequirement([getTaskElement("Fisherman")], [{task: "Farmer", requirement: 10}]),
    "Miner": new TaskRequirement([getTaskElement("Miner")], [{task: "Strength", requirement: 10}, {task: "Fisherman", requirement: 10}]),
    "Blacksmith": new TaskRequirement([getTaskElement("Blacksmith")], [{task: "Strength", requirement: 30}, {task: "Miner", requirement: 10}]),
    "Merchant": new TaskRequirement([getTaskElement("Merchant")], [{task: "Bargaining", requirement: 50}, {task: "Blacksmith", requirement: 10}]),

    //Military 
    "Squire": new TaskRequirement([getTaskElement("Squire")], [{task: "Strength", requirement: 5}]),
    "Footman": new TaskRequirement([getTaskElement("Footman")], [{task: "Strength", requirement: 20}, {task: "Squire", requirement: 10}]),
    "Veteran footman": new TaskRequirement([getTaskElement("Veteran footman")], [{task: "Battle tactics", requirement: 40}, {task: "Footman", requirement: 10}]),
    "Knight": new TaskRequirement([getTaskElement("Knight")], [{task: "Strength", requirement: 100}, {task: "Veteran footman", requirement: 10}]),
    "Veteran knight": new TaskRequirement([getTaskElement("Veteran knight")], [{task: "Battle tactics", requirement: 150}, {task: "Knight", requirement: 10}]),
    "Elite knight": new TaskRequirement([getTaskElement("Elite knight")], [{task: "Strength", requirement: 300}, {task: "Veteran knight", requirement: 10}]),
    "Holy knight": new TaskRequirement([getTaskElement("Holy knight")], [{task: "Mana control", requirement: 500}, {task: "Elite knight", requirement: 10}]),
    "Legendary knight": new TaskRequirement([getTaskElement("Legendary knight")], [{task: "Mana control", requirement: 1000}, {task: "Battle tactics", requirement: 1000}, {task: "Holy knight", requirement: 10}]),

    //The Arcane Association
    "Student": new TaskRequirement([getTaskElement("Student")], [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Apprentice mage": new TaskRequirement([getTaskElement("Apprentice mage")], [{task: "Mana control", requirement: 400}, {task: "Student", requirement: 10}]),
    "Mage": new TaskRequirement([getTaskElement("Mage")], [{task: "Mana control", requirement: 700}, {task: "Apprentice mage", requirement: 10}]),
    "Wizard": new TaskRequirement([getTaskElement("Wizard")], [{task: "Mana control", requirement: 1000}, {task: "Mage", requirement: 10}]),
    "Master wizard": new TaskRequirement([getTaskElement("Master wizard")], [{task: "Mana control", requirement: 1500}, {task: "Wizard", requirement: 10}]),
    "Chairman": new TaskRequirement([getTaskElement("Chairman")], [{task: "Mana control", requirement: 2000}, {task: "Master wizard", requirement: 10}]),

    //The Order of Discovery
    "Junior Caretaker": new TaskRequirement([getTaskElement("Junior Caretaker")], 
                                            [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}, {task: "Productivity", requirement: "500"}]),
    "Lead Caretaker": new TaskRequirement([getTaskElement("Lead Caretaker")], [{task: "Junior Caretaker", requirement: 10}]),
    "Freshman": new TaskRequirement([getTaskElement("Freshman")], [{task: "Lead Caretaker", requirement: 10}]),
    "Sophomore": new TaskRequirement([getTaskElement("Sophomore")], [{task: "Freshman", requirement: 10}]),
    "Junior": new TaskRequirement([getTaskElement("Junior")], [{task: "Sophomore", requirement: 10}]),
    "Senior": new TaskRequirement([getTaskElement("Senior")], [{task: "Junior", requirement: 10}]),
    "Probation": new TaskRequirement([getTaskElement("Probation")], [{task: "Senior", requirement: 10}]),

    //Nobility
    "Baronet": new TaskRequirement([getTaskElement("Baronet")], [{task: "Elite knight", requirement: 10}]),
    "Baron": new TaskRequirement([getTaskElement("Baron")], [{task: "Baronet", requirement: 10}]),
    "Vice Count": new TaskRequirement([getTaskElement("Vice Count")], [{task: "Baron", requirement: 10}]),
    "Count": new TaskRequirement([getTaskElement("Count")], [{task: "Vice Count", requirement: 10}]),
    "Duke": new TaskRequirement([getTaskElement("Duke")], [{task: "Count", requirement: 10}]),
    "Grand Duke": new TaskRequirement([getTaskElement("Grand Duke")], [{task: "Duke", requirement: 10}]),
    "Arch Duke": new TaskRequirement([getTaskElement("Arch Duke")], [{task: "Grand Duke", requirement: 10}]),
    "Lord": new TaskRequirement([getTaskElement("Lord")], [{task: "Arch Duke", requirement: 10}]),
    "High Lord": new TaskRequirement([getTaskElement("High Lord")], [{task: "Lord", requirement: 10}]),
    "King": new TaskRequirement([getTaskElement("King")], [{task: "High Lord", requirement: 10}]),
    "High King": new TaskRequirement([getTaskElement("High King")], [{task: "King", requirement: 10}]),
    "Emperor of Mankind": new TaskRequirement([getTaskElement("Emperor of Mankind")], [{task: "High King", requirement: 10}]),

    //Fundamentals
    "Concentration": new TaskRequirement([getTaskElement("Concentration")], []),
    "Productivity": new TaskRequirement([getTaskElement("Productivity")], [{task: "Concentration", requirement: 5}]),
    "Bargaining": new TaskRequirement([getTaskElement("Bargaining")], [{task: "Concentration", requirement: 20}]),
    "Meditation": new TaskRequirement([getTaskElement("Meditation")], [{task: "Concentration", requirement: 30}, {task: "Productivity", requirement: 20}]),

    //Combat
    "Strength": new TaskRequirement([getTaskElement("Strength")], []),
    "Battle tactics": new TaskRequirement([getTaskElement("Battle tactics")], [{task: "Concentration", requirement: 20}]),
    "Muscle memory": new TaskRequirement([getTaskElement("Muscle memory")], [{task: "Concentration", requirement: 30}, {task: "Strength", requirement: 30}]),

    //Magic
    "Mana control": new TaskRequirement([getTaskElement("Mana control")], [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Immortality": new TaskRequirement([getTaskElement("Immortality")], [{task: "Apprentice mage", requirement: 10}]),
    "Time warping": new TaskRequirement([getTaskElement("Time warping")], [{task: "Mage", requirement: 10}]),
    "Super immortality": new TaskRequirement([getTaskElement("Super immortality")], [{task: "Chairman", requirement: 1000}]),

    //Mind
    //"Novel Knowledge": new TaskRequirement([getTaskElement("Novel Knowledge")], [{task: "Concentration", requirement: 700}, {task: "Meditation", requirement: 700}]),
    "Unusual Insight": new TaskRequirement([getTaskElement("Unusual Insight")], [{task: "Meditation", requirement: 900}, {task: "Novel Knowledge", requirement: 900}]),
    "Trade Psychology": new TaskRequirement([getTaskElement("Trade Psychology")], [{task: "Unusual Insight", requirement: 900}, {task: "Probation", requirement: 40}]),
    "Flow": new TaskRequirement([getTaskElement("Flow")], [{task: "Unusual Insight", requirement: 1500}, {task: "Probation", requirement: 40}]),

    //Dark magic
    "Dark influence": new EvilRequirement([getTaskElement("Dark influence")], [{requirement: 1}]),
    "Evil control": new EvilRequirement([getTaskElement("Evil control")], [{requirement: 1}]),
    "Intimidation": new EvilRequirement([getTaskElement("Intimidation")], [{requirement: 1}]),
    "Demon training": new EvilRequirement([getTaskElement("Demon training")], [{requirement: 25}]),
    "Blood meditation": new EvilRequirement([getTaskElement("Blood meditation")], [{requirement: 75}]),
    "Demon's wealth": new EvilRequirement([getTaskElement("Demon's wealth")], [{requirement: 500}]),


    //Properties
    "Homeless": new CoinRequirement([getItemElement("Homeless")], [{requirement: 0}]),
    "Tent": new CoinRequirement([getItemElement("Tent")], [{requirement: 0}]),
    "Wooden hut": new CoinRequirement([getItemElement("Wooden hut")], [{requirement: gameData.itemData["Wooden hut"].getExpense() * 100}]),
    "Cottage": new CoinRequirement([getItemElement("Cottage")], [{requirement: gameData.itemData["Cottage"].getExpense() * 100}]),
    "House": new CoinRequirement([getItemElement("House")], [{requirement: gameData.itemData["House"].getExpense() * 100}]),
    "Large house": new CoinRequirement([getItemElement("Large house")], [{requirement: gameData.itemData["Large house"].getExpense() * 100}]),
    "Small Manor": new CoinRequirement([getItemElement("Small Manor")], [{requirement: gameData.itemData["Small Manor"].getExpense() * 100}]),
    "Small palace": new CoinRequirement([getItemElement("Small palace")], [{requirement: gameData.itemData["Small palace"].getExpense() * 100}]),
    "Grand palace": new CoinRequirement([getItemElement("Grand palace")], [{requirement: gameData.itemData["Grand palace"].getExpense() * 100}]),

    //Misc
    "Book": new CoinRequirement([getItemElement("Book")], [{requirement: 0}]),
    "Rag Clothing": new CoinRequirement([getItemElement("Rag Clothing")], [{requirement: 10}]),
    "Dumbbells": new CoinRequirement([getItemElement("Dumbbells")], [{requirement: gameData.itemData["Dumbbells"].getExpense() * 100}]),
    "Personal squire": new CoinRequirement([getItemElement("Personal squire")], [{requirement: gameData.itemData["Personal squire"].getExpense() * 100}]),
    "Steel longsword": new CoinRequirement([getItemElement("Steel longsword")], [{requirement: gameData.itemData["Steel longsword"].getExpense() * 100}]),
    "Butler": new CoinRequirement([getItemElement("Butler")], [{requirement: gameData.itemData["Butler"].getExpense() * 100}]),
    "Sapphire charm": new CoinRequirement([getItemElement("Sapphire charm")], [{requirement: gameData.itemData["Sapphire charm"].getExpense() * 100}]),
    "Study desk": new CoinRequirement([getItemElement("Study desk")], [{requirement: gameData.itemData["Study desk"].getExpense() * 100}]),
    "Library": new CoinRequirement([getItemElement("Library")], [{requirement: gameData.itemData["Library"].getExpense() * 100}]), 
    "Small Field": new TaskRequirement([getItemElement("Small Field")], [{task: "Farmer", requirement: 25}]),
    "Basic Farm Tools": new TaskRequirement([getItemElement("Basic Farm Tools")], [{task: "Farmer", requirement: 10}]),
    "Cheap Fishing Rod": new TaskRequirement([getItemElement("Cheap Fishing Rod")], [{task: "Fisherman", requirement: 10}]),
    "Miner's Lantern": new TaskRequirement([getItemElement("Miner's Lantern")], [{task: "Miner", requirement: 10}]),
    "Crappy Anvil": new TaskRequirement([getItemElement("Crappy Anvil")], [{task: "Blacksmith", requirement: 10}]),
    "Pack Horse": new TaskRequirement([getItemElement("Pack Horse")], [{task: "Merchant", requirement: 10}]),
    "Small Shop": new TaskRequirement([getItemElement("Small Shop")], [{task: "Merchant", requirement: 75}]),
    "Weapon Outlet": new TaskRequirement([getItemElement("Weapon Outlet")], [{task: "Merchant", requirement: 200}]),
    "Ox-driven Plow": new TaskRequirement([getItemElement("Ox-driven Plow")], [{task: "Farmer", requirement: 75}]),
    "Livestock-derived Fertilizer": new TaskRequirement([getItemElement("Livestock-derived Fertilizer")], [{task: "Farmer", requirement: 85}]),
}

tempData["requirements"] = {}
for (key in gameData.requirements) {
    var requirement = gameData.requirements[key]
    tempData["requirements"][key] = requirement
}

loadGameData()

setCustomEffects()
addMultipliers()

setTab(jobTabButton, "jobs")

update()
setInterval(update, 1000 / updateSpeed)
setInterval(saveGameData, 3000)
setInterval(setSkillWithLowestMaxXp, 1000)