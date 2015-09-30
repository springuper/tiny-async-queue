# async-q
a simple queue executing async functions linearly with pause/resume

## Installation

```
npm install async-fun-queue
```

## Example

The most common use case:

```js
var queue = new AsyncQueue([1, 2, 3], function (job, done) {
    collection.push(job);
    // simulate async
    setTimeout(function () {
        done();
    }, 100);
});
queue.on('jobStart', function (job) {
    // job begin to run
});
queue.on('jobDone', function (job) {
    // job is done
});
queue.on('end', function () {
    // all jobs are done
});

queue.run();
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
    // pause is paused
});
queue.on('resume', function () {
    // queue is resumed
});

queue.run();
```
