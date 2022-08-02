<template>
  <div class="plateau">
    <div
      v-for="(row, indexRow) in cases"
      :key="indexRow"
      :class="indexRow < cases.length - 1 && indexRow > 0 ? 'ligne' : ''"
    >
      <div v-for="(c, indexCase) in row" :key="indexCase">
        <CasePropriete
          v-if="c.type === 'propriete'"
          :nom="c.nom"
          :sous_nom="c.sous_nom"
          :monopole="c.Color"
          :loyer="c.loyer[maisonCase(c.nom)]"
          :position="getCasePosition(indexRow, indexCase)"
          @propriete="affichageClick(c.nom, c.Color)"
          :maison ="maisonCase(c.nom)"
        />
        <CaseDepart
          v-else-if="c.type === 'Départ'"
          :position="getCasePosition(indexRow, indexCase)"
        />
        <CaseGare
          v-else-if="c.type === 'gare'"
          :image="c.image"
          :nom="c.nom"
          :prixAchat="c.prixAchat"
          :position="getCasePosition(indexRow, indexCase)"
          @gare="affichageClick2(c.nom, c.type)"
        ></CaseGare>
        <CaseChance
          v-else-if="c.type === 'chance'"
          :position="getCasePosition(indexRow, indexCase)"
        />
        <CaseCaisseCommunaute
          v-else-if="c.type === 'caisse'"
          :position="getCasePosition(indexRow, indexCase)"
        />
        <CaseParcGratuit
          v-else-if="c.type === 'parc'"
          :position="getCasePosition(indexRow, indexCase)"
        />
        <CaseServicePublic
          v-else-if="c.type === 'service'"
          :nom="c.nom"
          :image="c.image"
          :loyer="c.loyer[0]"
          :position="getCasePosition(indexRow, indexCase)"
          @service="affichageClick2(c.nom, c.type)"
        />
        <Taxe
          v-else-if="c.type === 'taxe'"
          :nom="c.nom"
          :prix="c.prix"
          :position="getCasePosition(indexRow, indexCase)"
        />
        <CasePrison
          v-else-if="c.type === 'prison'"
          :position="getCasePosition(indexRow, indexCase)"
        />
        <CaseSimpleVisite
          v-else-if="c.type === 'visite'"
          :position="getCasePosition(indexRow, indexCase)"
        />
        <div v-else-if="c.type === 'null'" class="empty-case"></div>
      </div>
    </div>
    <v-dialog v-model="dialog" max-width="500px">
      <CartesPropriete :carte="carte" />
      <div class="achatMaison">
        <v-btn @click="achatBatimentPlateau(1,carte.Color,carte.nom)" text x-large>Acheter une maison.</v-btn>
      </div>
      <div class="achatMaison">
        <v-btn @click="achatBatimentPlateau(2,carte.Color,carte.nom)" text x-large>Acheter un hotel.</v-btn>
      </div>
      <div class="achatMaison">
        <v-btn @click="achatBatimentPlateau(3,carte.Color,carte.nom)" text x-large>Vendre un batiment.</v-btn>
      </div>
    </v-dialog>
    <v-dialog v-model="dialog2" max-width="500px">
      <CartesGare :carte="carte" />
    </v-dialog>
    <v-dialog v-model="dialog3" max-width="500px">
      <CartesService :carte="carte" />
    </v-dialog>
    <v-dialog v-model="dialog4" max-width="500px">
      <CartesHypotheque :carte="carte" />
    </v-dialog>
  </div>
</template>

<script>
import CaseDepart from "./CaseDepart";
import CasePropriete from "./CasePropriete";
import CaseGare from "./CaseGare";
import CaseServicePublic from "./CaseServicePublic";
import Taxe from "./Taxe.vue";
import TaxeJson from "../Taxe.json";
import CaseParcGratuit from "./CaseParcGratuit";
import Cartes_propriete_gares_services from "../Cartes_propriete_gares_services.json";
import CaseChance from "./CaseChance";
import CaseCaisseCommunaute from "./CaseCaisseCommunaute";
import Cartes_chances_communautes from "../Cartes_chances_communautes.json";
import CaseSimpleVisite from "./CaseSimpleVisite";
import CasePrison from "./CasePrison";
import cases from "../cases.json";
import CartesPropriete from "./CartesPropriete.vue";
import CartesGare from "./CartesGare.vue";
import CartesService from "./CartesService.vue";
import CartesHypotheque from "./CartesHypotheque.vue";

export default {
  components: {
    CaseDepart,
    CasePropriete,
    CaseGare,
    CaseServicePublic,
    Taxe,
    CaseChance,
    CaseCaisseCommunaute,
    CaseParcGratuit,
    CaseSimpleVisite,
    CasePrison,
    CartesPropriete,
    CartesGare,
    CartesService,
    CartesHypotheque
  },
  data: () => ({
    proprietes: [],
    gares: [],
    services: [],
    jsonProprietes: [],
    Taxe: [],
    jsonTaxe: [],
    chance: [],
    communaute: [],
    jsonChance: [],
    cases: cases,
    dialog: false,
    dialog2: false,
    dialog3: false,
    dialog4: false,
    carte: {},
  }),
  props:{
    banque: Object,
  },
  created() {
    this.jsonProprietes = Cartes_propriete_gares_services;
    this.jsonChance = Cartes_chances_communautes;
    this.jsonTaxe = TaxeJson;
    this.init();
  },
  methods: {
    init: function () {
      this.proprietes = this.jsonProprietes[0];
      this.gares = this.jsonProprietes[1];
      this.services = this.jsonProprietes[2];
      this.chance = this.jsonChance[0];
      this.communaute = this.jsonChance[1];
      this.Taxe = this.jsonTaxe[0];
    },
    affichageClick: function (nom, Color) {
      for (let i = 0; i < this.proprietes.length; i++) {
        if (Color === this.proprietes[i][0].Color) {
          for (let j = 0; j < this.proprietes[i].length; j++) {
            if (nom === this.proprietes[i][j].nom) {
              this.carte = this.proprietes[i][j];
              if(this.proprietes[i][j].estHypothequee){
                this.dialog4 = true;
              }
              else{
                this.dialog = true;
              }
            }
          }
        }
      }

    },
    maisonCase: function(nom){
      for(let i=0;i<this.banque.length;i++){
        for(let j=0;j<this.banque[i].length;j++){
          if(this.banque[i][j].nom == nom){
            return this.banque[i][j].maison;
          }
        }
      }
      return 0;
    },
    achatBatimentPlateau: function(cpt,color,nom){
      let data={cpt:cpt,Color:color,nom:nom}
      this.$emit("achatBatiment",data);
    },
    affichageClick2: function (nom, type) {
      if (type === "gare") {
        for (let i = 0; i < this.gares.length; i++) {
          if (nom === this.gares[i].nom) {
            this.carte = this.gares[i];
          }
        }
        this.dialog2 = true;
      }
      else {
        for (let i = 0; i < this.services.length; i++) {
          if (nom === this.services[i].nom) {
            this.carte = this.services[i];
          }
        }
        this.dialog3 = true;
      }
      
    },
    getCasePosition: function (indexRow, indexCase) {
      if (indexRow === 0) {
        return "top";
      } else if (indexRow > 0 && indexRow < 11 && indexCase === 0) {
        return "left";
      } else if (indexRow > 0 && indexRow < 11 && indexCase === 10) {
        return "right";
      }
    },
    setDepl: function () {
      this.deplLeft += 125;
    },
  },
};
</script>
<style scoped>
.plateau > div {
  display: flex;
}

.ligne {
  height: 200px;
}

.empty-case {
  width: 200px;
  height: 200px;
}
.achatMaison{
  text-align: center;
  background: white;
  border: solid 2px;
  margin-top: 10px;
}

</style>