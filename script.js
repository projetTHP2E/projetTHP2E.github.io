document.getElementById("ecoForm").addEventListener("submit", function (e) {
  e.preventDefault(); // empêche le rechargement de la page

  const conso = parseFloat(document.getElementById("conso").value);
  if (isNaN(conso)) {
    alert("Veuillez renseigner une consommation énergétique valide.");
    return;
  }

  // Facteurs d'impact carbone par matériau
  const facteurMateriau = {
    "bois": 0.2,
    "béton": 0.8,
    "verre": 1.2
  };

  let score = conso; // point de départ

  // Récupérer toutes les lignes matériaux
  const lignesMateriaux = document.querySelectorAll("#materiauxContainer .ligne-materiau");

  for (let ligne of lignesMateriaux) {
    const selectMat = ligne.querySelector('select[name="materiau"]');
    const inputMasse = ligne.querySelector('input[name="masse"]');
    const inputDistance = ligne.querySelector('input[name="distance"]');

    const materiau = selectMat.value;
    const masse = parseFloat(inputMasse.value);
    const distance = parseFloat(inputDistance.value);

    if (!materiau || isNaN(masse) || isNaN(distance)) {
      alert("Veuillez remplir tous les champs des matériaux correctement.");
      return;
    }

    if (materiau in facteurMateriau) {
      score += masse * facteurMateriau[materiau] + distance * 0.05;
    } else {
      alert("Matériau non reconnu: " + materiau);
      return;
    }
  }

  document.getElementById("resultat").innerText =
    "Estimation de consommation énergétique pondérée : " + score.toFixed(2) + " unités.";
});