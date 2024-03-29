import { Migration } from "@mikro-orm/migrations";

export class Migration20240328220159_add_extract_html_and_context_columns_to_article_table extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "articles" add column "extract_html" text not null, add column "context" text not null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "articles" drop column "extract_html";');
    this.addSql('alter table "articles" drop column "context";');
  }
}
