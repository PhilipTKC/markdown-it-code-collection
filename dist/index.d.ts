import { PluginWithOptions } from 'markdown-it';
export interface CodeCollectionPluginOpts {
    activeTab?: string;
    activeCode?: string;
}
export declare const codeCollectionPlugin: PluginWithOptions<CodeCollectionPluginOpts>;
