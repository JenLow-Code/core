# Extraction Core — 27 novembre 2026

Décision : quatre dépôts produits indépendants et un dépôt transversal core. Transfert de sources et validation avant suppression des doublons Network.

- Garder le Worker actif, les domaines, la base D1, les secrets et la configuration Supabase inchangés.
- Le gateway Network reste dans Network. Le test gateway Core contient une fixture provenant du commit source ; les tests côté Network doivent injecter la source réelle du gateway.
- Conserver les migrations et seeds historiques uniquement pour reproduire les tests isolés ; ne pas appliquer à la base réelle.
- Conserver les composants OCR/OMR retirés dans Music Engine, sans les redéployer.
- Agenda, Calendar, Media et Notifications ne deviennent pas opérationnels par simple transfert de source.
- Le middleware déployé reste Network-scoped. Toute extension à d'autres produits nécessite un contrat d'identité du gateway non falsifiable, des profils et autorisations persistants et des tests de refus croisés.
- Déploiement Core et retrait des doublons Network uniquement après CI et validation des dépendances ; rollback via commits sources préservés.


## Mise en service ultérieure

L'extraction Network a été fusionnée (240a525e) et la référence Core mise à jour (04746356). Le middleware à quatre entrypoints a été validé et déployé depuis Core 28413c24. Le gateway Tools a été raccordé via son dépôt propre. Le staging a été remplacé par jenlow-staging, sans données personnelles. Voir le registre de release. Les anciens noms de tables et de base de production restent soumis à la revue Phase B.
