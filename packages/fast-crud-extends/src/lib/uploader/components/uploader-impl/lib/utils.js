export async function buildKey(file, fileName, config) {
  return config.buildKey({
    fileName,
    file,
    ...config,
  });
}
