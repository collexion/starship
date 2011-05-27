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
  //Crafty.canvas();
  
  // Turn the sprite map into usable components
  Crafty.sprite(16, "assets/sprite.png", {
    grass1: [0,0],
    grass2: [1,0],
    grass3: [2,0],
    grass4: [3,0],
    flower: [0,1],
    bush1:  [0,2],
    bush2:  [1,2],
    player: [0,3]
  });
  
  var ship_sprite = Crafty.sprite( 140, "assets/ship.png", { ship: [0,0] } );
  
  Crafty.c("Grid", {
    ready: false,
    _offsetX: 0,
    _offsetY: 0,
    _lineStyle: "",
    _lineWidth: 0,
    _gridSize: 0,
    
    init: function() {
      this.bind("draw", function(e) {
        if ( this.ready ) {
          if(e.type === "canvas") {
            var ctx = e.ctx;
            var clip = e.pos;
            var halfgrid = this._gridSize / 2.0;
            var center_x = CANVAS_WIDTH / 2.0 + this._offsetX;
            var center_y = CANVAS_HEIGHT / 2.0 + this._offsetY;
            var x_step = halfgrid;
            var y_step = halfgrid;
            
            // Line strokes straddle pixels for odd-numbered stroke widths
            // Make strokes pixel-accurate by shifting half a pixel as necessary
            // Except things aren't on pixel boundaries by default =(
            //var subpixel = ( this._lineWidth % 2 == 1 ) ? 0.5 : 0;
            
            ctx.save();

            // Set clipping area
            if ( clip ) {
              ctx.beginPath();
              ctx.rect( clip._x, clip._y, clip._w, clip._h );
              ctx.clip();
            }
            
            // Grid style
            ctx.strokeStyle = this._lineStyle;
            ctx.lineWidth = this._lineWidth;
            
            // Draw two grid lines at a time, equidistant from center, expanding
            // away from center by x_step and y_step in each direction
            while ( x_step < CANVAS_WIDTH / 2.0 || y_step < CANVAS_HEIGHT / 2.0 ) {
              // Vertical
              ctx.strokeRect( center_x - x_step, 
                              -this._lineWidth, 
                              x_step * 2, 
                              CANVAS_HEIGHT + this._lineWidth * 2 );
              
              // Horizontal
              ctx.strokeRect( -this._lineWidth, 
                              center_y - y_step, 
                              CANVAS_WIDTH + this._lineWidth * 2, 
                              y_step * 2 );

              x_step += this._gridSize;
              y_step += this._gridSize;
            }  
            
            ctx.restore();
            
          } else if(e.type === "DOM") {
            // DOM not supported
          }
        }
      });
      
      this.trigger("change");
      
      return this;

    },
    
    grid: function( gridSize, lineWidth ) {
      this._gridSize = gridSize;
      this._lineWidth = lineWidth;
      this.ready = this._gridSize && this._lineWidth && this._lineStyle;
      return this;
    },
    
    gridStyle: function( lineStyle ) {
      this._lineStyle = lineStyle;
      this.ready = this._gridSize && this._lineWidth && this._lineStyle;
      return this;
    },
    
    shiftX: function( offset ) { this._offsetX = ( this._offsetX + offset ) % this._gridSize; this.trigger("change"); },
    shiftY: function( offset ) { this._offsetY = ( this._offsetY + offset ) % this._gridSize; this.trigger("change"); },
  });

// Box object, draws a box based on x/y/w/h
Crafty.c("Box", {
    ready: false,
    _fillColor: "black",
    _borderColor: "black",
    _borderWidth: 1.0,
    
    init: function() {
      this.bind("draw", function(e) {
        if ( this.ready ) {
          if (e.type === "canvas") {
            var ctx = e.ctx;
            var clip = e.pos;
            
            ctx.save();

            // Set clipping area
            if ( clip ) {
              ctx.beginPath();
              ctx.rect( clip._x, clip._y, clip._w, clip._h );
              ctx.clip();
            }

            // Draw filled box
            if ( this._fillColor ) {
              ctx.fillStyle = this._fillColor;
              ctx.fillRect( this.x, this.y, this.w, this.h );
            }
            
            // Draw box border
            if ( this._borderColor && this._borderWidth ) {
              ctx.lineWidth = this._borderWidth;
              ctx.strokeStyle = this._borderColor;
              ctx.strokeRect( this.x, this.y, this.w, this.h );
            }

            ctx.restore();
            
          } else if (e.type === "DOM") {
            // DOM not supported
          }
        }
      });
      
      this.trigger("change");
      
      return this;

    },
    
    box: function( attr ) {
      this._fillColor   = attr.fill === false ? false : attr.fill || this._fillColor;
      this._borderWidth = attr.borderWidth === false ? false : attr.borderWidth || this._borderWidth;
      this._borderColor = attr.borderColor === false ? false : attr.borderColor || this._borderColor;
      this.trigger("change");
      this.ready = true;
      return this;
    },
    
  });

  // The loading screen that will display while our assets load
  Crafty.scene("loading", function() {
    // Load takes an array of assets and a callback when complete
    Crafty.load(["assets/sprite.png", "assets/ship.png"], function() {
      Crafty.scene("session"); //when everything is loaded, run the main scene
    });
    
    // Black background with some loading text
    Crafty.background("#000");
    Crafty.e("2D, DOM, Text").attr({w: 300, h: 20, x: 150, y: 120})
      .text("Loading")
      .css({"text-align": "left"});
  });
  
  
  // Initial session create/join screen
  Crafty.scene("session", function() {
    Crafty.e("2D, DOM, Text, Mouse").attr({w: 300, h: 20, x: 50, y: 100})
      .text("Create Game")
      .css({"text-align": "left"})
      .bind("click", function() {
        // Contact server, initiate session
        Crafty.scene("create_game");
      });
      
    Crafty.e("2D, DOM, Text").attr({w: 300, h: 20, x: 50, y: 150})
      .text("Join a Game (enter session ID):")
      .css({"text-align": "left"});
      
    Crafty.e("2D, DOM, Text").attr({w: 100, h:20, x: 50, y: 200})
      .text('<input type="text" id="session_id"/>');
  });


  // Create new game on server
  Crafty.scene("create_game", function() {
    Crafty.e("2D, DOM, Text").attr({w: 300, h: 20, x: 150, y: 120})
      .text("Creating game...")
      .css({"text-align": "left"});
      
    // connect()
    
    Crafty.scene("captain_hud");
  });
  
  
  // Captain's UI
  Crafty.scene("captain_hud", function() {
    Crafty.background( "#202050");
    
    Crafty.e("2D, Canvas, Grid")
      .attr( { w: CANVAS_WIDTH, h: CANVAS_HEIGHT, x: 0, y: 0, z: Z_BG } )
      .grid( zoom( gbl_cpt_grid_size ), 1 )
      .gridStyle("grey")
      .bind("enterframe", function(){
        this.shiftY( 1 );
      });
      
    Crafty.e("2D, Canvas, Box")
      .attr({w: 100, h: 20, x: CANVAS_WIDTH - 100, y: CANVAS_HEIGHT - 20, z: Z_HUD_BG})
      .box( { fill: "#888888", borderColor: "#FF0000" } );
      //.fillStyle("#888888")
      //.lineStyle("#FF0000");
    
    hud_stardate = Crafty.e("2D, DOM, Text")
      .attr({w: 100, h: 20, x: CANVAS_WIDTH - 100, y: CANVAS_HEIGHT - 20, z: Z_HUD_FG})
      .text("Stardate")
      .css({"font-size": "10px"});
      
    /* PROBLEM: when setting width & height, these get used as the "source" 
     * width and height for calls to canvas.drawImage(). So the first draw goes
     * fine, but the rest end up cropping the original sprite instead of scaling
     * it. I think this is a CraftyJS bug; see sprite#init and sprite#draw,
     * specifically code referring to __coords
     */    
    
    var ship = Crafty.e("2D, Canvas, ship")
      .attr( { x: CANVAS_WIDTH / 2.0 - zoom( gbl_cpt_ship_size ) / 2.0,
               y: CANVAS_HEIGHT / 2.0 - zoom( gbl_cpt_ship_size ) / 2.0,
               w: zoom( gbl_cpt_ship_size ), 
               h: zoom( gbl_cpt_ship_size ),
               z: Z_SPRITE } )
      .origin( "center" )
      .bind( "enterframe", function() { this.rotation += 4; } );
      


        Crafty.e("2D, Canvas, Box")
      .attr( { x: ship.x,
               y: ship.y,
               w: ship.w,
               h: ship.h,
               z: Z_HUD_FG } )
      .box( { fill: false, borderColor: '#5555FF', borderWidth: 5 } );
               
    //Crafty.e("2D, Canvas, Box")
      //.attr( { x: CANVAS_WIDTH / 2.0 - zoom( gbl_cpt_grid_size / 4.0 ) / 2.0,
               //y: CANVAS_HEIGHT / 2.0 - zoom( gbl_cpt_grid_size / 4.0 ) / 2.0,
               //w: zoom( gbl_cpt_grid_size / 4.0 ),
               //h: zoom( gbl_cpt_grid_size / 4.0 ),
               //z: Z_HUD_BG } )
      //.box( { fill: false, borderColor: 'white', borderWidth: 5 } );
    
    // Click for beacon
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
  
  function zoom( value ) {
    return value * gbl_zoom;
  }
  
  
  // Automatically play the loading scene
  Crafty.scene("loading");
  //Crafty.scene("captain_hud");
};


