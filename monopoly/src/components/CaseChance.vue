<template>
  <v-card class="chance" v-bind:class="[position]">
    <v-card-title class="title-chance"> CHANCE </v-card-title>
    <div class="image-chance">
      <img src="../assets/images/chance.png" />
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    position: String,
  },
};
</script>

<style scoped>
.chance {
  width: 200px;
  height: 300px;
  border: solid 2px;
  border-radius: 5px;
  position: relative;
}

.title-chance {
  text-align: center;
  font-weight: bold;
  margin-top: 30%;
  font-size: 20px;
  position: absolute;
  margin-left: 40px;
  margin-top: 10px;
  
}

.image-chance {
  height: 1px;
  width: 100px;
  margin-top: 5%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 120px;
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
</style>