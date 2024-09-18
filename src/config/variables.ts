import { VariablesType } from '../types/variables.type';

let variables: VariablesType;

if (process.env.NODE_ENV === 'development') {
  variables = {
    BASE_URL: 'http://localhost:3000/',
    REMOTE_URL: 'http://localhost:4000/',
  };
}

if (process.env.NODE_ENV === 'test') {
  variables = {
    BASE_URL: 'https://dev.easyflow.chat/',
    REMOTE_URL: 'https://dev.backend.easyflow.chat/',
  };
}

if (process.env.NODE_ENV === 'production') {
  variables = {
    BASE_URL: 'https://easyflow.chat/',
    REMOTE_URL: 'https://backend.easyflow.chat/',
  };
}

export { variables };
