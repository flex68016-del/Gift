import { vi } from "vitest";

// Mock environment variables for tests
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.NEXT_PUBLIC_APP_NAME = "Moment";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
process.env.DATABASE_URL = "postgresql://test";
process.env.DATABASE_MIGRATION_URL = "postgresql://test-migration";
process.env.QSTASH_TOKEN = "test-qstash-token";
process.env.QSTASH_CURRENT_SIGNING_KEY = "test-current-key-32chars!!!";
process.env.QSTASH_NEXT_SIGNING_KEY = "test-next-key-32chars!!!";
process.env.STORAGE_PROVIDER = "supabase";
process.env.FEDAPAY_PUBLIC_KEY = "test-feda-public";
process.env.FEDAPAY_SECRET_KEY = "test-feda-secret";
process.env.FEDAPAY_WEBHOOK_SECRET = "test-feda-webhook";
process.env.RESEND_API_KEY = "test-resend-key";
process.env.EMAIL_FROM = "test@example.com";
process.env.UPSTASH_REDIS_REST_URL = "https://test.redis.upstash.com";
process.env.UPSTASH_REDIS_REST_TOKEN = "test-redis-token";
process.env.SESSION_SECRET = "test-session-secret-32chars!!!!";
process.env.TURNSTILE_SECRET_KEY = "test-turnstile-secret-32chars!!!!";
process.env.DATA_ENCRYPTION_KEY = "test-encryption-key-32chars!!!!";
process.env.EMAIL_HMAC_KEY = "test-email-hmac-key-32chars!!!!";
process.env.CRON_SECRET = "test-cron-secret-32chars!!!!";
process.env.GIFT_RETENTION_YEARS = "5";
