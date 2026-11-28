# Base relationnelle JenLow — historique importé

Ces migrations, scripts de sécurité et fixtures proviennent de Network 6be3917a. Ce n'est pas le schéma cible validé. Le registre de production connu est 0001–0008, plus les deux scripts de sécurité appliqués séparément. 0009–0017 ne doivent pas être rejoués aveuglément. Les données de démonstration sont uniquement des fixtures de tests locaux. `python database/test_schema.py` utilise une SQLite en mémoire.

Convention approuvée : core_, net_, tool_, prod_, live_. Noms, relations et migration physique restent soumis à la revue Phase B. Aucune commande distante de migration n'est fournie.

## Production cutover — 2026-11-28

`core` (EU, `849e6b04-0672-4240-8eeb-35ad3acb8dcf`) is the authoritative live security database. The legacy `network` database retains all operational records and historical identity/security copies for recovery only; do not write those copies or use them as a second identity authority. `jenlow-staging` remains isolated, pending naming reconciliation. No operational migration has been applied. Do not replay historical migrations into `core`; the 14 copied security/identity/privacy tables preserve current physical names until the schema review. See `docs/core-d1-cutover-2026-11-28.md`.
