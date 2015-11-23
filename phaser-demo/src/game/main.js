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
        player = game.add.sprite(32, game.world.height - 150, 'dude');
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


    },

    collectStar: function(player, star) {
        star.kill();
        score += 1000;
        scoreText.text = 'Score: ' + score;

    },

    update: function() {
        
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);

        player.body.velocity.x = 0;

        if (cursors.left.isDown && !cursors.up.isDown)
        {
            player.body.velocity.x = -1*movespeed;
            player.animations.play('left');
            rest_frame = 2;
        }

        else if (cursors.right.isDown && !cursors.up.isDown)
        {
            player.body.velocity.x = movespeed;
            player.animations.play('right');
            rest_frame = 0;
        }

        else if (cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown)
        {
            player.body.velocity.y = movespeed;
        }

        else if (cursors.right.isDown && cursors.up.isDown)
        {
            player.body.velocity.x = movespeed;
            player.body.velocity.y = -1*movespeed;
            player.frame = 11;
            rest_frame = 10;
        }

        else if (cursors.left.isDown && cursors.up.isDown)
        {
            player.body.velocity.x = -1*movespeed;
            player.body.velocity.y = -1*movespeed;
            player.frame = 9;
            rest_frame = 10;
        }

        else 
        {
            player.animations.stop();
            player.frame = rest_frame;
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y = -350;
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