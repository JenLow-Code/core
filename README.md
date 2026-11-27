# JenLow Core

Socle technique commun à Network, Tools, Production et Live. Les interfaces et les règles métier propres à chaque branche restent dans leurs dépôts.

| Répertoire | Responsabilité | État au 27 novembre 2026 |
| --- | --- | --- |
| middleware | Identité, sessions, autorisations, confidentialité | Source transférée du middleware Network ; runtime de production inchangé et encore limité à Network |
| database | Historique des migrations relationnelles et tests SQLite | Référentiel historique ; schéma central cible en cours de validation |
| services/music-engine | Sources Python/Audiveris, bridge OCR/OMR et tests | Non déployé ; moteur musical à compléter |
| services/agenda | Contrat de conception et statut du service commun | Non implémenté |
| services/calendar | Frontière du calendrier interne | Non implémenté |
| archive | Références historiques non exécutables en production | Conservation uniquement |

Les quatre gateways produits restent dans leurs dépôts respectifs. Le middleware ne doit jamais accepter un produit, un rôle ou une identité sur simple déclaration du navigateur. Les interfaces privées et la validation interbranches sont des prérequis distincts.

Sources importées : Network `6be3917aabefebac74e131140f44c68152f32304`. Archive historique : `d9961af0f4f8a78b3ad4ce37200fd9cbc09d8b05`. Voir [migration](docs/core-extraction.md). Aucun changement Cloudflare, Supabase ou D1 n'est effectué par cette extraction.

Tests : `cd middleware && npm install && npm run typecheck && npm test && npm run bundle:check` ; à la racine `python database/test_schema.py` et `node --test services/music-engine/test/scan-worker.test.mjs`. Aucun seed ou script historique ne doit être appliqué à la production.
