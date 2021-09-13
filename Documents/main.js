// Add active class to visible sections
var navLinks = document.querySelectorAll('.nav-link')
var active = navLinks[0]

var activeNode = () => {
  for (var i = 0; i < navLinks.length; i++) {
    var link = navLinks[i]
    var hash = link.hash
    var sec = document.querySelector(hash)
    var topPos = sec.getBoundingClientRect().bottom
    var offset = 0.2 * (window.innerHeight || document.documentElement.clientHeight)
    if (offset < topPos) return link
  }
}

function removeActive(e) {
  e.classList.remove('active')
  e.parentElement.classList.remove('active')
}

function addActive(e) {
  e.classList.add('active')
  e.parentElement.classList.add('active')
}

function syncNav() {

  // Få aktiv link
  active = activeNode()

  // Hvis nettleseren er scrollet helt opp skal første link være den aktive
  if (window.scrollY < 4) active = navLinks[0]
  console.log(active)

  // Fjerne .active på alle linker utenom den som er aktiv
  navLinks.forEach( (e) => {if ( !e.isEqualNode(active) ) removeActive(e) } )

  // Legge til .activ på aktiv link
  addActive(active)
}

syncNav()
document.addEventListener('scroll', syncNav)
document.addEventListener('resize', syncNav)
