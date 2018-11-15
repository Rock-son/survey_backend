"use strict";

const fs = require("fs");

exports.writeToDb = function(req) {
	return new Promise(function(resolve, reject) {

		fs.readFile("./db/db.json", 'utf8', function(err, contents) {
			if (err) { return reject(err); }

			const lunches = JSON.parse(contents);
			const lunchType = req.body.lunch || "";
			const ip = getIp(req);

			if (lunches.ip.indexOf(ip) > -1 ) {
				return reject("A vote has already been cast from your IP!");
			}
			lunches.types[lunchType] += 1;
			lunches.ip.push(ip);
			fs.writeFile("./db/db.json", JSON.stringify(lunches), function (err) {
				if (err) { return reject(err); }
					return resolve(lunches);
			  });
		});
	});
};

exports.getAllData = function() {

	return new Promise(function(resolve, reject) {
		try {
			const contents = fs.readFileSync("./db/db.json", 'utf8');
			return resolve(JSON.parse(contents));
		} catch (error) {
			return reject(error);
		}
	});
}

exports.resetData = function() {

	return new Promise(function(resolve, reject) {
		const lunches = JSON.stringify({ types: {"Klasično":0,"Kmečko":0,"Lovsko":0,"Maček":0, "Sestavljeno": 0}, ip: []});

		fs.writeFile("./db/db.json", JSON.stringify(lunches), function (err) {
			if (err) { return reject(err); }
				return resolve(lunches);
		});
	});
}

function getIp(req) {
	return (req.headers['x-forwarded-for'] || "").split(',').pop() || req.connection.remoteAddress ||
    req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
};