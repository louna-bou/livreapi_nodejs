console.log("Hello CodeSandbox");

// -- utilisation du module Express
const express = require("express"); // -- création d'une application
const app = express();
app.use(express.json());

const{routerLivres}=require("./app/router/routerLivres.js");
app.use(routerLivres)

app.listen(8080, () => {
    console.log("Server started");
});
