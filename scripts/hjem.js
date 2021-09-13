/* Store */


// Creating a new instance of the store object
const store = new Store()


addProducts()

/**
 * Dynamicly adds the product cards for the four newest items.
 */
function addProducts() {
  const productsUl = document.querySelector("#fp-products")
  // Store an array of the four newest products in list
  let list = store.getProductArray({ sortBy: "D0" }, 4)
  // Iterate over each element in the list and append a new li-element to the productsUl
  list.forEach((product) => {
    productsUl.innerHTML += `
    <li class="mh-fp-product-wrapper bg-img-center" style="background-image: url(${product.img.med});">
      <a onclick='store.redirect("nettbutikk.html")' class="mh-fp-product-card-content-wrapper">
        <h3 class="mh-fp-product-title">${product.name}</h3>
        <div>Ta meg til nettbutikken</div>
      </a>
    </li>
    `
  })
}
 

/* Slideshow component */

/* Inspiration from https://www.youtube.com/watch?v=c5SIG7Ie0dM (at 8:01.14) */

// Slider content to be added
const sliderElements = [
  {
    content : "PlanteTante leverer de beste plantene. Fantastisk service og kompetanse i verdensklasse. Trodde ikke det var så enkelt å kombinere lidenskap for blomster og studier!",
    byline : "Kari Norrmann, 20, student"
  },
  {
    content : "Disse plantene var en bryllupsgave til kona mi, uten annen grunn enn at hun fortjener dem! De fornyet ekteskapet vårt!",
    byline : "Ola Halvorsen, 45, ingeniør"
  },
  {
    content : "Konge service!",
    byline : "Hakim, 28, gartner"
  },
  {
    content : "Endelig fant jeg en butikk som tar planter på alvor! Jeg er så lei av å bare få tak i middelmådig kvalitet.",
    byline : "Alvhild, 68, pensjonist"
  }
]

initSlider(sliderElements)

/**
 * Initialize slider component with sliderElements
 * @param {} sliderElements 
 */
function initSlider(sliderElements) {

  addSliderElements(sliderElements)

  /* Get elements from DOM */
  const slides = document.querySelectorAll(".slide")
  const nextBtn = document.querySelector("a.nextBtn")
  const prevBtn = document.querySelector("a.prevBtn")

  let currentSlideIndex = 0

  // Hide previous should be hidden on first page
  prevBtn.style.visibility = "hidden"

  // Set initial left attribute for each slide
  slides.forEach((slide, index) => {
    slide.style.left = `${index * 100}%`
  })

  /* Add event listeners to next and prev buttons */
  nextBtn.addEventListener("click", () => {
    currentSlideIndex++
    slideChange()
  })

  prevBtn.addEventListener("click", () => {
    currentSlideIndex--
    slideChange()
  })

  /**
   * Updates visability of buttons based on the current slides index
   */
  function updateButtons() {
    if (currentSlideIndex < slides.length - 1) {
      nextBtn.style.visibility = "visible"
    } else {
      nextBtn.style.visibility = "hidden"
    }

    if (currentSlideIndex > 0) {
      prevBtn.style.visibility = "visible"
    } else {
      prevBtn.style.visibility = "hidden"
    }
  }

  /**
   * Fires when slider state changes. Updates slider style
   */
  function slideChange() {
    
    updateButtons()

    // Transorm each slide
    slides.forEach((slide) => {
      slide.style.transform = `translateX(-${currentSlideIndex * 100}%)`
    })
  }

  /**
   * Sets slider index to 0
   */
  function resetSlider() {
    currentSlideIndex = 0
  }

  /**
   * Adds slides to DOM
   * @param {*} sliderElements 
   */
  function addSliderElements(sliderElements) {
    
    const slider = document.querySelector('#slider')

    sliderElements.forEach((item) => {
      let div = document.createElement("div")
      div.classList.add("slide")
      div.innerHTML += `
        <img src="img/quotes.png" alt="quotes" class="slide-img">
        <p class="slide-text">${item.content}</p>
        <p class="p-small slide-sign">${item.byline}</p>
      `
      slider.appendChild(div)
    })
  }
}