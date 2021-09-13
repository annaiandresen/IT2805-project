document.getElementById("footer").innerHTML = `
<div class="footer">
    <div class="inner_footer">
        <h2>Bli en PlanteTante i dag!</h2>
        <p>
            Motta ukentlige nyhetsbrev med tips og triks, få eksklusive tilbud rett i innboksen 
            og bli en del av et stort nettverk av planteelskere i Norge!
        </p>
        <br>
        <form onsubmit="sendMail()">
            <input type="email" id="footer-email" placeholder="Din e-post-adresse..." required>
            <button class="button accent" type="submit">Bli med!</button>
        </form>
        <br>
        <p class="footer-copyright">
            <i id="footer_copyrights" class="far fa-copyright"></i>
            Alle produktbilder og -beskrivelser i kategoriene "Potter", "Jord" og 
            "Andre produkter" er hentet med tillatelse fra 
            <a href="https://godvar.no/" target="blank">GodVår</a> ved Morten Bragdø.
        </p>
        <p class="footer-copyright">
            Plantebilder er hentet fra <a href="https://unsplash.com/">Unsplash.com</a>
        </p>
    </div>
</div>
`;
/*Pop-up when you submit e-mail*/
function sendMail(){
    alert("Takk for at du meldte deg på vårt nyhetsbrev. Vent i spenning mens vi dyrker frem neste utgave!")
}