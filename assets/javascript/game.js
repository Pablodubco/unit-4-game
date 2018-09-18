//Html buttons
var btnSelectChar = $("#btnSelectChar");
var btnReroll = $("#btnReroll");
var btnBegin = $("#btnBegin");
var btnReselect = $("#btnReselect");
var btnRestart = $("#btnRestart");
var btnPlayAdvanced = $("#btnPlayAdvanced");
var btnPlayBasic = $("#btnPlayBasic");

var RPGBattle = {
    //________________Game flow variables_________________________________
    boolGameModeSelected: false,
    boolAdvancedGame: false,
    boolCharSelected: false,
    boolOppSelected: false,
    boolBattleBegan: false,

    //____________________Starting parameters variables_________________________
    intGameCharacters: 4, //Number of characters per game (html and stats are currently configured for 4 characters)
    intStatHPMult: 18, //Base stat multiplier for HP (advanced game)
    intStatHPMultBasic: 33, //Base stat multiplier for HP (basic game)
    intStatAttackMult: 3, //Base stat multiplier for Attack (advanced game)
    intStatCounterMult: 2, //Base stat multiplier for Counter Attack (advanced game) 
    intStatDefenseMult: 3, //Base stat multiplier for Defense (advanced game)
    intStatForceAttackMult: 3, //Base stat multiplier for Force Attack (advanced game)
    intStatForceDefenseMult: 3, //Base stat multiplier for Force Defense (advanced game)
    intStatSpeedMult: 3, //Base stat multiplier for Speed (advanced game)
    //Stat tooltips-------------------------------------------------
    strTooltipHP: "Hit points. Reduced every time the character takes damage. Defeated if they reach 0.",
    strTooltipAttackAdvanced: "Affects damage dealt with regular attacks and weapon skills.",
    strTooltipCounterAdvanced: "Affects damage dealt back to attackers.",
    strTooltipDefenseAdvanced: "Reduces damage taken from regular attacks and weapon skills.",
    strTooltipForceAttackAdvanced: "Affects damage dealt with Force skills.",
    strTooltipForceDefenseAdvanced: "Reduces damage taken from Force skills.",
    strTooltipSpeedAdvanced: "Affects how soon the character acts in battle, gives a chance to score an additional attack at 50% power after every move.",
    strTooltipAttackBasic: "Only Player. Every time the character attacks, the damage dealt is increased by this amount.",
    strTooltipCounterBasic: "Only Opponents. Every time the character is attacked, deals this amount of damage back.",
    //Character base stats-------------------------------------------BEGIN
    arCharacters: [
        {
        strName: "Anakin",
        intBaseHP: 6, intBaseAttack: 4, intBaseCounter: 3, intBaseDefense: 1, intBaseForceAttack: 2, intBaseForceDefense: 1, intBaseSpeed: 3,
        intBaseSkillWA: 5, intBaseSkillWD: 1, intBaseSkillFL: 2, intBaseSkillFD: 2, intBaseSkillTot: 0,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intSkillWA: 0, intSkillWD: 0, intSkillFL: 0, intSkillFD: 0,
        strDescription: "The youngest Jedi Knight to attain such rank. An offensive powerhouse, higly skilled with the lightsaber and capable of drawing power from both sides of the Force, but his recklessness makes him vulnerable to attacks.",
        strSpecialName: "Rage",
        strImgPortrait: "assets/images/CharSelect_Anakin.jpg",
        strImgBattle: "assets/images/Portrait_Anakin.jpg"
        //strSpecialDescription: "<span class=\"udCyanText\">Rage</span>: For 3 turns, increase all damage dealt by 33%."
        },
        {
        strName: "Ahsoka",
        intBaseHP: 5, intBaseAttack: 3, intBaseCounter: 4, intBaseDefense: 1, intBaseForceAttack: 2, intBaseForceDefense: 1, intBaseSpeed: 4,
        intBaseSkillWA: 4, intBaseSkillWD: 3, intBaseSkillFL: 2, intBaseSkillFD: 1, intBaseSkillTot: 0,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intSkillWA: 0, intSkillWD: 0, intSkillFL: 0, intSkillFD: 0,
        strDescription: "A skilled padawan and Anakin's protegee. Makes up for her lack of offensive power with high speed and strong counters.",
        strSpecialName: "Rush",
        strImgPortrait: "assets/images/CharSelect_Ahsoka.jpg",
        strImgBattle: "assets/images/Portrait_Ahsoka.jpg"
        //strSpecialDescription: "<span class=\"udCyanText\">Rush</span>: Lightning fast attack at 100% damage that negates enemy's counter-attack."
        },
        {
        strName: "Obi Wan Kenobi",
        intBaseHP: 6, intBaseAttack: 3, intBaseCounter: 2, intBaseDefense: 2, intBaseForceAttack: 3, intBaseForceDefense: 1, intBaseSpeed: 3,
        intBaseSkillWA: 3, intBaseSkillWD: 4, intBaseSkillFL: 3, intBaseSkillFD: 0, intBaseSkillTot: 0,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intSkillWA: 0, intSkillWD: 0, intSkillFL: 0, intSkillFD: 0,
        strDescription: "The first Jedi to fight a Sith Lord in over a millenium. A Jedi Master with well balanced stats and versed in the light side of the Force.",
        strSpecialName: "High Ground",
        strImgPortrait: "assets/images/CharSelect_ObiWan.jpg",
        strImgBattle: "assets/images/Portrait_ObiWan.jpg"
        //strSpecialDescription: "<span class=\"udCyanText\">High Ground</span>: Boosts attack and defense by 25% for 2 turns."
        },
        {
        strName: "Master Yoda",
        intBaseHP: 4, intBaseAttack: 2, intBaseCounter: 3, intBaseDefense: 1, intBaseForceAttack: 4, intBaseForceDefense: 2, intBaseSpeed: 4,
        intBaseSkillWA: 3, intBaseSkillWD: 2, intBaseSkillFL: 5, intBaseSkillFD: 0, intBaseSkillTot: 0,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intSkillWA: 0, intSkillWD: 0, intSkillFL: 0, intSkillFD: 0,
        strDescription: "The eldest and wisest Jedi Master. Small and frail, but his high speed and powerful control of the Light Side of the Force make him a dangerous fighter.",
        strSpecialName: "Force Agility",
        strImgPortrait: "assets/images/CharSelect_Yoda.jpg",
        strImgBattle: "assets/images/Portrait_Yoda.jpg"
        //strSpecialDescription: "<span class=\"udCyanText\">Force Agility</span>: For 3 turns, gains a 33% chance to evade any incoming damage."
        },
        {
        strName: "Asajj Ventress",
        intBaseHP: 5, intBaseAttack: 3, intBaseCounter: 3, intBaseDefense: 2, intBaseForceAttack: 3, intBaseForceDefense: 1, intBaseSpeed: 3,
        intBaseSkillWA: 4, intBaseSkillWD: 4, intBaseSkillFL: 0, intBaseSkillFD: 2, intBaseSkillTot: 0,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intSkillWA: 0, intSkillWD: 0, intSkillFL: 0, intSkillFD: 0,
        strDescription: "Sith assassin, expert at dual wielding lightsabers. Decent attack and speed coupled with some Dark Side powers, but lacks in defense.",
        strSpecialName: "Dual Strike",
        strImgPortrait: "assets/images/CharSelect_Ventress.jpg",
        strImgBattle: "assets/images/Portrait_Ventress.jpg"
        //strSpecialDescription: "<span class=\"udCyanText\">Dual Strike</span>: The next attack or ability will trigger twice."
        },
        {
        strName: "General Grievous",
        intBaseHP: 9, intBaseAttack: 2, intBaseCounter: 4, intBaseDefense: 4, intBaseForceAttack: 0, intBaseForceDefense: 0, intBaseSpeed: 1,
        intBaseSkillWA: 5, intBaseSkillWD: 5, intBaseSkillFL: 0, intBaseSkillFD: 0, intBaseSkillTot: 0,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intSkillWA: 0, intSkillWD: 0, intSkillFL: 0, intSkillFD: 0,
        strDescription: "Commander of the Trade Federation. A living Droid with heavy armor and skilled with lightsabers. High HP and defense against weapons, but low speed and vulnerable to force attacks.",
        strSpecialName: "Blade Wall",
        strImgPortrait: "assets/images/CharSelect_Grievous.jpg",
        strImgBattle: "assets/images/Portrait_Grievous.jpg"
        //strSpecialDescription: "<span class=\"udCyanText\">Blade wall</span>: Increases defense and counter-attack damage by 25% for 2 turns."
        },
        {
        strName: "Darth Maul",
        intBaseHP: 7, intBaseAttack: 2, intBaseCounter: 3, intBaseDefense: 3, intBaseForceAttack: 1, intBaseForceDefense: 2, intBaseSpeed: 2,
        intBaseSkillWA: 3, intBaseSkillWD: 4, intBaseSkillFL: 0, intBaseSkillFD: 3, intBaseSkillTot: 0, intMaxHP: 0,
        intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intSkillWA: 0, intSkillWD: 0, intSkillFL: 0, intSkillFD: 0,
        strDescription: "Sith with a dual lightsaber staff. Well rounded stats leaning toward defense, and adept at using the dark side of the Force, good at dishing nasty counters.",
        strSpecialName: "Revenge",
        strImgPortrait: "assets/images/CharSelect_DarthMaul.jpg",
        strImgBattle: "assets/images/Portrait_DarthMaul.jpg"
        //strSpecialDescription: "<span class=\"udCyanText\">Revenge</span>: Counters any damage received at 150% power."
        },
        {
        strName: "Count Dooku",
        intBaseHP: 6,intBaseAttack: 4, intBaseCounter: 2, intBaseDefense: 2, intBaseForceAttack: 3, intBaseForceDefense: 2, intBaseSpeed: 1,
        intBaseSkillWA: 4, intBaseSkillWD: 2, intBaseSkillFL: 0, intBaseSkillFD: 4, intBaseSkillTot: 0,
        intMaxHP: 0, intAttack: 0, intCounter: 0, intDefense: 0, intForceAttack: 0, intForceDefense: 0, intSpeed: 0,
        intSkillWA: 0, intSkillWD: 0, intSkillFL: 0, intSkillFD: 0,
        strDescription: "A former Jedi Master turned to the Dark Side. Well versed in the Dark Side of the Force and high attack with a lightsaber that suffers from low speed and mediocre defenses.",
        strSpecialName: "Killer Plan",
        strImgPortrait: "assets/images/CharSelect_CountDooku.jpg",
        strImgBattle: "assets/images/Portrait_CountDooku.jpg"
        //strSpecialDescription: "<span class=\"udCyanText\">Killer Plan</span>: Force Attack is increased by 50% for 2 turns."
        }
    ],//Character base stats-----------------------------------------------------END


    //____________________________In Game dynamic variables___________________________
    arGameCharacters: [], //Temporary characters for current game
    arGameCharPicker: [], //Temporary character portraits for current game
    arGameCharProfileImage: [], //Temporary character profiles for current game (images)
    arGameCharProfileStats: [], //Temporary character profiles for current game (stat info)
    arGameOpponents: [], //Temporary opponents for current game
    arGameOppPicker:[], //Temporary opponent profiles for current game
    arGameOppProfileImage: [], //Temporary character profiles for current game (images)
    arGameOppProfileStats: [], //Temporary character profiles for current game (stat info)
    //Battle character variables---------------------------------------
    intCharIndex: 0,
    intCharHPMax: 0,
    intCharHPCurr: 0,
    intCharAttack: 0,
    intCharCounter: 0,
    intCharDefense: 0,
    intCharForceAttack: 0,
    intCharForceDefense: 0,
    intCharSpeed: 0,
    intCharSkillWA: 0,
    intCharSkillWD: 0,
    intCharSkillFL: 0,
    intCharSkillFD: 0,
    //Battle opponent variables-----------------------------------------
    intOppIndex: 0,
    intOppHPMax: 0,
    intOppHPCurr: 0,
    intOppAttack: 0,
    intOppCounter: 0,
    intOppDefense: 0,
    intOppForceAttack: 0,
    intOppForceDefense: 0,
    intOppSpeed: 0,
    intOppSkillWA: 0,
    intOppSkillWD: 0,
    intOppSkillFL: 0,
    intOppSkillFD: 0,

    //________________________________ Methods ______________________________ BEGIN

    //Game flow methods
    mGameModeStart:function(mode="basic"){ //The first selection the player makes to begin playing ("Play Basic" or "Play Advanced")
        if (navigator.userAgent.match(/Chrome|AppleWebKit/)) { //Jump the window view to the character selection screen
            window.location.href = "#charSelect";
        } else {
            window.location.hash = "charSelect";
        }

        console.log(`------Game Start(${mode})------`);
        //Set flags:
        this.boolGameModeSelected = true; //Sets game mode selected flag
        if (mode === "advanced") this.boolAdvancedGame = true; //Sets advanced game flag
        this.boolCharSelected = false;
        this.boolOppSelected = false;
        this.boolBattleBegan = false;
        console.log(`Flags Set------------------- 
        boolGameModeSelected:${this.boolGameModeSelected},
        boolCharSelected:${this.boolCharSelected},
        boolOppSelected:${this.boolOppSelected},
        boolBattleBegan:${this.boolBattleBegan},
        boolAdvancedGame:${this.boolAdvancedGame}`)

        //Disable buttons
        btnSelectChar.attr("disabled");
        btnReselect.attr("disabled");
        btnReroll.attr("disabled");
        btnBegin.attr("disabled");

        //Enable next phase buttons
        btnSelectChar.removeAttr("disabled");
        btnReroll.removeAttr("disabled");

        //Populate game variables and arrays
        for (var i = 0; i<this.arCharacters.length;i++) { //Assign playing stats to every character depending on game mode and settings
            this.mGameSetStats(this.arCharacters[i])
        }
        console.log("Game stats rolled----------");
        console.log(this.arCharacters);

        this.mGameRollCharacters(this.arCharacters); //Choose [intGameCharacters] characters to play in game from general character array, creates portraits and profiles

    },

    mGameSetStats:function(charObject = {}){
        if(this.boolAdvancedGame){ //Stats for advanced game mode
            charObject.intMaxHP = charObject.intBaseHP*this.intStatHPMult;
            charObject.intAttack = charObject.intBaseAttack*this.intStatAttackMult; 
            charObject.intCounter = charObject.intBaseCounter*this.intStatCounterMult; 
            charObject.intDefense = charObject.intBaseDefense*this.intStatDefenseMult; 
            charObject.intForceAttack = charObject.intBaseForceAttack*this.intStatForceAttackMult; 
            charObject.intForceDefense = charObject.intBaseForceDefense*this.intStatForceDefenseMult; 
            charObject.intSpeed = charObject.intBaseSpeed*this.intStatSpeedMult;
        }
        else{ //Stats for basic game mode
            charObject.intMaxHP = charObject.intBaseHP*this.intStatHPMultBasic;
            charObject.intAttack = Math.max(3,Math.ceil(2*(charObject.intBaseAttack+charObject.intBaseForceAttack+charObject.intBaseSpeed)-charObject.intBaseHP/2));
            charObject.intCounter = Math.ceil(2*charObject.intBaseCounter+charObject.intBaseDefense+charObject.intBaseForceDefense+0.75*charObject.intBaseHP);
        }
    },

    mGameRollCharacters:function(){ //Selects random [intGameCharcters] from the general character array and creates their portraits and profile cards
        this.arGameCharacters = [];
        for(var i = 0; i< this.arCharacters.length; i++){ //Inserts all elements from the master character array into the game array
            this.arGameCharacters.push(this.arCharacters[i]);
        }
        this.mSetCharcters(this.arGameCharacters, this.intGameCharacters); //Removes random characters from the game array until only [intGameCharacters] remain
        console.log("Game characters chosen-------------");
        console.log(this.arGameCharacters);
        $("#rowDivCharSelect").empty(); //Clears the character selection area
        $("#rowDivCharInfo").empty(); //Clears the character info area
        //this.mGameCreateInfoCards(this.arGameCharacters); //Create the HTML elements for displaying the character info, stores them into arCharInfo array

        //Append character portraits in character selection area
        for(var i = 0; i< this.arGameCharacters.length; i++){
            var tempCol = this.mGameCreatePicker(this.arGameCharacters[i],i);
            tempCol.appendTo($("#rowDivCharSelect"));
        }

        //Assign onclick event to recently created portraits
        $('div[udElementType="CharPicker"]').on("click",function(){
            var picker = $(this);
            $('div[udElementType="CharPicker"]').attr("style",""); //removes style from all "CharPicker" portraits
            picker.attr("style","border: solid rgb(0, 223, 223)"); //adds border to clicked portrait
            var HtmlParentElement = $("#rowDivCharInfo");
            RPGBattle.mDisplayInfoCard(HtmlParentElement,picker.attr("udCharIndex"));
        });
    },

    mSetCharcters: function(array = [], elements = 0){//Removes random elements from the array until only [intGameCharacters] remain
        var tempArray = array;
        var loopMax = array.length;
        for (var i = elements; i < loopMax; i++ ){
            var tempint = tempArray.length;
            tempArray.splice(Math.floor(Math.random()*tempint),1); //Removes a random element from the array
        }
        return tempArray; //Return the copied array with [intGameCharcters] characters
    },

    mGameCreatePicker:function(charObjetc = [],index=0){//Returns a portrait card with character name from a character object
        //Create the portrait selection card with bootstrap v4 classes
        var type = "";
        var onclickFunction = "";
        if(this.boolCharSelected){ //If character is already selected, is selecting opponent
            type = "OppPicker";
        }
        else{
            type = "CharPicker";
        }
        var charPortrait = $("<div>",{class:"col-lg-3 col-md-4 col-6 h-100"}).append(
            $("<div>",{
                class:"card h-100 w-100 bg-dark udClickable",
                udElementType:type,
                udCharIndex: index
            }).append( //udClickable makes pointer turn into clicker when hevored
                $("<img>",{
                    class:"card-img-top",
                    src:charObjetc.strImgPortrait,
                    alt:charObjetc.strName+" Pic"
                }),
                $("<div>",{class:"card-body py-0 text-center"}).append(
                    $("<h6>",{
                        class:"card-title text-center",
                        text: charObjetc.strName
                    })
                )
            )
        );
        return charPortrait;
    },

    mGameCreateInfoCards:function(charObject = {},index = 0){//Creates 1) an image profile card, 2) a stats profile card with bars.
        //Tooltip and temporary variables depending on game mode
        var charName = charObject.strName;
        var tooltipHP = this.strTooltipHP;
        var maxtotalHP = this.mMaxProperty(this.arCharacters,"intMaxHP");
        var maxtotalAttack = this.mMaxProperty(this.arCharacters,"intAttack");
        var maxtotalCounter = this.mMaxProperty(this.arCharacters,"intCounter");
        if(this.boolAdvancedGame){ //Specific tooltips and totals for Advanced Game
            var tooltipAttack = this.strTooltipAttackAdvanced;
            var tooltipCounter = this.strTooltipCounterAdvanced;
            var tooltipDefense = this.strTooltipDefenseAdvanced;
            var tooltipForceAttack = this.strTooltipForceAttackAdvanced;
            var tooltipForceDefense = this.strTooltipForceDefenseAdvanced;
            var tooltipSpeed = this.strTooltipSpeedAdvanced;
            var maxtotalDefense = this.mMaxProperty(this.arCharacters,"intDefense");
            var maxtotalForceAttack = this.mMaxProperty(this.arCharacters,"intForceAttack");
            var maxtotalForceDefense = this.mMaxProperty(this.arCharacters,"intForceDefense");
            var maxtotalSpeed = this.mMaxProperty(this.arCharacters,"intSpeed");
        }
        else{ //Specific tootlips and totals for Basic Game
            var tooltipAttack = this.strTooltipAttackBasic;
            var tooltipCounter = this.strTooltipCounterBasic;
        }
        //Create temporary DOM variables with bootstrap v4 classes
        if(this.boolAdvancedGame){//Stats for Advanced game
            var barclasstxt = "progress-bar progress-bar-striped progress-bar-animated";
            var progressclasstxt = "progress bg-secondary py-1";
            var infoCol = $("<div>",{"class":"col-md-6 col-12"}).append(//2 of 2 columns with info card
                $("<div>",{class:"card mx-auto bg-dark"}).append(
                    $("<div>",{class:"card-body py-1 px-1"}).append(
                        $("<h6>",{//Card title with character name
                            class:"card-title text-center",
                            text:charName
                        }),
                        //Stat values with progress vars. They should be filled dynamically depending on the current game's characters stats
                        $("<div>",{class:"progress bg-secondary py-1"}).append(//--------------HP bar
                            $("<div>",{
                                class: "progress-bar progress-bar-striped progress-bar-animated", role:"progressbar",
                                "aria-valuenow":charObject.intMaxHP, "aria-valuemin":"0", "aria-valuemax":maxtotalHP,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipHP,
                                style:`width:${Math.floor(100*charObject.intMaxHP/maxtotalHP)}%`,
                                text:"HP"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary py-1"}).append(//---------------Attack bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated", role:"progressbar",
                                "aria-valuenow":charObject.intAttack, "aria-valuemin":"0", "aria-valuemax":maxtotalAttack,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipAttack,
                                style:`width:${Math.floor(100*charObject.intAttack/maxtotalAttack)}%`,
                                text:"Attack"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary py-1"}).append(//---------------Counter bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated", role:"progressbar",
                                "aria-valuenow":charObject.intCounter, "aria-valuemin":"0", "aria-valuemax":maxtotalCounter,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipCounter,
                                style:`width:${Math.floor(100*charObject.intCounter/maxtotalCounter)}%`,
                                text:"Counter"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary py-1"}).append(//---------------Defense bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated", role:"progressbar",
                                "aria-valuenow":charObject.intDefense, "aria-valuemin":"0", "aria-valuemax":maxtotalDefense,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipDefense,
                                style:`width:${Math.floor(100*charObject.intDefense/maxtotalDefense)}%`,
                                text:"Defense"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary py-1"}).append(//---------------ForceAttack bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated", role:"progressbar",
                                "aria-valuenow":charObject.intForceAttack, "aria-valuemin":"0", "aria-valuemax":maxtotalForceAttack,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipForceAttack,
                                style:`width:${Math.floor(100*charObject.intForceAttack/maxtotalForceAttack)}%`,
                                text:"Force Attack"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary py-1"}).append(//---------------ForceDefense bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated", role:"progressbar",
                                "aria-valuenow":charObject.intForceDefense, "aria-valuemin":"0", "aria-valuemax":maxtotalForceDefense,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipForceDefense,
                                style:`width:${Math.floor(100*charObject.intForceDefense/maxtotalForceDefense)}%`,
                                text:"Force Defense"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary py-1"}).append(//---------------Speed bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated", role:"progressbar",
                                "aria-valuenow":charObject.intSpeed, "aria-valuemin":"0", "aria-valuemax":maxtotalSpeed,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipSpeed,
                                style:`width:${Math.floor(100*charObject.intSpeed/maxtotalSpeed)}%`,
                                text:"Speed"
                            })
                        ),
                    )
                )
            );
        }
        else{//Stats for basic game
            var infoCol = $("<div>",{"class":"col-sm-6 col-12"}).append(//2 of 2 columns with info card
                $("<div>",{class:"card mx-auto bg-dark"}).append(
                    $("<div>",{class:"card-body py-1 px-1"}).append(
                        $("<h6>",{//Card title with character name
                            class:"card-title text-center",
                            text:charName
                        }),
                        //Stat values with progress vars. They should be filled dynamically depending on the current game's characters stats
                        $("<div>",{class:"progress bg-secondary py-1"}).append(//--------------HP bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated", role:"progressbar",
                                "aria-valuenow":charObject.intMaxHP, "aria-valuemin":"0", "aria-valuemax":maxtotalHP,
                                "data-toggle":"tooltip", "data-animation": "true", 
                                "title":tooltipHP,
                                style:`width:${Math.floor(100*charObject.intMaxHP/maxtotalHP)}%`,
                                text:"HP"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary py-1"}).append(//---------------Attack bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated", role:"progressbar",
                                "aria-valuenow":charObject.intAttack, "aria-valuemin":"0", "aria-valuemax":maxtotalAttack,
                                "data-toggle":"tooltip", "data-animation": "true", 
                                "title":tooltipAttack,
                                style:`width:${Math.floor(100*charObject.intAttack/maxtotalAttack)}%`,
                                text:"Attack"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary py-1"}).append(//---------------Counter bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated", role:"progressbar",
                                "aria-valuenow":charObject.intCounter, "aria-valuemin":"0", "aria-valuemax":maxtotalCounter,
                                "data-toggle":"tooltip", "data-animation": "true", 
                                "title":tooltipCounter,
                                style:`width:${Math.floor(100*charObject.intCounter/maxtotalCounter)}%`,
                                text:"Counter"
                            })
                        ),
                    )
                )
            );
        }
        return infoCol;
    },
    mCreateInfoPic:function(charObject = {}, index = 0){
        var imgCol = $("<div>",{
            class:"col-md-6 col-12",
            udCharIndex: index
        }).append( //1 of 2 columns with battle portrait
            $("<img>",{
                class:"card-img-top",
                src: charObject.strImgBattle,
                alt: charObject.strName+" Battle Pic"
            })
        );
        return imgCol;
    },

    mDisplayInfoCard:function(HtmlParentElement,index=0){//Displays an info card of the selected character (index) inside the specified HTMl element. Html element must be a bootstrap v4 row
        HtmlParentElement.empty();//Clear the display area
        this.mCreateInfoPic(this.arGameCharacters[index],index).appendTo(HtmlParentElement);
        this.mGameCreateInfoCards(this.arGameCharacters[index],index).appendTo(HtmlParentElement);
        //HtmlParentElement.append(infoPic);//Inserts profile picture
        //HtmlParentElement.append(infoCard);//Inserts info card
        $(function () { //Initialize all tooltips
            $('[data-toggle="tooltip"]').tooltip()
        });
    },

    mMaxProperty: function(array = [],propertyName = ""){//Returns the max value for a specified property, from a collection of objects within an array
        var result = 0;
        if (array.length > 0){ //So it returns 0 if the array doesn't have any elements.
            result = Math.max.apply(
                Math, array.map(
                    function(object) { 
                        return object[propertyName]; 
                    }
                )
            );
        }
        return result;
    }
}

window.onload = function(){
    if (navigator.userAgent.match(/Chrome|AppleWebKit/)) { //Jump the window view to the character selection screen
        window.location.href = "#mainHeaderTextTop";
    } else {
        window.location.hash = "mainHeaderTextTop";
    }

    btnPlayBasic.on("click",function(){//Begin basic game
        RPGBattle.mGameModeStart("basic");
    });

    btnPlayAdvanced.on("click",function(){//Begin advanced game
        RPGBattle.mGameModeStart("advanced");
    });

    btnReroll.on("click",function(){
        RPGBattle.mGameRollCharacters();
    });
}