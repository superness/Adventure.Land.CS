function getTeleportPath(startPos, endMap)
{
    var openList = [];
	
    var closedList = [];
	
    var activeNode = mapTeleports[startPos.map];
	
    var loopLimit = 1000;
    var counter = 0;
	
    while(activeNode.map != endMap && counter < loopLimit)
    {
        for(let map in activeNode.teleports)
        {
            var teleport = activeNode.teleports[map];
			
            teleport.from = activeNode.map;
			
            if(!closedList.includes(teleport.to))
            {
                openList.push(teleport);
				
                if(teleport.to == endMap)
                {
                    return reduceOpenList(openList);
                }
            }
        }
		
        closedList.push(activeNode.map);
        var availableMaps = openList.filter(tp => !closedList.includes(tp.to));
        if(availableMaps.length > 0)
        {
            activeNode = mapTeleports[availableMaps[0].to];
        }
        else
        {
            return null;
        }
        counter++;
    }
	
	console.log("Pathfinding exceeded loop limit");
}

function reduceOpenList(openList)
{
    var reducedList = [];
	
    var activeNode = openList[openList.length - 1];
	
    var loopLimit = 1000;
    var counter = 0;
	
    while(activeNode != null && counter < loopLimit)
    {
        reducedList.push(activeNode);
		
        var previousNode = openList.filter(n => n.to == activeNode.from && n.to != n.from);
		
        if(previousNode.length > 0)
        {
            activeNode = previousNode[0];
        }
        else
        {
            activeNode = null;
        }
        counter++;
    }
	
    if(counter >= loopLimit)
    {
        console.log("Pathfinding exceeded loop limit");
    }
	
    return reducedList.reverse();
}

function findNearestTeleportToMap(mapName)
{
    var teleportLocation = {};
    var teleportDistance;
    var map = parent.G.maps[character.map];
		
    for(let doorName in map.doors)
    {
        var door = map.doors[doorName];
        if(door[4] == mapName)
        {
            var doorDist = simple_distance(character, {x:door[0], y:door[1]});
            if(teleportDistance == null || doorDist < teleportDistance)
            {
				var spawn = map.spawns[door[6]];
				
                teleportLocation = {x: spawn[0], y: spawn[1], s: door[5]};
				
				
				teleportDistance = doorDist;
            }
        }
    }
		
    var transporter = map.npcs.filter(npc => npc.id == "transporter");
		
    if(transporter.length > 0)
    {
        var npc = transporter[0];
        var places = Object.keys(parent.G.npcs.transporter.places);

		for(let id in places)
		{
			var placeMap = places[id];
			if(placeMap == mapName)
			{
				var doorDist = simple_distance(character, {x:npc.position[0], y:npc.position[1]});
				if(teleportDistance == null || doorDist < teleportDistance)
				{
					let closestSpawn = findClosestSpawnToNPC("transporter", character.map);
					switch(character.map){
						case "halloween":
							break;
					}
					teleportLocation = {x: closestSpawn.x, y: closestSpawn.y, s: parent.G.npcs.transporter.places[placeMap]};
				}
			}
		}
    }
	
    return teleportLocation;
}

function findNPC(name, map)
{
	for(let id in G.maps[map].npcs)
	{
		let npc = G.maps[map].npcs[id];
		
		if(npc.id == name)
		{
			return npc;
		}
	}
}

function findClosestSpawnToNPC(name, map)
{
	let npc = findNPC(name, map);
	
	let closestSpawn = null;
	let closestDist = null;
	
	for(let id in G.maps[map].spawns)
	{
		let spawn = G.maps[map].spawns[id];
		
		let dist = simple_distance({x: npc.position[0], y: npc.position[1]}, {x: spawn[0], y: spawn[1]});
		
		if(closestDist == null || dist < closestDist)
		{
			closestDist = dist;
			closestSpawn = {x: spawn[0], y: spawn[1], s: id};
		}
	}
	
	return closestSpawn;
}


Math.getDistance = function( x1, y1, x2, y2 ) {
	
	var 	xs = x2 - x1,
		ys = y2 - y1;		
	
	xs *= xs;
	ys *= ys;
	 
	return Math.sqrt( xs + ys );
};

async function blinkToSpotAsync(x, y, map)
{
	while(true)
	{
		blinkToSpot(x, y, map)

		// See if we are there yet
		if(character.in == map &&
		   Math.getDistance(character.x, character.y, x, y) < 50)
		{
			return
		}

		await sleep(100)	
	}
}

function blinkToSpot(x, y, map){
	// stop moving
	goal = null
	if(character.map != map)
	{
		let path = getTeleportPath({x: character.x, y: character.y, map: character.map}, map);
		
		if(path != null)
		{
			let nextTP = findNearestTeleportToMap(path[0].to);
			
			let distToTP = simple_distance(character, nextTP);
			
			if(distToTP < 30)
			{
				transport(path[0].to, nextTP.s);
			}
			else
			{
				tryBlink(nextTP.x, nextTP.y);
			}
		}
	}
	else
	{
		tryBlink(x,y);
	}
}

let lastBlink = 0;

function tryBlink(x,y){
	if(new Date() - lastBlink > G.skills.blink.cooldown + 100)
	{
		
		use_skill("blink", [x,y]);
		lastBlink = new Date();
	}
}


function populateMapTeleports()
{
	
    for(var mapName in parent.G.maps)
    {
		if(excludeMaps.indexOf(mapName) == -1)
		{
			var teleports = {map: mapName, teleports: []};
			var map = parent.G.maps[mapName];

			for(var doorName in map.doors)
			{
				var door = map.doors[doorName];
				if(teleports.teleports.filter(tp => tp.to == door[4]) == 0 && mapName != door[4])
				{
					if(excludeMaps.indexOf(door[4]) == -1)
					{
						teleports.teleports.push({to: door[4]});
					}
				}

			}

			var transporter = map.npcs.filter(npc => npc.id == "transporter");

			if(transporter.length > 0)
			{
				var places = Object.keys(parent.G.npcs.transporter.places);
				for(let id in places)
				{
					var placeMap = places[id];
					if(excludeMaps.indexOf(placeMap) == -1)
					{
						if(teleports.teleports.filter(tp => tp.to == placeMap) == 0 && mapName != placeMap)
						{
							teleports.teleports.push({to: placeMap});
						}
					}
				}
			}
			mapTeleports[mapName] = teleports;
		}
    }
}

let mapTeleports = {};
let excludeMaps = [];

populateMapTeleports();