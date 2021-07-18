const jobBaseData = {
    "Beggar": {name: "Beggar", maxXp: 50, income: 5},
    "Farmer": {name: "Farmer", maxXp: 100, income: 9},
    "Fisherman": {name: "Fisherman", maxXp: 200, income: 15},
    "Miner": {name: "Miner", maxXp: 400, income: 40},
    "Blacksmith": {name: "Blacksmith", maxXp: 800, income: 80},
    "Merchant": {name: "Merchant", maxXp: 1600, income: 150},

    "Squire": {name: "Squire", maxXp: 100, income: 5},
    "Footman": {name: "Footman", maxXp: 1000, income: 50},
    "Veteran footman": {name: "Veteran footman", maxXp: 10000, income: 120},
    "Knight": {name: "Knight", maxXp: 100000, income: 300},
    "Veteran knight": {name: "Veteran knight", maxXp: 1000000, income: 1000},
    "Elite knight": {name: "Elite knight", maxXp: 7500000, income: 3000},
    "Holy knight": {name: "Holy knight", maxXp: 40000000, income: 15000},
    "Legendary knight": {name: "Legendary knight", maxXp: 150000000, income: 50000},

    "Student": {name: "Student", maxXp: 100000, income: 100},
    "Apprentice mage": {name: "Apprentice mage", maxXp: 1000000, income: 1000},
    "Mage": {name: "Mage", maxXp: 10000000, income: 7500},
    "Wizard": {name: "Wizard", maxXp: 100000000, income: 50000},
    "Master wizard": {name: "Master wizard", maxXp: 10000000000, income: 250000},
    "Chairman": {name: "Chairman", maxXp: 1000000000000, income: 1000000},
    "Illustrious Chairman": {name: "Illustrious Chairman", maxXp: 7000000000000, income: 1500000},

    "Junior Caretaker": {name: "Junior Caretaker", maxXp: 100000, income: 15},
    "Lead Caretaker": {name: "Lead Caretaker", maxXp: 1000000, income: 115}, 
    "Freshman": {name: "Freshman", maxXp: 2000000, income: 250}, 
    "Sophomore": {name: "Sophomore", maxXp: 4000000, income: 500}, 
    "Junior": {name: "Junior", maxXp: 16000000, income: 1000}, 
    "Senior": {name: "Senior", maxXp: 64000000, income: 2000}, 
    "Probation": {name: "Probation", maxXp: 300000000, income: 12000},

    "Baronet": {name: "Baronet", maxXp: 7500000, income: 3500},
    "Baron": {name: "Baron", maxXp: 40000000, income: 4500},
    "Vice Count": {name: "Vice Count", maxXp: 160000000, income: 6000},
    "Count": {name: "Count", maxXp: 640000000, income: 8000},
    "Duke": {name: "Duke", maxXp: 2400000000, income: 25000},
    "Grand Duke": {name: "Grand Duke", maxXp: 9600000000, income: 40000},
    "Arch Duke": {name: "Arch Duke", maxXp: 40000000000, income: 55000},
    "Lord": {name: "Lord", maxXp: 160000000000, income: 150000},
    "High Lord": {name: "High Lord", maxXp: 160000000000000, income: 300000},
    "King": {name: "King", maxXp: 160000000000000, income: 300000},
    "High King": {name: "High King", maxXp: 160000000000000, income: 1200000},
    "Emperor of Mankind": {name: "Emperor of Mankind", maxXp: 160000000000000, income: 2500000},
}

const jobCategories = {
    "Common work"            :    ["Beggar", "Farmer", "Fisherman", "Miner", "Blacksmith", "Merchant"],
    "Military"               :    ["Squire", "Footman", "Veteran footman", "Knight", "Veteran knight", "Elite knight", "Holy knight", "Legendary knight"],
    "The Arcane Association" :    ["Student", "Apprentice mage", "Mage", "Wizard", "Master wizard", "Chairman", "Illustrious Chairman"],
    "The Order of Discovery" :    ["Junior Caretaker", "Lead Caretaker", "Freshman", "Sophomore", "Junior", "Senior", "Probation"],
    "Nobility"               :    ["Baronet", "Baron", "Vice Count", "Count", "Duke", "Grand Duke", "Arch Duke", "Lord", "High Lord", "King", "High King", "Emperor of Mankind"]
}