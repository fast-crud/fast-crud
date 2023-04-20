module.exports = {
    componentsRoot: 'packages/fast-crud/src/components', // the folder where CLI will start searching for components.
    components: '**/*.(tsx|vue|jsx)', // the glob to define what files should be documented as components (relative to componentRoot)
    outDir: 'docs/zh/api/components/crud', // folder to save components docs in (relative to the current working directry)
    apiOptions: {
        jsx: true // tell vue-docgen-api that your components are using JSX to avoid conflicts with TypeScript <type> syntax
    },
}
