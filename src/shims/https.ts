/**
 * Shim for Node.js `https` module.
 * Only the Agent class is used (in http.ts for Axios).
 * In the browser, HTTPS is handled by the browser itself.
 */

export class Agent {
  constructor(_options?: { rejectUnauthorized?: boolean }) {
    // no-op in browser
  }
}

export default { Agent };
