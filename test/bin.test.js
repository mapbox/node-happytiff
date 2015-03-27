var execFile = require('child_process').execFile;
var tape = require('tape');
var path = require('path');
var binPath = path.resolve(__dirname + '/../bin/happytiff');

tape('usage', function(assert) {
    execFile(binPath, function(err, stdout, stderr) {
        assert.equal(err.code, 1);
        assert.equal(/Usage:\s+happytiff/.test(stdout), true, 'usage');
        assert.end();
    });
});

tape('proxies err', function(assert) {
    execFile(binPath, ['/does/not/exist.tif'], function(err, stdout, stderr) {
        assert.equal(err.code, 3);
        assert.equal(stderr, 'Error: ENOENT, open \'/does/not/exist.tif\'\n');
        assert.end();
    });
});

tape('validates', function(assert) {
    execFile(binPath, [__dirname + '/fixtures/91-50-7.valid.tif'], function(err, stdout, stderr) {
        assert.ifError(err);
        assert.equal(stdout, '{\n  "z": 7,\n  "x": 91,\n  "y": 50\n}\n');
        assert.end();
    });
});

tape('validates (format=zxy)', function(assert) {
    execFile(binPath, ['--format=zxy', __dirname + '/fixtures/91-50-7.valid.tif'], function(err, stdout, stderr) {
        assert.ifError(err);
        assert.equal(stdout, '7/91/50\n');
        assert.end();
    });
});

tape('invalid', function(assert) {
    execFile(binPath, [__dirname + '/fixtures/invalid.tif'], function(err, stdout, stderr) {
        assert.equal(err.code, 3);
        assert.equal(/Error: Extent coord 0 differs from nearest tile \(11\/1040\/684\)/.test(stderr), true);
        assert.end();
    });
});

