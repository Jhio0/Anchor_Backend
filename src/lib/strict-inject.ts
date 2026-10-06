// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //
        
import { RepositoryTokensType } from './injection-tokens/repository-tokens';
import { ProviderTokensType } from './injection-tokens/provider-tokens';
const tsyringe_ = require("tsyringe");

function _inject(token: string) {
    return(0, tsyringe_.inject)(token)
}

function strictInjectDecoratorFactory<T>(){
    return _inject
}

const inject = strictInjectDecoratorFactory<
RepositoryTokensType
  | ProviderTokensType
>();

export { inject};
            