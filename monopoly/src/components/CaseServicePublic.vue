<template>
  <v-card class="services" v-bind:class="[position]" @click="affichageService()">
    <div class="color-services"></div>
    <v-card-title class="title-services">
      {{ nom }}
    </v-card-title>
    <div class="image-services">
      <img v-if="afficheimage()" :src="imagefinal" />
    </div>
    <div class="prix-services">€ {{ loyer }}</div>
  </v-card>
</template>

<script>
import Cartes_propriete_gares_services from "../Cartes_propriete_gares_services.json";
export default {
  props: {
    image: Number,
    nom: String,
    loyer: Number,
    position: String,
  },
  data: () => ({
    imagefinal: null,
    carte: {},
    services: [],
    
  }),
  created(){
    this.proprietes = Cartes_propriete_gares_services[2];
  },
  methods: {
    afficheimage() {
      if (this.image == 1) {
        this.imagefinal = require("../assets/images/ampoule.png");
      } else {
        this.imagefinal = require("../assets/images/robinet.png");
      }
      return true;
    },
  affichageService: function() {
    this.$emit("service");
  }
  }
};
</script>

<style scoped>
.services {
  width: 200px;
  height: 300px;
  border: solid 2px;
  border-radius: 5px;
  position: relative;
}
.color-services {
  height: 20%;
}
.title-services {
  text-align: center;
  font-weight: bold;
  position: absolute;
  top: 0;
  word-break: break-word;
}
.sous-nom-services {
  text-align: center;
  justify-content: center;
}

.image-services {
  height: 1px;
  width: 100px;
  margin-top: 5px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 60px;
}


.prix-services {
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
  transform: rotate(90deg);
}
.right {
  transform: rotate(270deg) translate(50px, 50px);
}
</style>

