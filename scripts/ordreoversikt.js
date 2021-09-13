const store = new Store()
const deliveryMethods = document.querySelectorAll("[name=delivery]")
const products = document.getElementById("db-produkt-wrapper")
let paymentMethodDivs


/* Delivery methods */

/**
 * Listening to the clicking of radio buttons. Also works when clicking the whole frame, not only the button itself.
 */
deliveryMethods.forEach((radio) => {
    radio.addEventListener("click", () => deliveryMethodChanged(radio))
    radio.parentElement.addEventListener("click", () => deliveryMethodChanged(radio))
})

/**
 * Checking the radio buttion.
 */
function deliveryMethodChanged(clickedRadio) {
    clickedRadio.checked = !clickedRadio.checked
    ensureOneDeliveryMethodChecked(clickedRadio)
}

/**
 * Ensuring that only one radio button can be checked at the same time.
 */
function ensureOneDeliveryMethodChecked(clickedRadio) {
    var oneMethodChecked = false
    deliveryMethods.forEach((method) => {
        if (method.checked) oneMethodChecked = true
    })
    if (!oneMethodChecked) clickedRadio.checked = true
}

/* Update shipping price in order summary */
const mailbox = document.getElementById("db-postkasse")
const postoffice = document.getElementById("db-postkontor")

/**
 * When clicking on the radio button, it updates the price in the order summary.
 */
mailbox.addEventListener("click", () => updateShippingPriceInOrderSummary(49))
postoffice.addEventListener("click", () => updateShippingPriceInOrderSummary(0))

/**
 * Updating the price in order summary.
 */
function updateShippingPriceInOrderSummary(price) {
    form.delivery.value = price
    updatePrice()
}


/* Payment methods */

/**
 * List of different payment methods.
 */
const paymentMethods = [
    { value: 'kort', title: 'Kort', method: 'NETS', checked: true },
    { value: 'paypal', title: 'PayPal', method: 'PayPal' },
    { value: 'klarna', title: 'Klarna', method: 'Klarna' },
    { value: 'vipps', title: 'Vipps', method: 'Vipps' }
]

function initializePaymentMethods() {
    const paymentMethodsWrapper = document.getElementById('db-payment-methods-wrapper')

    /**
     * Looping through each payment method in list. For each one, replace value, title and method with the belonging one in the list.
     */
    paymentMethods.forEach((paymentMethod) => {
        let paymentMethodDiv = document.createElement("div")
        paymentMethodDiv.innerHTML = `<div>
        <div id="db-${paymentMethod.value}">
            <input type="radio" name="payment" value="${paymentMethod.value}">${paymentMethod.title}
        </div>
        <div class="db-redirect-page hide">
            <img src="img/Redirect.svg" alt="redirect"><p>
            Etter å ha klikket "Fullfør bestilling", blir du omdirigert til ${paymentMethod.method} for å fullføre kjøpet ditt på en sikker måte.
            </p>
        </div></div>
        `
        paymentMethodDiv.querySelector("[name=payment]").checked = paymentMethod.checked

        paymentMethodsWrapper.appendChild(paymentMethodDiv)
    })

    /**
     * Listening to the clicking of radio buttons. Also works when clicking the whole frame, not only the button itself.
     */
    paymentMethodDivs = document.querySelectorAll("[name=payment]")
    paymentMethodDivs.forEach((radio) => {
        radio.addEventListener("click", () => paymentMethodChanged(radio))
        radio.parentElement.addEventListener("click", () =>  paymentMethodChanged(radio))
    })
}
initializePaymentMethods()


/**
 * Calling functions.
 */
function paymentMethodChanged(radio) {
    hideAllPaymentMethods()
    togglePaymentMethod(radio)
    ensureOnePaymentMethodChecked(radio)
}

/**
 * Function for hiding the redirect image.
 */
function hideAllPaymentMethods() {
    paymentMethodDivs.forEach((radio) => radio.parentElement.parentElement.lastElementChild.classList.add("hide"))
}

/**
 * The radio button that is checked shows an image about redirecting, while the image of the other radio buttons are hidden.
 */
function togglePaymentMethod(clickedRadio) {
    clickedRadio.checked = !clickedRadio.checked
    if (clickedRadio.checked) {
        clickedRadio.parentElement.parentElement.lastElementChild.classList.remove("hide")
    } else {
        clickedRadio.parentElement.parentElement.lastElementChild.classList.add("hide")
    }
}

/**
 * Ensuring that one payment method is checked.
 */
function ensureOnePaymentMethodChecked(clickedRadio) {
    let oneMethodChecked = false
    paymentMethodDivs.forEach((method) => {
        if (method.checked) oneMethodChecked = true
    })
    if (!oneMethodChecked) togglePaymentMethod(clickedRadio)
}


/* Form submitting */
function submitForm() {
    alert('Bestilling gjennomført. Takker også for din donasjon på 1 million kroner til hjelpeorganisasjonen Planter i nød.')
}


/* Order summary */

/**
 * Getting data from store: product name, item amount and price.
 */
function orderSummary() {
    store.shoppingCart.forEach((item) => {
        let product = item.product
        let productDiv = document.createElement("div")
        productDiv.classList.add("db-produkt-flex-child")
        productDiv.setAttribute("pID", product.id)
        productDiv.innerHTML = `
        <div class="db-produkt-left-flex-child">
            <img src="${product.img.small}" alt="${product.name}">
            <div class="truncate-wrapper">
                <div class="truncate">${product.name}</div>
                <div class="db-antall">Antall: ${item.amount}</div>
            </div>
            <div class="db-flex-child-align-right">${product.price},-</div>
        </div>
        `

        products.append(productDiv)
    })
}

orderSummary()

/**
 * Updating price in order summary.
 */
function updatePrice() {
    let shipping = parseFloat(form.delivery.value) + ",-"
    let productsSum = parseFloat(store.getTotalShoppingCartPrice()) + ",-"
    let total = parseFloat(shipping) + parseFloat(productsSum) + ",-"

    /* Update HTML */
    form.productsSum.value = productsSum
    form.shipping.value = shipping
    form.total.value = total
}

updatePrice()