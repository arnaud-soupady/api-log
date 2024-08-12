const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Fonction pour formater la date et l'heure
function getFormattedDate() {
  const date = new Date();
  return `${date.toISOString().replace(/T/, " ").replace(/\..+/, "")}`;
}

// Création d'un flux d'écriture pour les logs
const logFilePath = path.join(__dirname, "server.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Middleware pour loguer les informations de la requête
app.use((req, res, next) => {
  const logInfo = `
    [${getFormattedDate()}] Request Method: ${req.method}
    [${getFormattedDate()}] Request URL: ${req.url}
    [${getFormattedDate()}] Request Headers: ${JSON.stringify(req.headers)}
    [${getFormattedDate()}] Query Params: ${JSON.stringify(req.query)}
    [${getFormattedDate()}] Body: ${JSON.stringify(req.body)}
    [${getFormattedDate()}] Remote Address: ${req.ip}
    `;

  console.log(logInfo);
  logStream.write(logInfo + "\n");

  next();
});

// Route /ping qui retourne pong
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

// Démarrage du serveur sur le port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`[${getFormattedDate()}] Server is running on port ${PORT}`);
  logStream.write(
    `[${getFormattedDate()}] Server is running on port ${PORT}\n`
  );
});
