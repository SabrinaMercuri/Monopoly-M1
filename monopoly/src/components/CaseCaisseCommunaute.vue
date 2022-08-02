<template>
    <v-card class="communaute" v-bind:class="[position]">
        <v-card-title class="title-communaute">
            CAISSE DE COMMUNAUTÉ
        </v-card-title>
        <div class="image-communaute">
            <img src="../assets/images/coffre.png" /> 
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
.communaute {
width: 200px;
height: 300px;
border: solid 2px;
border-radius: 5px;
}

.title-communaute {
text-align: center;
font-weight: bold;
margin-top: 30%;
font-size: 20px;
position: absolute;
margin-top: 10px;

}

.image-communaute{
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
    transform: rotate(90deg) translate(-50px,-50px);
    margin-right: 100px;
}
.right {
    transform: rotate(270deg) translate(50px,50px);
}
</style>