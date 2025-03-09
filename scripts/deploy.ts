import { exec } from "child_process"
import { promisify } from "util"
import * as dotenv from "dotenv"
import { S3 } from "@aws-sdk/client-s3"
import { createLogger, format, transports } from "winston"
import { cleanEnv, str } from "envalid"

dotenv.config()

const execAsync = promisify(exec)

// Configure logger
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`
    }),
  ),
  transports: [new transports.Console(), new transports.File({ filename: "deployment.log" })],
})

// Validate environment variables
const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  NEXTAUTH_SECRET: str(),
  NEXTAUTH_URL: str(),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  AWS_REGION: str(),
  S3_BUCKET: str(),
})

// Initialize S3 client
const s3 = new S3({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

async function createDatabaseBackup() {
  logger.info("Creating database backup...")
  await execAsync(`pg_dump ${env.DATABASE_URL} > backup.sql`)
}

async function runDatabaseMigrations() {
  logger.info("Running database migrations...")
  await execAsync("npx prisma migrate deploy")
}

async function buildProject() {
  logger.info("Building project...")
  await execAsync("npm run build")
}

async function uploadStaticFiles() {
  logger.info("Uploading static files to S3...")
  const command = `aws s3 sync ./public s3://${env.S3_BUCKET}/public --delete`
  await execAsync(command)
}

async function deployToServer() {
  logger.info("Deploying to server...")
  await execAsync("pm2 reload admin-panel")
}

async function checkServerHealth() {
  logger.info("Checking server health...")
  try {
    const { stdout } = await execAsync("curl http://localhost:3000/api/health")
    if (stdout.trim() !== '{"status":"ok"}') {
      throw new Error("Health check failed")
    }
  } catch (error) {
    throw new Error(`Health check failed: ${error.message}`)
  }
}

async function rollback(error: Error) {
  logger.error(`Deployment failed: ${error.message}`)
  logger.info("Rolling back...")

  // Restore database from backup
  await execAsync(`psql ${env.DATABASE_URL} < backup.sql`)

  // Rollback PM2 to previous version
  await execAsync("pm2 revert admin-panel")

  logger.info("Rollback completed")
}

async function deploy() {
  try {
    await createDatabaseBackup()
    await runDatabaseMigrations()
    await buildProject()
    await uploadStaticFiles()
    await deployToServer()
    await checkServerHealth()

    logger.info("Deployment completed successfully!")
  } catch (error) {
    await rollback(error)
    process.exit(1)
  }
}

deploy()

