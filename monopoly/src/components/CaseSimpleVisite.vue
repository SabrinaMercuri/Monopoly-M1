<template>
  <v-card class="visiter" v-bind:class="[position]">
    <div class="simple-prison">
      <div class="simple">SIMPLE</div>
      <div class="prison">
        <div class="image-prison">
          <v-card-text>En</v-card-text>
          <img src="../assets/images/prison.png" alt="départ" />
          <v-card-text>Prison</v-card-text>
        </div>
      </div>
    </div>
    <div class="visite">VISITE</div>
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
.visiter {
  width: 300px;
  height: 300px;
  border: solid 2px;
  border-radius: 5px;
}

.simple-prison {
  display: flex;
}

.simple {
  width: 30%;
  height: 75px;
  margin-top:70px;
  margin-right: 10%;
  font-size: 20px;
  font-weight:bold;
  transform: rotate(90deg);
  word-break: break-word;
}

.prison {
  width: 80%;
  height: 200px;
  border: solid 1px;
  border-radius: 5px;
  background-color: #FF991A;
}

.image-prison {
  text-align: center;
  margin-left: 10px;
  transform: rotate(45deg);
  font-weight: bold;
  font-size: 25px;

}

.visite{
  height: 50px;
  width: 300px;
  margin-top: 25px;
  font-size: 20px;
  font-weight:bold;
  text-align: center;
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