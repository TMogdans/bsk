import { sql } from 'slonik';
import { Migration } from '@slonik/migrator';

export default new Migration({
  name: '02-seed-default-types',
  async run(db) {
    // Insert default event types
    await db.query(sql`
      INSERT INTO types (name, translations)
      VALUES 
        ('convention', '{"de": "Kongress", "en": "Convention"}'),
        ('fair', '{"de": "Messe", "en": "Fair"}'),
        ('tournament', '{"de": "Turnier", "en": "Tournament"}'),
        ('meeting', '{"de": "Spieletreff", "en": "Game Meeting"}')
      ON CONFLICT (name) DO NOTHING;
    `);
  }
});