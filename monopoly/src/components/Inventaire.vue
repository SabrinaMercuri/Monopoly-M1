<template>
<div>
    <v-card v-for="(joueur,index) in joueurs" :key="index" class="inventaire" @click="affichageInventaire(joueur)">
        <v-card-title class="title-inventaire">  <span :class="`J${index+1}`">{{ joueur.nom }} </span>
            <div class="argent"> {{ joueur.inventaire.argent }} €</div>
        </v-card-title>
        <div v-for="(propriete, index) in joueur.inventaire.proprietes" :key="index" class="proprietes" :style="{ backgroundColor: propriete.Color }"></div>
        <div v-for="(gare, index2) in joueur.inventaire.gares" :key="index2" class="proprietes" id="gare">G</div>
        <div v-for="(service, index3) in joueur.inventaire.services" :key="index3" class="proprietes" id="service">S</div>
        <div v-for="(carte, index4) in joueur.inventaire.cartePrison" :key="index4" class="proprietes" id="service">P</div>
    </v-card>
</div>
</template>

<script>
export default {
    data: () => ({
    carteInventaire: {},

  }),
    props:{
        joueurs:Array, 
    },
    methods: {
    affichageInventaire: function (joueur) {
      this.$emit("inventaire", joueur);
    },
  },
}
</script>

<style scoped>
.inventaire {
    margin-left: 5%;
    margin-bottom: 5%;
    width: 600px;
    height: 1000px;
    border: solid 5px;
    border-radius: 10px;
    position: relative;
    
}

.title-inventaire {
    text-align: left;
    font-weight: bold;
    word-break: break-word;
    font-size: 2em;
    
}

.argent{
    margin-left: 10%;
}

.J1 {
    color: red;
}
.J2 {
    Color: blue;
}
.proprietes {
    width: 55px;
    height: 55px;
    border-radius: 5px;
}

#gare{
    border: solid black 1px ;
}

#service{
    border: solid black 1px ;
}
</style>