const modelLivres = require("../models/modelLivres.js");


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

const liste = async (req, res) => {
    const listeLivre = await modelLivres.listeLivre()
    console.log(listeLivre)
    res.json(listeLivre)

}

const description = async (req, res) => {
    const descriptionLivre = await modelLivres.descriptionLivre(req.params.numlivre)
    if (descriptionLivre == 0) {
        res.status(404).json({ "Erreur": "Le livre n'existe pas" });
    }
    res.json(descriptionLivre)
}

const listepages = async (req, res) => {
    const listePages = await modelLivres.listePages(req.params.numlivre)
    if (listePages == 0) {
        res.status(404).json({ "Erreur": "Le livre n'existe pas" });
    }
    res.json(listePages)
}

const page = async (req, res) => {
    const Page = await modelLivres.listePages(req.params.numlivre)
    if (Page.length == 0) {
        res.status(404).json({ "Erreur": "Le livre n'existe pas" });
    } else {
        const numPage = parseInt(req.params.numpage) - 1
        console.log(Page);
        let page = Page[0].pages[parseInt(numPage)];
        console.log(page);
        if (page == undefined) {
            page = res.status(404).json({ "Erreur": "La page n'existe pas" });
        } else {
            res.json(Page[0].pages[parseInt(numPage)]);
        }
    }
}

const ajout = async (req, res) => {
    const ajoutLivre = await modelLivres.ajoutLivre(req.body)
    const livre = req.body
    const { value, error } = schema.validate(livre)
    if (error == undefined) {
        console.log(ajoutLivre)
        res.send(" Ajout du livre " + livre.titre);
    } else {
        console.log(error)
        res.status(406).json({ "Erreur": error.details })
    }
}

const del=async (req, res) => {
    const numlivre = req.params.numero;
    let deleteLivre = await modelLivres.deleteLivre(numlivre)
    if (deleteLivre) {
        res.send( "Livre supprimé avec succès" );
    } else {
        res.status(404).json({"Erreur":" Aucun livre trouvé pour la suppression"});
    }
}

const modif=async(req,res)=>{
    const numlivre = req.params.numero;
    const body = req.body;
    const { value, error } = schema.validate(body);
    if (error == undefined) {
        const modif = await modelLivres.modifLivre(numlivre, body);
        if (modif.ok == true) {
            res.send( "Modification du livre " + req.body.titre );
        } else {
            res.json({ "Erreur": "Échec de la modification" });
        }
    } else {
        res.status(406).json({ "Erreur": error.details })
    }
}


module.exports = { liste, description, listepages, page, ajout, del,modif }