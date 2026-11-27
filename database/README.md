# Base relationnelle JenLow — historique importé

Ces migrations, scripts de sécurité et fixtures proviennent de Network 6be3917a. Ce n'est pas le schéma cible validé. Le registre de production connu est 0001–0008, plus les deux scripts de sécurité appliqués séparément. 0009–0017 ne doivent pas être rejoués aveuglément. Les données de démonstration sont uniquement des fixtures de tests locaux. `python database/test_schema.py` utilise une SQLite en mémoire.

Convention approuvée : core_, net_, tool_, prod_, live_. Noms, relations et migration physique restent soumis à la revue Phase B. Aucune commande distante de migration n'est fournie.
