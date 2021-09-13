/* We could have used the attribute load="lazy", but it wasn't releazed before Chorme 76, so since we are going to support Chrome 68, we will do this manually. */

/**
 * Function to initalize lazyloading og images 
 */
function initLazy() {
    const elements = document.querySelectorAll('[data-src]')


    /**
     * Function that returns wether the element is entering the viewport or not
     * @param {*} element 
     */
    var isInViewport = (element) => {
        let bounding = element.getBoundingClientRect();
        return (
            bounding.top >= - element.offsetHeight && 
            bounding.left >= 0 && 
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + element.offsetHeight &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        )
    }

    // Adds an scroll listener on window for each element. Removes it when loaded
    if (elements) elements.forEach((elem) => {
        const src = elem.getAttribute("data-src");
        let isLoaded = false;
        let loadImg = function() {
            isLoaded = true
            elem.src = src
        }
        let lazy = () => {
            if (isInViewport(elem) && !isLoaded) {
                isLoaded = true
                elem.src = src
            }
            if (isLoaded) window.removeEventListener('scroll', lazy)
        }
        if (isInViewport(elem)) loadImg()
        if (!isLoaded) window.addEventListener("scroll", lazy)
    })
    else console.error("Couldn't find any elements with a '[data-src]' attribute")
}