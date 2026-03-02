/**
 * Shim for `next` (bare import).
 * Exports Metadata type and other top-level Next.js types.
 */

export interface Metadata {
  title?: string;
  description?: string;
  icons?: {
    icon?: string;
  };
}

// GetServerSideProps and other server types are no-ops
export type GetServerSideProps<T = any> = (context: any) => Promise<{ props: T }>;
export type GetStaticProps<T = any> = (context: any) => Promise<{ props: T }>;
export type InferGetServerSidePropsType<T> = T extends (
  context: any,
) => Promise<{ props: infer P }>
  ? P
  : never;
