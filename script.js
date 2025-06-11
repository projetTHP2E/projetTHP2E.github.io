document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById("ecoForm");
  const container = document.getElementById("materiauxContainer");
  let compteur = 0;
  let materiaux = {};

  // Chargement des fichiers CSV
  const [energieText, matText, transportText] = await Promise.all([
    fetch("Valeur prototype/Valeurs prototype - Energie.csv").then(res => res.text()),
    fetch("Valeur prototype/Valeurs prototype - Materiaux.csv").then(res => res.text()),
    fetch("Valeur prototype/Valeurs prototype - Transport.csv").then(res => res.text())
  ]);

  // Énergie
  const energieParsed = Papa.parse(energieText, { header: true, skipEmptyLines: true });
  const energieRow = energieParsed.data[0];
  const facteurEmissionEnergie = parseFloat(energieRow["Facteur d'emission (kgCO2/kWh)"].replace(",", "."));
  const consoDefaut = parseFloat(energieRow["Consommation énergétique moyenne annuelle d'un foyer (kWh/an)"]);

  // Transport
  const transportParsed = Papa.parse(transportText, { header: true, skipEmptyLines: true });
  const facteurTransport = parseFloat(transportParsed.data[0]["Facteur d'émission (kgCO2e/km)"].replace(",", "."));

  // Matériaux (conversion colonnes → lignes)
  const matData = Papa.parse(matText, { skipEmptyLines: true });
  const noms = matData.data[0].slice(1);
  const facteurs = matData.data[1].slice(1);
  const distances = matData.data[2].slice(1);

  noms.forEach((nom, i) => {
    materiaux[nom.trim().toLowerCase()] = {
      facteur: parseFloat(facteurs[i].replace(",", ".")),
      distance: parseFloat(distances[i])
    };
  });

  function ajouterLigne() {
    compteur++;
    const ligne = document.createElement("div");
    ligne.className = "ligne-materiau";
    ligne.innerHTML = `
      <label>Matériau n°${compteur} :</label>
      <input type="text" name="materiau" list="listeMateriaux" placeholder="Nom du matériau" required>
      <input type="number" name="masse" placeholder="Masse (kg)" required>
      <input type="number" name="distance" placeholder="Distance (km)">
      <button type="button" class="remove-button" onclick="this.parentElement.remove()">✖</button>
    `;
    container.appendChild(ligne);
  }

  // Liste d’autocomplétion
  const datalist = document.createElement("datalist");
  datalist.id = "listeMateriaux";
  Object.keys(materiaux).forEach(m => {
    const option = document.createElement("option");
    option.value = m;
    datalist.appendChild(option);
  });
  document.body.appendChild(datalist);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const consoInput = parseFloat(document.getElementById("conso").value);
    const conso = isNaN(consoInput) ? consoDefaut : consoInput;

    let totalCO2 = conso * facteurEmissionEnergie;

    const lignes = container.querySelectorAll(".ligne-materiau");
    lignes.forEach(ligne => {
      const nom = ligne.querySelector('input[name="materiau"]').value.trim().toLowerCase();
      const masse = parseFloat(ligne.querySelector('input[name="masse"]').value) || 0;
      const distanceInput = parseFloat(ligne.querySelector('input[name="distance"]').value);
      const data = materiaux[nom];

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
