load_code("PartyLogic");
load_code("XPTimers");
load_code("Travel");
load_code("GameDataR");

startXPTimer();

// Connect game data r
Connect();
StartSending();

function on_cm(name,data)
{
	if(name!="WarriorS" && name!="MoneyS") // Make sure to check who the CM came from
	{
		game_log("Unauthorized CM "+name);
		return;
	}

	if(data.type == "Target")
	{
		change_target(get_entity(data.id));
	}
	if(data.type == "GiveMoney")
	{
		giveMoneyMoney();
	}
	if(data.type == "GiveItems")
	{
		giveMoneyItems();
	}
}

function on_party_invite(name) // called by the inviter's name
{
	if(name == "WarriorS")
	{
		accept_party_invite(name)
	}
}

function giveMoneyMoney()
{
	send_gold("MoneyS", character.gold);
}

function giveMoneyItems()
{
	for(var i = 0; i < character.items.length; ++i)
	{
		// Don't send potions
		if(character.items[i] && character.items[i].name != "mpot0" && character.items[i].name != "hpot0")
		{
			send_item("MoneyS", i, character.items[i].q);
		}
	}
}