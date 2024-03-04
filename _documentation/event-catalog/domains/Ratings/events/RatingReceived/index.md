---
name: RatingReceived
version: 1.0.0
summary: |
  Event represents when a rating was created by a user and received from web frontend.
producers:
    - Web Frontend
consumers:
    - Rating Write Service
owners:
    - sirtoby
---

### Details

This event is produced by the web frontend when a user submits a rating for a board game.

<NodeGraph title="Consumer / Producer Diagram" />

<Schema />
