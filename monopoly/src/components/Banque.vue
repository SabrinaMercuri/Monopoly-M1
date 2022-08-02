<template>
  <v-card>
    <h1>Propriétés</h1>
    <v-card v-for="(monopole, index) in banque.proprietes" :key="index">
        <v-card v-for="(item,j) in monopole" :key="j">
          <v-card-title v-if="j===0" :style="{backgroundColor:item.Color}"></v-card-title>
          <v-card-text>{{ item.nom }} </v-card-text>
        </v-card> 
    </v-card>
    <h1>Gares</h1>
    <v-card v-for="(monopole, index) in banque.gares" :key="index">
          <v-card-text>nom : {{ monopole.nom }} </v-card-text>
    </v-card>
    <h1>Services</h1>
    <v-card v-for="(monopole, index) in banque.services" :key="index">
        <v-card-text>nom : {{ monopole.nom }} </v-card-text>
    </v-card>
  </v-card>
</template>

<script>
export default {
  props: {
    banque: Object,
  },
};
</script>