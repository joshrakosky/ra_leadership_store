# Partner PGP local folder

Use this directory on your machine for **non-secret workflow files** you generate while working with the partner (for example the exported **public** `.asc` file).

- **Do not** commit private keys, passphrases, or decrypted partner data to git.
- The `.gitignore` rule keeps everything here out of the repo **except** this `README.md`.

Suggested layout (create as needed):

- `republic-new-hires-partner-public.asc` — public key you send to the partner (from `scripts/export-partner-public-key.ps1`)
- `inbox/` — encrypted files from the partner
- `decrypted/` — plaintext after local decrypt (treat as sensitive; delete when no longer needed per policy)

See [docs/PARTNER_PGP_SOP.md](../docs/PARTNER_PGP_SOP.md) for the full procedure.
