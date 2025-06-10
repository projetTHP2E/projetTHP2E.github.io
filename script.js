document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById("ecoForm");
  const container = document.getElementById("materiauxContainer");
  let compteur = 1;

  // Chargement CSV
  const [dataEnergie, dataMateriaux, dataTransport] = await Promise.all([
    fetch("Valeur prototype/Valeurs prototype - Energie.csv").then(res => res.text()),
    fetch("Valeur prototype/Valeurs prototype - Materiaux.csv").then(res => res.text()),
    fetch("Valeur prototype/Valeurs prototype - Transport.csv").then(res => res.text())
  ]);

  const facteurEmissionEnergie = parseFloat(dataEnergie.split("\n")[1].split(",")[1]);
  const consoDefaut = parseFloat(dataEnergie.split("\n")[1].split(",")[2]);

  const materiaux = {};
  dataMateriaux.split("\n").slice(1).forEach(line => {
    const [nom, facteur, distanceRef] = line.split(",");
    if (nom) materiaux[nom.trim().toLowerCase()] = {
      facteur: parseFloat(facteur),
      distance: parseFloat(distanceRef)
    };
  });

  let facteurTransport = 0.05; // valeur par défaut
  const transportLigne = dataTransport.split("\n")[1];
  if (transportLigne) {
    const valeur = transportLigne.split(",")[1];
    if (!isNaN(parseFloat(valeur))) {
      facteurTransport = parseFloat(valeur);
    }
  }

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
});
