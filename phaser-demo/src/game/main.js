<<<<<<< HEAD
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
=======
/**
 *
 * This is a simple state template to use for getting a Phaser game up
 * and running quickly. Simply add your own game logic to the default
 * state object or delete it and make your own.
 *
 */

var platforms;
var player;
var cursors;
var score = 0;
var scoreText;
var stars;
var rest_frame = 1;
var movespeed = 150;
var goal_x;
var goal_y;
var cropRect;

var state = {


    init: function() {
        // Delete this init block or replace with your own logic.

        // Create simple text display for current Phaser version

        var text = "Phaser Version "+Phaser.VERSION + " works!";
        var style = { font: "24px Arial", fill: "#fff", align: "center" };
        var t = game.add.text(this.world.centerX, this.world.centerY, text, style);
        cursors = game.input.keyboard.createCursorKeys();
        t.anchor.setTo(0.5, 0.5);

    },



    preload: function() {

        game.load.image('sky','assets/sky.png');
        game.load.image('ground','assets/platform.png');
        game.load.image('star','assets/star.png');
        game.load.spritesheet('dude','assets/Chicken.png', 32, 32);

    },
    create: function(){

        //crop rectangle
        cropRect = new Phaser.Rectangle(7,16,18,20);

        //world
        game.world.setBounds(0,0,1200,600);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0,0,'sky');
        platforms = game.add.group();
        platforms.enableBody = true;
        var ground = platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(2,2);
        ground.body.immovable = true;
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        //player
        player = game.add.sprite(12, game.world.height - 150, 'dude');
        player.crop(cropRect);
        player.scale.setTo(2,2);
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        //player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        game.camera.follow(player);
        

        player.animations.add('left', [4,5], 10, true);
        player.animations.add('right', [7,8], 10, true);
        player.animations.add('upright',[11, 10], 10, true);
        player.animations.add('upleft',[9, 10], 10, true);


        //stars

        stars = game.add.group();

        stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++)
        {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 200;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }


     // score
     scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
     score = 0;

    },


    update: function() {

        //update crop to fix chicken sprite
        player.updateCrop();
        
        //update collisions
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);


        if (game.input.mousePointer.isDown)
        {
            goal_x = game.input.x-20 + game.camera.x;
            goal_y = game.input.y-20 + game.camera.y;

        }
        score = player.x;
        var error_distance = Phaser.Math.distance(player.x,player.y,goal_x,goal_y);
        scoreText.text = 'X: ' + score;
        movespeed = Phaser.Math.min(4*error_distance,200);
        game.physics.arcade.moveToXY(player,goal_x,goal_y,movespeed);

        if (movespeed > 15)
        {
            
            if ( Phaser.Math.difference(goal_y, player.y) > Phaser.Math.difference(goal_x, player.x)) 
            {
                if (goal_x < player.x)
                {
                    player.animations.play('upleft');
                    rest_frame = 10;
                }

                else
                    {
                        player.animations.play('upright');
                        rest_frame = 10;
                    }

            }
            /*
            else if Phaser.Math.difference(goal_y, player.y) > Phaser.Math.difference(goal_x, player.x) && goal_x > player.x)
            {
                player.animations.play('up right');
                rest_frame = 11;
            }
            */

            else if (goal_x < player.x)
            {

                player.animations.play('left');
                rest_frame = 2;

            }

            else
            {
                player.animations.play('right');
                rest_frame = 0;
            }

        }


        else 
        {
            player.animations.stop();
            player.frame = rest_frame;
        }

    }
};


var game = new Phaser.Game(
    800,
    600,
>>>>>>> 27c9039b5560d5b02e4782589453aaf21834634b
    Phaser.AUTO,
    'game',
    state
);