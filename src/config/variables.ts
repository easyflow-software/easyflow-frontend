import { VariablesType } from '../types/variables.type';

let variables: VariablesType;

if (process.env.NEXT_PUBLIC_STAGE === 'production') {
  variables = {
    BASE_URL: 'https://easyflow.chat/',
    REMOTE_URL: 'https://backend.easyflow.chat/',
  };
}

if (process.env.NEXT_PUBLIC_STAGE === 'test') {
  variables = {
    BASE_URL: 'https://dev.easyflow.chat/',
    REMOTE_URL: 'https://dev.backend.easyflow.chat/',
  };
}

if (process.env.NEXT_PUBLIC_STAGE === 'development') {
  variables = {
    BASE_URL: 'http://localhost:3000/',
    REMOTE_URL: 'http://localhost:4000/',
  };
}

export { variables };
