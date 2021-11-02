let partyThrower = "MoneyS"

// Circle the party thrower
// Thanks @Matin
function circleCoords(x=0, y=0, radius=100){
    let targetPos = {x:x,y:y}
    let theta = Math.atan2(character.y - targetPos.y, character.x - targetPos.x) + (180/Math.PI)
    targetPos.x += Math.cos(theta) * radius
    targetPos.y += Math.sin(theta) * radius

    move(targetPos.x, targetPos.y)
}

function circlePartyThrower(){
	let partyThrowerPlayer = get_player(partyThrower)

	if(null == partyThrowerPlayer){
		return
	}

	circleCoords(partyThrowerPlayer.x, partyThrowerPlayer.y)
}

// Fire off some poof pouches
function poof(){
	let poofItemIdx = locate_item("smoke")
	if(-1 == poofItemIdx){
		return
	}

	// Throw some pouches around you
	let poofAroundDist = 25
	parent.socket.emit("throw", {num: poofItemIdx, x: character.x + poofAroundDist, y: character.y + poofAroundDist});
	parent.socket.emit("throw", {num: poofItemIdx, x: character.x - poofAroundDist, y: character.y + poofAroundDist});
	parent.socket.emit("throw", {num: poofItemIdx, x: character.x + poofAroundDist, y: character.y - poofAroundDist});
	parent.socket.emit("throw", {num: poofItemIdx, x: character.x - poofAroundDist, y: character.y - poofAroundDist});
}

// Throw confetti
function throwConfetti(){
	let confettiItemIdx = locate_item("confetti")
	if(-1 == confettiItemIdx){
		return
	}

	parent.socket.emit("throw", {num: confettiItemIdx, x: character.x, y: character.y});
}

// Laser show \ make it rain
// Thanks @Rising
async function laserAndGoldShow(){
	const potential_targets = Object.values(parent.entities)
	  .filter(e => e && is_character(e) && distance(character,e) < G.skills.mluck.range)
	  .map(c => c.name)
	  .sort((a,b) => 0.5-Math.random())
	for(let i=0;i<potential_targets.length;i++){
	  const target_name = potential_targets[i]
	  if(i%2 === 0){
		use("mluck", target_name)
	  }else{
		send_gold(target_name,1)
	  }
	  const delay = 200
	  await new Promise(r => setTimeout(r, delay));
	}
	laserAndGoldShow()
  }

// Mana potions to keep the laser show running
function potions(){
	if(character.max_mp - character.mp > 400){
		
		// Don't spam use pots
		if(new Date()<parent.next_skill.use_mp) return;

		use('use_mp');
	}

	// Buy mpot0 if we need more pots
	if(-1 == locate_item("mpot0")){
		buy("mpot0")
	}
}

// Join give aways automatically
// Thanks @SpadarFaar
function joinGiveAways(){
	for(let id in parent.entities)
    {
        let entity = parent.entities[id];
        if(entity.id != character.id)
        {
            for(let slot_name in entity.slots)
            {
                let slot = entity.slots[slot_name];
                if(slot && slot.giveaway)
                {
                    if(!slot.list.includes(character.id))
                    {
                        parent.join_giveaway(slot_name,entity.id,slot.rid);
                    }
                }
            }
        }
    }
}

// Start the laser show (async func that calls itself)
laserAndGoldShow()

//setInterval(joinGiveAways, 1000);
setInterval(potions,120)
setInterval(circlePartyThrower,120)
setInterval(poof,5 * 1000)
setInterval(throwConfetti,3 * 1000) // Confetti animation is a couple seconds don't throw too many
