// Provider classification now lives in the accounts domain.
// Kept as a thin re-export so existing importers keep working; migrate
// imports to src/accounts/model/provider.js (or the accounts facade) over time.
export {
  type APIProvider,
  getAPIProvider,
  getAPIProviderForStatsig} from '../../accounts/model/provider.js'