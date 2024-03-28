import { Migration } from "@mikro-orm/migrations";

export class Migration20240328231431_set_article_context_as_nullable extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "articles" alter column "context" type text using ("context"::text);',
    );
    this.addSql('alter table "articles" alter column "context" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "articles" alter column "context" type text using ("context"::text);',
    );
    this.addSql('alter table "articles" alter column "context" set not null;');
  }
}
