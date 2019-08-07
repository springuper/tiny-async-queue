# tiny-async-queue

[![Build Status](https://travis-ci.org/springuper/tiny-async-queue.svg?branch=master)](https://travis-ci.org/springuper/tiny-async-queue)

A simple queue executing async functions linearly with pause/resume

## Installation

```
npm install tiny-async-queue
```

## Example

The most common use case:

```js
var collection = [];
var queue = new AsyncQueue([1, 2, 3], function (job, done) {
    collection.push(job);
    // simulate async
    setTimeout(function () {
        done();
    }, 100);
});
queue.on('jobStart', function (job) {
    // job begin to run
    collection.push('jobStart:' + job);
});
queue.on('jobDone', function (job) {
    // job is done
    collection.push('jobDone:' + job);
});
queue.on('end', function () {
    // all jobs are done
    collection.push('allJobDone');
});

queue.run();
console.log(collection); // => jobStart:1, 1, jobDone:1, ..., jodDone:3, allJobDone
```

A more complicated use case, with `pause` and `resume` method to controll the execution process:

```js
var queue = new AsyncQueue([1, 2, 3], function (job, done) {
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
    // queue is paused
});
queue.on('resume', function () {
    // queue is resumed
});

queue.run();
```
