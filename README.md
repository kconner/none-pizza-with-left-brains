# None Pizza with Left Brains

![None Pizza with Left Brains](/media/screenshot 1.png?raw=true)

## How to set up a game

* Read how to start a server below.
* Go to the [site](http://none-pizza-with-left-brains.win).
* In the server host box, type your hostname or IP address, then click Submit.
* The page will reload. Copy the URL and send it to up to three friends.
* Press Space, Return, or gamepad buttons to join!

## How to play

You are a hero on either the Zombie team or the Human team. You win by destroying your enemy's base.

In addition to a base, each team has two houses and an army of minions.

Heroes can attack enemy heroes, minions, houses, and bases. Minions will attack too.

In the daytime:

* Human houses produce minions.
* Zombies can't see far in the light.
* Zombie heroes can pick up brains at their base and carry them to their houses to repair them.

![Humans in the daytime](/media/screenshot 2.png?raw=true?raw=true)
![Zombies in the daytime](/media/screenshot 5.png?raw=true?raw=true)

During the night:

* Zombie houses produce minions.
* Humans can't see far in the dark.
* Human heroes can pick up pizzas at their base and carry them to their houses to repair them.

![Humans at night](/media/screenshot 4.png?raw=true)
![Zombies at night](/media/screenshot 3.png?raw=true)

Houses produce minions faster when they are undamaged, so it's important to keep your houses in good shape.

You can't repair your base.

## Controls

* Move: Arrow keys or a joystick.
* Attack: Spacebar, Square/X, or R2/RT.

(We saw the best gamepad behavior in Chrome. Safari seemed to mangle the button mappings.)

## To run a server or develop the game:

You need NPM 9.4.0.

We installed it using [NVM](https://github.com/creationix/nvm):

```
nvm install 9.4.0
nvm use 9.4.0
nvm install-latest-npm
```

### Start a server

```
cd server
npm install
npm start
```

### Start a local client

```
cd client
npm install
npm start
```
