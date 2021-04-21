module.exports = {
    componentsRoot: 'packages/extends/extends-uploader/src/components', // the folder where CLI will start searching for components.
    components: '**/*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
    outDir: 'docs/api/components/extends/uploader', // folder to save components docs in (relative to the current working directry)
}
