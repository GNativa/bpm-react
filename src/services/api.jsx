/**
 * @param {{
 *  dataSource: string,
 *  token: string,
 *  searchField: ?string,
 *  searchingValue: ?string,
 *  filters: any[],
 * }} 
 * @returns {Promise<any[]>}
 */
export async function fetchDataSource({
    dataSource,
    token,
    searchField,
    searchingValue,
    filters = [],
}) {
    const url = "https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/ecm_form/actions/getResultSet";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `bearer ${token}`,
        },
        body: JSON.stringify({
            dataSource,
            token,
            dataSourceField: searchField,
            searchingValue,
            filters,
            skip: 0,
            top: 10000,
        }),
    });

    const json = await response.json();

    if (response.status >= 300) {
        if (response.status === 401) {
            throw 'Sem autorização.';
        }

        if (json.message) {
            throw json.message;
        }

        throw 'Houve um erro ao carregar os dados. Tente novamente mais tarde.';
    }
    
    return JSON.parse(json["data"])["value"];
}