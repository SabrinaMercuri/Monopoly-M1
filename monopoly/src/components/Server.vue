<template >
  <div id="base">
    <div v-if="!partie">
      <div v-if="connected">
        <div v-if="!nomEnvoyer">
          <p>Entrez votre nom :</p>
          <input type="text" placeholder="nom ..." v-model="nom" />
          <v-btn @click="envoiNom()">envoyer</v-btn>
        </div>
        <p>Joueurs présent :</p>
        <ul>
          <li v-for="(joueur, index) in joueurs" :key="index">
            <div v-if="nom === joueur.nom">{{ joueur.nom }} (vous)</div>
            <div v-if="nom !== joueur.nom">{{ joueur.nom }}</div>
          </li>
        </ul>
        <v-btn @click="launch()" :disabled="joueurs.length < 2">Lancer</v-btn>
      </div>
    </div>
    <div v-if="partie" class="ordre">
      <v-btn
        @click="jouer"
        :disabled="desactif || nom !== joueurs[numJoueur].nom"
        >Lancer</v-btn
      >
      <div class="ordre2">
        <h1>Ordre des joueurs :</h1>
        <h2 v-for="(joueur, index) in joueurs" :key="index">
          <span
            v-if="joueurs[numJoueur].nom === joueur.nom"
            :class="colJoueur()"
            >{{ index + 1 }} - {{ joueur.nom }}</span
          >
          <span v-if="joueurs[numJoueur].nom !== joueur.nom"
            >{{ index + 1 }} - {{ joueur.nom }}</span
          >
        </h2>
      </div>
    </div>
    <v-alert
      id="des"
      v-if="desactif"
      border="top"
      colored-border
      color="deep-black"
      elevation="2"
    >
      <p>Voici vos dés.</p>
      <img :src="affichedes[2]" alt="dé 1" />
      <img :src="affichedes[3]" alt="dé 2" />
    </v-alert>

    <div v-if="joueurs.length !== 0">
      <v-alert
        v-if="joueurs[numJoueur].prison && joueurs[numJoueur].nom === nom"
        id="prison"
        colored-border
        color="deep-black"
        elevation="2"
      >
        <h1 style="text-align: center">Vous êtes en prison.</h1>
        <h2 style="text-align: center">Que voulez vous faire?</h2>
        <div>
          <v-btn @click="prison(1)" text>Essayer de faire un double.</v-btn>
        </div>
        <div>
          <v-btn
            @click="prison(2)"
            :disabled="joueurs[numJoueur].inventaire.argent < 50"
            text
            >Payer 50 pour pouvoir sortir.</v-btn
          >
        </div>
        <div>
          <v-btn
            @click="prison(3)"
            :disabled="joueurs[numJoueur].inventaire.cartePrison.length == 0"
            text
            >Utiliser une carte "Vous êtes libéré de prison".</v-btn
          >
        </div>
      </v-alert>
    </div>
    <v-dialog v-model="achat" v-if="acheteur === nom" max-width="800px">
      <v-card>
        <h1 color="white">Achetez cette propiété</h1>
        <v-btn @click="ProposerAchat()">Oui</v-btn
        ><v-btn @click="miseEnchere()">Non</v-btn>
      </v-card>
    </v-dialog>
    <v-dialog v-model="enchere" max-width="800px">
      <div v-if="dataEnchere.nom === nom">
        <v-card>
          <v-card-title>En attente d'autres propositions </v-card-title>
          <v-card-text
            >Proposition actuelle : {{ dataEnchere.prixProp }}</v-card-text
          >
        </v-card>
      </div>
      <div v-if="dataEnchere.nom !== nom">
        <v-card>
          <v-card-title
            >Veuillez faire un proposition d'enchère supérieur ou décidez de ne
            plus participer</v-card-title
          >
          <v-card-text
            >Proposition actuelle : {{ dataEnchere.prixProp }}</v-card-text
          >
          <input
            type="text"
            placeholder="prix ..."
            v-model="dataEnchere.prixProp"
          />
          <v-btn @click="envoiProp()">Envoyer</v-btn>
          <v-btn @click="finEnchere()">Ne plus participer</v-btn>
        </v-card>
      </div>
    </v-dialog>
    <p v-if="partie">Tour numéro : {{ partieTerminer }}</p>
    <div v-if="partie">
      <div
        v-for="(joueur, index) in joueurs"
        :key="index"
        :class="`pion${index}`"
        :style="`left:${joueur.deplLeft}px;top:${joueur.deplTop}px;`"
      ></div>
    </div>
    <div class="organisation">
    <Plateau v-if="partie" :joueurs="joueurs" class="plateau" @achatBatiment = "achatBatiment($event)" :banque="banque.proprietes" />
    <Inventaire v-if="partie" :joueurs="joueurs" v-on:inventaire="affichageClick($event)"/>
    </div>
    <v-dialog v-model="dialog" max-width="1000px">
      <CartesInventaire :carteInventaire="carteInventaire" />
    </v-dialog>
    <v-dialog v-model="dialog2" max-width="800px" v-if="nomChanceCom === nom">
      <CartesChanceCommunaute :carte="carte" />
    </v-dialog>
  </div>
</template>



<script>
import Plateau from "./Plateau";
import CartesProprieteGareService from "../Cartes_propriete_gares_services.json";
import Inventaire from "./Inventaire.vue";
import CartesInventaire from "./CartesInventaire.vue";
import CartesChanceCommunaute from "./CartesChanceCommunaute.vue";
import CartesChancesCommunautes from "../Cartes_chances_communautes.json";
/*import CartesHypotheque from './CartesHypotheque.vue';*/

export default {
  components: {
    Plateau,
    Inventaire,
    CartesInventaire,
    CartesChanceCommunaute,
    /*CartesHypotheque,*/
  },
  sockets: {
    connection: function () {
      this.connected = true;
    },
    envoiNom: function (data) {
      this.joueurs = data;
    },
    ordre: function () {
      this.lancerDes();
      setTimeout(this.ordreJ, 3000);
    },
    propEnchere: function (data) {
      for (let i = 0; i < data.tab.length; i++) {
        if (this.nom === data.tab[i]) {
          this.enchere = true;
          this.dataEnchere = data.data;
        }
      }
    },
    finEnchere: function (data) {
      this.enchere = false;
      data.prop.proprietaire = data.nom;
      for (let i = 0; i < this.joueurs.length; i++) {
        if (this.joueurs[i].nom === data.nom) {
          if (data.position.length === 5) {
            this.joueurs[i].inventaire.proprietes.push(data.prop);
            this.banque.proprietes[data.position.substring(2, 3)][data.position.substring(4, 5)] = data.prop;
          } else {
            if (data.position.substring(0, 1) === 1) {
              this.joueurs[i].inventaire.gares.push(data.prop);
              this.banque.gares[data.position.substring(2, 3)] = data.prop;
            } else {
              this.joueurs[i].inventaire.services.push(data.prop);
              this.banque.services[data.position.substring(2, 3)] = data.prop;
            }
          }
          this.joueurs[i].inventaire.argent -= data.prixProp;
        }
      }
    },
    start: function (data) {
      this.ordre = true;
      this.joueurs = data;
      this.partie = true;
      this.lancerPartie();
    },
    changer: function (data) {
      if (data.nom != this.nom) {
        this.numJoueur=data.num;
      }
    },
    etatJoueurs: function (data) {
      this.joueurs = data;
    },
    etatAchat: function (data) {
      this.joueurs = data.joueurs;
      this.banque = data.banque;
    },
    chanceCom: function (data) {
      if (this.nom != data.nom) {
        this.nomChanceCom = data.nom;
        this.jsonChanceCommunaute = data.json;
      }
    },
    achatBat : function(data){
      if (this.nom != data.nom) {
        this.banque = data.banque;
        this.maison = data.maison;
        this.hotel = data.hotel;
      }
    },
    finPartie: function () {
      this.partie = false;
      this.desactif = false;
    },
  },
  data: () => ({
    ordre: false,
    nomEnvoyer: false,
    connected: false,
    nom: "",
    partie: false,
    comptdouble: 0,
    joueurs: [],
    nomChanceCom: "blabla",
    partieTerminer: 0,
    numJoueur: 0,
    destime: "",
    desactif: false,
    affichedes: [],
    des: [
      [1, require("../assets/images/De1.png")],
      [2, require("../assets/images/De2.png")],
      [3, require("../assets/images/De3.png")],
      [4, require("../assets/images/De4.png")],
      [5, require("../assets/images/De5.png")],
      [6, require("../assets/images/De6.png")],
    ],
    banque: {
      proprietes: [],
      gares: [],
      services: [],
      hypotheque: {},
    },
    jsonPropriete: [],
    depl: 0,
    retDepl: 0,
    proprietes: [],
    gares: [],
    services: [],
    memoire: 0,
    carteInventaire: {},
    dialog: false,
    chances: [],
    communautes: [],
    jsonChanceCommunaute: [],
    dialog2: false,
    carte: {},
    hypotheque: [],
    jsonHypotheque: [],
    maison: 32,
    hotel: 12,
    achat: false,
    propAchete: {},
    positions: "",
    acheteur: "",
    nomEnchere: "",
    enchere: false,
    dataEnchere: {
      prop: {},
      nom: "",
      position: "",
      prixProp: 0,
    },
    tabEnchere: [],
  }),
  created() {
    this.jsonPropriete = CartesProprieteGareService;
    this.jsonChanceCommunaute = CartesChancesCommunautes;
    this.jsonHypotheque = CartesProprieteGareService;
  },
  methods: {
    envoiProp: function () {
      this.dataEnchere.nom = this.nom;
      this.$socket.emit("propositionEnchere", this.dataEnchere);
    },
    finEnchere: function () {
      let donnees = {
        nom: this.nom,
        data: this.dataEnchere,
      };
      this.$socket.emit("finEnchere", donnees);
    },
    miseEnchere: function () {
      this.achat = false;
      this.dataEnchere = {
        prop: this.propAchete,
        nom: this.nom,
        position: this.positions,
        prixProp: 0,
      };
      this.$socket.emit("miseEnchere", this.dataEnchere);
    },
    colJoueur: function () {
      if (this.numJoueur === 0) {
        return "j1";
      } else {
        return "j2";
      }
    },
    ordreJ: function () {
      let info = {
        nom: this.nom,
        lancer: this.affichedes[0] + this.affichedes[1],
      };
      this.$socket.emit("ordreJ", info);
    },
    launch: function () {
      this.$socket.emit("launch");
    },
    envoiNom: function () {
      this.nomEnvoyer = true;
      this.$socket.emit("nom", this.nom);
    },
    afficheCarte: function () {
      this.proprietes = this.jsonPropriete[0];
      this.gares = this.jsonPropriete[1];
      this.services = this.jsonPropriete[2];
    },
    lancerPartie: function () {
      this.partie = true;
      this.partieTerminer = 1;
      this.numJoueur = 0;
      this.maison= 32;
      this.hotel= 12;
      for (let i = 0; i < this.joueurs.length; i++) {
        this.joueurs[i].deplLeft = 125;
        this.joueurs[i].deplTop = 300;
        this.joueurs[i].retDepl = 0;
        this.joueurs[i].caseVisitees = 0;
        this.joueurs[i].inventaire = {
          argent: 1500,
          proprietes: [],
          gares: [],
          services: [],
          cartePrison: [],
        };
      }
      this.initBanque();
    },
    desTime() {
      this.desactif = false;
    },
    lancerDes() {
      clearTimeout(this.destime);
      let de1 = Math.floor(Math.random() * this.des.length);
      let de2 = Math.floor(Math.random() * this.des.length);
      this.affichedes = [
        this.des[de1][0],
        this.des[de2][0],
        this.des[de1][1],
        this.des[de2][1],
      ];
      this.desactif = true;
      this.desactifLancer = true;
      if (!this.ordre) {
        this.destime = setTimeout(this.desTime, 3000);
      } else if (this.joueurs[this.numJoueur].prison) {
        this.destime = setTimeout(this.desTime, 3000);
      } else {
        this.destime = setTimeout(
          this.desTime,
          1000 * (this.affichedes[0] + this.affichedes[1])
        );
      }
    },
    jouer: function () {
      this.lancerDes();
      this.deplacerJoueur(this.affichedes[0], this.affichedes[1]);
    },
    initBanque: function () {
      for (let i = 0; i < this.jsonPropriete.length; i++) {
        if (i === 0) {
          this.banque.proprietes = this.jsonPropriete[i];
        } else if (i === 1) {
          this.banque.gares = this.jsonPropriete[i];
        } else {
          this.banque.services = this.jsonPropriete[i];
        }
      }
    },
    ProposerAchat: function () {
      switch (this.positions.substring(0, 1)) {
        case "0": {
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.joueurs[i].nom === this.acheteur) {
              this.joueurs[i].inventaire.proprietes.push(this.propAchete);
              this.joueurs[i].inventaire.argent -= this.propAchete.loyer[0];
              this.banque.proprietes[this.positions.substring(2, 3)][
                this.positions.substring(4, 5)
              ].proprietaire = this.acheteur;
            }
          }
          this.achat = false;
          let data = { joueurs: this.joueurs, banque: this.banque };
          this.$socket.emit("achat", data);
          break;
        }
        case "1": {
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.joueurs[i].nom === this.acheteur) {
              this.joueurs[i].inventaire.gares.push(this.propAchete);
              this.joueurs[i].inventaire.argent -= this.propAchete.prixAchat;
              this.banque.gares[
                this.positions.substring(2, 3)
              ].proprietaire = this.acheteur;
            }
          }
          this.achat = false;
          let data = { joueurs: this.joueurs, banque: this.banque };
          this.$socket.emit("achat", data);
          break;
        }
        case "2": {
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.joueurs[i].nom === this.acheteur) {
              this.joueurs[i].inventaire.services.push(this.propAchete);
              this.joueurs[i].inventaire.argent -= this.propAchete.loyer[0];
              this.banque.services[
                this.positions.substring(2, 3)
              ].proprietaire = this.acheteur;
            }
          }
          this.achat = false;
          let data = { joueurs: this.joueurs, banque: this.banque };
          this.$socket.emit("achat", data);
          break;
        }
      }
    },

    PositionToPropriete: function () {
      let numCase = this.joueurs[this.numJoueur].caseVisitees + this.memoire;
      if (numCase > 40) {
        numCase = numCase - 40;
      }
      switch (numCase) {
        case 1:
          // return "RUE ROSSETTI";
          return "0,0,0";
        case 2:
          // return "COMMUNAUTE";
          return "1";
        case 3:
          // return "RUE SMOLETT";
          return "0,0,1";
        case 4:
          return "2";
        case 5:
          // PORT LYMPIA
          return "1,1";
        case 6:
          //  return "BOULEVARD RENE CASSIN";
          return "0,1,0";
        case 7:
          // return "CHANCE";
          return "0";
        case 8:
          //  return "BOULEVARD RISSO";
          return "0,1,1";
        case 9:
          //  return "QUAI PAPACINO";
          return "0,1,2";
        case 11:
          // return "RUE BARLA";
          return "0,2,0";
        case 12:
          // COMPAGNIE DE DISTRIBUTION DE L'ELECTRICITE
          return "2,0";
        case 13:
          //   "AVENUE VALROSE";
          return "0,2,1";
        case 14:
          //   "AVENUE SAINT JEAN BAPTISTE";
          return "0,2,2";
        case 15:
          // GARE DU SUD
          return "1,3";
        case 16:
          //   "PLACE GARIBALDI";
          return "0,3,0";
        case 17:
          // return "COMMUNAUTE";
          return "1";
        case 18:
          //  "AVENUE DE LA CALIFORNIE";
          return "0,3,1";
        case 19:
          //  "RUE ST FRANCOIS DE PAULE";
          return "0,3,2";
        case 21:
          //  "RUE GIOFFREDO";
          return "0,4,0";
        case 22:
          // return "CHANCE";
          return "0";
        case 23:
          //  "COURS SALEYA";
          return "0,4,1";
        case 24:
          //   "AVENUE JEAN MEDECIN\"";
          return "0,4,2";
        case 25:
          // AEROPORT NICE COTE D'AZUR
          return "1,0";
        case 26:
          //  "BOULEVARD DUBOUCHAGE";
          return "0,5,0";
        case 27:
          //  "BOULEVARD CARABACEL";
          return "0,5,1";
        case 28:
          // COMPAGNIE DE DISTRIBUTION DES EAUX
          return "2,1";
        case 29:
          //   "BOULEVARD TZAREWITCH";
          return "0,5,2";
        case 31:
          //  return "BOULEVARD DE CIMIEZ";
          return "0,6,0";
        case 32:
          // return "PLACE MASSENA";
          return "0,6,1";
        case 33:
          // return "COMMUNAUTE";
          return "1";
        case 34:
          // return "BD MAURICE MAETERLINCK";
          return "0,6,2";
        case 35:
          // GARE DE NICE VILLE
          return "1,2";
        case 36:
          // return "CHANCE";
          return "0";
        case 37:
          //   return "AVENUE DE VERDUN";
          return "0,7,0";
        case 38: 
          return "3"
        case 39:
          //  return "PROMENADE DES ANGLAIS";
          return "0,7,1";
        default:
          return "inachetable";
      }
    },
    achatBatiment: function (data){
      let mono=0;
      let pos = 0;
      let min;
      let max;
      if(data.cpt == 1){
        for(let i=0; i<this.banque.proprietes.length;i++){
          if(this.banque.proprietes[i][1].Color == data.Color){
            min = this.banque.proprietes[i][0].maison;
            for(let j=0; j<this.banque.proprietes[i].length;j++){
              if(this.banque.proprietes[i][j].proprietaire == this.numJoueur){
                mono +=1;
              }
              if(this.banque.proprietes[i][j].nom == data.nom){
                pos = j;
              }
              if(this.banque.proprietes[i][j].maison<min){
                min = this.banque.proprietes[i][j].maison;
              }
            }
            if(this.banque.proprietes[i][pos].maison && mono == this.banque.proprietes[i].length && min == this.banque.proprietes[i][pos].maison && this.maison > 0 && this.joueurs[this.numJoueur].argent >= this.banque.proprietes[i][pos].batiment[0]){
              this.joueurs[this.numJoueur].argent -= this.banque.proprietes[i][pos].batiment[0];
              this.banque.proprietes[i][pos].maison +=1
              this.maison -=1;
            }
          }
        }
      }
      else if(data.cpt == 2){
        for(let i=0; i<this.banque.proprietes.length;i++){
          if(this.banque.proprietes[i][1].Color == data.Color){
            min = this.banque.proprietes[i][0].maison;
            for(let j=0; j<this.banque.proprietes[i].length;j++){
              if(this.banque.proprietes[i][j].proprietaire == this.numJoueur){
                mono +=1;
              }
              if(this.banque.proprietes[i][j].nom == data.nom){
                pos = j;
              }
              if(this.banque.proprietes[i][j].maison<min){
                min = this.banque.proprietes[i][j].maison;
              }
            }
            if(mono == this.banque.proprietes[i].length && min == 4 && this.banque.proprietes[i][pos].maison == 4 && this.hotel > 0 && this.joueurs[this.numJoueur].argent >= this.banque.proprietes[i][pos].batiment[1]){
              this.joueurs[this.numJoueur].argent -= this.banque.proprietes[i][pos].batiment[1];
              this.banque.proprietes[i][pos].maison +=1;
              this.hotel -=1;
              this.maison +=4;
            }
          }
        }
      }
      else{
        for(let i=0; i<this.banque.proprietes.length;i++){
          if(this.banque.proprietes[i][1].Color == data.Color){
            max = this.banque.proprietes[i][0].maison;
            for(let j=0; j<this.banque.proprietes[i].length;j++){
              if(this.banque.proprietes[i][j].proprietaire == this.numJoueur){
                mono +=1;
              }
              if(this.banque.proprietes[i][j].nom == data.nom){
                pos = j;
              }
              if(this.banque.proprietes[i][j].maison>max){
                max = this.banque.proprietes[i][j].maison;
              }
            }
            if(mono == this.banque.proprietes[i].length && max == this.banque.proprietes[i][pos].maison && max != 5){
              this.joueurs[this.numJoueur].argent += this.banque.proprietes[i][pos].batiment[0];
              this.banque.proprietes[i][pos].maison -=1;
              this.maison +=1;
            }
            if(mono == this.banque.proprietes[i].length && max == this.banque.proprietes[i][pos].maison && this.maison >=4){
              this.joueurs[this.numJoueur].argent += this.banque.proprietes[i][pos].batiment[0];
              this.banque.proprietes[i][pos].maison -=1;
              this.maison -=4;
              this.hotel +=1;
            }
          }
        }
      }
      let dataBat = {
        nom : this.nom,
        banque : this.banque,
        maison : this.maison,
        hotel : this.hotel
      }
      this.$socket.emit("achatBat",dataBat);
    },



    hypothequer: function (numJoueur,nomJoueur) {       // permet à un joueur d'hypothéquer une propriété si c'est possible (return true si c'est fait false sinon)
      let all_proprietes = this.banque.proprietes ;       
      for(let i=0; i< all_proprietes.length ; i++){
        for(let j=0 ; j<all_proprietes[i].length ; j++){
          if(all_proprietes[i][j].proprietaire === nomJoueur && all_proprietes[i][j].estHypothequee=== false) {
            this.joueurs[numJoueur].inventaire.argent += all_proprietes[i][j].hypotheque ;
            all_proprietes[i][j].estHypothequee = true ;
            console.log("!!!!!!!! Propriété hypothéquée :" + all_proprietes[i][j].nom)
            return true;
          }
        }
        
      }
      return false ;
    },

    lever_hypotheque: function () {
      let all_proprietes = this.banque.proprietes ;
      for(let j = 0; j < this.joueurs.length; j++){ // pour chaque joueur
        let propr_joueur = this.joueurs[j].inventaire.proprietes
        for(let i=0 ; i< propr_joueur.length ; i++){    
          if(propr_joueur[i].estHypothequee === true && this.joueurs[j].inventaire.argent > 300){   // si le joueur a une propriété hypothéquée ET qu'il peut la lever
            let nom_prop = propr_joueur[i].nom ;
            this.joueurs[j].inventaire.argent -= (1.1 * propr_joueur[i].hypotheque) ;  // rembourse avec 10% d'intérêt
            for(let k=0; k< all_proprietes.length ; k++){
              for(let l=0 ; l<all_proprietes[k].length ; l++){
                if(all_proprietes[k][l].nom === nom_prop){
                  all_proprietes[k][l].estHypothequee = false;          // l'hypothèque est levée !!
                  console.log("!!!!!!!! Hypothèque levée :" + all_proprietes[k][l].nom)
                }
              }
            }

          }
        }
      }

    },

    
    prison: function (cpt) {
      this.joueurs[this.numJoueur].tourPrison += 1;
      if (cpt == 1) {
        this.lancerDes();
        if (this.affichedes[0] == this.affichedes[1]) {          
          this.joueurs[this.numJoueur].prison = false;
          this.joueurs[this.numJoueur].caseVisitees = 10;
          this.joueurs[this.numJoueur].retDepl = 10;
          this.joueurs[this.numJoueur].tourPrison = 0;
          this.deplacerJoueur(this.affichedes[0], this.affichedes[1]);
        } else {
          if (this.joueurs[this.numJoueur].tourPrison == 3) {
            this.joueurs[this.numJoueur].inventaire.argent -= 50;
            this.joueurs[this.numJoueur].caseVisitees = 10;
            this.joueurs[this.numJoueur].retDepl = 10;
            this.joueurs[this.numJoueur].tourPrison = 0;
            this.deplacerJoueur(this.affichedes[0], this.affichedes[1]);
          } else {
            this.changerJoueur();
          }
        }
      } else if (cpt == 2) {
        this.joueurs[this.numJoueur].inventaire.argent -= 50;
        this.joueurs[this.numJoueur].prison = false;
        this.lancerDes();
        this.joueurs[this.numJoueur].caseVisitees = 10;
        this.joueurs[this.numJoueur].retDepl = 10;
        this.joueurs[this.numJoueur].tourPrison = 0;
        this.deplacerJoueur(this.affichedes[0], this.affichedes[1]);
      } else if (cpt == 3) {
        this.joueurs[this.numJoueur].prison = false;
        this.joueurs[this.numJoueur].cartePrison.remove(0);
        this.lancerDes();
        this.joueurs[this.numJoueur].caseVisitees = 10;
        this.joueurs[this.numJoueur].retDepl = 10;
        this.joueurs[this.numJoueur].tourPrison = 0;
        this.deplacerJoueur(this.affichedes[0], this.affichedes[1]);
      }
    },
    deplacerJoueur: function (de1, de2) {
      this.depl = de1 + de2;
      this.memoire = this.depl;
      this.joueurs[this.numJoueur].retDepl += this.depl;
      if (this.PositionToPropriete() != "inachetable") {
        this.positions = this.PositionToPropriete();


        //on vérifie si on est sur une case chance ou communaute
        if (this.positions.length === 1) {
          if(this.positions==="0" || this.positions==="1"){
            let index = Math.floor(Math.random() *this.jsonChanceCommunaute[this.positions.substring(0, 1)].length) - 1;
            if (index === -1) {
              index = 0;
            }
            this.carte = this.jsonChanceCommunaute[this.positions.substring(0, 1)][index];
            this.jsonChanceCommunaute[this.positions.substring(0, 1)].splice(index, 1);
            this.nomChanceCom = this.joueurs[this.numJoueur].nom;
            this.dialog2 = true;
            if (this.jsonChanceCommunaute[this.positions.substring(0, 1)].length === 0) {
              this.jsonChanceCommunaute[this.positions.substring(0, 1)] = CartesChancesCommunautes[this.positions.substring(0, 1)];
            }
          }
          else if(this.positions==="2"){
            this.joueurs[this.numJoueur].inventaire.argent-=200;
          }
          else if(this.positions==="3"){
            this.joueurs[this.numJoueur].inventaire.argent-=100;
          }
        } else {
          // on vérifie que l'objet carte ne contient pas déjà un propriétaire
          switch (this.positions.substring(0, 1)) {
            case "0": {
              if (this.banque.proprietes[this.positions.substring(2, 3)][this.positions.substring(4, 5)].proprietaire == "") {
                this.propAchete = this.banque.proprietes[this.positions.substring(2, 3)][this.positions.substring(4, 5)];
                this.acheteur = this.joueurs[this.numJoueur].nom;
                this.achat = true;
              } else {
                // faire payer
                if(this.banque.proprietes[this.positions.substring(2,3)][this.positions.substring(4,5)].estHypothequee === false){
                  let loyer = this.banque.proprietes[this.positions.substring(2, 3)][this.positions.substring(4, 5)].loyer[0];
                  if (this.joueurs[this.numJoueur].nom != this.banque.proprietes[this.positions.substring(2, 3)][this.positions.substring(4, 5)].proprietaire) {
                    this.joueurs[this.numJoueur].inventaire.argent -= loyer;
                    if (this.numJoueur === 0) {
                      this.joueurs[1].inventaire.argent += loyer;
                    } else {
                      this.joueurs[0].inventaire.argent += loyer;
                    }
                  }
                }
              }
              break;
            }
            case "1": {
              if (this.banque.gares[this.positions.substring(2, 3)].proprietaire == "") {
                this.propAchete = this.banque.gares[this.positions.substring(2, 3)];
                this.acheteur = this.joueurs[this.numJoueur].nom;
                this.achat = true;
              } 
              else {
                // faire payer
                if(this.banque.proprietes[this.positions.substring(2,3)][this.positions.substring(4,5)].estHypothequee === false){
                  if (this.joueurs[this.numJoueur].nom != this.banque.gares[this.positions.substring(2, 3)].proprietaire) {
                    let loyer = 0;
                    if (this.numJoueur === 0) {
                      loyer = this.banque.gares[this.positions.substring(2, 3)].loyer[this.joueurs[1].inventaire.gares.length - 1];
                      this.joueurs[1].inventaire.argent += loyer;
                    } else {
                      loyer = this.banque.gares[this.positions.substring(2, 3)].loyer[this.joueurs[0].inventaire.gares.length - 1];
                      this.joueurs[0].inventaire.argent += loyer;
                    }
                    this.joueurs[this.numJoueur].inventaire.argent -= loyer;
                  }
                }
              }
              break;
            }
            case "2": {
              if (this.banque.services[this.positions.substring(2, 3)].proprietaire == "") {
                this.propAchete = this.banque.services[this.positions.substring(2, 3)];
                this.acheteur = this.joueurs[this.numJoueur].nom;
                this.achat = true;
              } 
              else {
                // faire payer
                if(this.banque.proprietes[this.positions.substring(2,3)][this.positions.substring(4,5)].estHypothequee === false){
                  if (this.joueurs[this.numJoueur].nom != this.banque.services[this.positions.substring(2, 3)].proprietaire) {
                    let loyer = this.affichedes[1] + this.affichedes[0];
                    let multiplicateur = 0;
                    if (this.numJoueur === 0) {
                      this.joueurs[0].inventaire.services.length == 2 ? (multiplicateur = 10) : (multiplicateur = 4);
                      loyer *= multiplicateur;
                      this.joueurs[1].inventaire.argent += loyer;
                    } else {
                      this.joueurs[1].inventaire.services.length == 2 ? (multiplicateur = 10) : (multiplicateur = 4);
                      loyer *= multiplicateur;
                      this.joueurs[0].inventaire.argent += loyer;
                    }
                    this.joueurs[this.numJoueur].inventaire.argent -= loyer;
                  }
                }
              }
              break;
            }
          }
        }
      }
      if (this.joueurs[this.numJoueur].caseVisitees + this.memoire > 40) {
        this.memoire =
          this.joueurs[this.numJoueur].caseVisitees + this.memoire - 40;
      }
      while (this.depl > 0) {
        setTimeout(this.animation, 1000 * (de1 + de2  - this.depl));
        this.depl--;
      }

      this.lever_hypotheque()


      // !!!!!!!!!       Intégrer l'hypothèque ici         !!!!!!!!
      for(let j = 0; j < this.joueurs.length; j++){
        if(this.joueurs[j].inventaire.argent <= 0){ // si un joueur n'a plus d'argent
          if(this.hypothequer(j,this.joueurs[j].nom)=== false){   // si le joueur n'a pas de propriété à hypothéquer
            this.joueurs.splice(j,1);                       // le joueur est éliminé de la partie
            if(this.joueurs.length > 2){this.finPartie()}
          }
                     
        
        }
      }



    },
    affichageClick: function (joueur) {
      this.carteInventaire = joueur;
      this.dialog = true;
    },
    animation: function () {
      if (this.joueurs[this.numJoueur].caseVisitees === 40) {
        this.joueurs[this.numJoueur].inventaire.argent += 200;
      }
      if (this.joueurs[this.numJoueur].caseVisitees === 0 || this.joueurs[this.numJoueur].caseVisitees === 9) {
        this.joueurs[this.numJoueur].deplLeft += 223;
        this.joueurs[this.numJoueur].caseVisitees++;
      } 
      else if (this.joueurs[this.numJoueur].caseVisitees >= 1 && this.joueurs[this.numJoueur].caseVisitees < 9) {
        this.joueurs[this.numJoueur].deplLeft += 200;
        this.joueurs[this.numJoueur].caseVisitees++;
      } 
      else if (this.joueurs[this.numJoueur].caseVisitees === 10 || this.joueurs[this.numJoueur].caseVisitees === 19) {
        this.joueurs[this.numJoueur].deplTop += 235;
        this.joueurs[this.numJoueur].caseVisitees++;
      } 
      else if (this.joueurs[this.numJoueur].caseVisitees >= 11 && this.joueurs[this.numJoueur].caseVisitees < 19) {
        this.joueurs[this.numJoueur].deplTop += 200;
        this.joueurs[this.numJoueur].caseVisitees++;
      } 
      else if (this.joueurs[this.numJoueur].caseVisitees === 20 || this.joueurs[this.numJoueur].caseVisitees === 29) {
        this.joueurs[this.numJoueur].deplLeft -= 223;
        this.joueurs[this.numJoueur].caseVisitees++;
      } 
      else if (this.joueurs[this.numJoueur].caseVisitees >= 20 && this.joueurs[this.numJoueur].caseVisitees < 29) {
        this.joueurs[this.numJoueur].deplLeft -= 200;
        this.joueurs[this.numJoueur].caseVisitees++;
      } 
      else if (this.joueurs[this.numJoueur].caseVisitees === 20) {
        this.joueurs[this.numJoueur].deplTop -= 223;
        this.joueurs[this.numJoueur].caseVisitees++;
      } 
      else if (this.joueurs[this.numJoueur].caseVisitees >= 30 && this.joueurs[this.numJoueur].caseVisitees < 39) {
        this.joueurs[this.numJoueur].deplTop -= 200;
        this.joueurs[this.numJoueur].caseVisitees++;
      } 
      else if (this.joueurs[this.numJoueur].caseVisitees === 39) {
        this.joueurs[this.numJoueur].deplTop -= 235;
        this.joueurs[this.numJoueur].caseVisitees++;
      } 
      else if (this.joueurs[this.numJoueur].caseVisitees === 40) {
        this.joueurs[this.numJoueur].deplLeft += 223;
        this.joueurs[this.numJoueur].caseVisitees = 1;
        this.joueurs[this.numJoueur].retDepl = this.memoire;
      }
      else if(this.joueurs[this.numJoueur].caseVisitees === 4){
        this.joueurs[this.numJoueur].inventaire.argent -= 200;
      }
      else if(this.joueurs[this.numJoueur].caseVisitees === 38){
        this.joueurs[this.numJoueur].inventaire.argent -= 100;
      }

      if (this.joueurs[this.numJoueur].retDepl === this.joueurs[this.numJoueur].caseVisitees) {

        if (this.joueurs[this.numJoueur].caseVisitees === 30) {
          this.joueurs[this.numJoueur].prison = true;
          this.joueurs[this.numJoueur].deplLeft = 2170;
          this.joueurs[this.numJoueur].deplTop = 250;
          this.changerJoueur();
          this.comptdouble = 0;
          this.$socket.emit("prison", this.joueurs);
        } 
        else if (this.affichedes[0]  !=  this.affichedes[1]) {
          this.comptdouble = 0;
          if (
            this.joueurs[this.numJoueur].caseVisitees === 2 ||
            this.joueurs[this.numJoueur].caseVisitees === 7 ||
            this.joueurs[this.numJoueur].caseVisitees === 17 ||
            this.joueurs[this.numJoueur].caseVisitees === 22 ||
            this.joueurs[this.numJoueur].caseVisitees === 33 ||
            this.joueurs[this.numJoueur].caseVisitees === 36
          ) {
            if (this.nomChanceCom === this.nom) {
              this.effetCarte(this.carte.label);
            }
            this.changerJoueur();
            if (this.partieTerminer === 8) {
              this.$socket.emit("end");
            }
            this.$socket.emit("sortiPrison", this.joueurs);
          }
          else{
            this.changerJoueur();
            this.$socket.emit("sortiPrison", this.joueurs);
          }
        } 
        else {
          this.comptdouble++;
          if (this.comptdouble === 3) {
            this.joueurs[this.numJoueur].prison = true;
            this.joueurs[this.numJoueur].deplLeft = 2170;
            this.joueurs[this.numJoueur].deplTop = 300;
            this.joueurs[this.numJoueur].caseVisitees = 10; // mise a jour case visitées
            this.changerJoueur();
            this.comptdouble = 0;
          }
          if (
            this.joueurs[this.numJoueur].caseVisitees === 2 ||
            this.joueurs[this.numJoueur].caseVisitees === 7 ||
            this.joueurs[this.numJoueur].caseVisitees === 17 ||
            this.joueurs[this.numJoueur].caseVisitees === 22 ||
            this.joueurs[this.numJoueur].caseVisitees === 33 ||
            this.joueurs[this.numJoueur].caseVisitees === 36
          ) {
            if (this.nomChanceCom === this.nom) {
              this.effetCarte(this.carte.label);
            }
            this.$socket.emit("sortiPrison", this.joueurs);
          }
          this.$socket.emit("sortiPrison", this.joueurs);
        }
      }
    },
    changerJoueur: function(){
      if (this.numJoueur < this.joueurs.length - 1) {
            this.numJoueur++;
      } else {
          this.numJoueur = 0;
          this.partieTerminer += 1;
      }
      let data = {
        nom: this.nom,
        num: this.numJoueur
      }
      this.$socket.emit("changerJoueur",data);
    },
    effetCarte: function (label) {
      console.log(label+" "+this.nomChanceCom)
      switch (label) {
        case "Frais_scolarité":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent -= 150;
            }
          }
          break;
        case "Dividende":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent += 50;
            }
          }
          break;
        case "Immeuble_prêt":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent += 150;
            }
          }
          break;
        case "Exces_vitesse":
          this.joueurs[this.numJoueur].inventaire.argent -= 15;
          break;
        case "Allez_prison":
          console.log("la");
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].prison = true;
              this.joueurs[i].deplLeft = 2170;
              this.joueurs[i].deplTop = 300;
              this.joueurs[i].retDepl = 10;
              this.joueurs[i].caseVisitees = 10;
            }
          }
          break;
        case "RDV_promenade":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].prison = true;
              this.joueurs[i].deplLeft = 125;
              this.joueurs[i].deplTop = 535;
              this.joueurs[i].caseVisitees = 39;
              this.joueurs[i].retDepl = 39;
            }
          }
          console.log("RDV_promenade");
          break;
        case "Libéré-prison": 
          for(let i=0; i<this.joueurs.length; i++) {  
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.cartePrison.push(this.carte);
              console.log(this.joueurs[i].inventaire)
            }
            console.log("ouai la boucle")
          } 
          console.log("Libéré-prison");
          break;
        case "Avancez":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              if (this.joueurs[i].caseVisitees > 11) {
                this.joueurs[i].inventaire.argent += 200;
              }
              this.joueurs[i].deplLeft = 2170;
              this.joueurs[i].deplTop = 535;
              this.joueurs[i].caseVisitees = 11;
              this.joueurs[i].retDepl = 11;
            }
          }
          console.log("Avancez");
          break;
        case "Gare":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              if (this.joueurs[i].caseVisitees > 15) {
                this.joueurs[i].inventaire.argent += 200;
              }
              this.joueurs[i].deplLeft = 2170;
              this.joueurs[i].deplTop = 1335;
              this.joueurs[i].caseVisitees = 15;
              this.joueurs[i].retDepl = 15;
            }
          }
          console.log("Gare");
          break;
        case "Départ_Chance":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].deplLeft = 125;
              this.joueurs[i].deplTop = 300;
              this.joueurs[i].caseVisitees = 0;
            }
          }
          console.log("Départ_Chance");
          break;
        case "Ivresse":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent -= 20;
            }
          }
          break;
        case "Mots_croisés":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent += 100;
            }
          }
          break;
        case "RDV_Jean":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              if (this.joueurs[i].caseVisitees > 24) {
                this.joueurs[i].inventaire.argent += 200;
              }
              this.joueurs[i].deplLeft = 1335;
              this.joueurs[i].deplTop = 2300;
              this.joueurs[i].caseVisitees = 24;
              this.joueurs[i].retDepl = 24;
            }
          }
          console.log("RDV_Jean");
          break;
        case "Revenu":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent += 100;
            }
          }
          console.log('revenu')
          break;
        case "Stock":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent += 50;
            }
          }
          console.log('stock')
          break;
        case "Intérêt":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent += 25;
            }
          }
          break;
        case "Héritage":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent += 100;
            }
          }
          console.log('heritage')
          break;
        case "Erreur_Banque":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent += 200;
            }
          }
          break;
        case "Retournez":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              if (this.joueurs[i].caseVisitees > 1) {
                this.joueurs[i].inventaire.argent += 200;
              }
              this.joueurs[i].deplLeft = 348;
              this.joueurs[i].deplTop = 300;
              this.joueurs[i].caseVisitees = 0;
              this.joueurs[i].retDepl = 0;
            }
          }
          console.log("Retournez");
          break;
        case "Contributions":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent += 20;
            }
          }
          break;
        case "Beauté":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent += 10;
            }
          }
          break;
        case "Médecin":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent -= 50;
            }
          }
          break;
        case "Assurance":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent -= 50;
            }
          }
          console.log('assurance')
          break;
        case "Prison":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].prison = true;
              this.joueurs[i].deplLeft = 2170;
              this.joueurs[i].deplTop = 300;
              this.joueurs[i].caseVisitees = 10;
              this.joueurs[i].retDepl = 10;
            }
          }
          console.log("Prison");
          break;
        case "Hôpital":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].inventaire.argent -= 100;
            }
          }
          break;
        case "Départ_Communauté":
          for (let i = 0; i < this.joueurs.length; i++) {
            if (this.nomChanceCom === this.joueurs[i].nom) {
              this.joueurs[i].deplLeft = 125;
              this.joueurs[i].deplTop = 300;
              this.joueurs[i].caseVisitees = 0;
              this.joueurs[i].retDepl = 0;
            }
          }
          console.log("Départ_Communauté");
          break;
      }
    },
  },
};
</script>
<style scoped>
template {
  width: 100%;
  height: 100%;
}

#base {
  position: relative;
  width: 100%;
  height: 100%;
}

.pion0 {
  width: 50px;
  height: 50px;
  border: solid 1px;
  border-radius: 25px;
  background-color: red;
  position: absolute;
  transition: all ease-in-out 1s;
  z-index: 10000;
}

.pion1 {
  width: 50px;
  height: 50px;
  border: solid 1px;
  border-radius: 25px;
  background-color: #0000ff;
  position: absolute;
  transition: all ease-in-out 1s;
  z-index: 100;
}

#des {
  position: absolute;
  text-align: center;
  width: 20%;
  height: 7%;
  top: 500px;
  left: 900px;
  z-index: 10000000000;
}

#prison {
  position: absolute;
  text-align: center;
  width: 500px;
  height: 220px;
  top: 700px;
  left: 940px;
  z-index: 10000000000;
}
.organisation {
  display: flex;
}

.ordre {
  display: flex;
}

.ordre2 {
  padding-left: 20%;
}

.j1 {
  color: red;
}

.j2 {
  color: blue;
}
</style>