load_code("SignalR");
load_code("Travel");
load_code("Merchant");

var connection = null;
var needsToConnect = false;

function ProcessCharacterCommand(commandType, commandValue)
{
	game_log("type: " + commandType);
	game_log("value: " + commandValue);
	switch(commandType)
	{
		case "SmartMove":
			smart_move(commandValue);
		break;
		case "SmartMoveXY":
			var coords = JSON.parse(commandValue);
			smart_move({map:character.map,x:coords.x,y:coords.y});
		break;
		case "AskForItems":
			askForItems().Start();
		break;
		case "AskForMoney":
			askForMoney().Start();
		break;
		case "DistributePotions":
			distributePotions().Start();
		break;
		case "StartUpgradingItems":
			startUpgradingItems(parseInt(commandValue));
		break;
		case "StartCompoundingItems":
			startCompoundingItems(parseInt(commandValue));
		break;
		case "StartCombatLogic":
			if(commandValue == "Warrior")
			{
				startWarriorLogic();
			}
			if(commandValue == "Mage")
			{
				startMageLogic();
			}
			if(commandValue == "Priest")
			{
				startPriestLogic();
			}
		break;
		case "StartDraculPatrol":
			startDraculPatrol();
		break;
		case "BankItems":
			bankItems();
		break;
		case "WithdrawCompoundables":
			withdrawCompoundables();
		break;
		case "PartyUp":
			inviteTheBoys();
		break;
	}
}

function Connect(url = "https://localhost:44366/ALHub")
{
	connection = new signalR.HubConnectionBuilder().withUrl(url).build();
	
	connection.on("ReceiveMessage", function (user, message) {
		game_log(user + ": " + message);
	});
	
	connection.on("CharacterCommand" + character.name, function (user, message) {
		game_log("CC! " + user + ": " + message);
		
		var command = JSON.parse(message);
		
		ProcessCharacterCommand(command.type, command.data)
	});
	
	connection.start().then(
		function()
		{
			needsToConnect = false;
			connection.invoke("ConnectClient", "AL.CS", "Hello world").catch(function (err) {
			return game_log(err.toString());
		})}).catch(
		function (err) 
		{
			game_log(err.toString());
		});
}

function StartSending()
{
	setInterval(function()
	{
		if(needsToConnect)
		{
			Connect();
			return;
		}

		if(connection == null)
		{
			return;
		}

		// if(character.standed)
		// {
		// 	return;
		// }

		var targetEntity = get_entity(character.target);
		var targetName = "No target";
		if(targetEntity)
		{
			targetName = targetEntity.name;
		}

		var characterExtraData = {character:character,extra:{target:targetName}}
		connection.invoke("ReceiveGameData", "AL.CS", JSON.stringify({Type:"character",Data:parent.game_stringify(characterExtraData)})).catch(function (err) {
			needsToConnect = true;
			return game_log(err.toString());
		});

	}, 300);
}