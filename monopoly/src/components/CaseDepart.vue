<template>
  <v-card class="depart" v-bind:class="[position]">
    <v-card-title class="title-depart"> Départ </v-card-title>
    <div class="sous-nom-depart">
        Recevez 200€ chaque fois<br> que vous passez ici
    </div>
    <div class="image-depart">
      <img src="../assets/images/fleche.png" alt="départ" />
    </div>
  </v-card>
</template>

<script>
export default {
props: {
    position: String,
    } 
}
</script>

<style scoped>
.depart {
  width: 300px;
  height: 300px;
  border: solid 2px;
  border-radius: 5px;
}

.title-depart {
  text-align: center;
  font-weight: bold;
  margin-top:20px;
  font-size: 40px;
  justify-content: center;
}
.sous-nom-depart {
  text-align: center;
  justify-content: center;
  margin-top: 20px;
}

.image-depart {
  height: 1px;
  width: 100px;
  margin-top: 60px;
  margin-left: 75px;
  margin-right: 75px;
}
.top {
    transform: rotate(180deg);
}
.left {
    transform: rotate(90deg);
}
.right {
    transform: rotate(270deg);
}
</style>