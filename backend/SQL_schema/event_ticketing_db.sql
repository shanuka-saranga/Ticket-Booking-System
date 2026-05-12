-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2026 at 10:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
(20, 2, 1, '2026-05-12 08:19:12', 1000.00, 'confirmed'),
(21, 2, 1, '2026-05-12 08:24:03', 1000.00, 'confirmed');

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
(1, 'Youth Music Fest 2026', 'The biggest musical event of the year organized by Admin.', 'Viharamahadevi Park', '2026-06-20 18:30:00', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIZZRAP14_nh9Rq8gVs3DCMiemtl64Mj7IbnKI7zSq50R_MI2ww7y_MqqX1WO6', 1, 1),
(2, 'Tech Innovation Summit', 'Explore the latest trends in web development and AI.', 'SLIIT Auditorium', '2026-08-15 09:00:00', 'https://images.unsplash.com/photo-1511578314322-379afb476865', 2, 1),
(3, 'Campus Coding Hackathon', '24-hour non-stop coding competition for students.', 'Faculty of Technology, Ruhuna', '2026-09-05 08:00:00', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d', 2, 1),
(4, 'Annual Beach Party', 'Summer beach party with fun activities and DJ music.', 'Mount Lavinia Beach', '2026-04-30 16:00:00', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3', 3, 1),
(5, 'Kandy Esala Perahera 2026', 'Experience the world-renowned cultural pageant of the Temple of the Sacred Tooth Relic.', 'Kandy', '2026-08-20 19:00:00', 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcROZJl27xbBzkBHyIxm03rBfAOjy3Pm5SHCtEo5SQlygyq8gndHmTgUzZFtqb3v', 1, 1),
(6, 'Galle Literary Festival', 'A gathering of international and local writers, poets, and artists in the historic Galle Fort.', 'Galle Fort', '2026-01-25 09:00:00', 'https://images.unsplash.com/photo-1512820790803-83ca734da794', 2, 1),
(7, 'Colombo Food Festival', 'Taste the best street food and gourmet dishes from all over Sri Lanka.', 'Viharamahadevi Park', '2026-03-12 11:00:00', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', 3, 1),
(8, 'Hikkaduwa Beach Fest', 'Three days of music, beach sports, and night parties at the Hikkaduwa coast.', 'Hikkaduwa Beach', '2026-04-10 16:00:00', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', 1, 1),
(9, 'Arugam Bay Surf Championship', 'International surfing competition at one of the world’s best surfing points.', 'Arugam Bay', '2026-07-05 07:30:00', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f', 3, 1),
(10, 'Lanka Comic Con 2026', 'The ultimate pop culture event for geeks, gamers, and cosplayers in Sri Lanka.', 'SLECC, Colombo', '2026-11-15 10:00:00', 'https://images.unsplash.com/photo-1534447677768-be436bb09401', 2, 1),
(11, 'Colombo Street Food Fiesta', 'Taste the best kottu, hoppers, and spicy street treats in Colombo.', 'Green Path, Colombo', '2026-06-05 17:00:00', 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSpSSnP1-_tNUgxV61EuVBjsPJ89qeAoaUK-GIWu6kX465_MwBY9V5Vn7Briigu', 4, 1),
(12, 'Traditional Food & Heritage Fair', 'Experience the authentic taste of Sri Lankan village cuisine and spices.', 'Independence Square', '2026-08-12 10:00:00', 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSnEhwtidxNWgTKsOujtNq87wfqTabVCtzAPkJ3MXSua78ra18qWrtVo3lv64VI', 4, 1),
(13, 'Kala Pola 2026', 'The biggest open-air art fair showcasing local paintings and sculptures.', 'Ananda Coomaraswamy Mawatha, Colombo', '2026-02-15 08:30:00', 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcThIUy_skXowYlOwc5QFkuVexeJzVHCKmO9kDN06B0XcHrxE8OB9JgWf5s2KcVK', 5, 1),
(14, 'Lankan Heritage Art Show', 'A vibrant performance of traditional Sri Lankan dance and shadow puppetry.', 'Lionel Wendt Art Centre', '2026-05-10 18:00:00', 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT74MQlakTgXDx-WmyLUF-6M6Z9FcM_Ykn3PA5VwxUT2gqL6ScIDG78sWy2OYDh', 5, 1);

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
(10, 1, 'VIP', 5000.00, 50, 50),
(11, 1, 'Gold', 3500.00, 100, 104),
(12, 1, 'Silver', 2000.00, 200, 200),
(13, 1, 'General', 1000.00, 500, 260),
(14, 2, 'VIP', 6000.00, 30, 30),
(15, 2, 'Gold', 4000.00, 80, 75),
(16, 2, 'Silver', 2500.00, 150, 50),
(17, 2, 'General', 1500.00, 300, 300),
(18, 3, 'VIP', 4500.00, 40, 40),
(19, 3, 'Gold', 3000.00, 100, 100),
(20, 3, 'Silver', 2000.00, 200, 200),
(21, 3, 'General', 1200.00, 400, 40),
(22, 4, 'VIP', 7000.00, 20, 20),
(23, 4, 'Gold', 5000.00, 50, 50),
(24, 4, 'Silver', 3000.00, 100, 100),
(25, 4, 'General', 2000.00, 200, 12),
(26, 5, 'VIP', 5500.00, 60, 60),
(27, 5, 'Gold', 3500.00, 120, 120),
(28, 5, 'Silver', 2500.00, 200, 200),
(29, 5, 'General', 1500.00, 500, 500),
(30, 6, 'VIP', 8000.00, 15, 15),
(31, 6, 'Gold', 5500.00, 40, 40),
(32, 6, 'Silver', 3500.00, 80, 80),
(33, 6, 'General', 2500.00, 150, 150),
(34, 7, 'VIP', 4000.00, 50, 50),
(35, 7, 'Gold', 2500.00, 100, 100),
(36, 7, 'Silver', 1500.00, 200, 200),
(37, 7, 'General', 800.00, 500, 500),
(38, 8, 'VIP', 6500.00, 25, 25),
(39, 8, 'Gold', 4500.00, 60, 60),
(40, 8, 'Silver', 3000.00, 120, 120),
(41, 8, 'General', 1800.00, 250, 250),
(42, 9, 'VIP', 5000.00, 40, 40),
(43, 9, 'Gold', 3500.00, 100, 100),
(44, 9, 'Silver', 2000.00, 180, 180),
(45, 9, 'General', 1000.00, 400, 400),
(46, 10, 'VIP', 7500.00, 20, 20),
(47, 10, 'Gold', 5000.00, 50, 50),
(48, 10, 'Silver', 3500.00, 100, 100),
(49, 10, 'General', 2200.00, 200, 200),
(50, 11, 'VIP', 4800.00, 45, 45),
(51, 11, 'Gold', 3200.00, 90, 90),
(52, 11, 'Silver', 1800.00, 150, 150),
(53, 11, 'General', 1100.00, 350, 350),
(54, 12, 'VIP', 5200.00, 35, 35),
(55, 12, 'Gold', 3800.00, 80, 80),
(56, 12, 'Silver', 2200.00, 140, 140),
(57, 12, 'General', 1300.00, 300, 300),
(58, 13, 'VIP', 9000.00, 10, 10),
(59, 13, 'Gold', 6000.00, 30, 30),
(60, 13, 'Silver', 4000.00, 60, 60),
(61, 13, 'General', 3000.00, 100, 100),
(62, 14, 'VIP', 5000.00, 50, 50),
(63, 14, 'Gold', 3500.00, 100, 100),
(64, 14, 'Silver', 2000.00, 200, 200),
(65, 14, 'General', 1200.00, 450, 450);

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
(1, 'Admin', 'admin@events.com', '$2b$10$25GnHW/4Qiu74.HdVSDDcO0pnqDyYk1unArL8nzsUHNIR7cQ8FQm.', 'admin', '2026-05-11 20:09:57', NULL, NULL),
(2, 'temp@gmail.com', 'temp@gmail.com', '$2b$10$AQNond8iwnJFmB6SP0RlLuMIIUNf.jozsP6mMKCg5rPJINtXJm83O', 'customer', '2026-05-12 07:43:05', NULL, NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

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
