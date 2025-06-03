let compteurMateriau = 1;

function ajouterLigne() {
  compteurMateriau++;

  const container = document.getElementById("materiauxContainer");

  const ligne = document.createElement("div");
  ligne.className = "ligne-materiau";

  ligne.innerHTML = `
    <label>Matériau n°${compteurMateriau} :</label>
    <select name="materiau" required>
      <option value="">--Choisir--</option>
      <option value="bois">Bois</option>
      <option value="béton">Béton</option>
      <option value="verre">Verre</option>
    </select>

    <input type="number" name="masse" placeholder="Masse (kg)" required>
    <input type="number" name="distance" placeholder="Distance (km)" required>
    <button type="button" class="remove-button" onclick="supprimerLigne(this)">x</button>
  `;

  container.appendChild(ligne);
}

function supprimerLigne(btn) {
  const ligne = btn.parentNode;
  ligne.remove();
}

document.getElementById("ecoForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const conso = parseFloat(document.getElementById("conso").value);
  const materiaux = document.querySelectorAll("#materiauxContainer .ligne-materiau");

  if (materiaux.length === 0) {
    alert("Ajoutez au moins un matériau.");
    return;
  }

  let score = conso;
  const facteurMateriau = {
    "bois": 0.2,
    "béton": 0.8,
    "verre": 1.2
  };

  materiaux.forEach(ligne => {
    const type = ligne.querySelector('select').value;
    const masse = parseFloat(ligne.querySelector('input[name="masse"]').value);
    const distance = parseFloat(ligne.querySelector('input[name="distance"]').value);

    if (type && !isNaN(masse) && !isNaN(distance)) {
      const facteur = facteurMateriau[type] || 1.0;
      score += masse * facteur + distance * 0.05;
    }
  });

  document.getElementById("resultat").innerText =
    "Estimation de consommation énergétique : " + score.toFixed(2) + " unités.";
});
