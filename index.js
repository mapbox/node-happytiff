var omnivore = require('mapnik-omnivore');
var util = require('util');
var sm = new (require('sphericalmercator'))();
var EXTENT = 20037508.342789244;

module.exports = {};
module.exports.info = info;
module.exports.fromExtent = fromExtent;
module.exports.nearestZoom = nearestZoom;

// For a given filepath,
// - verifies that it's a happytiff
// - returns pertinent happytiff info (its z,x,y cover)
function info(filepath, callback) {
    omnivore.digest(filepath, afterDigest);
    function afterDigest(err, info) {
        if (err) return callback(err);
        var zxy;
        try { zxy = fromExtent(info.extent); }
        catch(err) { return callback(err); }
        return callback(null, zxy);
    }
}

function fromExtent(extent) {
    // Determine that extent covers very close to a tile-like extent.
    var mercExtent = sm.convert(extent, '900913');

    // Get zxy coords of tile @ centerpoint of extent.
    var z = nearestZoom((EXTENT*2) / (mercExtent[2] - mercExtent[0]));
    var xMid = extent[0] + (extent[2]-extent[0])*0.5;
    var yMid = extent[1] + (extent[3]-extent[1])*0.5;
    var xyz = sm.xyz([xMid, yMid, xMid, yMid], z);
    var x = xyz.minX;
    var y = xyz.minY;

    // Get extent of zxy tile & compare to actual extent.
    var tileExtent = sm.bbox(x, y, z);

    // Get a lon,lat threshold that is ~1px.
    // The happytiff extent may not vary from the tile extent
    // by more than this value.
    var px = sm.px(tileExtent, z);
    var ll = sm.ll([px[0]+1, px[1]+1], z);
    var maxDiff = [
        Math.abs(ll[0] - tileExtent[0]),
        Math.abs(ll[1] - tileExtent[1]),
        Math.abs(ll[0] - tileExtent[0]),
        Math.abs(ll[1] - tileExtent[1])
    ];
    for (var i = 0; i < 4; i++) {
        var diff = Math.abs(tileExtent[i] - extent[i]);
        if (diff > maxDiff[i]) {
            throw new Error(util.format('Extent coord %d differs from nearest tile (%d/%d/%d) by more than > %s (%s vs %s)', i, z, x, y, maxDiff[i].toFixed(6), extent[i], tileExtent[i]));
        }
    }

    return { z: z, x: x, y: y };
}

// For a given tile count dimension (x or y) return the zoom level
// with the closest tile count dimension (ie, one of the powers of 2).
function nearestZoom(num) {
    var z = 0;
    var prev = num;
    var dist = Math.abs(num-Math.pow(2,z));
    while (dist < prev) {
        z++;
        prev = dist;
        dist = Math.abs(num-Math.pow(2,z));
    }
    return Math.max(0,z-1);
}

