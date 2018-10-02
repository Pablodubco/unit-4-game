//Html buttons
var btnSelectChar = $("#btnSelectChar");
var btnReroll = $("#btnReroll");
var btnBegin = $("#btnBegin");
var btnReselect = $("#btnReselect");
var btnRestart = $("#btnRestart");
var btnPlayAdvanced = $("#btnPlayAdvanced");
var btnPlayBasic = $("#btnPlayBasic");

//HTML elements updated in the game with child display elements
var rowDivCharSelect = $("#rowDivCharSelect");  //Bootstrap v4 row <div> that will contain the selected character's selection portraits.
var rowDivCharInfo = $("#rowDivCharInfo");      //Bootstrap v4 row <div> that will contain the selected character's info profile, bio, and stats.
var rowDivCharSkills = $("#rowDivCharSkills");  //Bootstrap v4 row <div> that will contain the selected character's skills.
var colDivCharFight = $("#colDivCharFight");    //Bootstrap v4 column <div> that will contain the selected character's profile pic and hit points for battle
var colDivCharBuff = $("#colDivCharBuff");      //Bootstrap v4 column <div> that will contain the selected character's buffs applied during battle.
var rowDivOppSelect = $("#rowDivOppSelect");    //Bootstrap v4 row <div> that will contain the opponent selection portraits.
var rowDivOppInfo = $("#rowDivOppInfo");        //Bootstrap v4 row <div> that will contain the opponent info profile, bio, and stats.
var rowDivOppSkills = $("#rowDivOppSkills");    //Bootstrap v4 row <div> that will contain the selected opponent's skills.
var colDivOppFight = $("#colDivOppFight");      //Bootstrap v4 column <div> that will contain opponent battle area
var colDivOppBuff = $("#colDivOppBuff");        //Bootstrap v4 column <div> that will contain the opponent Buff area
var rowDivSkill = $("#skills");                 //Bootstrap v4 row <div> that will contain the skill buttons for the player.
var colDivBattlelog = $("#battlelog");          //Bootstrap v4 column <div> that will be updated with the battle messages each turn.

//Classes and settings for dynamic HTML elements.

//=================================== TRIGGERS TO BEGIN RUNNING THE CODE =======================================//
window.onload = function(){
    if (navigator.userAgent.match(/Chrome|AppleWebKit/)) { //Jump the window view to the character selection screen
        window.location.href = "#mainHeaderTextTop";
    } else {
        window.location.hash = "mainHeaderTextTop";
    }

    btnPlayBasic.on("click",function(){         //Begin basic game
        RPGBattle.mGameModeStart("basic");
    });

    btnPlayAdvanced.on("click",function(){      //Begin advanced game
        RPGBattle.mGameModeStart("advanced");
    });
}

//=================================== Game Object Code =======================================//
var RPGBattle = {
//===============================================================================//
//------------------General game settings and parameters------------------------//
//============================================================================//
    //Game flow variables and settings------------------------------
    
    intGameCharacters: 4,               //Number of characters per game (html is currently configured for 4 characters, but responsive, at least for multiples of 2).
    intGameCharLevelStatGain: 15,       //Number of BASE stat points gained per character on level up
    intGameCharLevelGain: 1,            //How many levels the characters earn after every battle
    intMinimumDamage: 1,                //The minimum possible damage dealt.
    intGameHPRecover: 1,                //For advanced game. Recover this % of HP lost, at the start of each battle.
    boolGameCharResetCooldown: false,   //For the player. If "true", the skill cooldowns and charge times are reset at the start of every battle, otherwise, they are mantained between battles.
    boolGameOpponentLevelUP: true,      //Indicates wether undefeated opponents level up with the player.
    boolGameCharStartLevel: false,      //If true, selected player character always begins the game at level 0. If false, takes the value specified in the character object property intCharStartLevel    
//=====================================================================//
//------------------Display elements settings------------------------//
//=================================================================//
//General stat display settings------------------------------------
    strWinGame:'<span style="color:cyan;font-weight:bold">Congratulations!!! You have cleared the game!</span> Press restart or select game mode to play again.',   //Game victory message (all opponents defeated). Supports HTML tags.
    strLose:'<span style="color:red">GAME OVER</span> Press restart or select game mode to play again.',                                                            //Game over message (player character died). Supports HTML tags
    strTooltipHP: "Hit Points: reduced every time the character takes damage. Defeated if they reach 0.",
    strTooltipAttackAdvanced: "Attack: increases damage dealt with regular attacks and weapon skills.",
    strTooltipCounterAdvanced: "Counter: increases damage dealt back to attackers after every move.",
    strTooltipDefenseAdvanced: "Defense: reduces damage taken from regular attacks and weapon skills.",
    strTooltipForceAttackAdvanced: "Force Attack: increases damage dealt with Force skills.",
    strTooltipForceDefenseAdvanced: "Force Defense: reduces damage taken from Force skills.",
    strTooltipSpeedAdvanced: "Speed: how soon the character acts in battle, and gives a chance to score an additional attack at 70% power after every move.",
    strTooltipAttackBasic: "Only Player. Every time the character attacks, the damage dealt is increased by this amount.",
    strTooltipCounterBasic: "Only Opponents. Every time the player attacks this character, receives this amount of damage back.",
    strShortHP: "HP",               //Short 3-5 length name for the HP stat for stat bars and buff tooltips.
    strShortAttack: "Att",          //Short 3-5 length name for the Attack stat for stat bars and buff tooltips.
    strShortCounter: "Ctr",         //Short 3-5 length name for the Counter stat for stat bars and buff tooltips.
    strShortDefense: "Def",         //Short 3-5 length name for the Defense stat for stat bars and buff tooltips.
    strShortForceAttack: "F Att",   //Short 3-5 length name for the Force Attack stat for stat bars and buff tooltips.
    strShortForceDefense: "F Def",  //Short 3-5 length name for the Force Defense stat for stat bars and buff tooltips.
    strShortSpeed: "Spd",           //Short 3-5 length name for the Force Speed stat for stat bars and buff tooltips.
//Style settings for character portraits
    strPortraitContainer: "col-lg-3 col-6 h-100",          // Bootstrap v4 column classes for the container that holds a character portrait card. 
    strPortraitCard: "card h-75 bg-dark udClickable",      // Classes for the card that holds the portrait image.
    strPickerHighlight: "border: solid rgb(0, 223, 223)",  // Style used to highlight the portrait when selected.
//Style settings for bio profiles
    strBioColClass: "col-lg-6 col-12",                      // Bootstrap v4 column classes for the bio profile container.
    strBioImgClass: "card-img-top rounded",                 //Classes for the bio profile image
    strBioTextClass: "text-white text-justify udCharBio",   //Classes for the bio profile text
//Style settings for stat bars in character profile
    strInfoColclass:"col-lg-6 col-12",                                  //Bootstrap v4 column classes for holding the card div
    strInfoCardclass:"mx-auto bg-dark",                                 //Style classes for the card div
    strCardTitleclass:"text-center",                                    //Style classes for styling card title that has with character name
    strDivProgressclass:"bg-secondary",                                 //Style classes for the div that holds stat bars (the "unfilled" section of stat bars)
    strProgressBarclass:"progress-bar-striped progress-bar-animated",   //Classes for the stat bars style.
    strSpanProgressBarText: "udStatText text-left w-100 mx-1",          // Style of the span that holds text inside progress bars.
    strBarColorHP:"bg-danger",                                          //Color class of stat bar for HP
    strBarColorAttack:"bg-warning",                                     //Color class of stat bar for Attack
    strBarColorCounter:"bg-warning",                                    //Color class of stat bar for Counter Attack
    strBarColorDefense:"bg-warning",                                    //Color class of stat bar for Defense
    strBarColorFAttack:"bg-info",                                       //Color class of stat bar for Force Attack
    strBarColorFDefense:"bg-info",                                      //Color class of stat bar for Force Defense
    strBarColorSpeed:"bg-success",                                      //Color class of stat bar for Speed
//Style settings for battle portraits and HP bar.
    strCardBattle:"bg-dark mx-auto udBattleCard",                           //Classes for the Bootstrap 4 card that holds the battle pic and in-battle HP bar
    strDivBarBattle: "bg-dark",                                             //Classes for the in-battle HP bar container (the "unfilled" portion of the bar)
    strBarBattleHP: "progress-bar-striped progress-bar-animated bg-danger", //Classes for the in-battle HP bar
    strSpanBarBattleText: "text-white text-center w-100 udHPtext",          //Classes for the in-batlle HP bar text
//Style settings for skill info cards
    strSkInfoDivClass: "col-md-4 col-6 my-1 mx-0 align-self-center",            //Bootsrap v4 column classes for the div that contains skill info
    strSkInfoNameClass: "text-center my-0 mx-1 udSkillInfoHeader",              //Classes for the skill header name inside the skill info
    strSkInfoTextClass: "udSkillText text-white text-center my-0 mx-1 bg-dark", //Classes for the skill text with required level and charge times inside the skill info
//Style settings for skill buttons
    strSkBtnDivClass: "col-sm-4 col-6",     //Bootstrap v4 column classes for the div container that will hold skill buttons
    strSkBtnClass: "mx-auto w-100 h-75",    //Classes for the skill button
//Style settings for buffs
    strBuffIconUp: "fa fa-angle-up",                //Icon class for a buff that raises 1 stat
    strBuffIconUpUp: "fa fa-angle-double-up",       //Icon class for a buff that raises 2 stats
    strBuffIconUpDown: "fa fa-sort",                //Icon class for a buff that raises 1 stats and lowers the other
    strBuffIconDown:"fa fa-angle-down",             //Icon class for a buff that lowers 1 stat
    strBuffIconDownDown: "fa fa-angle-double-down", //Icon class for a buff that lowers 2 stats
    strBuffIconDamage: "fa fa-crosshairs",          //Icon class for a buff that deals damage
    strBuffIconSpecial: "fa fa-bullseye",           //Icon class for an undefined buff
//Style settings for battle log
    strBattleLogClass: "text-white py-0 udBattleMessage", //Classes for the battle log text
//===================================================================//
//-------------------Stats and skills settings---------------------//
//===============================================================//
    intStatHPMult: 27,                       //Base stat multiplier for HP (advanced game)
    intStatHPMultBasic: 55,                  //Base stat multiplier for HP (basic game)
    intStatAttackMult: 3,                    //Base stat multiplier for Attack (advanced game)
    intStatCounterMult: 2.5,                 //Base stat multiplier for Counter Attack (advanced game) 
    intStatDefenseMult: 2,                   //Base stat multiplier for Defense (advanced game)
    intStatForceAttackMult: 3,               //Base stat multiplier for Force Attack (advanced game)
    intStatForceDefenseMult: 2,              //Base stat multiplier for Force Defense (advanced game)
    intStatSpeedMult: 3,                     //Base stat multiplier for Speed (advanced game)
    floatFollowAttackChanceMod: 0.1,         //Affects the chance to score an additional attack depending on the difference between Speed stats. If both Speed values are the same, this is the default chance.
    arDmgTypeAttackProp: ["weapon","force"],                        //Array of damage type properties for skills.
    arDmgTypeDefenseProp: ["intCurrDefense","intCurrForceDefense"], //Array of character defensive stats for each damage type.
//======================================================================//
//------------------In-game dynamic properties------------------------//
//==================================================================//
//Changing these does nothing, since they are dynamic tools that get overwritten once the game begins
    boolAdvancedGame: false,    // True when the advanced game was selected.
    boolCharSelected: false,    // True when the player character was selected.
    boolOppSelected: false,     // True when the opponent was selected.
    boolBattleBegan: false,     // True when the first battle is started.
    boolBattleInProgress: false,// True when any battle is started.
    arGameCharacters: [],   //Temporary characters for current game.
    intCharIndex: 0,        //Index of the selected player character within arGameCharacters.
    arCharSkills: [],       //Skills array of the player character for the current battle.
    arCharBuffs: [],        //Buffs array of the player character.
    intOppIndex: 0,         //Index of the selected opponent within arGameCharacters.
    arOppSkills: [],        //Skills array of the opponent for the current battle.
    arOppBuffs: [],         //Buffs array of the opponent for the current battle.
    boolBattleNomove: false,    //For skill special effect "nomove". Makes the target skip it's turn.
    boolBattleNocounter: false, //For skill special effect "nocounter". Makes the target skip it's counter.
    boolBattleNodefense: false, //For skill special effect "nodefense". Ignores target's defense.
    intBattleTurnCount: 0,      //Keeps track of the number of turns per game.
    arCharSkillsCooldown:[],    //Stores skills cooldowns for cross-battle use
//_________________________________________Starting Objects Collections_______________________________________
//Characters Collection-------------------------------------------BEGIN
    arCharacters: [
        {
        strName: "Anakin",
        intCharStartLevel: 0,
        intCharLevel:0,
        intBaseHP: 8, intBaseAttack: 6, intBaseCounter: 4, intBaseDefense: 2, intBaseForceAttack: 4, intBaseForceDefense: 1, intBaseSpeed: 5,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intCurrHP: 0, intCurrAttack: 0, intCurrCounter: 0, intCurrDefense: 0, intCurrForceAttack: 0, intCurrForceDefense: 0, intCurrSpeed: 0,
        strDescription: "<span style='color:cyan'>Anakin Skywalker</span> The youngest Jedi Knight to ever attain such rank. An offensive powerhouse, deadly with a lightsaber, and capable of drawing power from both sides of the Force. His recklessness makes him vulnerable to all kinds of attacks.",
        strDescriptionBasic: "<span style='color:cyan'>Anakin Skywalker</span> The youngest Jedi Knight to ever attain such rank. Anakin was a slave at Tatooine when discovered by Qui Gon Jinn and Obi Wan Kenobi, who later became his master. Rumored to be the one who would bring balance to The Force.",
        strImgPortrait: "assets/images/CharSelect_Anakin.jpg",
        strImgProfile: "assets/images/Portrait_Anakin.jpg",
        strImgBattle: "assets/images/Portrait_Anakin.jpg",
        strDefaultSkill: "Attack", //Default attack skill.
        strDefaultCounter: "CounterAttack", //Default counter skill. Triggered after the rival makes a move, unless prevented by an effect.
        strDefaultFollow: "FollowAttack", //Default follow-up attack. Triggered at random with a % chance depending on speed difference.
        arSkills:["PowerSlash","Rage","ForcePush","Choke","Finisher"], //Contains special skills learnt upon level up.
        arSkillLevels: [0,1,1,2,2] //Contains level breaks for learning each successive skill. Must match arSkills indexes.
        },
        {
        strName: "Ahsoka",
        intCharStartLevel: 0,
        intCharLevel:0,
        intBaseHP: 6, intBaseAttack: 4, intBaseCounter: 6, intBaseDefense: 2, intBaseForceAttack: 4, intBaseForceDefense: 2, intBaseSpeed: 6,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intCurrHP: 0, intCurrAttack: 0, intCurrCounter: 0, intCurrDefense: 0, intCurrForceAttack: 0, intCurrForceDefense: 0, intCurrSpeed: 0,
        strDescription: "<span style='color:cyan'>Ahsoka Tano</span> A skilled Jedi Knight and Commander in the Grand Army of the Republic. Trained in the ways of the Jedi by Anakin. Makes up for her low deffensive power with high speed to boost her attacks.",
        strDescriptionBasic: "<span style='color:cyan'>Ahsoka Tano</span> A skilled Jedi Knight and Commander in the Grand Army of the Republic. Trained in the ways of the Jedi by Anakin. Low HP but high attack and counter damage.",
        strImgPortrait: "assets/images/CharSelect_Ahsoka.jpg",
        strImgProfile: "assets/images/Portrait_Ahsoka.jpg",
        strImgBattle: "assets/images/Portrait_Ahsoka.jpg",
        strDefaultSkill: "Attack", //Default attack skill.
        strDefaultCounter: "CounterAttack", //Default counter skill. Triggered after the rival makes a move, unless prevented by an effect.
        strDefaultFollow: "FollowAttack", //Default follow-up attack. Triggered at random with a % chance depending on speed difference.
        arSkills:["Rush","Pursuit","ForceSpeed","Jump","Retaliate"], //Contains special skills learnt upon level up.
        arSkillLevels: [0,1,1,2,2] //Contains level breaks for learning each successive skill. Must match arSkills indexes.
        },
        {
        strName: "Obi Wan",
        intCharStartLevel: 0,
        intCharLevel:0,
        intBaseHP: 7, intBaseAttack: 5, intBaseCounter: 4, intBaseDefense: 4, intBaseForceAttack: 4, intBaseForceDefense: 2, intBaseSpeed: 4,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intCurrHP: 0, intCurrAttack: 0, intCurrCounter: 0, intCurrDefense: 0, intCurrForceAttack: 0, intCurrForceDefense: 0, intCurrSpeed: 0,
        strDescription: "<span style='color:cyan'>Obi Wan Kenobi</span> Jedi Master and member of the Jedi Council. Adept at using the Light Side of the Force and fighting with a lightsaber. A well balanced charcter that relies on skill to outsmart his opponents.",
        strDescriptionBasic: "<span style='color:cyan'>Obi Wan Kenobi</span> Jedi Master and member of the Jedi Council. At the request of his dying master, Qui Gon Jinn, Obi Wan mentored Anakin on the ways of the Force. A well balanced character.",
        strImgPortrait: "assets/images/CharSelect_ObiWan.jpg",
        strImgProfile: "assets/images/Portrait_ObiWan.jpg",
        strImgBattle: "assets/images/Portrait_ObiWan.jpg",
        strDefaultSkill: "Attack", //Default attack skill.
        strDefaultCounter: "CounterAttack", //Default counter skill. Triggered after the rival makes a move, unless prevented by an effect.
        strDefaultFollow: "FollowAttack", //Default follow-up attack. Triggered at random with a % chance depending on speed difference.
        arSkills:["FeintAttack","HighGround","ThrowSaber","ForceShield","MindTrick"], //Contains special skills learnt upon level up.
        arSkillLevels: [0,1,1,2,2] //Contains level breaks for learning each successive skill. Must match arSkills indexes.
        },
        {
        strName: "Master Yoda",
        intCharStartLevel: 0,
        intCharLevel:0,
        intBaseHP: 5, intBaseAttack: 4, intBaseCounter: 5, intBaseDefense: 2, intBaseForceAttack: 6, intBaseForceDefense: 3, intBaseSpeed: 5,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intCurrHP: 0, intCurrAttack: 0, intCurrCounter: 0, intCurrDefense: 0, intCurrForceAttack: 0, intCurrForceDefense: 0, intCurrSpeed: 0,
        strDescription: "<span style='color:cyan'>Master Yoda</span> Grand Master of the Jedi Order and high seat at the Jedi Council. Small and frail, but his high speed and powerful control of the Light Side of the Force make him a crafty opponent that refuses to go down.",
        strDescriptionBasic: "<span style='color:cyan'>Master Yoda</span> Grand Master of the Jedi Order and high seat at the Jedi Council. For over eight-hundred years he mentored others in the ways of the Force. Small and frail with an overwhelming attack.",
        strImgPortrait: "assets/images/CharSelect_Yoda.jpg",
        strImgProfile: "assets/images/Portrait_Yoda.jpg",
        strImgBattle: "assets/images/Portrait_Yoda.jpg",
        strDefaultSkill: "Attack", //Default attack skill.
        strDefaultCounter: "CounterAttack", //Default counter skill. Triggered after the rival makes a move, unless prevented by an effect.
        strDefaultFollow: "FollowAttack", //Default follow-up attack. Triggered at random with a % chance depending on speed difference.
        arSkills:["Heal","ShockWave","ThrowSaber","Sense","Longevity"], //Contains special skills learnt upon level up.
        arSkillLevels: [0,1,1,2,2] //Contains level breaks for learning each successive skill. Must match arSkills indexes.
        },
        {
        strName: "Ventress",
        intCharStartLevel: 0,
        intCharLevel:0,
        intBaseHP: 6, intBaseAttack: 5, intBaseCounter: 5, intBaseDefense: 2, intBaseForceAttack: 5, intBaseForceDefense: 2, intBaseSpeed: 5,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intCurrHP: 0, intCurrAttack: 0, intCurrCounter: 0, intCurrDefense: 0, intCurrForceAttack: 0, intCurrForceDefense: 0, intCurrSpeed: 0,
        strDescription: "<span style='color:cyan'>Asajj Ventress</span> A Sith assassin, renowned for her cruelty and skill with dual lightsabers. Decent attack, speed, and effective against enemies with high defense or HP, but lacking in defensive skills.",
        strDescriptionBasic: "<span style='color:cyan'>Asajj Ventress</span> At various points throughout her life she was a slave, a Jedi Padawan, a bounty hunter, and now an assassin of the Sith, renowned for her skill with the lightsaber and cruelty.",
        strImgPortrait: "assets/images/CharSelect_Ventress.jpg",
        strImgProfile: "assets/images/Portrait_Ventress.jpg",
        strImgBattle: "assets/images/Portrait_Ventress.jpg",
        strDefaultSkill: "Attack", //Default attack skill.
        strDefaultCounter: "CounterAttack", //Default counter skill. Triggered after the rival makes a move, unless prevented by an effect.
        strDefaultFollow: "FollowAttack", //Default follow-up attack. Triggered at random with a % chance depending on speed difference.
        arSkills:["PoisonSlash","Ambush","ForceCrush","Expose","Assasinate"],
        arSkillLevels: [0,1,1,2,2] //Contains level breaks for learning each successive skill. Must match arSkills indexes.
        },
        {
        strName: "General Grievous",
        intCharStartLevel: 0,
        intCharLevel:0,
        intBaseHP: 12, intBaseAttack: 4, intBaseCounter: 5, intBaseDefense: 5, intBaseForceAttack: 1, intBaseForceDefense: 1, intBaseSpeed: 2,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intCurrHP: 0, intCurrAttack: 0, intCurrCounter: 0, intCurrDefense: 0, intCurrForceAttack: 0, intCurrForceDefense: 0, intCurrSpeed: 0,
        strDescription: "<span style='color:cyan'>General Grievous</span> Cyborg general, Supreme Commander of the Droid Army and warlord for the Confederacy of Independent Systems. Trained in the art of lightsaber combat. A defensive nightmare with low speed and very vulnerable to force attacks.",
        strDescriptionBasic: "<span style='color:cyan'>General Grievous</span> Cyborg general, Supreme Commander of the Droid Army and warlord for the Confederacy of Independent Systems. Trained in the art of lightsaber combat by Count Dooku. A defensive nightmare with pitiful attack.",
        strImgPortrait: "assets/images/CharSelect_Grievous.jpg",
        strImgProfile: "assets/images/Portrait_Grievous.jpg",
        strImgBattle: "assets/images/Portrait_Grievous.jpg",
        strDefaultSkill: "Attack", //Default attack skill.
        strDefaultCounter: "CounterAttack", //Default counter skill. Triggered after the rival makes a move, unless prevented by an effect.
        strDefaultFollow: "FollowAttack", //Default follow-up attack. Triggered at random with a % chance depending on speed difference.
        arSkills:["Intimidate","BladeWall","PowerSlash","Expose","Anticipation"],
        arSkillLevels: [0,1,1,2,2] //Contains level breaks for learning each successive skill. Must match arSkills indexes.
        },
        {
        strName: "Darth Maul",
        intCharStartLevel: 0,
        intCharLevel:0,
        intBaseHP: 9, intBaseAttack: 3, intBaseCounter: 5, intBaseDefense: 4, intBaseForceAttack: 3, intBaseForceDefense: 3, intBaseSpeed: 3,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intCurrHP: 0, intCurrAttack: 0, intCurrCounter: 0, intCurrDefense: 0, intCurrForceAttack: 0, intCurrForceDefense: 0, intCurrSpeed: 0,
        strDescription: "<span style='color:cyan'>Darth Maul</span> The first apprentice of the Sith Lord Darth Sidious, weilding a unique dual bladed lightsaber staff. A defensive fighter capable of dishing out some nasty counter-attacks.",
        strDescriptionBasic: "<span style='color:cyan'>Darth Maul</span> The first apprentice of the Sith Lord Darth Sidious, and first Sith to fight the Jedi in over a millenia. A defensive fighter with strong counters.",
        strImgPortrait: "assets/images/CharSelect_DarthMaul.jpg",
        strImgProfile: "assets/images/Portrait_DarthMaul.jpg",
        strImgBattle: "assets/images/Portrait_DarthMaul.jpg",
        strDefaultSkill: "Attack", //Default attack skill.
        strDefaultCounter: "CounterAttack", //Default counter skill. Triggered after the rival makes a move, unless prevented by an effect.
        strDefaultFollow: "FollowAttack", //Default follow-up attack. Triggered at random with a % chance depending on speed difference.
        arSkills:["Prevent","Retaliate","Fear","Revenge","Anticipation"],
        arSkillLevels: [0,1,1,2,2] //Contains level breaks for learning each successive skill. Must match arSkills indexes.
        },
        {
        strName: "Count Dooku",
        intCharStartLevel: 0,
        intCharLevel:0,
        intBaseHP: 7,intBaseAttack: 5, intBaseCounter: 2, intBaseDefense: 4, intBaseForceAttack: 5, intBaseForceDefense: 4, intBaseSpeed: 3,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intCurrHP: 0, intCurrAttack: 0, intCurrCounter: 0, intCurrDefense: 0, intCurrForceAttack: 0, intCurrForceDefense: 0, intCurrSpeed: 0,
        strDescription: "<span style='color:cyan'>Count Dooku</span> A former Jedi Master turned to the Dark Side after growing disillusioned with the corruption in the government. Packs a decent defense and devastating Dark Side powers, but slow and weak counter potential.",
        strDescriptionBasic: "<span style='color:cyan'>Count Dooku</span> A former Jedi Master that left the Order and the Republic after growing disillusioned with the corruption in the government. Now a Sith Lord who leads the Confederacy of Independent Systems as Head of State.",
        strImgPortrait: "assets/images/CharSelect_CountDooku.jpg",
        strImgProfile: "assets/images/Portrait_CountDooku.jpg",
        strImgBattle: "assets/images/Portrait_CountDooku.jpg",
        strDefaultSkill: "Attack", //Default attack skill.
        strDefaultCounter: "CounterAttack", //Default counter skill. Triggered after the rival makes a move, unless prevented by an effect.
        strDefaultFollow: "FollowAttack", //Default follow-up attack. Triggered at random with a % chance depending on speed difference.
        arSkills:["Stab","Lightning","ForceThrow","Power","Strategist"],
        arSkillLevels: [0,1,1,2,2] //Contains level breaks for learning each successive skill. Must match arSkills indexes.
        }
    ],
//Character Collection-----------------------------------------------------END
//Skills Collection--------------------------------------------------------BEGIN
    arGameSkills:[ 
    //General skills-------------------------------------------------------
    //These are the ones assigned to each character's default attack, counter, and follow up attack skills, but any skill can be assigned to any player as the default attack, counter, and follow-up attack skill.
        {
            skName: "Attack", //Unique identifier. Use this in character's skill arrays and to identify data.
            skNameDisplay: "Attack", //For displaying UI elements (info cards, buttons, etc).
            skDescription: "A regular attack with the lightsaber. Damage based on the 'Attack' stat", //Display description and tootlip for skill button.
            skBtnColorClass: "btn-warning", //color of the skill button (bootstrap v4 classes or user defined class).
            skTextDisplayAction: "attacks", // Skill action in battle log.
            skTextDisplaySkill: "", // Skill name in battle log.
            skTextDisplaySpecial: "", //Replace normal battle log behavior after declaring caster, action and skill name.
            skTextDisplayColor: "rgb(255, 196, 0)",//Color used in battle log for highlighting skill texts: skTextDisplaySkill, skDamageType, and the damage amount
            skTarget: "rival", //"caster" for skills that affect the caster, "rival" for skills that affect the rival.
            skDamageType: "weapon", //"none" for skills that don't deal damage. Determines defensive stat to use for reducing damage. "weapon", "force" or the battle stat property from the character's array ("intCurrSpeed", "intCurrHP", "intCurrCounter", etc)
            skDamageStatPrimary: "intCurrAttack", //Caster's first stat to use in damage calculations
            skDamageStatSecondary: "", //Caster's second stat to use in damage calculations
            skDamageMultPrimary: 1, //Caster's first stat multiplier
            skDamageMultSecondary: 0, //Caster's second stat multiplier
            skSpecialEffect: ["none"], //"none","nocounter","nodefense","nomove","first","last","buff","method"
            skChargeTime: 0, //Number of turns before it can be cast.
            skCooldown: 0, //Dynamic, changing it doesn't affect behavior. When 0, the skill can be cast again.
            skTurnRemaining: 0, //Either "buff" duration or used for skMethodTurn: If greater thann 0 at the beginning of the battle turn, decreases it's value by 1 and either run the "buff" effect, or runs skMethodSpecial.
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, //Run at the beginning of the battle turn for as long as skMethodTurnRemaining is greater than 0. Uses casterObject, rivalObject, and skMethodAssist arguments. Ignored if the skill is a "buff".
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} //Run when the skill is cast. Uses casterObject, rivalObject, and skMethodAssist arguments.
        },
        {
            skName: "CounterAttack",
            skNameDisplay: "CounterAttack",
            skDescription: "",
            skBtnColorClass: "",
            skTextDisplayAction: "counter attacks",
            skTextDisplaySkill: "",
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(255, 196, 0)",
            skTarget: "rival",
            skDamageType: "weapon",
            skDamageStatPrimary: "intCurrCounter",
            skDamageStatSecondary: "",
            skDamageMultPrimary: 1,
            skDamageMultSecondary: 0,
            skSpecialEffect: ["none"],
            skChargeTime: 0,
            skCooldown: 0,
            skTurnRemaining: 0,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){},
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){}
        },
        {
            skName: "FollowAttack",
            skNameDisplay: "FollowAttack",
            skDescription: "",
            skBtnColorClass: "",
            skTextDisplayAction: "is quick enough to land an additional attack on",
            skTextDisplaySkill: "",
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(255, 196, 0)",
            skTarget: "rival", 
            skDamageType: "weapon",
            skDamageStatPrimary: "intCurrAttack",
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 0.7, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["none"],
            skChargeTime: 0,
            skCooldown: 0, 
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){},
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){}
        },
    //Weapon skills--------------------------------------------------
        {
            skName: "FeintAttack", 
            skNameDisplay: "Feint Attack", 
            skDescription: "Feints, then attacks with the lightsaber at 100% power, preventing counters.", //Tootlip for skill button.
            skBtnColorClass: "btn-warning",
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Feint Attack", 
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(255, 196, 0)",
            skTarget: "rival", 
            skDamageType: "weapon", 
            skDamageStatPrimary: "intCurrAttack",
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 1, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["nocounter"], 
            skChargeTime: 2, 
            skCooldown: 0,
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "Stab",
            skNameDisplay: "Stab", 
            skDescription: "A thrusting attack with the lightsaber at 100% power that pierces through the enemy's defense",
            skBtnColorClass: "btn-warning",
            skTextDisplayAction: "uses",
            skTextDisplaySkill: "Stab",
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(255, 196, 0)",
            skTarget: "rival", 
            skDamageType: "weapon", 
            skDamageStatPrimary: "intCurrAttack", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 1,
            skDamageMultSecondary: 0,
            skSpecialEffect: ["nodefense"], 
            skChargeTime: 2, 
            skCooldown: 0,
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "PoisonSlash", 
            skNameDisplay: "Poison Slash",
            skDescription: "A dangerous slashing attack. Uses 60% of Attack and Speed for power. Poisons the target, reducing HP by 4% each turn for 3 turns.",
            skBtnColorClass: "btn-success",
            skTextDisplayAction: "uses",
            skTextDisplaySkill: "Poison Slash", 
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(0, 187, 40)",
            skTarget: "rival", 
            skDamageType: "weapon", 
            skDamageStatPrimary: "intCurrAttack",
            skDamageStatSecondary: "intCurrSpeed",
            skDamageMultPrimary: 0.60, 
            skDamageMultSecondary: 0.60, 
            skSpecialEffect: ["method"],
            skChargeTime: 3, 
            skCooldown: 0,
            skTurnRemaining: 0,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                var damage = Math.ceil(rivalObject.intMaxHP*0.04);
                var buffObject = {
                    skName: "Poison",
                    skNameDisplay: "Poison",
                    skTextDisplayAction: skillObject.skTextDisplayAction,
                    skTextDisplaySkill: "Poison",
                    skTextDisplayColor: skillObject.skTextDisplayColor,
                    skBtnColorClass:skillObject.skBtnColorClass,
                    skDamageType: "HP",
                    skDamageStatPrimary: skillObject.skDamageStatPrimary,
                    skDamageStatSecondary: skillObject.skDamageStatSecondary,
                    skDamageMultPrimary: skillObject.skDamageMultPrimary,
                    skDamageMultSecondary: skillObject.skDamageMultSecondary,
                    buffDamage:damage,
                    buffTurns: 3
                };
                if(RPGBattle.arGameCharacters.indexOf(casterObject) == RPGBattle.intCharIndex) {
                    RPGBattle.arOppBuffs.push(buffObject);
                    var HTMLParentElement = colDivOppBuff;
                }
                else {
                    RPGBattle.arCharBuffs.push(buffObject);
                    var HTMLParentElement = colDivCharBuff;
                }
                message = rivalObject.strName+" was poisoned for "+buffObject.buffTurns+" turns!";
                RPGBattle.mDisplayAttachBuff(HTMLParentElement,buffObject,RPGBattle.arGameCharacters.indexOf(rivalObject));
                RPGBattle.mDisplayBattleLog(colDivBattlelog,message);
            } 
        },
        {
            skName: "PowerSlash", 
            skNameDisplay: "Power Slash", 
            skDescription: "Charges a powerful but slow attack with the lightsaber for 180% damage. Always moves last.", 
            skBtnColorClass: "btn-warning", 
            skTextDisplayAction: "uses",
            skTextDisplaySkill: "Power Slash", 
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(255, 196, 0)",
            skTarget: "rival", 
            skDamageType: "weapon", 
            skDamageStatPrimary: "intCurrAttack", 
            skDamageStatSecondary: "",
            skDamageMultPrimary: 1.8,
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["last"],
            skChargeTime: 3, 
            skCooldown: 0,
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "Prevent", 
            skNameDisplay: "Prevent", 
            skDescription: "Uses a quick counter attack, preventing the enemy's move this turn.",
            skBtnColorClass: "btn-warning", 
            skTextDisplayAction: "quickly counter attacks", 
            skTextDisplaySkill: "", 
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(255, 196, 0)",
            skTarget: "rival",
            skDamageType: "weapon", 
            skDamageStatPrimary: "intCurrCounter",
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 1, 
            skDamageMultSecondary: 0,
            skSpecialEffect: ["first","nomove"],
            skChargeTime: 3,
            skCooldown: 0, 
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "ThrowSaber", 
            skNameDisplay: "Throw Saber", 
            skDescription: "Use The Force to throw the lightsaber at the enemy. Adds 80% of Attack and Force Attack for damage. Avoids counters and pierces defense.",
            skBtnColorClass: "btn-warning", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Throw Saber", 
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(255, 196, 0)",
            skTarget: "rival", 
            skDamageType: "weapon", 
            skDamageStatPrimary: "intCurrAttack",
            skDamageStatSecondary: "intCurrForceAttack", 
            skDamageMultPrimary: 0.80, 
            skDamageMultSecondary: 0.80, 
            skSpecialEffect: ["nocounter","nodefense"], 
            skChargeTime: 4, 
            skCooldown: 0,
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "Jump", 
            skNameDisplay: "Jump", 
            skDescription: "Jump behind the enemy and add 80% of Speed to your attack. Has an increased chance of dealing a follow-up attack and prevents enemy action if it strikes first.", //Tootlip for skill button.
            skBtnColorClass: "btn-success", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Jump",
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(0, 187, 40)",
            skTarget: "rival", 
            skDamageType: "weapon", 
            skDamageStatPrimary: "intCurrAttack",
            skDamageStatSecondary: "intCurrSpeed", 
            skDamageMultPrimary: 1, 
            skDamageMultSecondary: 0.8, 
            skSpecialEffect: ["nomove","method"], 
            skChargeTime: 4,
            skCooldown: 0,
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){},
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                casterObject.intCurrAttack += Math.floor(0.8*casterObject.intCurrSpeed);
                casterObject.intCurrSpeed *= 1.66;
            } 
        },
        {
            skName: "Retaliate", 
            skNameDisplay: "Retaliate", 
            skDescription: "Deals no direct damage, but increases Counter Attack damage by 300% on this round.", 
            skBtnColorClass: "btn-warning", 
            skTextDisplayAction: "uses",
            skTextDisplaySkill: "Retaliate", 
            skTextDisplaySpecial: "and prepares a devastating counter.",
            skTextDisplayColor: "rgb(255, 196, 0)",
            skTarget: "rival", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrCounter", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 3, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["first","method"],
            skChargeTime: 4,
            skCooldown: 0,
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                casterObject.intCurrCounter *= 3.5;
            } 
        },
        {
            skName: "Assasinate", 
            skNameDisplay: "Assasinate", 
            skDescription: "Unleashes a letal lightsaber attack at 150% power. Always moves first, prevents counters, and deals an additional 3% bonus damage for every 1% of HP the enemy has lost.",
            skBtnColorClass: "btn-warning", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Assasinate",
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(255, 196, 0)",
            skTarget: "rival", 
            skDamageType: "weapon", 
            skDamageStatPrimary: "intCurrAttack", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 1.5, 
            skDamageMultSecondary: 0,
            skSpecialEffect: ["first","nocounter","method"], 
            skChargeTime: 5, 
            skCooldown: 0, 
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                var origDamage = RPGBattle.mBattleDamage(skillObject,casterObject,rivalObject);
                var bonusDamageMult = 3*(1 - rivalObject.intCurrHP/rivalObject.intMaxHP)
                var bonusDamage = Math.floor(origDamage*bonusDamageMult);
                var message = "<span style='color:"+skillObject.skTextDisplayColor+"'>"+skillObject.skNameDisplay+"</span> deals <span style='color:"+skillObject.skTextDisplayColor+"'>"+bonusDamage+"</span> additional damage!";
                RPGBattle.mDisplayBattleLog(colDivBattlelog,message);
                RPGBattle.mBattleDealDamage(rivalObject,bonusDamage);
            } 
        },
        {
            skName: "Finisher", 
            skNameDisplay: "Finisher", 
            skDescription: "Charges a brutal lightsaber attack for dealing massive damage at 350% power. Always moves last.", 
            skBtnColorClass: "btn-warning", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Finisher",
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(255, 196, 0)",
            skTarget: "rival", 
            skDamageType: "weapon", 
            skDamageStatPrimary: "intCurrAttack", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 3.5,
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["last"], 
            skChargeTime: 5, 
            skCooldown: 0, 
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
    //Force skills---------------------------------------
        {
            skName: "ForcePush", 
            skNameDisplay: "Force Push",
            skDescription: "Light Side. Uses The Force at 100% power to push the enemy back and avoid a counter attack.",
            skBtnColorClass: "btn-info", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Force Push", 
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(0, 204, 255)",
            skTarget: "rival",
            skDamageType: "force", 
            skDamageStatPrimary: "intCurrForceAttack", 
            skDamageStatSecondary: "",
            skDamageMultPrimary: 1, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["nocounter"], 
            skChargeTime: 1,
            skCooldown: 0,
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "ForceCrush", 
            skNameDisplay: "Force Crush",
            skDescription: "Dark Side. Use The Force to crush the opponent for 180% damage. Prevents opponent from moving if it strikes firts.", 
            skBtnColorClass: "udbtn-purple", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Force Crush", 
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(195, 0, 195)",
            skTarget: "rival",
            skDamageType: "force",
            skDamageStatPrimary: "intCurrForceAttack", 
            skDamageStatSecondary: "",
            skDamageMultPrimary: 1.8, 
            skDamageMultSecondary: 0,
            skSpecialEffect: ["nomove"], 
            skChargeTime: 3, 
            skCooldown: 0,
            skTurnRemaining: 0,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){},
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "Heal", 
            skNameDisplay: "Heal", 
            skDescription: "Light Side. Use The Force to recover 275% of Force Attack as HP.", 
            skBtnColorClass: "btn-info", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Heal", 
            skTextDisplaySpecial: "to recover lost Hit Points.",
            skTextDisplayColor: "rgb(0, 204, 255)",
            skTarget: "caster", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrForceAttack", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 2.75, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["method"], 
            skChargeTime: 3, 
            skCooldown: 0, 
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                var healingPower = skillObject.skDamageMultPrimary;
                var maxHeal = casterObject.intMaxHP-casterObject.intCurrHP;
                var healing = Math.floor(Math.min(maxHeal,casterObject.intCurrForceAttack*healingPower));
                var message = "<span style='color:rgb(155, 155, 155)'>Turn "+RPGBattle.intBattleTurnCount+":</span> "+casterObject.strName+" recovers <span style='color:"+skillObject.skTextDisplayColor+"'>"+healing+"</span> hit points.";
                casterObject.intCurrHP += healing;
                RPGBattle.mDisplayBattleLog(colDivBattlelog,message);
                var tempint = RPGBattle.arGameCharacters.indexOf(casterObject);
                RPGBattle.mDisplayUpdateHP(tempint);
            } 
        },
        {
            skName: "ForceThrow", 
            skNameDisplay: "Force Throw", 
            skDescription: "Dark Side. Uses The Force to throw objects at the enemy. Hits 1-3 times at 90% power.",
            skBtnColorClass: "udbtn-purple", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Force Throw", 
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(195, 0, 195)",
            skTarget: "rival", 
            skDamageType: "force", 
            skDamageStatPrimary: "intCurrForceAttack", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 0.9, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["method"],
            skChargeTime: 3, 
            skCooldown: 0,
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                for (i = 0; i < 2; i++){
                    if(Math.random()<=0.5){
                        var damage = RPGBattle.mBattleDamage(skillObject,casterObject,rivalObject);
                        var message = RPGBattle.mBattleMessage(skillObject,casterObject,rivalObject,damage);
                        RPGBattle.mDisplayBattleLog(colDivBattlelog,message);
                        RPGBattle.mBattleDealDamage(rivalObject,damage);
                        RPGBattle.mDisplayUpdateHP(RPGBattle.arGameCharacters.indexOf(rivalObject));
                    }
                }
            } 
        },
        {
            skName: "ShockWave", //Unique identifier. Use this in character's skill arrays.
            skNameDisplay: "Shock Wave", 
            skDescription: "Light Side. Unleashes a strong Force Shock Wave at 180% power. Prevents counter and blocks enemy action if it strikes first.", 
            skBtnColorClass: "btn-info", 
            skTextDisplayAction: "uses",
            skTextDisplaySkill: "Shock Wave", 
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(0, 204, 255)",
            skTarget: "rival", 
            skDamageType: "force", 
            skDamageStatPrimary: "intCurrForceAttack", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 1.8, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["nomove","nocounter"], 
            skChargeTime: 4, 
            skCooldown: 0, 
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){}
        },
        {
            skName: "Choke", 
            skNameDisplay: "Choke", 
            skDescription: "Dark Side. Use The Force to choke the rival. Reduces Attack and Counter by 33% for the rest of the turn, and deals moderate force damage on the next 2 turns.", 
            skBtnColorClass: "udbtn-purple", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Choke", 
            skTextDisplaySpecial: "to weaken the attacks of the enemy on this turn, and deal moderate Force damage for the next 2 turns.",
            skTextDisplayColor: "rgb(195, 0, 195)",
            skTarget: "rival", 
            skDamageType: "force", 
            skDamageStatPrimary: "intCurrForceAttack", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 1.2, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["buff"], 
            skChargeTime: 4, 
            skCooldown: 0, 
            skTurnRemaining: 2, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                rivalObject.intCurrAttack *= 0.66;
                rivalObject.intCurrCounter *= 0.66;
                var message = rivalObject.strName+"'s attacks and counters are weakened!";
                RPGBattle.mDisplayBattleLog(colDivBattlelog,message);
            } 
        },
        {
            skName: "MindTrick", 
            skNameDisplay: "Mind Trick", 
            skDescription: "Light Side. An advanced Jedi Skill. Leaves the enemy completely defenseless, prevents all action, and attacks with The Force at 233% power.", 
            skBtnColorClass: "btn-info", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Mind Trick", 
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(0, 204, 255)",
            skTarget: "rival", 
            skDamageType: "force", 
            skDamageStatPrimary: "intCurrForceAttack",
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 2, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["first","nocounter","nomove","method"],
            skChargeTime: 5, 
            skCooldown: 0,
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                rivalObject.intCurrSpeed *= 0.1;
                rivalObject.intCurrDefense *= 0;
                rivalObject.intCurrForceDefense *= 0;
                var message = rivalObject.strName+" is completely helpless and open for attacks!"
                RPGBattle.mDisplayBattleLog(colDivBattlelog,message);
            }
        },
        {
            skName: "Lightning", 
            skNameDisplay: "Lightning", 
            skDescription: "Dark Side. A devastating Force skill for dealing sheer damage at 450% power, so intense that the caster suffers 15% of the total damage dealt.", 
            skBtnColorClass: "udbtn-purple", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Lightning", 
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(195, 0, 195)",
            skTarget: "rival", 
            skDamageType: "force", 
            skDamageStatPrimary: "intCurrForceAttack", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 4.5,
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["method"],
            skChargeTime: 6, 
            skCooldown: 0, 
            skTurnRemaining: 0, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                var damage = Math.floor(0.15*RPGBattle.mBattleDamage(skillObject,casterObject,rivalObject));
                var message = casterObject.strName+" receives <span style='color:"+skillObject.skTextDisplayColor+"'>"+damage+" "+skillObject.skDamageType+"</span> damage as recoil!"
                RPGBattle.mDisplayBattleLog(colDivBattlelog,message);
                RPGBattle.mBattleDealDamage(casterObject,damage);
            } 
        },
    //Buffs-------------------------------
        {
            skName: "ForceSpeed", 
            skNameDisplay: "Force Speed", 
            skDescription: "Light Side. Increases Speed and Force Defense by 33% on the next 3 turns", 
            skBtnColorClass: "btn-info", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Force Speed", 
            skTextDisplaySpecial: "and increases Speed and Force Defense by 33% on the next 3 turns.",
            skTextDisplayColor: "rgb(0, 204, 255)",
            skTarget: "caster", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrSpeed", 
            skDamageStatSecondary: "intCurrForceDefense", 
            skDamageMultPrimary: 1.333, 
            skDamageMultSecondary: 1.333, 
            skSpecialEffect: ["buff"], 
            skChargeTime: 5, 
            skCooldown: 0, 
            skTurnRemaining: 3,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "ForceShield", 
            skNameDisplay: "Force Shield", 
            skDescription: "Light Side. Protect yourself with The Force. Increases Defense and Force Defense by 33% on the next 3 turns", 
            skBtnColorClass: "btn-info", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Force Shield", 
            skTextDisplaySpecial: "and increases Defense and Force Defense by 33% on the next 3 turns.",
            skTextDisplayColor: "rgb(0, 204, 255)",
            skTarget: "caster", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrDefense", 
            skDamageStatSecondary: "intCurrForceDefense", 
            skDamageMultPrimary: 1.333, 
            skDamageMultSecondary: 1.333, 
            skSpecialEffect: ["buff"], 
            skChargeTime: 5, 
            skCooldown: 0, 
            skTurnRemaining: 3,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "Fear", 
            skNameDisplay: "Fear", 
            skDescription: "Dark Side. Instill fear in the hearts of your enemies, cuttinng their Attack and Speed by 33% for the next 3 turns.", 
            skBtnColorClass: "udbtn-purple", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Fear",
            skTextDisplaySpecial: "and reduces the target's Attack and Speed by 33% for the next 3 turns.",
            skTextDisplayColor: "rgb(195, 0, 195)",
            skTarget: "rival", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrAttack", 
            skDamageStatSecondary: "intCurrSpeed", 
            skDamageMultPrimary: 0.67, 
            skDamageMultSecondary: 0.67, 
            skSpecialEffect: ["buff"], 
            skChargeTime: 5, 
            skCooldown: 0, 
            skTurnRemaining: 3,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "Intimidate", 
            skNameDisplay: "Intimidate", 
            skDescription: "Halves the opponent's Attack and Counter attack on the next turn",
            skBtnColorClass: "btn-danger", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Intimidate", 
            skTextDisplaySpecial: "and halves the target's Attack and Counter attack on the next turn.",
            skTextDisplayColor: "rgb(255, 40, 0)",
            skTarget: "rival",
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrAttack", 
            skDamageStatSecondary: "intCurrCounter", 
            skDamageMultPrimary: 0.5, 
            skDamageMultSecondary: 0.5, 
            skSpecialEffect: ["buff"], 
            skChargeTime: 3, 
            skCooldown: 0,
            skTurnRemaining: 1, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "Pursuit", 
            skNameDisplay: "Pursuit", 
            skDescription: "Doubles Attack and Speed on the next turn.",
            skBtnColorClass: "btn-success", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Pursuit", 
            skTextDisplaySpecial: "and doubles Attack and Speed on the next turn.",
            skTextDisplayColor: "rgb(0, 187, 40)",
            skTarget: "caster",
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrAttack", 
            skDamageStatSecondary: "intCurrSpeed", 
            skDamageMultPrimary: 2, 
            skDamageMultSecondary: 2, 
            skSpecialEffect: ["buff"], 
            skChargeTime: 3, 
            skCooldown: 0,
            skTurnRemaining: 1, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "Anticipation", 
            skNameDisplay: "Anticipation", 
            skDescription: "Focus your mind to anticipate your enemy's actions. Icreases Counter damage by 80% for the next 2 turns.", 
            skBtnColorClass: "btn-danger",
            skTextDisplayAction: "uses",
            skTextDisplaySkill: "Anticipation", 
            skTextDisplaySpecial: "and doubles Counter Attack damage for the next 2 turns.",
            skTextDisplayColor: "rgb(255, 40, 0)",
            skTarget: "caster", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrCounter", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 1.8, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["buff"],
            skChargeTime: 5, 
            skCooldown: 0, 
            skTurnRemaining: 2, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "Expose", 
            skNameDisplay: "Expose", 
            skDescription: "Leaves the target open for attack. Halves Defense for the next 2 turns.",
            skBtnColorClass: "btn-danger",
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Expose", 
            skTextDisplaySpecial: "halving the rival's Defense for the next 2 turns.",
            skTextDisplayColor: "rgb(255, 40, 0)",
            skTarget: "rival", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrDefense", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 0.5,
            skDamageMultSecondary: 0,
            skSpecialEffect: ["buff"],
            skChargeTime: 5,
            skCooldown: 0,
            skTurnRemaining: 2, 
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "Sense", 
            skNameDisplay: "Sense", 
            skDescription: "Light Side. Taps into The Force to read into the future. Increases Defense and Force Attack by 33% for 3 turns.", 
            skBtnColorClass: "btn-info", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Sense", 
            skTextDisplaySpecial: "to increse Defense and Force Attack by 33% on the next 3 turns.",
            skTextDisplayColor: "rgb(0, 204, 255)",
            skTarget: "caster", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrForceAttack", 
            skDamageStatSecondary: "intCurrDefense", 
            skDamageMultPrimary: 1.33, 
            skDamageMultSecondary: 1.33, 
            skSpecialEffect: ["buff"], 
            skChargeTime: 6, 
            skCooldown: 0, 
            skTurnRemaining: 3,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {
            skName: "Power", 
            skNameDisplay: "Power", 
            skDescription: "Dark Side. Taps into The Force to gain unlimited power. Increases Force Attack by 66% for the next 3 turns.", 
            skBtnColorClass: "udbtn-purple", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Power", 
            skTextDisplaySpecial: "and increses Force Attack by 66% for the next 3 turns.",
            skTextDisplayColor: "rgb(195, 0, 195)",
            skTarget: "caster", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrForceAttack", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 1.666, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["buff"], 
            skChargeTime: 6, 
            skCooldown: 0, 
            skTurnRemaining: 3,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },

    //Unique skills------------------------------------------------
        {//Anakin
            skName: "Rage", 
            skNameDisplay: "Rage", 
            skDescription: "Anakin rages, increasing attack by 50% and reducing defense by 25% for 3 turns.", 
            skBtnColorClass: "btn-danger", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Rage", 
            skTextDisplaySpecial: "increasing attack by 50% and reducing defense by 25% for the next 3 turns.",
            skTextDisplayColor: "rgb(255, 40, 0)",
            skTarget: "caster", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrAttack", 
            skDamageStatSecondary: "intCurrDefense", 
            skDamageMultPrimary: 1.5, 
            skDamageMultSecondary: 0.75, 
            skSpecialEffect: ["buff"], 
            skChargeTime: 6, 
            skCooldown: 0, 
            skTurnRemaining: 3,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {//Ahsoka
            skName: "Rush",
            skNameDisplay: "Rush", 
            skDescription: "Ahsoka rushes forward to attack the enemy, increasing Attack by 120% of Speed. Prevents counters and has an increased chance to land a follow-up attack.", 
            skBtnColorClass: "btn-success", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Rush", 
            skTextDisplaySpecial: "",
            skTextDisplayColor: "rgb(0, 187, 40)",
            skTarget: "rival", 
            skDamageType: "weapon", 
            skDamageStatPrimary: "intCurrAttack", 
            skDamageStatSecondary: "intCurrSpeed", 
            skDamageMultPrimary: 1, 
            skDamageMultSecondary: 1.2, 
            skSpecialEffect: ["nocounter"], 
            skChargeTime: 3, 
            skCooldown: 0, 
            skTurnRemaining: 0,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                casterObject.intCurrSpeed *= 1.66;
            } 
        },
        {//Obi Wan
            skName: "HighGround", 
            skNameDisplay: "High Ground", 
            skDescription: "Obi Wan takes the high ground to gain a tactical advantage. Increases Attack and Force Attack by 33% for 3 turns", 
            skBtnColorClass: "btn-danger", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "High Ground", 
            skTextDisplaySpecial: "increasing Attack and Force Attack by 33% on the next 3 turns",
            skTextDisplayColor: "rgb(255, 40, 0)",
            skTarget: "caster", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrAttack", 
            skDamageStatSecondary: "intCurrForceAttack", 
            skDamageMultPrimary: 1.33, 
            skDamageMultSecondary: 1.33, 
            skSpecialEffect: ["buff"], 
            skChargeTime: 5, 
            skCooldown: 0, 
            skTurnRemaining: 3,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {//Yoda
            skName: "Longevity",
            skNameDisplay: "Longevity", 
            skDescription: "Through The Force, Yoda manages to extend his life. For the next 3 turns, he recovers 12% of Max HP at the start of each turn.", 
            skBtnColorClass: "btn-info", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Logevity", 
            skTextDisplaySpecial: "to recover 15% of Max HP at the start of each turn for 3 turns.",
            skTextDisplayColor: "rgb(0, 204, 255)",
            skTarget: "caster", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrHP", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 1.12, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["method"], 
            skChargeTime: 6,
            skCooldown: 0, 
            skTurnRemaining: 0,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject,rivalObject,skMethodAssist){
                var healing = Math.floor(Math.min(Math.ceil(casterObject.intMaxHP*0.12),casterObject.intMaxHP-casterObject.intCurrHP));
                casterObject.intCurrHP += healing;
                var message = "<span style='color:"+skillObject.skTextDisplayColor+"'>"+skillObject.skNameDisplay+":</span> "+casterObject.strName+" recovers "+"<span style='color:"+skillObject.skTextDisplayColor+"'>"+healing+"</span> hit points."
                RPGBattle.mDisplayBattleLog(colDivBattlelog,message);
                RPGBattle.mDisplayUpdateHP(RPGBattle.arGameCharacters.indexOf(casterObject));
            }, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                var buffObject = {
                    skName: "Longevity",
                    skNameDisplay: "Longevity",
                    skTextDisplayAction: "",
                    skTextDisplaySkill: "Longevity",
                    skTextDisplayColor: skillObject.skTextDisplayColor,
                    skBtnColorClass:skillObject.skBtnColorClass,
                    skDamageType: "none",
                    skDamageStatPrimary: "+12% HP reg",
                    skDamageStatSecondary: "",
                    skDamageMultPrimary: 0,
                    skDamageMultSecondary: 0,
                    buffDamage:0,
                    buffTurns: 3
                };
                if(RPGBattle.arGameCharacters.indexOf(casterObject) == RPGBattle.intCharIndex) {
                    RPGBattle.arCharBuffs.push(buffObject);
                    var HTMLParentElement = colDivCharBuff;
                }
                else {
                    RPGBattle.arOppBuffs.push(buffObject);
                    var HTMLParentElement = colDivOppBuff;
                }
                RPGBattle.mDisplayAttachBuff(HTMLParentElement,buffObject,RPGBattle.arGameCharacters.indexOf(casterObject));

                skillObject.skTurnRemaining = 3;
            } 
        },
        {//Ventress
            skName: "Ambush", 
            skNameDisplay: "Ambush", 
            skDescription: "Ventress sets an ambush for unsuspecting rivals. Reduces target's Speed and Defense on this turn, and deals moderate weapon damage at the start of the next 2 turns.", 
            skBtnColorClass: "btn-danger", 
            skTextDisplayAction: "prepares an", 
            skTextDisplaySkill: "Ambush", 
            skTextDisplaySpecial: "to deal an additional attack at the start of each turn for the next 2 turns.",
            skTextDisplayColor: "rgb(255, 40, 0)",
            skTarget: "rival", 
            skDamageType: "weapon", 
            skDamageStatPrimary: "intCurrAttack", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 1.33, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["buff","method"], 
            skChargeTime: 4, 
            skCooldown: 0, 
            skTurnRemaining: 2,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                var message = rivalObject.strName+" falls into the trap and has Defense and Speed lowered!";
                rivalObject.intCurrSpeed *= 0.5;
                rivalObject.intCurrDefense *= 0.5;
                RPGBattle.mDisplayBattleLog(colDivBattlelog,message);
            } 
        },
        {//Grievous
            skName: "BladeWall", 
            skNameDisplay: "Blade Wall", 
            skDescription: "General Grievous spins the lightsabers at incredible speed. Increases Defense and Counter by 33% for 3 turns", 
            skBtnColorClass: "btn-danger", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Balde Wall", 
            skTextDisplaySpecial: "to increase Defense and Counter by 33% on the next 3 turns.",
            skTextDisplayColor: "rgb(255, 40, 0)",
            skTarget: "caster", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrDefense", 
            skDamageStatSecondary: "intCurrCounter", 
            skDamageMultPrimary: 1.33, 
            skDamageMultSecondary: 1.33, 
            skSpecialEffect: ["buff"], 
            skChargeTime: 5, 
            skCooldown: 0, 
            skTurnRemaining: 3,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){} 
        },
        {//Darth Maul
            skName: "Revenge",
            skNameDisplay: "Revenge", 
            skDescription: "Darth Maul forgoes his move this turn and takes damage. Counters for 150% of the damage received at the start of the next turn. Moves first.", 
            skBtnColorClass: "btn-danger", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Revenge", 
            skTextDisplaySpecial: "and prepares a deadly counter for the next turn.",
            skTextDisplayColor: "rgb(255, 40, 0)",
            skTarget: "rival", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrCounter", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 3.5,
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["first","method"], 
            skChargeTime: 4, 
            skCooldown: 0, 
            skTurnRemaining: 0,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject,rivalObject,skMethodAssist){
                var damage = Math.floor(Math.max(0,skillObject.skMethodAssist-casterObject.intCurrHP)*1.5);
                var message = "<span style='color:"+skillObject.skTextDisplayColor+"'>Revenge:</span> "+rivalObject.strName+" is hit for <span style='color:"+skillObject.skTextDisplayColor+"'>"+damage+"</span> damage.";
                RPGBattle.mBattleDealDamage(rivalObject,damage);
                RPGBattle.mDisplayBattleLog(colDivBattlelog,message);
            }, 
            skMethodSpecial: function(skillObject,casterObject,rivalObject,skMethodAssist){
                skillObject.skMethodAssist = casterObject.intCurrHP;
                skillObject.skTurnRemaining = 1;
            } 
        }, 
        {//Count Dooku
            skName: "Strategist",
            skNameDisplay: "Strategist", 
            skDescription: "Count Dooku comes up with an evil plot to destroy the Jedi. Reduces the cooldown of all his other skills by 1.", 
            skBtnColorClass: "udbtn-purple", 
            skTextDisplayAction: "uses", 
            skTextDisplaySkill: "Strategist", 
            skTextDisplaySpecial: "to reduce the cooldown of all his skills by 1.",
            skTextDisplayColor: "rgb(195, 0, 195)",
            skTarget: "caster", 
            skDamageType: "none", 
            skDamageStatPrimary: "intCurrForceAttack", 
            skDamageStatSecondary: "", 
            skDamageMultPrimary: 2, 
            skDamageMultSecondary: 0, 
            skSpecialEffect: ["method"], 
            skChargeTime: 6, 
            skCooldown: 0, 
            skTurnRemaining: 0,
            skMethodAssist: 0,
            skMethodTurn: function(skillObject,casterObject, rivalObject,skMethodAssist){}, 
            skMethodSpecial: function(skillObject,casterObject, rivalObject,skMethodAssist){
                if (RPGBattle.arGameCharacters.indexOf(casterObject)==RPGBattle.intCharIndex){
                    for (var i = 0; i < RPGBattle.arCharSkills.length; i++){
                        var skill = RPGBattle.arCharSkills[i];
                        if (skill.skCooldown > 0 && skill.skName!==skillObject.skName) skill.skCooldown--
                        RPGBattle.mDisplayApplyCooldown(skill);
                        if (skill.skCooldown == 0) RPGBattle.mDisplayRemoveCooldown(skill);
                    }
                }
                else{
                    for (var i = 0; i < RPGBattle.arOppSkills.length; i++){
                        var skill = RPGBattle.arOppSkills[i];
                        if (skill.skCooldown > 0 && skill.skName!==skillObject.skName) skill.skCooldown--
                    }
                }
            } 
        },

    ], //Skills Collection----------------------------------------------------END
//---------------------------------------------------------General Utility methods. Array and values manipulation
    mReduceArray: function(array = [], elements = 0){//Removes random elements from the [array] until a maximum of [elements] remain
        var tempArray = array;
        var loopMax = array.length;
        if (loopMax > elements){ //Checks wether the array has more elements than [elements]
            for (var i = elements; i < loopMax; i++ ){
                var tempint = tempArray.length;
                tempArray.splice(Math.floor(Math.random()*tempint),1); //Removes a random element from the array
            }
        }
        return tempArray; //Return the copied array with a legth of [elements]
    },

    mMaxProperty: function(array = [],propertyName = ""){//Returns the max value of a specified property [propertyname], from a collection of objects within an array [array]
        var result = 0;
        if (array.length > 0){ //Return 0 if the array doesn't have any elements.
            result = Math.max.apply(
                Math, array.map(//Applies the Math.max function to an array composed by the collection of specified property values
                    function(object) { 
                        if (object[propertyName] !== undefined) return object[propertyName];
                    }
                )
            );
        }
        return result;
    },

    mFindObject: function(array = [],property = "", value){ //Uses find method to return first object from [array] to match [property] == [value] condition
        var returnObject = array.find(function(object){
            if(object[property] !== undefined) return object[property] == value;
        });
        return returnObject;
    },
//======================================================================================================================//
//----------------------------------------- Game-flow methods----------------------------------------------------------//
//------------------------Set falgs, enable / disable buttons, for each phase:----------------------------------------//
//-------Select character (Reroll) <= => Select Opponent (Re-select) <= => Battle (Win,Lose) => Restart--------------//
//==================================================================================================================//
//-------------------------------------------------------------Game flow methods.
    mGameModeStart: function(mode){ //Main game flow function, called when choosing a game mode.
        if (navigator.userAgent.match(/Chrome|AppleWebKit/)) window.location.href = "#charSelect";
        else window.location.hash = "charSelect";
        //Clear game areas
        rowDivCharSelect.empty(); //Clears the Character selection
        rowDivCharInfo.empty(); //Clears the Character info area
        rowDivCharSkills.empty(); //Clears skill info area
        colDivCharFight.empty(); //Clears character battle area
        colDivCharBuff.empty(); //Clears the Character Buff area
        rowDivOppSelect.empty(); //Clears the Opponent selection area
        rowDivOppInfo.empty(); //Clears the Opponent info area
        rowDivOppSkills.empty(); //Clears skill info area
        colDivOppFight.empty(); //Clears Opponent battle area
        colDivOppBuff.empty(); //Clears the Opponent Buff area
        rowDivSkill.empty(); //Clears the in-battle skills area
        //Set all game flow flags to starting position
        if (mode === "advanced") this.boolAdvancedGame = true; //Sets advanced game flag
        else this.boolAdvancedGame = false;
        this.boolCharSelected = false; //Sets character selection flag
        this.boolOppSelected = false; //Sets opponent selection flag
        this.boolBattleBegan = false; //Sets battle flag
        //Button controls
        btnSelectChar.attr("disabled",""); //Disable "select character" button
        btnReroll.attr("disabled","");//Disable "reroll characters" button
        btnReselect.attr("disabled","");//Disable "reselect character" button
        btnBegin.attr("disabled",""); //Disable "begin battle" button
        btnReroll.removeAttr("disabled");//Enable "reroll characters" button
        btnBegin.removeAttr("udcharindex"); //Remove selected character index attribute from "begin battle" button
        btnBegin.removeAttr("udoppindex"); //Remove selected opponent index attribute from "begin battle" button
        btnSelectChar.removeAttr("udcharindex"); //Remove selected character index attribute from "select character" button
        //Starting variables
        this.intBattleTurnCount = 0; //Number of turns in the game.
        this.intCharIndex = 0; //Index of the player character within arGameCharacters
        this.arCharSkills = []; //Skills array of the player character for the current battle.
        this.intOppIndex = 0; //Index of the opponent within arGameCharacters
        this.arOppSkills = []; //Skills array of the opponent for the current battle.
        this.arCharSkillsCooldown = []; //Skill cooldown array.
        //Sets character's level to their starting value
        for(var i = 0; i < this.arCharacters.length; i++){
            this.arCharacters[i].intCharLevel = this.arCharacters[i].intCharStartLevel;
        }
        //Populate game variables and arrays
        for (var i = 0; i<this.arCharacters.length;i++) { //Assign playing stats to every character depending on game mode and settings
            this.mGameSetStats(this.arCharacters[i]);
        }
        this.mGameRollCharacters(this.arCharacters); //Choose [intGameCharacters] characters to play in game from general character array, creates portraits and profiles
        //Assigns onclick event to "select character button"
        var RPGBattle = this;
        //btnSelectChar = $("#btnSelectChar"); //Update button jquery reference
        btnSelectChar.off(); //Removes all event handlers from button
        btnSelectChar.on("click",function(){ //Adds event handler
            var btn = $(this);
            var charIndex = btn.attr("udcharindex"); //Stores selected character index in temporary variable to use as argument
            RPGBattle.boolCharSelected = true; //Sets character selected flag
            RPGBattle.intCharIndex = charIndex; //Updates game object character index
            if(RPGBattle.boolGameCharStartLevel) RPGBattle.arGameCharacters[charIndex].intCharStartLevel = 0; // If game settings specify it, starting character level = 0 always.
            RPGBattle.mGamePlaceOpponents(charIndex); //Calls opponnent placement method
        });
        //Assigns onclick event to "Reroll characters button"
        btnReroll.off();
        btnReroll.on("click",function(){
            RPGBattle.mGameRollCharacters();
        });
        //Assigns onclick event to "Re-select character button"
        btnReselect.off();
        btnReselect.on("click",function(){
            RPGBattle.mGameReselect(RPGBattle.intCharIndex);
        });
        //Assigns onclick event to "Restart button"
        btnRestart.off();
        btnRestart.on("click",function(){
            RPGBattle.mGameRestart();
        });
    },
    
    mGameSetStats:function(charObject = new Object){//Sets stats depending on game mode, character level, base points and stat multipliers
        var totalBase = charObject.intBaseHP + charObject.intBaseAttack + charObject.intBaseCounter + charObject.intBaseDefense + charObject.intBaseForceAttack + charObject.intBaseForceDefense + charObject.intBaseSpeed;
        if(this.boolAdvancedGame){ //Stats for advanced game mode
            var percentageGain = (1+charObject.intCharLevel*this.intGameCharLevelStatGain/totalBase);
            charObject.intMaxHP = Math.ceil(charObject.intBaseHP*this.intStatHPMult*percentageGain);
            charObject.intAttack = Math.ceil(charObject.intBaseAttack*this.intStatAttackMult*percentageGain); 
            charObject.intCounter = Math.ceil(charObject.intBaseCounter*this.intStatCounterMult*percentageGain); 
            charObject.intDefense = Math.ceil(charObject.intBaseDefense*this.intStatDefenseMult*percentageGain); 
            charObject.intForceAttack = Math.ceil(charObject.intBaseForceAttack*this.intStatForceAttackMult*percentageGain); 
            charObject.intForceDefense = Math.ceil(charObject.intBaseForceDefense*this.intStatForceDefenseMult*percentageGain); 
            charObject.intSpeed = Math.ceil(charObject.intBaseSpeed*this.intStatSpeedMult*percentageGain);
        }
        else{ //Stats for basic game mode
            var powerMod = 1-1.3*charObject.intBaseHP/totalBase;
            charObject.intMaxHP = charObject.intBaseHP*this.intStatHPMultBasic;
            charObject.intAttack = Math.max(4,Math.ceil(powerMod*1.75*(charObject.intBaseAttack+charObject.intBaseForceAttack+charObject.intBaseSpeed)));
            charObject.intCounter = Math.ceil(powerMod*4.75*(1.35*charObject.intBaseCounter+charObject.intBaseDefense+charObject.intBaseForceDefense));
            charObject.intCurrAttack = charObject.intAttack;
        }
    },
    
    mGameSetBattleStats:function(charObject = new Object){//Sets battle stats (advanced game only)
            if(this.boolAdvancedGame) charObject.intCurrAttack = charObject.intAttack; //On basic game, the increased attack damage isn't reset
            charObject.intCurrCounter = charObject.intCounter; 
            charObject.intCurrDefense = charObject.intDefense; 
            charObject.intCurrForceAttack = charObject.intForceAttack; 
            charObject.intCurrForceDefense = charObject.intForceDefense; 
            charObject.intCurrSpeed = charObject.intSpeed;
            charObject.weapon = charObject.intDefense;
            charObject.force = charObject.intForceDefense;
    },

    mGameRollCharacters:function(){ //Selects random [intGameCharcters] from the general character array. Select character [[(Reroll)]] <= => Select Opponent => Battle (Win,Lose) => Restart
        this.arGameCharacters = [];
        for(var i = 0; i< this.arCharacters.length; i++){ //Inserts all elements from the master character array into the game array
            this.arGameCharacters.push(this.arCharacters[i]);
        }
        this.mReduceArray(this.arGameCharacters, this.intGameCharacters); //Removes random characters from the game array until only [intGameCharacters] remain
        console.log("Game characters chosen-------------");
        console.log(this.arGameCharacters);
        rowDivCharSelect.empty(); //Clears the character selection area
        rowDivCharInfo.empty(); //Clears the character info area
        rowDivCharSkills.empty(); //Clears the skills info area

        //Append character portraits in character selection area
        for(var i = 0; i< this.arGameCharacters.length; i++){
            var tempCol = this.mCreatePicker(this.arGameCharacters[i]);
            tempCol.appendTo(rowDivCharSelect);
        }
        //Assign onclick event to recently created character portraits, so they display info cards when clicked
        var RPGBattle = this;
        $('div[udElementType="CharPicker"]').off() //Removes all event handlers before adding a new one
        $('div[udElementType="CharPicker"]').on("click",function(){
            var picker = $(this);
            $('div[udElementType="CharPicker"]').attr("style",""); //removes style from all "CharPicker" portraits
            picker.attr("style",RPGBattle.strPickerHighlight); //adds border to clicked "CharPicker" portrait
            RPGBattle.mDisplayInfoCard(rowDivCharInfo,picker.attr("udCharIndex")); //Creates and displays info card
            if(RPGBattle.boolAdvancedGame) RPGBattle.mDisplayInfoSkills(rowDivCharSkills,picker.attr("udCharIndex"));
            btnSelectChar.removeAttr("disabled"); //Enables "Select character button"
            var tempIndex = picker.attr("udCharIndex");
            btnSelectChar.attr("udCharIndex",tempIndex); //Passes index of selected portrait to "select character" button
        });
    },
    
    mGamePlaceOpponents: function(charIndex){ //Moves the non-selected characters to the opponents area. Select character (Reroll) <= => [[Select Opponent (Reselect Character)]] => Begin Battle (Win,Lose) => Restart
        var RPGBattle = this;
        if (navigator.userAgent.match(/Chrome|AppleWebKit/)) { //Jump the window view to the character selection screen
            window.location.href = "#oppSelect";
        } else {
            window.location.hash = "oppSelect";
        }
        RPGBattle.boolOppSelected = false; //Opponent selected flag to false
        this.intCharIndex = charIndex;
        btnReroll.attr("disabled",""); //Disables "Reroll character button"
        btnSelectChar.attr("disabled",""); //Disables "Select character button"
        btnBegin.attr("udCharIndex",charIndex); //Passes index of selected player character portrait to "begin battle" button
        $('div[udElementType="CharPicker"]').off(); //Disable character picker portraits.
        rowDivOppSelect.empty(); //Clears the Opponent selection area
        rowDivOppInfo.empty(); //Clears the Opponent info area
        if(this.boolBattleBegan === false){//if it's the first time choosing an opponent, move portraits from character area to opponent area
            btnReselect.removeAttr("disabled"); //Enables "Re-select character button"
            for(var i = 0; i< this.arGameCharacters.length; i++){ //Loop for turning characters into opponents
                if(i != charIndex){ //Skips the selected caharacter's index
                    var $tempelement = $('div[udelementtype="CharPicker"][udcharindex="'+i+'"]'); //Stores character element inside a variable
                    $tempelement.off(); //Removes all event handlers from the character element
                    $tempelement.attr("udelementtype","OppPicker"); //Changes the element's attribute to identify as an opponent picker portrait
                    $tempelement.detach() //Removes the element from it's parent div (which is the character selection area)
                    $tempelement.appendTo(rowDivOppSelect);//Adds opponent portrait element to opponent selection area
                }
            }
        }
        else{//If it's not the first time selecting an opponent (defeated previous opponent)
            for(var i = 0; i< this.arGameCharacters.length; i++){
                if(i != charIndex){ //Skips the selected caharacter's index
                    var $tempelement = this.mCreatePicker(this.arGameCharacters[i]);
                    $tempelement.off(); //Removes all event handlers from the character element
                    $tempelement.attr("udelementtype","OppPicker"); //Changes the element's attribute to identify as an opponent picker portrait
                    $tempelement.appendTo(rowDivOppSelect);//Adds opponent portrait element to opponent selection area
                }
            }
        }
    //Assign onclick event to moved opponent portraits so they show info cards on the opponent area when clicked
        $('div[udElementType="OppPicker"]').off() //Removes all event handlers
        $('div[udElementType="OppPicker"]').on("click",function(){ //Assigns on click event to Opponen Picker Portraits
            var picker = $(this);
            $('div[udElementType="OppPicker"]').attr("style",""); //removes style from all "OppPicker" portraits
            picker.attr("style",RPGBattle.strPickerHighlight); //adds border to clicked "OppPicker" portrait
            RPGBattle.mDisplayInfoCard(rowDivOppInfo,picker.attr("udCharIndex")); //Creates and displays info card
            if(RPGBattle.boolAdvancedGame) RPGBattle.mDisplayInfoSkills(rowDivOppSkills,picker.attr("udCharIndex"));
            btnBegin.removeAttr("disabled"); //Enables "Begin battle" button
            var tempIndex = picker.attr("udCharIndex");
            btnBegin.attr("udCharIndex",charIndex); //Passes index of player character to "Begin battle" button
            btnBegin.attr("udOppIndex",tempIndex); //Passes index of selected opponent portrait to "Begin battle" button
        });
    //Assigns onclick event to "Begin battle" button
        //btnBegin = $("#btnBegin"); //Update button jquery reference (it now has "udCharIndex" and "udOppIndex" attributes)
        btnBegin.off(); //Removes all event handlers from button
        btnBegin.on("click",function(){ //Adds event handler
            var btn = $(this);
            var charIndex = btn.attr("udcharindex"); //Stores selected character index in temporary variable to use as argument
            var oppIndex = btn.attr("udoppindex"); //Stores selected opponent index in temporary variable to use as argument
            RPGBattle.boolOppSelected = true; //Sets opponent selected flag
            RPGBattle.intOppIndex = oppIndex; //Updates game object opponent index
            RPGBattle.mGameBeginBattle(charIndex,oppIndex); //Calls begin battle method
        });

    },

    mGameReselect:function(charIndex){//At opponent selection, returns all characters to the character selection area. Select character (Reroll) <= => Select Opponent [[(Reselect character)]] => Battle (Win,Lose) => Restart
        var RPGBattle = this;
        if (navigator.userAgent.match(/Chrome|AppleWebKit/)) { //Jump the window view to the character selection screen
            window.location.href = "#charSelect";
        } else {
            window.location.hash = "charSelect";
        }
        this.boolCharSelected = false; //Sets character selected flag to false
        btnReselect.attr("disabled",""); //Disables "Reselect character" button
        btnBegin.attr("disabled",""); //Disables "Begin battle" button
        btnReroll.removeAttr("disabled"); //Enables "Reroll characters" button
        $('div[udElementType="OppPicker"]').attr("style","") //removes border style from all "OppPicker" portraits (so none appear selected)
        for(var i = 0; i< this.arGameCharacters.length; i++){ //Loop for turning opponents into characters
            if(i != charIndex){ //Skips the selected caharacter's index
                var $tempelement = $('div[udelementtype="OppPicker"][udcharindex="'+i+'"]'); //Stores opponent element inside a variable
                $tempelement.off(); //Removes all event handlers from the opponent element
                $tempelement.attr("udelementtype","CharPicker"); //Changes the element's attribute to identify as character picker portrait
                $tempelement.detach() //Removes the element from it's parent div (which is the opponent selection area)
                $tempelement.appendTo(rowDivCharSelect);//Adds character portrait element to character selection area
            }
        }
        rowDivOppSelect.empty(); //Clears the Opponent selection area
        rowDivOppInfo.empty(); //Clears the Opponent info area
        rowDivOppSkills.empty(); //Clears the Opponent skills info area
        rowDivCharInfo.empty(); //Clears the Character info area
        rowDivCharSkills.empty(); //Clears the Character skills info area
        $('div[udElementType="CharPicker"]').attr("style","") //removes border style from all "CharPicker" portraits (so none appear selected)
        btnBegin.removeAttr("udoppindex"); //Removes selected opponent index attribute from "Battle Begin" button
        btnBegin.removeAttr("udcharindex"); //Removes selected character index attribute from "Battle Begin" button
        btnSelectChar.removeAttr("udcharindex"); //Removes selected character index attribute from "Select Character" button
    //Assign onclick event to moved character portraits so they show info cards on the character area when clicked
        $('div[udElementType="CharPicker"]').off() //Clears all event handlers from character picker portraits elements
        $('div[udElementType="CharPicker"]').on("click",function(){ //Assigns on click event handler
            var picker = $(this); //Stores elements in temporary variable
            $('div[udElementType="CharPicker"]').attr("style",""); //removes style from all "CharPicker" portraits
            picker.attr("style",RPGBattle.strPickerHighlight); //adds border to clicked "CharPicker" portrait
            RPGBattle.mDisplayInfoCard(rowDivCharInfo,picker.attr("udCharIndex")); //Creates and displays info card
            if(RPGBattle.boolAdvancedGame) RPGBattle.mDisplayInfoSkills(rowDivCharSkills,picker.attr("udCharIndex"));
            btnSelectChar.removeAttr("disabled"); //Enables "Select Char" button
            var tempIndex = picker.attr("udCharIndex");
            btnBegin.attr("udCharIndex",tempIndex); //Passes index of selected portrait to "begin battle" button
            btnSelectChar.attr("udCharIndex",tempIndex); //Passes index of selected portrait to "select character" button
        });

    },

    mGameRestart:function(){
        if (navigator.userAgent.match(/Chrome|AppleWebKit/)) window.location.href = "#charSelect";
        else window.location.hash = "charSelect";
        colDivBattlelog.empty(); //Clears the battlelog area
        if(this.boolAdvancedGame) this.mGameModeStart("advanced"); //Begin game with the last selected game mode
        else this.mGameModeStart("basic");
    },

    mGameBeginBattle:function(charIndex = 0, oppIndex = 0){ //Begins the battle with selected opponent. Select character (Reroll) <= => Select Opponent => [[Battle (Win,Lose)]] => Restart
        var RPGBattle = this;
        if(!this.boolBattleBegan){
        }
        if (navigator.userAgent.match(/Chrome|AppleWebKit/)) window.location.href = "#battleArea";
        else window.location.hash = "battleArea";
        this.boolBattleInProgress = true; //Sets battle in progress flag
    //Button control and clicker control
        btnReselect.attr("disabled",""); //Disable "reselect" button
        btnBegin.attr("disabled",""); //Disable "battle begin" button
        $('div[udElementType="OppPicker"]').off(); //Disable opponent picker portraits.
        btnRestart.removeAttr("disabled"); //Enable "restart game" button
    //Assign battle stats
        if (!this.boolBattleBegan) this.arGameCharacters[charIndex].intCurrHP = this.arGameCharacters[charIndex].intMaxHP; //First battle, fight at full HP
        if(this.boolAdvancedGame){ //For advanced game only, the stats are recalculated by character level
            //At the start of advanced mode battles, recover [intGameHPRecover]% of lost HP.
            this.mGameSetStats(this.arGameCharacters[charIndex]); //Assign stats for character
            this.mGameSetStats(this.arGameCharacters[oppIndex]); //Assign stats for opponent
            this.mGameSetBattleStats(this.arGameCharacters[charIndex]); //Assign stats for in battle use for character
            this.mGameSetBattleStats(this.arGameCharacters[oppIndex]); //Assign stats for in battle use for opponent
            this.arGameCharacters[charIndex].intCurrHP += Math.floor(this.intGameHPRecover*(this.arGameCharacters[charIndex].intMaxHP - this.arGameCharacters[charIndex].intCurrHP)); //Adjusts player HP based on game settings (100% recovered by default)
        }
        this.arGameCharacters[oppIndex].intCurrHP = this.arGameCharacters[oppIndex].intMaxHP; //Opponents always start battle at full HP
    //Generate battle areas appropriate section.
        colDivCharFight.empty(); //Removes elements from character battle area.
        if(!this.boolBattleBegan) { //First battle, game restart or play again
            colDivCharBuff.empty(); //Clears the Character Buff area.
            this.arCharBuffs = []; //Clears the Character Buff array.
        }
        colDivOppFight.empty(); //Removes elements from opponent battle area
        colDivOppBuff.empty(); //Clears the Opponent Buff area
        this.arOppBuffs = []; //Clears the Opponent buff array.
        colDivBattlelog.empty(); //Clears battle log.
        this.mCreateBattleCard(this.arGameCharacters[charIndex]).appendTo(colDivCharFight); //Create battle card and add it to the left battle section
        this.mCreateBattleCard(this.arGameCharacters[oppIndex]).appendTo(colDivOppFight); //Create battle card and add it to the right battle section    
    //Populate skill arrays
        this.arCharSkills = this.mBattleAssignSkills(charIndex,this.arCharSkills); //Assigns skills for player in the arCharSkills array
        this.arOppSkills = this.mBattleAssignSkills(oppIndex,this.arOppSkills); //Assigns skills for opponent in th arOppSkills array
        for(var i = 0; i < this.arOppSkills.length; i++){//Sets chargetime and cooldowns for Opponent skills
            this.arOppSkills[i].skCooldown = this.arOppSkills[i].skChargeTime; //Sets skill cooldown to the specified charge time
        }        
    //Create skill buttons for the player
        rowDivSkill.empty(); //Clears skills section from all elements
        for(var i = 0; i < this.arCharSkills.length; i++){
            this.mCreateSkillButton(this.arCharSkills[i],charIndex,oppIndex);
            if (!this.boolBattleBegan || this.boolGameCharResetCooldown){//If its the first battle, or the game setting is adjusted to true, set cooldowns for skills. 
                this.arCharSkills[i].skCooldown = this.arCharSkills[i].skChargeTime; //Sets skill cooldown to the specified charge time
                this.mDisplayApplyCooldown(this.arCharSkills[i]); //Updates display for skills with charge time (cooldown)
            }
            else {//Sets skill cooldowns to their values from las battle's last turn
                if (this.arCharSkillsCooldown[i] === undefined) this.arCharSkills[i].skCooldown = this.arCharSkills[i].skChargeTime //Number of stored skills from last battle is lower than total skills (because of newly learnt skills)
                else this.arCharSkills[i].skCooldown = this.arCharSkillsCooldown[i];
                this.mDisplayApplyCooldown(this.arCharSkills[i]); //Updates display for skills with charge time (cooldown)
            }
            if(this.arCharSkills[i].skCooldown === 0) this.mDisplayRemoveCooldown(this.arCharSkills[i]); //Remove cooldown for skills with no charge time, enabling buttons
        }
    //Sets on click event handler for skill buttons
        $("button[skillname]").off(); //clears all event handlers from buttons with "skillname" attribute
        if(this.boolAdvancedGame === true){//If it's the advanced game, both the player and the opponent make a move
            $("button[skillname]").on("click",function(){
                var playerMove = new Object;
                var opponentMove = new Object;
                var btn = $(this);
                var skill = RPGBattle.mFindObject(RPGBattle.arCharSkills,"skName",btn.attr("skillname"));
                skill.skCooldown = skill.skChargeTime;
                btn.tooltip('hide');
                playerMove = RPGBattle.mBattleMove(btn.attr("skillname"),btn.attr("udcharindex"),btn.attr("udoppindex"));
                opponentMove = RPGBattle.mBattleOppMove(btn.attr("udoppindex"),btn.attr("udcharindex"));
                RPGBattle.mBattleTurn(playerMove,opponentMove);

            });
        }
        else{//In basic game, only the player makes a move
            $("button[skillname]").on("click",function(){
                var btn = $(this);
                btn.tooltip('hide');
                RPGBattle.mBattleTurnBasic(btn.attr("skillname"),btn.attr("udcharindex"),btn.attr("udoppindex"));
            });
        }
        this.boolBattleBegan = true; //Sets battle began flag. Flag is reset at game restart, game won, or game over.
        this.boolBattleInProgress = true; //Sets flag for battle in progress. Flag is reset when the opponent has been defeated, or at game restart, (game over other wise).
    },
//=================================================================================================================================//
//--------------------------------------------- Dynamic elements methods----------------------------------------------------------//
//------------------------Those that change displayed information and affect HTML structure--------------------------------------//
//==============================================================================================================================//

    mCreatePicker:function(charObject = new Object){//Returns a portrait card with character name from a character object
        //Create the portrait selection card with bootstrap v4 classes
        var RPGBattle = this;
        var index = this.arGameCharacters.indexOf(charObject);
        var type = "";
        if(RPGBattle.boolCharSelected){ //If character is already selected, is selecting opponent
            type = "OppPicker";
        }
        else{
            type = "CharPicker";
        }
        var charPortrait = $("<div>",{
            class:RPGBattle.strPortraitContainer, 
            udElementType:type, udCharIndex: index 
        }).append(
            $("<div>",{class:"card "+RPGBattle.strPortraitCard}).append( //udClickable makes pointer turn into clicker when hovered
                $("<img>",{class:"card-img-top",src:charObject.strImgPortrait,alt:charObject.strName+" Pic"})
            )
        );
        return charPortrait;
    },
    
    mCreateInfoPic:function(charObject = {}, index = 0){//Creates a picture profile with bio.
        var RPGBattle = this;
        var index = this.arGameCharacters.indexOf(charObject);
        if (this.boolAdvancedGame) var desctext = charObject.strDescription;
        else var desctext = charObject.strDescriptionBasic;
        var imgCol = $("<div>",{
            class:RPGBattle.strBioColClass,//1 of 2 columns inside parent with battle portrait 
            udCharIndex: index
        }).append(
            $("<div>",{class:"row"}).append(//Row with character picture
                $("<div>",{class:"col-12"}).append(
                    $("<img>",{
                        class:RPGBattle.strBioImgClass, 
                        src: charObject.strImgProfile,
                        alt: charObject.strName+" Battle Pic"
                    })
                ) 
            ),
            $("<div>",{class:"row"}).append(//Row with character bio
                $("<div>",{class:"col-12"}).append(
                    $("<p>",{class:RPGBattle.strBioTextClass}).append( 
                        $("<small>",{html:desctext})
                    )
                ) 
            )
        );
        return imgCol;
    },
    
    mCreateInfoCards:function(charObject = new Object){//Creates a stats profile card with bars.
        //Tooltip and temporary variables depending on game mode
        var charName = charObject.strName;
        var strInfoColclass = this.strInfoColclass; //Column classes for holding card div
        var strInfoCardclass = this.strInfoCardclass; //Card div format classes
        var strCardTitleclass = this.strCardTitleclass; //Classes for formatting card title that has with character name
        var strDivProgressclass = this.strDivProgressclass; //Classes for the div that holds stat bars (the "unfilled" section of stat bars)
        var strProgressBarclass = this.strProgressBarclass; //Classes for the stat bars.
        var strSpanProgressBarText = this.strSpanProgressBarText; //Classes for the stat bars text
        //Temporary DOM variables with bootstrap v4 classes
        var infoCol = $("<div>",{class:strInfoColclass}); //Column for card div
        var infoCard = $("<div>",{class:"card "+strInfoCardclass}); //Card div
        var cardBody = $("<div>",{class:"card-body py-1 px-1"}); //Card body
        var cardTitle = $("<h6>",{class:"card-title "+strCardTitleclass,text:charName}); //Card title with character name

        //Build card body with title and stat bars
        cardBody.append(cardTitle); //Title of card (name of character)
        if(this.boolAdvancedGame){ //stat bars for Advanced Game
            var arStatText = [this.strShortHP+": ",this.strShortAttack+": ",this.strShortCounter+": ",this.strShortDefense+": ",this.strShortForceAttack+": ",this.strShortForceDefense+": ",this.strShortSpeed+": "];
            var arColors = [this.strBarColorHP,this.strBarColorAttack,this.strBarColorCounter,this.strBarColorDefense,this.strBarColorFAttack,this.strBarColorFDefense,this.strBarColorSpeed];//Classes for progress bars colors
            var arTooltips = [this.strTooltipHP,this.strTooltipAttackAdvanced,this.strTooltipCounterAdvanced,this.strTooltipDefenseAdvanced,this.strTooltipForceAttackAdvanced,this.strTooltipForceDefenseAdvanced,this.strTooltipSpeedAdvanced];
            var arMaxTotals = [this.mMaxProperty(this.arCharacters,"intBaseHP"),this.mMaxProperty(this.arCharacters,"intBaseAttack"),this.mMaxProperty(this.arCharacters,"intBaseCounter"),this.mMaxProperty(this.arCharacters,"intBaseDefense"),this.mMaxProperty(this.arCharacters,"intBaseForceAttack"),this.mMaxProperty(this.arCharacters,"intBaseForceDefense"),this.mMaxProperty(this.arCharacters,"intBaseSpeed")];
            var arValueNow = [charObject.intBaseHP,charObject.intBaseAttack,charObject.intBaseCounter,charObject.intBaseDefense,charObject.intBaseForceAttack,charObject.intBaseForceDefense,charObject.intBaseSpeed];
            var arValueDisplay = [charObject.intMaxHP,charObject.intAttack,charObject.intCounter,charObject.intDefense,charObject.intForceAttack,charObject.intForceDefense,charObject.intSpeed];
            for(i = 0; i < arStatText.length; i++){//Loop to build all stat progress bars
                var divProgress = $("<div>",{class:"progress "+strDivProgressclass, style:"padding: 1px;position:relative"}); //Div for progress bars
                var divProgressBar = $("<div>",{ //Progress bars
                    class: "progress-bar "+strProgressBarclass+" "+arColors[i], role:"progressbar",
                    "aria-valuenow":arValueNow[i], "aria-valuemin":"0", "aria-valuemax":arMaxTotals[i],
                    style:`width:${Math.floor(100*arValueNow[i]/arMaxTotals[i])}%`
                });
                var spanText = $("<span>",{
                    class:strSpanProgressBarText,
                    style:"position:absolute;width:100%",
                    "data-toggle":"tooltip", "data-animation": "true", title:arTooltips[i],
                    html:arStatText[i]+arValueDisplay[i]}
                );
                divProgress.append(divProgressBar,spanText);
                cardBody.append(divProgress);
            }
        }
        else{ //Stat bars for Basic Game
            var arStatText = [this.strShortHP+": ",this.strShortAttack+": ",this.strShortCounter+": "];
            var arColors = [this.strBarColorHP,this.strBarColorAttack,this.strBarColorCounter];//Classes for progress bars colors
            var arTooltips = [this.strTooltipHP,this.strTooltipAttackBasic,this.strTooltipCounterBasic];
            var arMaxTotals = [this.mMaxProperty(this.arCharacters,"intMaxHP"),this.mMaxProperty(this.arCharacters,"intAttack"),this.mMaxProperty(this.arCharacters,"intCounter")];
            var arValueNow = [charObject.intMaxHP,charObject.intAttack,charObject.intCounter];
            var arValueDisplay = [charObject.intMaxHP,charObject.intAttack,charObject.intCounter];
            for(i = 0; i < arStatText.length; i++){//Loop to build all stat progress bars
                var divProgress = $("<div>",{class:"progress "+strDivProgressclass, style:"padding: 1px"}); //Div for progress bars
                var divProgressBar = $("<div>",{ //Progress bars
                    class: "progress-bar "+arColors[i]+" "+strProgressBarclass, role:"progressbar",
                    "aria-valuenow":arValueNow[i], "aria-valuemin":"0", "aria-valuemax":arMaxTotals[i],
                    style:`width:${Math.floor(100*arValueNow[i]/arMaxTotals[i])}%`
                });
                var spanText = $("<span>",{
                    class:strSpanProgressBarText,
                    "data-toggle":"tooltip", "data-animation": "true", title:arTooltips[i],
                    html:arStatText[i]+arValueDisplay[i]
                });
                divProgress.append(divProgressBar,spanText);
                cardBody.append(divProgress);
            }
        }
        infoCard.append(cardBody);
        infoCol.append(infoCard);
        return infoCol;
    },
    
    mCreateBattleCard: function(charObject = new Object){ //Creates battle cards with profile pic and HP bars on the left for selected character or right for selected opponent
        var RPGBattle = this;
        var charIndex = this.arGameCharacters.indexOf(charObject);
        var hpPercent = Math.ceil(100*charObject.intCurrHP/charObject.intMaxHP);
        var strSpanBarBattleText = this.strSpanBarBattleText;
        var strDivBarBattle = this.strDivBarBattle;
    //Creates DOM object variable with bootsrap v4 classes
        var $battleCard = $("<div>",{class:"card "+RPGBattle.strCardBattle}).append( 
            $("<img>",{
                class:"card-img-top",
                src:charObject.strImgBattle,
                alt:charObject.strName+" Pic",
                udCharIndex:charIndex
            }),
            $("<div>",{class:"card-body py-1 px-1"}).append(
                $("<div>",{class:"progress "+strDivBarBattle,style:"position:relative"}).append(
                    $("<div>",{
                        class:"udHPbar progress-bar "+RPGBattle.strBarBattleHP,
                        role:"progressbar",
                        "aria-valuenow":"140",
                        "aria-valuemin":"0",
                        "aria-valuemax":"200",
                        style:"width:"+hpPercent+"%",
                        udcharindex:charIndex
                    }),
                    $("<span>",{
                        class:"udHPbarText "+strSpanBarBattleText,
                        style:"position:absolute;",
                        text:charObject.intCurrHP,
                        udcharindex:charIndex
                    })
                )
            )
        );

        return $battleCard;
    },

    mCreateSkillButton:function(skillObject,charIndex = 0,oppIndex = 0){ //Creates the Skill button in the battle area
        var RPGBattle = this;
        rowDivSkill.append(//Append skill button to "skills" area
            $("<div>",{
                class:RPGBattle.strSkBtnDivClass
            }).append(
                $("<button>",{
                    type:"button",
                    class:"btn "+RPGBattle.strSkBtnClass+" "+skillObject.skBtnColorClass, 
                    "data-toggle":"tooltip", "data-trigger":"hover", "data-animation":"true","data-html":"true", title:skillObject.skDescription,
                    text:skillObject.skNameDisplay,
                    udCharIndex:charIndex,
                    udOppIndex:oppIndex,
                    skillName:skillObject.skName
                })
            )
        );
        $(function(){$('[data-toggle="tooltip"]').tooltip()}); //Initialize tooltips
    },
    
    mDisplayInfoCard:function(HtmlParentElement, index = 0){//Displays an info card of the selected character (index) inside the specified HTMl element. Html element must be a bootstrap v4 row
        HtmlParentElement.empty();//Clear the display area
        this.mCreateInfoPic(this.arGameCharacters[index]).appendTo(HtmlParentElement);
        this.mCreateInfoCards(this.arGameCharacters[index]).appendTo(HtmlParentElement);
        $(function(){$('[data-toggle="tooltip"]').tooltip()}); //Initialize tooltips
    },

    mDisplayInfoSkills:function(HtmlParentElement, charIndex=0){ //Displays all the skills of the character with the [index] position inside the arGameCharacters array.
        HtmlParentElement.empty();//Clear the display area
        var skillsArray = this.arGameCharacters[charIndex].arSkills;
        var lvlArray = this.arGameCharacters[charIndex].arSkillLevels;
        var skill = new Object;
        var intLvl = 0;
        var strSkInfoDivClass = this.strSkInfoDivClass;
        var strSkInfoNameClass = this.strSkInfoNameClass;
        var strSkInfoTextClass = this.strSkInfoTextClass;
        skill = this.mFindObject(this.arGameSkills,"skName",this.arGameCharacters[charIndex].strDefaultSkill);
        HtmlParentElement.append(//Default attack skill
            $("<div>",{
                class:strSkInfoDivClass, 
                "data-toggle":"tooltip", "data-animation": "true", title:skill.skDescription
            }).append(
                $("<h6>",{
                    class:strSkInfoNameClass,
                    html:"<small style='color:"+skill.skTextDisplayColor+"'>"+skill.skNameDisplay+"</small>"
                }),
                $("<p>",{
                    class:strSkInfoTextClass, 
                    html:"Required Lvl: "+intLvl+""
                }),
                $("<p>",{
                    class:strSkInfoTextClass,
                    html:"Charge: "+skill.skChargeTime+" turns."
                })
            )
        );
        for(var i = 0; i < skillsArray.length; i++){ //Loop for the rest of skills
            if (lvlArray[i] !== undefined) intLvl = lvlArray[i];
            else intLvl = 1+Math.floor(i/2);
            skill = this.mFindObject(this.arGameSkills,"skName",skillsArray[i]);
            HtmlParentElement.append(
                $("<div>",{
                    class:strSkInfoDivClass,
                    "data-toggle":"tooltip", "data-trigger":"hover", "data-animation":"true","data-html":"true", title:skill.skDescription,
                }).append(
                    $("<h6>",{
                        class:strSkInfoNameClass,
                        html:"<small style='color:"+skill.skTextDisplayColor+"'>"+skill.skNameDisplay+"</small>"
                    }),
                    $("<p>",{
                        class:strSkInfoTextClass,
                        html:"Required Lvl: "+intLvl+""
                    }),
                    $("<p>",{
                        class:strSkInfoTextClass,
                        html:"Charge: "+skill.skChargeTime+" turns."
                    })
                )
            );
        }
        $(function(){$('[data-toggle="tooltip"]').tooltip();});//Initialize all tooltips
    },
    
    mDisplayBattleLog:function(HTMLParentelement,message = ""){
        var RPGBattle = this;
        HTMLParentelement.append(
            $("<p>",{
                class:RPGBattle.strBattleLogClass, 
                html:"<small>"+message+"</small>"
            })
        );
        colDivBattlelog.scrollTop(9999);
    },

    mDisplayUpdateHP: function(charIndex = 0){
        var currentHP = this.arGameCharacters[charIndex].intCurrHP;
        var maxHP = this.arGameCharacters[charIndex].intMaxHP;
        var percentage = Math.floor(100*currentHP/maxHP);
        $(".udHPbarText[udcharindex="+charIndex+"]").text(currentHP); //Updates text
        $(".udHPbar[udcharindex="+charIndex+"]").attr("style","width:"+percentage+"%"); //Updates progress %
    },
    
    mDisplayApplyCooldown:function(skillObject = new Object){//Disables buttons for player character
        var skillname = skillObject.skName;
        var skillbtndisplay = skillObject.skNameDisplay+"("+skillObject.skCooldown+")";
        $("button[skillname="+skillname+"]").attr("disabled","");//Disables button
        $("button[skillname="+skillname+"]").text(skillbtndisplay);
    },
    
    mDisplayRemoveCooldown:function(skillObject = new Object){
        var skillname = skillObject.skName;
        var skillbtndisplay = skillObject.skNameDisplay;
        $("button[skillname="+skillname+"]").removeAttr("disabled");//Enables button
        $("button[skillname="+skillname+"]").text(skillbtndisplay);
    },
    
    mDisplayAttachBuff: function(HTMLParentElement,buffObject = new Object, targetIndex = 0){
        var RPGBattle = this;
        var icon = "";
        var toolTipText = "";
        var toolTipSignOne = "";
        var toolTipSignTwo = "";
        var toolTipSignArray = ["+","++","+ "," +"," ","  "];
        var toolTipIconClass = [RPGBattle.strBuffIconUp,RPGBattle.strBuffIconUpUp,RPGBattle.strBuffIconUpDown,RPGBattle.strBuffIconUpDown,RPGBattle.strBuffIconDown,RPGBattle.strBuffIconDownDown];
        var statsArray = ["intCurrHP", "intCurrAttack", "intCurrCounter", "intCurrDefense", "intCurrForceAttack", "intCurrForceDefense", "intCurrSpeed"];
        var statsDisplay = [RPGBattle.strShortHP, RPGBattle.strShortAttack, RPGBattle.strShortCounter, RPGBattle.strShortDefense, RPGBattle.strShortForceAttack, RPGBattle.strShortForceDefense, RPGBattle.strShortSpeed];
        var btnColorClass = buffObject.skBtnColorClass;
        if (buffObject.buffDamage == 0){
            if(statsArray.includes(buffObject.skDamageStatPrimary) || statsArray.includes(buffObject.skDamageStatSecondary)) {
                toolTipText = "<span style='color:"+buffObject.skTextDisplayColor+"'>"+buffObject.skNameDisplay+"</span>";
                if(statsArray.includes(buffObject.skDamageStatPrimary)){
                    if (buffObject.skDamageMultPrimary > 1) toolTipSignOne = "+";
                    else toolTipSignOne = " ";
                    toolTipText += " | "+statsDisplay[statsArray.indexOf(buffObject.skDamageStatPrimary)]+" "+toolTipSignOne+Math.floor(100*buffObject.skDamageMultPrimary-100)+"%";
                }      
                if(statsArray.includes(buffObject.skDamageStatSecondary)){
                    if (buffObject.skDamageMultSecondary > 1) toolTipSignTwo = "+";
                    else toolTipSignTwo = " ";
                    toolTipText += " | "+statsDisplay[statsArray.indexOf(buffObject.skDamageStatSecondary)]+" "+toolTipSignTwo+Math.floor(100*buffObject.skDamageMultSecondary-100)+"%";
                }
                icon = toolTipIconClass[toolTipSignArray.indexOf(toolTipSignOne+toolTipSignTwo)];
                if(!statsArray.includes(buffObject.skDamageStatPrimary) && !statsArray.includes(buffObject.skDamageStatSecondary)) {
                    toolTipText = "<span style='color:"+buffObject.skTextDisplayColor+"'>"+buffObject.skNameDisplay+"</span> | "+buffObject.skDamageStatPrimary;
                    icon = this.strBuffIconSpecial;
                }
            }
            else{ //Use whatever the player determined for buff tooltip display. 
                toolTipText = "<span style='color:"+buffObject.skTextDisplayColor+"'>"+buffObject.skNameDisplay+"</span> | "+buffObject.skDamageStatPrimary;
                icon = this.strBuffIconSpecial;
            }
        }
        else {
            toolTipText = "<span style='color:"+buffObject.skTextDisplayColor+"'>"+buffObject.skNameDisplay+"</span> | "+buffObject.buffDamage+" damage";
            icon = RPGBattle.strBuffIconDamage
        }
        var buffDisplay = $("<button>",{
            class:"btn "+btnColorClass+" text-center my-1 mx-1",
            "data-toggle":"tooltip", "data-trigger":"hover", "data-animation":"true","data-html":"true", title:"<small>"+toolTipText+"</small>",
            udbuff:buffObject.skName,
            udtargetindex:targetIndex,
            html:"<i class='"+icon+"'></i>"
        });
        HTMLParentElement.append(buffDisplay);
        $(function(){$('[data-toggle="tooltip"]').tooltip()}); //Initialize tooltips
    },
//=======================================================================================================================//
//--------------------------------------------- In-Battle methods-------------------------------------------------------//
//-----------------------Those pertaining to the turn choices, order, and skill effects--------------------------------//
//====================================================================================================================//
    mBattleAssignSkills: function(charIndex = 0,skillArray =[]){//Creates in-battle skill arrays for both the player and the opponent by cloning objects from the skills collection array.
        skillArray = []; //empties character skills array
        var charObject = this.arGameCharacters[charIndex];
        var tempCharLevelBreaks = this.arGameCharacters[charIndex].arSkillLevels;
        var tempSkillArray = this.arGameCharacters[charIndex].arSkills;
        var skillName = this.arGameCharacters[charIndex].strDefaultSkill;
        var skillObject = this.mFindObject(this.arGameSkills,"skName",skillName);//Finds default skill object within the skills collection array that has the name of the character's "default" skill
        //Creates a CLONE (deep copy) of the skill to insert in the battle skill array. It has to be a copy, a new object, otherwise, the original skill object might get messed up if it has methods.
        var skillObjectClone = new Object;
        $.extend(skillObjectClone,skillObject);
        skillArray.push(skillObjectClone); //Adds default skill to the player's in-battle skill array
        //Level dependent skills (adavanced game only)
        if(this.boolAdvancedGame === true){
            for (i = 0; i < tempSkillArray.length; i++){ //Loops through the temp skill array
                if (charObject.intCharLevel >= tempCharLevelBreaks[i] && tempSkillArray[i] !== undefined){ //The character has reached the required level to learn the skill, and the skill exists                    
                    skillName = tempSkillArray[i]; //Temporarily stores skill name taken from the character object
                    skillObject = this.mFindObject(this.arGameSkills,"skName",skillName);//Finds skill object within the skills collection array that matches with the name.
                    //Creates a CLONE (deep copy) of the skill to insert in the battle skill array. It has to be a copy, a new object, otherwise, the original skill object gets messed up (javascript value vs reference)
                    skillObjectClone = new Object;
                    $.extend(skillObjectClone,skillObject);
                    skillArray.push(skillObjectClone); //Inserts the newly cloned object into the skill array
                }
            }
        }
        return skillArray;
    },    
    
    mBattleMove:function(skillname = "",skillCasterIndex = 0, skillRivalIndex = 0){ //Returns a choice object that represents the selected move in battle. Each choice containing 3 objects: caster, rival, and selected skill.
        var skillObject = new Object;
        var caster = this.arGameCharacters[skillCasterIndex];
        var rival = this.arGameCharacters[skillRivalIndex];
        if(skillCasterIndex == this.intCharIndex) skillObject = this.mFindObject(this.arCharSkills,"skName",skillname); //Retrieves skill object from character skills array
        else skillObject = this.mFindObject(this.arOppSkills,"skName",skillname); //Retrieves skill object from opponent skills array
        var choice = {caster:caster, rival:rival, skillObject:skillObject};
        return choice;
    },
    
    mBattleTurnBasic: function(skillName = "",charIndex = 0, oppIndex = 0){//The Basic Game turn.
        var char = this.arGameCharacters[charIndex];
        var opp = this.arGameCharacters[oppIndex];
        var skillObject = this.mFindObject(this.arCharSkills,"skName",skillName);
        var damage = char.intCurrAttack;
        var counter = opp.intCounter;    
    //Player deals damage
        this.arGameCharacters[charIndex].intCurrAttack += this.arGameCharacters[charIndex].intAttack; //Attack is increased. Note, attack of the character is 0 at the start, so we add it first.
        var message = this.mBattleMessage(skillObject,char,opp,damage); //Message Displayed
        this.mDisplayBattleLog(colDivBattlelog,message);
        this.mBattleDealDamage(this.arGameCharacters[oppIndex],damage); //Damage phase
        if (this.boolBattleInProgress===true){//After the damage, is the battle still in progress? (none have died)
    //Enemy counterattacks
            skillObject = this.mFindObject(this.arGameSkills,"skName","CounterAttack");
            message = this.mBattleMessage(skillObject,opp,char,counter);
            this.mDisplayBattleLog(colDivBattlelog,message);
            this.mBattleDealDamage(this.arGameCharacters[charIndex],counter);
        }
    },
    
    mBattleTurn: function(charMove = new Object, oppMove = new Object){ //The Advanced Game turn.
        this.intBattleTurnCount++;
        console.log("=====Begin turn "+this.intBattleTurnCount+"======");
        var player = charMove.caster;
        var opponent = oppMove.caster;
        var playSkill = charMove.skillObject;
        var oppSkill = oppMove.skillObject;
        var message = "";
        var damage = 0;
        message = "<span style='color:rgb(155,155,155)'>________[START OF TURN "+this.intBattleTurnCount+"]________</span>"
        this.mDisplayBattleLog(colDivBattlelog,message);
        //Start of turn actions: skill cooldowns, buffs, then multi-turn methods----------------------
        var buff = new Object;
        var skill = new Object;
        var buffArray = new Array;
        var skillArray = new Array;
        var targetObject = new Object;
        var casterObject = new Object;
        for(var i = 0; i < this.arCharSkills.length;i++){
            this.arCharSkills[i].skCooldown = Math.max(0,this.arCharSkills[i].skCooldown-1); //Reduces cooldown of player skills
            if(this.arCharSkills[i].skCooldown > 0) this.mDisplayApplyCooldown(this.arCharSkills[i]); //Updates display of skill buttons with cooldown
            else this.mDisplayRemoveCooldown(this.arCharSkills[i]); //Updates display of skill buttons with no cooldown (enables if disabled)
        }
        for(var i = 0; i < this.arOppSkills.length; i++){
            this.arOppSkills[i].skCooldown = Math.max(0,this.arOppSkills[i].skCooldown-1);//Reduces cooldown of PC controlled opponent skills
        }
        for (var change = 1; change <= 2; change++){
            if(change === 1){ //First, effects on the enemy, then on the player
                skillArray = this.arOppSkills;
                buffArray = this.arOppBuffs;
                targetObject = opponent;
                rivalObject = player;
                HTMLParentElement = colDivOppBuff;
            }
            else{
                skillArray = this.arCharSkills;
                buffArray = this.arCharBuffs;
                var tempint = this.intCharIndex
                targetObject =this.arGameCharacters[tempint];
                rivalObject = opponent;
                HTMLParentElement = colDivCharBuff;
            }
            if(buffArray.length > 0){ //If the character has active buffs
                for(var i = 0; i < buffArray.length; i++){ //Buffs
                    buff = buffArray[i];
                    if (buff.skDamageType === "none"){//Buff deals no damage, so it must affect stats.
                        if (targetObject[buff.skDamageStatPrimary] !== undefined) targetObject[buff.skDamageStatPrimary] = targetObject[buff.skDamageStatPrimary]*buff.skDamageMultPrimary;
                        if (targetObject[buff.skDamageStatSecondary] !== undefined) targetObject[buff.skDamageStatSecondary] = targetObject[buff.skDamageStatSecondary]*buff.skDamageMultSecondary;
                    }
                    else{ //Buff deals damage
                        message = this.mBattleMessageEffect(buff,targetObject,buff.buffDamage);
                        this.mDisplayBattleLog(colDivBattlelog,message);
                        this.mBattleDealDamage(targetObject,buff.buffDamage);
                    }
                    buff.buffTurns--;
                    if(buff.buffTurns <= 0){
                        $("button[udtargetindex ="+this.arGameCharacters.indexOf(targetObject)+"][udbuff="+buff.skName+"]").remove(); //Removes buff display
                        buffArray.splice(i,1);
                        i--
                    }
                }
            }
            for(var j = 0; j < skillArray.length; j++){ //Special multi-turn skill methods
                skill = skillArray[j];
                if (skill.skTurnRemaining > 0 && !skill.skSpecialEffect.includes("buff")){//Skills with a special method skMethodTurn, skips if they are buffs
                    skill.skMethodTurn(skill,targetObject,rivalObject,skill.skMethodAssist);
                    skill.skTurnRemaining--;
                }
            }
        }
        if (this.boolBattleInProgress){//If no one has died in the previous mess, continue with the battle moves
            if (player.intCurrSpeed >= opponent.intCurrSpeed){ //Player gets initiative when both speeds are equal.
                if((oppSkill.skSpecialEffect.includes("first") && !playSkill.skSpecialEffect.includes("first")) //If the Opponent used a "first" special effect skill 
                    || (playSkill.skSpecialEffect.includes("last") && !oppSkill.skSpecialEffect.includes("last")) //or the player used a "last" special effect skill
                ) this.mBattleTurnResolve(oppMove,charMove); //Opponent moves first
                else this.mBattleTurnResolve(charMove,oppMove); //Otherwise, player moves first
            }
            else { //Player is slower
                if((playSkill.skSpecialEffect.includes("first") && !oppSkill.skSpecialEffect.includes("first")) //If the player used a "first" special effect skill 
                    || (oppSkill.skSpecialEffect.includes("last") && !playSkill.skSpecialEffect.includes("last")) //or the opponent used a "last" special effect skill
                )this.mBattleTurnResolve(charMove,oppMove); //Player moves first
                else this.mBattleTurnResolve(oppMove,charMove); //Otherwise, Opponent moves first
            }
        }
    //End-of-turn actions: Return in-battle stats to their original values
        this.mGameSetBattleStats(player); //Assign stats for in battle use for character
        this.mGameSetBattleStats(opponent); //Assign stats for in battle use for opponent
    },
    
    mBattleTurnResolve: function(firstMove = new Object, secondMove = new Object){ //Resolves the turn actions
        console.log("------ Resolving Battle Turn ---------");
        this.mBattleUseSkill(firstMove);
        if (this.boolBattleInProgress){//No one died yet
            if(!this.boolBattleNomove) this.mBattleUseSkill(secondMove); //
            else{
                var message = secondMove.caster.strName+" was overwhelmed and couldn't make a move!";
                this.mDisplayBattleLog(colDivBattlelog,message);
            }
        }
        this.boolBattleNomove = false;
    },
    
    mBattleUseSkill: function(moveObject = new Object){ //Executes the move in battle. Applies damage and effects of the selected skill, including follow-ups and counters.
    var caster = moveObject.caster;
    var rival = moveObject.rival;
    var skill = moveObject.skillObject;
    console.log("___"+caster.strName.toUpperCase()+" USES SKILL "+skill.skNameDisplay.toUpperCase()+"__");
    var target = new Object;
    var damage = 0;
    var message = "";
    skill.skCooldown = skill.skChargeTime; //Sets skill cooldown
    if (this.arGameCharacters.indexOf(caster) == this.intCharIndex){ //Determines whether the caster is the player or the PC controlled opponent
        var casterBuffArray = this.arCharBuffs;//Sets buff arrays for adding buffs
        var rivalBuffArray = this.arOppBuffs;
        if(skill.skCooldown > 0) this.mDisplayApplyCooldown(skill); //Disables used skill for the player
    }
    else{
        var casterBuffArray = this.arOppBuffs;
        var rivalBuffArray = this.arCharBuffs;
    }
    if (skill.skTarget =="rival") target = rival;
    else if (skill.skTarget =="caster") target = caster;
    else target = "none";
    if(target !== "none"){ //The skill needs a valid target, otherwise, it does nothing.
    //Casting phase
        if(skill.skSpecialEffect.includes("buff") && skill.skSpecialEffect.includes("none")===false){//The skill is a buff. Skips damage and applies buff
            if(this.arGameCharacters.indexOf(target)==this.intCharIndex) var HTMLParentElement = colDivCharBuff; //Slect appropriate HTML section for displaying buff effects
            else var HTMLParentElement = colDivOppBuff;
            var buffObject = {
                skName: skill.skName,
                skNameDisplay: skill.skNameDisplay,
                skTextDisplayColor: skill.skTextDisplayColor,
                skBtnColorClass:skill.skBtnColorClass,
                skDamageType: skill.skDamageType,
                skDamageStatPrimary: skill.skDamageStatPrimary,
                skDamageStatSecondary: skill.skDamageStatSecondary,
                skDamageMultPrimary: skill.skDamageMultPrimary,
                skDamageMultSecondary: skill.skDamageMultSecondary,
                buffDamage:this.mBattleDamage(skill,caster,target),
                buffTurns: skill.skTurnRemaining
            };
            if(skill.skTarget==="caster") casterBuffArray.push(buffObject); //Pushes buff into buff arrays
            if(skill.skTarget==="rival") rivalBuffArray.push(buffObject);
            message = this.mBattleMessage(skill,caster,target,damage);
            this.mDisplayBattleLog(colDivBattlelog,message);
            this.mDisplayAttachBuff(HTMLParentElement,buffObject,this.arGameCharacters.indexOf(target));
        }
        else{//The skill is not a buff
            if (skill.skDamageType !== "none") damage = this.mBattleDamage(skill,caster,target);//The skill deals damage
            else damage = 0;
            message = this.mBattleMessage(skill,caster,target,damage);
            this.mDisplayBattleLog(colDivBattlelog,message);
            this.mBattleDealDamage(target,damage);
        }
        if(this.boolBattleInProgress===true){//The previous damage hasn't killed anyone yet
    //Special effects check
            if(skill.skSpecialEffect.includes("none")===false){ //The skill has special effects
                if(skill.skSpecialEffect.includes("nomove")) this.boolBattleNomove = true; //Temporarily sets "nomove" flag.
                if(skill.skSpecialEffect.includes("nocounter")) this.boolBattleNocounter = true; //Temporarily sets "nocounter" flag.
                if(skill.skSpecialEffect.includes("method")) skill.skMethodSpecial(skill,caster,rival,skill.skMethodAssist); //Runs the skill special method.
            }
        }
        if(this.boolBattleInProgress===true){//The previous damage hasn't killed anyone yet
    //Follow up attack
        var chanceMod = this.floatFollowAttackChanceMod;
            if(Math.random() <= chanceMod*Math.pow(caster.intCurrSpeed/rival.intCurrSpeed,2)){ //The chance to do a follow up attack grows exponentially the higher the caster's speed is related to the target
                var skillfollow = this.mFindObject(this.arGameSkills,"skName",caster.strDefaultFollow);
                damage = this.mBattleDamage(skillfollow,caster,target);
                message = this.mBattleMessage(skillfollow,caster,rival,damage);
                this.mDisplayBattleLog(colDivBattlelog,message);
                this.mBattleDealDamage(rival,damage);
            }   
        }    
        if(this.boolBattleInProgress===true){//The previous damage hasn't killed anyone yet
    //Counter phase
            if(this.boolBattleNocounter===true){//The skill prevented a counter attack.
                message = rival.strName+" couldn't land a counter attack!";
                this.mDisplayBattleLog(colDivBattlelog,message);
            }
            else {
                var skillcounter = this.mFindObject(this.arGameSkills,"skName",rival.strDefaultCounter);
                damage = this.mBattleDamage(skillcounter,rival,caster);
                message = this.mBattleMessage(skillcounter,rival,caster,damage);
                this.mDisplayBattleLog(colDivBattlelog,message);
                this.mBattleDealDamage(caster,damage);
            }
        }
    }
    this.boolBattleNocounter = false; //Return flag to original position.
    },

    mBattleDamage:function(skillObject = new Object, caster = new Object, target = new Object){ //Damage calculator for a given action(skill, caster, and target)
        var dmgType = skillObject.skDamageType;
        var tempint = this.arDmgTypeAttackProp.indexOf(dmgType);
        var defenseStat = this.arDmgTypeDefenseProp[tempint];
        var dmgStatprime = caster[skillObject.skDamageStatPrimary];
        var dmgStatsecond = caster[skillObject.skDamageStatSecondary];
        if (dmgStatprime === undefined) dmgStatprime = 0;
        if (dmgStatsecond === undefined) dmgStatsecond = 0;
        var dmgMultprime = skillObject.skDamageMultPrimary;
        var dmgMultsecond = skillObject.skDamageMultSecondary;
        var defstat = 0;
        var damage = 0;
        if (target[defenseStat] !== undefined && !skillObject.skSpecialEffect.includes("nodefense")) defstat = target[defenseStat]; //If the string of skill property "damage type" matches a character stat and there's no special effect, use that as defense.
        if (skillObject.skDamageType !== "none") damage = Math.max(this.intMinimumDamage,Math.floor(dmgStatprime*dmgMultprime + dmgStatsecond*dmgMultsecond - defstat)); //damage calculation if damage type is other than "none", or if the skill isn't a buff.
        return damage;
    },
    
    mBattleDealDamage: function(target = new Object, damage = 0){ //Reduces the target's Hit Points by the indicated amount. Everytime this happens, runs updates on the display, and checks victory / loss conditions
        var charIndex = this.arGameCharacters.indexOf(target);
        target.intCurrHP = Math.max(0,target.intCurrHP-damage);
        this.mDisplayUpdateHP(charIndex);
        //Conditions for win or lose
        if(target.intCurrHP === 0){//target's hp reaches 0
            if(this.arGameCharacters.indexOf(target) == this.intCharIndex) this.mBattleLose(); //If target is the player, lose battle
            else this.mBattleWin(charIndex); //If targe is the opponent, win battle
        }
    },

    mBattleMessage:function(skillObject = new Object, caster = new Object, target = new Object, damage){//Updates the battle log [parentHTMLelement] with the [message]
        //Message construction
        var battlemessage = "";
        var damageTypesExclude = [
            "intBaseHP","intBaseAttack","intBaseCounter","intBaseDefense","intBaseForceAttack","intBaseForceDefense","intBaseSpeed",
            "intMaxHP", "intAttack", "intCounter", "intDefense", "intForceAttack", "intForceDefense", "intSpeed",
            "intCurrHP", "intCurrAttack", "intCurrCounter", "intCurrDefense", "intCurrForceAttack", "intCurrForceDefense", "intCurrSpeed"
        ];
        var castername = caster.strName;
        var targetname = target.strName;
        var skaction =  skillObject.skTextDisplayAction;
        var skname = skillObject.skTextDisplaySkill;
        var skspecial = skillObject.skTextDisplaySpecial;
        var skdamagetype = skillObject.skDamageType;
        var sktarget = skillObject.skTarget;
        var color = skillObject.skTextDisplayColor;
        if(this.boolAdvancedGame===true){//For advanced game, displays damage type and special texts
            battlemessage = "<span style='color:rgb(155, 155, 155)'>Turn "+this.intBattleTurnCount+":</span> "+castername;
            if(skaction!=="") battlemessage += " "+skaction;
            if (skname !== "") battlemessage += '<span style="color:'+color+'"> '+skname+"</span> on";
            if (skspecial !== "") {
                battlemessage = battlemessage.substring(0,battlemessage.length-3)+" "+ skspecial;
            }
            else {
                battlemessage += " "+targetname+' for <span style="color:'+color+'">'+damage;
                if(skdamagetype !== "none" && this.arDmgTypeAttackProp.includes(skdamagetype) && !damageTypesExclude.includes(skdamagetype)) battlemessage += " "+skdamagetype+"</span> damage.";
                else battlemessage += "</span> damage.";
            }
        }
        else battlemessage = castername+" "+skaction+" "+targetname+' for <span style="color:'+color+'">'+damage+"</span> damage.";
        return battlemessage;
    },
    
    mBattleMessageEffect: function(buffObject = new Object, target = new Object,damage){//For buffs
        //Message construction
        var battlemessage = "";
        var damageTypesExclude = [
            "intBaseHP","intBaseAttack","intBaseCounter","intBaseDefense","intBaseForceAttack","intBaseForceDefense","intBaseSpeed",
            "intMaxHP", "intAttack", "intCounter", "intDefense", "intForceAttack", "intForceDefense", "intSpeed",
            "intCurrHP", "intCurrAttack", "intCurrCounter", "intCurrDefense", "intCurrForceAttack", "intCurrForceDefense", "intCurrSpeed"
        ];
        var targetname = target.strName;
        var skname = buffObject.skNameDisplay;
        var skdamagetype = buffObject.skDamageType;
        var sktarget = buffObject.skTarget;
        var color = buffObject.skTextDisplayColor;
        if (skname !== "") battlemessage += '<span style="color:'+color+'"> '+skname+":</span>";
        battlemessage += " "+targetname +" is hit for <span style='color:"+color+"'>"+damage;
        if(skdamagetype !== "none" && !damageTypesExclude.includes(skdamagetype)) battlemessage += " "+skdamagetype+"</span> damage.";
        else battlemessage += "</span> damage.";
        return battlemessage;
    },
    
    mBattleLose: function(){
        this.boolBattleInProgress=false;
        this.boolBattleBegan=false;
        var loseMessage = this.arGameCharacters[this.intCharIndex].strName+" is dead. "+this.strLose;
        this.mDisplayBattleLog(colDivBattlelog,loseMessage);
        $("button[skillname]").attr("disabled",""); //disables skill buttons
    },

    mBattleWin: function(charIndex){
        console.log("------Battle win!!!-----");
        var winMessage = "";
        this.boolBattleInProgress=false; //Battle is no longer in progress
        winMessage = this.arGameCharacters[charIndex].strName+" has been defeated! ";
        $("button[skillname]").attr("disabled",""); //disables skill buttons
    //Remove opponent from the game characters array, update indexes.
        var tempBuffindex = this.intCharIndex;
        var playerCharacter = this.arGameCharacters[this.intCharIndex];//Retrieves character object before splicing the array
        this.arGameCharacters.splice(charIndex,1); //Removes defeated opponent from game characters array
        this.intCharIndex = this.arGameCharacters.indexOf(playerCharacter); //Updates global player character index
        var tempCharNewIndex = this.intCharIndex;
        if(this.arGameCharacters.length > 1){//If there is at least one more character, aside from the player character, go to opponent selection
            rowDivOppSkills.empty(); //Clears opponent skills info
            rowDivOppInfo.empty(); //Clears opponent profile.
            colDivOppBuff.empty(); //Clears opponent buff area.
            colDivOppFight.empty(); //Clears opponent battle area.
            winMessage += "Select another opponent.";
            this.mDisplayBattleLog(colDivBattlelog,winMessage);
            if (this.boolAdvancedGame){
                for(var i = 0; i < this.arGameCharacters.length;i++){ //Level increase after battle victory
                    if(this.boolGameOpponentLevelUP){ //Increase level of undefeated opponents if specified in game settings.
                        this.arGameCharacters[i].intCharLevel += this.intGameCharLevelGain;
                    }
                    else if (i = tempCharNewIndex) this.arGameCharacters[i].intCharLevel += this.intGameCharLevelGain; //Otherwise, only character level goes up.
                    this.mGameSetStats(this.arGameCharacters[i]); //Recalculate game stats for characters (in case their level changed)
                }
                if(!this.boolGameCharResetCooldown){
                    for(var i = 0; i < this.arCharSkills.length; i++){//Stores current cooldown for character skills
                        this.arCharSkillsCooldown[i]=this.arCharSkills[i].skCooldown;
                    }
                }
                for (var i = 0; i < this.arCharBuffs.length; i++){//Updates player index on buff display objects
                    var buff = this.arCharBuffs[i];
                    var tempPlayerIndex = this.intCharIndex;
                    $("button[udtargetindex ="+tempBuffindex+"][udbuff="+buff.skName+"]").attr("udtargetindex",tempPlayerIndex); //Updates player reference on buffs.
                }
            }
            this.mDisplayInfoCard(rowDivCharInfo,this.intCharIndex); //Creates and displays info card
            this.mGamePlaceOpponents(this.intCharIndex); //Goes back to opponent selection area
        }
        else{//Only the player character remains
            winMessage += this.strWinGame;
            this.mDisplayBattleLog(colDivBattlelog,winMessage);
        }
    },
    
    //THIS ONE IS A LONG ONE! It checks a bunch of conditions to devise a strategy for the PC controlled opponent:
    //1. Creates 2 arrays, with skills that can be used in the next 2 turns
    //2. Estimates potential damage for each skill in those 2 arrays (considering stat altering buffs)
    //3. From the previous steps, creates a master array with strategies: pairs of skills that might be used this turn and the next, with their respective estimated damage.
    //4. Throws the master array into a desicion tree. This way the PC controlled opponent, can select 1 suitable strategy, depending on the conditions this turn (stats, opponents remaining, HP left).
    //5. Returns a "choice" object for the PC controlled opponent with caster, skill and target objects.
    mBattleOppMove: function(skillCasterIndex = 0, skillRivalIndex = 0){
        console.log("----------------BattleOppMove--------------");
        var casterObject = this.arGameCharacters[skillCasterIndex]; //Object of the opponent
        var rivalObject = this.arGameCharacters[skillRivalIndex]; //Object of the player (PC opponent's rival)
        var currHP = casterObject.intCurrHP; //HP of the opponent (to compare against player damage potential)
        var currDefense = casterObject.intCurrDefense; //Defense of the opponent
        var currSpeed = casterObject.intCurrSpeed; //Speed of the opponent (to check wether it moves first or second)
        var currCounter = casterObject.intCurrCounter; //Counter damage of the opponent
        var playerHP = rivalObject.intCurrHP; //HP of the player (to compare against opponent damage potential)
        var playerSpeed = rivalObject.intCurrSpeed; //Speed of the player (to check wether it moves first or second)
        var playerCounter = rivalObject.intCurrCounter; //Counter damage of the player
        var playerAttack = rivalObject.intCurrAttack; //Attack damage of the player
        var skillsThisTurn = new Array; //Skills that can be used this turn
        var skillsNextTurn = new Array; //Skills that can be used next turn
        var damageThisTurn = new Array; //Potential damage from skills this turn
        var damageNextTurn = new Array; //Potential damage from skills next turn
        var strategy = new Array; //Temporary array with 2 skill objects. A pairing that represents a posible play this turn and the next.
        var strategies = new Array; //Array with the collection of possible strategies. For comparison. The appropriate strategy will be returned as an NPC choice.
        var strategiesDamage = new Array; //Array with total damage for each strategy. For selecting the best strategy.
        var supportSkills = new Array; //Array with support skills (that don't deal damage, but boost stats or weaken the player's stats).
    //Constructs 2 arrays with skills that can be used in this turn, and skills that can be used on the next turn
        for(var i = 0; i < this.arOppSkills.length; i ++){//Adds the Opponent skill objects that can be used this turn and the next. Adds them backwards to give priority to advanced skills.
            var tempint = this.arOppSkills.length-1-i;
            if(this.arOppSkills[tempint].skCooldown == 0){
                var tempskill = this.arOppSkills[tempint];
                skillsThisTurn.push(tempskill); //Inserts skills that can be used this turn
            }
            if(this.arOppSkills[tempint].skCooldown <= 1){
                var tempskill = this.arOppSkills[tempint];
                skillsNextTurn.push(tempskill); //Inserts skills that can be used next turn
            }
        }
        for(var i = 0;i < skillsThisTurn.length; i++){
            var tempdamage = this.mBattleDamage(skillsThisTurn[i],casterObject,rivalObject)+Math.max(this.intMinimumDamage,casterObject.intCurrCounter-rivalObject.intCurrDefense);
            damageThisTurn.push(tempdamage); //Inserts estimated damage for this turn
        }
    //Building possible strategies. Makes skill pairs (for this turn, and the next turn) and estimates the potential damage of each pair
        for(var i = 0; i < skillsThisTurn.length; i++){ //Loops through possible skills this turn
            strategy = []; //Clears the strategy array.
            strategy[0]=skillsThisTurn[i]; //Inserts the skill on this turn into the strategy array.
            for(var j = 0; j < skillsNextTurn.length; j++){ //Loops through possible skills next turn
            //Estimate potential damage next turn, including buffs from this turn
                if(skillsThisTurn[i].skSpecialEffect.includes("buff") || (skillsThisTurn[i].skSpecialEffect.includes("method") && skillsThisTurn[i].skDamageType === "none")){ //The skill this turn is a buff
                    if(skillsThisTurn[i].skDamageType === "none"){ //The skill this turn is a stat altering buff (deals no damage)
                        if (skillsThisTurn[i].skTarget === "caster"){//The buff alters the caster's stats
                        //Store the original value of the caster stats, and modifies stats that will be affected by potentially casting the buff
                            if (casterObject[skillsThisTurn[i].skDamageStatPrimary] !== undefined){
                                var origStatValuePrime = casterObject[skillsThisTurn[i].skDamageStatPrimary]; //stores original stat value of primary modified stat
                                casterObject[skillsThisTurn[i].skDamageStatPrimary] = casterObject[skillsThisTurn[i].skDamageStatPrimary]*skillsThisTurn[i].skDamageMultPrimary; //temporarily adjust the caster's stats as if casting the buff value
                            }
                            if(casterObject[skillsThisTurn[i].skDamageStatSecondary] !== undefined){
                                var origStatValueSecond = casterObject[skillsThisTurn[i].skDamageStatSecondary]; //stores original stat value of secondary modified stat
                                casterObject[skillsThisTurn[i].skDamageStatSecondary] = casterObject[skillsThisTurn[i].skDamageStatSecondary]*skillsThisTurn[i].skDamageMultSecondary;//temporarily adjust the caster's stats as if casting the buff value
                            }
                        //Calculate potential damage next turn with modified stats
                            damageNextTurn[j] = this.mBattleDamage(skillsNextTurn[j],casterObject,rivalObject)+Math.max(this.intMinimumDamage,casterObject.intCurrCounter-rivalObject.intCurrDefense);
                        //Return stats to their original value
                            if (casterObject[skillsThisTurn[i].skDamageStatPrimary] !== undefined) casterObject[skillsThisTurn[i].skDamageStatPrimary] = origStatValuePrime;
                            if(casterObject[skillsThisTurn[i].skDamageStatSecondary] !== undefined) casterObject[skillsThisTurn[i].skDamageStatSecondary] = origStatValueSecond;
                        }
                        else if (skillsThisTurn[i].skTarget === "rival"){ //The buff alters the rival's stats (usually a debuff)
                        //Store the original value of the caster stats, and modifies stats that will be affected by potentially casting the buff
                            if (rivalObject[skillsThisTurn[i].skDamageStatPrimary] !== undefined){
                                var origStatValuePrime = rivalObject[skillsThisTurn[i].skDamageStatPrimary]; //stores original stat value of primary modified stat
                                rivalObject[skillsThisTurn[i].skDamageStatPrimary] = rivalObject[skillsThisTurn[i].skDamageStatPrimary]*skillsThisTurn[i].skDamageMultPrimary; //temporarily adjust the caster's stats as if casting the buff value
                            }
                            if(rivalObject[skillsThisTurn[i].skDamageStatSecondary] !== undefined){
                                var origStatValueSecond = rivalObject[skillsThisTurn[i].skDamageStatSecondary]; //stores original stat value of secondary modified stat
                                rivalObject[skillsThisTurn[i].skDamageStatSecondary] = rivalObject[skillsThisTurn[i].skDamageStatSecondary]*skillsThisTurn[i].skDamageMultSecondary;//temporarily adjust the caster's stats as if casting the buff value
                            }
                        //Calculate potential damage next turn with modified stats
                            damageNextTurn[j] = this.mBattleDamage(skillsNextTurn[j],rivalObject,rivalObject)+Math.max(this.intMinimumDamage,casterObject.intCurrCounter-rivalObject.intCurrDefense);
                        //Return stats to their original value
                            if (rivalObject[skillsThisTurn[i].skDamageStatPrimary] !== undefined) rivalObject[skillsThisTurn[i].skDamageStatPrimary] = origStatValuePrime;
                            if (rivalObject[skillsThisTurn[i].skDamageStatSecondary] !== undefined) rivalObject[skillsThisTurn[i].skDamageStatSecondary] = origStatValueSecond;
                        }
                        else{//There is a typo somewhere in the skTarget, or the skill is something else entirely...
                            damageNextTurn[j] = 0; //Because yes
                        }
                    }
                    else{//The skill this turn is a damage dealing buff
                    //Run a sheer damage calculation, doesn't matter if a buff or otherwise (a short version of the main game's one, without reestrictions and special effects)
                        var damageprime = 0;
                        var damagesecond = 0;
                        var defstat = 0;
                        var turnsbuff = skillsThisTurn[i].skTurnRemaining;
                        if (casterObject[skillsThisTurn[i].skDamageStatPrimary] !== undefined) damageprime = casterObject[skillsThisTurn[i].skDamageStatPrimary]*skillsThisTurn[i].skDamageMultPrimary;
                        if (casterObject[skillsThisTurn[i].skDamageStatSecondary] !== undefined) damagesecond = casterObject[skillsThisTurn[i].skDamageStatSecondary]*skillsThisTurn[i].skDamageMultSecondary 
                        if (rivalObject[skillsThisTurn[i].skDamageType] !== undefined) defStat = rivalObject[skillsThisTurn[i].skDamageType];
                        var intdmgthisturn = Math.max(this.intMinimumDamage,Math.floor(damageprime + damagesecond - defStat));
                        var intdmgnextturn = this.mBattleDamage(skillsNextTurn[j],casterObject,rivalObject)+Math.max(this.intMinimumDamage,casterObject.intCurrCounter-rivalObject.intCurrDefense);
                        damageNextTurn[j] = (intdmgthisturn*turnsbuff + intdmgnextturn); //The damage that will be done by the damage buff skills cast on this turn + The damage that will be done by the damage skills next turn.
                    }
                }
                else damageNextTurn[j] = this.mBattleDamage(skillsNextTurn[j],casterObject,rivalObject)+Math.max(this.intMinimumDamage,casterObject.intCurrCounter-rivalObject.intCurrDefense); //The skill this turn is a regular damage skill. Inserts estimated damage for next turn.
                if(strategy[0].skChargeTime === 0 || strategy[0] !== skillsNextTurn[j]){ //If the skill on this turn has charge time, it can't be used next turn. This condition filters out imposible combinations.
                    strategy[1]=skillsNextTurn[j]; //Inserts the skill next turn into strategy.
                    strategies.push([strategy[0],strategy[1]]); //Inserts the possible strategy pair to the strategies array.
                    strategiesDamage.push(damageThisTurn[i]+damageNextTurn[j]); //Inserts the possible strategy total damage to the strategies damage array.
                }
            }
        }
        console.log("Possible strategies and damage-------------");
        for(var i = 0; i < strategies.length; i++){
                console.log(strategies[i][0].skName+" | "+strategies[i][1].skName+" | "+strategiesDamage[i]);
        }
    //Strategy selection
        var maxDamageStrategy= new Array;
        maxDamageStrategy.push(strategies[strategiesDamage.indexOf(Math.max.apply(Math,strategiesDamage))]); //Strategy with the highest damage output.
        var maxDamageStrategyThisTurn = skillsThisTurn[damageThisTurn.indexOf(Math.max.apply(Math,damageThisTurn))]; //Strategy this turn with the highest damage output.
        console.log("--------------Opponent Decision tree-------------");
        var boolChoiceMade = false;
        var choiceStrategy = new Object; //For storing the selected skill depending on the situation.
        for (var i = 0; i < strategiesDamage.length; i++){//First loop through the strategies damage array, is there a winning Strategy?
            if(strategiesDamage[i]+2*currCounter > playerHP && currHP >= 2*Math.max(this.intMinimumDamage,(playerAttack + playerCounter - 2*currDefense)) && !boolChoiceMade){ //If there's at least a strategy that'll kill the player in the next few turns(including buffs), without getting wiped out, use it
                console.log("I can kill the player in the next few turns. Let's go with this:");
                choiceStrategy = strategies[i][0]; //Chooses killer strategy
                boolChoiceMade = true;
            }
        }
        if(!boolChoiceMade){//No winning strategy. Select a suitable move.
            if(this.arGameCharacters.length > 2) console.log("I cannot kill the player in the next few turns. I'm not the only opponent remaining...");
            else console.log("I cannot kill the player in the next few turns an I'm the last one standing.")
            if(currHP <= 3*Math.max(this.intMinimumDamage,(playerAttack + playerCounter - 2*currDefense))){
                console.log("But I'm about to get my ass kicked! I need to do something now!");
                if(currSpeed > playerSpeed) console.log("I know I'm faster, so...");
                else console.log("I'm not fast enough");
            }
            else console.log("Also, I've got enough HP left.");
            for (var i = 0; i < strategiesDamage.length; i++){ //Second loop to select suitable strategy
                if(this.arGameCharacters.length > 2 && boolChoiceMade === false){// If there's no winning strategy, but there are more opponents left
                    if(currHP <= 3*Math.max(this.intMinimumDamage,(playerAttack + playerCounter - 2*currDefense)) && !boolChoiceMade){ //At risk of getting wiped out in the next 2-3 turns
                        if(currSpeed > playerSpeed  && boolChoiceMade === false){
                            if(strategies[i][0].skSpecialEffect.includes("buff") && strategies[i][0].skDamageMultPrimary < 0 && strategies[i][0].skTarget === "rival"){
                                console.log("I'll weaken the player! The next opponent will have an easier time when I'm gone:");
                                choiceStrategy = strategies[i][0] ; //If theres a debuff to use this turn, use it
                                boolChoiceMade = true;
                            }
                            else if(strategies[i][0].skSpecialEffect.includes("nomove") && currSpeed > playerSpeed && !boolChoiceMade){
                                console.log("I can make the player skip the turn, get a free shot in:");
                                choiceStrategy = strategies[i][0]; //If theres a skill to make the player skip a turn, use it
                                boolChoiceMade = true;
                            }
                            else if(strategies[i][0].skSpecialEffect.includes("nocounter") && !boolChoiceMade){
                                console.log("I might prevent a couple of damage points using this:");
                                choiceStrategy = strategies[i][0]; //If theres a skill to make the player skip a counter, use it
                                boolChoiceMade = true;
                            }
                            else if(strategies[i][0].skSpecialEffect.includes("method") && !boolChoiceMade){
                                console.log("This might get me an edge:");
                                choiceStrategy = strategies[i][0]; //Use a special method skill
                                boolChoiceMade = true;
                            }
                            else if(!boolChoiceMade){//If still no suitable strategy, go for max damage
                                console.log("I'll try to deal as much damage as posible this turn.");
                                choiceStrategy = maxDamageStrategyThisTurn; //Otherwise deal the maximum possible damage over the next few turns.
                                boolChoiceMade = true;
                            }
                        }
                        else{
                            if(strategies[i][0].skSpecialEffect.includes("first") && boolChoiceMade === false){ 
                                console.log("I'd better try to get one last cheap shot in. This will do:");
                                choiceStrategy = strategies[i][0]; //If theres a skill to move before the player, use it
                                boolChoiceMade = true;
                            } 
                            else if(strategies[i][0].skSpecialEffect.includes("nocounter") && boolChoiceMade === false){
                                console.log("Oh crap, I've got nothing. I might prevent a couple of damage points using this:");
                                choiceStrategy = strategies[i][0]; //If theres a skill to make the player skip a counter, use it
                                boolChoiceMade = true;
                            }
                            else if(boolChoiceMade === false) {//If still no suitable strategy, go for max damage
                                console.log("I'll try to deal as much damage as posible this turn.");
                                choiceStrategy = maxDamageStrategyThisTurn;
                                boolChoiceMade = true;
                            }
                        }
                    }
                    else{//No winning strategy, not the last opponent, no risk of getting wiped in the next few turns
                        if(strategies[i][0].skSpecialEffect.includes("buff") && strategies[i][0].skDamageMultPrimary > 1 && strategies[i][0].skTarget === "caster" && boolChoiceMade === false){
                            console.log("I know! I'll get buff!");
                            choiceStrategy = strategies[i][0]; //If theres a buff to use this turn, use it
                            boolChoiceMade = true;
                        } 
                        if(strategies[i][0].skSpecialEffect.includes("buff") && strategies[i][0].skDamageMultPrimary < 0 && strategies[i][0].skTarget === "rival" && boolChoiceMade === false){
                            console.log("I should weaken the character.");
                            choiceStrategy = strategies[i][0]; //If theres a debuff to use this turn, use it
                            boolChoiceMade = true;
                        }
                        if(strategies[i][0].skSpecialEffect.includes("method") && boolChoiceMade === false){
                            console.log("This will make things interesting!");
                            choiceStrategy = strategies[i][0]; //If theres a skill to make the player skip a turn, use it
                            boolChoiceMade = true;
                        } 
                        if(strategies[i][0].skSpecialEffect.includes("nomove") && currSpeed > playerSpeed && boolChoiceMade === false){
                            console.log("Well, I'm faster, so let's mess with the player for a bit.");
                            choiceStrategy = strategies[i][0]; //If theres a skill to make the player skip a turn, use it
                            boolChoiceMade = true;
                        }
                        else if(boolChoiceMade === false) {//If still no suitable strategy, go for max damage
                            console.log("I'll try to deal as much damage as posible this turn.");
                            choiceStrategy = maxDamageStrategy[0][0]; //Otherwise deal the maximum possible damage over the next few turns.
                            boolChoiceMade = true;
                        }
                    }
                }
                else if(strategies[i][0].skSpecialEffect.includes("nomove") && currSpeed > playerSpeed && boolChoiceMade === false){
                    console.log("Well, I'm faster, so let's mess with the player for a bit.");
                    choiceStrategy = strategies[i][0]; //If theres a skill to make the player skip a turn, use it
                    boolChoiceMade = true;
                }

            }
        }
        if (boolChoiceMade === false){//If still no suitable strategy, go for max damage
            console.log("I'll deal as much damage as posible.");
            choiceStrategy = maxDamageStrategy[0][0]; //Otherwise deal the maximum possible damage over the next few turns.
        }
        console.log(choiceStrategy);
        var skillName = choiceStrategy.skName; //Assigns the skill name to use this turn in a variable
        var choice = this.mBattleMove(skillName,skillCasterIndex,skillRivalIndex); //Make a move
        return choice;
    }
}