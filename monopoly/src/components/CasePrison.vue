<template>
    <v-card class="prison" v-bind:class="[position]">
        <v-card-title class="title-allez">
            ALLEZ EN
        </v-card-title>
        <div class="image-prison">
             <img src="../assets/images/gardien.png" /> 
        </div>
        <v-card-title class="text-prison">
            PRISON
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
.prison {
width: 300px;
height: 300px;
border: solid 2px;
border-radius: 5px;
}

.title-allez {
 text-align: center;
 font-weight: bold;
 font-size: 30px;
 margin-top: 15%;
 justify-content: center;
}

.image-prison{
    height: 1px;
    width: 100px;
    margin-top: 5%;
    margin-bottom: 5%;
    margin-left: auto;
    margin-right: auto;
}

.text-prison {
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

