const { Schema, model } = require("mongoose");

const şema = Schema({
	guildID: { type: String, default: "" },
	userID: { type: String, default: "" },
	roles: { type: Array, default: [] }
});

module.exports = model("userRoles", şema);