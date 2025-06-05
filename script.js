let compteur = 1;

function ajouterLigne() {
  const container = document.getElementById("materiauxContainer");

  const div = document.createElement("div");
  div.className = "ligne-materiau";

  div.innerHTML = `
    <label>Matériau n°${compteur} :</label>
    <select name="materiau" required>
      <option value="">--Choisir--</option>
      <option value="bois">Bois</option>
      <option value="béton">Béton</option>
      <option value="verre">Verre</option>
      <option value="acier">Acier</option>
    </select>
    <input type="number" name="masse" placeholder="Masse (kg)" required>
    <input type="number" name="distance" placeholder="Distance (km)" required>
    <button type="button" class="remove-button" onclick="supprimerLigne(this)">X</button>
  `;

  container.appendChild(div);
  compteur++;
}

// Supprimer une ligne
function supprimerLigne(bouton) {
  const ligne = bouton.parentNode;
  ligne.parentNode.removeChild(ligne);
}

document.getElementById("ecoForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const conso = parseFloat(document.getElementById("conso").value);
  const lignes = document.querySelectorAll("#materiauxContainer .ligne-materiau");

  const facteurMateriau = {
    "bois": 0.2,
    "béton": 0.8,
    "verre": 1.2,
    "acier": 2.0
  };

  let score = conso;

  lignes.forEach(ligne => {
    const materiau = ligne.querySelector("select").value;
    const masse = parseFloat(ligne.querySelector("input[name='masse']").value);
    const distance = parseFloat(ligne.querySelector("input[name='distance']").value);

    if (materiau in facteurMateriau) {
      score += masse * facteurMateriau[materiau] + distance * 0.05;
    } else {
      score += 9999; // erreur
    }
  });

  document.getElementById("resultat").innerText =
    "Estimation de consommation énergétique : " + score.toFixed(2) + " unités.";
});

// Initialiser avec une première ligne
window.onload = () => ajouterLigne();
