/**
 * @param {any[]} array 
 */
export function naturalLanguageJoin(array) {
    if (array.length > 1) {
        return `${array.slice(0, -1).join(', ')} e ${array.slice(-1)}`;
    }

    return array.join('');
}