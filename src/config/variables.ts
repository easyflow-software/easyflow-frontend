import { VariablesType } from '../types/variables.type';
import { developmentVariables } from './development.variables';
import { productionVariables } from './production.variables';

let variables: VariablesType;

if (process.env.NODE_ENV === 'development') {
  variables = developmentVariables;
}

if (process.env.NODE_ENV === 'production') {
  variables = productionVariables;
}

export { variables };
