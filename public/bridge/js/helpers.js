var Helpers = {
  createText: function ( attr ) {
      return Crafty.e("2D, DOM, Text")
        .attr( { x: attr.x, y: attr.y, z: attr.z, w: attr.w, h: attr.h } )
        .text( attr.text )
        .css( attr.css );
  },

  zoom: function ( value ) {
    return value * gbl_zoom;
  }
};
