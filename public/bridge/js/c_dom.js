/**@
* #Grid
* @comp Grid
* Component for drawing a grid across the entire stage
*/
Crafty.c("TouchTarget", {
  debug: false,
  _touchID: false,
  _entTouchTarget: false,
  _domTouchTarget: false,
  restingX: 0,
  restingY: 0,
  
  init: function() {
    this._touchID = "touch-" + this[0];
    console.log("TouchTarget init");
    return this;
  },
  
  // Crafty.e("2D, DOM, TouchTarget")
  //   .touch( { x:, y:, w:, h: } )
  //   .bind("touch", function(e) {
  //     this.x = e.newX;
  //   });
  touchTarget: function( pos ) {
    if ( this.debug ) console.log("TouchTarget#touchTarget");
    
    if ( pos ) {
      this.x = pos.x;
      this.y = pos.y;
      this.w = pos.w;
      this.h = pos.h;
    }
    
    // Fail if touch target has no dimensions
    if ( !this.x && !this.y && !this.w && !this.h ) {
      return false;
    }
    
    // On changed event, re-save original X and Y
    this.bind("changed", function() {
      this.restingX = this.x;
      this.restingY = this.y;
    });
    
    var ent = this;
    
    $(this._element).Touchable({logging:true});
    $(this._element)
      .bind("touchablemove", function( e, touch ) {
        if ( this.debug ) console.log("trigger touchmove");
        touch.newX = ent.restingX + touch.currentStartDelta.x;
        touch.newY = ent.restingY + touch.currentStartDelta.y;
        ent.trigger("touch", touch);
      })
      .bind("touchableend", function( e, touch ) {
        if ( this.debug ) console.log("trigger touchend");
        ent.trigger( "touchend", touch );
      });
  
    this.trigger("changed");
    
    return this;
  }
  
} );
