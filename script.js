document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ecoForm");
  const container = document.getElementById("materiauxContainer");
  let compteur = 1;

  let materiaux = {};
  let facteurEmissionEnergie = 0;
  let consoDefaut = 0;
  let facteurTransport = 0.05;

  // Fonction d'initialisation
  async function chargerDonnees() {
    const [dataEnergie, dataMateriaux, dataTransport] = await Promise.all([
      fetch("Valeur prototype/Valeurs prototype - Energie.csv").then(res => res.text()),
      fetch("Valeur prototype/Valeurs prototype - Materiaux.csv").then(res => res.text()),
      fetch("Valeur prototype/Valeurs prototype - Transport.csv").then(res => res.text())
    ]);

    // Energie
    const energieLignes = dataEnergie.trim().split("\n");
    const [, facteurStr, defautStr] = energieLignes[1].split(",");
    facteurEmissionEnergie = parseFloat(facteurStr);
    consoDefaut = parseFloat(defautStr);

    // Materiaux
    materiaux = {};
    dataMateriaux.trim().split("\n").slice(1).forEach(line => {
      const [nom, facteur, distanceRef] = line.split(",");
      if (nom && facteur && distanceRef) {
        materiaux[nom.trim().toLowerCase()] = {
          facteur: parseFloat(facteur),
          distance: parseFloat(distanceRef)
        };
      }
    });

    // Transport
    const transportLigne = dataTransport.trim().split("\n")[1];
    if (transportLigne) {
      const valeur = transportLigne.split(",")[1];
      if (!isNaN(parseFloat(valeur))) {
        facteurTransport = parseFloat(valeur);
      }
    }

    // On peut maintenant activer le bouton d'ajout
    ajouterLigne(); // Ajoute une première ligne par défaut
  }

  // Fonction appelée pour ajouter une ligne de matériaux
  function ajouterLigne() {
    const ligne = document.createElement("div");
    ligne.className = "ligne-materiau";
    ligne.innerHTML = `
      <label>Matériau n°${compteur} :</label>
      <select name="materiau" required>
        <option value="">--Choisir--</option>
        ${Object.keys(materiaux).map(m => `<option value="${m}">${m.charAt(0).toUpperCase() + m.slice(1)}</option>`).join("")}
      </select>
      <input type="number" name="masse" placeholder="Masse (kg)" required>
      <input type="number" name="distance" placeholder="Distance (km)">
      <button type="button" class="remove-button">✖</button>
    `;

    ligne.querySelector(".remove-button").addEventListener("click", () => {
      ligne.remove();
    });

    container.appendChild(ligne);
    compteur++;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const consoInput = parseFloat(document.getElementById("conso").value);
    const conso = isNaN(consoInput) ? consoDefaut : consoInput;

    let totalCO2 = conso * facteurEmissionEnergie;

    const lignes = container.querySelectorAll(".ligne-materiau");
    lignes.forEach(ligne => {
      const materiau = ligne.querySelector("select").value.toLowerCase();
      const masse = parseFloat(ligne.querySelector('input[name="masse"]').value) || 0;
      const distanceInput = parseFloat(ligne.querySelector('input[name="distance"]').value);
      const data = materiaux[materiau];

      if (data) {
        const distance = isNaN(distanceInput) ? data.distance : distanceInput;
        const masseTonne = masse / 1000;
        const emission = masseTonne * data.facteur + distance * facteurTransport;
        totalCO2 += emission;
      }
    });

    document.getElementById("resultat").innerText =
      `Émission totale estimée : ${totalCO2.toFixed(2)} kg eq CO₂.`;
  });

  // Démarrage de l'appli après chargement des CSV
  chargerDonnees();
  window.ajouterLigne = ajouterLigne;
});
