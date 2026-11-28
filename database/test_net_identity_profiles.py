"""Isolated test for the additive Phase C1 Network profile migration."""
from pathlib import Path
import sqlite3

root = Path(__file__).resolve().parent
db = sqlite3.connect(":memory:")
db.execute("PRAGMA foreign_keys=ON")
db.executescript((root / "migrations/0001_identity.sql").read_text())
db.executescript((root / "security/002_product_sessions.sql").read_text())
db.executescript("""
INSERT INTO users(id,handle,display_name,email,bio,city,church_name)
VALUES ('a','alice','Alice','a@example.test','Original bio','Geneva','Church'),
       ('b','bob','Bob','b@example.test','','',''),
       ('c','carol','Carol','c@example.test','','','');
INSERT INTO user_preferences(user_id,profile_visibility,show_church,discoverable)
VALUES ('a','members',0,1);
INSERT INTO product_profiles(id,user_id,product)
VALUES ('na','a','network'),('ta','a','tools'),('tb','b','tools'),('nc','c','network');
""")
migration = (root / "core-migrations/0001_net_identity_profiles.sql").read_text()
db.executescript(migration)
assert db.execute("SELECT id,user_id FROM net_identity_profiles ORDER BY id").fetchall() == [('na','a'),('nc','c')]
assert db.execute("SELECT bio,city,church_name,profile_visibility,show_church,discoverable FROM net_identity_profiles WHERE id='na'").fetchone() == ('Original bio','Geneva','Church','members',0,1)
assert db.execute("SELECT profile_visibility,discoverable FROM net_identity_profiles WHERE id='nc'").fetchone() == ('private',0)
db.execute("UPDATE net_identity_profiles SET bio='Edited' WHERE id='na'")
db.executescript(migration)
assert db.execute("SELECT bio FROM net_identity_profiles WHERE id='na'").fetchone() == ('Edited',)
assert db.execute("SELECT bio FROM users WHERE id='a'").fetchone() == ('Original bio',)
assert db.execute("SELECT count(*) FROM users").fetchone() == (3,)

def rejects(sql):
    try:
        db.execute(sql)
    except sqlite3.IntegrityError:
        return
    raise AssertionError("Unexpectedly accepted: " + sql)

rejects("INSERT INTO net_identity_profiles(id,user_id,handle,display_name) VALUES('tb','b','bob','Bob')")
rejects("UPDATE net_identity_profiles SET user_id='b' WHERE id='na'")
rejects("UPDATE net_identity_profiles SET product='tools' WHERE id='na'")
rejects("UPDATE net_identity_profiles SET profile_visibility='everyone' WHERE id='na'")
rejects("UPDATE net_identity_profiles SET discoverable=3 WHERE id='na'")
rejects("UPDATE net_identity_profiles SET handle='ALICE' WHERE id='nc'")
assert db.execute("PRAGMA foreign_key_check").fetchall() == []
print("PASS: profile backfill, product isolation, foreign keys, privacy defaults, uniqueness, idempotency, legacy preservation")
