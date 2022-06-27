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

async function mergeApiLocal() {
    const products = await searchItems();
    
    for (basketToShow of getBasket()) {
        const product = products.filter(p => p._id === basketToShow.id);
        displayProducts(product[0], basketToShow);
    }
return
}

function displayProducts (products, basketToShow) {
    const element = document.getElementById("cart__items");
    let basketArticle = document.createElement("article");
    basketArticle.classList.add("cart__item");
    basketArticle.dataset.id = basketToShow.id;
    basketArticle.dataset.color = basketToShow.colors;

    basketArticle.innerHTML = `<div class="cart__item__img">
    <img src=${products.imageUrl} alt=${products.altTxt}>
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${products.name}</h2>
      <p>${basketToShow.colors}</p>
      <p>${products.price}€</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${basketToShow.quantity}>
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>`
  element.appendChild(basketArticle);
}

function listenQttEvent() {
  const changeQttBasket = document.querySelectorAll(".itemQuantity");

  for(let inputQtt of changeQttBasket) {
    inputQtt.addEventListener("change", function(e) {
      const parent = e.target.closest("article");
      const dataId = parent.dataset.id;
      const dataColor = parent.dataset.color;
      const valueQtt = parseInt(e.target.value);

      changeQttEvent(dataId, dataColor, valueQtt);
      console.log(dataId, dataColor, valueQtt);
    }) 
  }
};

function changeQttEvent(id, color, quantity) {
  let showBasket = getBasket();
  console.log(showBasket);
  console.log(id, color, quantity);
  for(let i in showBasket) {
    
    if(showBasket[i].id === id && showBasket[i].colors === color) {
      showBasket[i].quantity = quantity;
      console.log("ici", showBasket);
      setBasket(basket);
      location.reload();
    }
  }  
}

function setBasket() {
  localStorage.setItem("basket", JSON.stringify(basket));
  console.log(basket);
}




//Fonction "main" pour appeler mes fonctions API et DOM
async function main() {
    await mergeApiLocal();
    listenQttEvent();
}
    
//Appel de la fonction "main"
    main();
    