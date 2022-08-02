<template>
  <v-card class="taxe" v-bind:class="[position]">
    <v-card-title class="title-taxe">
      {{ nom }}
    </v-card-title>

    <div class="image-taxes">
      <img :src="srcImg" alt="départ" />
    </div>
    <v-card-title class="prix-taxe"> € {{ prix }} </v-card-title>
  </v-card>
</template>



<script>
export default {
  props: {
    nom: String,
    prix: Number,
    position: String,
  },
  data: () => ({
    srcImg: "",
  }),
  mounted() {
    this.getImg();
  },
  methods: {
    getImg: function () {
      if (this.nom === "IMPOTS") {
        this.srcImg = require("../assets/images/losange.png");
      } else {
        this.srcImg = require("../assets/images/bague.png");
      }
    },
  },
};
</script>

<style scoped>
.title-taxe {
  width: 200px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 40px;
}

.title-impots {
  width: 200px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 30px;
}

.taxe {
  width: 200px;
  height: 300px;
  border: solid 2px;
  border-radius: 5px;
}

.impots {
  width: 204px;
  height: 300px;
  border: solid 2px;
  border-radius: 5px;
}

.prix-taxe {
  text-align: center;
  justify-content: center;
  margin-top: 170px;
  font-weight: bold;
  font-size: large;
}

.image-taxes {
  height: 1px;
  width: 100px;
  margin-bottom: 40px;
  margin-left: 25px;
  margin-right: 75px;
}

.image-impots {
  width: 50px;
  margin-left: 70px;
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
