document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById("ecoForm");
  const container = document.getElementById("materiauxContainer");

  let compteur = 0;
  let materiaux = {};

  // Lecture des CSV
  const [energieTxt, materiauxTxt, transportTxt] = await Promise.all([
    fetch("Valeur prototype/Valeurs prototype - Energie.csv").then(res => res.text()),
    fetch("Valeur prototype/Valeurs prototype - Materiaux.csv").then(res => res.text()),
    fetch("Valeur prototype/Valeurs prototype - Transport.csv").then(res => res.text())
  ]);

  // Traitement des données énergie
  const lignesEnergie = energieTxt.trim().split("\n");
  const facteurEmissionEnergie = parseFloat(lignesEnergie[1].split(",")[1].replace(",", "."));
  const consoDefaut = parseFloat(lignesEnergie[1].split(",")[2]);

  // Traitement des données matériaux
  const lignesMat = materiauxTxt.trim().split("\n");
  const nomsMateriaux = lignesMat[0].split(",").slice(1);
  const facteurs = lignesMat[1].split(",").slice(1).map(v => parseFloat(v.replace(",", ".")));
  const distances = lignesMat[2].split(",").slice(1).map(v => parseFloat(v.replace(",", ".")));

  nomsMateriaux.forEach((nom, i) => {
    materiaux[nom.trim().toLowerCase()] = {
      facteur: facteurs[i],
      distance: distances[i]
    };
  });

  // Transport
  const transportLigne = transportTxt.trim().split("\n")[1];
  const facteurTransport = parseFloat(transportLigne.split(",")[1].replace(",", "."));

  // Ajouter une ligne matériau
  window.ajouterLigne = function () {
    compteur++;
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
      <button type="button" class="remove-button" onclick="this.parentElement.remove()">✖</button>
    `;
    container.appendChild(ligne);
  };

  // Soumission du formulaire
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

  // Info-bulles cliquables
  document.querySelectorAll('.tooltip-icon').forEach(icon => {
    icon.addEventListener('click', function () {
      const wrapper = this.closest('.tooltip-wrapper');
      wrapper.classList.toggle('active');
    });
  });
});
