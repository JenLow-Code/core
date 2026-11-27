# JenLow — middleware de sécurité

Source unique de sécurité JenLow dans Core. Le Worker privé jenlow-security est déployé avec quatre entrypoints fixes : NetworkSecurity, ToolsSecurity, ProductionSecurity et LiveSecurity. Le gateway Network existant utilise le default export fixé à Network ; le gateway Tools utilise ToolsSecurity. Les deux autres gateways publics ne sont pas déployés tant que leurs applications ne sont pas prêtes.

Les jetons et rôles sont isolés par produit. Seule une identité Supabase vérifiée peut obtenir un profil technique du produit ; aucun rôle n'est octroyé automatiquement. Les profils métier, l'Agenda, Calendar et les autres données fonctionnelles restent sous la revue Phase B. Ne jamais autoriser un produit ou une identité sur la base de headers reçus du navigateur.

Tests : npm install, npm run typecheck, npm test, npm run bundle:check. Les fixtures SQL historiques sont locales ; ne jamais appliquer automatiquement les migrations à la production. Le test gateway utilise une fixture, et Network CI injecte son véritable gateway.

Déploiement contrôlé : voir [product-security.md](../docs/product-security.md) et [release-2026-11-27.md](../docs/release-2026-11-27.md). Les secrets restent dans Cloudflare. Staging D1 = jenlow-staging, production D1 = network (nom historique jusqu'à validation Phase B).
