const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');

const app = express();
const port = 9001;

// Set up parsers
app.use(bodyParser.json());
app.use(bearerToken());

// Set up route handlers
const routeFiles = fs.readdirSync(path.join(__dirname, 'routes'));
for (let i = 0; i < routeFiles.length; i += 1) {
  const current = path.parse(routeFiles[i]);
  if (current.ext === '.js') {
    app.use(`/${current.name}`, require(`./routes/${current.name}`));
  }
}

// Serve front end
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(port, () => {
  console.log(`Health API Retriever listening at http://localhost:${port}`);
});
