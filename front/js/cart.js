async function searchItems() {
    return fetch("http://localhost:3000/api/products") //URL de l'API
        .then(res => res.json()) //Obtention des reponses .json
        .then(data => data) //Conversion des reponses .json en donnees data
        .catch(function (error){window.alert("Une erreur s'est produite ! Merci de réessayer plus tard")}); //Message d'alerte en cas de panne de l'API
    }

// Fonction get pour récupérer les objets présents dans le localStorage
function getBasket() {
    let basket = localStorage.getItem("basket");
    // Si un objet null est envoyé au localStorage alors il retourne un tableau vide
    if (basket == null) {
        return [];
    } else {
        // Sinon il retourne les données en parse au paramètre basket
        return JSON.parse(basket);
    }
}




//Fonction "main" pour appeler mes fonctions API et DOM
async function main() {
    await searchItems();
    getBasket();
    }
    
    //Appel de la fonction "main"
    main();
    