/*global Phaser*/
/*jslint sloppy:true, browser: true, devel: true, eqeq: true, vars: true, white: true*/
var game;

var line;
var graphics;
var circle;
var player;
var enemies = [];


var mainState = {
    preload: preload,
    create: create,
    update: update
};

var enemy = {
    shape: 0,
    speed: 1,
    game: 0,
    setup: function(game){
        this.shape = game.add.graphics( (game.world.width / 2.0), game.world.height / 2.0 + 40);
        game.physics.arcade.enable(this.shape);
        this.shape.body.width = 20;
        this.shape.body.height = 20;
        this.game = game;
    },
    update: function(){
        this.shape.y = this.shape.y + 1;
        this.shape.x = this.shape.x + (Math.random()* 3 - 2);
    },
    draw: function(){
        this.shape.clear();
        this.shape.lineStyle(2.0, 0x15c2d6, 1.0);
        this.shape.beginFill(0x15c2d6,0.5);
        this.shape.drawRect(0 , 0 , 20, 20);
        game.debug.body(this.shape);
    }
};

// Initialize Phaser
game = new Phaser.Game(640, 480, Phaser.AUTO, 'gameDiv');
 
// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');


function preload(){

}

function create(){
    text = game.add.text(160, 90, 'Use Arrow Keys', { fontSize: '42px', fill: '#dd00ff' });
    setTimeout(function(){
        text.setText("");
    }, 3000);

    
    //this.load.image('background' , 'https://thumbs.dreamstime.com/z/cursor-arrow-keys-white-26213457.jpg');


    // This function is called after the preload function
    // Here we set up the game, display sprites, etc.

    //Create a new graphics object to draw the moving lines
    //  Position it 200 pixels left of the center of our game world,
    //  and at the bottom of our game world (game.world.height pixels)
    // Since we'll update the moving lines every frame, we only draw to this in our update function.
    graphics = game.add.graphics( (game.world.width / 2.0) - 200, game.world.height);

    

    //Create a second graphics object to draw a floating circle in the upper left, for demonstration. 
    //  Since we're not dynamically updaing this, we can draw to it in our "create" function.
    player = game.add.graphics( 320, 440);
    game.physics.arcade.enable(player);
    player.body.width = 50;
    player.body.height = 50;
    player.body.isCircle = true;
    player.body.offset.x = -25;
    player.body.offset.y = -25;


    //Draw a 2px wide line, red, fully transparent
    player.lineStyle(2.0, 0xff0000, 1.0);


    //Fill our shape with a medium red
    player.beginFill(0x660000,0.5);

    //Draw a circle
    circle = player.drawCircle(0, 0, 50);
    player.endFill();
   /* game.physics.arcade.enable(player);*/

}

//We'll use the offset variable to keep track of how much we move each vertical line
var offset = 0;

function update(){

    if (Math.random() < .01){
    enemy1 = Object.create(enemy);
    enemy1.setup(game);
    enemies.push(enemy1);
    }
    //Hold down the "r" key to reverse the line movement
    if (game.input.keyboard.isDown(Phaser.Keyboard.R)){
        offset += 1.0;
    }
    else{
        offset -= 1.0;
    }    



    //to move sprite left and right

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        player.x -= 4.0;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        player.x += 4.0;
    }

   //if circle goes off the track

    if (player.x < game.world.width/2.0-200 || player.x > game.world.width/2.0+200){

        player.destroy();
    }

    // Limit offset to 20px max
    offset = offset % 20;

    //Clear the graphics object -- note that we are doing this is the update function,
    // so once per frame we'll clear and re-draw everything.
    graphics.clear();

    //Draw 2px wide, green lines that are fully transparent.
    graphics.lineStyle(2.0, 0x00ff00, 1.0);

    //Draw our leftmost line from the bottom left corner of our graphics object
    // to the center of the screen and 200px up
    graphics.moveTo(0,0);
    graphics.lineTo(200, -200);

    //Draw our rightmost line from the bottom of our graphics object, 200px right of our center (so 400px total)
    // to the center of the screen and 200px up
    graphics.moveTo(400, 0);
    graphics.lineTo(200, -200);

    //Change our line style to draw 1px wide green lines
    graphics.lineStyle(1.0, 0x00ff00, 1.0);

    //Draw vertical lines starting on the bottom every 50px between our two outer lines, going to 
    // the center of the screen 200px up
    for(i = 50; i < 400; i += 50){
        graphics.moveTo(i, 0);
        graphics.lineTo(200, -200);
    }
    
    //Draw horizontal lines every 20px plus our offset from the leftmost vertical line to the rightmost vertical line
    for(i = 0; i < 200; i += 20){
        lineOffset = offset + i;

        graphics.moveTo(lineOffset, -lineOffset);
        graphics.lineTo((400 - lineOffset), -lineOffset);
    }

    for(i = 0; i < enemies.length; i ++){
        enemies[i].update();
        enemies[i].draw();
        game.physics.arcade.overlap(enemies[i].shape, player, collisionHandler);
    }

    game.debug.body(player);

 
}

    function collisionHandler (){
        console.log ("hello");
        player.destroy()
    }
