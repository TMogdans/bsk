---
name: RatingCreated
version: 1.0.0
summary: |
  Event represents when a rating was persisted.
producers:
    - Rating Write Service
consumers:
    - Rating Read Service
owners:
    - sirtoby
---

<Admonition>tbd</Admonition>

### Details

This event is produced by the Rating Write Service when a rating is persisted.

<NodeGraph title="Consumer / Producer Diagram" />

<Schema />
