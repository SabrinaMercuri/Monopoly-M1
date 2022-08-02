<template>
  <v-card class="chance">
    <div class="bordure">
        <v-card-title class="title-chance">
          {{ carte.nom }}
        </v-card-title>
        <div class="explications">
          {{ carte.description }}
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
.chance{
  width: 800px;
  height: 500px;
  border: double 2px red;
  border-radius: 5px;
  border-width: 20px;
}

.title-chance {
  text-align: center;
  font-weight: bold;
  word-break: break-word;
  justify-content: center;
  font-size: 300%;
  color: red;
  margin-top: 12%;
}

.explications {
  margin-top: 30px;
  text-align: center;
  font-size: 180%;
  color: red;
  margin-left: 20px;
  margin-right: 20px;
}

</style>