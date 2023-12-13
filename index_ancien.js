console.log("Hello CodeSandbox");

// -- utilisation du module Express
const express = require("express"); // -- création d'une application
const app = express();
app.use(express.json());

// utilisation du module et tentative de connexion
const nano = require('nano')('http://louna:Mcblbou81120*@127.0.0.1:5984');


// choix d’une base de données
const dbLivres = nano.db.use('livres');



const Joi = require('joi').extend(require('@joi/date'));
const schema = Joi.object({

    _id: Joi.string(),
    _rev: Joi.string(),
    titre: Joi.string()
        .min(3)
        .max(30)
        .required(),
    numero: Joi.number()
        .integer()
        .min(1)
        .required(),
    resume: Joi.string()
        .min(3)
        .required(),
    pages: Joi.array()
        .items(Joi.string()),
    auteur: Joi.string()
        .min(3)
        .max(30)
        .required(),
    date: Joi.date()
        .format("DD/MM/YYYY"),
    nombrePages: Joi.number()
        .integer()
        .min(1),
    isbn: Joi.number()
        .integer()
        .min(1),



})




// route qui affiche l'API
app.get("/", (req, res) => {
    res.send("API de gestion des livres");
});


// route /livres qui affiche « liste des livres »
app.get("/livres", async (req, res) => {
    const query = {
        "selector": {},
        "fields": ["titre", "resume", "auteur"]
    }
    let biblio = await dbLivres.find(query)
    //res.send("Liste des livres");
    res.json(biblio.docs);
});


// route /livres/:numlivre qui affiche « le livre numéro 53 »
app.get("/livres/:numlivre", async (req, res) => {
    //res.send("Le livre numéro " + req.params.numlivre);
    const query = {
        "selector": { "numero": parseInt(req.params.numlivre) },
        "fields": ["titre", "resume", "auteur"]
    }
    let biblio = await dbLivres.find(query)
    console.log(biblio)
    // var result = biblio.find((l) => l.numero == req.params.numlivre);
    if (biblio.docs.length == 0) {
        //biblio = "Le livre n'existe pas";
        biblio = res.status(404).json({ "Erreur": "Le livre n'existe pas" });
    }
    res.json(biblio.docs);
});

// route /livres/:numlivre/pages qui affiche « liste des pages du livre 53 »
app.get("/livres/:numlivre/pages", async (req, res) => {
    const query = {
        "selector": { "numero": parseInt(req.params.numlivre) },
        "fields": ["pages"]
    }
    let biblio = await dbLivres.find(query)
    if (biblio.docs.length == 0) {
        //biblio = "Le livre n'existe pas";
        biblio = res.status(404).json({ "Erreur": "Le livre n'existe pas" });
    }
    //res.send("Liste des pages du livre " + req.params.numlivre);
    //var result = biblio.find((l) => l.numero == req.params.numlivre);
    res.json(biblio.docs);
});


// route /livres/:numlivre/pages/:numpage qui affiche « page 119 du livre 53 »
app.get("/livres/:numlivre/pages/:numpage", async (req, res) => {
    //res.send("Page " + req.params.numpage + " du livre " + req.params.numlivre);
    const query = {
        "selector": { "numero": parseInt(req.params.numlivre) },
        "fields": ["pages"]
    }
    let biblio = await dbLivres.find(query)
    console.log(biblio)
    if (biblio.docs.length == 0) {
        //biblio = "Le livre n'existe pas";
        biblio = res.status(404).json({ "Erreur": "Le livre n'existe pas" });
    } else {
        const numPage = parseInt(req.params.numpage) - 1

        console.log(biblio.docs);
        let page = biblio.docs[0].pages[parseInt(numPage)];
        console.log(page);
        if (page == undefined) {
            page = res.status(404).json({ "Erreur": "La page n'existe pas" });
        } else {
            res.json(biblio.docs[0].pages[parseInt(numPage)]);
        }
    }
});


// route /livres qui affiche « ajout d’un livre »
app.post("/livres", async (req, res) => {
     // res.send("ajout d’un livre ");
    console.log(req.body);
    const livre = req.body

    const { value, error } = schema.validate(livre)
    if (error == undefined) {
        let newlivre = await dbLivres.insert(livre)
        console.log(newlivre)
        res.send(" Ajout du livre " + livre.titre);
    }
    else {
        console.log(error)
        res.status(406).json({ "Erreur": error.details })
    }
});

// route /livres/:numlivre qui affiche « suppression du livre 53 »
app.delete("/livres/:numlivre", async (req, res) => {
    const query = {
        "selector": { "numero": parseInt(req.params.numlivre) },
        "fields": []
    }
    let biblio = await dbLivres.find(query)
    if (biblio.docs.length == 0) {
        //biblio = "Le livre n'existe pas";
        biblio = res.status(404).json({ "Erreur": "Le livre n'existe pas" });
    } else {
    // let result = biblio.findIndex((l) => l.numero == req.params.numlivre);
    // console.log(result)
    console.log(biblio)
    let supprlivre = await dbLivres.destroy(biblio.docs[0]._id, biblio.docs[0]._rev)
    console.log(supprlivre)
    res.send(" suppression du livre numéro" + req.params.numlivre + " ("+biblio.docs[0].titre+")")

    // if (result != -1) {
    //     biblio.splice(result, 1)
    //     res.send(" suppression du livre " + req.params.numlivre);
    // }
    // else {
    //     res.send(" le livre " + req.params.numlivre + "n'existe pas");
    // }
}});

// route /livres qui affiche « modification d'un livre »
app.put("/livres/:numlivre", async (req, res) => {
    const query = {
        "selector": { "numero": parseInt(req.params.numlivre) },
        "fields": []
    }
    let biblio = await dbLivres.find(query)
    if (biblio.docs.length == 0) {
        //biblio = "Le livre n'existe pas";
        biblio = res.status(404).json({ "Erreur": "Le livre n'existe pas" });
    } else {
    console.log(req.body);
    const livre = req.body
    const modiflivre = {
        _id: biblio.docs[0]._id,
        _rev: biblio.docs[0]._rev,
        //...livre
        "titre": livre.titre,
        "numero": livre.numero,
        "resume": livre.resume,
        "pages": livre.pages,
        "auteur": livre.auteur,
        "date": livre.date,
        "nombrePages": livre.nombrePages,
        "isbn": livre.isbn
    }
    const { value, error } = schema.validate(modiflivre)
    if (error == undefined) {
        let newlivre = await dbLivres.insert(modiflivre)
        console.log(newlivre)
        res.send(" Modification du livre " + livre.numero);
    }
    else {
        console.log(error)
        res.status(406).json({ "Erreur": error.details })

    }}
    // let result = biblio.find((l) => l.numero == req.body.numero);
    // console.log(result);
    // if (result==undefined){
    //     res.send("Vous ne pouvez pas modifier ce livre, car il n'existe pas");
    // }else{
    //     console.log(result);
    //     result.numero = req.body.numero,
    //     result.titre =req.body.titre,
    //     result.pages= req.body.pages,


    // res.send(" Modification du livre " + req.body.numero);

});

// //
// //
// // la liste des livres
// let biblio = [
//     {
//         numero: 10,
//         titre: "Je ne laisse pas mon pc ouvert pendant la pause",
//         pages: [
//             "Il existe des individus mal intentionnés",
//             "qui pourraient faire des dingueries",
//         ],
//     },
//     {
//         numero: 11,
//         titre: "candide ou l'optimisme",
//         pages: [
//             "Comment Candide fut élevé dans un château, et comment il fut chassé d’icelui.",
//             "Ce que devint Candide parmi les Bulgares",
//         ],
//     },
// ];
//
//
//
// lancement du serveur web qui écoute sur le port 8080
app.listen(8080, () => {
    console.log("Server started");
});
