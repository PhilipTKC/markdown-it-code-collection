"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeCollectionPlugin = void 0;
const pluginDefaults = {
    activeTab: "tab-active",
    activeCode: "code-active"
};
const codeCollectionPlugin = (md, pluginOpts = pluginDefaults) => {
    const OPEN_REGEX = /{{\s*group="(?<groupname>[^"]+)"\s+tabs=\[(?<tabs>[^\]]+)\]\s*}}/;
    const CLOSE_REGEX = /^{{\s+\/group\s+}}$/;
    md.core.ruler.push('code_collection', (state) => {
        const tokens = state.tokens;
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            /*
            * MATCHES {{ group="" tab=[""] }}
            * token.type: inline
            * token.content: {{ group="group1" tab=["tab1", "tab2", "tab3"] }}
            *
            * Replaces {{ group="group1" tab=["tab1", "tab2", "tab3"] }} with <!-- Start Group -->
            * Inserts <nav class="tab"><ul>...</ul></nav> after <!-- Start Group -->
            */
            if (token.type === 'inline' && token.content.match(OPEN_REGEX)) {
                const match = token.content.match(OPEN_REGEX);
                /*
                * match[1] = group name 'group1'
                * match[2] = tabs ['tab1', 'tab2', 'tab3']
                */
                const group = match[1];
                const tabs = match[2].split(',').map(tab => tab.trim().replace(/\"/g, ""));
                const tabList = tabs.map((tab, index) => {
                    const isActive = index === 0 ? pluginDefaults.activeTab : '';
                    return `<li class="code-tab ${isActive}" data-group="${group}" data-code-index="${index}">${tab.trim()}</li>`;
                }).join('');
                const customNavToken = new state.Token('code_collection', '', 0);
                customNavToken.info = `group="${group}"`;
                customNavToken.content = "<!-- Start Group -->";
                const customListToken = new state.Token('code_collection', '', 0);
                customListToken.info = `group-tabs`;
                customListToken.content = tabList;
                // Insert <!-- Start Group -->
                tokens.splice(i, 1, customNavToken);
                // Insert <nav class="tab"><ul>...</ul></nav> after <!-- Start Group -->
                tokens.splice(i + 1, 0, customListToken);
            }
            else if (token.type === 'inline' && token.content.match(CLOSE_REGEX)) {
                /*
                * Matches {{ /group }}
                * Replaces {{ /group }} with <!-- End Group -->
                */
                const tabEndToken = new state.Token('code_collection', '', 0);
                tabEndToken.content = "<!-- End Group -->";
                tabEndToken.info = `end-group`;
                tokens.splice(i, 1, tabEndToken);
            }
        }
        return true;
    });
    const defaultRender = md.renderer.rules.code_collection || ((tokens, idx, options, env, self) => {
        return self.renderToken(tokens, idx, options);
    });
    md.renderer.rules.code_collection = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const info = token.info.trim();
        if (info.match(/group="[^"]+"/)) {
            const tabToken = tokens[idx + 1];
            const listItem = tabToken.content;
            let output = `<!-- Start ${token.info} -->\n`;
            output += `<nav class="tab"><ul>${listItem}</ul></nav>\n`;
            return output;
        }
        if (info.match(/group-tabs/)) {
            return "";
        }
        if (info.match(/end-group/)) {
            return `${tokens[idx].content}\n`;
        }
        return defaultRender(tokens, idx, options, env, self);
    };
    const defaultRenderFence = md.renderer.rules.fence;
    let currentGroup = "";
    let isNewGroup = false;
    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const groupMatch = token.info.match(/group="(.*?)"/);
        const tabMatch = token.info.match(/tab="(.*?)"/);
        if (groupMatch && tabMatch) {
            const group = groupMatch[1].toLowerCase().replace(" ", "-");
            const tab = tabMatch[1].toLowerCase().replace(" ", "-");
            // Required to add the 'active' class to the first code block in the group
            if (currentGroup !== "" && group !== currentGroup) {
                isNewGroup = true;
            }
            else {
                isNewGroup = false;
            }
            if (currentGroup === "" && group !== currentGroup) {
                isNewGroup = true;
            }
            currentGroup = group;
            // Render Code Block with Group and Tab
            return `<div class="code-block ${group}-${tab} ${isNewGroup ? pluginDefaults.activeCode : ''}" data-code-group="${group}">${defaultRenderFence(tokens, idx, options, env, self)}</div>\n`;
        }
        else {
            // Render Default Code Block
            return defaultRenderFence(tokens, idx, options, env, self);
        }
    };
};
exports.codeCollectionPlugin = codeCollectionPlugin;
