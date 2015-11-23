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
        

        player.animations.add('left', [4,5], 10, true);
        player.animations.add('right', [7,8], 10, true);


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
        player.updateCrop();
        
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);

        player.body.velocity.x = 0;

        if (game.input.mousePointer.isDown)
        {
            goal_x = game.input.x-20;
            goal_y = game.input.y-32;

        }
        score = player.x;
        var error_distance = Phaser.Math.distance(player.x,player.y,goal_x,goal_y);
        scoreText.text = 'X: ' + score;
        movespeed = Phaser.Math.min(4*error_distance,200);
        game.physics.arcade.moveToXY(player,goal_x,goal_y,movespeed);

        if (movespeed > 15)
        {
            if (goal_x < player.x)
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
    Phaser.AUTO,
    'game',
    state
);