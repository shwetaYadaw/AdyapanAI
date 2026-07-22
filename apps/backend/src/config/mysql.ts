import mysql from 'mysql2/promise';
import { env } from './env';
import { logger } from '../utils/logger';

let pool: mysql.Pool | null = null;

export function getMysqlPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: env.MYSQL_HOST,
      port: env.MYSQL_PORT,
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      database: env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function initializeMysql(): Promise<void> {
  try {
    // Connect to mysql without database first to ensure db exists
    const tempConn = await mysql.createConnection({
      host: env.MYSQL_HOST,
      port: env.MYSQL_PORT,
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
    });

    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${env.MYSQL_DATABASE}\``);
    await tempConn.end();

    const dbPool = getMysqlPool();
    logger.info('✅ MySQL connected successfully');

    // Create tables
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS roadmap_phases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phase_number INT NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        duration VARCHAR(100) DEFAULT '1-2 Weeks'
      ) ENGINE=InnoDB;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS roadmap_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phase_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        statement TEXT NOT NULL,
        difficulty VARCHAR(50) NOT NULL,
        topics VARCHAR(255),
        companies VARCHAR(255),
        time_limit INT DEFAULT 2000,
        memory_limit INT DEFAULT 256,
        input_format TEXT,
        output_format TEXT,
        constraints TEXT,
        sample_input TEXT,
        sample_output TEXT,
        templates JSON NOT NULL,
        test_cases JSON NOT NULL,
        xp_reward INT DEFAULT 10,
        FOREIGN KEY (phase_id) REFERENCES roadmap_phases(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS roadmap_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        question_id INT NOT NULL,
        code TEXT NOT NULL,
        language VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        error_message TEXT,
        runtime INT DEFAULT 0,
        passed_count INT DEFAULT 0,
        total_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (question_id) REFERENCES roadmap_questions(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    logger.info('✅ MySQL tables checked/created');
  } catch (error) {
    logger.error('❌ Failed to initialize MySQL:', error);
    logger.warn('⚠️ Running without MySQL database features.');
  }
}
