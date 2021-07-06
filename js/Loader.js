
function include(file) {
  
    var script  = document.createElement('script');
    script.src  = file;
    script.type = 'text/javascript';
    script.defer = true;
    
    document.getElementsByTagName('head').item(0).appendChild(script);
    
  }

include('./js/Data/GameData.js');
include('./js/Data/ItemData.js');
include('./js/Data/JobData.js');
include('./js/Data/TooltipData.js');
include('./js/Data/SkillData.js');
include('./js/HackTimer.js');
include('./js/Classes.js');
include('./js/main.js');