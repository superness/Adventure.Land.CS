"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/ALHub").build();

connection.start().catch(function (err) {
    return console.error(err.toString());
});

connection.on("ReceiveCharacterData", function (user, message) {
    var characterExtraData = JSON.parse(message);
    var character = characterExtraData.character;

    var characterDivId = "character" + character.name;
    var existingDiv = $('#' + characterDivId);

    // If this is a new character then add a new div
    if (existingDiv.length == 0) {
        createNewCharacterDiv(character.name);
    }

    var curTarget = characterExtraData.extra.target;
    if (!curTarget) {
        curTarget = "No target"
    }

    // Update the data in the character div
    $('#' + characterDivId + 'Name').text(character.level + " " + character.name);
    $('#' + characterDivId + 'Location').text('[' + character.in + '] ' + character.x.toFixed(2) + ', ' + character.y.toFixed(2));
    $('#' + characterDivId + 'Target').text(curTarget);
    $('#' + characterDivId + 'HP').text(character.hp + " / " + character.max_hp);
    $('#' + characterDivId + 'MP').text(character.mp + " / " + character.max_mp);

    $('#' + characterDivId + 'HPBG').width((100.0 * character.hp / character.max_hp) + '%');
    $('#' + characterDivId + 'MPBG').width((100.0 * character.mp / character.max_mp) + '%');

    $('#' + characterDivId + 'Gold').text('Gold: ' + character.gold.toLocaleString());

    // Figure out how many things we have
    var numGradeOne = 0;
    var numGradeTwo = 0;
    var numCompoundables = 0;
    var numHPPots = 0;
    var numMPPots = 0;
    for (var i = 0; i < character.items.length; ++i) {
        if (character.items[i] && AllItems[character.items[i].name] && AllItems[character.items[i].name].compound) {
            numCompoundables++;
        }
        if (character.items[i] && AllItems[character.items[i].name] && AllItems[character.items[i].name].grade == 1) {
            numGradeOne++;
        }
        if (character.items[i] && AllItems[character.items[i].name] && AllItems[character.items[i].name].grade == 2) {
            numGradeTwo++;
        }
        if (character.items[i] && character.items[i].name == "hpot0") {
            numHPPots += character.items[i].q;
        }
        if (character.items[i] && character.items[i].name == "mpot0") {
            numMPPots += character.items[i].q;
        }
    }

    $('#' + characterDivId + 'Compoundables').text('Compoundables: ' + numCompoundables.toLocaleString());
    $('#' + characterDivId + 'GradeOne').text('Grade1: ' + numGradeOne.toLocaleString());
    $('#' + characterDivId + 'GradeTwo').text('Grade2: ' + numGradeTwo.toLocaleString());
    $('#' + characterDivId + 'HPPot').text('HP Pots: ' + numHPPots.toLocaleString());
    $('#' + characterDivId + 'MPPot').text('MP Pots: ' + numMPPots.toLocaleString());
});

function createNewCharacterDiv(characterName) {
    var newDivId = "character" + characterName;
    $('#charactersContainer').append('<div class="character" id="' + newDivId + '"></div>');

    $('#' + newDivId).append('<div id="' + newDivId + 'NameContainer"></div>');
    $('#' + newDivId + 'NameContainer').append('<div class="characterName" id="' + newDivId + 'Name"></div>');
    $('#' + newDivId).append('<div id="' + newDivId + 'LocationContainer"></div>');
    $('#' + newDivId + 'LocationContainer').append('<div class="characterLocation" id="' + newDivId + 'Location"></div>');
    $('#' + newDivId).append('<div id="' + newDivId + 'TargetContainer"></div>');
    $('#' + newDivId + 'TargetContainer').append('<div class="targetContainer" id="' + newDivId + 'Target">Target</div>');
    $('#' + newDivId).append('<div id="' + newDivId + 'HPContainer"></div>');
    $('#' + newDivId + 'HPContainer').append('<div class="characterHP" id="' + newDivId + 'HP"></div>');
    $('#' + newDivId).append('<div id="' + newDivId + 'MPContainer"></div>');
    $('#' + newDivId + 'MPContainer').append('<div class="characterMP" id="' + newDivId + 'MP"></div>');

    $('#' + newDivId + 'HPContainer').append('<div class="characterHPBG" id="' + newDivId + 'HPBG"></div>');
    $('#' + newDivId + 'MPContainer').append('<div class="characterMPBG" id="' + newDivId + 'MPBG"></div>');

    // Potions
    $('#' + newDivId).append('<div id="' + newDivId + 'HPPotContainer"></div>');
    $('#' + newDivId).append('<div id="' + newDivId + 'MPPotContainer"></div>');
    $('#' + newDivId + 'HPPotContainer').append('<div id="' + newDivId + 'HPPot"></div>');
    $('#' + newDivId + 'MPPotContainer').append('<div id="' + newDivId + 'MPPot"></div>');

    // Gold and compoundables
    $('#' + newDivId).append('<div id="' + newDivId + 'GoldContainer"></div>');
    $('#' + newDivId).append('<div id="' + newDivId + 'CompoundablesContainer"></div>');
    $('#' + newDivId + 'GoldContainer').append('<div id="' + newDivId + 'Gold"></div>');
    $('#' + newDivId + 'CompoundablesContainer').append('<div id="' + newDivId + 'Compoundables"></div>');

    // Grade 1 and 2 items
    $('#' + newDivId).append('<div id="' + newDivId + 'GradeOneContainer"></div>');
    $('#' + newDivId).append('<div id="' + newDivId + 'GradeTwoContainer"></div>');
    $('#' + newDivId + 'GradeOneContainer').append('<div id="' + newDivId + 'GradeOne"></div>');
    $('#' + newDivId + 'GradeTwoContainer').append('<div id="' + newDivId + 'GradeTwo"></div>');
}

// Create action controls
$(function () {
    $('#commands_travel').append('<input id="goToUpgradeSpot" type="button" value="Upgrade Spot" />');
    $('#commands_travel').append('<input id="goToBank" type="button" value="Bank" />');
    $('#commands_travel').append('<input id="goToCave" type="button" value="Cave" />');
    $('#commands_travel').append('<input id="goToDraculSpot" type="button" value="Dracul Spot" />');

    $('#commands_action').append('<input id="askForMoney" type="button" value="Ask for money" />');
    $('#commands_action').append('<input id="askForItems" type="button" value="Ask for items" />');
    $('#commands_action').append('<input id="distributePotions" type="button" value="Distribute potions" />');
    $('#commands_action').append('<input id="startCombatLogic" type="button" value="Start combat logic" />');
    $('#commands_action').append('<input id="startDraculPatrol" type="button" value="Start dracul patrol" />');
    $('#commands_action').append('<input id="bankItems" type="button" value="Bank items" />');
    $('#commands_action').append('<input id="withdrawCompoundables" type="button" value="Withdraw compoundables" />');
    $('#commands_action').append('<input id="partyUp" type="button" value="Party up" />');

    $('#commands_craft').append('<input id="startUpgrading" type="button" value="Start upgrading" />');
    $('#commands_craft').append('<input id="startCompounding" type="button" value="Start compounding" />');

    $('#goToUpgradeSpot').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "MoneyS", Command: "SmartMove", Value: "newupgrade" }));
    });
    $('#goToBank').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "MoneyS", Command: "SmartMove", Value: "bank" }));
    });
    $('#goToCave').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "MoneyS", Command: "SmartMove", Value: "cave" }));
    });
    $('#goToDraculSpot').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "MoneyS", Command: "SmartMoveXY", Value: "{\\\"x\\\":\\\"164\\\",\\\"y\\\":\\\"-1200\\\"}" }));
    });
    $('#askForMoney').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "MoneyS", Command: "AskForMoney", Value: "" }));
    });
    $('#askForItems').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "MoneyS", Command: "AskForItems", Value: "" }));
    });
    $('#distributePotions').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "MoneyS", Command: "DistributePotions", Value: "" }));
    });
    //$('#startUpgrading').click(function () {
    //    connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "MoneyS", Command: "StartUpgradingItems", Value: "1" }));
    //});
    $('#startCompounding').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "MoneyS", Command: "StartCompoundingItems", Value: 2 }));
    });
    $('#startCombatLogic').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "WarriorS", Command: "StartCombatLogic", Value: "Warrior" }));
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "MageS", Command: "StartCombatLogic", Value: "Mage" }));
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "PriestS", Command: "StartCombatLogic", Value: "Priest" }));
    });
    $('#startDraculPatrol').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "WarriorS", Command: "StartDraculPatrol", Value: "" }));
    });
    $('#bankItems').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "MoneyS", Command: "BankItems", Value: "" }));
    });
    $('#withdrawCompoundables').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "MoneyS", Command: "WithdrawCompoundables", Value: "" }));
    });
    $('#partyUp').click(function () {
        connection.invoke("SendCharacterCommand", "ALHub", JSON.stringify({ Character: "WarriorS", Command: "PartyUp", Value: "" }));
    });
});