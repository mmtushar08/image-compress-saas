/**
 * Compression Concurrency Limiter (Semaphore)
 *
 * Prevents CPU spikes by capping how many Sharp compression
 * jobs run simultaneously. On a shared Hostinger VPS with limited
 * cores, running 10 compressions at once = 100% CPU.
 *
 * MAX_CONCURRENT = 3 means at most 3 images are being compressed
 * at any moment. Excess requests wait in queue — they don't fail.
 */

const MAX_CONCURRENT = parseInt(process.env.MAX_CONCURRENT_JOBS || '3', 10);

let running = 0;
const queue = [];

/**
 * Acquire a slot. Resolves when a slot is free.
 */
function acquire() {
    return new Promise((resolve) => {
        if (running < MAX_CONCURRENT) {
            running++;
            resolve();
        } else {
            queue.push(resolve);
        }
    });
}

/**
 * Release a slot. Wakes up next waiting job.
 */
function release() {
    const next = queue.shift();
    if (next) {
        next(); // hand the slot directly to the next waiter
    } else {
        running--;
    }
}

/**
 * Run a function with a concurrency slot.
 * Always releases the slot — even on error.
 */
async function withConcurrencyLimit(fn) {
    await acquire();
    try {
        return await fn();
    } finally {
        release();
    }
}

module.exports = { withConcurrencyLimit, MAX_CONCURRENT };
