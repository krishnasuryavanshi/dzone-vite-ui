import axios from 'axios';

// Dedicated axios instance for streaming requests
// Does NOT have interceptors (they break streaming by extracting response.data)
// Uses fetch adapter for browser streaming support
export const streamingAxios = axios.create();
