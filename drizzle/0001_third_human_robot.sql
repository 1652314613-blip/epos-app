CREATE TABLE `sms_verification_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phoneNumber` varchar(11) NOT NULL,
	`code` varchar(6) NOT NULL,
	`type` enum('login','register') NOT NULL,
	`used` int NOT NULL DEFAULT 0,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sms_verification_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phoneNumber` varchar(11);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_phoneNumber_unique` UNIQUE(`phoneNumber`);