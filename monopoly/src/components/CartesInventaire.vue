<template>
<div > 
  <v-card class="inventaire">
    <v-card-title class="title-inventaire">  <span :class="this.carteInventaire.nom">{{ this.carteInventaire.nom }} </span>
            <div class="argent"> {{ this.carteInventaire.inventaire.argent }} €</div>
    </v-card-title>
    <div class="separation">
    <div class="organisation">
    <h1>Propriétés</h1>
    <v-card class="carte" v-for="(monopole, index) in carteInventaire.inventaire.proprietes" :key="index">
        <v-card-title
          :style="{ backgroundColor: monopole.Color }"
        ></v-card-title>
        <v-card-text>{{ monopole.nom }} </v-card-text>
    </v-card>
    </div>  
        <div class="organisation">
    <h1>Gares</h1>
    <v-card class="carte" v-for="(gare, index) in carteInventaire.inventaire.gares" :key="index">
      <v-card-text>{{ gare.nom }} </v-card-text>
    </v-card>
    </div>  
        <div class="organisation">
    <h1>Services</h1>
    <v-card class="carte" v-for="(service, index) in carteInventaire.inventaire.services" :key="index">
      <v-card-text>{{ service.nom }} </v-card-text>
    </v-card>
    </div> 
    <div class="organisation">
    <h1>Cartes Prison</h1>
    <v-card class="carte" v-for="(service, index) in carteInventaire.inventaire.cartePrison" :key="index">
      <v-card-text>{{ service.label }} </v-card-text>
    </v-card>
    </div>  
    </div>
  </v-card>
</div>  
</template>

<script>
import Cartes_propriete_gares_services from "../Cartes_propriete_gares_services.json";
export default {
  data: () => ({
    jsonPropriete:[],
    card:{}
  }),
  props: {
    carteInventaire: Object,
  },
  created() {
      this.jsonPropriete = Cartes_propriete_gares_services;
  },
};
</script>

<style scoped>
.carte {
  width: 200px;
  height: 250px;
  border: solid 2px;
  border-radius: 5px;
  position: relative;
}

.title-cartes {
  text-align: center;
  font-weight: bold;
  word-break: break-word;
  justify-content: center;
}

.title-inventaire{
  font-weight: bold;
  font-size: 250%;
  justify-content: center;
}

.argent{
  margin-left: 10%;
}

.Joueur1 {
    color: red;
}
.Joueur2 {
    Color: blue;
}

.separation {
width: auto;
  height: auto;
  position: relative;
  display: flex;
}

.organisation{
  margin-left:10px;
}

.inventaire{
  z-index: 20000000000;
}
</style>