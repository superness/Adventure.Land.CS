load_code("blinkmove") //for blinkToSpot
load_code("stayaway") // for stayAwayFromTarget
load_code("ALData");
load_code("Pathfindering"); // Path finding and moving
load_code("Mover");
load_code("GroupScare")

load_code("meters")


class TaskConditionFuncRegistration {
	constructor() {
		this.registry = {}
	}

	registerCondtionFunc(conditionType, conditionFunc) {
		this.registry[conditionType] = conditionFunc;
	}

	getRegisteredConditionFunc(conditionType) {
		if (!this.registry.hasOwnProperty(conditionType)) {
			throw "unable to find registered condition type " + conditionType + " !"
		}

		return this.registry[conditionType];
	}
}

class TaskFuncRegistration {
	constructor() {
		this.registry = {}
	}

	registerTaskFunc(taskType, taskFunc) {
		this.registry[taskType] = taskFunc;
	}

	getRegisteredTaskFunc(taskType) {
		if (!this.registry.hasOwnProperty(taskType)) {
			throw "unable to find registered task type " + taskType + " !"
		}

		return this.registry[taskType];
	}
}

function on_cm(name, data) {
	let known = ['MageS', 'PriestS', 'WarriorS']

	game_log(' got a cm from ' + name)

	if (!known.includes(name)) return

	game_log(' cm type ' + data.type)

	if (data.type == "Trade") {
		for (id in character.items) {
			var item = character.items[id]
			if (null == item) continue

			if (item.name == data.name && item.level == data.level) {
				game_log(' sending back ' + id)
				send_item(name, id)
				return
			}
		}
	}
}


function TryGetFromPlayer(name, level, player) {
	if (null == player) return

	for (id in player.items) {
		var item = player.items[id]
		if (null == item) continue

		if (item.name == name && item.level == level) {
			// /game_log("  asking " + player.name + " for " + name + " " + level)
			send_cm(player.name, { type: 'Trade', name: name, level: level })

			return
		}
	}

	// /game_log("  " + player.name + " does not have " + name + " " + level)
}

function GroupEquip(name, slot, level) {
	//game_log("  group equip " + name + " " + level + " " + slot)

	// If we have this item in our inventory then equip it
	for (id in character.items) {
		var item = character.items[id]

		if (null == item) continue

		if (item.name == name && item.level == level) {
			//game_log(" found it locally " + id)
			equip(id, slot)
			return
		}
	}

	//game_log(" did not find " + name + " " + level + " in inventory - asking friends")

	// If we don't have this in our inventory then ask someone in the group for theirs
	let warrior = get_player('WarriorS')
	let priest = get_player('PriestS')
	let mage = get_player('MageS')

	if (null != warrior) {
		warrior = get('WarriorS')
		TryGetFromPlayer(name, level, warrior)
	}
	if (null != priest) {
		priest = get('PriestS')
		TryGetFromPlayer(name, level, priest)
	}
	if (null != mage) {
		mage = get('MageS')
		TryGetFromPlayer(name, level, mage)
	}
}


function PartyMemberFarFromGroup(args) {
	let player = get_player(args.Name)

	if (null == player) {
		return true
	}

	let distFar = args.Distance ?? 240;
	return player.map != character.map || simple_distance(character, player) > distFar
}

function PartyMemberHasLowMana(args) {
	let player = get_player(args.Name)

	if (null == player) {
		return false
	}

	let mpRatio = player.mp / player.max_mp

	return mpRatio < 0.5
}

function TargetNearDeath(args) {
	let taget = get_target()

	if (null == taget) {
		return false
	}

	let hpRatio = taget.hp / taget.max_hp

	return hpRatio < args.Ratio
}

function AllPartyMemberTakenDamage(args) {
	if (parent.party_list == 0) return

	let anyPartyDmg = false

	for (c of parent.party_list) {
		if (character.name == c) continue
		let player = get_player(c)

		if (null == player) {
			continue
		}

		let dmgTaken = player.max_hp - player.hp

		if (dmgTaken < 700) {
			return false
		}

		anyPartyDmg = true
	}

	return anyPartyDmg
}

function PartyMemberTakenHit(args) {
	let player = get_player(args.Name)

	if (null == player) {
		return
	}

	let dmgTaken = player.max_hp - player.hp

	if (dmgTaken < 1500) {
		return false
	}

	return true
}

function LootAvailable(args) {
	let numChests = Object.keys(parent.chests).length

	return numChests > 0
}

//let triggerHistory = []


class CondtionalTaskSetHandler {
	constructor(taskSet, taskDesc) {
		this.taskSet = taskSet
		this.taskDesc = taskDesc
	}

	Process() {
		let taskToTrigger = null
		let taskArgsToTrigger = null
		for (var task of this.taskSet) {
			let conditionsMet = true
			for (var conditionFuncAndState of task.conditionFuncsAndStates) {
				let conditionResult = conditionFuncAndState.conditionFunc(conditionFuncAndState.conditionArgs)

				if (conditionResult != conditionFuncAndState.requiredState) {
					conditionsMet = false
					break
				}
			}

			if (conditionsMet) {
				taskToTrigger = task.taskFunc
				taskArgsToTrigger = task.taskArgs
				break
			}
		}

		if (taskToTrigger) {
			taskToTrigger(taskArgsToTrigger)
		}
	}
}

let changingServer = false
function ChangeServer(region, identifier) {
	if (changingServer) {
		return
	}

	changingServer = true

	change_server(region, identifier)
}

function get_nearest_monster_with_type(type, requireTanked = false) {
	var min_d = 999999, target = null;

	for (id in parent.entities) {
		var current = parent.entities[id];
		if (type != current.mtype) continue;

		if (requireTanked && current.target == null) continue;

		var c_dist = parent.distance(character, current);
		if (c_dist < min_d) min_d = c_dist, target = current;
	}
	return target;
}

function FindNewTarget(monsterType) {
	let nearestTarget = get_nearest_monster_with_type(monsterType)

	if (null == nearestTarget) {
		return
	}

	let target = get_target()

	if(nearestTarget.id == target?.id) return

	change_target(nearestTarget)
}

function FindNewSafeTarget(monsterType) {
	let nearestTarget = get_nearest_monster_with_type(monsterType, true)

	if (null == nearestTarget) {
		return
	}

	if (null == nearestTarget.target) {
		return
	}

	change_target(nearestTarget)
}

function DepositItems() {
	game_log("DEPOSITITEMS")
	let amountToBank = Math.max(0, character.gold - 2000000);
	game_log("bank_deposit " + amountToBank)
	bank_deposit(amountToBank);
	for (var i = 0; i < character.items.length; i++) {
		if (character.items[i] &&
			!character.items[i].name.includes("scroll") &&
			!character.items[i].name.includes("stand") &&
			!character.items[i].name.includes("computer") &&
			!character.items[i].name.includes("pot") &&
			!character.items[i].name.includes("tracker") &&
			!character.items[i].name.includes("elixirluck") &&
			!character.items[i].name.includes("pumpkinspice") &&
			!character.items[i].name.includes("booster") &&
			!character.items[i].name.includes("rabbitsfoot") &&
			!character.items[i].name.includes("ringofluck") &&
			!character.items[i].name.includes("mshield") &&
			//!character.items[i].name.includes("intring") &&
			!character.items[i].name.includes("jacko") &&
			!character.items[i].name.includes("lmace") &&
			!character.items[i].name.includes("gstaff") &&
			!character.items[i].name.includes("test_orb") &&
			!character.items[i].name.includes("firestaff") &&
			!character.items[i].name.includes("cryptkey")) {
			if (character.items[i].level && character.items[i].level > 0) continue;

			game_log("bank_store " + i)
			bank_store(i);
		}
	}
}

function StayNearPlayer(player) {
	let playerEntity = get_player(player)

	if (null == playerEntity) {
		return
	}

	if (simple_distance(character, { x: playerEntity.going_x, y: playerEntity.going_y }) < 33) {
		return
	}

	// if(is_moving(character))
	// {
	// 	return;
	// }

	var moveToX = character.x + 5 * (playerEntity.going_x - character.x) / 6;
	var moveToY = character.y + 5 * (playerEntity.going_y - character.y) / 6;

	//move(moveToX, moveToY);

	getPathToPoint(moveToX, moveToY, character.map, Mover.move_by_path)
}

function StayNearTarget() {
	let target = get_target()

	if (null == target) {
		return
	}

	if (!is_in_range(target)) {
		if (is_moving(character)) {
			return;
		}

		var moveToX = character.x + 2 * (target.x - character.x) / 3;
		var moveToY = character.y + 2 * (target.y - character.y) / 3;

		//move(moveToX, moveToY);
		getPathToPoint(moveToX, moveToY, character.map, Mover.move_by_path)
	}
}
function StayNearTargetMelee() {
	let target = get_target()

	if (null == target) {
		return
	}
	
	game_log("StayNearTargetMelee")

	// if (is_moving(character)) {
	// 	return;
	// }

	var moveToX = character.x + 1 * (target.x - character.x) / 3;
	var moveToY = character.y + 1 * (target.y - character.y) / 3;

	getPathToPoint(target.real_x, target.real_y, character.map, Mover.move_by_path)
	//move(moveToX, moveToY);
}

let latencyHedge = 50
function is_on_cooldown_override(skill) {
	if (!parent.next_skill[skill]) {
		return false;
	}

	let timeToNext = parent.next_skill[skill] - new Date();
	let result = timeToNext > latencyHedge

	return result
}

function AttackTarget() {
	// game_log("atk!") 
	// return

	if (character.rip) return

	let target = get_target()

	if (null == target) {
		return;
	}

	if (is_in_range(target)) {
		if (!is_on_cooldown_override("attack")) {
			attack(target);
		}
	}
}

function UseSkill(args) {
	let target = get_player(args.Target)

	if ("target" == args.Target) {
		target = get_target()
	}

	if (null == target) {
		target = args.Target
	}

	if (is_on_cooldown_override(args.Skill)) {
		return
	}

	if (null == args.Target) {
		game_log("using skill " + args.Skill)
		use_skill(args.Skill)
		return
	}

	game_log(args.skill)
	game_log(target?.name)
	use_skill(args.Skill, target)
}

function TryHealPlayer(playerName) {
	let player = get_player(playerName)
	if (is_on_cooldown_override("heal")) return false;
	if (is_on_cooldown_override("attack")) return false;

	let target = get_target();
	heal(player);
	change_target(target);

	return true;
}

function AbsorbTarget() {
	let target = get_target()

	if (null == target) {
		return
	}

	// If the target is not targetting us then use absorb sins on it's target so that we are the tank in our luck gear
	if (target.target != character.name) {
		if (!is_on_cooldown_override("absorb")) {
			use_skill("absorb", get_player(target.target));
		}
	}
}

function EquipGoldGear(args) {
	let midasIdx = locate_item("handofmidas")

	if (-1 != midasIdx) {
		//game_log("equipping midas")
		equip(midasIdx)
	}
}

function EquipLuckGear(args) {
	// Find known luck gear in our inventory and equip it
	let ringName = "ringofluck"
	let luckGear = [
		"rabbitsfoot",
		"mshield",
		"lmace",
		"wgloves",
		"wbreeches",
		"wshoes",
		"wattire",
		"wcap",
	]

	for (var i = 0; i < 42; ++i) {
		if (null == character.items[i]) {
			continue;
		}

		if (luckGear.includes(character.items[i].name)) {
			equip(i);
		}
	}

	// try to quip the rings of luck
	let ringofLuckId = locate_item(ringName);
	if (ringofLuckId != -1) {
		if (character.slots.ring1.name != ringName) {
			equip(ringofLuckId, "ring1")
		}
		else if (character.slots.ring2.name != ringName) {
			equip(ringofLuckId, "ring2")
		}
	}
}

function EquipCombatGear(args) {
	// Find known combat gear in our inventory and equip it
	let ringName = "cring"
	let combatGear = [
		"jacko",
		"wbook0",
		//"lantern",
		"firestaff",
		//"oozingterror",
		"gphelmet",
		"coat",
		//"xarmor",
		"starkillers",
		"wingedboots",
		"mittens",
	]

	for (var i = 0; i < 42; ++i) {
		if (null == character.items[i]) {
			continue;
		}

		if (character.items[i].level == 0) continue

		if (combatGear.includes(character.items[i].name)) {
			equip(i);
		}
	}

	// try to quip the rings rings
	let intRingId = locate_item(ringName);
	if (intRingId != -1) {
		if (character.slots.ring1.name != ringName) {
			equip(intRingId, "ring1")
		}
		else if (character.slots.ring2.name != ringName) {
			equip(intRingId, "ring2")
		}
	}
}

function ShiftBooster(args) {
	let goldBoosterIdx = locate_item("goldbooster")
	let luckBoosterIdx = locate_item("luckbooster")
	let xpBoosterIdx = locate_item("xpbooster")

	if (goldBoosterIdx != -1 && args.Type != "gold") {
		//game_log("shifting gold booster to " + args.Type)
		shift(goldBoosterIdx, args.Type + "booster")
	}
	if (luckBoosterIdx != -1 && args.Type != "luck") {
		//game_log("shifting luck booster to " + args.Type)
		shift(luckBoosterIdx, args.Type + "booster")
	}
	if (xpBoosterIdx != -1 && args.Type != "xp") {
		//game_log("shifting xp booster to " + args.Type)
		shift(xpBoosterIdx, args.Type + "booster")
	}
}

function LootLogicBasic() {
	//game_log("LOOT LOGIC")
	let numChests = Object.keys(parent.chests).length
	if (numChests > 0) {
		// game_log("looting with " + character.goldm + "gold %")
		loot();
	}
}

function LootLogicAdvanced() {
	//game_log("LOOT LOGIC")
	let numChests = Object.keys(parent.chests).length
	if (numChests > 0) {

		//game_log("equipping gold stuff")
		let midasIdx = locate_item("handofmidas")
		let luckBoosterIdx = locate_item("luckbooster")
		let goldBoosterIdx = locate_item("goldbooster")

		if (-1 == midasIdx && -1 != goldBoosterIdx) {
			//game_log("looting with " + character.goldm + "gold %")
			loot();
			return
		}

		if (-1 != luckBoosterIdx) {
			shift(luckBoosterIdx, "goldbooster")
		}

	}
	else {
		let wandererGlovesIdx = locate_item("wgloves")
		let goldBoosterIdx = locate_item("goldbooster")

		if (-1 != wandererGlovesIdx) {
			equip(wandererGlovesIdx)
		}
		if (-1 != goldBoosterIdx) {
			shift(goldBoosterIdx, "luckbooster")
		}

	}
}

function EquipByName(itemName) {
	let luckElixirId = locate_item(itemName);

	if (-1 == luckElixirId) {
		return;
	}

	equip(luckElixirId);
}

function HasQuantityOfItems(args) {
	let numItems = 0

	for (var i = 0; i < 42; ++i) {
		if (null == character.items[i]) {
			continue;
		}

		if (character.items[i].name == args.ItemName) {
			numItems += character.items[i].q ?? 1
		}
	}

	return numItems >= args.ItemQuantity
}

function SendItem(args) {
	let itemId = locate_item(args.ItemName)

	if (-1 == itemId) {
		return
	}

	send_item(args.To, itemId, args.Quantity)
}

function GoToSpot(x, y, map) {
	// if(is_moving(character))
	// {
	// 	return;
	// }

	getPathToPoint(x, y, map, Mover.move_by_path)
}



let stomping = false
async function stompLoop() {
	if (stomping) return

	if (is_on_cooldown_override("stomp")) return

	stomping = true
	let prevMH = character.slots["mainhand"]
	let prevOH = character.slots["offhand"]

	if (prevMH) {
		prevMH = prevMH.name
	}
	if (prevOH) {
		prevOH = prevOH.name
	}

	await equipBasher()
	await sleep(200)
	use_skill("stomp")
	game_log("stomp!")
	await sleep(500)
	//await equipBataxe()

	equip(locate_item(prevMH), "mainhand")
	game_log("equip mh " + prevMH)

	if (prevOH) {
		await sleep(200)
		equip(locate_item(prevOH), "offhand")
		game_log("equip oh " + prevOH)
	}
	stomping = false
}

// let cleaving = false
// async function cleaveLoop()
// {
// 	if(cleaving) return

// 	if(is_on_cooldown_override("cleave")) return

// 	cleaving = true
// 	let prevMH = character.slots["mainhand"]
// 	let prevOH = character.slots["offhand"]

// 	if(prevMH)
// 	{
// 		prevMH = prevMH.name
// 	}
// 	if(null != prevOH)
// 	{
// 		prevOH = prevOH.name
// 	}

// 	await equipBataxe()
// 	await sleep(10)
// 	use_skill("cleave")
// 	await sleep(200)

// 	equip(locate_item(prevMH), "mainhand")

// 	if(null != prevOH)
// 	{
// 		await sleep(200)
// 		equip(locate_item(prevOH), "offhand")
// 	}
// 	cleaving = false
// 	game_log("done with cleave loop")
// }

async function equipBataxe() {
	if (character.slots["mainhand"] && character.slots["mainhand"].name == "bataxe") {
		return
	}

	unequip("offhand")
	equip(locate_item("bataxe"))
}

async function equipBasher() {
	unequip("offhand")
	equip(locate_item("wbasher"))
}

function PlayerHasHP(args) {
	let player = get_player(args.Player)

	if (null == player) return false

	return player.hp / player.max_hp > args.HP
}

function GoToNextServerWithBoss(bossName) {
	let servers = ["EU", "US", "ASIA"]
	let ids = ["I", "II", "III"]

	game_log("GoToNextServerWithBoss " + bossName)

	for (var server of servers) {
		for (var id of ids) {
			for (var status of serverStatuses) {
				//game_log(status.server_region + " " + status.server_identifier + " vs " + server + " " + id)
				if (!(status.server_region == server && status.server_identifier == id)) {
					continue
				}

				game_log("checking " + status.server_region + status.server_identifier)

				// Don't check the current server since we are already there
				if(status.server_region == parent.server_region &&
				   status.server_identifier == parent.server_identifier)
				   {
					   // If the boss is live here then don't go anywhere
					   if(status.eventname == bossName && status.live)
					   {
						 game_log("boss is here let's fight")
						 return
					   }
				   }

				// if (status.eventname == bossName)
				// {
				// 	game_log("GoToNextServerWithBoss " + status.eventname + status.server_region + status.server_identifier)
				// }

				if (status.eventname == bossName && status.live == true) {

					// Go to this server if we are not there already
					if (status.server_region == parent.server_region && status.server_identifier == parent.server_identifier) {
						return
					}

					game_log("Change server! " + status.server_region + " " + status.server_identifier)
					change_server(status.server_region, status.server_identifier)
					return
				}
			}
		}
	}

	game_log("did not find any servers with a live " + bossName)

	// Nothing up - go back to crypt runs
	if (character.name == "MageS") {
		ChangeScript("MageS", "ResetCrypt")
	}
	if (character.name == "WarriorS") {
		ChangeScript("WarriorS", "FarmCrypt_Warrior")
	}
	if (character.name == "PriestS") {
		ChangeScript("PriestS", "FarmCrypt_Priest")
	}
}

function Energize(args) {
	let target = get_entity(args.Target)

	if (null == target) return

	if (is_on_cooldown_override('energize')) return

	use_skill('energize', target, args.MP ?? null)
}

function CBurst(args) {
	let target = get_target()

	if (target == null) return

	if (is_on_cooldown_override('cburst')) return

	use_skill('cburst', [[target.id, args.MP]])
}

function CBurstMany(args) {
	// Find some targets nearby and use cburst on them
	let targetData = []
	let mpSpent = 80
	for(id in parent.entities)
	{
		let current = parent.entities[id];

		if(current.mtype != args.Type || 
		   current.hp == 0 ||
		   current.rip ||
		   current.dead)
		   {
			   continue
		   }

		if(!is_in_range(current)) continue

		if(mpSpent + (current.hp * 2) > character.mp) continue

		mpSpent += (current.hp * 2)
		targetData.push([current.id, current.hp * 2])
	}

	use_skill('cburst', targetData)
}

function PlayerIsInArea(player, area) {
	let playerEntity = get_player(player)

	if (null == playerEntity) {
		// If we can't get it that way then try local storage
		playerEntity = get(player)
	}

	if (null == playerEntity) {
		return
	}

	return playerEntity.map == area
}

function EnterCrypt(cryptOwner) {
	game_log("EnterCrypt " + cryptOwner)
	if ("cave" == character.map) {
		let cryptOwnerInfo = get(cryptOwner)
		if ("crypt" == cryptOwnerInfo.map) {
			game_log("entering crpyt " + cryptOwnerInfo.in)
			parent.socket.emit('enter', { place: 'crypt', name: cryptOwnerInfo.in });
		}
	}
}

function TargetPlayerTarget(tankName) {
	let tank = get_player(tankName)

	if (null == tank) {
		//game_log("Could not find the tank " + tankName + "!")
		return
	}

	let tankTarget = tank.target

	tankTarget = get_entity(tankTarget)

	// if(null == tankTarget)
	// {
	// 	change_target(null)
	// 	return
	// }

	if (null == tankTarget) {
		change_target(null)
		return
	}

	// Don't target it unless it already has a target
	if (null == tankTarget.target) {
		game_log("not targetting yet")
	}

	change_target(tankTarget);
}


function get_nearest_monster_with_name(name) {
	var min_d = 999999, target = null;

	for (id in parent.entities) {
		var current = parent.entities[id];
		if (name != current.name) continue;

		var c_dist = parent.distance(character, current);
		if (c_dist < min_d) min_d = c_dist, target = current;
	}
	return target;
}

function TargetCryptAdds() {
	let target = get_target()

	if (target) {
		let adds = ["Bat"]

		if (adds.includes(target.name)) {
			return
		}

		// Retarget if a named enemy is nearby
		for (add of adds) {
			let nearAdd = get_nearest_monster_with_name(add)

			if (null != nearAdd) {
				change_target(nearAdd)
				return
			}
		}

		return
	}
}

function CryptTarget() {
	//let target = get_target()

	//if(target != null) return

	if(is_on_cooldown_override('scare')) return

	let bosses = ["Bill", "Marceline", "Angel", "Orlok", "Lestat", "Lucinda", "Elena", "Spike", "Vampireling"]

	// Retarget if a named enemy is nearby
	for (boss of bosses) {
		let nearBoss = get_nearest_monster_with_name(boss)

		if (null != nearBoss) {
			if (nearBoss.name == "Orlok" || nearBoss.name == "Spike") {
				// make sure the party is ready to go
				let mage = get_player("MageS")
				let priest = get_player("PriestS")

				let canTarget = mage && priest && mage.mp > 2000 && priest.mp > 2000;
				if (!canTarget) {
					return
				}
			}

			change_target(nearBoss)
			return
		}
	}

	// let nearMonster = get_nearest_monster()
	// if(null != nearMonster && simple_distance(character, nearMonster) > 400)
	// {
	// 	// Don't chase too far
	// 	return
	// }

	// change_target(nearMonster)
}

function BlinkToPlayer(player) {
	let playerEntity = get_player(player)

	game_log("BlinkToPlayer " + player)

	if (null == playerEntity) {
		playerEntity = get(player)
	}

	if (null == playerEntity) {
		return
	}

	game_log("BlinkToPlayer at " + playerEntity.x + " " + playerEntity.y + " " + playerEntity.map)
	blinkToSpot(playerEntity.x, playerEntity.y, playerEntity.map)
}

function ScareAndTargetZapper() {
	let zapper = get_nearest_monster_with_type("zapper0")

	if (null == zapper) return

	if(is_on_cooldown_override('scare')) return

	//game_log("Zapper here!")

	// Target the zapper
	//change_target(zapper)
	//tryScare()

	// If jacko is not equipped then equip it before scaring
	if (character.slots.orb.name != 'jacko') {
		let jackoid = locate_item('jacko')

		if (jackoid == -1) return

		equip(jackoid)
	}

	if (zapper.target == character.name) {
		use_skill('scare')
	}
}

function ScareAndTargetBat() {
	let bat = get_nearest_monster_with_type("bat")

	if (null == bat) return

	if(is_on_cooldown_override('scare')) return

	//game_log("Bat here!")

	// // Target the zapper
	// if(character.name == "MageS")
	// {
	// 	//change_target(bat)
	// }
	//tryScare()

	if (character.targets >= 3) {
		// If jacko is not equipped then equip it before scaring
		if (character.slots.orb.name != 'jacko') {
			let jackoid = locate_item('jacko')

			if (jackoid == -1) return

			equip(jackoid)
		}

		if (is_on_cooldown_override('scare')) return
		use_skill('scare', bat)
	}
}

function ScareAdds() {
	if(is_on_cooldown_override('scare')) return

	// If anything is targetting me that is not my target then use scare
	let target = get_target()
	for (id in parent.entities) {
		var entity = parent.entities[id];

		if (null == entity) continue

		if (entity.type != 'monster') continue

		if (entity.target == character.name) {
			if (null == target || target.id != entity.id) {
				use_skill('scare', entity)
			}
		}
	}
}

let marcelineBlinkSpots = [
	{ x: 2430, y: -1750 },
	{ x: 2740, y: -1456 }
]
function BlinkDanceMarceline() {
	// Blink to the blink spot that is furthest from us
	let furthestSpot = null
	let furthestDist = -1
	for (spot of marcelineBlinkSpots) {
		let dist = simple_distance(character, spot)
		if (dist > furthestDist) {
			furthestDist = dist
			furthestSpot = spot
		}
	}

	blinkToSpot(furthestSpot.x, furthestSpot.y, character.map)
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

let bossData = []

let bossIds = ["a2", "a8", "a6","a4", "a3", "a1", "a5", "a7",  "vbat"]
// let cryptBossWaypoints = [
// 	{ x: 375, y: -1090 },
// 	{ x: -176, y: -1090 },
// 	{ x: 734, y: -1090 },
// 	{ x: 734, y: -630 },
// 	{ x: 386, y: -1480 },
// 	{ x: 1080, y: -1480 },
// 	{ x: 1783, y: -1621 },
// 	{ x: 2220, y: -1744 },
// 	{ x: 2750, y: -1744 },
// 	{ x: 2735, y: -1084 },
// 	{ x: 2146, y: -1084 },
// 	{ x: 1448, y: -869 },
// 	{ x: 1243, y: -387 },
// 	{ x: 2216, y: -660 },
// 	{ x: 2475, y: -151 },
// 	{ x: 2186, y: 256 },
// 	{ x: 2186, y: 256 },
// 	{ x: 2548, y: 418 },
// ]
let cryptBossWaypoints = [
	{ x: 605, y: -1080 },
	{ x: 1111, y: -400 },
	{ x: 2102, y: -1742 },
	{ x: 2043, y: -718 },
	{ x: 2198, y: 67 },
]

let hunting = false
async function HuntCryptBoss() {
	// Don't interrupt the hunt
	if (hunting == true) {
		game_log("already hunting")
		return
	}

	// Don't blink if we can't also magiport the squad in
	if (character.mp < 3400) return

	game_log("!!! starting a new hunt !!!")
	game_log("!!! starting a new hunt !!!")
	game_log("!!! starting a new hunt !!!")

	hunting = true

	// blink between a set of waypoints
	//  at each waypoint if we see one of the bosses then target it
	for (wp of cryptBossWaypoints) {
		while (simple_distance(character, wp) > 100) {

			// If we found a boss then target it
			for (id of bossIds) {
				let nearBoss = get_nearest_monster_with_type(id)

				if (nearBoss != null) {
					game_log("\\\ found a boss quitting hunt ///")
					game_log("\\\ found a boss quitting hunt ///")
					game_log("\\\ found a boss quitting hunt ///")
					change_target(nearBoss)
					hunting = false
					return
				}
			}

			if (get_target() != null) {
				game_log("\\\ found a target quitting hunt ///")
				game_log("\\\ found a target quitting hunt ///")
				game_log("\\\ found a target quitting hunt ///")
				hunting = false
				return
			}

			// If the warrior found a target then blink back to them
			let warrior = get('WarriorS')

			if (null != warrior.target) {
				game_log("Warrior has a target - blinking to them!")
				hunting = false
				BlinkToPlayer('WarriorS')
				return
			}

			if (character.mp > 3400) {
				game_log("blinking to next hunt spot " + wp.x + " " + wp.y)
				blinkToSpot(wp.x, wp.y, character.map)
			}
			else {
				game_log("waiting for next blink " + wp.x + " " + wp.y)
			}

			await sleep(500)
		}

		game_log("Moving to another hunt way point")
	}

	// If we found a boss then target it
	for (id of bossIds) {
		let nearBoss = get_nearest_monster_with_type(id)

		if (nearBoss != null) {
			game_log("\\\ found a boss quitting hunt ///")
			game_log("\\\ found a boss quitting hunt ///")
			game_log("\\\ found a boss quitting hunt ///")
			change_target(nearBoss)
			hunting = false
			return
		}
	}

	game_log("the hunt is completed!!!!")
	game_log("the hunt is completed!!!!")
	game_log("the hunt is completed!!!!")
	game_log("the hunt is completed!!!!")

	ChangeScript("MageS", "ResetCrypt")
	hunting = false
}

function logCryptEntityLocations() {
	for (id in parent.entities) {
		var entity = parent.entities[id];
		if (bossIds.includes(entity.mtype)) {
			if (bossData.filter(e => e.mtype == entity.mtype).length == 0) {
				bossData.push(entity)
			}

			bossData.filter(e => e.mtype == entity.mtype)[0] = entity
		}
	}
}

setInterval(function () {
	logCryptEntityLocations()
}, 500)


function OpenCrypt() {
	// Reset the boss tracking data
	bossData = []

	parent.socket.emit('enter', { place: 'crypt', name: "goosebumps" })
}



function withdrawItem(itemName, maxWithdrdaw = 27) {
	for (const pack in character.bank) {
		for (const i in character.bank[pack]) {
			const item = character.bank[pack][i];

			if (null == item) continue;

			if (item.name != itemName) continue;

			game_log("withdrawing " + i)
			parent.socket.emit("bank", { operation: "swap", pack: pack, str: i, inv: -1 });
			maxWithdrdaw--;

			if (maxWithdrdaw < 0) return
		}
	}
}

function GrabCryptKeys() {
	game_log("GrabCryptKeys")
	// withdraw crypt keys from the bank
	if (locate_item('cryptkey') == -1) {
		game_log("we grabbing the keys")
		withdrawItem('cryptkey', 1)
	}
}

let sets = [
	{
		name: 'WarriorDPS',
		items: [
			{ slot: 'helmet', name: 'fury', level: 3 },
			{ slot: 'mainhand', name: 'fireblade', level: 9 },
			{ slot: 'offhand', name: 'fireblade', level: 9 },
			{ slot: 'ring1', name: 'ctristone', level: 4 },
			{ slot: 'ring2', name: 'ctristone', level: 4 },
			{ slot: 'orb', name: 'jacko', level: 4 },
			{ slot: 'shoes', name: 'wingedboots', level: 9 },
			{ slot: 'chest', name: 'xarmor', level: 8 },
			{ slot: 'pants', name: 'hpants', level: 8 },
			{ slot: 'gloves', name: 'hgloves', level: 8 },
			{ slot: 'belt', name: 'strbelt', level: 1 },
			{ slot: 'cape', name: 'bcape', level: 5 },
		]
	},
	{
		name: 'WarriorTank',
		items: [
			{ slot: 'helmet', name: 'helmet1', level: 9 },
			{ slot: 'mainhand', name: 'vhammer', level: 8 },
			{ slot: 'offhand', name: 'lantern', level: 3 },
			{ slot: 'ring1', name: 'ctristone', level: 4 },
			{ slot: 'ring2', name: 'ctristone', level: 4 },
			{ slot: 'orb', name: 'jacko', level: 4 },
			{ slot: 'shoes', name: 'vboots', level: 8 },
			{ slot: 'chest', name: 'vattire', level: 7 },
			{ slot: 'pants', name: 'hpants', level: 8 },
			{ slot: 'gloves', name: 'hgloves', level: 8 },
			{ slot: 'belt', name: 'mbelt', level: 2 },
			{ slot: 'cape', name: 'bcape', level: 5 },
		]
	},
	{
		name: 'WarriorKite',
		items: [
			{ slot: 'helmet', name: 'helmet1', level: 8 },
			{ slot: 'mainhand', name: 'fireblade', level: 9 },
			{ slot: 'offhand', name: null },
			{ slot: 'belt', name: 'mbelt', level: 2 },
			{ slot: 'shoes', name: 'wingedboots', level: 9 },
			{ slot: 'cape', name: 'angelwings', level: 6 },
		]
	},
	{
		name: 'Luck',
		items: [
			{ slot: 'ring1', name: 'ringofluck', level: 0 },
			{ slot: 'ring2', name: 'ringofluck', level: 0 },
			{ slot: 'orb', name: 'rabbitsfoot', level: 0 },
			{ slot: 'shoes', name: 'wshoes', level: 10 },
			{ slot: 'chest', name: 'wattire', level: 10 },
			{ slot: 'pants', name: 'wbreeches', level: 10 },
			{ slot: 'helmet', name: 'wcap', level: 9 },
			{ slot: 'gloves', name: 'wgloves', level: 10 },
			{ slot: 'offhand', name: 'mshield', level: 7 },
		]
	},
	{
		name: 'PriestLuck',
		items: [
			{ slot: 'ring1', name: 'ringofluck', level: 0 },
			{ slot: 'ring2', name: 'ringofluck', level: 0 },
			{ slot: 'orb', name: 'rabbitsfoot', level: 0 },
			{ slot: 'shoes', name: 'wshoes', level: 10 },
			{ slot: 'chest', name: 'wattire', level: 10 },
			{ slot: 'pants', name: 'wbreeches', level: 10 },
			{ slot: 'helmet', name: 'wcap', level: 9 },
			{ slot: 'gloves', name: 'wgloves', level: 10 },
			{ slot: 'offhand', name: 'mshield', level: 7 },
			{ slot: 'mainhand', name: 'lmace', level: 7 },
		]
	},
	{
		name: 'MageBlaster',
		items: [
			{ slot: 'offhand', name: null },
			{ slot: 'mainhand', name: 'gstaff', level: 8 },
			{ slot: 'orb', name: 'test_orb', level: 0 },
		]
	},
	{
		name: 'MageFirestaff',
		items: [
			{ slot: 'mainhand', name: 'firestaff', level: 10 },
			{ slot: 'offhand', name: 'wbook0', level: 5 },
			{ slot: 'orb', name: 'jacko', level: 4 },
		]
	},
	{
		name: 'PriestCombat',
		items: [
			{ slot: 'mainhand', name: 'oozingterror', level: 9 },
			{ slot: 'offhand', name: 'wbook0', level: 5 },
			{ slot: 'orb', name: 'jacko', level: 4 },

			
			{ slot: 'ring1', name: 'cring', level: 5 },
			{ slot: 'ring2', name: 'cring', level: 4 },
			{ slot: 'shoes', name: 'wingedboots', level: 9 },
			{ slot: 'chest', name: 'coat', level: 10 },
			{ slot: 'pants', name: 'starkillers', level: 5 },
			{ slot: 'helmet', name: 'gphelmet', level: 9 },
			{ slot: 'gloves', name: 'mittens', level: 9 },
		]
	},
	{
		name: 'jacko',
		items: [{ slot: 'orb', name: 'jacko', level: 4 }]
	},
	{
		name: 'testorb',
		items: [{ slot: 'orb', name: 'test_orb', level: 0 }]
	}
]

function EquipSet(setName) {
	//game_log("equip set " + setName)
	for (eSet of sets) {
		if (eSet.name == setName) {
			for (item of eSet.items) {
				if (character.slots[item.slot]?.name == item.name) continue

				if (null == item.name || !item.name) {
					//game_log("unequipping " + item.slot)
					unequip(item.slot)
					continue
				}

				GroupEquip(item.name, item.slot, item.level)
			}
		}
	}
}

function KeepAggro() {
	if (is_on_cooldown_override('taunt')) return

	// If anyone in the party is targetted by a nearby monster then taunt it off of them
	let partyEntities = []
	for (c of parent.party_list) {
		let player = get_player(c)

		if (c == character.name) continue

		if (null == player) continue

		partyEntities.push(player)
	}

	for (id in parent.entities) {
		var current = parent.entities[id]

		if (null == current) continue

		if (partyEntities.includes(current.target)) {
			use_skill('taunt', current)
			return
		}
	}
}

function DontStack() {
	// Try not to stand on top of my party members
	let partyEntities = []
	for (c of parent.party_list) {
		let player = get_player(c)

		if (c == character.name) continue

		if (null == player) continue

		partyEntities.push(player)
	}

	for (player of partyEntities) {
		let dist = simple_distance(character, player)
		//game_log(dist + "dist from " + character.name)
		if (dist < 9) {
			//game_log("too close to " + character.name)

			// move away
			let dx = player.x - character.x
			let dy = player.y - character.y

			let dist = simple_distance(player, character)

			dx /= dist
			dy /= dist

			dx *= 10
			dy *= 10

			Mover.setGoal({x:character.x - dx, y:character.y - dx})
			//move(character.x - dx, character.y - dx)
		}
	}
}

function ReEnterCrypt() {
	if (null != lastCryptId) {
		parent.socket.emit('enter', { place: 'crypt', name: lastCryptId });
	}
}

function IsInCryptKiteBox()
{
	// 885 -663
	// 1160 -319

	return character.x > 885 && character.x < 1160 && character.y > -663 && character.y < -320
}

function GetIntoCryptKiteBox()
{
	// 895 -622
	// 1150 -450

	let dist1 = simple_distance(character, {x:895, y:-622})
	let dist2 = simple_distance(character, {x:1150, y:-450})

	if(dist1 < dist2)
	{
		getPathToPoint(895, -622, character.map, Mover.move_by_path)
	}
	else
	{
		getPathToPoint(1150, -450, character.map, Mover.move_by_path)
	}
}

function EvadeInKiteBox()
{
	stayAwayFromTarget(get_target(), {left:895, right:1150, bottom:-622, top:-450})
}


let lastCryptId = null
setInterval(function () {
	if (character.map == 'crypt') {
		lastCryptId = character.in
	}
}, 500)

let hasMagiportFrom = null
function on_magiport(name) {
	hasMagiportFrom = name
}

let hasPartyInviteFrom = null
function on_party_invite(name) {
	hasPartyInviteFrom = name
	game_log("PARTY INVITE FROM " + hasPartyInviteFrom)
}

setTimeout(function () {
	setInterval(function () {
		let target = get_entity(character.target)
		if (!target) target = null
		set(character.name, { name: character.name, x: character.x, y: character.y, map: character.map, in: character.in, target: target?.id, items: character.items })
	}, 500)
}, 2000)

// Crypt boss tank spot
// {
// 	"x": 2456.9570949129843,
// 	"y": 281.5479814637275
// }

// condition registers
let conditionFuncRegistry = new TaskConditionFuncRegistration()
conditionFuncRegistry.registerCondtionFunc("Default", (args) => true)
conditionFuncRegistry.registerCondtionFunc("HasTarget", (args) => 
{
	let target = get_target()

	if(null == target) return false

	if(target.hp == 0) return false

	if(target.ip) return false

	if(target.dead) return false

	return true
})
conditionFuncRegistry.registerCondtionFunc("PlayerHasTarget", (args) => null != get_target())
conditionFuncRegistry.registerCondtionFunc("TargetIsType", (args) => {
	let target = get_target()

	if (null == target) return false

	return target.mtype == args.Type
})
conditionFuncRegistry.registerCondtionFunc("TargetIsDead", (args) => {
	let target = get_target()

	if (null == target) return false

	return target.rip == true;
})
conditionFuncRegistry.registerCondtionFunc("IsOnServer", (args) => args.Region == parent.server_region && args.Identifier == parent.server_identifier)
conditionFuncRegistry.registerCondtionFunc("IsNearLocation", (args) => {
	let distNear = args.Distance ?? 800

	//game_log("is near " + args.X + ", " + args.Y + " in " + args.Area + " " + distNear)
	//game_log(simple_distance(character, {x:args.X, y:args.Y}))

	let isNear = simple_distance(character, { x: args.X, y: args.Y }) < distNear && args.Area == character.map

	//game_log(isNear)
	return isNear
})
conditionFuncRegistry.registerCondtionFunc("NearbyEnemy", (args) => {
	let nearEnemy = get_nearest_monster_with_type(args.Type)

	if (null == nearEnemy) return

	return simple_distance(nearEnemy, character) < 250
})
conditionFuncRegistry.registerCondtionFunc("EnemyTooClose", (args) => null != get_target() && simple_distance(character, get_target()) < 150)
conditionFuncRegistry.registerCondtionFunc("PartyMemberFarFromGroup", PartyMemberFarFromGroup)
conditionFuncRegistry.registerCondtionFunc("PartyMemberHasLowMana", PartyMemberHasLowMana)
conditionFuncRegistry.registerCondtionFunc("TargetNearDeath", TargetNearDeath)
conditionFuncRegistry.registerCondtionFunc("HasMagiportInvite", (args) => args.From == hasMagiportFrom)
conditionFuncRegistry.registerCondtionFunc("TargetHasTarget", (args) => null != get_target() && null != get_entity(get_target().target))
conditionFuncRegistry.registerCondtionFunc("HasPartyInvite", (args) => args.From == hasPartyInviteFrom)
conditionFuncRegistry.registerCondtionFunc("AllPartyMemberTakenDamage", AllPartyMemberTakenDamage)
conditionFuncRegistry.registerCondtionFunc("PartyMemberTakenHit", PartyMemberTakenHit)
conditionFuncRegistry.registerCondtionFunc("LootAvailable", LootAvailable)
conditionFuncRegistry.registerCondtionFunc("InventoryNearFull", (args) => character.esize < 10)
conditionFuncRegistry.registerCondtionFunc("IsInArea", (args) => args.Area == character.map)
conditionFuncRegistry.registerCondtionFunc("PlayerIsInArea", (args) => PlayerIsInArea(args.Player, args.Area))
conditionFuncRegistry.registerCondtionFunc("PlayerHasMissingMp", (args) => character.mp / character.max_mp < args.Ratio)
conditionFuncRegistry.registerCondtionFunc("PlayerHasMissingHp", (args) => character.hp / character.max_hp < args.Ratio)
conditionFuncRegistry.registerCondtionFunc("PartyMemberHasMissingHp", (args) => {
	let player = get_player(args.Player)
	if (null == player) return false

	return player.mp / player.max_mp < args.Ratio
})
conditionFuncRegistry.registerCondtionFunc("TargetTargettingMe", (args) => null != get_target() && get_target().target == character.name)
conditionFuncRegistry.registerCondtionFunc("CharacterIsDead", (args) => character.rip)
conditionFuncRegistry.registerCondtionFunc("PlayerInParty", (args) => parent.party_list.includes(args.Name))
conditionFuncRegistry.registerCondtionFunc("HasElixir", (args) => null != character.slots.elixir)
conditionFuncRegistry.registerCondtionFunc("HasQuantityOfItems", (args) => {
	let hasItems = HasQuantityOfItems(args)

	// game_log(args.ItemName)
	// game_log(args.ItemQuantity)
	// game_log(hasItems)

	return hasItems;
})
conditionFuncRegistry.registerCondtionFunc("HasEnoughMana", (args) => args.Mana < character.mp)
conditionFuncRegistry.registerCondtionFunc("HasItemInInventory", (args) => {
	let idx = locate_item(args.ItemName)

	if (-1 == idx) return false

	if (character.items[idx].level > 0) return false

	return true
})
conditionFuncRegistry.registerCondtionFunc("HasGold", (args) => character.gold > args.Gold)
conditionFuncRegistry.registerCondtionFunc("IsMoving", (args) => is_moving(character))
conditionFuncRegistry.registerCondtionFunc("PlayerHasHP", PlayerHasHP)
conditionFuncRegistry.registerCondtionFunc("AllCryptBossesAreDead", (args) => {
	if (bossData.length != bossIds.length) {
		return false
	}

	for (data of bossData) {
		if (data.hp > 0) return false
	}

	game_log("ALL THE BOSSES ARE DEAD!!!!!")
	game_log("ALL THE BOSSES ARE DEAD!!!!!")
	game_log("ALL THE BOSSES ARE DEAD!!!!!")
	game_log("ALL THE BOSSES ARE DEAD!!!!!")

	return true
})
conditionFuncRegistry.registerCondtionFunc("IsInCryptKiteBox", (args) => IsInCryptKiteBox())

// task func registers
let taskFuncRegister = new TaskFuncRegistration()
taskFuncRegister.registerTaskFunc("ChangeServer", (args) => ChangeServer(args.Region, args.Identifier))
taskFuncRegister.registerTaskFunc("BlinkToLocation", (args) => {
	if (blinkPause) return
	blinkToSpot(args.X, args.Y, args.Area)
})
taskFuncRegister.registerTaskFunc("BlinkToPlayer", (args) => BlinkToPlayer(args.Player))
taskFuncRegister.registerTaskFunc("GoToLocation", (args) => {
	// game_log("GO TO LOCATION " + args.X + ", " + args.Y + " " + args.Area)
	GoToSpot(args.X, args.Y, args.Area)
})
taskFuncRegister.registerTaskFunc("MoveToLocation", (args) => {
	// game_log("GO TO LOCATION " + args.X + ", " + args.Y + " " + args.Area)
	//move(args.X, args.Y)
	Mover.setGoam({x:args.X, y:args.Y})
})
taskFuncRegister.registerTaskFunc("EvadeTarget", (args) => stayAwayFromTarget())
taskFuncRegister.registerTaskFunc("EvadeEnemy", (args) => {
	let evadeTarget = get_nearest_monster_with_type(args.MonsterType)

	if (null == evadeTarget) {
		//game_log("unable to find enemy to evade of type " + args.MonsterType)
		return
	}

	//game_log("evading enemy of type " + args.MonsterType + " " + evadeTarget.name + "!")
	stayAwayFromTarget(evadeTarget)
})
taskFuncRegister.registerTaskFunc("StayNearEnemy", (args) => {
	let nearTarget = get_nearest_monster_with_type(args.Type)

	if (null == nearTarget) {
		return
	}

	let dist = simple_distance(character, nearTarget)
	//game_log(dist + " from Orlok " + args.MonsterType)
	if (dist > 200) {
		// Move towards the target
		let dx = nearTarget.x / dist;
		let dy = nearTarget.y / dist;

		let moveX = character.x + dx * 2
		let moveY = character.y + dy * 2
		//game_log(" move toward " + moveX + " " + moveY)

		Mover.setGoal({x:moveX, y:character.y + moveY})
		//move(moveX, character.y + moveY)
	}
})
taskFuncRegister.registerTaskFunc("StayNearTarget", (args) => StayNearTarget())
taskFuncRegister.registerTaskFunc("StayNearPlayer", (args) => StayNearPlayer(args.Player))
taskFuncRegister.registerTaskFunc("StayNearTargetMelee", (args) => StayNearTargetMelee())
taskFuncRegister.registerTaskFunc("AcceptMagiport", (args) => { accept_magiport(args.From); hasMagiportFrom = null; stop(); Mover.requestStop = true })
taskFuncRegister.registerTaskFunc("FindNewTarget", (args) => FindNewTarget(args.MonsterType))
taskFuncRegister.registerTaskFunc("FindNewSafeTarget", (args) => FindNewSafeTarget(args.MonsterType))
taskFuncRegister.registerTaskFunc("UseSkill", UseSkill)
taskFuncRegister.registerTaskFunc("AttackTarget", AttackTarget)
taskFuncRegister.registerTaskFunc("Loot", (args) => LootLogicAdvanced())
taskFuncRegister.registerTaskFunc("LootBasic", (args) => LootLogicBasic())
taskFuncRegister.registerTaskFunc("PartySync", (args) => game_log("PartySync"))
taskFuncRegister.registerTaskFunc("DepositLoot", (args) => DepositItems())
taskFuncRegister.registerTaskFunc("UseHPot", (args) => { if (is_on_cooldown_override('use_hp')) return; use('use_hp') })
taskFuncRegister.registerTaskFunc("UseMPot", (args) => { if (is_on_cooldown_override('use_mp')) return; use('use_mp') })
taskFuncRegister.registerTaskFunc("Heal", (args) => TryHealPlayer(args.Target))
taskFuncRegister.registerTaskFunc("AbsorbTarget", (args) => AbsorbTarget())
taskFuncRegister.registerTaskFunc("Respawn", (args) => { if (character.rip) { respawn(); } })
taskFuncRegister.registerTaskFunc("InviteToParty", (args) => send_party_invite(args.Name))
taskFuncRegister.registerTaskFunc("RequestJoinParty", (args) => send_party_request(args.Name))
taskFuncRegister.registerTaskFunc("AcceptPartyInvite", (args) => { accept_party_invite(args.From); hasPartyInviteFrom = null })
taskFuncRegister.registerTaskFunc("EquipLuckGear", (args) => EquipLuckGear(args))
taskFuncRegister.registerTaskFunc("EquipCombatGear", (args) => EquipCombatGear(args))
taskFuncRegister.registerTaskFunc("EquipGoldGear", (args) => EquipGoldGear(args))
taskFuncRegister.registerTaskFunc("ShiftBooster", (args) => ShiftBooster(args))
taskFuncRegister.registerTaskFunc("EquipItem", (args) => EquipByName(args.Name))
taskFuncRegister.registerTaskFunc("BuyItem", (args) => { game_log("BUYING " + args.Name + " @ " + args.Quantity); buy(args.Name, args.Quantity) })
taskFuncRegister.registerTaskFunc("SendItem", (args) => SendItem(args))
taskFuncRegister.registerTaskFunc("SendGold", (args) => send_gold(args.To, args.Gold))
taskFuncRegister.registerTaskFunc("Stomp", (args) => stompLoop())
taskFuncRegister.registerTaskFunc("GoToNextServerWithBoss", (args) => GoToNextServerWithBoss(args.Boss))
taskFuncRegister.registerTaskFunc("Energize", Energize)
taskFuncRegister.registerTaskFunc("CBurst", CBurst)
taskFuncRegister.registerTaskFunc("EnterCrypt", (args) => EnterCrypt(args.CryptOwner))
taskFuncRegister.registerTaskFunc("CryptTarget", (args) => CryptTarget())
taskFuncRegister.registerTaskFunc("TargetPlayerTarget", (args) => TargetPlayerTarget(args.Player))
taskFuncRegister.registerTaskFunc("TargetCryptAdds", (args) => TargetCryptAdds())
taskFuncRegister.registerTaskFunc("ScareAndTargetZapper", (args) => ScareAndTargetZapper())
taskFuncRegister.registerTaskFunc("ScareAndTargetBat", (args) => ScareAndTargetBat())
taskFuncRegister.registerTaskFunc("BlinkDanceMarceline", (args) => BlinkDanceMarceline())
taskFuncRegister.registerTaskFunc("ChangeScript", (args) => ChangeScript(args.Character, args.Script))
taskFuncRegister.registerTaskFunc("HuntCryptBoss", (args) => HuntCryptBoss())
taskFuncRegister.registerTaskFunc("ScareAdds", (args) => ScareAdds())
taskFuncRegister.registerTaskFunc("BankLoop", (args) => blinkToBankBtn())
taskFuncRegister.registerTaskFunc("OpenCrypt", (args) => OpenCrypt())
taskFuncRegister.registerTaskFunc("GrabCryptKeys", (args) => GrabCryptKeys())
taskFuncRegister.registerTaskFunc("EquipSet", (args) => EquipSet(args.Set))
taskFuncRegister.registerTaskFunc("KeepAggro", (args) => KeepAggro())
taskFuncRegister.registerTaskFunc("DontStack", (args) => DontStack())
taskFuncRegister.registerTaskFunc("CurseEnemy", (args) => {
	let nearTarget = get_nearest_monster_with_type(args.Type)

	if (null == nearTarget) {
		return
	}

	if (is_on_cooldown_override('curse')) return

	use_skill('curse', nearTarget)
})
taskFuncRegister.registerTaskFunc("TryFarmBosses", (args) => TryFarmBosses())

function ChangeScript(characterName, scriptName) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			CancelTasks()
			game_log("loading the new strategy!!!")
			game_log("loading the new strategy!!!")
			game_log("loading the new strategy!!!")
			game_log("loading the new strategy!!!")
			GetStrategies(s => { StartStrategy(s) });
		}
	}

	xmlHttp.open("POST", `https://localhost:44368/api/CharacterConfig?characterName=${characterName}&script=${scriptName}`, true); // true for asynchronous

	xmlHttp.send(null);
}
taskFuncRegister.registerTaskFunc("ReEnterCrypt", (args) => ReEnterCrypt())
taskFuncRegister.registerTaskFunc("GetIntoCryptKiteBox", (args) => GetIntoCryptKiteBox())
taskFuncRegister.registerTaskFunc("EvadeInKiteBox", (args) => EvadeInKiteBox())
taskFuncRegister.registerTaskFunc("CBurstMany", (args) => CBurstMany(args))




// Cancel a plan
function CancelTasks() {
	for (var interval of taskIntervals) {
		clearInterval(interval)
	}

	taskIntervals = []
}

// Do the plan
let taskIntervals = []
function StartStrategy(strategy) {
	// For each task set an interval for the given frequency to do the task if the condition is met
	for (var periodicSet of strategy.PeriodicConditionalTaskSets) {
		// Find the registered conditional for these task condition type(s)
		// Find the registered task(s) for these task type(s)
		// Create an interval to check the first task whose condition is met and run that task

		let orderedConditionalTasks = []
		let taskDesc = periodicSet.Frequency
		for (var task of periodicSet.TaskSet.OrderedTasks) {
			let conditionFuncsAndStates = []
			let conditionFuncsDescs = ""
			for (var conditionRequirment of task.Condition.ConditionRequirements) {
				conditionFuncsDescs += conditionRequirment.Condition + "_"
				let conditionFunc = conditionFuncRegistry.getRegisteredConditionFunc(conditionRequirment.Condition)
				conditionFuncsAndStates.push({
					conditionFunc: conditionFunc,
					requiredState: conditionRequirment.State,
					conditionArgs: conditionRequirment.ConditionArguments?.Arguments
				})
			}
			game_log("new task " + task.Task.TaskType + " if " + conditionFuncsDescs + " @ freq " + periodicSet.Frequency)
			taskDesc += "_" + conditionFuncsDescs + " => " + task.Task.TaskType + " "

			let taskFunc = taskFuncRegister.getRegisteredTaskFunc(task.Task.TaskType)

			orderedConditionalTasks.push({
				conditionFuncsAndStates: conditionFuncsAndStates,
				conditionResult: task.Condition.RequiredState,
				taskFunc: taskFunc,
				taskArgs: task.Task.TaskArguments?.Arguments,
			})
		}

		let taskSetHandler = new CondtionalTaskSetHandler(orderedConditionalTasks, taskDesc)
		let taskInterval = setInterval(function () {
			taskSetHandler.Process()
		}, periodicSet.Frequency)

		taskIntervals.push(taskInterval)
	}
}



// Talk to the server to get the plan
function GetStrategies(callback, strategyName = null) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(JSON.parse(xmlHttp.responseText));
	}

	if (null == strategyName) {
		xmlHttp.open("GET", "https://localhost:44368/api/Strategy?characterName=" + character.name, true); // true for asynchronous
	}
	else {
		xmlHttp.open("GET", "https://localhost:44368/api/Strategy?strategyName=" + strategyName, true); // true for asynchronous
	}

	xmlHttp.send(null);
}

GetStrategies(s => { StartStrategy(s) });

function GetActiveScript(callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(JSON.parse(xmlHttp.responseText));
	}

	xmlHttp.open("GET", "https://localhost:44368/api/CharacterConfig/" + character.name, true); // true for asynchronous    
	xmlHttp.send(null);
}

let currentScript = null
setInterval(function () {
	GetActiveScript(s => {
		if (currentScript != s.ActiveScript) {
			game_log("new script detected " + s.ActiveScript + " changing scripts")
			currentScript = s.ActiveScript
			ChangeScript(character.name, s.ActiveScript)
		}
	});

}, 5000)

// // Check
// //  If franky is engaged somewhere then switch to franky script
// //  If icegolem is engaged somewhere then switch to icegolem script
// //  Default to b scorpion farm

// setInterval(function(){

function TryFarmBosses() {
	game_log("TRY FARM BOSSES")
	for (id in serverStatuses) {
		let status = serverStatuses[id]
		if (status.eventname == "franky") {
			if (status.live) {
				// Change servers if we need to
				if (parent.server_region != status.server_region || parent.server_identifier != status.server_identifier) {
					if (status.server_identifier != "PVP") {
						// Switch into franky mode
						ChangeScript("MageS", "FarmFranky_Mage")
						ChangeScript("WarriorS", "FarmFranky_Warrior")
						ChangeScript("PriestS", "FarmFranky_Priest")
						return;
					}
				}
			}
		}
	}
	game_log("   NO FRANKY UP")

	for (id in serverStatuses) {
		let status = serverStatuses[id]
		if (status.eventname == "icegolem") {
			if (status.live) {
				// Change servers if we need to
				if (parent.server_region != status.server_region || parent.server_identifier != status.server_identifier) {
					if (status.server_identifier != "PVP") {
						// Switch into icegolem mode
						ChangeScript("MageS", "FarmIceGolem_Mage")
						ChangeScript("WarriorS", "FarmIceGolem_Warrior")
						ChangeScript("PriestS", "FarmIceGolem_Priest")
						return;
					}
				}
			}
		}
	}
	game_log("   NO ICEGOLEM UP")
}

// }, 1000)













// Get updated info about what bosses are on what servers
let serverStatuses = []
setInterval(function () {
	GetServerStatuses(s => {
		serverStatuses = s;
	})
}, 1000 * 5);

GetServerStatuses(s => {
	serverStatuses = s;
});














function blinkToBank() {
	if (!(character.in == "bank" && Math.getDistance(character.x, character.y, -3, -267) < 100)) {
		game_log("blinking to bank");
		change_target(null);
		stop();
		blinkToSpot(-3, -267, "bank");
	}
}

let blinkPause = false
async function blinkToBankBtn() {
	game_log("blink to bank btn!")
	if (blinkPause) {
		game_log("blink is paused")
	}

	blinkPause = true
	setTimeout(function () {
		blinkPause = false
	}, 20 * 1000)

	if (character.map != "bank") {
		if (character.mp > 1600) {
			blinkToBank()
		}
		setTimeout(blinkToBankBtn, 300)
	}

	if (character.map == "bank") {
		setTimeout(function () {
			blinkPause = false
		}, 5 * 1000)
	}
}

async function cryptHuntBtn() {
	ChangeScript("MageS", "CryptHunt")
}

if (character.name == "MageS") {
	add_bottom_button("blinkBank", "Bank", function () { blinkToBankBtn() })
	add_bottom_button("cryptHunt", "Hunt", function () { cryptHuntBtn() })
	add_bottom_button("portWarrior", "Warrior", function () { use_skill('magiport', 'WarriorS') })
	add_bottom_button("portPriest", "Priest", function () { use_skill('magiport', 'PriestS') })
}

// junk to sell
let junk = ["slimestaff", "crabclaw", "hpamulet", "ringsj", "stinger", "hpbelt"]
setInterval(function() {
	for(let idx in character.items)
	{
		let item = character.items[idx]

		if(null == item) continue

		if(!junk.includes(item.name)) continue

		if(character.name != 'MageS')
		{
			send_item('MageS', idx)
		}
		else
		{

			game_log("SELLING JUNK @ " + idx)
			sell(idx)
		}
	}
}, 3000)


setInterval(function () {
	if (character.name != "MageS") return
	for (var i = 0; i < character.items.length; i++) {
		if (character.items[i] &&
			character.items[i].name == "wbook0" &&
			character.items[i].level == 0) {
			//game_log("sell " + i)
			sell(i)
		}
	}
})







for (const server of parent.X.servers) {
	const socket = parent.io(`ws://${server.addr}:${server.port}`, { transports: ["websocket"], reconnection: true, autoConnect: true })
	socket.on("server_info", (data) => {
		// Creates a listener for `server_data` (this is what feeds info in to parent.S)
		let statuses = []
		if (data && Object.keys(data).length > 0) {
			// There is some sort of data (i.e. not an empty object)

			statuses = Object.keys(data).filter(k => is_object(data[k])).map(e => {
				data[e].eventname = e
				data[e].server_region = server.region
				data[e].server_identifier = server.name
				return data[e]
			})

			//console.log(statuses);


		}

		if (data && !data["franky"]) {
			statuses.push({ x: 0, y: 0, live: false, eventname: "franky", server_region: server.region, server_identifier: server.name })
		}

		if (data && !data["icegolem"]) {
			statuses.push({ x: 0, y: 0, live: false, eventname: "icegolem", server_region: server.region, server_identifier: server.name })
		}

		// Update or add statuses to our list of statuses
		for (statusEntry of statuses) {
			let found = false
			for (id in serverStatuses) {
				let serverStatus = serverStatuses[id]
				if (serverStatus.eventname == statusEntry.eventname &&
					serverStatus.server_region == statusEntry.server_region &&
					serverStatus.server_identifier == statusEntry.server_identifier) {
					serverStatuses[id] = statusEntry
					//game_log("UPDATING DATA " + statusEntry.eventname + statusEntry.server_region + statusEntry.server_identifier + serverStatuses[id].live + statusEntry.live)
					found = true
					break
				}
			}

			if (!found) {
				//game_log(statusEntry.eventname + statusEntry.server_region + statusEntry.server_identifier)
				serverStatuses.push(statusEntry)
			}
			else
			{
				//game_log(statusEntry.eventname + statusEntry.server_region + statusEntry.server_identifier)
			}
		}

		let xhr = new XMLHttpRequest();
		xhr.open("POST", "https://aldata.info/api/serverstatuses", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(statuses));
	})
}