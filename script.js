document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ecoForm");
  const container = document.getElementById("materiauxContainer");
  const resultat = document.getElementById("resultat");

  // Bouton pour ajouter un matériau
  const ajouterBtn = document.createElement("button");
  ajouterBtn.type = "button";
  ajouterBtn.textContent = "+ Ajouter un matériau";
  ajouterBtn.style.marginBottom = "15px";
  ajouterBtn.addEventListener("click", function () {
    ajouterLigneMateriau();
    reindexMateriaux();
  });
  // On ajoute le bouton juste après le container
  form.insertBefore(ajouterBtn, document.getElementById("submitSection"));

  // Fonction d'ajout d'une ligne de matériau
  function ajouterLigneMateriau() {
    const ligne = document.createElement("div");
    ligne.className = "ligne-materiau";

    const index = container.children.length + 1;

    const titre = document.createElement("h3");
    titre.textContent = `Matériau n°${index}`;
    ligne.appendChild(titre);

    // Matériau
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

    // Masse
    const masseInput = document.createElement("input");
    masseInput.type = "number";
    masseInput.required = true;
    masseInput.placeholder = "Masse (kg)";
    ligne.appendChild(masseInput);

    // Distance
    const distanceInput = document.createElement("input");
    distanceInput.type = "number";
    distanceInput.required = true;
    distanceInput.placeholder = "Distance (km)";
    ligne.appendChild(distanceInput);

    // Bouton de suppression
    const supprimerBtn = document.createElement("button");
    supprimerBtn.type = "button";
    supprimerBtn.textContent = "🗑 Supprimer";
    supprimerBtn.addEventListener("click", () => {
      ligne.remove();
      reindexMateriaux();
    });
    ligne.appendChild(supprimerBtn);

    // Mise en page
    ligne.style.display = "flex";
    ligne.style.flexWrap = "wrap";
    ligne.style.alignItems = "center";
    ligne.style.gap = "10px";
    ligne.style.marginBottom = "10px";

    container.appendChild(ligne);
  }

  // Fonction pour mettre à jour les titres des matériaux
  function reindexMateriaux() {
    const lignes = document.querySelectorAll(".ligne-materiau");
    lignes.forEach((ligne, index) => {
      const titre = ligne.querySelector("h3");
      if (titre) {
        titre.textContent = `Matériau n°${index + 1}`;
      }
    });
  }

  // Formulaire - comportement au submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const conso = parseFloat(document.getElementById("conso").value);
    if (isNaN(conso)) {
      resultat.textContent = "Veuillez entrer une consommation énergétique valide.";
      return;
    }
    resultat.textContent = `Consommation annuelle saisie : ${conso} kWh (calcul à venir).`;
  });

  // Initialisation : une ligne au départ
  ajouterLigneMateriau();
  reindexMateriaux();
});

