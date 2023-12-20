export const replaceNullWithSpace = (dataArray) => {
    return dataArray.map(item => {
        // Iterate through the object properties
        Object.keys(item).forEach(key => {
            // Check if the property value is null, replace with space
            if (item[key] === null || item[key] === "null") {
                item[key] = '';
            }
        });
        return item;
    });
};