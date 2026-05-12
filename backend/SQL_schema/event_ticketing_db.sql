-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2026 at 07:45 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12
CREATE DATABASE IF NOT EXISTS `event_ticketing_db`;
USE `event_ticketing_db`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `event_ticketing_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `booking_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `booking_date`, `total_amount`, `status`) VALUES
(1, 1, 1, '2026-05-10 17:56:00', 2500.00, 'confirmed'),
(3, 1, 2, '2026-05-10 17:56:00', 5000.00, 'pending'),
(11, 1, 1, '2026-05-11 15:30:06', 1000.00, 'confirmed'),
(13, 30, 2, '2026-05-12 05:41:03', 3500.00, 'confirmed'),
(14, 30, 2, '2026-05-12 05:41:31', 3500.00, 'confirmed');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Music', NULL),
(2, 'Technology', NULL),
(3, 'Sports', NULL),
(4, 'Food', NULL),
(5, 'Arts', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `event_date` datetime NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `organizer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `location`, `event_date`, `image_url`, `category_id`, `organizer_id`) VALUES
(1, 'Concert 2026', 'Description here', 'Colombo', '2026-05-20 00:00:00', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745', NULL, 1),
(2, 'Aura Musical Night', 'Live concert', 'Nelum Pokuna', '2026-06-15 19:00:00', 'https://spotseeker.s3.ap-south-1.amazonaws.com/public/events/flyers/202605011732-the-key-to-happiness-flyer.jpg', 1, 1),
(3, 'Future Tech Summit', 'AI conference', 'BMICH, Colombo', '2026-07-10 09:00:00', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678', 2, 1),
(4, 'Pro Golf Match', 'Annual trophy', 'Colombo Golf Club', '2026-08-05 07:30:00', 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image_url` longtext NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `title`, `image_url`, `category`, `created_at`) VALUES
(1, 'Musical Night 2025', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4', 'Concert', '2026-05-11 11:57:19'),
(2, 'Tech Workshop', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952', 'Workshop', '2026-05-11 11:57:19'),
(3, 'Beach Vibes', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', 'Party', '2026-05-11 11:57:19'),
(4, 'Gaming Arena', 'https://images.unsplash.com/photo-1542751371-adc38448a05e', 'Competition', '2026-05-11 11:57:19');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_status` enum('success','failed') DEFAULT 'success'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `payment_method`, `transaction_id`, `amount`, `payment_status`) VALUES
(6, 1, 'Credit Card', 'TXN987654321', 2500.00, 'success'),
(8, 3, 'Koko', 'TXN556677889', 5000.00, '');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket_types`
--

CREATE TABLE `ticket_types` (
  `id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `type_name` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total_quantity` int(11) NOT NULL,
  `available_quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket_types`
--

INSERT INTO `ticket_types` (`id`, `event_id`, `type_name`, `price`, `total_quantity`, `available_quantity`) VALUES
(1, 1, 'early Bird', 2000.00, 500, 100),
(2, 1, 'VIP Pass', 5000.00, 50, 25),
(3, 1, 'Standard', 15000.00, 10, 5),
(4, 2, 'Gold', 3500.00, 150, 107);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','organizer','customer') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(20) DEFAULT NULL,
  `profileImage` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `phone`, `profileImage`) VALUES
(1, 'shanuka', 'saranga@gmail.com', '$2b$10$79CwcVRALBnJwuEFF8bfiedxqa6Z3jH1TjzAEQebKn8WodTdCuigq', 'customer', '2026-05-10 17:11:07', NULL, NULL),
(24, 'shanuka', 'shanuka@gmail.com', '$2b$10$YeKkj9/0dTfGiAzEaei0a.7cYm05xZBVKCbG9wyKvVrUmUHH2n/ie', 'customer', '2026-05-11 19:58:36', NULL, NULL),
(25, 'fgsf', 'dadda123456@gnmail.com', '$2b$10$HWdC1nB91WbJWaFxfi8eBuPBZUMe34achqdrPLmC/oThPmE6wSPoS', 'customer', '2026-05-11 20:00:41', NULL, NULL),
(26, 'sdfda', 'sdfdfsd@gmail.com', '$2b$10$Q2kowKWrUaTKgR9kF65eb.L7E..Fdh38iLy75Q3UdqV5CERLeWHAi', 'customer', '2026-05-11 20:03:52', NULL, NULL),
(27, 'fdvfbfd', 'dsfvsdf@gmail.com', '$2b$10$xXg2dksjxbW6FTunGJKLhehqVwdfgnNHs7FdHivrWw7WI6DeA10Qa', 'customer', '2026-05-11 20:06:49', NULL, NULL),
(28, 'Admin', 'admin@events.com', '$2b$10$25GnHW/4Qiu74.HdVSDDcO0pnqDyYk1unArL8nzsUHNIR7cQ8FQm.', 'admin', '2026-05-11 20:09:57', NULL, NULL),
(29, 'fsgrdtfg', 'rs@gmail.com', '$2b$10$wcuG/FkG6njfjSm9INqycObokTRBsFhzg0RMZcNYu47eaLElqZtwO', 'customer', '2026-05-11 20:15:15', NULL, NULL),
(30, 'temp@gmail.com', 'temp@gmail.com', '$2b$10$mtSlYikxTfVUUVWSQvUFR.ckCmLO8lqMzwlR.LirPzOvAjxF1ssrG', 'customer', '2026-05-12 05:31:28', '1489635896', 'data:image/jpeg;base64,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'),
(31, 'segfsu', 'sddvbhjsv@gmail.com', '$2b$10$IHN2ORbM8sIca0x0K95CxuZpde55nCJzjFuSE/lyjhKbpJuRPuGHi', 'customer', '2026-05-12 05:36:25', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `organizer_id` (`organizer_id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_id` (`transaction_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `ticket_types`
--
ALTER TABLE `ticket_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ticket_types`
--
ALTER TABLE `ticket_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ticket_types`
--
ALTER TABLE `ticket_types`
  ADD CONSTRAINT `ticket_types_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
