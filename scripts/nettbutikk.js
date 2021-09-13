// Create a new store-object
const store = new Store()

//The functions below send information from the webpage to this variable, to decide filtering of products
const filterObject = {
  sortBy: 'D0',
  category: null,
  priceRange : {
    min : null,
    max : null
  }
}

sliderInit()

updateList()

//Filtrering

/**
 * filterObject.category is updated based on what category you check on the store page
 */
function filterList(btn) {
  filterObject.category = (btn.id === "all") ? null : btn.id
  console.log(filterObject)

  updateList()
}

//filterObject.sortBy is updated based on how you decide to sort the items on the store page
function sortList(btn)  {
  filterObject.sortBy = btn.getAttribute("data-sortBy")

  const dropdown  = document.getElementsByClassName("ab-dropdown-valg")
  for (var i = 0; i < dropdown.length; i++) {
    dropdown[i].style.background = "var(--c-hvit)"
  }
  btn.style.background = "var(--c-lysebrun)"

  const dropdownButton = document.getElementById("ab-dropdown-button")
  dropdownButton.innerHTML =` ${btn.innerHTML} <i class="ab-arrow"></i> `
  updateList()
}


//filterObject.priceRange.min is updated based on the lower price-slider on the store page
function filterPriceMin(btn) {
  const maxUpdate = document.getElementById("two")
  filterObject.priceRange.min = btn.value
  filterObject.priceRange.max = maxUpdate.value
  updateList()
}

//filterObject.priceRange.max is updated based on the upper price-slider on the store page
function filterPriceMax(btn) {
  const minUpdate = document.getElementById("one")
  filterObject.priceRange.max = btn.value
  filterObject.priceRange.min = minUpdate.value
  updateList()
}

/** 
* This function is placed in the filtering functions to update what products are showing and how, based on filterObject. Deletes all products then replaces
* based on your filtering choices.
*/
function updateList() {
  const products = document.getElementById("ab-produkter")
  products.innerHTML = ""

  newList = store.getProductArray(filterObject)


  if (newList.length == 0 || products.style.display == "block") {
    const ul = document.getElementById("ab-produkter")
    ul.innerHTML = `
    <li id= "ab-ingen-treff">Ingen produkter matcher søket ditt</li>
    `
  } else{
    addProduct(newList)
  }
  
}

/**
 * Loads all products to the page based on the list you get from updateList() (Or just loads all products when you first enter the page)
 */
function addProduct(list) {
  const produktListe = document.getElementById("ab-produkter")
  const products = list
  products.forEach((item) => {
  
    // product-frame
    let li = document.createElement("li")
    li.classList.add("ab-produkt")

    let img = item.img.med
    if (list.length <= 6) {
      img = item.img.max
    }
    li.innerHTML = `
    <div class="ab-product-content-wrapper" onclick="openModal(${item.id})" data-pID="${item.id}">
      <div class="ab-product-image-wrapper">
        <img src="" data-src="${img}" alt="Produktbilde" class="ab-product-image">
      </div>
      <h3 class="truncate">${item.name}</h3>
      <p>på lager: ${item.stock} stk</p>
        <p class="ab-produkt-pris">${item.price},-</p>
    </div>
    <button class="button ab-produkt-button" onclick="buyMore(${item.id})">Kjøp</button>
    `
    
    produktListe.appendChild(li) 
  })
  initLazy()
}

//Adds products to your cart. This is set to onclick on all buy buttons
function addToCart(item) {
  store.addProductToCart(item)
}

//When you click the buy button, this popup appears to let you know you added a product.
function buyMore(id) {
  store.addProductToCartById(id)
  
  let product = store.getProductById(id)

  const Modal = document.getElementById("handle-videre-wrapper")

  Modal.innerHTML = `
  <div id="handle-videre">
    <div id="handle-videre-tekst">
      <p>${product.name} er lagt til i handlekurven.</p>
    </div>
    <div id="handle-videre-buttons">
      <button class="button ab-prod-info-kjøp" id="fortsett-a-handle">Fortsett å handle</button>
      <button class="button ab-prod-info-kjøp" id="ga-handlekurv">Gå til handlekurv</button>
    </div>
  </div>
  `

  const prodInfoModal = document.getElementById("prod-info-wrapper")
  prodInfoModal.style.display = "none"

  Modal.style.display = "flex"

  const closeButton = document.getElementById("fortsett-a-handle")
  const goToCart = document.getElementById("ga-handlekurv")
  closeButton.addEventListener("click", function(){
    Modal.style.display = "none"
  })
  goToCart.addEventListener("click", function() {  
    store.redirect("handlekurv.html")
  })
}


/** Considering 2 sliders are used to make the price-range work, this function makes sure the max-slider and min-slider stays apart form each *other with a certain margin.
*Main purpose is that min slider shouldnt have a larger value than max slider and vice-versa.
JS from : https://codepen.io/sln/pen/peGwVp */
function sliderInit(){

  const valueMin = document.getElementById("ab-min-value")
  const valueMax = document.getElementById("ab-max-value")

  const sliderMin = document.getElementById("ab-min-pris")
  const sliderMax = document.getElementById("ab-max-pris")

    sliderMax.oninput = function () {
        let lowerVal = parseInt(sliderMin.value);
        let upperVal = parseInt(sliderMax.value);
    
        if (upperVal < lowerVal + 75) {
            sliderMin.value = upperVal - 75;
            if (lowerVal == sliderMin.min) {
            sliderMax.value = 75;
            }
        }
        updateValues()
        
      };
      
    sliderMin.oninput = function () {
        let lowerVal = parseInt(sliderMin.value);
        let upperVal = parseInt(sliderMax.value);
        if (lowerVal > upperVal - 75) {
            sliderMax.value = lowerVal + 75;
            if (upperVal == sliderMax.max) {
                sliderMin.value = parseInt(sliderMax.max) - 75;
            }
        }
        updateValues()
    }; 
}


/**
 * function is placed inside sliderInit() to make sure the values of the boxes below the slider correspond to the sliders themselves.
 */
function updateValues() {
  document.querySelector('#two').value = document.getElementById("ab-max-pris").value
  document.querySelector('#one').value=document.getElementById('ab-min-pris').value
} // Fiks slider for firefox ! ! 



// Product-popup with information about the product, a larger image (except on the smallest screens) and also option to buy item.
const modal = document.getElementById("prod-info-wrapper")

function openModal(prod) {

  let product = store.getProductById(prod)

  const wrapper = document.getElementById("prod-info-wrapper")
  wrapper.innerHTML =`
  <div id="prod-info">
                <span class="ab-close" onclick="closeModal(this)">&times;</span>
                <div id="span-info-separator">
                    <div class="ab-modal-text">
                        <h2 class="ab-modal-header">${product.name}</h2>
                        <p class="ab-modal-desc" >${product.desc}</p>
                        <div class="ab-pris-kjop">
                          <p class="p-med">${product.price},-</p>
                          <button class="button ab-prod-info-kjøp" onclick="buyMore(${prod})">Kjøp</button>
                        </div>

                    </div>
                
                    <div class="ab-modal-img-wrapper">
                        <img id="ab-modal-img" src="${product.img.max}" data-src="${product.img.max}" alt="Bilde">
                    </div>
                  </div>
  </div>
  `

  modal.style.display = "flex"
}

function closeModal() {
  modal.style.display = "none"
}



// When you click anywhere outside the modals (if they're open), they will close.
window.onclick = function(event) {
  const handleVidereModal = document.getElementById("handle-videre-wrapper")
  if (event.target == modal) {
    modal.style.display = "none"
  } else if (event.target == handleVidereModal) {
    handleVidereModal.style.display = "none"
  }
}