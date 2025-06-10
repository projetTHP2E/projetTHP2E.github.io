let materiauCompteur = 0;
let energie, consoDefaut;
let matData = {}, transportFacteur = 0;

Promise.all([
  chargerCSV('Valeur prototype/Valeurs prototype - Energie.csv'),
  chargerCSV('Valeur prototype/Valeurs prototype - Materiaux.csv'),
  chargerCSV('Valeur prototype/Valeurs prototype - Transport.csv')
]).then(([eData, mData, tData]) => {
  // Energie
  eData.forEach(r => {
    if (r.param.toLowerCase().includes('facteur')) energie = parseFloat(r.valeur);
    if (r.param.toLowerCase().includes('conso')) consoDefaut = parseFloat(r.valeur);
  });
  // Matériaux
  mData.forEach(r => {
    matData[r.materiau] = {
      facteur: parseFloat(r.facteur_emission),
      distRef: parseFloat(r.distance_ref)
    };
  });
  // Transport : on prend camion comme redondance
  tData.forEach(r => {
    transportFacteur = Math.max(transportFacteur, parseFloat(r.facteur_transport));
  });
  // Init formulaire
  document.addEventListener("DOMContentLoaded", () => ajouterLigne());
  document.getElementById("ecoForm").addEventListener("submit", calculerEmission);
});

function chargerCSV(path) {
  return new Promise((res, rej) => {
    Papa.parse(path, {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: results => res(results.data),
      error: err => rej(err)
    });
  });
}

function ajouterLigne() {
  materiauCompteur++;
  const div = document.createElement('div');
  div.className = 'ligne-materiau';
  div.innerHTML = `
    <label>Matériau n°${materiauCompteur} :</label>
    <select name="materiau" required>
      <option value="">--Choisir--</option>
      ${Object.keys(matData).map(m => `<option value="${m}">${m}</option>`).join('')}
    </select>
    <input type="number" name="masse" placeholder="Masse (kg)" min="0">
    <input type="number" name="distance" placeholder="Distance (km)" min="0">
    <button type="button" class="remove-button" onclick="supprimerLigne(this)">X</button>
  `;
  document.getElementById('materiauxContainer').appendChild(div);
}

function supprimerLigne(btn) {
  btn.parentElement.remove();
  reindexer();
}

function reindexer() {
  const lignes = document.querySelectorAll('.ligne-materiau');
  materiauCompteur = lignes.length;
  lignes.forEach((l, i) =>
    l.querySelector('label').textContent = `Matériau n°${i+1} :`
  );
}

function calculerEmission(e) {
  e.preventDefault();
  let totalCO2 = 0;
  const consoUser = parseFloat(document.getElementById("conso").value) || consoDefaut;
  totalCO2 += consoUser * energie;

  document.querySelectorAll('.ligne-materiau').forEach(ligne => {
    const mat = ligne.querySelector('select').value;
    if (matData[mat]) {
      const { facteur, distRef } = matData[mat];
      const masseT = parseFloat(ligne.querySelector('[name="masse"]').value) / 1000 || 0;
      const dist = parseFloat(ligne.querySelector('[name="distance"]').value) || distRef;
      totalCO2 += masseT * facteur + dist * transportFacteur;
    }
  });

  document.getElementById('resultat').innerText =
    `Émission totale estimée : ${totalCO2.toFixed(2)} kg CO₂ équivalent.`;
}
