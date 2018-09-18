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
        strDescription: "The youngest Jedi Knight to ever attain such rank. An offensive powerhouse, highly skilled with the lightsaber and capable of drawing power from both sides of the Force. His recklessness makes him vulnerable to attacks.",
        strDescriptionBasic: "The youngest Jedi Knight to ever attain such rank. Anakin was a slave at Tatooine when discovered by Qui Gon Jinn and Obi Wan Kenobi, who later became his master. Rumored to be the one who would bring balance to The Force.",
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
        strDescription: "A skilled Jedi Knight and commander in the Grand Army of the Republic, trained in the ways of the Jedi by Anakin. Makes up for her low offensive power with high speed and strong counters.",
        strDescriptionBasic: "A skilled Jedi Knight and commander in the Grand Army of the Republic, trained in the ways of the Jedi by Anakin. Low HP but high counter-attack damage.",
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
        strDescription: "Jedi Master and member of the Jedi Council. He is skilled in both the Light Side of the Force and fighting with a lightsaber. A well balanced charcter with all around decent stats.",
        strDescriptionBasic: "Jedi Master and member of the Jedi Council. At the request of dying Qui Gon Jinn, Obi Wan mentored Anakin on the ways of the Force. A well balanced character.",
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
        strDescription: "Grand Master of the Jedi Order and high seat at the Jedi Council. Small and frail, but his incredible speed and powerful control of the Light Side of the Force make him a deadly fighter.",
        strDescriptionBasic: "Grand Master of the Jedi Order and high seat at the Jedi Council. For over eight-hundred years he mentored others in the ways of the Force. Small and frail with an overwhelming attack.",
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
        strDescription: "A Sith assassin, renowned for her cruelty and skill with dual lightsabers. Decent attack and speed coupled with Dark Side powers, but lacking in defense.",
        strDescriptionBasic: "At various points throughout her life she was a slave, a Jedi Padawan, a bounty hunter, and now an assassin of the Sith, renowned for her skill with the lightsaber and cruelty.",
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
        strDescription: "Cyborg general, Supreme Commander of the Droid Army and warlord for the Confederacy of Independent Systems. Trained in the art of lightsaber combat. A defensive nightmare with low speed and very vulnerable to force attacks.",
        strDescriptionBasic: "Cyborg general, Supreme Commander of the Droid Army and warlord for the Confederacy of Independent Systems. Trained in the art of lightsaber combat by Count Dooku. A defensive nightmare with pitiful attack.",
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
        strDescription: "The first apprentice of the Sith Lord Darth Sidious. A defensive fighter adept at using the Dark Side of The Force and capable of dishing some nasty counter-attacks.",
        strDescriptionBasic: "The first apprentice of the Sith Lord Darth Sidious, and first Sith to fight the Jedi in over a millenia. A defensive fighter with strong counters.",
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
        strDescription: "A former Jedi Master turned to the Dark Side after growing disillusioned with the corruption in the government. Well versed in the Dark Side of the Force and high attack with a lightsaber, but suffers from low speed and mediocre defenses.",
        strDescriptionBasic: "A former Jedi Master that left the Order and the Republic after growing disillusioned with the corruption in the government. Now a Sith Lord who leads the Confederacy of Independent Systems as Head of State.",
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

    //________________________________________________ Methods _____________________________________ BEGIN

//-------------------------------------------------------------Game flow methods. Set falgs, enable / disable buttons, for each phase: Select character (Reroll) <= => Select Opponent => Battle (Win,Lose) => Restart
    mGameModeStart:function(mode="basic"){ //Main game flow function, called when choosing a game mode.
        if (navigator.userAgent.match(/Chrome|AppleWebKit/)) { //Jump the window view to the character selection screen
            window.location.href = "#charSelect";
        } else {
            window.location.hash = "charSelect";
        }

        console.log(`------Game Start(${mode})------`);
        //Set flags:
        this.boolGameModeSelected = true; //Sets game mode selected flag
        if (mode === "advanced") this.boolAdvancedGame = true; //Sets advanced game flag
        else this.boolAdvancedGame = false;
        this.boolCharSelected = false; //Sets character selection flag
        this.boolOppSelected = false; //Sets opponent selection flag
        this.boolBattleBegan = false; //Sets battle flag
        console.log(`Flags Set------------------- 
        boolGameModeSelected:${this.boolGameModeSelected},
        boolCharSelected:${this.boolCharSelected},
        boolOppSelected:${this.boolOppSelected},
        boolBattleBegan:${this.boolBattleBegan},
        boolAdvancedGame:${this.boolAdvancedGame}`)

        //Disable buttons
        btnSelectChar.attr("disabled","");
        btnReselect.attr("disabled","");
        btnReroll.attr("disabled","");
        btnBegin.attr("disabled","");

        //Enable reroll button
        btnReroll.removeAttr("disabled");

        //Populate game variables and arrays
        for (var i = 0; i<this.arCharacters.length;i++) { //Assign playing stats to every character depending on game mode and settings
            this.mGameSetStats(this.arCharacters[i])
        }
        console.log("Game stats rolled----------");
        console.log(this.arCharacters);

        this.mGameRollCharacters(this.arCharacters); //Choose [intGameCharacters] characters to play in game from general character array, creates portraits and profiles

        //Assigns onclick event to "select character button"
        btnSelectChar = $("#btnSelectChar"); //Update button jquery reference
        btnSelectChar.off(); //Removes all event handlers from button
        btnSelectChar.on("click",function(){ //Adds event handler
            console.log("btnSelectChar clicked");
            console.log(this);
            var btn = $(this);
            var charIndex = btn.attr("udcharindex"); //Stores selected character index in temporary variable to use as argument
            console.log(charIndex);
            RPGBattle.boolCharSelected = true; //Sets character selected flag
            RPGBattle.intCharIndex = charIndex; //Updates game object character index
            RPGBattle.mGamePlaceOpponents(charIndex); //Calls opponnent placement method
        });

    },

    mGameSetStats:function(charObject = {}){//Sets stats depending on game mode, base points and stat multipliers
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

        //Append character portraits in character selection area
        for(var i = 0; i< this.arGameCharacters.length; i++){
            var tempCol = this.mGameCreatePicker(this.arGameCharacters[i],i);
            tempCol.appendTo($("#rowDivCharSelect"));
        }

        //Assign onclick event to recently created character portraits, so they display info cards when clicked
        $('div[udElementType="CharPicker"]').off() //Removes all event handlers before adding a new one
        $('div[udElementType="CharPicker"]').on("click",function(){
            var picker = $(this);
            $('div[udElementType="CharPicker"]').attr("style",""); //removes style from all "CharPicker" portraits
            picker.attr("style","border: solid rgb(0, 223, 223)"); //adds border to clicked "CharPicker" portrait
            var HtmlParentElement = $("#rowDivCharInfo"); //Stores parent HTML to add info card
            RPGBattle.mDisplayInfoCard(HtmlParentElement,picker.attr("udCharIndex")); //Creates and displays info card
            btnSelectChar.removeAttr("disabled"); //Enables "Select character button"
            var tempIndex = picker.attr("udCharIndex");
            btnSelectChar.attr("udCharIndex",tempIndex); //Passes index of selected portrait to "select character" button
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

    mGamePlaceOpponents: function(charIndex){ //After character selection, moves the non-selected characters to the opponents area
        if (navigator.userAgent.match(/Chrome|AppleWebKit/)) { //Jump the window view to the character selection screen
            window.location.href = "#oppSelect";
        } else {
            window.location.hash = "oppSelect";
        }
        btnReroll.attr("disabled",""); //Disables "Reroll character button"
        btnSelectChar.attr("disabled",""); //Disables "Select character button"
        btnReselect.removeAttr("disabled"); //Enables "Re-select character button"
        $("#rowDivOppSelect").empty(); //Clears the Opponent selection area
        $("#rowDivOppInfo").empty(); //Clears the Opponent info area
        console.log(this);
        for(var i = 0; i< this.arGameCharacters.length; i++){ //Loop for turning characters into opponents
            if(i != charIndex){ //Skips the selected caharacter's index
                var $tempelement = $('div[udelementtype="CharPicker"][udcharindex="'+i+'"]'); //Stores character element inside a variable
                $tempelement.off(); //Removes all event handlers from the character element
                $tempelement.attr("udelementtype","OppPicker"); //Changes the element's attribute to identify as an opponent picker portrait
                $tempelement.detach() //Removes the element from it's parent div (which is the character selection area)
                $tempelement.appendTo($("#rowDivOppSelect"));//Adds opponent portrait element to opponent selection area
            }
        }

        //Assign onclick event to moved opponent portraits so they show info cards on the opponent area when clicked
        $('div[udElementType="OppPicker"]').on("click",function(){
            var picker = $(this);
            $('div[udElementType="OppPicker"]').attr("style",""); //removes style from all "CharPicker" portraits
            picker.attr("style","border: solid rgb(0, 223, 223)"); //adds border to clicked "CharPicker" portrait
            var HtmlParentElement = $("#rowDivOppInfo"); //Stores parent HTML to add info card
            RPGBattle.mDisplayInfoCard(HtmlParentElement,picker.attr("udCharIndex")); //Creates and displays info card
            btnBegin.removeAttr("disabled"); //Enables "Begin battle" button
            var tempIndex = picker.attr("udCharIndex");
            btnBegin.attr("udCharIndex",tempIndex); //Passes index of selected portrait to "select character" button
        });

    },

    mGameReselect:function(charIndex){//At opponent selection, returns all characters to the character selection area
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
                $tempelement.appendTo($("#rowDivCharSelect"));//Adds character portrait element to character selection area
            }
        }
        $("#rowDivOppSelect").empty(); //Clears the Opponent selection area
        $("#rowDivOppInfo").empty(); //Clears the Opponent info area
        $("#rowDivCharInfo").empty(); //Clears the Character info area
        $('div[udElementType="CharPicker"]').attr("style","") //removes border style from all "CharPicker" portraits (so none appear selected)


        //Assign onclick event to moved character portraits so they show info cards on the character area when clicked
        $('div[udElementType="CharPicker"]').off() //Clears all event handlers from "CharPicker" elements
        $('div[udElementType="CharPicker"]').on("click",function(){ //Assigns on click event handler
            var picker = $(this); //Stores elements in temporary variable
            $('div[udElementType="CharPicker"]').attr("style",""); //removes style from all "CharPicker" portraits
            picker.attr("style","border: solid rgb(0, 223, 223)"); //adds border to clicked "CharPicker" portrait
            var HtmlParentElement = $("#rowDivCharInfo"); //Stores parent HTML to add info card on character area
            RPGBattle.mDisplayInfoCard(HtmlParentElement,picker.attr("udCharIndex")); //Creates and displays info card
            btnSelectChar.removeAttr("disabled"); //Enables "Select Char" button
            var tempIndex = picker.attr("udCharIndex");
            btnSelectChar.attr("udCharIndex",tempIndex); //Passes index of selected portrait to "select character" button
        });

    },

//--------------------------------------------- Dynamic elements methods. Those that change displayed information
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
        var charPortrait = $("<div>",{
            class:"col-lg-3 col-md-4 col-6 h-100",
            udElementType:type,
            udCharIndex: index
        }).append(
            $("<div>",{
                class:"card h-100 w-100 bg-dark udClickable"
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

    mCreateInfoPic:function(charObject = {}, index = 0){//Creates a picture profile with bio.
        var desctext = "";
        if (this.boolAdvancedGame) desctext = charObject.strDescription;
        else desctext = charObject.strDescriptionBasic;
        var imgCol = $("<div>",{
            class:"col-md-6 col-12",//1 of 2 columns inside parent with battle portrait
            udCharIndex: index
        }).append(
            $("<div>",{class:"row"}).append(//First row with character pic
                $("<div>",{class:"col-12"}).append(
                    $("<img>",{
                        class:"card-img-top rounded",
                        src: charObject.strImgBattle,
                        alt: charObject.strName+" Battle Pic"
                    })
                ) 
            ),
            $("<div>",{class:"row"}).append(//First row with character bio
                $("<div>",{class:"col-12"}).append(
                    $("<p>",{class:"text-white text-justify"}).append(
                        $("<small>",{text:desctext})
                    )
                ) 
            )
        );
        return imgCol;
    },

    mGameCreateInfoCards:function(charObject = {},index = 0){//Creates a stats profile card with bars.
        //Tooltip and temporary variables depending on game mode
        var charName = charObject.strName;
        var tooltipHP = this.strTooltipHP;
        var maxtotalHP = this.mMaxProperty(this.arCharacters,"intBaseHP");
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
            //var barclasstxt = "progress-bar progress-bar-striped progress-bar-animated";
            //var progressclasstxt = "progress bg-secondary py-1";
            var infoCol = $("<div>",{"class":"col-md-6 col-12"}).append(//2 of 2 columns with info card
                $("<div>",{class:"card mx-auto bg-dark"}).append(
                    $("<div>",{class:"card-body py-1 px-1"}).append(
                        $("<h6>",{//Card title with character name
                            class:"card-title text-center",
                            text:charName
                        }),
                        //Stat values with progress vars. They should be filled dynamically depending on the current game's characters stats
                        $("<div>",{class:"progress bg-secondary", style:"padding: 1px"}).append(//--------------HP bar
                            $("<div>",{
                                class: "progress-bar progress-bar-striped progress-bar-animated bg-danger text-black", role:"progressbar",
                                "aria-valuenow":charObject.intMaxHP, "aria-valuemin":"0", "aria-valuemax":maxtotalHP,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipHP,
                                style:`width:${Math.floor(100*charObject.intBaseHP/maxtotalHP)}%`,
                                text:"HP"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary", style:"padding: 1px"}).append(//---------------Attack bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated bg-warning text-black", role:"progressbar",
                                "aria-valuenow":charObject.intAttack, "aria-valuemin":"0", "aria-valuemax":maxtotalAttack,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipAttack,
                                style:`width:${Math.floor(100*charObject.intAttack/maxtotalAttack)}%`,
                                text:"Attack"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary", style:"padding: 1px"}).append(//---------------Counter bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated bg-warning text-black", role:"progressbar",
                                "aria-valuenow":charObject.intCounter, "aria-valuemin":"0", "aria-valuemax":maxtotalCounter,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipCounter,
                                style:`width:${Math.floor(100*charObject.intCounter/maxtotalCounter)}%`,
                                text:"Counter"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary", style:"padding: 1px"}).append(//---------------Defense bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated bg-warning text-black", role:"progressbar",
                                "aria-valuenow":charObject.intDefense, "aria-valuemin":"0", "aria-valuemax":maxtotalDefense,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipDefense,
                                style:`width:${Math.floor(100*charObject.intDefense/maxtotalDefense)}%`,
                                text:"Defense"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary", style:"padding: 1px"}).append(//---------------ForceAttack bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated text-black", role:"progressbar",
                                "aria-valuenow":charObject.intForceAttack, "aria-valuemin":"0", "aria-valuemax":maxtotalForceAttack,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipForceAttack,
                                style:`width:${Math.floor(100*charObject.intForceAttack/maxtotalForceAttack)}%`,
                                text:"Force Att"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary", style:"padding: 1px"}).append(//---------------ForceDefense bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated text-black", role:"progressbar",
                                "aria-valuenow":charObject.intForceDefense, "aria-valuemin":"0", "aria-valuemax":maxtotalForceDefense,
                                "data-toggle":"tooltip", "data-animation": "true", title:tooltipForceDefense,
                                style:`width:${Math.floor(100*charObject.intForceDefense/maxtotalForceDefense)}%`,
                                text:"Force Def"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary", style:"padding: 1px"}).append(//---------------Speed bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated bg-success text-black", role:"progressbar",
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
                        $("<div>",{class:"progress bg-secondary", style:"padding: 1px"}).append(//--------------HP bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated bg-danger text-black", role:"progressbar",
                                "aria-valuenow":charObject.intMaxHP, "aria-valuemin":"0", "aria-valuemax":maxtotalHP,
                                "data-toggle":"tooltip", "data-animation": "true", 
                                "title":tooltipHP,
                                style:`width:${Math.floor(100*charObject.intBaseHP/maxtotalHP)}%`,
                                text:"HP"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary", style:"padding: 1px"}).append(//---------------Attack bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated bg-warning text-black", role:"progressbar",
                                "aria-valuenow":charObject.intAttack, "aria-valuemin":"0", "aria-valuemax":maxtotalAttack,
                                "data-toggle":"tooltip", "data-animation": "true", 
                                "title":tooltipAttack,
                                style:`width:${Math.floor(100*charObject.intAttack/maxtotalAttack)}%`,
                                text:"Attack"
                            })
                        ),
                        $("<div>",{class:"progress bg-secondary", style:"padding: 1px"}).append(//---------------Counter bar
                            $("<div>",{
                                class:"progress-bar progress-bar-striped progress-bar-animated bg-warning text-black", role:"progressbar",
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

    btnReselect.on("click",function(){
        RPGBattle.mGameReselect(RPGBattle.intCharIndex);
    });
}