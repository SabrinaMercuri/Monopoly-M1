<template>
  <v-card class="gare">
    <img v-if="afficheimage()" :src="imagefinal" />
    <v-card-title class="title-gare">
      {{ carte.nom }}
    </v-card-title>
    <br />
    <div class="prixAchat">
        <table>
        <tr>
            <td class="tab"> Loyer</td>
            <td class="tab">€ {{ carte.loyer[0] }}</td>
          </tr>
        <tr>
            <td class="tab"> Loyer si vous avez 2 gares</td>
            <td class="tab">€ {{ carte.loyer[1] }}</td>
          </tr>
          <tr>
            <td class="tab"> Loyer si vous avez 3 gares</td>
            <td class="tab">€ {{ carte.loyer[2] }}</td>
          </tr>
          <tr>
            <td class="tab"> Loyer si vous avez 4 gares</td>
            <td class="tab">€ {{ carte.loyer[3] }}</td>
          </tr>
        </table>
    </div>
    <div class="hypotheque">Valeur Hypothécaire : € {{ carte.hypotheque }}</div>
  </v-card>
</template>

<script>
export default {
  props: {
    carte: Object,
  },
  data: () => ({
    imagefinal: null,
  }),
  methods: {
    afficheimage() {
      if (this.carte.image == 0) {
        this.imagefinal = require("../assets/images/avion.png");
      } else if (this.carte.image == 1) {
        this.imagefinal = require("../assets/images/bateau.png");
      } else {
        this.imagefinal = require("../assets/images/Gare.png");
      }
      return true;
    },
  },
};
</script>

<style scoped>
.gare {
  width: 500px;
  height: 800px;
  border: solid 2px;
  border-radius: 5px;
  position: relative;
}

img {
  width: 60%;
  height: 35.7%;
  margin-left: 20%;
  margin-top: 10%;
}

.title-gare {
  text-align: center;
  font-weight: bold;
  word-break: break-word;
  justify-content: center;
  font-size: 230%;
  margin-top: 20px;
}

.prixAchat {
  justify-content: space-between;
  width: 100%;
  margin-top: 5%;
  font-size: large;
  font-size: 150%;
}
.hypotheque {
  text-align: center;
  font-size: 150%;
  margin-top: 50px;
}
.tab {
  padding-right: 45px;
  padding-left: 20px;
}
</style>