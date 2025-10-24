/* eslint-disable max-nested-callbacks */
export default function calc(tables) {
    let numberOfFields = 0;
    let baseLineCounter = 0;

    const filteredTables = Object.values(tables).filter(t => {
        if (typeof(t) === 'object') {
            if (t?.rows?.length > 7) {
                return true;
            }
        }
        return false;
    });

    Object.values(filteredTables).forEach((table) =>
        Object.values(table).forEach((elements, indexElements) =>
            indexElements % 2 === 1 && elements.forEach((element) => {
                element.forEach((_, indexEl) => indexEl !== 0 ? numberOfFields++ : '');
                // We are using non-strict comparison operator below because we have
                // default values as "0" and those values are considered empty.
                // So we are taking advantage of the coercion the non-strict comparison operator provides.
                // eslint-disable-next-line eqeqeq
                element.forEach((el, indexEl) => indexEl !== 0 && el && el !== '0' && baseLineCounter++);
            })
        )
    );

    const resultInPercentage = (baseLineCounter / numberOfFields) * 100;

    return { resultInPercentage };
}