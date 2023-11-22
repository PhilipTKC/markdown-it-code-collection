import { PluginWithOptions } from 'markdown-it';
export interface CodeCollectionPluginOpts {
    activeTab?: string;
    activeCode?: string;
    copyTag?: string;
    copyIcon?: string;
    copyCSSName?: string;
}
export declare const codeCollectionPlugin: PluginWithOptions<CodeCollectionPluginOpts>;
