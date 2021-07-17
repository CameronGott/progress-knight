const itemBaseData = {
    "Homeless": {name: "Homeless", expense: 0, effect: 1},
    "Tent": {name: "Tent", expense: 15, effect: 1.4},
    "Wooden hut": {name: "Wooden hut", expense: 100, effect: 2},
    "Cottage": {name: "Cottage", expense: 750, effect: 3.5},
    "House": {name: "House", expense: 3000, effect: 6},
    "Large house": {name: "Large house", expense: 25000, effect: 12},
    "Small Manor": {name: "Small Manor", expense: 300000, effect: 25},
    "Small palace": {name: "Small palace", expense: 5000000, effect: 60},
    "Grand palace": {name: "Grand palace", expense: 100000000, effect: 135},

    //Cameron's first addition: rag clothing. Woohoo!
    "Rag Clothing": {name: "Rag Clothing", expense: 3, effect: 1.5, description: "Skill xp"},
    "Book": {name: "Book", expense: 10, effect: 1.5, description: "Skill xp"},
    "Basic Farm Tools": {name: "Basic Farm Tools", expense: 10, effect: 1.5, description: "Farm upgrade"},
    "Dumbbells": {name: "Dumbbells", expense: 50, effect: 1.5, description: "Strength xp"},
    "Personal squire": {name: "Personal squire", expense: 200, effect: 2, description: "Job xp"},
    "Steel longsword": {name: "Steel longsword", expense: 1000, effect: 2, description: "Military xp"},
    "Butler": {name: "Butler", expense: 7500, effect: 1.5, description: "Happiness"},
    "Sapphire charm": {name: "Sapphire charm", expense: 50000, effect: 3, description: "Magic xp"},
    "Study desk": {name: "Study desk", expense: 1000000, effect: 2, description: "Skill xp"},
    "Library": {name: "Library", expense: 10000000, effect: 1.5, description: "Skill xp"},

    
    "Small Field": {name: "Small Field", expense: 130, effect: 5.0, description: "Farm upgrade"},
    "Ox-driven Plow": {name: "Ox-driven Plow", expense: 200, effect: 2.4, description: "Farm upgrade"},
    "Livestock-derived Fertilizer": {name: "Livestock-derived Fertilizer", expense: 20, effect: 1.2, description: "Farm upgrade"},
    "Cheap Fishing Rod": {name: "Cheap Fishing Rod", expense: 20, effect: 2.0, description: "Fishing upgrade"},
    "Miner's Lantern": {name: "Miner's Lantern", expense: 35, effect: 1.5, description: "Mining upgrade"},
    "Crappy Anvil": {name: "Crappy Anvil", expense: 50, effect: 1.5, description: "Blacksmith upgrade"},
    "Pack Horse": {name: "Pack Horse", expense: 80, effect: 3.0, description: "Merchant upgrade"},
    "Small Shop": {name: "Small Shop", expense: 600, effect: 1.5, description: "Merchant upgrade"},
    "Weapon Outlet": {name: "Weapon Outlet", expense: 3000, effect: 3.0, description: "Merchant upgrade"},
}

const itemCategories = {
    "Properties": ["Homeless", "Tent", "Wooden hut", "Cottage", "House", "Large house", "Small Manor", "Small palace", "Grand palace"],
    "Job Tools": ["Basic Farm Tools", "Small Field", "Ox-driven Plow", "Livestock-derived Fertilizer", "Cheap Fishing Rod", "Miner's Lantern", "Crappy Anvil", "Pack Horse", "Small Shop",
    "Weapon Outlet",],
    "Misc": ["Rag Clothing", "Book", "Dumbbells",  "Personal squire", 
                "Steel longsword", "Butler", "Sapphire charm", "Study desk", "Library"],

}