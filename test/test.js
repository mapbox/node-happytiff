var tape = require('tape');
var happytiff = require('../index.js');

tape('nearestZoom', function(assert) {
    for (var z = 0; z < 22; z++) {
        var base = Math.pow(2,z);
        var lo = Math.random() * (base - Math.pow(2,z-1)) * 0.5;
        var hi = Math.random() * (Math.pow(2,z+1) - base) * 0.5;
        // base - up to half the distance from previous pow2
        assert.equal(happytiff.nearestZoom(base-lo),z, (base-lo).toFixed(3) + ' => ' + z);
        // base === an exact pow2
        assert.equal(happytiff.nearestZoom(base),z, base.toFixed(3) + ' => ' + z);
        // base + up to half the distance to the next pow2
        assert.equal(happytiff.nearestZoom(base+hi),z, (base+hi).toFixed(3) + ' => ' + z);
    }
    assert.end();
});

tape('fromExtent', function(assert) {
    assert.deepEqual(happytiff.fromExtent([-180,-85.0511,180,85.0511]), { x:0, y:0, z:0 });
    assert.deepEqual(happytiff.fromExtent([-180,-85.0511,0,0]), { x:0, y:1, z:1 });
    assert.throws(function() {
        happytiff.fromExtent([-145,-85.0511,145,85.0511]);
    }, new RegExp('Extent coord 0 differs from nearest tile \\(0/0/0\\) by more than > 1.40625'));
    assert.throws(function() {
        happytiff.fromExtent([-180,-80,180,80]);
    }, new RegExp('Extent coord 1 differs from nearest tile \\(0/0/0\\) by more than > 0.119841'));
    assert.throws(function() {
        happytiff.fromExtent([-180,0,180,85.0511]);
    }, new RegExp('Extent coord 1 differs from nearest tile \\(0/0/0\\) by more than > 0.119841'));
    assert.end();
});

tape('info', function(assert) {
    happytiff.info(__dirname + '/fixtures/91-50-7.valid.tif', function(err, info) {
        assert.ifError(err);
        assert.deepEqual(info, { x: 91, y: 50, z: 7});
        assert.end();
    });
});

tape('info invalid', function(assert) {
    happytiff.info(__dirname + '/fixtures/invalid.tif', function(err, info) {
        assert.ok(err);
        assert.equal(/Error: Extent coord 0 differs from nearest tile \(11\/1040\/684\)/.test(err.toString()), true);
        assert.end();
    });
});

