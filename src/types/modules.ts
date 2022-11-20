import type { ViteSSGContext } from 'vite-ssg';

export type InstallModule = (ctx: ViteSSGContext) => void | Promise<void>;
