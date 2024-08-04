import { object, string } from 'yup';

type EnviromentConfiguration = {
  NODE_ENV: 'development' | 'production';
  REMOTE_URL: string;
  BASE_URL: string;
};

class AppConfiguration {
  private static envConfigurationCache: EnviromentConfiguration | null = null;
  public static get<T extends keyof EnviromentConfiguration>(key: T): EnviromentConfiguration[T] {
    return this.validatedEnv[key];
  }

  private static get validatedEnv(): EnviromentConfiguration {
    if (this.envConfigurationCache) return this.envConfigurationCache;
    this.envConfigurationCache = this.validateEnv();
    return this.envConfigurationCache;
  }

  private static validateEnv(): EnviromentConfiguration {
    const envConfiguration = object()
      .shape({
        NODE_ENV: string().oneOf(['development', 'production']).required(),
        REMOTE_URL: string().required(),
        BASE_URL: string().required(),
      })
      .validateSync(process.env, {
        stripUnknown: true,
      });
    return envConfiguration;
  }
}

export default AppConfiguration;
