import { object, string } from 'yup';

type EnvironmentConfiguration = {
  NODE_ENV: 'development' | 'test' | 'production';
  NEXT_PUBLIC_REMOTE_URL: string;
  NEXT_PUBLIC_BASE_URL: string;
  NEXT_PUBLIC_WEBSOCKET_URL: string;
  NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY: string;
  REDIS_URL: string;
  CLOUDFLARE_TURNSTILE_SECRET_KEY: string;
};

class AppConfiguration {
  private static serverEnvConfigurationCache: EnvironmentConfiguration | null = null;

  public static get<T extends keyof EnvironmentConfiguration>(key: T): EnvironmentConfiguration[T] {
    return this.validatedEnv[key];
  }

  private static get validatedEnv(): EnvironmentConfiguration {
    if (this.serverEnvConfigurationCache) return this.serverEnvConfigurationCache;
    this.serverEnvConfigurationCache = this.validateEnv();
    return this.serverEnvConfigurationCache;
  }

  private static validateEnv(): EnvironmentConfiguration {
    const serverEnvSchema = object({
      NODE_ENV: string().oneOf(['development', 'test', 'production']).required(),
      NEXT_PUBLIC_REMOTE_URL: string().required(),
      NEXT_PUBLIC_BASE_URL: string().required(),
      NEXT_PUBLIC_WEBSOCKET_URL: string().required(),
      NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY: string().required(),
      REDIS_URL: string().required(),
      CLOUDFLARE_TURNSTILE_SECRET_KEY: string().required(),
    });

    // Validate process.env and strip unknown properties
    return serverEnvSchema.validateSync(process.env, {
      stripUnknown: true,
    });
  }
}

export default AppConfiguration;
