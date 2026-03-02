/**
 * Module declarations for shimmed packages.
 * These tell TypeScript that these modules exist and are resolved by Vite aliases.
 */

// Next.js modules
declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    pathname: string;
    prefetch: (url: string) => void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams<T extends Record<string, string> = Record<string, string>>(): T;
  export function redirect(url: string): void;
  export function notFound(): never;
  export type ReadonlyURLSearchParams = URLSearchParams;
}

declare module 'next/link' {
  import { ComponentType, AnchorHTMLAttributes, ReactNode } from 'react';
  interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    href: string | { pathname?: string; query?: Record<string, string> };
    replace?: boolean;
    prefetch?: boolean;
    scroll?: boolean;
    children?: ReactNode;
  }
  const Link: ComponentType<LinkProps>;
  export default Link;
  export { Link };
}

declare module 'next/image' {
  import { ComponentType, ImgHTMLAttributes } from 'react';
  interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string | { src: string };
    alt: string;
    fill?: boolean;
    priority?: boolean;
    quality?: number;
    placeholder?: string;
    blurDataURL?: string;
    unoptimized?: boolean;
  }
  const Image: ComponentType<ImageProps>;
  export default Image;
  export { Image };
  export type { ImageProps };
}

declare module 'next/headers' {
  export function cookies(): {
    get: (name: string) => { name: string; value: string } | undefined;
    getAll: () => { name: string; value: string }[];
    has: (name: string) => boolean;
    set: (...args: any[]) => void;
    delete: (...args: any[]) => void;
  };
  export function headers(): Headers;
}

declare module 'next/font/google' {
  interface FontConfig {
    weight?: string[];
    style?: string[];
    subsets?: string[];
    display?: string;
  }
  export function Roboto(config?: FontConfig): { className: string; style: Record<string, string> };
  export function Inter(config?: FontConfig): { className: string; style: Record<string, string> };
  export default function GoogleFont(config?: FontConfig): { className: string; style: Record<string, string> };
}

declare module 'next/server' {
  export class NextRequest extends Request {
    nextUrl: URL;
  }
  export class NextResponse extends Response {
    static json(data: any, init?: ResponseInit): Response;
    static redirect(url: string | URL, status?: number): Response;
    static next(): Response;
  }
}

declare module 'next/script' {
  import { ComponentType, ScriptHTMLAttributes, ReactNode } from 'react';
  interface ScriptProps extends ScriptHTMLAttributes<HTMLScriptElement> {
    id?: string;
    strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker';
    onLoad?: () => void;
    onReady?: () => void;
    onError?: () => void;
    children?: ReactNode;
  }
  const Script: ComponentType<ScriptProps>;
  export default Script;
  export { Script };
}

declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    icons?: { icon?: string };
  }
  export type GetServerSideProps<T = any> = (context: any) => Promise<{ props: T }>;
  export type GetStaticProps<T = any> = (context: any) => Promise<{ props: T }>;
}

declare module 'next/dist/shared/lib/app-router-context.shared-runtime' {
  export interface AppRouterInstance {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (url: string) => void;
    pathname: string;
  }
}

// NextAuth modules
declare module 'next-auth/react' {
  export type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading';
  export interface Session {
    accessToken: string;
    apiUrl: string;
    roles: any[];
    tenantCode: string[];
    isDzoneUser: boolean;
    user: any;
    tenantType: string;
    modules: Record<string, boolean>;
    moduleAccessList: any[];
    permissions: string[];
    error: string;
  }
  export function useSession(): { data: Session | null; status: SessionStatus; update: () => void };
  export function getSession(): Promise<Session | null>;
  export function signIn(provider?: string, credentials?: any): Promise<{ ok: boolean; error: any }>;
  export function signOut(options?: { redirect?: boolean }): Promise<void>;
  export function SessionProvider(props: { children: React.ReactNode }): React.ReactNode;
}

declare module 'next-auth' {
  export interface AuthOptions {
    pages?: { signIn?: string };
    providers?: any[];
    callbacks?: any;
    secret?: string;
    session?: any;
  }
  export interface User {
    name?: string;
    email?: string;
    image?: string;
    userId?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    accessToken?: string;
    tenantCode?: string[];
    isDzoneUser?: boolean;
    roles?: any[];
    permissions?: string[];
    modules?: any[];
    type?: string;
  }
  export interface Session {
    accessToken: string;
    apiUrl: string;
    roles: any[];
    tenantCode: string[];
    isDzoneUser: boolean;
    user: any;
    tenantType: string;
    modules: Record<string, boolean>;
    moduleAccessList: any[];
    permissions: string[];
    error: string;
  }
  export function getServerSession(authOptions?: any): Promise<Session | null>;
  const authOptions: AuthOptions;
  export default authOptions;
}

declare module 'next-auth/providers/credentials' {
  export default function CredentialsProvider(config: any): any;
}

// Refine modules
declare module '@refinedev/core' {
  import React from 'react';
  export interface BaseRecord { id?: string | number; [key: string]: any; }
  export interface HttpError { message: string; statusCode: number; [key: string]: any; }
  export interface IResourceItem { name: string; list?: string; create?: string; edit?: string; show?: string; meta?: any; [key: string]: any; }
  export type ResourceProps = IResourceItem;
  export interface AuthBindings { login?: (params: any) => Promise<any>; logout?: (params?: any) => Promise<any>; check?: (params?: any) => Promise<any>; onError?: (error: any) => Promise<any>; getPermissions?: (params?: any) => Promise<any>; getIdentity?: (params?: any) => Promise<any>; }
  export interface I18nProvider { translate: (key: string, options?: any) => string; changeLocale: (lang: string) => Promise<any> | void; getLocale: () => string; }
  export function Refine(props: { children?: React.ReactNode; [key: string]: any }): React.ReactNode;
  export function Authenticated(props: { children: React.ReactNode; fallback?: React.ReactNode; key?: string }): React.ReactNode;
  export function useIsAuthenticated(): { data: { authenticated: boolean }; isLoading: boolean; isSuccess: boolean; isError: boolean };
  export function usePermissions<T = any>(): { data: T };
  export function useGetIdentity<T = any>(): { data: T | null };
  export function useLogin(): { mutate: (params: any) => Promise<any> };
  export function useLogout(): { mutate: () => Promise<any> };
  export function useTranslate(): (key: string, options?: any) => string;
  export function useGetLocale(): () => string;
  export function useSetLocale(): (lang: string) => Promise<void>;
  export function useResource(): { resource: any; resources: any[]; resourceName: string; select: (name: string) => any };
  export function useList<T = any, E = any, R = T>(params?: any): { data: { data: T[]; total: number }; isLoading: boolean; isError: boolean; refetch: () => Promise<void> };
}

declare module '@refinedev/antd' {
  import React from 'react';
  export function ErrorComponent(props?: any): React.ReactNode;
  export function ThemedLayoutV2(props: { children?: React.ReactNode; [key: string]: any }): React.ReactNode;
  export function ThemedSiderV2(props: any): React.ReactNode;
  export function ThemedTitleV2(props: any): React.ReactNode;
  export interface RefineLayoutThemedTitleProps { collapsed?: boolean; [key: string]: any; }
  export interface RefineThemedLayoutV2SiderProps { Title?: React.ComponentType<any>; render?: (props: any) => React.ReactNode; [key: string]: any; }
}

declare module '@refinedev/kbar' {
  import React from 'react';
  export function RefineKbar(props?: any): React.ReactNode;
  export function RefineKbarProvider(props: { children?: React.ReactNode }): React.ReactNode;
}

declare module '@refinedev/nextjs-router' {
  const routerProvider: any;
  export default routerProvider;
  export function NavigateToResource(props?: { resource?: string }): React.ReactNode;
}

declare module '@refinedev/simple-rest' {
  export default function dataProviderSimpleRest(apiUrl: string): any;
}

declare module '@ant-design/nextjs-registry' {
  import React from 'react';
  export function AntdRegistry(props: { children: React.ReactNode }): React.ReactNode;
}

declare module '@refinedev/ui-types/dist/types' {
  export interface SiderRenderProps {
    items: React.ReactNode;
    logout: React.ReactNode;
    dashboard: React.ReactNode;
    collapsed: boolean;
  }
}

// Node.js modules
declare module 'https' {
  export class Agent {
    constructor(options?: { rejectUnauthorized?: boolean });
  }
}

declare module 'cryptr' {
  export default class Cryptr {
    constructor(secret: string);
    encrypt(text: string): string;
    decrypt(encryptedString: string): string;
    encryptAsync(text: string): Promise<string>;
    decryptAsync(encryptedString: string): Promise<string>;
  }
}
