import { Migration } from "@mikro-orm/migrations";

export class Migration20240329022800_change_article_thumbnail_relationship_to_many_to_one extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "articles" drop constraint "articles_thumbnail_id_unique";',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "articles" add constraint "articles_thumbnail_id_unique" unique ("thumbnail_id");',
    );
  }
}
