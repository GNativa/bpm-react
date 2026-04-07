import { useState } from "react";
import { fetchDataSource } from "../services/api";

export const loadingStatus = {
  ready: 1,
  loading: 2,
  loaded: 3,
  failed: 4,
}

/**
 * @param {DataSourceConfig} config
 */
export function useDataSource(config) {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(loadingStatus.ready);
  const [error, setError] = useState(null);

  /**
   * @param {string?} value 
   * @param {[]} extraFilters 
   * @returns {Promise<any[]>}
   */
  async function search(value = undefined, extraFilters = []) {
    try {
      setStatus(loadingStatus.loading);

      const result = await fetchDataSource({
        dataSource: config.name,
        token: config.token,
        searchField: config.searchField,
        searchingValue: value,
        filters: extraFilters,
      });

      setData(result || []);
      setStatus(loadingStatus.loaded);
      setError(null);

      return result || [];
    }
    catch (e) {
      setError(e.toString());
      setStatus(loadingStatus.failed);
      return [];
    }
  }

  return {
    data,
    error,
    status,
    search,
  };
}