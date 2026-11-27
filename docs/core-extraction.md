# Extraction Core — 27 novembre 2026

Décision : quatre dépôts produits indépendants et un dépôt transversal core. Transfert de sources et validation avant suppression des doublons Network.

- Garder le Worker actif, les domaines, la base D1, les secrets et la configuration Supabase inchangés.
- Le gateway Network reste dans Network. Le test gateway Core contient une fixture provenant du commit source ; les tests côté Network doivent injecter la source réelle du gateway.
- Conserver les migrations et seeds historiques uniquement pour reproduire les tests isolés ; ne pas appliquer à la base réelle.
- Conserver les composants OCR/OMR retirés dans Music Engine, sans les redéployer.
- Agenda, Calendar, Media et Notifications ne deviennent pas opérationnels par simple transfert de source.
- Le middleware déployé reste Network-scoped. Toute extension à d'autres produits nécessite un contrat d'identité du gateway non falsifiable, des profils et autorisations persistants et des tests de refus croisés.
- Déploiement Core et retrait des doublons Network uniquement après CI et validation des dépendances ; rollback via commits sources préservés.
