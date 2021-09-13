// The nav-bar-design is based on Dev Ed's video: https://www.youtube.com/watch?v=gXkqy0b4M5g

document.getElementById("navbar").innerHTML = `
    <div class="container nav">
        <a class="logo" onclick="store.redirect('hjem.html')">
            <img id="logo_PT" src="img/logo_PT.svg" alt="PlanteTante - Logo">
        </a>
        <ul class="nav-links">
            <li><a onclick="store.redirect('hjem.html')">Hjem</a></li>
            <li>
                <div class="nav-dropdown">
                    <a id="nav-dropbtn" onclick="store.redirect('om_oss.html')">Om oss
                    </a>
                    <div class="nav-dropdown-content">
                        <a onclick="store.redirect('om_oss.html', 1)">Georgine Blom</a>
                        <a onclick="store.redirect('om_oss.html', 2)">PlanteTante</a>
                        <a onclick="store.redirect('om_oss.html', 3)">Kontakt og åpningstider</a>
                        <a onclick="store.redirect('om_oss.html', 4)">Her finner du oss</a>
                    </div>
                </div>
            </li>
            <li><a onclick="store.redirect('nettbutikk.html')">Nettbutikk</a></li>
            <li>
                <a onclick="store.redirect('handlekurv.html')" class="nav-icon-wrapper">
                    <i class="fas fa-shopping-cart nav-icon"></i>
                    <div class="navCartNumber">0</div>
                </a>
            </li>
        </ul>
        <div class="nav-kurv-burger">
            <a href="handlekurv.html" id="nav-icon-burger" class="nav-icon-wrapper">
                <i class="fas fa-shopping-cart nav-icon"></i>
                <div class="navCartNumber">0</div>
            </a>
</a>
        </div>
        <div class="nav-burger">
            <div class="line1"></div>
            <div class="line2"></div>
            <div class="line3"></div>
        </div>
    </div>
    `
/*Changing the nav-bar-links to a burger menu for smaller screens */
const navSlide = () => {
    const burger = document.querySelector(".nav-burger")
    const nav = document.querySelector(".nav-links")
    const navLinks = document.querySelectorAll(".nav-links li")

    //Adding event listener when the burger menu is clicked
    burger.addEventListener("click", () => {
        //Toggle Nav
        nav.classList.toggle("nav-active")
        
        // Animate links
        navLinks.forEach((link, index) => {
            if(link.style.animation){
                link.style.animation = ""
            } else{
                link.style.animation = "navLinkFade 0.5s ease forwards ${index / 7 + 1}s"
            }
        })
        // Burger Animation
        burger.classList.toggle("toggle")
    })

}

navSlide()
store.updateCartNumber()