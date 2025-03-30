CREATE TABLE "product_categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"parentId" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdBy" integer NOT NULL,
	"updatedBy" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "categoryId" integer;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_product_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."product_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "mainCategory";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "subCategory";