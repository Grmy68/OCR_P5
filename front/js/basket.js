function setBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

function getBasket() {
    let basket = localStorage.getItem("basket");
    if(basket == null) {
        return [];
    } else {
        return JSON.parse(basket);
    }
}

function addBasket(product) {
    let basket = getBasket();
    let foundProduct = basket.find(p => p.id == product.id);
    if(foundProduct != undefined){
        foundProduct.quantity++;
    }else{
        product.quantity = 1;
        basket.push(product);
    }
    setBasket(basket);
}

function removeFromBasket(product) {
    let basket = getBasket();
    basket = basket.filter(p => p.id != product.id)
    setBasket(basket);
}

function changeQuantity(product, quantity) {
    let basket = getBasket();
    let foundProduct = basket.find(p => p.id == product.id);
    if(foundProduct != undefined){
        foundProduct.quantity += quantity;
        if (foundProduct.quantity <= 0){
            removeFromBasket(foundProduct);
        }else{
            setBasket(basket);
        }
    }
}

function getNumberProduct() {
    let basket = getBasket();
    let number = 0;
    for(let product of basket) {
        number += product.quantity;
    }
    return number
}

function getTotalPrice() {
    let basket = getBasket();
    let total = 0;
    for(let product of basket) {
        total += product.quantity * product.price;
    }
    return total
}