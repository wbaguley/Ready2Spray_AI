CREATE TABLE "waitlist" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "waitlist_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"company" varchar(255),
	"phone" varchar(50),
	"message" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
