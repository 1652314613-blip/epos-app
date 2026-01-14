-- Epos Talk - AI口语私教数据表迁移
-- 创建时间: 2026-01-12
-- 描述: 添加口语练习记录、表达积累本和口语能力评估三张表

-- 1. 口语练习记录表
CREATE TABLE IF NOT EXISTS `oral_practice_records` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `scenario` ENUM('textbook', 'exam', 'free') NOT NULL COMMENT '练习场景',
  `user_text` TEXT NOT NULL COMMENT '用户说的内容(转写文本)',
  `ai_evaluation` JSON NOT NULL COMMENT 'AI评价结果',
  `duration` INT NOT NULL COMMENT '录音时长(秒)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='口语练习记录表';

-- 2. 表达积累本表
CREATE TABLE IF NOT EXISTS `expression_collection` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `expression` TEXT NOT NULL COMMENT '地道表达',
  `context` TEXT COMMENT '使用场景/上下文',
  `source` VARCHAR(50) NOT NULL COMMENT '来源(oral/grammar/textbook)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_source` (`source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='表达积累本';

-- 3. 口语能力评估表
CREATE TABLE IF NOT EXISTS `oral_ability_assessment` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `grammar_score` DECIMAL(5,2) DEFAULT 0 COMMENT '语法评分(0-100)',
  `pronunciation_score` DECIMAL(5,2) DEFAULT 0 COMMENT '发音评分(0-100)',
  `fluency_score` DECIMAL(5,2) DEFAULT 0 COMMENT '流利度评分(0-100)',
  `vocabulary_score` DECIMAL(5,2) DEFAULT 0 COMMENT '词汇评分(0-100)',
  `authenticity_score` DECIMAL(5,2) DEFAULT 0 COMMENT '地道性评分(0-100)',
  `practice_count` INT DEFAULT 0 COMMENT '练习次数',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='口语能力评估';

-- 添加外键约束(如果users表存在)
-- ALTER TABLE `oral_practice_records` ADD CONSTRAINT `fk_oral_practice_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `expression_collection` ADD CONSTRAINT `fk_expression_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `oral_ability_assessment` ADD CONSTRAINT `fk_oral_ability_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;
