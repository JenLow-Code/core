# JenLow — middleware de sécurité

Source issue du commit Network 6be3917a. Ce dépôt centralise le code, sans modification de comportement du runtime de production. Le Worker actuellement déployé reste configuré pour Network. Ne pas modifier PRODUCT ni autoriser un nouveau produit sans tests d’isolation et validation du contrat de confiance entre gateways et middleware.

Tests : `npm install`, `npm run typecheck`, `npm test`, `npm run bundle:check`. Les fixtures de base sont locales et historiques. Ne jamais appliquer automatiquement les migrations à la production. Le test gateway utilise un instantané du gateway Network; le test d’intégration Network doit également vérifier le véritable gateway.
