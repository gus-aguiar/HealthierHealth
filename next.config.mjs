let userConfig = undefined;
try {
  userConfig = await import("./v0-user-next.config");
} catch (e) {
  // ignore error
}

// Verificação das variáveis de ambiente
const requiredEnvVars = [
  "PERPLEXITY_API_KEY",
  "AUTH_USERNAME",
  "AUTH_PASSWORD",
];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.warn(
      `${envVar} não está definida. Certifique-se de defini-la antes de iniciar o servidor.`
    );
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // Garantir que as variáveis de ambiente sejam passadas para o ambiente de execução
  env: {
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
    AUTH_USERNAME: process.env.AUTH_USERNAME,
    AUTH_PASSWORD: process.env.AUTH_PASSWORD,
  },
};

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return;
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

mergeConfig(nextConfig, userConfig);

export default nextConfig;
