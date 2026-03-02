/**
 * Shim for `next/server`.
 * Stubs NextRequest / NextResponse for files that import them.
 * These should never actually be called in the Vite app.
 */

export class NextRequest extends Request {
  nextUrl: URL;
  constructor(input: RequestInfo, init?: RequestInit) {
    super(input, init);
    this.nextUrl = new URL(
      typeof input === 'string' ? input : (input as Request).url,
    );
  }
}

export class NextResponse extends Response {
  static json(data: any, init?: ResponseInit) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  }
  static redirect(url: string | URL, status?: number) {
    return Response.redirect(url, status);
  }
  static next() {
    return new Response(null, { status: 200 });
  }
}
