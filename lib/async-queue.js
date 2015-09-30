var EventEmitter = require('events');
var util = require('util');

function AsyncQueue(jobs, handler) {
    if (!(this instanceof AsyncQueue)) return new AsyncQueue(jobs, handler);

    this.queue = [].concat(jobs);
    this.handler = handler;
    this.paused = false;
}
util.inherits(AsyncQueue, EventEmitter);

// XXX not decided to expose `add` method
// all jobs should be determined at the beginning
AsyncQueue.prototype.add = function () {
    this.queue.push.apply(this.queue, arguments);
};

AsyncQueue.prototype.consume = function () {
    if (this.isEmpty()) {
        this.emit('end', job);
        return;
    }

    var job = this.queue.shift();
    var self = this;

    this.emit('jobStart', job);
    this.handler(job, function () {
        self.emit('jobDone', job);
        self.run();
    });
};

AsyncQueue.prototype.pause = function () {
    this.paused = true;
    this.emit('pause');
};

AsyncQueue.prototype.resume = function () {
    this.paused = false;
    this.emit('resume');
    this.run();
};

AsyncQueue.prototype.destroy = function () {
    this.queue = null;
    this.removeAllListeners();
};

AsyncQueue.prototype.isEmpty = function () {
    return this.queue.length === 0;
};

AsyncQueue.prototype.run = function () {
    var self = this;
    setTimeout(function () {
        if (self.paused) return;
        self.consume();
    }, 0);
};

module.exports = AsyncQueue;
