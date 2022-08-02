<template>
  <v-card class="hypothequee">
    <div>
        <div class="type-carte">
          HYPOTHEQUEE
        </div>
        <div>
            <hr>
        <v-card-title class="title-propriete">
          {{ carte.nom }}
        </v-card-title>
        <div class="hypotheque">
          Hypothéquée pour € {{ carte.hypotheque }}
        </div>
         <hr>
      </div>
      <div class="explications">
        Si cette propriété est hypothéquée, ce côté de la carte doit être mis en évidence sur le plateau. 
      </div>
    </div>
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

.hypothequee{
  width: 500px;
  height: 800px;
  /*border: solid 2px;
  border-radius: 5px;*/
  background-color: red;
  border: double 2px white;
  border-radius: 5px;
  border-width: 20px;
}

.type-carte {
  padding-top: 4px;
  font-size: 1.5em;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 350%;
  margin-bottom: 100px;
  margin-top: 30px;
}

.title-propriete {
  text-align: center;
  font-weight: bold;
  word-break: break-word;
  justify-content: center;
  font-size: 250%;
  color: white;
  margin-top: 30px;
}

.hypotheque {
  text-align: center;
  font-size: 250%;
  color: white;
  margin-bottom: 30px;
  
}

.explications {
  margin-top: 50px;
  text-align: center;
  font-size: 200%;
  color: white;
  margin-right: 10px;
  margin-bottom: 10px;
}

</style>