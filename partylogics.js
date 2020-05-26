var attack_mode=true;

function startMageLogic()
{
	setInterval(function(){
		if(!attack_mode || character.rip || is_moving(character)) return;
		
		potionLogic();
		loot();
	
		var target=get_targeted_monster();
		if(!target)
		{
			set_message("No Monsters");
			return;
		}
		
		if(character.mp>300)
		{
			if(try_use_skill(target, "burst"))
			{
				return;
			}
		}

		
		if(try_use_skill(get_player("WarriorS"), "energize"))
		{
			return;
		}

		attackLogic(target);
	
	},1000/4); // Loops every 1/4 seconds.
}

function startWarriorLogic()
{
	setInterval(function(){
		if(!attack_mode || character.rip || is_moving(character)) return;
	
		potionLogic();
		loot();
	
		var target=get_targeted_monster();
		if(!target)
		{
			priorityTarget=get_nearest_monster_with_name("Dracul");
			if(!priorityTarget)
			{
				priorityTarget=get_nearest_monster_with_name("Phoenix");
			}
			
			target = priorityTarget;

			if(!target)
			{
				target=get_nearest_monster({min_xp:2000,max_att:500});
			}
			
			
			// Don't stray tooo far
			var dist = parent.distance(character, target);
			if(dist > 450)
			{
				return;
			}

			if(target) change_target(target);
			else
			{
				set_message("No Monsters");
				return;
			}
		}
		
		send_cm("MageS",{type:"Target",id:target.id})
		send_cm("PriestS",{type:"Target",id:target.id})
	
		if(try_use_skill(character, "charge"))
		{
			return;
		}

		if(try_use_skill(target, "taunt"))
		{
			return;
		}
		
		attackLogic(target);
	
	},1000/4); // Loops every 1/4 seconds.
}

function startPriestLogic()
{
	setInterval(function(){
		if(!attack_mode || character.rip || is_moving(character)) return;

		potionLogic();
		loot();
		
		// Heal the party
		try_heal_player("WarriorS");
		try_heal_player("PriestS");
		try_heal_player("MageS");
		try_heal_player("MoneyS");

		var target=get_targeted_monster();
		if(!target)
		{
			set_message("No Monsters");
			return;
		}

		if(try_use_skill(target, "curse"))
		{
			return;
		}
		
		attackLogic(target);

	},1000/4); // Loops every 1/4 seconds.

	function try_heal_player(player)
	{
		var playerTarget=get_player(player);
		if(can_heal(playerTarget))
		{
			if((playerTarget.max_hp - playerTarget.hp) > 100)
			{
				set_message("Heal: " + player);
				heal(playerTarget);
			}
		}
	}
}

function potionLogic()
{
	if(character.max_mp - character.mp > 500)
	{
		tryUseMPPot();
	}

	if(character.max_hp - character.hp > 500)
	{
		tryUseHPPot();
	}
}

var safeties=true; // Prevents common delay based issues that cause many requests to be sent to the server in a burst that triggers the server to disconnect the character
var last_potion=new Date(0);

function tryUseMPPot()
{
	if(safeties && mssince(last_potion)<min(200,character.ping*3)) return;

	if(new Date()<parent.next_skill.use_hp) return;

	use('use_mp');

	last_potion=new Date();
}

function tryUseHPPot()
{
	if(safeties && mssince(last_potion)<min(200,character.ping*3)) return;

	if(new Date()<parent.next_skill.use_hp) return;

	use('use_hp');

	last_potion=new Date();
}

function attackLogic(target)
{
	if(!is_in_range(target))
	{
		smart_move({
			map:character.map,
			x:character.x+2*(target.x-character.x)/3,
			y:character.y+2*(target.y-character.y)/3
		});
		// Walk 2/3 the distance
	}
	else if(can_attack(target))
	{
		set_message("Attacking");
		attack(target);
	}
}
	
function try_use_skill(target, skillname)
{
	var inRange = is_in_range(target,skillname);
	var onCD = is_on_cooldown(skillname);
	var hasMP = !G.skills[skillname].mp || character.mp>=G.skills[skillname].mp;
	
	if(inRange && !onCD && hasMP)
	{
		set_message("Skill: " + skillname)
		use_skill(skillname,target);
		
		return true;
	}
	
	return false;
}

function get_nearest_monster_with_name(name)
{
	var min_d=999999,target=null;

	for(id in parent.entities)
	{
		var current=parent.entities[id];
		if(name != current.name) continue;

		var c_dist=parent.distance(character,current);
		if(c_dist<min_d) min_d=c_dist,target=current;
	}
	return target;
}

function startDraculPatrol()
{
	var patrolPoints = [ { x: 97, y: -1180 } /*{x: -108, y: -1200}*/]
	var patrolIdx = 0;

	setInterval(function(){
		smart_move(
			{
				map:character.map,
				x:patrolPoints[patrolIdx].x,
				y:patrolPoints[patrolIdx].y
			});

			++patrolIdx;
			patrolIdx = patrolIdx % patrolPoints.length;

	}, 60 * 1000 /* every 60 seconds patrol */)	
}

function inviteTheBoys()
{
	send_party_invite("MageS");
	send_party_invite("PriestS");
	send_party_invite("MoneyS");
}