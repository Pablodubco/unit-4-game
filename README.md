# TURNED BASED RPG BATTLE GAME

Example code, intensive in jQuery and dynamic UI elements, for creating a Turned Based Battle Engine with a lot of configurable settings. The current implementation uses a Star Wars Clone Wars theme for characters, skills, and damage types.

[Try it here](https://pablodubco.github.io/unit-4-game/)

## Contents:

- [1 GENERAL DESCRIPTION](#general-description)
   - [1.1 Basic Game](#basic-game)
   - [1.2 Advanced Game](#advanced-game)

- [2 IMPLEMENTING](#implementing)
   - [2.1 Setting up the HTML file sections](#setting-up-the-html-file-sections)
      - [a) Required variable names](#required-variable-names)
   - [2.2 Starting up the game](#starting-up-the-game)

- [3 GAME FLOW AND PROPERTIES](#game-flow-and-properties)
   - [3.1 Understanding the game flow](#understanding-the-game-flow)
   - [3.2 General code layout and property lists](#general-code-layout-and-property-lists)
      - [a) General game settings and parameters](#general-game-settings-and-parameters)
      - [b) Display elements settings](#display-elements-settings)
      - [c) Stats and skills settings](#stats-and-skills-settings)
      - [d) In-game dynamic properties](#in-game-dynamic-properties)
      - [e) Collections](#collections)
      - [f) Methods](#methods)


## GENERAL DESCRIPTION

The example application has 2 modes:
* Basic
* Advanced

### Basic Game

The current implementation has the following rules:

1. Fetch 4 random characters from the general character collection.
1. Every character has 3 stats: hit points, attack, and counter-attack.
1. Select a character, the other 3 non selected characters become opponents.
1. Select an opponent and begin the battle.
1. The selected character may only attack. The selected opponent may only counter-attack.
1. Every time the selected character attacks, damage increases by the base attack value. 
1. The opponent will in turn deal a fixed amount of counter-attack damage back.
1. The selected character's hit points will not recover between each battle.
1. Win by defeating all opponents, lose by running out of HP before defeating all other 3 characters.
1. To beat the game, carefully select your character and the order of your opponents.

>**NOTE:** Not every character can win every game, but in every game there is at least 1 combination of character and opponents that results in a victory. The challenge is to decide which character to pick, and the order in which to defeat the opponents. Since the characters are chosen at random, some games might prove more challenging than others.

### Advanced Game

The current implementation has the following rules:

1. Fetch 4 random characters from the general character collection.
1. Select a character to beat the other 3.
1. Every character has 7 stats: hit points, attack, counter attack, defense, force attack, force defense, and speed.
1. Alternate turns with the opponent selecting an action for each turn.
1. Every character has 5 available skills in addition to the regular attack, for 6 available actions in total.
1. All characters start with low stats, the attack action, and 1 additional skill.
1. After every battle won, both the player character and remaining opponents increase stats and gain 2 additional skills. For the 3rd and final battle, the characters will have double the initial stats and 6 available actions to choose from.
1. The selected character's hit points recover fully before every battle.
1. Win by defeating all opponents, lose by running out of hit points.
1. To beat the game, carefully select your character and the order of your opponents.

>Note: Not every character can win every game, but in every game there is at least 1 combination of character and opponents that results in a victory. The challenge is to decide which character to pick, and the order in which to defeat the opponents. Some characters are stronger in the first battle, some in the second, and some shine in the last battle, depending on stats and available skills. Also, characters are strong or weak against other character's play style. There's not a single character that can win every time against every opponent.

[Try it here](https://pablodubco.github.io/unit-4-game/)

[Main index](#turned-based-rpg-battle-game)


## IMPLEMENTING

The code is completely self contained inside the game object, but not completely independent from the HTML layout: 

* It uses a Bootstrap v4 grid based layout, so the HTML file must use [Bootstrap v4](http://getbootstrap.com/docs/4.1/getting-started/introduction/) along with its javascript and jquery plugins.
* UI elements that are dynamically generated also have a specific layout, including Bootstrap v4 classes for rows, columns, text alignment, colors of elements, margins, padding, etc.
* An object property list for modifying the styles of dynamically generated elements is provided in the section: [Display elements settings](#display-elements-settings).

>Note: The styles can be easily changed with a CSS file and adjusting the class settings in the game object's properties lists. However, altering the actual layout of the dynamically generated elements will require digging through the game code to replace the appropriate jQuery generated elements for the UI. Basically, if you need to change anything that cannot be directly influenced by adding or removing classes (like parent and child elements), the game code has to be modified.

### Contents:

- [2.1 Setting up the HTML file sections](#setting-up-the-html-file-sections)
   - [a) Required variable names](#required-variable-names)
- [2.2 Starting up the game](#starting-up-the-game)

[Main index](#turned-based-rpg-battle-game)

______________________________________________

### Setting up the HTML file sections

* For implementing the game, include [Bootstrap v4](http://getbootstrap.com/docs/4.1/getting-started/introduction/) with the javascript plugins, [jQuery](https://jquery.com/) for dynamic elements, and [Popper.js](https://popper.js.org/) for tooltips (all og them available at the Bootstrap v4 link).
* Next, add the following 12 sections (tags) to your HTML file:
   1. Bootstrap v4 row `<div>` that will contain the characters selection portraits.
   1. Bootstrap v4 row `<div>` that will contain the opponents selection portraits.
   1. Bootstrap v4 row `<div>` that will contain the selected character's info profile, bio, and stats.
   1. Bootstrap v4 row `<div>` that will contain the selected opponent's info profile, bio, and stats.
   1. Bootstrap v4 row `<div>` that will contain the selected character's skills info.
   1. Bootstrap v4 row `<div>` that will contain the selected opponent's skills info.
   1. Bootstrap v4 column `<div>` that will contain the selected character's battle pic and hit points for battle
   1. Bootstrap v4 column `<div>` that will contain the selected opponent's battle pic and hit points for battle
   1. Bootstrap v4 column `<div>` that will contain the selected character's active buffs during battle.
   1. Bootstrap v4 column `<div>` that will contain the selected opponent's active buffs during battle.
   1. Bootstrap v4 row `<div>` that will contain the skill buttons for the player.
   1. Bootstrap v4 column `<div>` that will be updated with the battle messages each turn.
* Assign the suitable ids of your choice to each section.
* Include 5 Bootstrap v4 buttons in the HTML file. It's important for the buttons to have the appropriate Bootstrap v4 **_.btn_** class that will allow the game code to enable and disable them depending on which phase it's running. The 6 buttons will do the following actions:
   1. Select character.
   1. Re-roll characters.
   1. Re-select character.
   1. Begin Battle.
   1. Restart game.
* Give the file any desired style through css.

[Implementing index](#implementing) | [Main index](#turned-based-rpg-battle-game) |
| :---: | :---: |

#### Required variable names

The game code looks for these specific variable names to add the dynamically generated DOM elements to the appropriate HTML section and to enable or disable buttons. The variable names shouldn't be changed. If changed, replace them inside the game code with your own variable names.

For the HTML sections, in order:

1. rowDivCharSelect
1. rowDivOppSelect
1. rowDivCharInfo
1. rowDivOppInfo
1. rowDivCharSkills
1. rowDivOppSkills
1. colDivCharFight
1. colDivOppFight
1. colDivCharBuff
1. colDivOppBuff
1. rowDivSkill
1. colDivBattlelog

Example:

```javascript
var rowDivCharSelect = $("#rowDivCharSelect"); // Character selection
var rowDivOppSelect = $("#rowDivOppSelect"); // Opponent selection
var rowDivCharInfo = $("#rowDivCharInfo"); // Chracter info
var rowDivOppInfo = $("#rowDivOppInfo"); // Opponent info
var rowDivCharSkills = $("#rowDivCharSkills"); // Character skills
var rowDivOppSkills = $("#rowDivOppSkills"); // Opponent skills
var colDivCharFight = $("#colDivCharFight"); // Character battle area and HP bar
var colDivOppFight = $("#colDivOppFight"); // Opponent battle area and HP bar
var colDivCharBuff = $("#colDivCharBuff"); // Character buffs in battle
var colDivOppBuff = $("#colDivOppBuff"); // Opponent buffs in battle
var rowDivSkill = $("#skills"); // Player skill buttons
var colDivBattlelog = $("#battlelog"); // Battle log area

```

For the buttons, in order:

1. btnSelectChar
1. btnReroll
1. btnBegin
1. btnReselect
1. btnRestart 

Example:

```javascript
var btnSelectChar = $("#btnSelectChar"); // Select character
var btnReroll = $("#btnReroll"); // Re-roll characters
var btnReselect = $("#btnReselect"); //Re-select character
var btnBegin = $("#btnBegin"); //Begin batlle
var btnRestart = $("#btnRestart"); //Restart game
```

Finally, the game object name **_RPGBattle_** should remain unchanged. If changed, as with the variables, replace with the name of your choice inside the game code.

[Implementing index](#implementing) | [Main index](#turned-based-rpg-battle-game) |
| :---: | :---: |

____________________________________________________

### Starting up the game

* Create one or more buttons, divs or any other HTML elements that will serve as the trigger to start the game.

Example:

```html
<button id="button-play-basic">Play basic game!</button>
<button id="button-play-advanced">Play advanced game!</button>

```
* Add an on-click event to the HTML element to call on the **_mGameModeStart_** method, with the argument _"basic"_ for the basic game, and _"advanced"_ for the advanced game.

Example:

```javascript
window.onload = function(){
    var btnPlayBasic = $("#button-play-basic");
    var btnPlayAdvanced = $("#button-play-advanced");

    btnPlayBasic.on("click",function(){//Begin basic game
        RPGBattle.mGameModeStart("basic");
    });

    btnPlayBasic.on("click",function(){//Begin advanced game
        RPGBattle.mGameModeStart("basic");
    });
}
```

>**NOTE:** the game is set to be easily configurable by edditing the values in its properties, without needing to mess with a single line of code in the game logic methods. 
>Practically all strings, classes, characters, skills, damage types and stat names can be altered by changing the desired property value. The next sections go over how the game logic works, and how to change every possible configuration. 

> A footprint to follow when making an extensive theming of the battle game: 
> 1. Alter the character names, bio, and images by editing the character properties inside the [character collection](#characters-collection) array to your desired theme.
> 1. Alter the damage types and the defensive stats to use for reducing damage in the  **_[arDmgTypeAttackProp](#stats-and-skills-settings)_** and **_[arDmgTypeDefenseProp](#stats-and-skills-settings)_** array game properties.
> 1. Change the skill names, descriptions, color classes, effects and strengths in the [skills collection](#skills-collection) array and add them to the [characters' skill arrays](#characters-collection).
> 1. Adjust the [general game properties](#general-game-settings-and-parameters), to change how many characters play, how they level up, how many stats they gain uppon leveling up, etc.
> 1. Give it a visual change by modifying the display strings and styling classes in the [display elements properties settings](#display-elements-settings).
> If feeling up to it, add [skills with special methods]() to do all sorts of things, or alter the [game methods](#methods) to mess with the game logic.

[Back to index](#implementing)

[Back to main index](#turned-based-rpg-battle-game)


## GAME FLOW AND PROPERTIES

This section explains the game flow logic, the game settings properties lists, how to modify the items inside the characters and skills collections, and the methods lists.

### Contents:

- [3.1 Understanding the game flow](#understanding-the-game-flow)
   - [a) Game Start phase](#game-start-phase)
   - [b) Character selection phase](#character-selection-phase)
   - [c) Opponent selection phase](#opponent-selection-phase)
   - [d) Battle phase](#battle-phase)
   - [e) Victory or defeat phase](#victory-or-defeat-phase)

- [3.2 General code layout and property lists](#general-code-layout-and-property-lists)
   - [a) General game settings and parameters](#general-game-settings-and-parameters)
   - [b) Display elements settings](#display-elements-settings)
   - [c) Stats and skills settings](#stats-and-skills-settings)
   - [d) In-game dynamic properties](#in-game-dynamic-properties)
   - [e) Collections](#collections)
      - [e.1) Characters collection](#characters-collection)
      - [e.2) Skills collection](#skills-collection)
   - [f) Methods](#methods)
      - [f.1) General utility methods](#general-utility-methods)
      - [f.2) Game flow methods](#game-flow-methods)
      - [f.3) Dynamic elements methods](#dynamic-elements-methods)
      - [f.4) In-battle methods](#in-battle-methods)

[Back to main index](#turned-based-rpg-battle-game)
__________________________________________________________________

### Understanding the game flow

The game has 6 distinct phases:

1. [Game start](#game-start-phase)
1. [Character selection](#character-selection-phase)
1. [Opponent selection](#opponent-selection-phase)
1. [Battle](#battle-phase)
1. [Victory or defeat](#victory-or-defeat-phase)

| [Game properties index](#game-flow-and-properties) | [Main index](#contents) |
| :---: | :---: |

#### Game Start phase

* Begin the game by calling the method [mGameModeStart([mode])](#game-flow-methods) with the argument **_'basic'_** for the basic game and **_'advanced'_** for the advanced game. All dynamically generated HTML content will be cleared and all game flow flags returned to their default state.
* Calls method [mGameSetStats](#game-flow-methods) to adjust the [in-game stats]() of the character objects inside the character's collection array [arCharacters](#characters-collection).
* Calls method [mGameRollCharacters](#game-flow-methods), to fetch a number of characters from the character's collection array [arCharacters](#characters-collection) and add it to the in-game character's array [arGameCharacters](). Uses the [intGameCharacters](#general-game-settings-and-parameters) property to determine the number of characters fetched.
* The fetched character portraits and click events will be created by calling the method [mCreatePicker](#dynamic-elements-methods). 

| [Game flow index](#understanding-the-game-flow) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

#### Character selection phase

* By clicking on each character's portrait, display: 
   * The profile info, with bio and the stats card: calls the methods [mCreateInfoPic](#dynamic-elements-methods), [mCreateInfoCards](#dynamic-elements-methods), and [mDisplayInfoCard](#dynamic-elements-methods).
   * For the advanced game, display the character skills: method [mDisplayInfoSkills](#dynamic-elements-methods).
Two buttons are provided: _Re-roll characters_, and _Select character_.
* Clicking on the _Select character_ button advances the game phase to the [opponent selection phase](#opponent-selection-phase). Calls the method [mGamePlaceOpponents](#game-flow-methods) to move the unselected character portraits to the opponent selection area.
* Clicking the _Re-roll characters_ button calls the method [mGameRollCharacters](#game-flow-methods) and stays in the character selection phase.

| [Game flow index](#understanding-the-game-flow) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

#### Opponent selection phase

* By clicking on each character's portrait, display the profile info, as well as the skills (in the advanced game mode). Uses the same methods as in the character selection phase.
* Two buttons are provided: _Re-select character_, and _Begin battle_:
   * Clicking on the _Begin battle_ button advances the game phase to the [battle phase](#battle-phase). Calls the method [mGameBeginBattle](#game-flow-methods) to create the battle area, with the profile pics, HP bars, and generates skill buttons with their appropriate cooldown, depending on the game's settings.
   * Clicking the _Re-select character_ button calls the method [mGameReselect](#game-flow-methods) to remove portraits from the opponent selection area, and goes back to the character selection phase. The available characters are not re-rolled.

| [Game flow index](#understanding-the-game-flow) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

#### Battle phase

* A _Restart_ button is provided. Clicking it will call the [mGameRestart](#game-flow-methods) method to clear all dynamically generated elements, reset stats, reset character levels, and move to the game start phase.
* Calls the methods [mGameSetStats](#game-flow-methods) and [mGameSetBattleStats](#game-flow-methods) to update the battle stats for the game characters, including any stats gained by level up.
* Calls the method [mCreateBattleCard](#dynamic-elements-methods) to display the character and opponent profile pics with an HP bar.
* Advanced game mode actions:
   1. Calls the method [mBattleAssignSkills]() to assign the player's and opponent's skills in battle, depending on character level.
   1. Calls the method [mCreateSkillButton](#dynamic-elements-methods) to create the action buttons for the player.
   1. Calls the methods [mDisplayApplyCooldown](#dynamic-elements-methods) and [mDisplayRemoveCooldown](#dynamic-elements-methods) to enable or disable the skill buttons for the player, based on the assigned skill's properties.
* Battle is turned based, and has up to 5 sub phases, depending on the game mode:
   1. **Player's move selection:** Every battle turn is triggered by the player choosing an action for that turn. Calls the method [mBattleMove](#in-battle-methods) to register the player's choice. In the advanced game, calls the methods [mDisplayApplyCooldown](#dynamic-elements-methods) and [mDisplayRemoveCooldown](#dynamic-elements-methods) to enable or disable the skill buttons for the player, based on the assigned skill's properties.
   1. **Opponent's move selection:** Only in the advanced game mode, the PC controlled opponent chooses an appropriate move. Calls the method [mBattleOppMove](#in-battle-methods) to run a desicion tree based on the present battle conditions and available actions.
   1. **Battle turn begin:** In the basic game mode, calls the [mBattleTurnBasic](#in-battle-methods) method to have the player attack and the opponent counter attack. In the advanced game mode, calls the [mBattleTurn](#in-battle-methods) method to run start-of-turn actions and apply the effects of any buffs and special skill methods that might be active.
   1. **Battle turn resolve:** Only in the advanced game mode calls the [mBattleTurnResolve](#in-battle-methods) method. Resolves which character acts first, then executes the selected moves in order by calling the [mBattleUseSkill](#in-battle-methods) method.
* During battle, the battle log is handled by 3 methods:
    * [mBattleMesage](#in-battle-methods) constructs a message used for active skills, those selected by either the player or the opponent.
    * [mBattleMessageEffect](#in-battle-methods) constructs a message used for passive effects and buffs (i.e. a poison effect that reduces hit points each turn).
    * [mDisplayBattleLog](#dynamic-elements-methods) displays a message inside the battle log area.
* The damage during battle is handled by 3 methods: 
   * [mBattleDamage](#in-battle-methods): Calculates damage.
   * [mBattleDealDamage](#in-battle-methods): Applies damage by reducing the value in the character's current hp property.
   * [mDisplayUpdateHP](#dynamic-elements-methods): Updates displayed HP bar with the new value after damage was inflicted.
* Every time the [mBattleDealDamage](#in-battle-methods) is called, it checks the resulting value of the target character's hit points. If at any stage during battle, the current HP property value of any character is 0, the battle ends and the game moves to the victory or defeat phase.

| [Game flow index](#understanding-the-game-flow) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

#### Victory or defeat phase
* When the player character's hit points reach 0 before the opponent, calls the method [mBattleLose](#in-battle-methods). It disables all buttons and posible actions, except for the _Restart_ button. Displays a defeat message specified in the **_strLose_** property of the game object. 
* When the opponent character's hit points reach 0 before the player, calls the method [mBattleWin](#in-battle-methods). Depending on the number of opponents left, either:
   * If 1 or more opponents are left, displays an _opponent defeated_ message and moves the game to the opponent selection phase with the _Re-select character_ button disabled.
   * Otherwise, it disables all buttons and posible actions, except for the _Restart_ button. Displays a victory message specified in the **_strWin_** property of the game object.

| [Game properties index](#game-flow-and-properties) | [Main index](#contents) |
| :---: | :---: |
____________________________________________________

### General code layout and property lists

The game object code is organized into the following sections:

1. **[General game settings and parameters](#general-game-settings-and-parameters):** a list of properties that change the general behavior of the game.
1. **[Display elements settings](#display-elements-settings):** a list of properties that specify the classes for dynamically generated elements, mostly for styling purposes.
1. **[Stats and skills settings](#stats-and-skills-settings):** a list of properties used as tools for storing information. Modifying these won't have any effect.
1. **[In-game dynamic properties](#in-game-dynamic-properties):** a list of properties used as tools for storing information. Modifying these won't have any effect.
1. **[Collections](#collections):** the master collections of [characters](#characters-collection) and [skill objects](#skills-collection). Lists and explains their properties.
1. **[Methods](#methods):** the in-game functions.
   * **[General utility methods](#general-utility-methods):** array and values manipulation. 3 self explanatory utility functions used at various points throughout the game.
   * **[Game flow methods](#game-flow-methods):** these contain the logic for going through the game's phases.
   * **[Dynamic elements methods](#dynamic-elements-methods):** responsible for moving elements in the the DOM. Used to update the displayed information to the player and control interactive elements (buttons, tooltips, etc).
   * **[In-battle methods](#in-battle-methods):** the ones responsible for executing both the player's and opponent's choices during battle, triggering skill efects, dealinng damage, etc. Used during the game's "battle" phase.


| [Game properties index](#game-flow-and-properties) | [Main index](#contents) |
| :---: | :---: |

_____________________________________________

#### General game settings and parameters

The following properties can be changed to affect the **general behavior** of the game:

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| intGameCharacters | integer | Number of total characters to use per game. |
| intMinimumDamage | integer | Minimum damage posible during battle. |
| intGameHPRecover | integer | For advanced game. Recover this % of HP lost at the start of each battle. |
| boolGameCharResetCooldown | boolean | If true, skill cooldowns for the player get reset at the beginning of battle, otherwise they keep their cooldowns across battles. See skills section for more details |
| boolGameOpponentLevelUP | boolean | If true, opponents also level up after every battle. |
| boolGameCharStartLevel | boolean | If true, the selected character's **_intCharStartLevel_** property will be ignored and the starting level of the selected character is always 0. See [characater section](#characters-collection) for details. |

>**NOTE:** Changing the values of these parameters can drastically affect the game difficulty. For example, the game can be set to have many more characters to select from and fight against (current setting is 4 characters), and prevent HP recovery after every battle, have only the player character start at level 0, or only have the player character level up after every battle.

| [Game properties index](#game-flow-and-properties) | [Main index](#contents) |
| :---: | :---: |

_____________________________________________

#### Display elements settings

The following properties affect the **UI elements displayed**:

**Displayed strings**

General strings for [stats](#character-stat-properties), tooltips, [victory and defeat](#victory-or-defeat-phase) messages.

| **Property** | **Format** | **Description** |
| --- | --- | --- |
| strWinGame | string | Displayed in the battle log when the player beats all opponents. |
| strLose | string | Displayed in the battle log when the player is defeated. |
| strTooltipHP | string | The tooltip description for the HP stat. |
| strTooltipAttackAdvanced | string | The tooltip description for the Attack stat in the advanced game mode. |
| strTooltipCounterAdvanced | string | The tooltip description for the Counter stat in the advanced game mode. |
| strTooltipDefenseAdvanced | string | The tooltip description for the Defense stat in the advanced game mode. |
| strTooltipForceAttackAdvanced | string | The tooltip description for the Force Attack stat in the advanced game mode. |
| strTooltipForceDefenseAdvanced | string | The tooltip description for the Force Defense stat in the advanced game mode. |
| strTooltipSpeedAdvanced | string | The tooltip description for the Speed stat in the advanced game mode. |
| strTooltipAttackBasic | string | The tooltip description for the Attack stat in the basic game mode. |
| strTooltipCounterBasic | string | The tooltip description for the Counter stat in the basic game mode. |
| strShortHP | string | Short 3-5 length name for the HP stat in stat bars and buff tooltips. |
| strShortAttack | string | Short 3-5 length name for the Attack stat in stat bars and buff tooltips. |
| strShortCounter | string | Short 3-5 length name for the Counter stat in stat bars and buff tooltips. |
| strShortDefense | string | Short 3-5 length name for the Defense stat in stat bars and buff tooltips. |
| strShortForceAttack | string | Short 3-5 length name for the Force Attack stat in stat bars and buff tooltips. |
| strShortForceDefense | string | Short 3-5 length name for the Force Defense stat in stat bars and buff tooltips. |
| strShortSpeed | string | Short 3-5 length name for the Speed stat in stat bars and buff tooltips. |


**Style settings for character portraits**

[Character](#characters-collection) portraits are a Bootstrap column div container, that holds a Bootstrap card div, that has an image tag with the character portrait.

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strPortraitContainer | string | Bootstrap v4 column classes for the container that holds a character portrait card. |
| strPortraitCard | string | Classes for the card that holds the portrait image. |
| strPickerHighlight | string | Style used to highlight the portrait when selected. |


**Style settings for bio profiles in character profile**

The [character](#characters-collection) profile bio is a Bootstrap v4 column div that contains an image in the first row, and a paragraph with text in the second row.

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strBioColClass| string | Bootstrap v4 column classes for the bio profile container. |
| strBioImgClass| string | Classes for the bio profile image. |
| strBioTextClass| string | Classes for the bio profile text. |


**Style settings for stat bars in character profile**
The [character](#characters-collection) profile stats are a Bootstrap column that holds a Bootstrap card. The card has a title (character name), and a background div with foreground progress bars. On top of the progress bars there is a `<span>` for the text

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strInfoColclass | string | Bootstrap v4 column classes for holding the card div that has character name and stat bars. |
| strInfoCardclass | string | Style classes for the card div that has character name and stat bars. |
| strCardTitleclass | string | Style classes for card title that has character name. |
| strDivProgressclass | string | Style classes for the div that holds stat bars (the "unfilled" section of stat bars). |
| strProgressBarclass | string | Classes for the stat bars' style. |
| strSpanProgressBarText | string | Style of the span that holds text inside progress bars. |
| strBarColorHP | string | Color class of stat bar for HP. Doesn't affect in-battle stat bar |
| strBarColorAttack | string | Color class of stat bar for Attack. |
| strBarColorCounter | string | Color class of stat bar for Counter Attack. |
| strBarColorDefense | string | Color class of stat bar for Defense. |
| strBarColorFAttack | string | Color class of stat bar for Force Attack. |
| strBarColorFDefense | string | Color class of stat bar for Force Defense. |
| strBarColorSpeed | string | Color class of stat bar for Speed. |

>**NOTE:** avoid using a background color for the strSpanProgressBarText class. Otherwise, it will cover the progress bar, or use one with transparency.


**Style settings for skill info divs**
[Skill](#skills-collection) info divs are a Bootstrap v4 column with a header and 2 paragraphs- 

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strSkInfoDivClass| string | Bootsrap v4 column classes for the div that contains skill info |
| strSkInfoNameClass| string | Classes for the skill header name inside the skill info |
| strSkInfoTextClass| string | Classes for the skill text with required level and charge times inside the skill info |


**Style settings for battle portraits and HP bar**
[Battle](#battle-phase) portraits are Bootstrap v4 cards that hold an image (battle pic), and a progress container div (unfilled color of progress bars).
The progress container div holds the HP progress bar and a `<span>` with text displaying the number of remaining HP.

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strCardBattle | string | Classes for the Bootstrap 4 card that holds the battle pic and in-battle big HP bar. |
| strBarBattleHP | string | Classes for the in-battle big HP bar |
| strSpanBarBattleText | string | Classes for the in-batlle HP bar text |


**Style settings for skill buttons**
[Skill](#skills-collection) buttons are a Bootstrap v4 column div with a button. The button class is specified inside the skill's properties.

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strSkBtnDivClass| string | Bootstrap v4 column classes for the div container that will hold skill buttons |
| strSkBtnClass| string | Classes for the skill button |


**Style settings for buffs**
For adjusting the icons of [buffs](#buffs) displayed next to the character battle pic, during battle. Buffs are buttons automatically generated from the triggering skill's properties. They contain an icon depending on the stat effect and number of affected stats. For the current implementation, the icons are fetched from the [Font Awesome](https://fontawesome.bootstrapcheatsheets.com/) bootstrap css.

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strBuffIconUpUp| string | Icon class for a buff that raises 2 stats |
| strBuffIconUp| string | Icon class for a buff that raises 1 stat |
| strBuffIconUpDown| string | Icon class for a buff that raises 1 stats and lowers the other |
| strBuffIconDown| string | Icon class for a buff that lowers 1 stat |
| strBuffIconDownDown| string | Icon class for a buff that lowers 2 stats |
| strBuffIconDamage| string | Icon class for a buff that deals damage |


**Style settings for battle log**
The battle log is a bootstrap v4 column div that contains paragraphs. Make sure to add the style "overflow-y: scroll" to avoid an ever vertical expanding div. The game code automatically scrolls the position to the last added message.

| **Property** | **Format** | **Description** |
| --- | :---: | --- |
| strBattleLogClass | string | Classes for the battle log text |

>Note: These properties are mainly used for styling and spacing (margins, padding, backgrounds, colors, etc.). Some properties affect Bootstrap v4 column classes, and can slightly alter the layout of elements (for example, placing elements side by side). However, a more in-depth modification requires digging through the [dynamic elements methods](#dynamic-elements-methods).

| [Game properties index](#game-flow-and-properties) | [Main index](#contents) |
| :---: | :---: |

_____________________________________

#### Stats and skills settings

The following properties affect the character object's **in-game stats and skills**. These adjust game stat allocation an their relation to the base stats, the levels gained after each battle, the amount of base stats gained per level, and what defensive stat to use for each skill damage type.

| **Property** | **Format** | **Description** |
| --- | --- | --- |
| intGameCharLevelGain | number | How many levels the characters earn after every battle.  See characater section for details. |
| intGameCharLevelStatGain | number | Number of BASE stat points gained per character level up. See characater section for details. |
| intGameCharLevelSkillBeginner | number | Minimum level required for learning beginner skills.  See characater section for details. |
| intGameCharLevelSkillAdept | number | Minimum level required for learning adept skills.  See characater section for details. |
| intGameCharLevelSkillMaster | number | Minimum level required for learning master skills.  See characater section for details. |
| intStatHPMult | number | Base stat multiplier for HP (advanced game) |
| intStatHPMultBasic | number | Base stat multiplier for HP (basic game) |
| intStatAttackMult | number | Base stat multiplier for Attack (advanced game) |
| intStatCounterMult | number | Base stat multiplier for Counter Attack (advanced game) |
| intStatDefenseMult | number |Base stat multiplier for Defense (advanced game) |
| intStatForceAttackMult | number | Base stat multiplier for Force Attack (advanced game) |
| intStatForceDefenseMult | number | Base stat multiplier for Force Defense (advanced game) |
| intStatSpeedMult | number | Base stat multiplier for Speed (advanced game) |
| floatFollowAttackChanceMod | number | Affects chance to score an additional follow-up attack after using a skill. This value represents the default chance for 2 characters with equal speed (ie, if its 0.1, the chance is 10%). It scales exponentially with speed difference. If 0, the follow-up attack mechanic is disabled. See [characater section](#characters-collection) for further details. |
| arDmgTypeAttackProp | strings array | Array of damage type properties for skills. See [skills section](#skills-collection) for details. |
| arDmgTypeDefenseProp | strings array | Array of character defensive stats for reducing each damage type. It must match the order and length of the **_arDmgTypeAttackProp_** array game property. See [characater section](#characters-collection) for the stat property names. |

>**NOTE:** The **_arDmgTypeAttackProp_** and **_arDmgTypeDefenseProp_** properties, in conjunction with the [display elements settings](#display-elements-settings), and the [skills collection](#skills-collection) can be used to completely alter the theme and damage rules of the game, from every possible damage type and the deffensive stat used, to the displayed name of every stat. For example: 
>* Doing a classic medieval RPG battle game using "physical" and "magic" instead of "weapon" and "force". 
>* Post apocalyptic battle game, using "firearms", "energy weapons", "radiation resistance", etc. as stats.
>* A more in-depth modification allows to match several different damage types with every possible character stat (7 total in-battle stats). Maybe for an elemental creatures battle where every stat is instead an "elemental affinity", and for some reason the player's gotta catch 'em all.
>Everything can be modified without needing to change a single line of game logic methods.

| [Game properties index](#game-flow-and-properties) | [Main index](#contents) |
| :---: | :---: |

____________________________________

#### In-game dynamic properties

These are dynamic variable-like properties who's values get overwritten at different stages trhough the game. Changing their values does nothing short of presenting a bug here or there (like the turn number count, the flag settings altering expected behavior, etc.)

| **Property** | **Format** | **Description** |
| --- | --- | --- |
| boolAdvancedGame | boolean | True when the advanced game was selected. |
| boolCharSelected | boolean | True when the player character was selected. |
| boolOppSelected | boolean | True when the opponent was selected. |
| boolBattleBegan | boolean | True when the first battle is started. |
| boolBattleInProgress | boolean | True when any battle is started. |
| arGameCharacters | array | Temporary characters for current game. |
| intCharIndex | integer | Index of the selected player character within arGameCharacters. |
| arCharSkills | array | Skills array of the player character for the current battle. |
| arCharBuffs | array | Buffs array of the player character. |
| intOppIndex | integer | Index of the selected opponent within arGameCharacters. |
| arOppSkills | array | Skills array of the opponent for the current battle. |
| arOppBuffs | array | Buffs array of the opponent for the current battle. |
| boolBattleNomove | boolean | For skill special effect "nomove". Makes the target skip it's turn. |
| boolBattleNocounter | boolean | For skill special effect "nocounter". Makes the target skip it's counter. |
| boolBattleNodefense | boolean | For skill special effect "nodefense". Ignores target's defense. |
| intBattleTurnCount| integer | Keeps track of the number of turns per game. |
| arCharSkillsCooldown | array | Stores skills cooldowns for cross-battle use. |

____________________________________

#### Collections
There are 2 collections: 
* Character objects.
* Skill objects.

Each have their own set of properties that affect the way they interact with each other, as well as containing settings for displaying dynamically created elements (images, color settings, etc).



| [Game properties index](#game-flow-and-properties) | [Main index](#contents) |
| :---: | :---: |

___________________________________________________

##### Characters collection
Specify character objects inside the **_arCharacters_** array of the [game properties](#game-flow-and-properties). 

- [Character object properties](#character-object-properties)
- [Character stat properties](#character-stat-poperties)

| [Game properties index](#game-flow-and-properties) | [Main index](#contents) |
| :---: | :---: |

___________________________________________________
###### Character object properties
Each character object has the following poperties:

| **Property** | **Format** | **Description** |
| --- | --- | --- |
| strName | string | The name of the character. Used for displaying the UI elements. |
| intCharStartLevel | integer | The starting level of the character (set to 0 in the current implementation). |
| intCharLevel | integer | The current level of the character, changes dynamically. |
| Stats | integer | The character's strenghts and weaknesses. See the [stats section](#character-stat-properties) for details. |
| Bio | string | **_strDescription_** and **_strDescriptionBasic_**. Descriptions used as the character's bio. For the advanced and basic modes respectively. Supports HTML tags. |
| Images | string | **_strImgPortrait_**, **_strImgProfile_** and **_strImgBattle_** properties. The path of the image assets that serve as the portrait, the profile and the battle pic respectively (in the current implementation, profile pic is the same as the battle pic). |
| Default Skills | string | **_strDefaultSkill_**, **_strDefaultCounter_**, and **_strDefaultFollow_**. The id name of the default skills for attacking, counter attacking, and doing a follow-up attack respectively. See [skills section](#skills-collection) for details. |
| arSkills | string array | A list of skills that can be learnt at specified character level breaks.
| arSkillLevels | integer array | A list of character level breaks for learning the skills in the **_arSkills_** array property. Must have the same order, a preferably, the same length |

| [Character index](#characters-collection) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

__________________________________________________
###### Character stat properties

There are 3 sets of 7 stat properties (21 properties total) for every character. In listed order, they are named:
1. **HP:** The default behavior of this stat property is to determine defeat or victory conditions. The value is reduced every time the character receives damage when the [mBattleDealDamage](#in-battle-methods) method is called. If it reaches 0 for the player, the [mBattleLose](#in-battle-methods) method is called; if it reaches 0 for the opponent, the [mBattleWin](#in-battle-methods) method is called.
1. **Attack:** has no default behavior. The behavior depends on the defined damage types and defensive stat values specified inside the _[arDmgTypeAttackProp](#stats-and-skills-settings)_ and _[arDmgTypeDefenseProp](#stats-and-skills-settings)_ game properties, as well as the values assigned to [skill properties](#skills-collection). In the current implementation, it's the offensive stat of the default "Attack" skill, and "weapon" damage type skills.
1. **Counter:** same as with Attack. No default behavior, just another stat to mess with. In the current implementation, it's the offensive stat for the default "Counter" skill and some special skills.
1. **Defense:** same as with Attack. No default behavior, just another stat to mess with. In the current implementation, it's the defensive stat for the "weapon" damage type skills.
1. **ForceAttack:** same as with Attack. No default behavior, just another stat to mess with. In the current implementation, it's the offensive stat for the "force" damage type skills.
1. **ForceDefense:**  same as with Attack. No default behavior, just another stat to mess with. In the current implementation, it's the defensive stat for the "force" damage type skills.
1. **Speed:** The default behavior of this stat property is to determine which character acts first in combat, as well as the chance to trigger the skill specified in the _[strDefaultFollow](#characters-collection)_ property of characters. This chance is calculated as follows:

    Chance to trigger strDefaultFollow skill =
        _[floatFollowAttackChanceMod](#stats-and-skills-settings)_ * ((caster speed)^2 / (target speed)^2)


>**NOTE:** Although the stat property names should remain unchanged (sans replacing the new names everywhere in the code), what they do, how they interact with the skills, and how they are displayed in the UI, is completely configurable. Except for HP and Speed that have a specified default behavior in the game logic, the other 5 stats are just values to be used for inflicting and reducing damage.
>* Specify how stats will be named (displayed to the player) in the [display elements settings](#display-elements-settings) section.
>* The rules that define damage types and defensive stats to reduce damage are defined in the _[arDmgTypeAttackProp](#stats-and-skills-settings)_ and _[arDmgTypeDefenseProp](#stats-and-skills-settings)_ game properties. 
>* The rules that define damage types and offensive stats are set inside each skill's individual properties. For example, even if you specify a "weapon" damage type for a skill, you can use the "magic" or "intelligence" as the skills offensive stats.

The displayed names of the stats can be changed by altering the [display strings](#display-elements-settings) game properties.
The way they interact with skills

**Base stats intBase+Stat (intBaseHP, intBaseAttack, intBaseCounter, etc)**

* Identified with their _intBase_ prefix.
* Their values are never changed anywhere in the game.
* They are a measure of a character's absolute strength. A character with more base stats is stronger than a character with less base stats. 
* For a balanced game, the total sum of Base stats should be the same across all characters.

**Game stats (intMaxHP, intAttack, etc)**
* They result in the base stats being multiplied by a certain value specified in the [Stats and skill settings](#stats-and-skills-settings) game properties.
* They are the ones displayed in the character's stat bars and represent the deafult value of the character's stats.
* They can also be affected by the caracter level if the property **_intGameCharLevelStatGain_** is higher than 0:
   * Additional base stat points gained on character level up are _virtually_ applied to the game stats, without actually altering the base stats.
   * Additional base stat points gained on character level up are applied proportionally to the original base stat distribution.
   * The resulting game stat value for any given stat is calculated as follows:

    game stat = (base stat multiplier)*(base stat)*(
            1 + (intGameCharLevelStatGain)*(character level)/(sum of all base stats for the character)
        )
                    
So, if the game property **_intGameCharLevelStatGain_** value is 0, or the character level is 0, the game stat value is:

    game stat = (base stat multiplier)*(base stat)


**Battle stats (intCurrAttack, intCurrDefense, etc)**

* They are named with the _intCurr_ prefix.
* These are in-battle stats that change along the course of a battle when skill effects are applied.
* Except for **_intCurrHP_**, that represents the character's remaining hit points, any changes on these stats are reset to the game stat values on the following events:
   * At the start of each battle.
   * At the end of each battle turn (after the character and opponent made their respective moves).
* For keeping modifications on these stats over multiple turns, use [buffs and skills](#skills-collection) with skMethodTurn methods.

| [Character index](#characters-collection) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

___________________________________________________

##### Skills collection
Skills are assigned to each character inside the [character's skill properties](#characters-collection). They are used to determine the available actions of the player and opponent in every turn. All actions in battle are skill objects, including the defaul attack, counter-attack, and follow-up attack.

Contents:
- [Skill properties](#skill-properties)
- [Damage calculation](#damage-calculation)
- [Special effects](#special-effects)
- [Buffs](#Buffs)
- [Charge time and cooldown](#charge-time-and-cooldown)
- [Skill methods](#skill-methods)

>**NOTE:** skills unassigned to character objects can be triggered in battle via [skill methods](#skill-methods)

| [Game properties index](#game-flow-and-properties) | [Main index](#contents) |
| :---: | :---: |
_________________________________________
###### Skill properties
**Skill properties**

Every skill has the following properties:

| **Property** | **Format** | **Description** |
| --- | --- | --- |
| skName| string | Unique identifier. Use this in character's skill arrays and to identify data. |
| skNameDisplay| string | For displaying UI elements (info cards, buttons, etc). |
| skDescription| string | Description for tootlips of skill display elements. |
| skBtnColorClass| string | Class of the skill button and displayed buff effect, for styling. |
| skTextDisplayAction| string | For the battle log. A verb that follows the caster's name (ie "Obi Wan uses"). |
| skTextDisplaySkill| string | For the battle log, the name displayed after the action (ie "Obi Wan uses High Ground"). |
| skTextDisplaySpecial| string | For the battle log, if not empty, this text replaces normal battle log behavior after declaring caster, action and skill name. |
| skTextDisplayColor| string | Color used in battle log for highlighting skill texts: skTextDisplaySkill, skDamageType, and the damage amount |
| skTarget| string | _"caster"_ for skills that affect the caster, _"rival"_ for skills that affect the rival. |
| skDamageType| string | Determines defensive stat for damage reduction. Must be either a string declared inside the game property **_[arDmgTypeAttackProp](#stats-and-skills-settings)_**, or a [character stat](#characters-collection) property. Use "none" for skills that don't deal damage, and stat altering [buffs](#buffs). See [damage calculation](#damage-calculation). |
| skDamageStatPrimary| string | Caster's first stat property to use in damage calculations |
| skDamageStatSecondary| string | Caster's second stat property to use in damage calculations |
| skDamageMultPrimary | integer |Caster's first stat multiplier |
| skDamageMultSecondary | integer |Caster's second stat multiplier |
| skSpecialEffect | array | //"none","nocounter","nodefense","nomove","first","last","buff","method" |
| skChargeTime | integer |Number of turns before it can be cast. |
| skCooldown | integer |Dynamic, changing it doesn't affect behavior. When 0, the skill can be cast again. |
| skTurnRemaining | integer |Either the duration of a [buff](#buffs) or the number of turns that [skMethodTurn](#skills-methods) will be executed. |
| skMethodAssist | integer | Utility for storing values generated by skill methods (ie, look at the current implementation's "Revenge" skill). |
| skMethodTurn | function | Run at the beginning of each battle turn for as long as the **_skMethodTurnRemaining_** property is greater than 0. Uses _skill object_, _caster object_, _rival object_, and the **_skMethodAssist_** property as arguments. Ignored if the skill is a [buff](#buffs). |
| skMethodSpecial | function | The arguments are _skill object_, _caster object_, _rival object_, and the **_skMethodAssist_** property. Runs when the skill is cast. |

| [Skills index](#skills-collection) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

_________________________________________________
###### Damage calculation
**Damage calculation**

1. When the **_skDamageType_** property is anything other than _"none"_, the skill will deal damage to the target specified in the skill's **_skTarget_** property (the caster or the rival).
2. Damage reduces the target's **_intCurrHP_** property value, which represents in-battle hit points.
3. Minimum damage dealt is 1, adjust this in the **_[intMinimumDamage](#general-game-settings-and-parameters)_** game property; it should be a positive or 0 value, but whatever, go bonkers.
4. The skill's **_skDamageType_** property determines which stat will be used by the target to reduce damage. It can be:
   * Any of the strings specified inside the **_arDmgTypeAttackProp_** array in the game's [stats and skills settings](#stats-and-skills-settings). The defensive stat for the target is the corresponding index stat in the **_arDmgTypeDefenseProp_** game property array. The damage type will be displayed in the battle log.
   * The name of a [character stat property](#characters-collection) (ie _"intCurrHP"_, _"intCurrSpeed"_, etc) to use that stat. The string for damage type WON'T be displayed in the battle log (it'll display only damage).
   * Any other string will ignore defensive stats. The string WILL be displayed in the battle log (ie _"unblockable"_ damage).
5. The damage calculation is:

    damage = ([skDamageStatPrimary] * [skDamageMultPrimary]) of the caster 
        + ([skDamageStatSecondary] * [skDamageMultSecondary]) of the caster
        - defensive stat of the target

For example the Attack skill damage calculation in the current implementation is:

    (intCurrAttack of caster * 1) - intCurrDefense of target

| [Skills index](#skills-collection) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

__________________________________________________
###### Special effects
**Special effects**

* Specify preset special effects inside the **_skSpecialEffect_** array property, these don't affect the battle log text. More than one special effect can be included inside the array: 
   * _"none"_ for none. If there is a single "none" in the array, all other effects are ignored.
   * _"nocounter"_ prevents counter from the rival on the turn it's used.
   * _"nodefense"_ ignores target's defensive stat on damage calculations.
   * _"nomove"_ skip the target's turn (doesn't prevent counter attacks).
   * _"first"_ always moves first.
   * _"last"_ always moves last.
   * _"method"_ runs the function specified in the **_[skMethodSpecial](#skills-methods)_** property when the skill is cast.
   * _"buff"_ the skill is treated as a buff, ignores **_[skills skMethodTurn](#skills-methods)_** property. See [buffs](#buffs) section for details.
* Using any other string won't have any effect.

>**NOTE:** these special effects are included in the game logic. To add custom effects, see the [skills methods](#skill-methods) section.

| [Skills index](#skills-collection) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

___________________________________________________
###### Buffs
**Buffs**

When a skill has _"buff"_ inside the **_skSpecialEffect_** array, it acts differently:

* When cast, the skill won't do any direct damage. Instead, a _"buff object"_ will be added to the skill target's buff array (either "caster" or "rival"). A buff display button will be added to the game display as child elements to the [colDivCharBuff](#required-variable-names) and [colDivOppBuff](#required-variable-names) HTML elements.
* Buffs are displayed in the UI by a button with a tooltip: 
   * The button takes the class properties specified in the skill object. The button has one of 6 different icons specified in the game's  [display elements settings](#display-elements-settings) properties.
   * The tooltip will indicate the buff name and the effect. If the buff deals damage, it will display the amount of damage dealt. If the buff affects stats, it will display the short name of the affected stat(s) and the percentage amount that it is modified respective to 100% (ie, a 1.25 multiplier shows "+25%", a 0.75 multiplier shows "-25%")
* At the beginning of each battle turn the game will cycle through the buff arrays for each character. First the opponents', then the player's, and do the respective actions before reducing the remaining turns of the buff by 1.
* Buffs with no turns remaining are removed from the corresponding buff skill array, and their button removed from the UI display.
* A buff can have 2 effects at most: 
   * A buff skill that that has **_skDamageType_** set to _"none"_, will use the **_skDamageStat_** and **_skDamageMult_** properties to change the value of the target's specified stats. Up to 2 stats can be affected by using the Primary and Secondary sufixes.
   * A buff skill that has a valid **_skDamageType_** property value contained in the **_[arDmgTypeAttackProp](#stats-and-skills-settings)_** will calculate damage normally for the turn that it is cast, and deal that damage on the successive turns, regardless of stat modifications on the following turns.
* The newly created buff object will inherit the following properties from the skill object:
    * **skName:** unique buff identifier.
    * **skNameDisplay:** name of buff skill for buff display buttons.
    * **skTextDisplayColor:** Color of highlighted text for the battle logs and tooltips of buff buttons.
    * **skBtnColorClass:** Class for styling the buff button displayed in the battle area.
    * **skDamageType:** if anything other than _"none"_, the buff will deal damage at the end of every turn with the same [damage calculation](#damage-calculation) rules as the skills.
    * **skDamageStatPrimary:** the first stat of the target that will be modified if **_skDamageType_** is _"none"_. If the string doesn't match any stat properties, it will be used as the tooltip's description.
    * **skDamageStatSecondary:** the second stat of the target that will be modified.
    * **skDamageMultPrimary:** multiplies the first stat of the target.
    * **skDamageMultSecondary:** multiplies the second stat of the target.
* The buff object will also store some specific values:
    * **buffDamage:** if **_skDamageType_** is anything other than _"none"_, the buffDamage stores a non 0 value that is the damage calculation of the skill.
    * **buffTurns:** takes the value of the **_skTurnRemaining_** property. This is the number of turns the buff remains active. This value is reduced by 1 at the beginning of each turn, after having applied its effects.

| [Skills index](#skills-collection) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

____________________________________________________________
###### Charge time and cooldown
**Charge time and cooldown**

* The **_skChargeTime_** property is the number of turns the skill must wait before being cast again.
* The **_skCooldown_** property takes the value of **_skChargeTime_** at the beginning of battle, and every time the skill is cast.
* **_skCooldown_** value goes down by 1 at the beginning of each battle turn, until it reaches 0.
* The skill buttons for the player, and their tooltips, are disabled when the **_skCooldown_** value is larger than 0. The number of remaining turns until they can be used again is shown in parentheses.
* By default, the **_skCooldown_** property of skills for the player is mantained between battles with different opponents. This allows for strategic skill use (ie, save a long cooldown skill for next battle). This behavior can be changed by setting the game property **_boolGameCharResetCooldown_** to _true_. Doing so will reset cooldowns on each new battle, and the player skills will require to charge completely.

>**NOTE:** In the current implementation, setting **_boolGameCharResetCooldown_** to _true_ results in severily increasing the difficulty of the game, specially for the last battle. Every character has a playing style that is weak against another character's playing style (ie, Obi Wan's anti-counter focused skills vs Darth Maul's counter focused skills). One powerful skill, with long charge time, reserved for using in the first few turns of the battle can make the whole difference between defeat and victory.

| [Skills index](#skills-collection) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

_________________________________________________________________
###### Skill methods
**Skill Methods**

* There are 2 preset skill methods provided in the game, that can give the skills any desired effect through code.
* The game passes 4 arguments to each skill method, so take them into account when using them: 
    * **skillObject:** the object of the skill being cast. Use this object to refer to any of the skill's properties. The skills assigned to each character at the beginning of battle are not the actual object inside the skills collection, but a _"clone"_ of the object, a carbon-copy of all properties and methods. Changes done to this skill object will not affect the original skill in the skills collection, but will be effective for the remainer of the battle. This allows for methods that change the skills' properties, without affecting other characters that can learn the same skill. For example, when coding a skill that increases in power every time it is used by increasing it's stat multiplier by a certain amount. So, when adding code to skill methods, instead of using **_this_** to refer to the skill and read its properties, use **_skillObject_**.
    * **casterObject:** the object of the character casting the skill. Any changes done to this object will affect the character.
    * **rivalObject:** the object of the rival of the caster. All changes done to this object will affect the character.
    * **skMethodAssist:** a utilitty variable-like property to store any single numeric value that the methods might require for later use.

**skMethodSpecial**
Runs whenever the skill is cast and _"method"_ is inside the skSpecialEffect string array.

**skMethodTurn**
* This method is ignored if the skill has _"buff"_ in the special effects array.
* It's used in combination with the property **_skTurnRemaining_** for creating special "multi-turn" skills.
* At the beginning each battle turn, the game loops through the character's skill arrays (the ones used in battle) and runs **_skMethodTurn_** for every skill that has a **_skTurnRemaining_** value greater than 0. **_skTurnRemaining_** is then reduced by 1, until it reaches 0.
* An easy way to set a multi-turn special skill is to:
    * Add the _"method"_ string to the **_skSpecialEffect_** array property.
    * Code the **_skMethodSpecial_** function to alter the value of the **_skTurnRemaining_** property to the number of turn desired.
    * Add the code to **_skMethodTurn_**.
    * This way, the special skill code is self contained, without the need to modify the game logic code.

**Additional notes on skill methods**

 Take a look at some examples in the current implementation, of skill methods used to bend, break or expand on the default game mechanics:
* Darth Maul's and Ahsokas' _"Retaliate"_ skill increases the counter stat on the same turn the skill is used, without needing to apply a buff and wait until the following turn for it to take effect.
* Ventress' _"Poison Slash"_ is an active skill that poisons the opponent by attaching a "poison" buff, creating a completely new special effect. The buff object is defined inside the _skMethodSpecial_ function, and then pushed into the opponent's buff array. Copying that code into any other skill gives it the same effect.
* Count Dookus' _"Strategist"_ skill reduces cooldown of all his other skills, a unique "meta" game effect. The opposite effect can be coded to increase the opponent's skill's cooldown by a desired amount (creating  a "silence" effect, or, by adding a "skip turn" skill that does nothing, efectively creating a "sleep" effect).
* Yoda's _"Heal"_ and _"Longevity"_ skills restore health based on the caster's stats, a mechanic not included inside the game logic.
* Darth Maul's _"Revenge"_ makes use of all the skill method tools: 
   * When first cast, _skMethodSpecial_ is run to store his current hp value at the beginning of the turn inside the _skMethodAssist_ property. 
   * Then, it sets the skill's _skTurnsRemaining_ property value to 1, to make the _skMethodTurn_ function trigger at the beginning of the next turn. 
   * Finally, inside the _skMethodTurn_ function, it substracts the current hp from the stored value inside _skMethodAssist_ to determine the amount of damage taken in the previous turn, and deals it back to the rival with increased power.

Skill methods are powerful tools that can influence every aspect of a battle, and even expand on the default behavior of the game. For a practical example: 
1. Create a new skill in the skills collection array.
1. Give it a very high _skTurnsRemaining_ value (over 9000!).
1. Add code in the _skMethodTurn_ function to alter any in-battle stat of the _casterObject_ by any desired amount.
1. Give it a custom class in the _skBtnColorClass_ property.
1. Add that class to the CSS file and give it the `display: none` attribute.
1. Assign the skill to any character.
1. You've just created a passive skill, that can be learnt upon leveling up, won't take space as a clickable skill button, and permanently increases an in-battle stat for the character.

Now, consider that the previous example can be built upon, to create any desired effect in battle, either permanently active, or triggered when certain conditions are met. A couple of ideas:
* A rivalry system that increases or decreases stats when specific characters fight against each other
* Weather effects
* Random in-battle evets with a certain chance of ocurring each turn (ie, character just got dysentery).
* A turn limit for the battle, killing the character with the lowest HP when the counter goes to 0, etc...

| [Skills index](#skills-collection) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |
___________________________________________________

#### Methods
A list of methods, their arguments, and general desciption. For any additional details, look inside the javascript file.

- [General utility methods](#general-utility-methods)
- [Game flow methods](#game-flow-methods)
- [Dynamic elements methods](#dynamic-elements-methods)
- [In-battle methods](#in-battle-methods)

| [Game properties index](#game-flow-and-properties) | [Main index](#contents) 
| :---: | :---: |

________________________________________________
##### General utility methods
**General utility methods**
Methods used for array manipulation at several points during the game.

**mReduceArray(array,elements)**
Removes random elements from a provided array until a specified number of elements remain.
If the provided array has less elements than the specified number, returns it intact.
_returns: array_
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | array | array | An array with any type of elements |
   | elements | integer | A number that represents the maximum length of the reurned array |

**mMaxProperty(array,propertyName)**
Returns the max value of a specified property, from a collection of objects within an array that share this property.
If an object doesn't have this property, it's ignored; if an object has this property but it's not a number, returns _NaN_.
_returns: number_
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | array | array | An array of objects |
   | propertyName | string | The name of the property being evaluated |

**mFindObject(array, property, value)**
Uses the .find() method to fetch the first object in an array to match the condition property == value.
Returns _undefined_ if none of the objects match the condition.
_returns: object_
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | array | array | An array of objects |
   | property | string | The name of the property that will have its value matched |
   | value | string or number | The value against which to match the property's value |

| [Methods index](#methods) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

___________________________________________________

##### Game flow methods
Methods to control which [game phase](#understanding-the-game-flow) is being executed, and determine the information displayed to the user at every step.

**mGameModeStart(mode)**
Main game flow function used to begin a new game, called when choosing a game mode.
Clears all UI areas from elements, resets character levels, clears skill and buff arrays, and sets game flags to their initial value.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | mode | string | Either _"basic"_ or _"advanced"_ for setting the default game mechanics. Defaults to _"basic"_ if a non valid string is given |

**mGameSetStats:function(charObject)**
Sets the [game stats](#character-stat-properties) of the provided character object, depending on game mode, character level, base points and stat multipliers.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | charObject | object | A valid [Character Object](#characters-collection) with the necessary stat properties |

**mGameSetBattleStats:function(charObject)**
Sets the in-battle stats when starting an _advanced_ mode game.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | charObject | object | A valid [Character Object](#characters-collection) with the necessary stat properties |

**mGameRollCharacters()**
Fectches random objects from the [characters collection](#characters-collection) array, the number specified in the **_intGameCharacters_** game property.
Puts those objects inside the **_arGameCharacters_** array.
Clears the skills, character info, and character portraits from the character selection area. 
Creates new character portraits based on the objects fetched, and assigns them an on-click event handler to display the character profile, stats and skills info.

**mGamePlaceOpponents(charIndex)**
Moves the non-selected characters to the opponents area, by using jQuery to detach the HTML elements from the character section, and attach them to the opponents section. Changes the on-click event handler of the moved portraits by changing the HTML parent elements that contain character info, from the character selection area, to the opponent selection area.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | charIndex | integer | The index of the player selected character, within the **_arGameCharacters_** array |

**mGameReselect(charIndex)**
Available at the [Opponent Selection](#understanding-the-game-flow) phase. Removes all HTML elements from the opponent selection area, and returns them to the character selection area. The inverse of the **_mGamePlaceOpponents(charIndex)_** method.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | charIndex | integer | The index of the player selected character, within the **_arGameCharacters_** array |

**mGameRestart()**
Clears all areas from the generated HTML elements, calls the **_mGameModeStart_** method, passing the last selected game mode argument.

**mGameBeginBattle(charIndex = 0, oppIndex = 0)**
Begins the battle with selected character and opponent. Clears all HTML elements corresponding to the non-selected opponent from the opponent selection area. Creates battle cards with HP bars and skill buttons for the player in the battle area. Assigns on click events for skill buttons that call the methods **_mBattleMove_** for the player's choice and **_mBattleOppMove_** for generating the opponent's choice. Passes both choices as arguments to the method **_mBattleTurn_**.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | charIndex | integer | The index of the player selected character, within the **_arGameCharacters_** array |
   | charIndex | integer | The index of the player selected opponent, within the **_arGameCharacters_** array |

| [Methods index](#methods) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

___________________________________________________

##### Dynamic elements methods

**mCreatePicker(charObject,index)**
Creates a card with a character portrait image from a character object.
_returns: HTML DOM element_
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | charObject | object | A valid character object |

**mCreateInfoPic(charObject)**
Creates a picture profile with bio for the provided character object.
_returns: HTML DOM element_
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | charObject | object | A valid character object |

**mCreateInfoCards(charObject)**
Creates a card with the name and stat bars for the provided character object.
_returns: HTML DOM element_
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | charObject | object | A valid character object |

**mCreateBattleCard(charObject)**
Creates cards with battle image and HP bars for the provided character object.
_returns: HTML DOM element_
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | charObject | object | A valid character object |

**mCreateSkillButton(skillObject,charIndex,oppIndex)**
Creates the Skill button for the player in the battle area.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | skillObject | object | A valid skill object |
   | charIndex | integer | The index of the player character object inside the **_arGameCharacters_** array |
   | oppIndex | integer | The index of the selected opponent object inside the **_arGameCharacters_** array |

**mDisplayInfoCard(HtmlParentElement, charIndex)**
Appends the elements generated by mCreateInfoPic and mCreateInfoCards inside the specified HTMl element, effectively displaying the info profile of a character. 
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | HtmlParentElement | HTML DOM element | It must be a bootstrap v4 div containing the _.row_ class. |
   | charIndex | integer | The index of the character object inside the **_arGameCharacters_** array. |

**mDisplayInfoSkills(HtmlParentElement, charIndex)**
Creates a div with a header and two paragraphs containing the name, required level and charge time of the skills for a character. Appends the elements to an specified HTML tag, effectively displaying the skills for a character. 
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | HtmlParentElement | HTML DOM element | It must be a bootstrap v4 div containing the _.row_ class. |
   | charIndex | integer | The index of the character object inside the **_arGameCharacters_** array. |

**mDisplayBattleLog(HTMLParentelement,message)**
Appends a paragraph with the desired html content [message] to the specified HTML element.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | HtmlParentElement | HTML DOM element | It must be a bootstrap v4 div containing the _.col_ class. |

**mDisplayUpdateHP(charIndex)**
Updates the HP progress bar in the battle card of the indicated character.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | charIndex | integer | The index of the character object inside the **_arGameCharacters_** array. |

**mDisplayApplyCooldown(skillObject)**
Updates the displayed text of skill buttons with the skill's cooldown property and disables them when the cooldown is larger than 0.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | skillObject | object | A valid skill object |

**mDisplayRemoveCooldown(skillObject)**
Enable the skill button of the provided skill.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | skillObject | object | A valid skill object with a generated skill button |

**mDisplayAttachBuff(HTMLParentElement,buffObject, targetIndex)**
Creates a button with an icon and a tooltip describing the [buff](#buffs) effects, appends it to the specified HTML parent element.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | HtmlParentElement | HTML DOM element | It must be a bootstrap v4 div containing the _.col_ class. |
   | buffObject | object | A valid skill object with a generated skill button |
   | targetIndex | integer | The index of the character within the **_arGameCharacters_** array that is the target of the buff |

| [Methods index](#methods) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |

___________________________________________________

##### In-battle methods
Methods used during the [battle phase](#understanding-the-game-flow) 

**mBattleAssignSkills(charIndex, skillArray)**
Fills in-battle skill arrays for both the player and the opponent with objects cloned from the skills collection array.
The arrays filled are arCharSkills for the player, and arOppSkills for the opponent.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | HtmlParentElement | HTML DOM element | It must be a bootstrap v4 div containing the _.col_ class. |
   | buffObject | object | A valid skill object with a generated skill button |
   | targetIndex | integer | The index of the character within the **_arGameCharacters_** array that is the target of the buff |

**mBattleMove(skillname, skillCasterIndex, skillRivalIndex)**
Returns a choice object that represents the selected move in battle. Each choice containing 3 objects: caster, rival, and selected skill.
_returns: object{skill object, caster object, rival object}_
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | skillname | string | The unique string value in the **_skName_** property of the skill being cast. |
   | skilCasterIndex | integer | The index of the character within the **_arGameCharacters_** array that is casting the skill. |
   | skilRivalIndex | integer | The index of the character within the **_arGameCharacters_** array that is the current rival of the skill caster. |

   **mBattleOppMove(skillCasterIndex, skillRivalIndex)**
Builds an array of possible moves for the PC controlled opponent on the current turn and the next turn, estimates damage, and puts the array elements through a desicion tree to select a suitable move given the current battle conditions. Returns a choice object that represents the selected move in battle. Each choice containing 3 objects: caster, rival, and selected skill.
_returns: object{skill object, caster object, rival object}_
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | skilCasterIndex | integer | The index of the character within the **_arGameCharacters_** array that is casting the skill. |
   | skilRivalIndex | integer | The index of the character within the **_arGameCharacters_** array that is the current rival of the skill caster. |

**mBattleTurnBasic(skillName, charIndex, oppIndex)**
The Basic Game turn. Triggered when the player selects the default action specified in the **_strDefaultSkill_** character object property. Player attacks, opponent counter attacks, player character attack increses.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | skillName | string | The unique string value in the **_skName_** property of the skill being cast. |
   | charIndex | integer | The index of the player character within the **_arGameCharacters_** array. |
   | opplIndex | integer | The index of the opponent within the **_arGameCharacters_** array. |

**mBattleTurn(charMove, oppMove)**
The Advanced Game turn. Triggered when the player selects an action (skill button). First, it will execute the effects of passive multi-turn skills (_[buffs](#buffs)_ and skills with _[skMethodTurn](#skill-methods)_). Then, it will determine which charactter moves first, and pass both the player's and PC controlled opponent choices to the **_mBattleTurnResolve_** method for executing them, as the first and second move. Finally, it will return the affected in-battle stats of both characters to their original values.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | charMove | object | A valid _choice object_ containing the player character object, the player selected selected skill object, and the rival object. |
   | oppMove | object | A valid _choice object_ containing the opponent character object, the opponent selected skill object, and the rival object. |


**mBattleTurnResolve(firstMove, secondMove)**
Resolves the turn actions by executing the player and opponent's skill effects in order. Calls on the method mBattleUseSkill with the firstMove and secondMove objects in turn and checks for _"nomove"_ [special effect](#special-effects) in skills.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | firstMove | object | A valid _choice object_ containing the caster object, the selected skill object, and the rival object. |
   | secondMove | object | A valid _choice object_ containing the caster object, the selected skill object, and the rival object. |

**mBattleUseSkill(moveObject)**
Executes the move in battle. Applies damage and effects of the selected skill, including follow-ups and counters.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | moveObject | object | A valid _choice object_ containing the caster object, the selected skill object, and the rival object. |

**mBattleDealDamage(target, damage)**
Reduces the target's Hit Points by the indicated amount. Everytime this happens, runs updates on the target's HP bar display, and checks victory / loss conditions.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | target | object | A valid _[character object](#character_object_properties)_ which is the target of the damage being dealt. |

**mBattleDamage(skillObject, caster, target)**
Damage calculator for a given skill that deals damage.
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | skillObject | object | A valid _[skill object](#skill-properties)_ which represents the skill being cast. |
   | caster | object | A valid _[character object](#character_object_properties)_ which represents the caster of the skill. |
   | target | object | A valid _[character object](#character_object_properties)_ which represents the target of the skill being cast. |

**mBattleMessageEffect(buffObject, target)**
For buffs, the syntax constructor for battle log messages of buffs that deal damage.
_returns: string_
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | buffObject | object | A valid _[buff object](#buffs)_ which represents the skill being cast. |
   | target | object | A valid _[character object](#character_object_properties)_ which represents the target of the buff damage. |

**mBattleMessage(skillObject, caster, target, damage)**
For skills, the syntax constructor for battle log messages of active skills.
_returns: string_
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | skillObject | object | A valid _[skill object](#skill-properties)_ which represents the skill being cast. |
   | caster | object | A valid _[character object](#character_object_properties)_ which represents the caster of the skill. |
   | target | object | A valid _[character object](#character_object_properties)_ which represents the target of the buff damage. |
   | damage | integer | The amount of damage dealt by the skill, if any. |

**mBattleLose()**
Called when the player character's HP reaches 0 before the opponent's. Displays the game over message and disables all buttons except for _Restart Game_.


**mBattleWin(charIndex)**
Called when the opponent's HP reaches 0 before the player's character. If it's the last opponent, displays the game victory message and disables all buttons except for _Restart Game_; otherwise displays an "opponent defeated" message and goes to the [Opponent Selection Phase](#opponent-selection-phase).
   | **Arguments** | **Format** | **Description** |
   | --- | --- | --- |
   | charIndex | integer | The index of the defeated opponent inside the **_arGameCharacters_** array. |

| [Methods index](#methods) | [Game properties index](#game-flow-and-properties) |
| :---: | :---: |