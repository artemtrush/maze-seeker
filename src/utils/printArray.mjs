export default async function printArray(array) {
    const { table } = await loadModule('table');

    console.log(table(array));
}

const loadModule = async (modulePath) => {
    try {
        return await import(modulePath);
    } catch (e) {
        throw new Error(`Unable to import module ${modulePath}`);
    }
};
