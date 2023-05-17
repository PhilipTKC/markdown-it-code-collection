import { PluginWithOptions } from 'markdown-it';
export interface PluginOptions {
    activeTab?: string;
    activeCode?: string;
}
declare const codeCollectionPlugin: PluginWithOptions<PluginOptions>;
export default codeCollectionPlugin;
