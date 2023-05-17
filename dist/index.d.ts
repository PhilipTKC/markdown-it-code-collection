import { PluginWithOptions } from 'markdown-it';
export interface CodeColPluginOpts {
    activeTab?: string;
    activeCode?: string;
}
export declare const codeCollectionPlugin: PluginWithOptions<CodeColPluginOpts>;
