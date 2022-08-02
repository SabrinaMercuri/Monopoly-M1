<template>
  <v-card class="propriete">
    <div>
      <div class="color-propriete" :style="{ backgroundColor: carte.Color }">
        <div class="type-carte">
          TITRE DE PROPRIETE
        </div>
        <v-card-title class="title-propriete">
          {{ carte.nom }}
        </v-card-title>
        <div class="sous-nom-propriete">
          {{ carte.sous_nom }}
        </div>
      </div>
      <div class="prix-propriete">
        <table>
          <tr>
            <td class="tab">Loyer</td>
            <td class="tab">Terrain nu</td>
            <td class="tab">€ {{ carte.loyer[0] }}</td>
          </tr>
          <tr>
            <td class="tab">Loyer</td>
            <td class="tab">avec 1 Maison</td>
            <td class="tab">€ {{ carte.loyer[1] }}</td>
          </tr>
          <tr>
            <td class="tab">Loyer</td>
            <td class="tab">avec 2 Maisons</td>
            <td class="tab">€ {{ carte.loyer[2] }}</td>
          </tr>
          <tr>
            <td class="tab">Loyer</td>
            <td class="tab">avec 3 Maisons</td>
            <td class="tab">€ {{ carte.loyer[3] }}</td>
          </tr>
          <tr>
            <td class="tab">Loyer</td>
            <td class="tab">avec 2 Maisons</td>
            <td class="tab">€ {{ carte.loyer[4] }}</td>
          </tr>
          <tr>
            <td class="tab">Loyer</td>
            <td class="tab">avec Hôtel</td>
            <td class="tab">€ {{ carte.loyer[5] }}</td>
          </tr>
        </table>
      </div>
      <div class="explications">
        <hr>
        Si un joueur possède TOUS les terrains d'un Groupe de Couleur
        quelconque, le loyer des terrains nus de ce groupe est double.
        <hr>
      </div>
      <div class="batiments">
        <table>
        <tr>
            <td class="tab1"> Prix des Maisons,</td>
            <td class="tab1">€ {{carte.batiment[0] }} chacune </td>
          </tr>
        <tr>
            <td class="tab1"> Prix d'un Hôtel,</td>
            <td class="tab1">€ {{carte.batiment[1] }} plus 4 maisons </td>
          </tr>
        </table>
      </div>
      <div class="hypotheque">
          Valeur Hypothécaire du terrain : € {{carte.hypotheque}}
      </div>
    </div>
    <div></div>
  </v-card>
</template>

<script>
export default {
  props: {
    carte: Object,
  },
};
</script>

<style scoped>
.propriete {
  width: 500px;
  height: 800px;
  border: solid 2px;
  border-radius: 5px;
}

.color-propriete {
  height: 150px;
}

.type-carte {
  padding-top: 4px;
  font-size: 1.5em;
  text-align: center;
}

.title-propriete {
  text-align: center;
  font-weight: bold;
  word-break: break-word;
  justify-content: center;
  font-size: 200%;
}

.sous-nom-propriete {
  text-align: center;
  justify-content: center;
  font-size: 150%;
}

.prix-propriete {
  justify-content: space-between;
  width: 100%;
  margin-top: 5%;
  font-size: large;
  font-size: 150%;
}

.explications {
  margin-top: 30px;
  text-align: center;
  font-size: 150%;
}

.batiments {
  margin-top: 20px;
  text-align: center;
  font-size: 150%;
  margin-top: 30px;
  font-weight: bold;
}

.hypotheque {
  /*position: absolute;
  bottom: 0;*/
  text-align: center;
  font-size: 150%;
  margin-top: 50px;
}
.tab {
  padding-right: 40px;
  padding-left: 20px;
}
.tab1 {
  padding-right: 10px;
  padding-left: 10px;
}
</style>