# None Pizza with Left Brains

## Road Map

- Server (Colossus or whatever it's called)
	- /server folder
	- Node
	- TypeScript
	- Game state
	- Clients join and leave
	- Clients get the game state when it changes
	- Clients react to differences in the game state
	- Clients react to successful action events

- Client
	- /client folder
	- TypeScript -> WebPack -> flat file distribution
	- GitHub.io deployment
	- Text field for the server domain and port
	- Default localhost:3000 for testing

- Drawing (Phaser)
	- Background
	- Add and remove objects based on the game state
	- Update objects based on object game state changes

- Music (Beepbox)
	- Play any song and loop it
	- Put in a good song later
	- Test separate beepboxes for sound effects

- Player existence
	- State: Position
	- State: Facing direction
	- State: Activity (standing)
	- Animation or single frame
	- Clients are assigned to a Player
- Player walking
	- Keyboard controls
	- Action: Move
	- Action: Stop moving
	- State: Activity (walking)
	- Animation
	- Center the camera on the player
	- Server stops you from leaving the game board
- Player HP
	- State: HP value
	- State: Activity (dead)
	- Draw a life bar?
	- Animation or single frame for death
- Player attacking
	- Action: Attack
	- State: Last attack time
	- State: Activity (attacking)
	- Animation
- Player respawning
	- State: Time of death
	- Server action: Respawn (timed)
	- Animation for respawning

- Gamepad controls

- Day and night time cycle
- Low visibility

- Bases
	- Zombies at left
- Win condition

- Houses
- House HP
- House destruction
- House health HUD

- Bases produce pizza/brains during night/day
- Pick up and carry pizza/brains
- Deliver pizza/brains
- House repair on delivery
- Pizza/brains expire

- Lanes
- Minions spawn during day/night
- Minions HP
- Minions walk lanes
- Minions attack automatically

- Observer controls
- Queue for next match
- Side game for observers
- Murderous Crows event

- Hosted server distribution

- Obstacles
- Player dodging
	- State: Activity (dodging)
	- Animation
- Player timed powers
- Armored pizza truck / zombie tank
- Campground
- Music festival minigame
- Countdown until respawn
	- State: Future respawn time
- Minimap
