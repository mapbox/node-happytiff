![travis](https://travis-ci.org/mapbox/node-happytiff.svg?branch=master)

HappyTIFF
---------
A *HappyTIFF* is a [GeoTIFF](http://en.wikipedia.org/wiki/GeoTIFF) with extents that match exactly those of a web mercator ZXY tile.

This library can be used to verify that a GeoTIFF is a HappyTIFF.

`happytiff` CLI command:

    $ sudo npm install -g happytiff
    $ happytiff test/fixtures/91-50-7.valid.tif
    {
      "z": 7,
      "x": 91,
      "y": 50
    }

JS API:

    var happytiff = require('happytiff');
    var filepath = __dirname + '/test/fixtures/91-50-7.valid.tif';

    happytiff.info(function(filepath, function(err, info) {
        console.log(info);
        // { x: 91, y: 50, z: 7 }
    });

### Source data

The test images in `test/fixtures` are open data from:

    91-50-7.valid.tif   landsat 8 composite, USGS (http://www.usgs.gov)
    invalid.tif         flanders composite, AGIV (https://www.agiv.be)

