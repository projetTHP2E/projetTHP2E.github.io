// Ajoute une nouvelle ligne matériau
function ajouterLigne() {
  const container = document.getElementById("materiauxContainer");

  const nouvelleLigne = document.createElement("div");
  nouvelleLigne.className = "ligne-materiau";

  nouvelleLigne.innerHTML = `
    <label>Matériau :</label>
    <select name="materiau" required>
      <option value="">--Choisir--</option>
      <option value="bois">Bois</option>
      <option value="béton">Béton</option>
      <option value="verre">Verre</option>
    </select>
    <input type="number" name="masse" placeholder="Masse (kg)" min="0" step="any" required />
    <input type="number" name="distance" placeholder="Distance (km)" min="0" step="any" required />
    <button type="button" class="remove-button" onclick="supprimerLigne(this)">✖</button>
  `;

  container.appendChild(nouvelleLigne);
}

// Supprime une ligne matériau donnée
function supprimerLigne(btn) {
  btn.parentElement.remove();
}

// Traitement du formulaire
document.getElementById("ecoForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const conso = parseFloat(document.getElementById("conso").value);
  if (isNaN(conso) || conso < 0) {
    alert("Veuillez renseigner une consommation énergétique valide (≥ 0).");
    return;
  }

  // Facteurs d'impact carbone par matériau
  const facteurMateriau = {
    bois: 0.2,
    béton: 0.8,
    verre: 1.2,
  };

  let score = conso;

  const lignesMateriaux = document.querySelectorAll("#materiauxContainer .ligne-materiau");

  for (let ligne of lignesMateriaux) {
    const selectMat = ligne.querySelector('select[name="materiau"]');
    const inputMasse = ligne.querySelector('input[name="masse"]');
    const inputDistance = ligne.querySelector('input[name="distance"]');

    const materiau = selectMat.value;
    const masse = parseFloat(inputMasse.value);
    const distance = parseFloat(inputDistance.value);

    if (!materiau) {
      alert("Veuillez choisir un matériau dans chaque ligne.");
      return;
    }
    if (isNaN(masse) || masse < 0) {
      alert("Veuillez entrer une masse valide (≥ 0) pour chaque matériau.");
      return;
    }
    if (isNaN(distance) || distance < 0) {
      alert("Veuillez entrer une distance valide (≥ 0) pour chaque matériau.");
      return;
    }

    if (!(materiau in facteurMateriau)) {
      alert(`Matériau non reconnu : ${materiau}`);
      return;
    }

    score += masse * facteurMateriau[materiau] + distance * 0.05;
  }

  document.getElementById("resultat").innerText =
    `Estimation de consommation énergétique pondérée : ${score.toFixed(2)} unités.`;
});
