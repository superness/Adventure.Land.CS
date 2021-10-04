var lastcc = 0;
init_ccmeter();
function init_ccmeter() {
	let $ = parent.$;
	let statbars = $('#bottommid');

	statbars.find('#ccmeter').remove();

	let ccmeter = $('<div id="ccmeter"></div>').css({
		fontSize: '15px',
		color: 'white',
		textAlign: 'center',
		display: 'table',
		width: "50%",
		margin: "0 auto"
	});

	let ccmeter_content = $('<div id="ccmetercontent"></div>')
	.html("<div><div id='ccmeterfill'></div></div>")
	.css({
		display: 'table-cell',
		verticalAlign: 'middle',
		background: 'green',
		border: 'solid gray',
		borderWidth: '4px 4px 0px, 4px',
		height: '15px',
		color: '#FFD700',
		textAlign: 'center',
		width: "100%",
	})
	.appendTo(ccmeter);
	statbars.children().first().after(ccmeter);

	update_ccmeter();
}



function update_ccmeter()
{
	let $ = parent.$;
	var fillAmount = ((character.cc/180)*100).toFixed(0);
	
	$("#ccmeterfill").css({
		background: 'red',
		height: '15px',
		color: '#FFD700',
		textAlign: 'center',
		width: fillAmount + "%",
	});
}

//Clean out an pre-existing listeners
if (parent.prev_handlersccmeter) {
    for (let [event, handler] of parent.prev_handlersccmeter) {
      parent.socket.removeListener(event, handler);
    }
}

parent.prev_handlersccmeter = [];

//handler pattern shamelessly stolen from JourneyOver
function register_ccmeterhandler(event, handler) 
{
    parent.prev_handlersccmeter.push([event, handler]);
    parent.socket.on(event, handler);
};

function ccmeter_playerhandler(event){
	if(event.cc != lastcc)
	{
		update_ccmeter();
		lastcc = event.cc;
	}
}

register_ccmeterhandler("player", ccmeter_playerhandler);



function startXPTimer()
{
	//Courtesy of Four

	setInterval(function() {
	update_xptimer();
  }, 1000 / 4);
  
  var minute_refresh; // how long before the clock resets
  
  function init_xptimer(minref) {
	minute_refresh = minref || 1;
	parent.add_log(minute_refresh.toString() + ' min until tracker refresh!', 0x00FFFF);
  
	let $ = parent.$;
	let brc = $('#bottomrightcorner');
  
	brc.find('#xptimer').remove();
  
	let xpt_container = $('<div id="xptimer"></div>').css({
	  background: 'black',
	  border: 'solid gray',
	  borderWidth: '5px 5px',
	  width: '320px',
	  height: '96px',
	  fontSize: '28px',
	  color: '#77EE77',
	  textAlign: 'center',
	  display: 'table',
	  overflow: 'hidden',
	  marginBottom: '-5px'
	});
  
	//vertical centering in css is fun
	let xptimer = $('<div id="xptimercontent"></div>')
	  .css({
		display: 'table-cell',
		verticalAlign: 'middle'
	  })
	  .html('Estimated time until level up:<br><span id="xpcounter" style="font-size: 40px !important; line-height: 28px">Loading...</span><br><span id="xprate">(Kill something!)</span>')
	  .appendTo(xpt_container);
  
	brc.children().first().after(xpt_container);
  }
  
  var last_minutes_checked = new Date();
  var last_xp_checked_minutes = character.xp;
  var last_xp_checked_kill = character.xp;
  // lxc_minutes = xp after {minute_refresh} min has passed, lxc_kill = xp after a kill (the timer updates after each kill)
  
  function update_xptimer() {
	if (character.xp == last_xp_checked_kill) return;
  
	let $ = parent.$;
	let now = new Date();
  
	let time = Math.round((now.getTime() - last_minutes_checked.getTime()) / 1000);
	if (time < 1) return; // 1s safe delay
	let xp_rate = Math.round((character.xp - last_xp_checked_minutes) / time);
	if (time > 60 * minute_refresh) {
	  last_minutes_checked = new Date();
	  last_xp_checked_minutes = character.xp;
	}
	last_xp_checked_kill = character.xp;
  
	let xp_missing = parent.G.levels[character.level] - character.xp;
	let seconds = Math.round(xp_missing / xp_rate);
	let minutes = Math.round(seconds / 60);
	let hours = Math.round(minutes / 60);
	let counter = `${hours}h ${minutes % 60}min`;
  
	$('#xpcounter').text(counter);
	$('#xprate').text(`${ncomma(xp_rate)} XP/s`);
  }
  
  function ncomma(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  init_xptimer(5)
}

startXPTimer()