document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ecoForm");
  const container = document.getElementById("materiauxContainer");
  let compteur = 1;

  // Fonction pour lire un fichier CSV
  function readCSVFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  // Fonction pour charger les fichiers CSV
  async function loadCSVFiles() {
    try {
      const energieFileInput = document.getElementById('energieFile');
      const materiauxFileInput = document.getElementById('materiauxFile');
      const transportFileInput = document.getElementById('transportFile');

      // Écouteurs pour le téléchargement des fichiers
      energieFileInput.onchange = () => handleFileUpload();
      materiauxFileInput.onchange = () => handleFileUpload();
      transportFileInput.onchange = () => handleFileUpload();

      // Simuler un clic pour ouvrir la boîte de dialogue de téléchargement
      energieFileInput.click();

    } catch (error) {
      console.error("Error loading CSV files:", error);
    }
  }

  async function handleFileUpload() {
    try {
      const [dataEnergie, dataMateriaux, dataTransport] = await Promise.all([
        readCSVFile(document.getElementById('energieFile').files[0]),
        readCSVFile(document.getElementById('materiauxFile').files[0]),
        readCSVFile(document.getElementById('transportFile').files[0])
      ]);

      parseCSVData(dataEnergie, dataMateriaux, dataTransport);
    } catch (error) {
      console.error("Error reading CSV files:", error);
    }
  }

  // Fonction pour parser les données CSV
  function parseCSVData(dataEnergie, dataMateriaux, dataTransport) {
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
  }

  // Charger les fichiers CSV
  loadCSVFiles();
});
