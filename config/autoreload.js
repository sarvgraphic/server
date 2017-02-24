module.exports.autoreload = {
    active: true,
    usePolling: false,
    dirs: [
        "api/models",
        "api/controllers",
        "api/services",
        "api/policies",
        "api/templates",
        "config"
    ],
    ignored: [
        // Ignore all files with .ts extension
        "**.ts"
    ]
};