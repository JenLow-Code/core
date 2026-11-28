-- Phase C1: additive Network presentation data in central Core D1.
-- Existing identity tables remain the sole authentication authority.
-- Run only against Core D1 after staging validation and production approval.
CREATE TABLE IF NOT EXISTS net_identity_profiles (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL UNIQUE,
 product TEXT NOT NULL DEFAULT 'network' CHECK(product='network'),
 handle TEXT NOT NULL COLLATE NOCASE UNIQUE,
 display_name TEXT NOT NULL,
 bio TEXT NOT NULL DEFAULT '',
 city TEXT,
 country_code TEXT,
 church_name TEXT,
 avatar_asset_key TEXT,
 profile_visibility TEXT NOT NULL DEFAULT 'private' CHECK(profile_visibility IN ('public','members','private')),
 show_church INTEGER NOT NULL DEFAULT 0 CHECK(show_church IN (0,1)),
 discoverable INTEGER NOT NULL DEFAULT 0 CHECK(discoverable IN (0,1)),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(id,user_id,product) REFERENCES product_profiles(id,user_id,product) ON DELETE CASCADE
);

-- Preserve the existing Network profile and privacy preferences for already
-- provisioned Network accounts only. No Tools/Production/Live profile is copied.
-- Reapplication never overwrites subsequent profile edits.
INSERT INTO net_identity_profiles
 (id,user_id,product,handle,display_name,bio,city,country_code,church_name,avatar_asset_key,
 profile_visibility,show_church,discoverable,created_at,updated_at)
SELECT pp.id,u.id,'network',u.handle,u.display_name,u.bio,u.city,u.country_code,u.church_name,u.avatar_asset_key,
 COALESCE(p.profile_visibility,'private'),COALESCE(p.show_church,0),COALESCE(p.discoverable,0),
 pp.created_at,u.updated_at
FROM product_profiles pp JOIN users u ON u.id=pp.user_id
LEFT JOIN user_preferences p ON p.user_id=u.id
WHERE pp.product='network'
ON CONFLICT(id) DO NOTHING;
