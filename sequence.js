class SequentialEvent
{
	Invoke(callback)
	{
		this.callback = callback;
	}

	OnEventComplete()
	{
		if(this.callback)
		{
			this.callback();
		}
	}
}

class InstantSequentialEvent extends SequentialEvent
{
	constructor(func)
	{
		super();

		this.func = func;
	}

	Invoke(callback)
	{
		super.Invoke(callback);
		
		game_log("instant event complete");
		this.func();

		this.OnEventComplete();
	}

	OnEventComplete()
	{
		if(this.callback)
		{
			this.callback();
		}
	}
}

class RunNextSetOfEventsEvent extends InstantSequentialEvent
{
	constructor(eventManager, nextEvents)
	{
		super(eventManager.RunEvents(nextEvents));
	}
}

class SmartMoveSequentialEvent extends SequentialEvent
{
	constructor(smartMoveParam)
	{
		super([arguments]);
		
		this.smartMoveParam = smartMoveParam;
	}

	Invoke(callback)
	{
		super.Invoke(callback);

		smart_move(this.smartMoveParam, () => {this.OnEventComplete()});
	}
}

class GoToTheCaveEvent extends SmartMoveSequentialEvent
{
	constructor(smartMoveParam)
	{
		super("cave");
	}
}

class GoToDraculSpotEvent extends SmartMoveSequentialEvent
{
	constructor(smartMoveParam)
	{
		super({map:character.map,x:164,y:-1200});
	}
}

class GoToUpgradeSpotEvent extends SmartMoveSequentialEvent
{
	constructor(smartMoveParam)
	{
		super("newupgrade");
	}
}

class AskForMoneyEvent extends InstantSequentialEvent
{
	constructor()
	{
		super(() => 
		{
			send_cm("WarriorS", {type:"GiveMoney"});
			send_cm("MageS", {type:"GiveMoney"});
			send_cm("PriestS", {type:"GiveMoney"});
		});
	}
}

class AskForItemsEvent extends InstantSequentialEvent
{
	constructor()
	{
		super(() => 
		{
			send_cm("WarriorS", {type:"GiveItems"});
			send_cm("MageS", {type:"GiveItems"});
			send_cm("PriestS", {type:"GiveItems"});
		});
	}
}

class BuyPotionsEvent extends InstantSequentialEvent
{
	constructor(numHP, numMP)
	{
		game_log("ctor with " + numHP + " hp potions");
		game_log("ctor with " + numMP + " mp potions");

		super(() => 
		{
			game_log("buying " + numHP + " hp potions");
			game_log("buying " + numMP + " mp potions");
			buy("hpot0", numHP);
			buy("mpot0", numMP);
		});
	}
}

class DistributePotionsEvent extends InstantSequentialEvent
{
	constructor(numHP, numMP)
	{
		super(() => 
		{
			game_log("distributing pots!");

			// Split up hp pots
			var numHPPots = return_item("hpot0").q;
			var numMPPots = return_item("mpot0").q;
			send_item("WarriorS", locate_item("hpot0"), numHPPots/3);
			send_item("PriestS", locate_item("hpot0"), numHPPots/3);
			send_item("MageS", locate_item("hpot0"), numHPPots/3);
		
			// Split the mp pots between the priest and the mage
			send_item("PriestS", locate_item("mpot0"), 3 * numMPPots / 8);
			send_item("MageS", locate_item("mpot0"), numMPPots / 2);
			send_item("MageS", locate_item("mpot0"), numMPPots / 8);
		});
	}
}


class SequentialEventManager
{
	RunEvents(events)
	{
		this.currentEventId = 0;

		this.events = events;

		return new SequenceContextualMenu(this);
	}

	Start()
	{
		this.RunNextEvent();
	}

	RunNextEvent()
	{
		this.events[this.currentEventId].Invoke(() => {this.OnCurrentEventComplete()});
		game_log("starting next event");
		game_log(this.events[this.currentEventId]);
	}

	OnCurrentEventComplete()
	{
		this.currentEventId++;

		game_log("event complete!");
		
		// Keep running events until there are no more
		if(this.events.length > this.currentEventId)
		{
			this.RunNextEvent();
		}
	}

	// Once the previous set of events is complete run another set
	Then(nextEvents)
	{
		game_log("adding new event");
		game_log(nextEvents);
		this.events = this.events.concat(nextEvents);

		return this;
	}
}

class SequenceContextualMenu
{
	constructor(eventManager)
	{
		this.eventManager = eventManager;
	}

	QueueMoreEvents(events)
	{
		return new SequenceContextualMenu(this.eventManager.Then(events))
	}

	Start()
	{
		this.eventManager.Start();
	}
	
	askForMoney()
	{
		return this.QueueMoreEvents([new AskForMoneyEvent()]);
	}
	
	askForItems()
	{
		return this.QueueMoreEvents([new AskForItemsEvent()]);
	}
	
	goToTheCave()
	{
		return this.QueueMoreEvents([new GoToTheCaveEvent()]);
	}
	
	goToTheBoys()
	{
		return this.QueueMoreEvents([
			new GoToTheCaveEvent(),
			new GoToDraculSpotEvent()]);
	}
	
	goToDraculSpot()
	{
		return this.QueueMoreEvents([new GoToDraculSpotEvent()]);
	}
	
	goToUpgradeSpot()
	{
		return this.QueueMoreEvents([new GoToUpgradeSpotEvent()]);
	}
	
	buyPotions(hpPots, mpPots)
	{
		return this.QueueMoreEvents([new BuyPotionsEvent(hpPots, mpPots)]);
	}
	
	distributePotions()
	{
		return this.QueueMoreEvents([new DistributePotionsEvent()]);
	}
}