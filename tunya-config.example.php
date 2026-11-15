<?php
/**
 * Server-only settings for www.tunyafrika.com.
 *
 * Copy this file to the folder ABOVE public_html on cPanel, i.e.
 *     /home/<cpanel-user>/tunya-config.php
 * so it can never be downloaded from the web. Never commit the real file.
 *
 * Make a password hash for each person (run anywhere PHP is installed, or in cPanel → Terminal):
 *     php -r 'echo password_hash("their-long-password", PASSWORD_DEFAULT), PHP_EOL;'
 * Use a different password of 14+ characters for each person.
 */
return [
  // Keys must match the crew ids in the admin (src/workspace/data/seed.js).
  "users" => [
    "crew_tm" => ["name" => "Theophilus Munashe Maposa", "hash" => "PASTE_BCRYPT_HASH_HERE"],
    "crew_rv" => ["name" => "Rudolph Benjamin Volkwyn", "hash" => "PASTE_BCRYPT_HASH_HERE"],
    "crew_dm" => ["name" => "Dzikamai Ronald Muchemedzi", "hash" => "PASTE_BCRYPT_HASH_HERE"],
  ],

  // Extra sites allowed to call the admin APIs with cookies (the live domain is always allowed).
  "allowed_origins" => [],

  // Optional: where rate-limit files live. Default: public_html/api/security-data (web access denied).
  // "data_dir" => "/home/<cpanel-user>/tunya-data",
];
