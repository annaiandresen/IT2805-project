/**
 * Product class including all parameters for a product
 */
class Product {

  /**
   * Constructor that takes inn all values as parametres and assigns them to Product fields
   * @param {number} id 
   * @param {string} name 
   * @param {string} desc 
   * @param {object} img 
   * @param {number} price 
   * @param {number} stock 
   * @param {string} dateAdded 
   * @param {list} categories 
   */
  constructor(id, name, desc, img, price, stock, dateAdded, categories) {
    this.id = id ? id : -1
    this.name = name ? name : ''
    this.desc = desc ? desc : ''
    this.img = img ? img : ''
    this.price = price ? price : 0
    this.stock = stock ? stock : 0
    this.dateAdded = dateAdded ? new Date(dateAdded) : null
    this.categories = categories ? categories : []
  }
}

/**
 * Class for handling the Shop. Contains methods for working with the shopping basket and recieving a filtered products array
 */
class Store {
  /**
   * Constructor that fetches products from products.json, sets an empty shopping cart and fills it if a queryString is present.
   */
  constructor() {
    this.products = this.getJSONProducts()
    this.shoppingCart = []
    this.getCartQuery()
  }

  /**
   * Method that retus a array of Product objects base on products.json
   */
  getJSONProducts() {
    /**
     * Returns json object
     * @param {string} file (with path)
     */
    var getJSON = (file) => {
      var rawFile = new XMLHttpRequest();
      var jsonContent = '';
      rawFile.open("GET", file, false);
      rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
          if (rawFile.status === 200 || rawFile.status == 0) {
            let allText = rawFile.responseText;
            jsonContent = JSON.parse(allText)
          }
        }
      }
      rawFile.send(null);
      return jsonContent;
    }

    let jsonList = getJSON('scripts/products.json').products
    let productsList = []

    // Creates a new Product object for each element in the json list and pushes this to a result list
    jsonList.forEach((json_item) => {
      productsList.push(new Product(
        json_item.id,
        json_item.name,
        json_item.desc,
        json_item.img,
        json_item.price,
        json_item.stock,
        json_item.dateAdded,
        json_item.categories
      ))
    })
    return productsList
  }

  /**
   * Returns a Product object based on its id. Returns null if no product is found.
   * @param {number} productID 
   */
  getProductById(productID) {
    let res = null
    this.products.forEach((item) => {
      if (item.id === productID) return res = item
    })
    return res
  }


  /* Shopping cart functions */
  
  
  /**
   * Adds one or {amount} Product object(s) to the cart. 
   * @param {Product} product 
   * @param {number} amount 
   */
  addProductToCart(product, amount = 1) {
    if (this.getShoppingCartElementById(product.id) !== null) {
      this.increaseProductAmount(product.id, amount)
    } else {
      this.shoppingCart.push({
        product : product,
        amount : amount
      })
    }
    this.updateCartNumber()
  }

  /**
   * Adds one or {amount} Product object(s) to the cart based on its id. 
   * @param {number} productID 
   * @param {number} amount 
   */
  addProductToCartById(productID, amount = 1) {
    this.addProductToCart(this.getProductById(productID), amount)
  }

  /**
   * Removes a Product object from the cart using filter
   * @param {Product} product 
   */
  removeProductFromCart(product) {
    this.shoppingCart = this.shoppingCart.filter((item) => {
      return item.product.id !== product.id
    })
    this.updateCartNumber()
  }

  /**
   * Removes a Product object from the cart by its id using filter
   * @param {Product} product 
   */
  removeProductFromCartById(productID) {
    this.removeProductFromCart(this.getProductById(productID))
  }

  /**
   * Returns the shopping cart as an array
   */
  getShoppingCartArray() {
    return this.shoppingCart
  }

  /**
   * Method that finds and returns the shopping cart element by its products id
   * @param {number} productID 
   * @return the shopping cart element if present
   */
  getShoppingCartElementById(productID) {
    let res = null
    this.shoppingCart.forEach((shoppingCartElement) => {
      if (shoppingCartElement.product.id === productID) res = shoppingCartElement
    })
    return res
  }

  /**
   * Method that increases the amount of a product in the shopping cart
   * @param {number} productID, id of the product
   * @param {number} increaseBy, increase amount by
   */
  increaseProductAmount(productID, increaseBy = 1) {
    let shoppingCartElement = this.getShoppingCartElementById(productID)
    if (shoppingCartElement !== null) {
      shoppingCartElement.amount += increaseBy
    } else {
      this.addProductToCartById(productID)
    }
    this.updateCartNumber()
  }

  /**
   * Method that decreases the amount of a product in the shopping cart
   * @param {number} productID, id of the product
   * @param {number} decreaseBy, decrease amount by
   */
  decreaseProductAmount(productID, decreaseBy = 1) {
    let shoppingCartElement = this.getShoppingCartElementById(productID)
    shoppingCartElement.amount -= decreaseBy
    if (shoppingCartElement.amount <= 0) this.removeProductFromCartById(productID)
    this.updateCartNumber()
  }

  /**
   * Returns a product array based on a optional filter sort object, a limit and an offset
   * @param {Object} filterSortObj, optional 
   * @param {number} limit, optional
   * @param {number} offset, optional
   * @returns filtered and sorted products array
   */
  getProductArray(filterSortObj = null, limit = null, offset = 0) {

    let productsArray = this.products

    if (filterSortObj !== null) {

      // Sort array
      if (filterSortObj.sortBy !== '') productsArray = this.sortArray(productsArray, filterSortObj.sortBy)

      // Filter array
      if (filterSortObj.category) {
        productsArray = productsArray.filter((item) => {
          return item.categories.includes(filterSortObj.category.toLowerCase())
        })
      }

      // Price range
      let priceRangeIsNull = !(filterSortObj.priceRange)
      if (!priceRangeIsNull) {
        let priceRangeMinIsNull = !(filterSortObj.priceRange.min)
        let priceRangeMaxIsNull = !(filterSortObj.priceRange.max)
        if (!priceRangeMinIsNull || !priceRangeMaxIsNull) {
          if (!priceRangeMinIsNull) {
            productsArray = productsArray.filter((item) => {
              return item.price >= filterSortObj.priceRange.min
            })
          }
          if (!priceRangeMaxIsNull) {
            productsArray = productsArray.filter((item) => {
              return item.price <= filterSortObj.priceRange.max
            })
          }
        }
      }

      // Limit array
      if (limit !== null && offset !== null) {
        if (limit * (offset + 1) < productsArray.length) {
          let start = limit * (offset + 1)
          let stop = start + limit
          productsArray = productsArray.slice(start, stop)
        }
      }
      
    }
    // Return result array
    return productsArray
  }

  /**
   * Mehod to sort an array based on a sortBy parameter
   * @param {array} productsArray to be sorted
   * @param {string} sortBy
   */
  sortArray(productsArray, sortBy) {
    /**
     * Compare two products by name
     * @param {Product} a 
     * @param {Product} b 
     */
    var compareName = (a, b) => {
      if (a.name < b.name) return -1
      else if (a.name > b.name) return 1
      else return 0
    }

    /**
     * Compare two products by string
     * @param {Product} a 
     * @param {Product} b 
     */
    var comparePrice = (a, b) => {
      if (a.price < b.price) return -1
      else if (a.price > b.price) return 1
      else return 0
    }
    
    if (sortBy === 'N0') return productsArray.sort(compareName)
    else if (sortBy === 'N1') return productsArray.sort(compareName).reverse()
    else if (sortBy === 'P0') return productsArray.sort(comparePrice)
    else if (sortBy === 'P1') return productsArray.sort(comparePrice).reverse()
    else if (sortBy === 'D1') return productsArray.sort((a, b) => b.dateAdded - a.dateAdded).reverse()
    else /* if (sortBy === 'D0') */ return productsArray.sort((a, b) => b.dateAdded - a.dateAdded)
  }

  /**
   * @returns total cost of shopping cart
   */
  getTotalShoppingCartPrice() {
    let res = 0
    this.shoppingCart.forEach((item) => {
      res += item.product.price * item.amount
    })
    return res
  }

  /**
   * @returns total amount of shopping cart items
   */
  getAmountOfProductsInShoppingCart() {
    let res = 0
    this.shoppingCart.forEach((item) => {
      res += item.amount
    })
    return res
  }

  /**
   * Method that clears out shopping cart
   */
  clearShoppingCart() {
    this.shoppingCart = []
    this.updateCartNumber()
  }

  /** 
   * Method that appends a query string based to the url
   */
  setCartQuery() {
    // Make a new instance of URLSearchParams
    let queryParams = new URLSearchParams(window.location.search)

    let cartParam = ''

    // Generate string with form {id}.{amount}-{id}.{amount} ...
    if (this.getAmountOfProductsInShoppingCart() !== 0) this.shoppingCart.forEach((item) => {
      cartParam += item.product.id + '.' + item.amount + '-'
    })
    // Remove last char in query string
    cartParam = cartParam.substring(0, cartParam.length - 1)
    
    // Set cart parameters
    queryParams.set('cart', cartParam)
  
    // Return query string
    return "?" + queryParams.toString()
  }

  /**
   * 
   */
  getCartQuery() {
    // Check if query string is present in url
    if (window.location.href.indexOf('?') != -1) {

      // First try to get query parameters directly
      let queryParams = new URLSearchParams(window.location.search)

      // Remove everything before '?' if window.location.search is not recognized
      if (!window.location.search) queryParams = new URLSearchParams(window.location.href.replace(/.*\?/, '?'))

      // Irerate over query parameters
      for (let [key, value] of queryParams) {
        if (key === 'cart' && value != '') {
          this.clearShoppingCart()
          value.split('-').forEach((param) => {
            let id = parseInt(param.split('.')[0])
            let amount = parseInt(param.split('.')[1])
            if (id && amount) this.addProductToCartById(id, amount)
          })
        }
        if (key === 'sec' && value != '') {
          // List of hash values for om_oss.html
          let hashList = ["about1", "about2", "about3", "about4"]
          if (0 < parseInt(value) && parseInt(value) <= hashList.length) {
            // Go to right section
            location.href = "#" + hashList[parseInt(value) - 1]

            location.hash = "#" + hashList[parseInt(value) - 1]
          }
        }
      }
      
      // Remove query string from url and set new state with hash on om_oss.html
      let newStateList = window.location.href.substring(window.location.href.indexOf('/') + 1).split(/\?|\#/g)
      window.history.pushState(null, null, "/"+newStateList[0] + (newStateList.length > 2 ? "#" + newStateList[2] : ""));
    }
    this.updateCartNumber()
  }

  /**
   * Method that adds a query string at the end of url and then sets window.location.
   * This is to be able to keep the shopping cart while navigating throughout the pages.
   * @param {string} relativeURL, e.g. 'home.html'
   * @param {number} num, about section number between 0 and 3
   */
  redirect(relativeURL, num = null) {
    let go

    let query = this.setCartQuery()

    go = relativeURL + query
    if (num !== null) go += "&sec=" + num
    
    window.location = go
  }

  /**
   * Method that updates the small cart number in the navbar.
   */
  updateCartNumber() {
    document.querySelectorAll(".navCartNumber").forEach((element) => {
      element.innerHTML = this.getAmountOfProductsInShoppingCart()
    })
  }
}

/*
Template for filter sort object 

let filterSortObj = {
  sortBy : '',
  category : '',
  priceRange : {
    min: null,
    max: null
  }
}
*/

