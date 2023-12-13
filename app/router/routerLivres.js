const express = require("express");
const routerLivres = express.Router();

const controllerLivre = require("../controller/controllerLivre.js");

routerLivres.get("/livres", controllerLivre.liste);

routerLivres.get("/livres/:numlivre",controllerLivre.description)

routerLivres.get("/livres/:numlivre/pages",controllerLivre.listepages)

routerLivres.get("/livres/:numlivre/pages/:numpage",controllerLivre.page)

routerLivres.post("/livres",controllerLivre.ajout)

routerLivres.delete("/livres/:numlivre",controllerLivre.del)

routerLivres.put("/livres/:numlivre",controllerLivre.modif)

module.exports={routerLivres}