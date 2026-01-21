-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.34 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for estore
DROP DATABASE IF EXISTS `estore`;
CREATE DATABASE IF NOT EXISTS `estore` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `estore`;

-- Dumping structure for table estore.ratings
DROP TABLE IF EXISTS `ratings`;
CREATE TABLE IF NOT EXISTS `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `rating` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_store_rating` (`user_id`,`store_id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table estore.ratings: ~0 rows (approximately)
DELETE FROM `ratings`;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;

-- Dumping structure for table estore.stores
DROP TABLE IF EXISTS `stores`;
CREATE TABLE IF NOT EXISTS `stores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(400) NOT NULL,
  `owner_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `owner_id` (`owner_id`),
  KEY `idx_name` (`name`),
  KEY `idx_email` (`email`),
  KEY `idx_address` (`address`),
  CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table estore.stores: ~3 rows (approximately)
DELETE FROM `stores`;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` (`id`, `name`, `email`, `address`, `owner_id`, `created_at`, `updated_at`) VALUES
	(1, 'Tech Store', 'tech@store.com', '123 pimpri ,pune', NULL, '2026-01-21 15:35:02', '2026-01-21 16:30:28'),
	(2, 'Fashion Boutique', 'fashion@boutique.com', '456 akurdi pune', NULL, '2026-01-21 15:35:02', '2026-01-21 16:30:39'),
	(3, 'Grocery Mart', 'grocery@mart.com', '789 akurdi pune', NULL, '2026-01-21 15:35:02', '2026-01-21 16:30:48');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;

-- Dumping structure for table estore.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(400) DEFAULT NULL,
  `role` enum('admin','user','store_owner') NOT NULL DEFAULT 'user',
  `store_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_name` (`name`),
  KEY `fk_users_store` (`store_id`),
  CONSTRAINT `fk_users_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table estore.users: ~3 rows (approximately)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `email`, `password`, `address`, `role`, `store_id`, `created_at`, `updated_at`) VALUES
	(1, 'System Administrator', 'admin@gmail.com', '$10$wy2SgYAol84cI61yUFTQbenf2nlhqkC9B4wR07f6yMfNk/cwKPmjO', 'pune', 'admin', NULL, '2026-01-21 15:35:02', '2026-01-21 16:37:17'),
	(2, 'ashutosh', 'ashutosh@store.com', '$10$wy2SgYAol84cI61yUFTQbenf2nlhqkC9B4wR07f6yMfNk/cwKPmjO', 'pune', 'store_owner', 1, '2026-01-21 15:35:02', '2026-01-21 16:37:15'),
	(3, 'shubham', 'shubham@store.com', '$10$wy2SgYAol84cI61yUFTQbenf2nlhqkC9B4wR07f6yMfNk/cwKPmjO', 'pune', 'store_owner', 2, '2026-01-21 15:35:02', '2026-01-21 16:37:13'),
	(4, 'rahul patil 123456', 'r@gmail.com', '$2b$10$dGeYCowLQjexLkz1swWoLuTPIXDgxJRqbSMGeJuWvMWw2puchZk7i', 'kaneriwadi', 'user', NULL, '2026-01-21 16:01:51', '2026-01-21 16:32:20'),
	(5, 'tushar1234567890123445', 'Ashutosh1@gmail.com', '$2b$10$wy2SgYAol84cI61yUFTQbenf2nlhqkC9B4wR07f6yMfNk/cwKPmjO', 'kaneriwadi', 'user', NULL, '2026-01-21 16:36:14', '2026-01-21 16:36:14');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
