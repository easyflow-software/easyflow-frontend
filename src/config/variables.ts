import { VariablesType } from '../types/variables.type';

let variables: VariablesType;
if (process.env.NODE_ENV === 'production' || (window && window.location.hostname === 'easyflow.chat')) {
  variables = {
    BASE_URL: 'https://easyflow.chat/',
    REMOTE_URL: 'https://backend.easyflow.chat/',
  };
}

if (process.env.NODE_ENV === 'test' || (window && window.location.hostname === 'dev.easyflow.chat')) {
  variables = {
    BASE_URL: 'https://dev.easyflow.chat/',
    REMOTE_URL: 'https://dev.backend.easyflow.chat/',
  };
}

if (process.env.NODE_ENV === 'development' || (window && window.location.hostname === 'localhost')) {
  variables = {
    BASE_URL: 'http://localhost:3000/',
    REMOTE_URL: 'http://localhost:4000/',
  };
}

export { variables };
