document.addEventListener("DOMContentLoaded", function () {
  ajouterLigne();

  document.getElementById("ecoForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const conso = parseFloat(document.getElementById("conso").value);
    let score = conso;

    const facteurMateriau = {
      "bois": 0.2,
      "béton": 0.8,
      "verre": 1.2,
      "acier": 1.5
    };

    const lignes = document.querySelectorAll(".ligne-materiau");
    lignes.forEach(ligne => {
      const materiau = ligne.querySelector("select").value;
      const masse = parseFloat(ligne.querySelector("input[name='masse']").value);
      const distance = parseFloat(ligne.querySelector("input[name='distance']").value);

      if (materiau in facteurMateriau) {
        score += masse * facteurMateriau[materiau] + distance * 0.05;
      } else {
        score += 9999;
      }
    });

    document.getElementById("resultat").innerText =
      "Estimation de consommation énergétique : " + score.toFixed(2) + " unités.";
  });
});

function ajouterLigne() {
  const container = document.getElementById("materiauxContainer");

  const ligne = document.createElement("div");
  ligne.className = "ligne-materiau";

  ligne.innerHTML = `
    <label></label>
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

  container.appendChild(ligne);
  reindexerLignes();
}

function supprimerLigne(button) {
  const ligne = button.closest(".ligne-materiau");
  ligne.remove();
  reindexerLignes();
}

function reindexerLignes() {
  const lignes = document.querySelectorAll(".ligne-materiau");
  lignes.forEach((ligne, index) => {
    const label = ligne.querySelector("label");
    label.textContent = `Matériau n°${index + 1} :`;
  });
}
