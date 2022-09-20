async function searchItems() {
  return fetch("http://localhost:3000/api/products") //URL de l'API
    .then(res => res.json()) //Obtention des reponses .json
    .then(data => data) //Conversion des reponses .json en donnees data
    .catch(function (error) { window.alert("Une erreur s'est produite ! Merci de réessayer plus tard") }); //Message d'alerte en cas de panne de l'API
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

function displayProducts(products, basketToShow) {
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


// Changement de quantité depuis le panier
function listenQttEvent() {
  const changeQttBasket = document.getElementsByName("itemQuantity");

  for (let inputQtt of changeQttBasket) {
    inputQtt.addEventListener("change", function (e) {
      const parent = e.target.closest("article");
      const dataId = parent.dataset.id;
      const dataColor = parent.dataset.color;
      const valueQtt = parseInt(e.target.value);

      changeQttEvent(dataId, dataColor, valueQtt);
    })
  }
}



function changeQttEvent(id, color, quantity) {
  let showBasket = getBasket();
  for (let i in showBasket) {

    if (showBasket[i].id === id && showBasket[i].colors === color) {
      showBasket[i].quantity = quantity;
      setBasket(showBasket);
      location.reload();
    }
  }
}

/////////// Supprimer un article depuis le panier ///////////
// Evenement déclencheur pour suppression 
function listenDelEvent() {
  const delItem = document.querySelectorAll(".deleteItem");

  for (let btnDel of delItem) {
    // Evenement au click
    btnDel.addEventListener("click", function (e) {
      // chargement parent et dataset liés
      const parent = e.target.closest("article");
      const dataId = parent.dataset.id;
      const dataColor = parent.dataset.color;
      // confirmation avant lancement de la fonction de suppression
      if (window.confirm("Souhaitez vous supprimer cet article ?"))
        delItemEvent(dataId, dataColor);
    })
  }
}

// Fonction de suppression
function delItemEvent(id, color) {
  let showBasket = getBasket();

  for (let i in showBasket) {
    //Boucle de comparaison id et color
    if (showBasket[i].id === id && showBasket[i].colors === color) {
      showBasket.splice(i, 1)
      setBasket(showBasket);
      location.reload();
    }
  }
}

///////////// Affichage total articles ///////////
function calculTotalQtt() {
  let showBasket = getBasket();
  let nullArticles = 0;
  for (let i in showBasket) {
    const articlesQtt = showBasket[i].quantity;
    nullArticles += articlesQtt;
  }
  return nullArticles;

}

async function displayTotalQtt() {
  const spanQtt = document.getElementById("totalQuantity");
  transfertQtt = calculTotalQtt();
  spanQtt.textContent = calculTotalQtt();
}

/////////// Affichage prix total ///////////
async function calculTotalPrice() {
  let api = await searchItems();
  let showBasket = getBasket();
  let nullPrice = 0;
  for (let i in showBasket) {
    for (let j in api) {
      const price = api[j].price;
      const id = api[j]._id;

      if (id === showBasket[i].id) {
        nullPrice += showBasket[i].quantity * price;
      }
    }
  }
  return nullPrice;
}

async function displayTotalPrice() {
  const spanPrice = document.getElementById("totalPrice");
  transfertPrice = await calculTotalPrice();
  spanPrice.textContent = await calculTotalPrice();
}

/////////// set vers LocalStorage avec les nouvelles infos ///////////
function setBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}


/////////// Formulaire de commande ///////////
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

const order = document.getElementById("order");

// Regex
const firstNameRegex = /^[A-Z a-zé]{3,15}[-]?[A-Z a-zé]{0,10}$/;
const lastNameRegex = /^[A-Z ]{3,15}[-]?[A-Z ]{0,10}$/;
const addressRegex = /^[0-9]{1,3},[a-zA-Z0-9\s\,\''\-]*$/;
const cityRegex = /^[A-Z a-zéèàôâ]{3,15}[-]?[A-Z a-zéèàôâ]{0,10}[-]?[A-Z a-zéèàôâ]{0,10}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

let correct = {
  firstName: false,
  lastName: false,
  address: false,
  city: false,
  email: false,

}

function formValidation() {
  firstName.addEventListener("input", function (e) {
    let inputValid = firstNameRegex.test(e.target.value);
    if (inputValid === false) {
      firstNameErrorMsg.innerHTML = "Entre 3 et 25 caractères, sans chiffres ni symboles.";
      correct.firstName = false;
    } else {
      correct.firstName = true;
      firstNameErrorMsg.innerHTML = "";
    }
  });

  lastName.addEventListener("input", function (e) {
    let inputValid = lastNameRegex.test(e.target.value);
    if (inputValid === false) {
      lastNameErrorMsg.innerHTML = "Majuscules entre 3 et 25 caractères, sans chiffres ni symboles.";
      correct.lastName = false;
    } else {
      correct.lastName = true;
      lastNameErrorMsg.innerHTML = "";
    }
  });

  address.addEventListener("input", function (e) {
    let inputValid = addressRegex.test(e.target.value);
    if (inputValid === false) {
      addressErrorMsg.innerHTML = "Indiquer une adresse valide, exemple: 3, rue des mouettes";
      correct.address = false;
    } else {
      correct.address = true;
      addressErrorMsg.innerHTML = "";
    }
  });

  city.addEventListener("input", function (e) {
    let inputValid = cityRegex.test(e.target.value);
    if (inputValid === false) {
      cityErrorMsg.innerHTML = "Indiquer une ville valide, exemple: Plombières-les-bains";
      correct.city = false;
    } else {
      correct.city = true;
      cityErrorMsg.innerHTML = "";
    }
  });

  email.addEventListener("input", function (e) {
    let inputValid = emailRegex.test(e.target.value);
    if (inputValid === false) {
      emailErrorMsg.innerHTML = "Indiquer une adresse Email valide, exemple: client@kanap.com";
      correct.address = false;
    } else {
      correct.email = true;
      emailErrorMsg.innerHTML = "";
    }
  });
}

// Envoyer le formulaire




//Fonction "main" pour appeler mes fonctions API DOM & Evenements
async function main() {
  await mergeApiLocal();
  listenQttEvent();
  listenDelEvent();
  await displayTotalQtt();
  await displayTotalPrice();
  formValidation();
}

//Appel de la fonction "main" principale
main();