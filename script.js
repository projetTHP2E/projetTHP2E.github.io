document.getElementById("ecoForm").addEventListener("submit", function (e) {
  e.preventDefault(); // empêche le rechargement

  const materiau = document.getElementById("materiau").value;
  const masse = parseFloat(document.getElementById("masse").value);
  const distance = parseFloat(document.getElementById("distance").value);
  const conso = parseFloat(document.getElementById("conso").value);

  // Simulation de score écologique (remplacera la base plus tard)
  let score = conso;

  // Impact carbone simulé par matériau (à remplacer par ta base réelle plus tard)
  const facteurMateriau = {
    "bois": 0.2,
    "béton": 0.8,
    "verre": 1.2
  };

  // Formule simplifiée : conso + (masse * facteur) + (distance * 0.05)
  if (materiau in facteurMateriau) {
    score += masse * facteurMateriau[materiau] + distance * 0.05;
  } else {
    score += 9999; // erreur
  }

  document.getElementById("resultat").innerText =
    "Estimation de consommation énergétique : " + score.toFixed(2) + " unités.";
});
