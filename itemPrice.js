function suggestItemPrice(item, valueMultiplier = 2.3, basePriceOverride = -1)
{
	suggestPriceForItemOfLevel(item.name, item.level, valueMultiplier, basePriceOverride);
}

function suggestPriceForItemOfLevel(itemName, level, valueMultiplier = 2.3, basePriceOverride = -1)
{
	game_log("Sell the level " + level + " " + itemName + " for: " + (Math.trunc(getItemCostAtLevel(itemName, level, basePriceOverride) * valueMultiplier).toLocaleString()));
}

function getItemGrade(itemName, level)
{
	var item = G.items[itemName];

	var itemGrade = 0;
	for(var i = 0; i < item.grades.length; ++i)
	{
		if(item.grades[i] < level)
		{
			itemGrade++;
		}
	}

	return itemGrade;
}

function getItemCostAtLevel(itemName, level, basePriceOverride = -1)
{
	if(level > 9)
	{
		game_log("sorry but I have no idea how to calculate that");
		return;
	}

	var itemCost = getItemBasePrice(itemName);
	
	if(basePriceOverride != -1)
	{
		itemCost = basePriceOverride;
	}

	var numItemsRequired = getNumTriesToCreateItemOfLevel(level);
	var costOfItemBases = itemCost * numItemsRequired;
	var costOfScrolls = getCostOfScrollsToUpgradeToLevel(level, getItemGrade(itemName, 0));

	game_log("#items: " + numItemsRequired.toLocaleString() + " item cost: " + costOfItemBases.toLocaleString());

	return costOfItemBases + costOfScrolls;
}

function getCostOfScrollsToUpgradeToLevel(level, itemGrade)
{
	var scrollName = "scroll0";
	var nextScrollName = "scroll1";
	if(itemGrade == 1)
	{
		scrollName = "scroll1";
		nextScrollName = "scroll2";
	}
	else if(item_grade == 2)
	{
		scrollName = "scroll2";
		nextScrollName = "scroll2";
	}

	var totalCost = -1;
	if(level < 8)
	{
		var numScrollRequired = getNumberOfCraftsRequiredToCreateItemOfLevel(level);
		var costOfScrolls = getItemBasePrice(scrollName);

		totalCost = costOfScrolls * numScrollRequired;
		
		game_log("#Scrolls: " + numScrollRequired.toLocaleString())
		game_log("$Scrolls: " + totalCost.toLocaleString())
	}
	else
	{
		// Everything up to level 7 costs an amount but 7->8->9 uses a higher tier scroll
		var numScrollRequiredToSeven = getNumberOfCraftsRequiredToCreateItemOfLevel(7);
		var costOfScrollsToSeven = getItemBasePrice(scrollName);

		var totalCostToSeven = costOfScrollsToSeven * numScrollRequiredToSeven;
		
		game_log("#Scrolls7: " + numScrollRequiredToSeven.toLocaleString())
		game_log("$Scrolls7: " + totalCostToSeven.toLocaleString())

		var numScrollRequiredToEight = 100.0 / getChanceToUpgradeItemOfLevel(8);
		var costOfScrollsToEight = getItemBasePrice(nextScrollName);

		var totalCostToEight = numScrollRequiredToEight * costOfScrollsToEight;

		totalCost = totalCostToSeven + totalCostToEight;
		
		game_log("#Scrolls8: " + numScrollRequiredToEight.toLocaleString())
		game_log("$Scrolls8: " + totalCostToEight.toLocaleString())
	}

	return totalCost;
}

function getNumberOfCraftsRequiredToCreateItemOfLevel(level)
{
	var level = 8;
	var scrollsRequired = 1;
	for(var i = 1; i < level; ++i)
	{
		//game_log("lvl: " + i + "scrolls rq: " + scrollsRequired)
		var timesRequiredToUpgrade = (100.0 / getChanceToUpgradeItemOfLevel(i));
		//game_log("timesRqToUpgrade: " + timesRequiredToUpgrade);
		scrollsRequired *= timesRequiredToUpgrade
		//game_log("lvl: " + i + "scrolls rq: " + scrollsRequired)
		scrollsRequired += timesRequiredToUpgrade;
		//game_log("lvl: " + i + "scrolls rq: " + scrollsRequired)
	}

	return scrollsRequired;
}

function getChanceOfAnyCraftSucceedingToLevel(level)
{
	if(level < 1) return 1;
	return getChanceToUpgradeItemOfLevel(level) / 100.0 * getChanceOfAnyCraftSucceedingToLevel(level - 1);
}

// How many times do you need to attempt the crafting chain to get an outcome of this level
function getNumTriesToCreateItemOfLevel(level)
{
	return 100.0 / getChanceToCreateItemOfLevel(level);
}

function getChanceToUpgradeItemOfLevel(level)
{
	if(level == 0) return 1;
	var levelChances = [100, 98.2, 95.37, 71.07, 62.31, 42.18, 26.89, 17.98, 12.77];

	return levelChances[level - 1];
}

function getChanceToCreateItemOfLevel(level)
{
	var curChance = 100;
	for(var i = 1; i <= level; ++i)
	{
		curChance *= getChanceToUpgradeItemOfLevel(i) / 100.0;
	}

	return curChance;
}

function getItemBasePrice(itemName)
{
	return G.items[itemName].g;
}