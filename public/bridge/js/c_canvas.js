/**@
* #Grid
* @comp Grid
* Component for drawing a grid across the entire stage
*/
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
  
  /**@
  * #.grid
  * @sign public Component .grid(Number gridSize, Number lineWidth)
  * @param gridSize - Size of one grid square in canvas units (usually pixels)
  * @param lineWidth - Width of grid lines in canvas units (usually pixels) 
  * @param lineStyle - CSS color attribute for grid line stroke
  * Constructor, sets up the size and style of the grid.
  */
  grid: function( gridSize, lineWidth, lineStyle ) {
    this._gridSize = gridSize;
    this._lineWidth = lineWidth || this._lineWidth;
    this._lineStyle = lineStyle || this._lineStyle;
    this.ready = this._gridSize && this._lineWidth && this._lineStyle;
    return this;
  },

  /**@
  * #.shift
  * @sign public Component .shift(Number offsetX, Number offsetY)
  * @param offsetX - Canvas units by which to shift the grid horizontally
  * @param lineWidth - Canvas units by which to shift the grid vertically
  * Constructor, sets up the size and style of the grid.
  */
  shift: function( offsetX, offsetY ) { 
    this._offsetX = ( this._offsetX + offsetX ) % this._gridSize; 
    this._offsetY = ( this._offsetY + offsetY ) % this._gridSize; 
    this.trigger("change"); 
    return this;
  },
});


/**@
* #Box
* @comp Box
* Component for drawing a flat, colored box on the stage
*/
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




/**@
* #SwitchUI
* @comp SwitchUI
* Component for adding switch-like properties to a UI element
*/
Crafty.c( "SwitchUI", {
  touchTarget: false,
  _start: false,
  _end: false,
  _snapMargin: 1.0,
  _orientation: false,
  
  init: function() {
    this.touchTarget = Crafty.e( "2D, DOM, TouchTarget" )
      .attach( this )
      .bind( "touch", function( touch ) {
        // Project touch vector onto linear switch line
        var start = this._start;
        var end   = this._end;
        
        // Clip movement to switch path
        // (there's gotta be a better way to do this, brain's not working)
        
        if ( this._orientation == "horizontal" ) {
          // Switch is horizontal-ish, use X
          if ( start.x < touch.newX < end.x || start.x > touch.newX > end.x ) {
            // New X between start and end, use new X and calc Y
            this.x = touch.newX;
            this.y = this.x * ( end.y - start.y ) / ( end.x - start.x );
          } else if ( touch.newX <= start.x < end.x || touch.newX >= start.x > end.x ) {
            // New X less than start, use start X/Y
            this.x = start.x;
            this.y = start.y;
          } else if ( touch.newX >= end.x > start.x || touch.newX <= end.x < start.x ) {
            // New X greater than end, use end X/Y
            this.x = end.x;
            this.y = end.y;
          }
          
          // If switch travel is past the snap point, snap!
          if ( Math.abs( this.x - start.x ) / Math.abs( end.x - start.x ) < this._snapMargin ) {
            // To the beginning
            this.x = start.x;
            this.y = start.y;
          } else if ( Math.abs( this.x - end.x ) / Math.abs( end.x - start.x ) < this._snapMargin ) {
            // To the end
            this.x = end.x;
            this.y = end.y;
          }
        } else if ( this._orientation == "vertical" ) {
          if ( end.y - start.y > 0 ) {
            if ( start.y < touch.newY <  end.y || start.y > touch.newY > end.y ) {
              // New Y between start and end, calc X and use new Y
              this.y = touch.newY;
              this.x = this.y * ( end.x - start.x ) / ( end.y - start.y );
            } else if ( touch.newX <= start.x < end.x || touch.newX >= start.x > end.x ) {
              // New Y less than start, use start X/Y
              this.x = start.x;
              this.y = start.y;
            } else if ( touch.newX >= end.x > start.x || touch.newX <= end.x < start.x ) {
              // New Y greater than end, use end X/Y
              this.x = end.x;
              this.y = end.y;
            }
            
          }
          
          // If switch travel is past the snap point, snap!
          if ( Math.abs( this.y - start.y ) / Math.abs( end.y - start.y ) < this._snapMargin ) {
            // To the beginning
            this.x = start.x;
            this.y = start.y;
          } else if ( Math.abs( this.y - end.y ) / Math.abs( end.y - start.y ) < this._snapMargin ) {
            // To the end
            this.x = end.x;
            this.y = end.y;
          }
        }
      });
      
      return this;
  },
  
  // snapMargin is the percentage from the beginning or end of switch travel
  //   that the switch should "snap" to the minimum or maximum (on/off)
  // opts = { start: { x: startX, y: startY }, end: { x: endX, y: endY }, snapMargin: 0.1 }
  switchUI: function( opts ) {
    this._start = opts.start;
    this._end = opts.end;
    this._snapMargin = opts.snapMargin;
    
    // Cache the orientation calculation
    if ( Math.abs( this._start.x - this._end.x ) > Math.abs( this._start.y - this._end.y ) ) {
      this._orientation = "horizontal";
    } else {
      this._orientation = "vertical";
    }
    
    this.touchTarget
      .attr( { x: this.x, y: this.y, z: Z_HUD_FG, w: this.w, height: this.h } )
      .touchTarget();

    return this;
  },
  
  turnOn:  function() { this.state(true); return this; },
  turnOff: function() { this.state(false); return this; },
  isOn:  function() { return !!this.state(); },
  isOff: function() { return !this.state(); },
  
  state: function( state ) {
    if ( typeof state == "undefined" ) {
      // Return state; is switch REALLY close to the end point?
      return Math.abs( this.x - this._end.x ) + Math.abs( this.y - this._end.y ) < 0.01;
    } else {
      // Set the switch to start or end point ("on" or "off")
      var point = state ? this._end : this._start;
      
      this.x = point.x;
      this.y = point.y;
    }
  }
  
});
