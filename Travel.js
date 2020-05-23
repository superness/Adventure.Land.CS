load_code("Sequences");

function runEvents(events)
{
	return new SequentialEventManager().RunEvents(events);
}

function goToTheCave()
{
	return runEvents([new GoToTheCaveEvent()]);
}

function goToTheBoys()
{
	return runEvents([
		new GoToTheCaveEvent(),
		new GoToDraculSpotEvent()]);
}

function goToDraculSpot()
{
	return runEvents([new GoToDraculSpotEvent()]);
}

function goToUpgradeSpot()
{
	return runEvents([new GoToUpgradeSpotEvent()]);
}