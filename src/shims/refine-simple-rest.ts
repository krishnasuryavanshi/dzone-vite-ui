/**
 * Shim for `@refinedev/simple-rest`.
 * Exports a stub data provider factory.
 */

export default function dataProviderSimpleRest(_apiUrl: string) {
  return {
    getList: async () => ({ data: [], total: 0 }),
    getOne: async () => ({ data: {} }),
    create: async () => ({ data: {} }),
    update: async () => ({ data: {} }),
    deleteOne: async () => ({ data: {} }),
    getApiUrl: () => _apiUrl,
  };
}
