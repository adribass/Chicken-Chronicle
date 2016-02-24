//Easystar pathfinding


var easystar = new EasyStar.js();
var timeStep = 10;

var level = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0],
             [0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,1,1,0,0,0],
             [0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,0,0,0],
             [0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,0,1,1,1,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0]]

easystar.setGrid(level);

easystar.setIterationsPerCalculation(1000);

easystar.setAcceptableTiles([0]);

easystar.enableDiagonals();

var tilesize = 60;



//
var goal_x;
var goal_y;
var player;
var movespeed;
var maxspeed = 250;

// pathfinding variables
var pathStep;
var pathToGoal;
var nextStepX;
var nextStepY;
var tile_goal_x;
var tile_goal_y;
var player_tile_x;
var player_tile_y;


var music

var state = {
    init: function() {

        //lots to put in here i guess

    },

    preload: function() {

        //eventually we should organize the assets folder

        game.load.image('sky','assets/sky.png');

        game.load.image('star', 'assets/star.png');

        game.load.spritesheet('chicken', 'assets/Chicken.png', 32, 32);


        // STate preload logic goes here
    },

    create: function(){

        //world, eventually to be replaced with ISO 
        game.world.setBounds(0,0,1200,600);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0,0,'sky');

        //player
        player = game.add.sprite(12, game.world.height - 150, 'chicken');
        player.scale.setTo(2,2);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        game.camera.follow(player);


        // Add stars to level

        var star;

        for (var yt = 0; yt < level.length; yt++) {
                
            var tile = level[yt];
                
            for (var xt = 0; xt < level[yt].length; xt++) {
   
                if (tile[xt] == 1) {
                    star = game.add.sprite(xt*tilesize, yt*tilesize, 'star');
                    game.physics.arcade.enable(star);
                }
            }
        }


        //pathfinding function 

        setInterval(function(){

        easystar.calculate();

        }, timeStep);
    },

    update: function() {

        //on mouse click: set goal, estimate goal/player on tilemap, easystar findpath

        if (game.input.mousePointer.isDown)
        {   

            goal_x = game.input.x-20 + game.camera.x;
            goal_y = game.input.y-20 + game.camera.y;

            tile_goal_x = Phaser.Math.floorTo(goal_x/tilesize);    
            tile_goal_y = Phaser.Math.floorTo(goal_y/tilesize);
            player_tile_x = Phaser.Math.floorTo(player.x/tilesize);
            player_tile_y = Phaser.Math.floorTo(player.y/tilesize);


                easystar.findPath(player_tile_x, player_tile_y, tile_goal_x, tile_goal_y, function( path )
                {

                    if (path === null) {

                        console.log("No path found");

                    }

                    if (path) {

                        console.log("path found");


                        pathStep = 1;
                        pathToGoal = path;

                        nextStepX = path[1].x;
                        nextStepY = path[1].y;

                    }

                })  

        }


        movespeed = maxspeed;
        

        //player moves along the easystar path
        if (Phaser.Math.distance(player.x, player.y, nextStepX*tilesize, nextStepY*tilesize) < 5) {
            
            //if player is at the goal, stop
            if (pathStep == pathToGoal.length - 1){

                movespeed = 0;

            }

            //sets next point
            else {

                pathStep = pathStep + 1;
                nextStepX = pathToGoal[pathStep].x;
                nextStepY = pathToGoal[pathStep].y;

            }



        }

        //go to next point in easystar path
        game.physics.arcade.moveToXY(player,nextStepX*tilesize,nextStepY*tilesize,movespeed); 

    
    }

};



var game = new Phaser.Game(
    800,
    480,
    Phaser.AUTO,
    'game',
    state
);