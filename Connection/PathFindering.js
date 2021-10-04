load_code("SignalR2");

game_log("Starting");
var lastPing = null;
var pathFoundCallback = null
class ALHub{
	constructor(url, hubname){
		this.url = url;
		this.hubname = hubname;
		this.connecting = true;
		this.Connect(url, hubname);
	}
	
	Connect(){
		let connection = $.hubConnection();
		connection.url = this.url;
		var hubClass = this;
		
		this.Proxy = connection.createHubProxy(this.hubname);
		
		this.Proxy.on('Pong', function (message) {
				console.log(new Date() - lastPing);
				lastPing = null;
		});
		
		this.Proxy.on('PathFound', function (path) {
			waiting = false;
			pathFoundCallback(path)
		});
		this.Proxy.on('GetMesh', function (mesh) {
			console.log(mesh);

			if(parent.mapMesh == null || parent.mapMesh.map != character.map)
				{
					if(parent.mapMesh != null)
					{
						try{parent.mapMesh.e.destroy({children:true})}catch(ex){}
					}

					var e=new PIXI.Graphics();
					for(var i = 0; i < mesh.length; i++)
					{
						var line = mesh[i];
						var p1 = line.P1;
						var p2 = line.P2;


						cellLine(p1.X, p1.Y, p2.X, p2.Y, 1, 0xEA1111, e);
					}
					e.endFill();
					parent.map.addChild(e); //e.destroy() would remove it, if you draw too many things and leave them there, it will likely bring the game to a halt

					parent.mapMesh = {map: character.map, e: e};
					meshPending = false;
				}
		});
		connection.start().done(function() {
			game_log("Connected");
			hubClass.connected = true;
			hubClass.connecting = false;
			hubClass.Proxy.invoke('Initialize', character.name);
			connection.disconnected(function(){
				hubClass.connected = false;
				//hubClass.connecting = false;
				game_log("Disconnected...");
				connection.stop();
				waiting = false;
			});
			connection.reconnecting(function(){
				hubClass.connected = false;
				//hubClass.connecting = false;
				game_log("Disconnected...");
				connection.stop();
				waiting = false;
			});
			
			lastPing = new Date();
		}).fail(function(){
			hubClass.connected = false;
			hubClass.connecting = false;
			game_log('Could not Connect!');
			///setTimeout(function(){hubClass.Connect();}, 2500); 
		});
		
			
	}
}

let hub = {};

setInterval(function(){
	
	if(!hub.connected && !hub.connecting)
	{
		hub = new ALHub('http://localhost:8082/signalr', 'adventurelandHub');
	}
	else if(hub.connected && !hub.initialized)
	{
		hub.Proxy.invoke('Ping');
		lastPing = new Date();
	}
	
	console.log(hub);
	console.log($.hubConnection());
}, 1000);

var waiting;
var waitDate;

if(parent.mapMesh != null)
{
	try{parent.mapGrid.e.destroy({children:true})}catch(ex){}
	parent.mapMesh = null;
}

var meshPending;


//The below code needs to be run by the Party Leader, and anyone in the party that wishes to automatically follow through teleports.
//Clean out an pre-existing listeners
if (parent.prev_handlersignalrhub) {
    for (let [event, handler] of parent.prev_handlersignalrhub) {
      parent.socket.removeListener(event, handler);
    }
}

parent.prev_handlersignalrhub = [];

//handler pattern shamelessly stolen from JourneyOver
function register_signalrhubhandler(event, handler) 
{
	parent.prev_handlersignalrhub.push([event, handler]);
    parent.socket.on(event, handler);
};

var reportPlayers = true;
var reportMonsters = [];
function signalREntitesHandler(event)
{
	for(id in parent.entities)
	{
		var entity = parent.entities[id];
		
		var isPlayerToReport = reportPlayers && entity.type == "character" && !entity.citizen;
		var isMonsterToReport = entity.type == "monster" && reportMonsters.indexOf(entity.mtype) != -1;
		
		if(isPlayerToReport || isMonsterToReport)
		{
			var reducedEntity = {};
		}
	}
}

//Register event handlers
register_signalrhubhandler("entities", signalREntitesHandler);

var currentPath;
var target;
var drawMesh = false;
setInterval(function(){
	if(hub.connected)
	{
		if(drawMesh && !meshPending && (parent.mapMesh == null || parent.mapMesh.map != character.map))
		{
			hub.Proxy.invoke('GetMesh', character.map);
			meshPending = true;
		}
	}
}, 40);

function getPathToArea(map, callback)
{
	if(!(hub && hub.Proxy && hub.connected))
	{
		//game_log("smart moving to " + map)
		smart_move(map)
		return
	}

	getPathToPoint(0, 0, map, callback)
}

function getPathToPoint(x, y, map, callback)
{
	//game_log("getPathToPoint " + x + ", " + y + " in " + map)
	if(!(hub && hub.Proxy && hub.connected))
	{
		//game_log("smart moving to " + x + ", " + y + " in " + map)
		smart_move({x:x, y:y, map:map})
		return
	}

	if(waiting)
	{
		game_log("unable to path because waiting")
		//smart_move({x:x, y:y, map:map})
		return
	}

	waiting = false;
	waitDate = new Date();
	var target = {X: x, Y: y};
	var pathObj = {To: {X: target.X, Y: target.Y, Map: map}, From: {X: character.real_x, Y: character.real_y, Map: character.map}};
	pathFoundCallback = callback
	//game_log("finding path to " + pathObj.To.X + ", " + pathObj.To.Y + " in " + pathObj.To.Map)
	//game_log(JSON.stringify(pathObj))
	hub.Proxy.invoke('FindPath', JSON.stringify(pathObj));
}

let lastNotWaiting = new Date()
function clearStalledWaiting()
{
	if(!waiting)
	{
		lastNotWaiting = new Date()
	}

	let delta = new Date() - lastNotWaiting
	if(delta > 5000)
	{
		waiting = false
	}
}
setInterval(clearStalledWaiting, 100)

/*
Simple 2D JavaScript Vector Class
Hacked from evanw's lightgl.js
https://github.com/evanw/lightgl.js/blob/master/src/vector.js
*/

function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

/* INSTANCE METHODS */

Vector.prototype = {
	negative: function() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	},
	add: function(v) {
		if (v instanceof Vector) {
			this.x += v.x;
			this.y += v.y;
		} else {
			this.x += v;
			this.y += v;
		}
		return this;
	},
	subtract: function(v) {
		if (v instanceof Vector) {
			this.x -= v.x;
			this.y -= v.y;
		} else {
			this.x -= v;
			this.y -= v;
		}
		return this;
	},
	multiply: function(v) {
		if (v instanceof Vector) {
			this.x *= v.x;
			this.y *= v.y;
		} else {
			this.x *= v;
			this.y *= v;
		}
		return this;
	},
	divide: function(v) {
		if (v instanceof Vector) {
			if(v.x != 0) this.x /= v.x;
			if(v.y != 0) this.y /= v.y;
		} else {
			if(v != 0) {
				this.x /= v;
				this.y /= v;
			}
		}
		return this;
	},
	equals: function(v) {
		return this.x == v.x && this.y == v.y;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	cross: function(v) {
		return this.x * v.y - this.y * v.x
	},
	length: function() {
		return Math.sqrt(this.dot(this));
	},
	normalize: function() {
		return this.divide(this.length());
	},
	min: function() {
		return Math.min(this.x, this.y);
	},
	max: function() {
		return Math.max(this.x, this.y);
	},
	toAngles: function() {
		return -Math.atan2(-this.y, this.x);
	},
	angleTo: function(a) {
		return Math.acos(this.dot(a) / (this.length() * a.length()));
	},
	toArray: function(n) {
		return [this.x, this.y].slice(0, n || 2);
	},
	clone: function() {
		return new Vector(this.x, this.y);
	},
	set: function(x, y) {
		this.x = x; this.y = y;
		return this;
	}
};

/* STATIC METHODS */
Vector.negative = function(v) {
	return new Vector(-v.x, -v.y);
};
Vector.add = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);
	else return new Vector(a.x + v, a.y + v);
};
Vector.subtract = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);
	else return new Vector(a.x - v, a.y - v);
};
Vector.multiply = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
	else return new Vector(a.x * v, a.y * v);
};
Vector.divide = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);
	else return new Vector(a.x / v, a.y / v);
};
Vector.equals = function(a, b) {
	return a.x == b.x && a.y == b.y;
};
Vector.dot = function(a, b) {
	return a.x * b.x + a.y * b.y;
};
Vector.cross = function(a, b) {
	return a.x * b.y - a.y * b.x;
};