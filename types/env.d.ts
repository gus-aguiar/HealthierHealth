declare namespace NodeJS {
  interface ProcessEnv {
    TWITTER_BEARER_TOKEN: string;
    DATABASE_URL: string;
    // ... other environment variables
  }
}
