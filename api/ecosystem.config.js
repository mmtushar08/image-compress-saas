module.exports = {
    apps: [
        {
            name: "shrinkix-api",
            script: "src/server.js",
            cwd: "/var/www/shrinkix/api", // update to your actual server path

            // ─── Cluster mode: uses all CPU cores ────────────────────────────────
            // Each core gets its own Node.js process → no single process can
            // saturate the CPU. Hostinger KVM VPS typically has 1-2 cores.
            instances: "max",       // "max" = one process per CPU core
            exec_mode: "cluster",   // enable cluster mode

            // ─── Memory / restart limits ──────────────────────────────────────────
            max_memory_restart: "400M", // restart if RAM exceeds 400MB

            // ─── Environment ──────────────────────────────────────────────────────
            env_production: {
                NODE_ENV: "production",
                PORT: 5000,
                // Limit how many simultaneous compression jobs per process.
                // With 2-core cluster (2 processes × 3 jobs) = 6 max concurrent jobs.
                // Each job uses 1 Sharp thread. Total libvips threads = 6 max.
                MAX_CONCURRENT_JOBS: 3,
            },

            // ─── Logging ─────────────────────────────────────────────────────────
            out_file: "./logs/out.log",
            error_file: "./logs/error.log",
            merge_logs: true,
            log_date_format: "YYYY-MM-DD HH:mm:ss",

            // ─── Startup / watchdog ──────────────────────────────────────────────
            watch: false,            // don't watch files in production
            autorestart: true,
            restart_delay: 3000,     // wait 3s before restart on crash
            max_restarts: 10,
            min_uptime: "10s",       // must stay up 10s to count as stable

            // ─── Graceful shutdown ───────────────────────────────────────────────
            kill_timeout: 5000,      // give 5s to finish in-flight requests
            listen_timeout: 8000,    // cluster worker must start within 8s
        }
    ]
};
