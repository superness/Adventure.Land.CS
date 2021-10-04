function PostServerStatus()
{
	let statuses = Object.keys(parent.S).filter(k => is_object(parent.S[k])).map(e => 
	{
		parent.S[e].eventname = e
		parent.S[e].server_region = parent.server_region
		parent.S[e].server_identifier = parent.server_identifier

		return parent.S[e]
    })

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://aldata.info/api/serverstatuses", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(statuses));
}

function PostNPCStatus()
{
    // Find any notable NPCs around us to post
    let notableNpcs = ["Kane", "Angel"]
    let npcInfos = []

    for(npc of notableNpcs) {
        let foundEntity = get_entity(npc)

        if(null != foundEntity) {
            npcInfos.push({
                server_region: parent.server_region,
                server_identifier: parent.server_identifier,
                map: foundEntity.map,
                x: foundEntity.x,
                y: foundEntity.y,
                name: npc
            })
        }
    }

    if(npcInfos.length > 0) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "https://aldata.info/api/npcinfos", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(npcInfos));
    }
}

// GetServerStatuses(s => { show_json(s) });
// GetServerStatuses(s => { 
// 	let liveEvents = s.filter(e => true == e.live)

// 	for(let event of liveEvents)
// 	{
// 		let eventMsg = event.eventname + " live @ " + event.server_region + " " + event.server_identifier
// 		if(null != event.target)
// 		{
// 			eventMsg += " fighting " + event.target
// 		}
// 		game_log(eventMsg)
// 	}
// });
function GetServerStatuses(callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", "https://www.aldata.info/api/ServerStatus", true); // true for asynchronous 
    xmlHttp.send(null);
}

function GetNPCInfosForServer(server_region, server_identifier, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }

    xmlHttp.open("GET", `https://www.aldata.info/api/NPCInfo/${server_region}/${server_identifier}`, true); // true for asynchronous 
    xmlHttp.send(null);
}

function GetNPCInfos(callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", "https://www.aldata.info/api/NPCInfo", true); // true for asynchronous 
    xmlHttp.send(null);
}

//PostServerStatus()
PostNPCStatus()
//setInterval(PostServerStatus, 1000 * 5) // post updates
setInterval(PostNPCStatus, 1000 * 5) // post updates


// Hookup observers to post all server data


for(const server of parent.X.servers) {
    const socket = parent.io(`ws://${server.addr}:${server.port}`, {transports: ["websocket"], reconnection: true, autoConnect: true})
    socket.on("server_info", (data) => {
      // Creates a listener for `server_data` (this is what feeds info in to parent.S)
      let statuses = []
      if(data && Object.keys(data).length > 0) {
        // There is some sort of data (i.e. not an empty object)
  
        statuses = Object.keys(data).filter(k => is_object(data[k])).map(e => 
        {
          data[e].eventname = e
          data[e].server_region = server.region
          data[e].server_identifier = server.name
          return data[e]
        })
      }

      // If franky is not up post a 'live=false' status for it
      if(data && !data["franky"])
      {
        statuses.push({x:0, y:0, live:false, eventname: "franky", server_region:server.region, server_identifier:server.name})
      }
      
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "https://aldata.info/api/serverstatuses", true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(statuses));
    })
  }