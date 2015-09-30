var assert = require('assert');
var AsyncQueue = require('../lib/async-queue');

describe('AsyncQueue', function () {
    it('should execute async methods linearly', function (done) {
        var collection = [];
        var queue = new AsyncQueue([1, 2, 3], function (job, done) {
            collection.push(job);
            // simulate async
            setTimeout(function () {
                done();
            }, 100);
        });
        queue.on('jobStart', function (job) {
            collection.push('jobStart:' + job);
        });
        queue.on('jobDone', function (job) {
            collection.push('jobDone:' + job);
        });
        queue.on('end', function () {
            assert.deepEqual(collection, [
                'jobStart:1',
                1,
                'jobDone:1',
                'jobStart:2',
                2,
                'jobDone:2',
                'jobStart:3',
                3,
                'jobDone:3'
            ]);
            done();
        });

        queue.run();
    });

    it('should control process with pause/resume', function (done) {
        var collection = [];
        var queue = new AsyncQueue([1, 2, 3], function (job, done) {
            collection.push(job);
            setTimeout(function () {
                done();
                if (job === 2) {
                    queue.pause();
                    setTimeout(function () {
                        queue.resume();
                    }, 100);
                }
            }, 100);
        });
        queue.on('pause', function () {
            collection.push('pause');
        });
        queue.on('resume', function () {
            collection.push('resume');
        });
        queue.on('end', function () {
            assert.deepEqual(collection, [
                1,
                2,
                'pause',
                'resume',
                3
            ]);
            done();
        });

        queue.run();
    });
});
