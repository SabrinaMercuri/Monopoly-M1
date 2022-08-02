<template>
    <v-card class="parcgratuit" v-bind:class="[position]">
        <v-card-title class="title-parcgratuit">
            PARC
        </v-card-title>
        <div class="image-parcgratuit">
             <img src="../assets/images/voiture.png" alt="parc gratuit"/> 
        </div>
        <v-card-title class="text-parcgratuit">
            GRATUIT
        </v-card-title>
    </v-card>
</template>

<script>
export default {
   props: {
       monopole: String,
       nom: String,
       sous_nom: String,
       loyer: Number,
       position: String,
   } 
}
</script>

<style scoped>
.parcgratuit {
width: 300px;
height: 300px;
border: solid 2px;
border-radius: 5px;
}

.title-parcgratuit {
 text-align: center;
 font-weight: bold;
 font-size: 30px;
 margin-top: 15%;
 justify-content: center;
}

.image-parcgratuit{
    height: 1px;
    width: 100px;
    margin-top: 5%;
    margin-bottom: 5%;
    margin-left: auto;
    margin-right: auto;
}

.text-parcgratuit {
 text-align: center;
 font-weight: bold;
 font-size: 30px;
 margin-top: 40%;
 justify-content: center;
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

