// Trenutno aktivna projekcija (indeks)
let trenutnaProjekcija = 0;

// Validacija podataka
function validirajPodatke(podaci) {
    const validniStatusi = ["slobodno", "zauzeto", "rezervisano"];

    if (!podaci.projekcije || podaci.projekcije.length === 0) {
        return false;
    }

    for (let proj of podaci.projekcije) {
        for (let sjediste of proj.sjedista) {
            if (!validniStatusi.includes(sjediste.status)) {
                return false;
            }
        }
    }

    return true;
}

// Crtanje sale
function prikaziSalu() {
    const salaDiv = document.getElementById("sala");
    salaDiv.innerHTML = "";

    const proj = podaci.projekcije[trenutnaProjekcija];

    // Ažuriranje info sekcije
    document.querySelector(".info-vrijednost[data-film]").textContent = proj.film;
    document.querySelector(".info-vrijednost[data-vrijeme]").textContent = proj.vrijeme;

    // Grupisanje sjedišta po redovima
    const redovi = {};
    for (let sjediste of proj.sjedista) {
        if (!redovi[sjediste.red]) {
            redovi[sjediste.red] = [];
        }
        redovi[sjediste.red].push(sjediste);
    }

    // Crtanje svakog reda
    for (let oznaka in redovi) {
        const redDiv = document.createElement("div");
        redDiv.classList.add("red");

        const oznakaSpan = document.createElement("span");
        oznakaSpan.classList.add("oznaka-reda");
        oznakaSpan.textContent = oznaka;
        redDiv.appendChild(oznakaSpan);

        for (let sjediste of redovi[oznaka]) {
            const sjDiv = document.createElement("div");
            sjDiv.classList.add("sjediste", sjediste.status);

            // Klik samo na slobodna sjedišta
            if (sjediste.status === "slobodno") {
                sjDiv.addEventListener("click", function () {
                    sjediste.status = "rezervisano";
                    prikaziSalu();
                });
            }

            redDiv.appendChild(sjDiv);
        }

        salaDiv.appendChild(redDiv);
    }

    // Ažuriranje dugmadi
    const btnPret = document.getElementById("btn-prethodna");
    const btnSlj = document.getElementById("btn-sljedeca");

    btnPret.disabled = trenutnaProjekcija === 0;
    btnSlj.disabled = trenutnaProjekcija === podaci.projekcije.length - 1;
}

// Pokretanje
function init() {
    if (!validirajPodatke(podaci)) {
        document.getElementById("sala").innerHTML =
            "<p style='color: red; text-align: center;'>Podaci nisu validni!</p>";
        return;
    }

    document.getElementById("btn-prethodna").addEventListener("click", function () {
        if (trenutnaProjekcija > 0) {
            trenutnaProjekcija--;
            prikaziSalu();
        }
    });

    document.getElementById("btn-sljedeca").addEventListener("click", function () {
        if (trenutnaProjekcija < podaci.projekcije.length - 1) {
            trenutnaProjekcija++;
            prikaziSalu();
        }
    });

    prikaziSalu();
}

init();