module.exports = {
    componentsRoot: 'packages/fast-extends/src/', // the folder where CLI will start searching for components.
    components: '**/*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
    outDir: 'docs/zh/api/components/extends/', // folder to save components docs in (relative to the current working directry)
    apiOptions: {
        jsx: true // tell vue-docgen-api that your components are using JSX to avoid conflicts with TypeScript <type> syntax
    },
}
