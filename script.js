document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ecoForm");
  const container = document.getElementById("materiauxContainer");
  const addLineBtn = document.getElementById("addLineBtn");
  const resultat = document.getElementById("resultat");

  let index = 1;

  function ajouterLigneMateriau() {
    const ligne = document.createElement("div");
    ligne.className = "ligne-materiau";

    const titre = document.createElement("h3");
    titre.textContent = `Matériau n°${index}`;
    ligne.appendChild(titre);

    const labelMat = document.createElement("label");
    labelMat.textContent = "Matériau utilisé pour les murs : ";
    const select = document.createElement("select");
    select.required = true;
    ["", "Bois", "Béton", "Verre"].forEach(opt => {
      const o = document.createElement("option");
      o.value = opt.toLowerCase();
      o.textContent = opt || "--Choisir--";
      select.appendChild(o);
    });
    labelMat.appendChild(select);
    ligne.appendChild(labelMat);

    const masseInput = document.createElement("input");
    masseInput.type = "number";
    masseInput.required = true;
    masseInput.placeholder = "Masse (kg)";
    ligne.appendChild(masseInput);

    const distanceInput = document.createElement("input");
    distanceInput.type = "number";
    distanceInput.required = true;
    distanceInput.placeholder = "Distance (km)";
    ligne.appendChild(distanceInput);

    const supprimerBtn = document.createElement("button");
    supprimerBtn.type = "button";
    supprimerBtn.textContent = "🗑 Supprimer";
    supprimerBtn.addEventListener("click", () => {
      ligne.remove();
    });
    ligne.appendChild(supprimerBtn);

    ligne.style.display = "flex";
    ligne.style.flexWrap = "wrap";
    ligne.style.alignItems = "center";
    ligne.style.gap = "10px";
    ligne.style.marginBottom = "10px";

    container.appendChild(ligne);
    index++;
  }

  addLineBtn.addEventListener("click", ajouterLigneMateriau);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const conso = parseFloat(document.getElementById("conso").value);
    if (isNaN(conso)) {
      resultat.textContent = "Veuillez entrer une consommation énergétique valide.";
      return;
    }
    resultat.textContent = `Consommation annuelle saisie : ${conso} kWh (calcul à venir).`;
  });

  ajouterLigneMateriau(); // Ajout d'une ligne par défaut au chargement
});
