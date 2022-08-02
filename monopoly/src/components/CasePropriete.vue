<template>
  <v-card
    class="propriete"
    v-bind:class="[position]"
    @click="affichagePropriete()"
  >

    <div v-if="maison == 0" class="color-propriete" :style="{ backgroundColor: monopole }"></div>
    <div v-else-if="maison == 1" class="color-propriete" :style="{ backgroundColor: monopole }"><img :src="maisonimage"/></div>
    <div v-else-if="maison == 2" class="color-propriete" :style="{ backgroundColor: monopole }"><img :src="maisonimage"/><img :src="maisonimage"/></div>
    <div v-else-if="maison == 3" class="color-propriete" :style="{ backgroundColor: monopole }"><img :src="maisonimage"/><img :src="maisonimage"/><img :src="maisonimage"/></div>
    <div v-else-if="maison == 4" class="color-propriete" :style="{ backgroundColor: monopole }"><img :src="maisonimage"/><img :src="maisonimage"/><img :src="maisonimage"/><img :src="maisonimage"/></div>
    <div v-else class="color-proprietehotel" :style="{ backgroundColor: monopole}"><img :src="hotelimage" style="margin-top: -5px"/></div>
    <v-card-title class="title-propriete">
      {{ nom }}
    </v-card-title>
    <div class="sous-nom-propriete">
      {{ sous_nom }}
    </div>
    <div class="prix-propriete">€ {{ loyer }}</div>
   
  </v-card>
</template>

<script>
import Cartes_propriete_gares_services from "../Cartes_propriete_gares_services.json";
export default {
  components: {
  },
  data: () => ({
    carte: {},
    proprietes: [],
    maisonimage : require("../assets/images/Maison.png"),
    hotelimage : require("../assets/images/Hotel.png")
    
  }),
  props: {
    monopole: String,
    nom: String,
    proprietaire: String,
    sous_nom: String,
    loyer: Number,
    position: String,
    maison: Number,
  },
  created() {
    this.proprietes = Cartes_propriete_gares_services[0];
    for (let i = 0; i < this.proprietes.length; i++) {
      if (this.monopole === this.proprietes[i][0].Color) {
        for (let j = 0; j < this.proprietes[i].length; j++) {
          if (this.nom === this.proprietes[i][j].nom) {
            this.carte = this.proprietes[i][j];
          }
        }
      }
    }
  },
  methods: {
    affichagePropriete: function () {
      this.$emit("propriete");
    },
  },
};
</script>

<style scoped>
.propriete {
  width: 200px;
  height: 300px;
  border: solid 2px;
  border-radius: 5px;
  position: relative;
}

.color-propriete {
  height: 20%;
}

.color-proprietehotel {
  height: 20%;
  text-align: center;
}

.title-propriete {
  text-align: center;
  font-weight: bold;
  word-break: break-word;
  justify-content: center;
}

.sous-nom-propriete {
  text-align: center;
  justify-content: center;
  margin-top: -20px;
}

.prix-propriete {
  text-align: center;
  width: 100%;
  margin-top: 80%;
  position: absolute;
  bottom: 0;
  font-weight: bold;
  font-size: large;
}
.top {
  transform: rotate(180deg);
}
.left {
  transform: rotate(90deg) translate(-50px, -50px);
  margin-right: 100px;
}
.right {
  transform: rotate(270deg) translate(50px, 50px);
}
.dialog {
  position: relative;
  width: 500;
  height: 800;
}
</style>