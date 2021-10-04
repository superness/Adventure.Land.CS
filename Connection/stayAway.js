
Math.getDistance = function( x1, y1, x2, y2 ) {
	
	var 	xs = x2 - x1,
		ys = y2 - y1;		
	
	xs *= xs;
	ys *= ys;
	 
	return Math.sqrt( xs + ys );
};


var createNodes = function (numNodes, radius) {
	var nodes = [], 
		width = (radius * 2) + 50,
		height = (radius * 2) + 50,
		angle,
		x,
		y,
		i;
	for (i=0; i<numNodes; i++) {
	 angle = (i / (numNodes/2)) * Math.PI; // Calculate the angle at which the element will be placed.
										   // For a semicircle, we would use (i / numNodes) * Math.PI.
	 x = (radius * Math.cos(angle)) + (width/2); // Calculate the x position of the element.
	 y = (radius * Math.sin(angle)) + (width/2); // Calculate the y position of the element.
	 nodes.push({'id': i, 'x': x, 'y': y});
	}
	return nodes;
  }

  function calcangle (x00,y00,x01,y01,x10,y10,x11,y11) {
    var dx0  = x01 - x00;
    var dy0  = y01 - y00;
    var dx1  = x11 - x10;
    var dy1  = y11 - y10;
    angle = Math.atan2(dx0 * dy1 - dx1 * dy0, dx0 * dx1 + dy0 * dy1);
    return angle;
}

function getMoves(numNodes, radius, target = null, kiteBox = null)
{
	let moves = createNodes(numNodes, radius);
	let canMoves = []

	if(target == null) target = get_target()

	for(var id in moves)
	{
		moves[id].x += character.real_x - 30
		moves[id].y += character.real_y - 30

		moves[id].x -= radius
		moves[id].y -= radius

		let dx = target.real_x - character.real_x
		let dy = target.real_y - character.real_y
		let ddx = target.going_x - target.real_x
		let ddy = target.going_y - target.real_y
		let len = Math.getDistance(0, 0, dx, dy)
		let llen = Math.getDistance(0, 0, ddx, ddy)

		dx /= len
		dy /= len

		ddx /= llen
		ddy /= llen

		let px = dy
		let py = -dx

		let ppx = ddy
		let ppy = -ddx
		
		let extend = 80

		let tx = target.real_x + px * extend
		let ty = target.real_y + py * extend
		let tx2 = target.real_x - px * extend
		let ty2 = target.real_y - py * extend
		
		let ttx = target.real_x + ppx * extend
		let tty = target.real_y + ppy * extend
		let ttx2 = target.real_x - ppx * extend
		let tty2 = target.real_y - ppy * extend

		let narrowCheck = Math.PI / 7.0

		// don't move in the direction of the target
		let angleBetween = calcangle(character.real_x, character.real_y, moves[id].x, moves[id].y, 
			character.real_x, character.real_y, target.real_x + (target.going_x - target.real_x) / 2, target.real_y + (target.going_y - target.real_y) / 2)

									 
		angleBetween = Math.abs(angleBetween)
		if(angleBetween < narrowCheck)
		{
			if(drawDebug) draw_circle(moves[id].x, moves[id].y, 10, 1, 0x0000AA)
			continue
		}
		else
		{
			//draw_circle(moves[id].x, moves[id].y, 10, 1, 0xFF00FF)
		}

		angleBetween = calcangle(character.real_x, character.real_y, moves[id].x, moves[id].y, 
			character.real_x, character.real_y, target.real_x - (target.going_x - target.real_x) / 3, target.real_y - (target.going_y - target.real_y) / 3)
									 
		angleBetween = Math.abs(angleBetween)
		if(angleBetween < narrowCheck)
		{
			if(drawDebug) draw_circle(moves[id].x, moves[id].y, 10, 1, 0xAA00AA)
			continue
		}
		else
		{
			//draw_circle(moves[id].x, moves[id].y, 10, 1, 0xFF00FF)
		}

		angleBetween = calcangle(character.real_x, character.real_y, moves[id].x, moves[id].y, 
			character.real_x, character.real_y, tx, ty)
		//draw_circle(tx, ty, 5)
									 
		angleBetween = Math.abs(angleBetween)
		if(angleBetween < narrowCheck)
		{
			if(drawDebug) draw_circle(moves[id].x, moves[id].y, 10, 1, 0x0000FF)
			continue
		}
		else
		{
			//draw_circle(moves[id].x, moves[id].y, 10, 1, 0xFF00FF)
		}

		angleBetween = calcangle(character.real_x, character.real_y, moves[id].x, moves[id].y, 
			character.real_x, character.real_y, tx2, ty2)
		//draw_circle(tx2, ty2, 5)

									 
		angleBetween = Math.abs(angleBetween)
		if(angleBetween < narrowCheck)
		{
			if(drawDebug) draw_circle(moves[id].x, moves[id].y, 10, 1, 0x000066)
			continue
		}
		else
		{
			//draw_circle(moves[id].x, moves[id].y, 10, 1, 0xFF00FF)
		}

		angleBetween = calcangle(character.real_x, character.real_y, moves[id].x, moves[id].y, 
			character.real_x, character.real_y, ttx, tty)
		//draw_circle(ttx, tty, 5)
									 
		angleBetween = Math.abs(angleBetween)
		if(angleBetween < narrowCheck)
		{
			if(drawDebug) draw_circle(moves[id].x, moves[id].y, 10, 1, 0x330066)
			continue
		}
		else
		{
			//draw_circle(moves[id].x, moves[id].y, 10, 1, 0xFF00FF)
		}

		angleBetween = calcangle(character.real_x, character.real_y, moves[id].x, moves[id].y, 
			character.real_x, character.real_y, ttx2, tty2)
		//draw_circle(ttx2, tty2, 5)
									 
		angleBetween = Math.abs(angleBetween)
		if(angleBetween < narrowCheck)
		{
			if(drawDebug) draw_circle(moves[id].x, moves[id].y, 10, 1, 0x5577FF)
			continue
		}
		else
		{
			//draw_circle(moves[id].x, moves[id].y, 10, 1, 0xFF00FF)
		}

		// don't move into a spot that is close to the target
		dx = moves[id].x - character.real_x
		dy = moves[id].y - character.real_y
		len = Math.getDistance(0, 0, dx, dy)

		dx /= len
		dy /= len

		let testX = character.real_x + (dx * 30)
		let testY = character.real_y + (dy * 30)

		// let testDist = Math.getDistance(testX, testY, target.real_x, target.real_y)
		// if(testDist < 75)
		// {
		// 	if(drawDebug) draw_circle(moves[id].x, moves[id].y, 10, 1, 0xFF0000)
		// 	continue;
		// }

		// testDist = Math.getDistance(testX, testY, target.real_x + (target.going_x - target.real_x) / 3, target.real_y + (target.going_y - target.real_y) / 3)
		// if(testDist < 75)
		// {
		// 	if(drawDebug) draw_circle(moves[id].x, moves[id].y, 10, 1, 0xFF0000)
		// 	continue;
		// }

		if(!can_move_to(moves[id].x, moves[id].y))
		{
			//draw_circle(moves[id].x, moves[id].y, 10, 1, 0xFF0000)
			continue
		}
		
		// // don't go anywhere near our target
		// if(Math.getDistance(target.x, target.y, moves[id].x, moves[id].y) < 100)
		// {
		// 	//draw_circle(moves[id].x, moves[id].y, 10, 1, 0x0000FF)
		// 	continue
		// }
		
		// // don't go near where our target is going
		// if(Math.getDistance(target.x + (target.going_x - target.x) / 3, target.y + (target.going_y - target.y) / 3, moves[id].x, moves[id].y) < 100)
		// {
		// 	//draw_circle(moves[id].x, moves[id].y, 10, 1, 0x0000FF)
		// 	continue
		// }

		// don't move out of range
		let rangeCheck = character.range
		if(rangeCheck < 70)
		{
			rangeCheck = 300
		}
		if(Math.getDistance(target.x + (target.going_x - target.x) / 3, target.y + (target.going_y - target.y) / 3, moves[id].x, moves[id].y) > rangeCheck)
		{
			continue
		}

		// don't move too close to myself
		if(Math.getDistance(character.real_x, character.real_y, moves[id].x, moves[id].y) < 50)
		{
			//draw_circle(moves[id].x, moves[id].y, 10, 1, 0xFF0000)
			continue
		}

		// Don't move out of the kite box
		if(null != kiteBox)
		{
			if(!(moves[id].x > kiteBox.left && moves[id].x < kiteBox.right &&
				 moves[id].y > kiteBox.bottom && moves[id].y < kiteBox.top))
			{
				if(drawDebug) draw_circle(moves[id].x, moves[id].y, 10, 1, 0xFF0000)
				continue
			}
		}

		//draw_circle(moves[id].x, moves[id].y, 10, 1, 0x00FF00)
		canMoves.push(moves[id])
	}

	return canMoves
}

let drawDebug = false

function stayAwayFromTarget(target = null, kiteBox = null)
{
	if(drawDebug) clear_drawings();

	if(target == null) target = get_target()
	if(target == null)
	{
		return;
	}

	//game_log("staying away from " + target.name)

	// if(character.hp > character.max_hp * 0.5)
	// {
	// 	return;
	// }
	
	var c_dist=parent.distance(character, target);
	if(c_dist < 250)
	{
		// Run in a direction we can actually move to
		// let moves = [
		// 	{x:character.x-(target.x-character.x), y:character.y-(target.y-character.y)},
		// 	{x:character.x+(target.x-character.x), y:character.y-(target.y-character.y)},
		// 	{x:character.x-(target.x-character.x), y:character.y+(target.y-character.y)},
		// 	{x:character.x+(target.x-character.x), y:character.y+(target.y-character.y)},
		// 	{x:character.x-(target.y-character.y), y:character.y-(target.x-character.x)},
		// 	{x:character.x+(target.y-character.y), y:character.y-(target.x-character.x)},
		// 	{x:character.x-(target.y-character.y), y:character.y+(target.x-character.x)},
		// 	{x:character.x+(target.y-character.y)/2, y:character.y+(target.x-character.x)},
		// 	{x:character.x-c_dist, y:character.y-c_dist},
		// 	{x:character.x+c_dist, y:character.y-c_dist},
		// 	{x:character.x-c_dist, y:character.y+c_dist},
		// 	{x:character.x+c_dist, y:character.y+c_dist},
		//]

		// Filter down to the positions we CAN move to
		let layers = 12
		let numNodes = 16
		let radius = 30
		let canMoves = []
		for(var i = 0; i < layers; ++i)
		{
			canMoves = canMoves.concat(getMoves(numNodes, radius, target, kiteBox))
			radius += 20
			numNodes += 8
		}

		//let canMoves =  getMoves(48, 150).concat(getMoves(40, 100).concat(getMoves(32, 40).concat(getMoves(32, 70))))

		// If we can't move anywhere then try to blink away
		let distTarget = Math.getDistance(character.real_x, character.real_y, target.real_x, target.real_y)
		
		let bestMove = canMoves[0]
		let fromTarget = 0;

		// Which move is furthest from the target
		for(var id in canMoves)
		{
			let movingx = target.x + (target.going_x - target.x) / 2;
			let movingy = target.y + (target.going_y - target.y) / 2;
			let distFromTarget = Math.getDistance(canMoves[id].x, canMoves[id].y, movingx, movingy)

			if(distFromTarget > fromTarget)
			{
				fromTarget = distFromTarget
				bestMove = canMoves[id]
			}

			//draw_circle(canMoves[id].x, canMoves[id].y, 10)
		}

		if(null != bestMove)
		{
			if(drawDebug) draw_circle(bestMove.x, bestMove.y, 10, 2, 0xFFFFFF)

			// If the target is close to us then blink away instead of moving
			set_message(distTarget)

			// move towards the move spot
			// move further the closer the target is
			let moveMulti = 100 / distTarget;
			let moveToX = character.going_x + (bestMove.x - character.going_x) / 3 * moveMulti
			let moveToY = character.going_y + (bestMove.y - character.going_y) / 3 * moveMulti
			if(drawDebug) draw_circle(moveToX, moveToY, 10, 2, 0x00FFFF)
			//move(moveToX, moveToY)
			Mover.setGoal({x:moveToX, y:moveToY})
		}
		else
		{
			game_log("nowhere to move away :(")
		}
		
	}

	//draw_circle(character.real_x, character.real_y, 50, 2, 0xFF0FFF)
	//draw_circle(character.x, character.y, 66, 3, 0xFF00FF)
	if(drawDebug) draw_circle(target.x, target.y, 80, 2, 0xFF00FF)
	if(drawDebug) draw_circle(target.x + (target.going_x - target.x) / 3, target.y + (target.going_y - target.y) / 3, 10, 2, 0xFFFF00)
}
