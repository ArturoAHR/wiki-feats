import { Migration } from "@mikro-orm/migrations";

export class Migration20240327034221_add_articles_and_thumbnails_tables extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "thumbnails" ("id" uuid not null, "url" varchar(255) not null, "width" int not null, "height" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "thumbnails_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "articles" ("id" uuid not null, "title" varchar(255) not null, "extract" varchar(255) not null, "article_url" varchar(255) not null, "article_type" text check ("article_type" in (\'featured\', \'most-read\', \'news\', \'on-this-day\')) not null, "wikipedia_page_id" varchar(255) not null, "featured_date" date not null, "thumbnail_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "articles_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "articles" add constraint "articles_thumbnail_id_unique" unique ("thumbnail_id");',
    );

    this.addSql(
      'alter table "articles" add constraint "articles_thumbnail_id_foreign" foreign key ("thumbnail_id") references "thumbnails" ("id") on update cascade;',
    );
  }
}
