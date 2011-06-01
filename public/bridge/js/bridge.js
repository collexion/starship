var CANVAS_HEIGHT = 600;
var CANVAS_WIDTH  = 800;
var FPS           = 30;

var Z_BG          = 10;
var Z_SPRITE      = 20;
var Z_EFFECT      = 30;
var Z_HUD_BG      = 40;
var Z_HUD_FG      = 50;

var MOUSE_LEFT    = 0;
var MOUSE_MIDDLE  = 1;
var MOUSE_RIGHT   = 2;

var gbl_zoom      = 1.0;

var gbl_cpt_grid_size = CANVAS_HEIGHT / 7.0;
var gbl_cpt_ship_size = CANVAS_HEIGHT / 8.0;
var gbl_cpt_beacon = false;

var gbl_hud_stardate;


window.onload = function() {
  //start crafty
  Crafty.init( CANVAS_WIDTH + 2, CANVAS_HEIGHT + 2 );
  
  var ship_sprite = Crafty.sprite( 140, "assets/ship.png", { ship: [0,0] } );
  

  // SCENE: loading
  // The loading screen that will display while our assets load
  Crafty.scene("loading", function() {
    // Load takes an array of assets and a callback when complete
    Crafty.load(["assets/ship.png"], function() {
      Crafty.scene("session"); //when everything is loaded, run the main scene
    });
    
    // Black background with some loading text
    Crafty.background("#000");
    Helpers.createText( {
      text: "Loading...",
      x: 150, y: 120,
      w: 300, h: 20,
      css: { "text-align": "left" }
    } );
  });
    
  // SCENE: session
  // Initial session create/join screen
  Crafty.scene("session", function() {
    var btnCreate = Helpers.createText( {
      text: "Create Game",
      x: 50,  y: 100,
      w: 300, h: 20,
      css: {"text-align": "left"}
    });
    
    btnCreate.addComponent( "Mouse" )
      .bind("click", function() {
        // Contact server, initiate session
        Crafty.scene("create_game");
      });
      
    Helpers.createText( {
      text: "Join a Game (enter session ID):",
      x: 50,  y: 150,
      w: 300, h: 20,
      css: {"text-align": "left"}
    });
    
    Helpers.createText( {
      text: '<input type="text" id="session_id"/>',
      x: 50, y: 200,
      w: 100, h: 20
    });
      
  });

  // SCENE: create_game
  // Create new game on server
  Crafty.scene("create_game", function() {
    Helpers.createText( {
      text: "Creating game...",
      x: 150, y: 120,
      w: 300, h: 20,
      css: { "text-align": "left" } 
    } );
      
    // connect()
    
    Crafty.scene("captain_hud");
  });
  
  // SCENE: captain_hud
  // Captain's UI
  Crafty.scene("captain_hud", function() {
    Crafty.background( "rgb( 30, 30, 85 )");
    
    Crafty.e("2D, Canvas, Grid")
      .attr( { w: CANVAS_WIDTH, h: CANVAS_HEIGHT, x: 0, y: 0, z: Z_BG } )
      .grid( Helpers.zoom( gbl_cpt_grid_size ), 1, "grey" )
      .bind("enterframe", function(){
        this.shift( 0, 1 );
      });
      
    // Stardate box
    Crafty.e("2D, Canvas, Box")
      .attr({w: 100, h: 20, x: CANVAS_WIDTH - 100, y: CANVAS_HEIGHT - 20, z: Z_HUD_BG})
      .box( { fill: "#888888", borderColor: "#FF0000" } );
    
    // Stardate text
    hud_stardate = Helpers.createText( {
      text: "Stardate",
      x: CANVAS_WIDTH - 100, y: CANVAS_HEIGHT - 20, z: Z_HUD_FG,
      w: 100, h: 20,
      css: { "font-size": "10px" } 
    } );
      
    /* PROBLEM: when setting width & height, these get used as the "source" 
     * width and height for calls to canvas.drawImage(). So the first draw goes
     * fine, but the rest end up cropping the original sprite instead of scaling
     * it. I think this is a CraftyJS bug; see sprite#init and sprite#draw,
     * specifically code referring to __coords
     */    
    
    var ship = Crafty.e("2D, Canvas, ship")
      .attr( { x: CANVAS_WIDTH / 2.0 - Helpers.zoom( gbl_cpt_ship_size ) / 2.0,
               y: CANVAS_HEIGHT / 2.0 - Helpers.zoom( gbl_cpt_ship_size ) / 2.0,
               w: Helpers.zoom( gbl_cpt_ship_size ), 
               h: Helpers.zoom( gbl_cpt_ship_size ),
               z: Z_SPRITE } )
      .origin( "center" )
      .bind( "enterframe", function() { this.rotation += 4; } );
      


    //Crafty.e("2D, Canvas, Box")
      //.attr( { x: ship.x,
               //y: ship.y,
               //w: ship.w,
               //h: ship.h,
               //z: Z_HUD_FG } )
      //.box( { fill: false, borderColor: '#5555FF', borderWidth: 5 } );
               
    // Push button, receive beacon
    Crafty.e("2D, DOM, Mouse")
      .attr( { x: 0, y: 0, w: CANVAS_WIDTH, h: CANVAS_HEIGHT, z: Z_HUD_FG } )
      .bind( "click", function(e) {
        if ( e.button == MOUSE_LEFT ) {
          console.log("LMB");
          // TODO: contact server, set new beacon
          if ( gbl_cpt_beacon ) {
            gbl_cpt_beacon.destroy();
            gbl_cpt_beacon = false;
          } 
          
          gbl_cpt_beacon = Crafty.e("2D, Canvas, Box")
            .attr( { x: e.realX, y: e.realY, w: 4, h: 4, z: Z_EFFECT } )
            .box( { fill: "#00FF00", borderWidth: false, borderColor: "white" } );
        } else if ( e.button == MOUSE_RIGHT ) {
          console.log("RMB");
          // TODO: contact server, clear beacon
          if ( gbl_cpt_beacon ) gbl_cpt_beacon.destroy();
        } else if ( e.button == MOUSE_MIDDLE ) {
          console.log("MMB");
        }
      });
        
  });
  
  
  
  // Automatically play the loading scene
  Crafty.scene("loading");
};


