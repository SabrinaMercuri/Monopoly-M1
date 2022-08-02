# Livraison n°2

## Fonctionnalités implémentées 

- Mise en place du réseau pour jouer en local : création du serveur et du client, connexion de chaque joueur à la partie (le premier joueur connecté commence à jouer)   

- Le joueur a la possiblité d'acheter une propriété et de payer un loyer s'il tombe sur une case ayant déjà été acheté par l'autre joueur

- Les effets "prison" ont été ajoutées : le joueur va en prison (s'ils tombent sur une carte prison, une case ou après avoir fait 3 doubles de suiet)
et peut en sortir selon certaines conditions (payer ou attendre 3 tours et payer ensuite)  

- L'inventaire du joueur a également été créé : on peut y trouver son nom, son argent et les cartes qu'ils possèdent (les 2 inventaires sont affichés à côté du plateau)  

- Lorsque l'on clique sur une case, on peut afficher la carte correspondante à la case ainsi que toutes ses informations   

- L'effet de la case départ a également été ajouté : lorsqu'un joueur passe sur la case départ, il recoit 200 euros

## Pour lancer le jeu avec le serveur
Etre dans le dossier serveur et lancer le serveur avec la commande "npm run start" (faire "npm i" si les installations ne sont pas faites précédemment).  
Puis lancer le client dans le dossier "monopoly" avec la commande "npm run serve"
