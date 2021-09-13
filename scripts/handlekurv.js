/* Declare variables  */
const store = new Store()
const title = document.getElementById("aa-items")
const products = document.getElementById("aa-productlist")
let checkoutTotal = document.getElementById("aa-total")

addTitle()
addProduct()
finalTotal()


/** Displays number of items in shopping basket */
function addTitle() {
  //if number of items = 1, display singular form of 'vare'
  //access the function 'getAmountOfProductsInShoppingCart' from nettbutikk_base.js
  store.getAmountOfProductsInShoppingCart() === 1 //shorthand for if...else...
  ? title.innerHTML = `${store.getAmountOfProductsInShoppingCart()} vare i handlekurven` 
  : title.innerHTML = `${store.getAmountOfProductsInShoppingCart()} varer i handlekurven`
}


/** Add duplicate items through button('+') press */
function increase(productID, button) {
  //access the function 'increaseProductAmount' from nettbutikk_base.js
  store.increaseProductAmount(productID)
  let amount = store.getShoppingCartElementById(productID).amount
  updateAmountLabel(amount, button.parentElement.parentElement)
  let decreaseButton = button.parentElement.querySelector('.button-deactivate-wrapper')
  // Increase should always activate button
  activateButton(decreaseButton)
  updateData()
}


/** Remove duplicate items through button ('-') press */
function decrease(productID, button) {
  //access the function 'increaseProductAmount' from netbutikk.base.js
  let amount = store.getShoppingCartElementById(productID).amount
  if (amount - 1 <= 0) {
    if (confirm("Vil du virkelig fjerne produktet fra handlekurven?")) store.decreaseProductAmount(productID)
  } else {
    store.decreaseProductAmount(productID)
  }

  amount --
  // Deactivate button if amount becomes 0
  if (amount <= 1) deactivateButton(button.parentElement)
  else activateButton(button.parentElement)

  updateAmountLabel(amount, button.parentElement.parentElement.parentElement)
  amount === 0 ? updateData(true) : updateData()
}

/** Update product amount label */
function updateAmountLabel(amount, wrapper) {
  let label = wrapper.querySelector('.product-amount-counter')
  console.log(label)
  label.innerHTML = amount
}


/** Add products */
function addProduct() {
  //access 'products' in HTML and remove all items (setting the div box to an empty string).
  products.innerHTML = ""
  //retrieve items from shopping cart and iterate through the array of items.
  store.getShoppingCartArray().forEach((item) => {
    //for each item, create a 'li' element.
    let productLi = document.createElement("li")
    //add a class to each 'li' element.
    productLi.classList.add("aa-hk-produkt-wrapper")
    //set attribute pID = item.product.id
    productLi.setAttribute("pID", item.product.id)

    let amount = item.amount
    //items are dynamically displayed
    productLi.innerHTML = `
    <h3>${item.product.name}</h3>
    <div class="ab-product-image-wrapper">
        <img src= "${item.product.img.med}" data-src= "${item.product.img.med}" class="ab-product-image" alt="produktbilde">
    </div>
    <h4>${item.product.price},-</h4>
    <div> 
      <div class="button-deactivate-wrapper inline">
        <button class="button accent round ${(amount <= 1) ? 'deactivated' : ''} aa-hk" onclick="decrease(${item.product.id}, this)"></button>
      </div>
      <span class="product-amount-counter"> ${amount} </span>
      <button class="button accent round" onclick="increase(${item.product.id}, this)">+</button>
    </div>
    `
    // append items to product grid
    products.append(productLi)
  })
}

/** Calculates price and displays total in sticky container */
function finalTotal() {
  let total = store.getTotalShoppingCartPrice()
  checkoutTotal.innerHTML = `${total},- inkl. moms`
}


/** Updates checkout total and # of items in basket */
function updateData(updateList = false) {
  finalTotal()
  addTitle()
  if (updateList) addProduct()
  checkCheckoutButton()
}
const checkoutBtnWrapper = document.querySelector("#checkoutBtn-wrapper")
checkCheckoutButton()

/**
 * Checks wether to activate og deactivate checkout button.
 */
function checkCheckoutButton() {
  console.log(store.getAmountOfProductsInShoppingCart())
  if (store.getAmountOfProductsInShoppingCart() === 0) deactivateButton(checkoutBtnWrapper)
  else activateButton(checkoutBtnWrapper)
}

/** Deactivates a button */
function deactivateButton(buttonWrapper) {
  let button = buttonWrapper.querySelector('.button')
  let overlay = buttonWrapper.querySelector('.button-blocking')
  button.classList.add('deactivated')
  if (overlay) overlay.style.display = 'block'
}

/** Activates a button */
function activateButton(buttonWrapper) {
  let button = buttonWrapper.querySelector('.button')
  let overlay = buttonWrapper.querySelector('.button-blocking')
  button.classList.remove('deactivated')
  if (overlay) overlay.style.display = 'none'
}