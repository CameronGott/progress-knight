//Turn on devmode: 1
//Turn off devmode: 0
var devModeFastProgress = 0;
// ******* DEV MODE SPEED INCREASES ******* //
//original base game speed: 4
var baseGameSpeed = 4;
var baseEffect = 0.01;
if(devModeFastProgress == 1) {
    baseGameSpeed = 32;
    baseEffect = 100;
}

const skillBaseData = {
    //original effect: 0.01
    //Fundamentals
    "Concentration": {name: "Concentration", maxXp: 100, effect: baseEffect, description: "Skill xp"},
    "Productivity": {name: "Productivity", maxXp: 100, effect: 0.01, description: "Job xp"},
    "Bargaining": {name: "Bargaining", maxXp: 100, effect: -0.01, description: "Expenses"},
    "Meditation": {name: "Meditation", maxXp: 100, effect: baseEffect, description: "Happiness"},

    //Combat
    "Strength": {name: "Strength", maxXp: 100, effect: 0.01, description: "Military pay"},
    "Battle tactics": {name: "Battle tactics", maxXp: 100, effect: 0.01, description: "Military xp"},
    "Muscle memory": {name: "Muscle memory", maxXp: 100, effect: 0.01, description: "Strength xp"},
    
    //Magic
    "Mana control": {name: "Mana control", maxXp: 100, effect: baseEffect, description: "T.A.A. xp"},
    "Immortality": {name: "Immortality", maxXp: 100, effect: 0.01, description: "Longer lifespan"},
    "Time warping": {name: "Time warping", maxXp: 100, effect: 0.01, description: "Gamespeed"},
    "Super immortality": {name: "Super immortality", maxXp: 100, effect: 0.01, description: "Longer lifespan"},

    //Mind
    "Novel Knowledge": {name: "Novel Knowledge", maxXp: 100, effect: 0.01, description: "Discovery xp"},
    "Unusual Insight": {name: "Unusual Insight", maxXp: 100, effect: 0.005, description: "Magical xp"},
    "Trade Psychology": {name: "Trade Psychology", maxXp: 100, effect: 0.80, description: "Merchant pay"},
    "Flow": {name: "Flow", maxXp: 800, effect: 0.001, description: "Gamespeed"},
    "Magical Engineering": {name: "Magical Engineering", maxXp: 1000, effect: 0.01, description: "Chairman xp"},
    "Scales Of Thought": {name: "Scales Of Thought", maxXp: 1100, effect: 0.003, description: "Magical xp"},
    "Magical Biology": {name: "Magical Biology", maxXp: 1500, effect: 0.005, description: "Chairman xp"},

    "Dark influence": {name: "Dark influence", maxXp: 100, effect: 0.01, description: "All xp"},
    "Evil control": {name: "Evil control", maxXp: 100, effect: 0.01, description: "Evil gain"},
    "Intimidation": {name: "Intimidation", maxXp: 100, effect: -0.01, description: "Expenses"},
    "Demon training": {name: "Demon training", maxXp: 100, effect: 0.01, description: "All xp"},
    "Blood meditation": {name: "Blood meditation", maxXp: 100, effect: 0.01, description: "Evil gain"},
    "Demon's wealth": {name: "Demon's wealth", maxXp: 100, effect: 0.002, description: "Job pay"},

}

const skillCategories = {
    "Fundamentals"           :    ["Concentration", "Productivity", "Bargaining", "Meditation"],
    "Combat"                 :    ["Strength", "Battle tactics", "Muscle memory"],
    "Magic"                  :    ["Mana control", "Immortality", "Time warping", "Super immortality"],
    "Mind"                   :    ["Novel Knowledge", "Unusual Insight", "Trade Psychology", "Flow", "Magical Engineering","Scales Of Thought","Magical Biology"],
    "Dark magic"             :    ["Dark influence", "Evil control", "Intimidation", "Demon training", "Blood meditation", "Demon's wealth"],
}