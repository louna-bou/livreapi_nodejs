// utilisation du module et tentative de connexion
const nano = require('nano')('http://louna:Mcblbou81120*@127.0.0.1:5984');

// choix d’une base de données
let dbLivres = nano.db.use('livres');

const listeLivre = async () => {
    const query = {
        "selector": {},
        "fields": ["titre", "resume", "auteur"]
    }
    let biblio = await dbLivres.find(query)
    console.log(biblio)
    return biblio.docs
}


const descriptionLivre = async (numlivre) => {
    const query = {
        "selector": { "numero": parseInt(numlivre) },
        "fields": ["titre", "resume", "auteur"]
    }
    let biblio = await dbLivres.find(query)
    console.log(biblio)
    return biblio.docs
}

const listePages = async (numlivre) => {
    const query = {
        "selector": { "numero": parseInt(numlivre) },
        "fields": ["pages"]
    }
    let biblio = await dbLivres.find(query)
    console.log(biblio)
    return biblio.docs
}


const ajoutLivre=async(body)=>{
    const livre = body
    let newlivre = await dbLivres.insert(livre)
       console.log(newlivre)
       return newlivre
    
}

const deleteLivre= async(numlivre)=>{
     const query = {
        "selector": { "numero": parseInt(numlivre) },
        "fields": []
    }
    let biblio = await dbLivres.find(query)
    if (biblio.docs.length != 0) {
        return await dbLivres.destroy(biblio.docs[0]._id, biblio.docs[0]._rev);
    }
    return biblio;
}

const modifLivre=async(numlivre,body)=>{
    const query = {
        "selector": { "numero": parseInt(numlivre) },
        "fields": ["_id", "_rev"]
    }
    let biblio = await dbLivres.find(query)
    console.log(biblio)
    const livre = body
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
    let newlivre = await dbLivres.insert(modiflivre)
    return newlivre

}

module.exports = { listeLivre, descriptionLivre, listePages,ajoutLivre,deleteLivre,modifLivre}