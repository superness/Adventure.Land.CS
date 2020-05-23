load_code("Travel");

function runEvents(events)
{
	return new SequentialEventManager().RunEvents(events);
}

function askForMoney()
{
	return runEvents([new AskForMoneyEvent()]);
}

function askForItems()
{
	return runEvents([new AskForItemsEvent()]);
}

function buyPotions(hpPots, mpPots)
{
	return runEvents([new BuyPotionsEvent(hpPots, mpPots)]);
}

function distributePotions()
{
	return runEvents([new DistributePotionsEvent()]);
}


function locate_item(name)
{
	for(var i=0;i<character.items.length;i++)
	{
		if(character.items[i] && character.items[i].name==name) return i;
	}
	return -1;
}

function return_item(name)
{
	for(var i=0;i<character.items.length;i++)
	{
		if(character.items[i] && character.items[i].name==name) return character.items[i];
	}
	return -1;
}

function find_item_idx(item)
{
	for(var i=0; i < character.items.length; ++i)
	{
		if(character.items[i] && character.items[i].name == item.name && character.items[i].level == item.level)
		{
			return i;
		}
	}
}

var compoundInterval;
function startCompoundingItems(level)
{
	compoundInterval = setInterval(function() {

		// Gotta buy scrolls
		if(locate_item("cscroll0")==-1 || return_item("cscroll0").q<10)
		{
			buy("cscroll0",10);
		} 

		// Map items to item counts
		var itemCountMap = {};
		character.items.forEach(
			function(item, idx) 
			{ 
				// Only looking for compoundable items with grade 0
				if(!item || !G.items[item.name].compound || item_grade(item)!=0 || item.level > level)
				{
					return;
				}

				if(!itemCountMap[item.name + item.level])
				{
					itemCountMap[item.name + item.level] = {count:0, idx:[]};
				}

				itemCountMap[item.name + item.level].count = itemCountMap[item.name + item.level].count + 1;
				itemCountMap[item.name + item.level].idx.push(idx);
			});

		
		var anyCompounded = false;
		// Compound the first item that there are at least 3 of
		for(var key in itemCountMap)
		{
			if(itemCountMap[key].count >= 3)
			{
				// Compound this item and yeet outta here
				var itemDataToCompound = itemCountMap[key];

				// game_log(itemDataToCompound.idx[0] + ", " +
				// 	itemDataToCompound.idx[1] + ", " +
				// 	itemDataToCompound.idx[2]);

				compound(
					itemDataToCompound.idx[0],
					itemDataToCompound.idx[1],
					itemDataToCompound.idx[2],
					locate_item("cscroll0"),
					null
				);

				anyCompounded = true;
				
				break;
			}
		}

		// Compounded everything to time to quit
		if(!anyCompounded)
		{
			stopCompoundingItems();
		}
	}, 1000);
}

function stopCompoundingItems()
{
	clearInterval(compoundInterval);
}

var upgradeInterval;
function startUpgradingItems(level)
{
	upgradeInterval = setInterval(function() {

		// Gotta buy scrolls
		if(locate_item("scroll0")==-1 || return_item("scroll0").q<10)
		{
			buy("scroll0",10);
		}

		// Select the first upgradable item
		var upgradable = character.items.filter(
			function(i){ 
				return i && G.items[i.name].upgrade && i.level < level && item_grade(i) == 0;
			});

		// Nothing else to upgrade
		if(upgradable.length == 0)
		{
			stopUpgradingItems();
			return;
		}
		
		upgrade(find_item_idx(upgradable[0]), locate_item("scroll0"));

	}, 1000);
}

function stopUpgradingItems()
{
	clearInterval(upgradeInterval);
}