const express = require('express');
const cors = require('cors');
// const path = require('path'); pour le deploiement en ligne
const app = express();
app.use(cors());


// ajout de socket.io
const server = require('http').Server(app)
const io = require('socket.io')(server, {
   cors: {
      origin: '*',
   }
})

// app.use('/', express.static(path.join(__dirname + '/../monopoly/dist'))) pour le deploiement en ligne

var joueurs = [];
var index = 0;
var ordre = [];
var indexOrdre = 0;
var tabEnchere = [];

// établissement de la connexion
io.on('connection', (socket) => {

   console.log(`Connecté au client ${socket.id}`);
   socket.emit("connection");


   // ecoute du nom  
   socket.on('nom', data => {
      joueurs[index] = {
         nom: data,
         prison: false,
         tourPrison: 0,
         deplLeft: 150,
         deplTop: 300,
         caseVisitees: 0,
         retDepl: 0,
         inventaire: {
            argent: 1500,
            proprietes: [],
            gares: [],
            services: [],
            cartePrison: []
         },
      }
      index++;
      io.emit("envoiNom", joueurs);
   });

   // lancement de la partie
   socket.on('launch', () => {
      io.emit('ordre');
   });

   //ordre joueur
   socket.on('ordreJ', (data) => {
      ordre[indexOrdre]=data;
      indexOrdre++;
      if(indexOrdre==joueurs.length){
         if(ordreEgal()){
            ordre = [];
            indexOrdre=0;
            io.emit('ordre');
         }
         else{
            joueurs = triJoueur()
            io.emit("start",joueurs)
         }
      }
   });

   // changement après un non double de la prison
   socket.on('changerJoueur',(data)=>{
      io.emit('changer',data)
   });

   // effet de la case départ
   socket.on('prison', (data) => {
      io.emit("etatJoueurs", data)
   });

   // etat prison du joueur 
   socket.on('achat', (data) => {
      io.emit("etatAchat", data)
   });

   // etat prison du joueur 
   socket.on('sortiPrison', (data) => {
      io.emit("etatJoueurs", data)
   });

   // debut enchere
   socket.on('miseEnchere',(data)=>{
      for(let i=0;i<joueurs.length;i++){
         tabEnchere[i]=joueurs[i].nom;
      }
      console.log("tab enchere : "+tabEnchere)
      let donnes = {
         tab : tabEnchere,
         data : data
      };
      io.emit('propEnchere', donnes);
   });

   // proposition enchere
   socket.on("propositionEnchere", (data)=>{
      let donnes = {
         tab : tabEnchere,
         data : data
      };
      io.emit("propEnchere",donnes);
   });

   // fin enchere
   socket.on("finEnchere",(data) =>{
      let indexOskour = 0;
      for(let i=0;i<tabEnchere.length;i++){
         if(data.nom===tabEnchere[i]){
            indexOskour = i;
         }
      }
      tabEnchere.splice(indexOskour,1);
      if(tabEnchere.length===1){
         io.emit("finEnchere",data.data);
      }
      else{
         let donnes = {
            tab : tabEnchere,
            data : data.data
         };
         io.emit("propEnchere",donnes)
      }
   });

   // chanceCom
   socket.on('chanceCom', (data) =>{
      io.emit('chanceCom',data);
   });

   //achat batiment
   socket.on('achatBat',(data) =>{
      io.emit('achatBat',data)
   })

   // fin de la partie
   socket.on('end', () => {
      io.emit("finPartie");
   });
});

function ordreEgal(){
   let egal = false;
   for(let i=0;i<ordre.length;i++){
      if(i>0){
         egal = ordre[i].lancer==ordre[i-1].lancer;
      }
   }
   return egal;
}

function triJoueur(){
   let joue = [];
   for(let i=0;i<ordre.length-1;i++){
      for(let j=0;j<ordre.length;j++){
         if(j>0){
            if(ordre[j].lancer>ordre[j-1].lancer){
               let t = ordre[j];
               ordre[j] = ordre[j-1];
               ordre[j-1]=t
            }
         }
      }
   }
   for(let k=0;k<ordre.length;k++){
      for(let l=0;l<joueurs.length;l++){
         if(ordre[k].nom===joueurs[l].nom){
            joue[k]=joueurs[l]
         }
      }
   }

   return joue;
}

// on change app par server
server.listen(3000, function () {  // mettre process.env.PORT à la place de 3000 pour le deploiement en ligne
   console.log('Votre app est disponible sur localhost:3000 !')
})
