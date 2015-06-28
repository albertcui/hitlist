var defaults = {
    "DATA_BASE_URL": ""
    "STEAM_API_KEY": "", //for API reqs, in worker
    "ROOT_URL": "http://localhost:5000"
};

//nf puts values in .env into process.env
//ensure that process.env has all values in defaults, but prefer the process.env value
for (var key in defaults) {
    process.env[key] = process.env[key] || defaults[key];
}
//now processes can use either process.env or config
module.exports = process.env;