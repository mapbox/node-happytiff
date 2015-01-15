HappyTIFF
---------
A *HappyTIFF* is a [GeoTIFF](http://en.wikipedia.org/wiki/GeoTIFF) with extents that match exactly those of a web mercator ZXY tile.

This library can be used to verify that a GeoTIFF is a HappyTIFF.

    var happytiff = require('happytiff');
    var filepath = __dirname + '/test/fixtures/91-50-7.valid.tif';

    happytiff.info(function(filepath, function(err, info) {
        console.log(info);
        // { x: 91, y: 50, z: 7 }
    });

