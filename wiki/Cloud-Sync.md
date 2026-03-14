# Cloud Sync (Self-Hosted)

> This standalone page is deprecated as a primary doc. Use the canonical pages below depending on what you are trying to do.

Mindwtr's self-hosted cloud backend is a small sync server under `apps/cloud`. It is a sync endpoint for desktop/mobile clients, not the Mindwtr app UI.

## Canonical Pages

- Use [[Data and Sync]] for choosing a sync backend and configuring the client.
- Use [[Cloud Deployment]] for server setup, operations, and environment variables.
- Use [[Docker Deployment]] if you want the Docker-based deployment path.

## Quick Orientation

- The self-hosted cloud backend stores one JSON namespace per bearer token.
- Clients point at the `/v1` base URL and sync through `/v1/data`.
- Attachment APIs live under `/v1/attachments/...`.
- Deploy it behind HTTPS and treat the bearer token like a password.

Keep this page only as a redirect for older links and bookmarks.

## See Also

- [[Data and Sync]]
- [[Cloud Deployment]]
- [[Docker Deployment]]
- [[Dropbox Sync]]
