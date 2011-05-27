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
