
/**
 * A class that handles moving the character from position A to position B.
 *
 * Note: All public methods in this class are asynchronous!
 * @requires {*} Common.js
 * @requires {Comm} Common.js
 */
class Mover {
	/**
	 * Should errors/messages be logged to the console (Game Inspector)?
	 * @type {boolean}
	 */
	static logToConsole = true;

	/**
	 * Should errors/messages be displayed in the window?
	 * @type {boolean}
	 */
	static logToWindow = false;

	static requestStop = false
	static moving = false

	static setGoal(newGoal)
	{
		if(null == goal)
		{
			goal = newGoal
			return
		}

		if(null == newGoal)
		{
			goal = null
			return
		}

		if(null == newGoal.x)
		{
			return
		}
		if(null == newGoal.y)
		{
			return
		}

		// Move goal toward the new goal
		let dx = newGoal.x - goal.x
		let dy = newGoal.y - goal.y
		
		// let prevGoal = {x:goal.x, y:goal.y}

		let targetGoal = {x:goal.x, y:goal.y}
		targetGoal.x += dx / 5.0
		targetGoal.y += dy / 5.0

		if(targetGoal.x == null)
		{
			return
		}
		if(targetGoal.y == null)
		{
			return
		}

		goal.x = targetGoal.x
		goal.y = targetGoal.y
	}

	/**
	 * Move the character to a destination using the pathfinder service, if applicable.
	 * Falls back to smart_move if an error occurred.
	 * @param {{x: number, y: number, map: string}} destination
	 * @returns {Promise<void>}
	 */
	static async move_by_path(data) {
		// game_log("move by path :O ")
		// if (Mover.moving == true) {

		// 	// if(true == Mover.requestStop)
		// 	// {
		// 	// 	return // already trying to stop for something else
		// 	// }

		// 	game_log(`cannot move again while moving - requesting stop`)
		// 	Mover.requestStop = true
		// 	let tries = 0
		// 	while (Mover.moving == true) {
		// 		if (tries >= 5) {
		// 			Mover.moving = false;
		// 			Mover.requestStop = false
		// 			break
		// 		}

		// 		game_log(`cannot move again while moving -- waiting ${tries++}`)
		// 		await sleep(100)
		// 	}
		// 	Mover.requestStop = false
		// }

		Mover.moving = true;

		// Skip the first node?
		let first = true

		for (let i in data) {
			if (Mover.requestStop) {
				break
			}
			if (character.dead || character.rip)
				return;

			if (true == first) {
				first = false
				continue
			}

			let step = data[i];
			if (step.Action == "Move") {

				// // Don't go to anything we are already at
				// let dist = simple_distance(character, {x:step.X, y:step.Y})
				// if(dist < 25)
				// {
				// 	game_log(`already this close to spot ${dist}`)
				// 	continue
				// }

				// Draw where we are going to
				draw_line(character.x, character.y, step.X, step.Y, 1, 0x17d8e6)
				draw_circle(step.X, step.Y, 3, 2, 0x17d8e6)

				//game_log(`moving to ${step.X} ${step.Y}`)
				let madeIt = await Mover.moveX(step.X, step.Y);

				if(!madeIt) return
			}
			else if (step.Action == "Transport") {
				await transport(step.ActionTarget, step.TargetSpawn);
				await sleep(100);
				while (is_transporting(character))
					await sleep(100);
				await sleep(500);
			}
			else if (step.Action == "Town") {
				while (is_on_cooldown("use_town"))
					await sleep(100);

				await use_skill("use_town");
				await sleep(500);
				while (is_transporting(character))
					await sleep(500);
				await sleep(100);
			}
		}

		Mover.moving = false
		Mover.requestStop = false
		//game_log("Mover - OK WE DID IT!")
	}

	/**
	 * Get a path from [Start] to [destination] using the pathfinder service.
	 * @param {{x: number, y: number, map: string}} start
	 * @param {{x: number, y: number, map: string}} destination
	 * @returns {Promise<{path: object[], time: number, error: string|null}>}
	 */
	static async get_path(start, destination) {
		if (typeof (start) != "object")
			return { "error": `Start is not an object` };
		if (typeof (destination) != "object")
			return { "error": `Destination is not an object` };

		let err = Mover._ensureRequiredFields(["x", "y"], [start, destination]);
		if (err != null)
			return { "error": err };

		let phComm = new Comm();
		let connected = await phComm.openAsync();

		if (!connected)
			return { "error": "Invalid response" };

		let params = {
			fromX: start.x,
			fromY: start.y,
			toX: destination.x,
			toY: destination.y
		};

		if ("map" in start)
			params["fromMap"] = start.map;

		if ("map" in destination)
			params["toMap"] = destination.map;

		let response = await phComm.callService("pathFinderService", "GetPath", params, 10000);

		phComm.close();

		if (response == null || typeof (response) != "object")
			return { "error": "Invalid response" };

		return response;
	}

	/**
	 * Emulates the standard move command, but ensures that the character doesn't get stuck in the same position.
	 * @param {number | {x: number, y: number, map: string}} x
	 * @param {number} [y]
	 * @returns {Promise<boolean>}
	 */
	static async moveX(x, y) {
		if (typeof (x) == "object") {
			let err = Mover._ensureRequiredFields(["x", "y"], [X]);
			if (err != null) {
				Mover._log(err);
				return false;
			}
			else {
				y = x.y;
				x = x.x;
			}
		}

		if (x == character.x && y == character.y)
			return true;

		let tries = 0;
		let pos = [character.x, character.y, character.map];
		while (true) {
			if (tries >= 5) {
				//game_log("failed to move to " + x + " " + y)
				return false;
			}
			
			// // Don't go to anything we are already at
			// let dist = simple_distance(character, {x:x, y:y});
			// if(dist < 5)
			// {
			// 	game_log(`already this close to spot ${dist}`)
			// 	continue
			// }

			//await move(x, y);
			Mover.setGoal({x:x, y:y})
			await sleep(5);
			let dist = simple_distance(character, {x:x, y:y});
			if (dist < 15) {
				goal = null
				//game_log(`successfully moved to ${x} ${y}`)
				break;
			}
			tries++;

			if (Mover.requestStop) {
				goal = null
				break;
			}

			await sleep(250);
		}

		goal = null
		//game_log(`successfully moved to ${x} ${y} END OF BLOCK`)
		return true;
	}

	/**
	 * Emulates the standard smart_move command, but ensures that the character has stopped before continuing.
	 * @param {{x: number, y: number, map: string} | string} position
	 * @returns {Promise<void>}
	 */
	static async smart_moveX(position) {
		let done = false;

		smart_move(position).then(function (data) {
			done = true;
		}).catch(function (data) {
			done = true;
		});

		while (!done)
			await sleep(250);

		while (smart != null && smart.moving)
			await sleep(250);
	}

	/**
	 * Pathfinder logging method
	 * @private
	 * @returns {void}
	 */
	static _log() {
		if (Mover.logToConsole)
			console.log.apply(this, arguments);

		if (Mover.logToWindow) {
			let str = "";
			for (let i in arguments) {
				let arg = arguments[i];
				if (typeof (arg) == "object")
					str += JSON.stringify(arg);
				else
					str += arg;
			}
			log(str);
		}
	}

	/**
	 * Ensure that each object in [params] contains the [requiredFields] fields/properties.
	 * @param {string[]} requiredFields
	 * @param {Array} params
	 * @returns {string | null} An error message or null if there is no error.
	 */
	static _ensureRequiredFields(requiredFields, params) {
		for (let i in requiredFields) {
			for (let j in params) {
				if (!(requiredFields[i] in params[j]))
					return `Parameter ${j} is missing required field ${requiredFields[i]}`;
			}
		}

		return null;
	}
}


async function moveToPath(path) {
	await Mover.move_by_path(path)
}














//Extra range to add to a monsters attack range, to give a little more wiggle room to the algorithm.
let rangeBuffer = 45;

//How far away we want to consider monsters for
let calcRadius = 150;

//What types of monsters we want to try to avoid
let avoidTypes = ["a2", "a8", "a6","a4", "a3", "a1"];

if(character.name == "WarriorS")
{
	avoidTypes = ["a4", "a1"]
}

let avoidPlayers = false;//Set to false to not avoid players at all
let playerBuffer = 30;//Additional Range around players
let avoidPlayersWhitelist = [];//Players want to avoid differently
let avoidPlayersWhitelistRange = 30; //Set to null here to not avoid whitelisted players
let playerRangeOverride = 65; //Overrides how far to avoid, set to null to use player range.
let playerAvoidIgnoreClasses = ["merchant"];//Classes we don't want to try to avoid

//Tracking when we send movements to avoid flooding the socket and getting DC'd
let lastMove;

//Whether we want to draw the various calculations done visually
let drawDebug2 = true;


	
let goal = null;

setInterval(function()
{
	if(drawDebug2)
	{
		clear_drawings();
	}

	if(character.rip)
	{
		goal = null
		return
	}
	
	//Try to avoid monsters, 
	let avoidMove = avoidMobs(goal);
	
	if(goal != null)
	{
		if(lastMove == null || new Date() - lastMove > 100)
		{
			// // Pretty much there chill out
			// let dist = simple_distance(character, goal)
			// if(dist < 15)
			// {
			// 	return
			// }

			move(goal.x, goal.y);
			lastMove = new Date();
		}
	}
	
}, 25);

function avoidMobs(goal)
{
	let noGoal = false;
	
	if(goal == null || goal.x == null || goal.y == null)
	{
		noGoal = true;
	}
	
	if(drawDebug2 && !noGoal)
	{
		draw_circle(goal.x, goal.y, 25, 1, 0xDFDC22);
	}
	
	let maxWeight;
	let maxWeightAngle;
	let movingTowards = false;
	
	let monstersInRadius = getMonstersInRadius();
	
	let avoidRanges = getAnglesToAvoid(monstersInRadius);
	let inAttackRange = isInAttackRange(monstersInRadius);
	if(!noGoal)
	{
		let desiredMoveAngle = angleToPoint(character, goal.x, goal.y);

		

		let movingTowards = angleIntersectsMonsters(avoidRanges, desiredMoveAngle);

		let distanceToDesired = distanceToPoint(character.real_x, character.real_y, goal.x, goal.y);

		let testMovePos = pointOnAngle(character, desiredMoveAngle, distanceToDesired);
	
		if(drawDebug2)
		{
			draw_line(character.real_x, character.real_y, testMovePos.x, testMovePos.y, 1, 0xDFDC22);
		}
	}
	
	
	//If we can't just directly walk to the goal without being in danger, we have to try to avoid it
	if(inAttackRange || movingTowards || (!noGoal && !can_move_to(goal.x, goal.y)))
	{
		//Loop through the full 360 degrees (2PI Radians) around the character
		//We'll test each point and see which way is the safest to  go
		for(i = 0; i < Math.PI*2; i += Math.PI/60)
		{
			let weight = 0;

			let position = pointOnAngle(character, i, 75);
			
			//Exclude any directions we cannot move to (walls and whatnot)
			if(can_move_to(position.x, position.y))
			{
				
				//If a direction takes us away from a monster that we're too close to, apply some pressure to that direction to make it preferred
				let rangeWeight = 0;
				let inRange = false;
				let target = get_target()
				for(id in monstersInRadius)
				{
					let entity = monstersInRadius[id];

					let monsterRange = getRange(entity);

					let distToMonster = distanceToPoint(position.x, position.y, entity.real_x, entity.real_y);

					let charDistToMonster = distanceToPoint(character.real_x, character.real_y, entity.real_x, entity.real_y);

					if(charDistToMonster < monsterRange)
					{
						inRange = true;
					}

					if(charDistToMonster < monsterRange && distToMonster > charDistToMonster)
					{
						rangeWeight += distToMonster - charDistToMonster;
					}

				}

				if(inRange)
				{
					weight = rangeWeight;
				}
				
				//Determine if this direction would cause is to walk towards a monster's radius
				let intersectsRadius = angleIntersectsMonsters(avoidRanges, i);
				
				//Apply some selective pressure to this direction based on whether it takes us closer or further from our intended goal
				if(goal != null && goal.x != null && goal.y != null)
				{
					let tarDistToPoint = distanceToPoint(position.x, position.y, goal.x, goal.y);

					weight -= tarDistToPoint/10;
				}
				
				//Exclude any directions which would make us walk towards a monster's radius
				if(intersectsRadius === false)
				{
					//Update the current max weight direction if this one is better than the others we've tested
					if(maxWeight == null || weight > maxWeight)
					{
						maxWeight = weight;
						maxWeightAngle = i;
					}
				}
			}
		}
		
		//Move towards the direction which has been calculated to be the least dangerous
		let movePoint = pointOnAngle(character, maxWeightAngle, 20);

		Mover.setGoal({x:movePoint.x, y:movePoint.y});
		
		if(drawDebug2)
		{
			draw_line(character.real_x, character.real_y, movePoint.x, movePoint.y, 2, 0xF20D0D);
		}
		
		return movePoint;
	}
	else
	{
		return null;
	}
	
}

function getRange(entity)
{
	let monsterRange;
			
	if(entity.type != "character")
	{
			
		monsterRange = parent.G.monsters[entity.mtype].range + rangeBuffer;
	}
	else
	{
		if(avoidPlayersWhitelist.includes(entity.id) && avoidPlayersWhitelistRange != null)
		{
			monsterRange = avoidPlayersWhitelistRange;
		}
		else if(playerRangeOverride != null)
		{
			monsterRange = playerRangeOverride + playerBuffer;
		}
		else
		{
			monsterRange = entity.range + playerBuffer;
		}
	}
	
	return monsterRange;
}

function isInAttackRange(monstersInRadius)
{
	for(id in monstersInRadius)
	{
		let monster = monstersInRadius[id];
		let monsterRange = getRange(monster);
		
		let charDistToMonster = distanceToPoint(character.real_x, character.real_y, monster.real_x, monster.real_y);
		
		if(charDistToMonster < monsterRange)
		{
			return true;
		}
	}
	
	return false;
}

function angleIntersectsMonsters(avoidRanges, angle)
{
	for(id in avoidRanges)
	{
		let range = avoidRanges[id];

		let between = isBetween(range[1], range[0], angle);



		if(between)
		{
			return true;
		}
	}
	
	return false;
}

function getAnglesToAvoid(monstersInRadius)
{
	let avoidRanges = [];
	
	if(monstersInRadius.length > 0)
	{
		for(id in monstersInRadius)
		{
			let monster = monstersInRadius[id];
			
			let monsterRange = getRange(monster);
			
			let tangents = findTangents({x: character.real_x, y: character.real_y}, {x: monster.real_x, y: monster.real_y, radius: monsterRange});
			
			//Tangents won't be found if we're within the radius
			if(!isNaN(tangents[0].x))
			{
				let angle1 = angleToPoint(character, tangents[0].x, tangents[0].y);
				let angle2 = angleToPoint(character, tangents[1].x, tangents[1].y);

				if(angle1 < angle2)
				{
					avoidRanges.push([angle1, angle2]);
				}
				else
				{
					avoidRanges.push([angle2, angle1]);
				}
				if(drawDebug2)
				{
					draw_line(character.real_x, character.real_y, tangents[0].x, tangents[0].y, 1, 0x17F20D);
					draw_line(character.real_x, character.real_y, tangents[1].x, tangents[1].y, 1, 0x17F20D);
				}
			}
			
			if(drawDebug2)
			{
				draw_circle(monster.real_x, monster.real_y, monsterRange, 1, 0x17F20D);
			}
		}
	}
	
	return avoidRanges;
}

function getMonstersInRadius()
{
	let monstersInRadius = [];

	let target = get_target()
	
	for(id in parent.entities)
	{
		let entity = parent.entities[id];

		if(entity.id == target?.id) continue

		let distanceToEntity = distanceToPoint(entity.real_x, entity.real_y, character.real_x, character.real_y);
		
		let range = getRange(entity);
		
		if(entity.type === "monster" && avoidTypes.includes(entity.mtype))
		{
			
			let monsterRange = getRange(entity);

			if(distanceToEntity < calcRadius)
			{
				monstersInRadius.push(entity);
			}
		}
		// else
		// {
		// 	if(avoidPlayers && entity.type === "character" && !entity.npc && !playerAvoidIgnoreClasses.includes(entity.ctype))
		// 	{
		// 		if(!avoidPlayersWhitelist.includes(entity.id) || avoidPlayersWhitelistRange != null)
		// 		{
		// 			if(distanceToEntity < calcRadius || distanceToEntity < range)
		// 			monstersInRadius.push(entity);
		// 		}
		// 	}
		// }
	}
	
	return monstersInRadius;
}


function normalizeAngle(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
}  

//Source: https://stackoverflow.com/questions/11406189/determine-if-angle-lies-between-2-other-angles
function isBetween(angle1, angle2, target)
{
	if(angle1 <= angle2) {
		if(angle2 - angle1 <= Math.PI) {
			return angle1 <= target && target <= angle2;
		} else {
			return angle2 <= target || target <= angle1;
		}
	} else {
		if(angle1 - angle2 <= Math.PI) {
			return angle2 <= target && target <= angle1;
		} else {
			return angle1 <= target || target <= angle2;
		}
	}
}

//Source: https://stackoverflow.com/questions/1351746/find-a-tangent-point-on-circle
function findTangents(point, circle)
{
	let dx = circle.x - point.x;
	let dy = circle.y - point.y;
	let dd = Math.sqrt(dx * dx + dy * dy);
	let a = Math.asin(circle.radius/dd);
	let b = Math.atan2(dy, dx);
	
	let t = b - a;
	
	let ta = {x:circle.x + (circle.radius * Math.sin(t)), y: circle.y + (circle.radius * -Math.cos(t))};
	
	t = b + a;
	let tb = {x: circle.x + circle.radius * -Math.sin(t), y: circle.y + circle.radius * Math.cos(t)}
	
	
	
	return [ta, tb];
}

function offsetToPoint(x, y)
{
	let angle = angleToPoint(x, y) + Math.PI/2;
	
	return angle - characterAngle();
	
}

function pointOnAngle(entity, angle, distance)
{
	let circX = entity.real_x + (distance * Math.cos(angle));
	let circY = entity.real_y + (distance * Math.sin(angle));
	
	return {x: circX, y: circY};
}

function entityAngle(entity)
{
	return (entity.angle * Math.PI)/180;
}

function angleToPoint(entity, x, y) {
    let deltaX = entity.real_x - x;
    let deltaY = entity.real_y - y;

    return Math.atan2(deltaY, deltaX) + Math.PI;
}

function characterAngle() {
    return (character.angle * Math.PI) / 180;
}

function distanceToPoint(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}