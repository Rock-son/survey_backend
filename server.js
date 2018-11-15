"use strict";

const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");
const favicon = require('serve-favicon');
// DB
const db = require("./public/db_helper");
// EXPRESS LIMITER
const RateLimiter = require("express-rate-limit");
// SECURITY
const helmet = require("helmet");

const port = process.env.PORT || 3000;
const app = express();

// APP
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// STATIC
app.use(serveStatic(path.join(__dirname, "public")));

// FAVICON
app.use(favicon(path.join(__dirname, 'public/', 'favicon.ico')));
// BODY PARSERS
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));
// SECURITY
// helmet(app);
app.disable("x-powered-by");
// LIMITER
//app.use(RateLimiter);


app.post("/api/push-data/:token", (req, res) => {
	const token = req.params.token;
	if (token === "23.11.1948") {
		return db.writeToDb(req).then(resp => {
			res.render("index.pug", { error: "", classic: resp.types["Klasično"], macek: resp.types["Maček"], kmecko: resp.types["Kmečko"], lovsko: resp.types["Lovsko"], sestavljeno: resp.types["Sestavljeno"]} );
		})
		.catch(err => res.render("index.pug", { error: err, classic: 1, macek: 1, kmecko: 1, lovsko: 1, sestavljeno: 1 } ));
	}
	res.send({ error: "Not a valid token!"});
})

app.delete("/api/delete/:token", (req, res) => {
	const token = req.params.token;
	if (token === "23.11.1948") {
		return db.resetData()
			.then(resp => res.send({ success: "All data deleted!"}))
			.catch(err => res.send({"error": err }))
	}
	res.send({ error: "Not a valid token!"});
})

app.post("/api/get-data/:token", (req, res) => {
	const token = req.params.token;

	if (token === "23.11.1948") {
		return db.getAllData().then(resp => {
			return res.render("index.pug", { error: "", classic: resp.types["Klasično"], macek: resp.types["Maček"], kmecko: resp.types["Kmečko"], lovsko: resp.types["Lovsko"], sestavljeno: resp.types["Sestavljeno"]} );
		})
		.catch(err => res.render("index.pug", { error: err, classic: 1, macek: 1, kmecko: 1, lovsko: 1, sestavljeno: 1 } ));
	}
	res.send({ error: "Not a valid token!"});
})


app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

// SERVER
http.createServer(app)
	.listen(port, () => console.log(`Listening on port: ${port}`));

module.exports.app = app;
