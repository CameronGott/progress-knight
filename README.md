# progress-knight
An incremental game developed by ihtasham42 and extended by Cameron Gott. Link to the game: https://ihtasham42.github.io/progress-knight/

# dev-diary  
7/12/2021  
It's time to move the story forward. It's time to learn how to be a Chairman so skilled, so wise, that that Chairman is worthy of level 1000.  

The Chairman tooltip alludes to the sole pursuit of immortality. Once a character reaches Chairman, their willpower and focus is dedicated towards discovering the mysteries of both magic and biology in order to find, if there is one, a way to enhance one's lifespan.  

The natural course forward is to learn new ways of thinking. Novel pursuits of knowledge that combine existing techniques in creative ways to peel back the layers of the unknown.  
Thus, the way forward to Chairman level 1000, and immortality, is through the Mind. The Mind controls and conducts both Magic and Knowledge, and synthesizes them into entirely new ways of thinking and being.  
 

The potential routes of experimentation are infinite. The questions, limitless. What should a budding Chairman focus on in order to enhance their knowledge of both life and magic?  
In medieval times, biology is limited by the tools of the time. Without microscopes and advanced chemistry, it's almost impossible to fully grasp the concept of cellular life and the underlying mechanisms governing DNA, metabolism, and degradation of biological structures. Magical Engineering is a worthy pursuit for a Chairman looking to use Magic to build the tools of future scientific inquiry.  

Up to this point, a Chairman's experience with Magic is almost entirely on the human scale. A budding apprentice learns to extend the life of a flower. A mage learns to incinerate man, horse, and siege engine. Master Wizards learn to shake the earth and obscure the vision of their human opponents with natural phenomena and magic alike. A Chairman must learn to shift their focus from the scale of humanity to both higher highs and lower lows. A Chairman seeking immortality must investigate the smallest structures of existence, must continue probing deeper and uncovering astounding knowledge and even more astounding questions. Thus Scales of Thought will enhance Mana Control and Chairman experience gain rates by a substantial rate. By probing nature on a deeper level, a Chairman gains unparalleled understanding which influences every magical action pursuit.  

Magical Biology seeks to combine the previous two skills into a direct XP boost to Chairman experience. Through Magical Biology, a Chairman seeks to leverage their new inventions and new frames of thought to directly probe, change, experiment and observe the effects of magic on various cellular structures to enhance their vitality and vigor. Magical Biology is the final step towards immortality.  

Upon reaching Chairman 1000, the Super Immortality skill unlocks. In addition, a new magic job will unlock titled Illustrious Chairman, reflecting your astounding power and wisdom.  
But when you accept this new honorific, you receive a note in the night:  
    "We have followed your progress with great interest. Many have walked this path, but few have used the amulet you now wear to its full potential. But you are not the first to make it this far. Strive on. We will contact you, when the time is right."  

Shifting from lore to code, how do we implement this? Simply add the three skills:  
-Magical Engineering  
-Scales Of Thought  
-Magical Biology  

And a new Job:  
-Illustrious Chairman


*** Changelog ***  
-added three new skills to Mind
-Added one new job to The Arcane Association  

7/2/2021  
Work progresses on Town features. But in the mean time, I added a few goodies to v0.3.  

-added new items to the Farmer job track  
-added new Small Manor property  
-fix for Shop table button heights  

Future:  
-add a new item category "Job aids" or some similar name
-add all job boost items to the new category
-change the updateRequiredRow logic to display these separately from the main generic line of items so that they are uncoupled

6/23/2021  
-Uncoupled Time Warping and Flow effects. Flow will no longer influence the display value of Time Warp under its skill description  
-Uncoupled game architecture element assumptions regarding game speed's influencers and display logic. Should enable easier time manipulation in the future  
    by having to modify fewer functions  
-Refactored getGameSpeed() function into two separate functions, getAllTimeMultipliers() and getGameSpeed().  
-Continued work on town and civilization features on local repo  

6/21/2021  
  
Bug squashing was today's game. The bug in question was making a little bug nest inside the Auto Learn feature, rendering it completely useless and non-functional.  
I'll talk a little bit about my thought process as I hunted down this bug, what I ultimately did to fix it and the tradeoffs considered and lessons learned.  

My initial thought was to look for low-hanging fruit. I skimmed the relevant code by using simple search and tracing the execution paths of all function calls  
that deal with auto learn. This is a little bit tedious and inefficient, but it has an added benefit of building code confidence as this is still a relatively  
new project to me. Specifically, I was looking for simple things like hard-coded loop end indices, hard-coded data structure sizes, anything that would break upon  
the addition of new content. Shoutout to ihtasham42 / badassic, because I didn't find a single obvious poo-poo error. It was time to break out....  

The Debugger!  
As soon as I crack open Chrome's devtools, I see a nice handy 1408 error messages. My first reaction was that I should've maybe started by opening devtools at the outset.  
Ah well, live and learn. So all 1408 error messages were a TypeError inside of one of the functions I had looked at above. The game logic has a section of code that decides which  
skill is next in line for auto learn. Inside of this function is a little snippet that checks whether the skill's requirements have been completed, because obviously we don't want  
our players auto-learning skills they have not unlocked yet.  

Here's the rub. Built into this logic is the core assumption that every skill will have a requirement. When ihtasham was coding this solo project, that was not an unreasonable assumption. But when I came in, forked the project and mashed together my incomplete understanding of ihtasham's architecture and my own ideas of what is reasonable to assume,  
bugs inevitably began to creep in.  

Luckily, once I leveraged my years CS education in finding my own dumb assumptions and killing them, the fix was a simple, yet ugly, two lines of code.  
What I have done today is add a simple logic check to the requirement property. Before requirement completion is checked, we simply check if the variable is null (which it is in the case of skills that have no unlock requirement). If it is null, simply set it to the lowest level requirement in the game, Concentration.  

Now you might be saying, but Cameron! You just inserted your own set of assumptions into the game's architecture! What if Concentration goes away, or gets changed? Your fix will break! Or why didn't you just add a base requirement to any skill that doesn't have one?  

Funnily enough, I agree with both of those qualms. One skill without a requirement is Novel Knowledge, and that is purely because having a requirement was causing me issues in the table rendering process. The game's architecture had a built-in assumption that the first skill in any category would both have a requirement, but unlock immediately. My workaround at the time was to simply not have a requirement for Novel Knowledge, allowing the table section to render nicely. So today's bug is loosely rooted in my previous deviation from some built-in assumptions that were undocumented and non-obvious to a relative newbie like myself.  

As for the assumptions regarding Concentration's continuing status in the game being a core assumption for this fix, my answer for today is: document. I have documented this as a "FRAGILE FIX" in both code comments inside the related source code, and now here in this dev diary. Is it perfect? Heck no. But if someone forks this project or takes over, there is a route to discover the issue with a few more breadcrumbs than I had to work with. For now, I am satisfied with this interim solution.  

6/20/2021  

Shop requirements are, in their current state, a little confusing. Today I'll begin the process of cleaning up and clarifying which item is being displayed in the required row, what  
all the requirements are, and clarifying item tooltips to describe specific effects.  

Changelog:  
-renamed Basic Hand Tools to become Basic Farm Tools  
-reduced first-level job item requirements from job level 20 to job level 10, so that they now unlock at the same time as the higher-tier job and present a choice for the player  
    of whether to promote or continue investing in the current career  
-added Farmer job items  
-removed Concentration requirement for Unusual Insight to fix the header row height issue  
  
6/17/2021  
-add Flow skill to Mind  

6/16/2021  
Initial github.io release.  

*** Changelog ***  
-added two new skills to aid Order progression and magic progression  
-added Trade Psychology skill  
-significantly reduced XP requirements for Order jobs  
-added sassy placeholder tooltips  
-introduced a lot of CSS bugs  

Adding new skills (come on, I shouldn't need to make myself notes by now, right?):  
Add base data and category (if needed)  
Add multipliers  
Add tooltips   
Add requirements (if needed)  
Add header row color  
Fix a million bugs I forgot to document in the midst of release hype  


6/14/2021  
******* Change log *******  
-Added The Order of Discovery
-Added Nobility  

** Adding a new life path **

Today I'll be adding a few new life paths. By life path, I mean a set of related jobs. We have seen Commoner, Military and TAA life paths. 

To add a life path, I'll first be creating the game data for the job categories. This data lives in a couple of different places
within main.js, so we'll need to keep track of all the changes we need to make. 

Step one: add new job data into const jobCategories object
Step two: add individual job data to the const jobBaseData object
Step three: add the unlock requirement, if any, to gameData.requirements.
Step four: add a header row color to const headerRowColors.

At the end of step one, we have a shiny new path named "The Order of Discovery". This will initially be a plain ole job path like we've seen, but it will grow into  
a core method of unlocking further items, skills, and esoteric knowledge to boost all aspects of life. 

All code added. Test time.

Test one results:
Upon page refresh inside of current game, successful render. Successful requirement behavior.
I forgot tooltips... :D
Other than tooltips and general balancing, everything is working well. Will probably focus balancing efforts on the related skills tree.  

Added nobility, tested changes, and now there are UI rendering errors. So what specifically is broken?  
Every item, skill, and job is unlocked. Every entity is displaying. I'm guessing the requirements got messed up when adding requirements for nobility, so let's take a look.  
Commented out nobility requirements, rerendered page, did not fix UI issue. 
Found a typo in jobBaseData for emperor of mankind. Fixed typo, saved file, refreshed game page. Numbers in UI elements are rendering correctly, but every entity is still displaying in defiance of requirements. Quick display element values are not displaying properly. Try hard reset. Did not fix. Game will not move forward, increment time, etc.  

New strategy: comment out all changes due to nobility. Re-enable changes incrementally to track down issue. 
All nobility code removed. Game function restored. 
Found another typo in requirements. Fixed typo. Uncommented nobility code. Refreshed game page.  
All function restored.  
F-ing typos, man. 


6/11/2021  

I'm satisfied with my mastery of adding items. While I do enjoy thinking up new tooltips and new story directions to explain new items, it's getting a bit tedious.  
A new feature is badly needed, and the empty navbar space is calling my name. Right now, there are two main features I'm fairly certain I want to add.

Society is the first feature. I've always imagined rebirths in this game preserving the forward flow of time. And while it's fun to fantasize about the personal growth of 
my individual character over the centuries and millenia, I've always wondered what's going on outside. How does society grow or decay with my actions? I always imagine the second 
rebirth as embracing evil in the form of destroying my entire nation. Upon rebirth, I'm starting in a refugee camp made up of scattered tents and ragged survivors of my previous destruction. So I want a feature that reflects the growth and decay of society, a feature that lets the player use their newfound power, skills, and ridiculous wealth to shape the world around them.  

War. Hard to read the military career tooltips without imagining massive battles and endless carnage. Another new tab will be devoted to fleshing out this mechanic. It'll provide an area to see your hard-earned Battle Tactics at work.  

******* Change log *******  
-Added Small Shop to Merchant item unlock sequence
-Rewrote Pack Horse tooltip to add detail and improve sentence flow  
-Added Weapon Outlet to Merchant item unlock sequence  
-
6/10/2021  

Requirements are important to learn for a few reasons. Requirements help pace the game's unlocks. Requirements help manage UI clutter by hiding
items, skills, and jobs until they are achievable. 

The Requirement base class has three member variables: elements, requirements, and boolean isCompleted.  
Requirement has two functions right now: constructor, and isCompleted().

The "elements" member variable is used to hold references to all HTML elements with a certain class. For example, when a requirement for unlocking The Arcane Association is
declared, the elements member variable contains the result of calling getElementsByClass("The Arcane Association"). These elements are used to update the UI, as the UI will change as requirements are met and thus new elements need to be added to the DOM, classes like "hiddenTask" need to be removed, etc.  

The subclasses of Requirement mainly differ in their use of the requirements member variable. See main.js gameData.requirements declaration for example usage.  

New additions:
Crappy Anvil (with TaskRequirement instead of CoinRequirement)  
Cheap Hand Tools now unlock at Farmer level 20  
Cheap Fishing Rod now unlocks at Fisherman level 20  
All other job items now unlock at job levels instead of savings level.  
Added Pack Horse to Merchant item sequence.  


6/8/2021  
The shop expansion initiative continues with today's new item: Miner's Lantern!  
Mining in a dark, dank cave is scary, dangerous, and slow. Lanterns provide useful light to guide a miner's search  
for precious metals, but beware of carrying a flame into any potential gas pockets!  

There is a weird programmatic behavior with item displays. An item only displays if it's description is a certain specific string.  
E.g. an item with description "Job xp" will display just fine, while a custom description like "Easier mining" for the Miner's Lantern  
will result in the item row not displaying in the shop. Probably fixable by going into the row display function and changing the logic  
that relies on the descriptions to decide where to render each row. I could add a separate parameter to designate an item as needing to render  
into the shop tab. Something to ponder for now.  

Otherwise, the Miner's Lantern is functional. 
6/7/2021

Added Cheap Fishing Rod to the shop. Will likely need further balance testing.   
Thought: create a chain of better job specific items linked to job level. Eg. Miner level 100 gets access to some sweet income-boosting gear.

6/4/2021  
Entry one:  

Adding an item today.  
Step one: add the item data to const itemBaseData.   
Step two: Add Rag Clothing to the Misc itemCategories object.  
Step three: Add placeholder tooltip text.  
Step four: add item requirement.  
Step five: add code to addMultipliers() to apply effect
Testing time! 
Holy shit, it worked on the first try. I feel somewhat...competent. (That's gonna bite me in the ass later.)  
Knew it. Item displays properly, but doesn't update the xp / day.
Fix: needed to add a line of code to the addMultipliers() function. Seems obvious in retrospect haha. Luckily it took four minutes to fix. Yay!
Also rearranged the display order of items for Rag Clothing to pop up before Book.  

First item added. First mod complete. Feels good mayne. 
PS. Also added a dev mode to the code with a single-variable trigger to influence a few skill modifiers and the game speed. 
Should help test long runs. 

Entry two:

After playing around with the added rag clothing, I feel like there is an impending balance issue. The more items I add, the more expense. But if items don't
directly affect income, the scaling of income is such that most items will be unaffordable in their current tier (eg beggar items can't all be purchased like a real beggar would
while they are climbing out of poverty.) There are a few ways to address this. First, there is already a built-in income modifying mechanic with skills. Just as Strength modifies military income, perhaps we could add a skill such as Performance or Acting to modify Beggar income. One potential difficulty of this is narrowing the income modifier to a single role instead of an entire job category, as Strength makes every military job pay more whereas we may want Acting/Performance to solely modify begging. Dunno. Could see it going either way from a lore / story perspective, as a blacksmith or merchant may earn more money from being more entertaining / persuasive. Maybe the skill could be named Persuasion instead to be lore friendly and minimize code restructuring.  

One hour later...  
Nevermind, I found a workaround to make items directly affect job income. Basic Hand Tools are the template to follow (just apply the effect as a task.incomeMultiplier in addMultipliers()).  

6/3/2021  
I want to flesh out the beggar job by adding interesting items and story content. Being a beggar is tough work,
and the more the player feels the hardship of begging the more they will appreciate the achievement of moving up in society.
My first step is to add an item. This is simple enough to not be daunting on Day Two of this project, but complex enough to touch most
major game systems and get me acquainted with the layout and architecture of the game logic. Story-wise, I'm playing around with the idea of 
item series. To progress as a beggar, one may strive for better clothing, better food, better physical appearance, etc. Perhaps the first few items could be
basic neccessities, like rag clothing, a source of drinking water, or other crucial things most idle players take for granted!   

Item One: Tattered Clothes
Where do items present themselves throughout the codebase?  
Around line 214 we see:
    <div class="tab" id="shop">
        <table id="itemTable" class="w3-table w3-bordered">
        </table>
    </div>
so using the HTML templates that live just above the itemTable, it looks like the table is built within main.js and injected 
into this containing div with id="shop". Kinda reminds me of React, but ihtasham did it himself. Sidenote, porting this to React would probably
be a good future task. Lots of render calls would be reduced as well. Anyways, back to items...  
I see where items will end up on the HTML side of things, so now it's time to dive into classes.js and take a look at the class hierarchy.  
Item is a single-level class. Item objects have three basic methods: getEffect, getEffectDescription, and getExpense. getEffect  
refers to the item's numerical power level (1, 1.5, 2.221, etc). getEffectDescription builds a string to display the effect data for the UI.  
Lastly, getExpense calculates the item cost based off of global expense modifiers, as changed by Bargaining and Evil skills. Simple enough.  
Now let's take a look at how items are used in main.js  

Item base stats are contained in the constant object itemBaseData defined near the top of main.js  
Items are defined as a key:value pair string:{object} where object holds item properties name, expense, and effect.  
A little further down we have another constant object itemCategories. This splits all items into two categories, living spaces and actual items (defined as "Properties" and "Misc" respectively. Using "Properties" as a name confused me for a second, and "misc" seems like a subcategory of item rather than a good descriptor of all items. Will need to think of clearer names down the road.). I'm assuming this is used for the different treatment of items further down the file. Wonder why ihtasham didn't split the concepts into their own classes and extend a base class with much of the core functionality. Might be something to look into if I'm hunting for things to refactor. Anyways, back to items...  

Item tooltips are also stored in a const object named tooltips.  
addMultipliers is used to apply all item and job multipliers.
function createRow() displays all of Jobs, Skills, and Items by building their row content. This will be important.  
function updateItemRows()  
function createItemData() seems to assume if an item contains a "happiness" property, it must be a "Property" like house. This means any item I want to add that'll affect  
happiness will likely require a rewrite of this function.   



6/2/2021  
Cloned repo, configured Git, got a copy of the game running on my local machine. Woo!
One hour later...
Doh! For some reason, the sidebar's progress bars are not displaying.
I have made zero code changes so far. Time to investigate...
Using Chrome's Devtools, I see that the span containing the progress bars (quickTaskDisplay) has a class of "hidden".
Oh weird. So I went to ihtasham42's github.io version, and the quick dislay is indeed intended to be hidden. Literally never noticed this behavior before.
Not sure how I feel about this. May modify in later versions to display immediately, as it's pretty convenient. Design-wise, idle games always benefit from
visible progress bars on startup. (this may be a rare opinion. Who knows.)
