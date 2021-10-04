// For some set of registered scarers
//  control the rate that scare is used
//  for example across all scarers scare is only used once every 2 seconds
// Missing scarers will not affect a scarer trying to scare
//  specifically if a scarer wants to scare and checks with the group
//  to see if scare has been used recently the scarer will not be prevented
//  from scaring by another scarer in a different area who could not scare the same target


// When a scarer asks to scare it checks the last 'group scare time'
// If the last scare time is old enough then the scarer will scare and update the last 'group scare time'

function getLastGroupScare()
{
	let lastGroupScare = get('lastGroupScare')

	return lastGroupScare
}

function setLastGroupScare(lastGroupScare)
{
	set('lastGroupScare', lastGroupScare)
}

// Try to get the current last group scare if it is set
let lastGroupScare = getLastGroupScare()
	
if(null == lastGroupScare)
{
	lastGroupScare = new Date()
	setLastGroupScare(lastGroupScare)
}

function tryScare() 
{
	game_log("tryScare start")
	lastGroupScare = getLastGroupScare()

	if(mssince(new Date(lastGroupScare)) > 1000) // 1 second
	{
		if(is_on_cooldown('scare'))
		{
			game_log(" scare on cd")
			return
		}

		game_log(" scaring")
		use_skill('scare')

		setLastGroupScare(new Date())
	}
	else
	{
		game_log(" too early to scare")
	}
}	