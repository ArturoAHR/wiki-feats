import { Migration } from "@mikro-orm/migrations";

export class Migration20240327221754_set_url_and_extract_fields_as_text_columns extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "thumbnails" alter column "url" type text using ("url"::text);',
    );

    this.addSql(
      'alter table "articles" alter column "extract" type text using ("extract"::text);',
    );
    this.addSql(
      'alter table "articles" alter column "article_url" type text using ("article_url"::text);',
    );
    this.addSql(
      'alter table "articles" alter column "wikipedia_page_id" type int using ("wikipedia_page_id"::int);',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "thumbnails" alter column "url" type varchar(500) using ("url"::varchar(500));',
    );

    this.addSql(
      'alter table "articles" alter column "extract" type varchar(3000) using ("extract"::varchar(3000));',
    );
    this.addSql(
      'alter table "articles" alter column "article_url" type varchar(255) using ("article_url"::varchar(255));',
    );
    this.addSql(
      'alter table "articles" alter column "wikipedia_page_id" type varchar(255) using ("wikipedia_page_id"::varchar(255));',
    );
  }
}
