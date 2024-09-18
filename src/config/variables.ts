import { VariablesType } from '../types/variables.type';

let variables: VariablesType;
if (process.env.NODE_ENV === 'production' || window.location.href === 'https://easyflow.chat/') {
  variables = {
    BASE_URL: 'https://easyflow.chat/',
    REMOTE_URL: 'https://backend.easyflow.chat/',
  };
} else if (process.env.NODE_ENV === 'test' || window.location.href === 'https://dev.easyflow.chat/') {
  variables = {
    BASE_URL: 'https://dev.easyflow.chat/',
    REMOTE_URL: 'https://dev.backend.easyflow.chat/',
  };
} else {
  variables = {
    BASE_URL: 'http://localhost:3000/',
    REMOTE_URL: 'http://localhost:4000/',
  };
}

export { variables };
