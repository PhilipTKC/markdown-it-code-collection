# Markdown It Code Collection Plugin

## Description

Creates tabbed code blocks. The plugin will group all code blocks with the same group name and create a tabbed interface to switch between them.

This was created for [Quick-Start](https://github.com/PhilipTKC/quick-start)

### Plugin Options Defaults

```ts
const pluginDefaults: CodeCollectionPluginOpts = {
    activeTab: "tab-active",
    activeCode: "code-active",
    copyTag: "i",
    copyIcon: "fa-solid fa-copy",
    copyCSSName: "code-block-copy"
}
```

```ts
import { codeCollectionPlugin, CodeCollectionPluginOpts } from "markdown-it-code-collection";

.use<CodeCollectionPluginOpts>(codeCollectionPlugin, {
    activeTab: "tab-active",
    ...
})
```

### Usage (Syntax)

    {{ group="group1" tabs=["Typescript", "Javascript"] }}

    ```ts { group="group1" tab="Typescript" }
    console.log('Hello world');
    ```

    ```js { group="group1" tab="Javascript" }
    console.log('Hello world');
    ```

    ```md { group="group1" tab="Markdown" }
    # Hello world
    ```

    {{ /group }}

    {{ group="group2" tabs=["Markdown", "C#"] }}

    ```md { group="group2" tab="Markdown" }
    # Hello world
    ```

    ```csharp { group="group2" tab="C#" }
    Console.WriteLine("Hello world");
    ```

    {{ /group }}

### Usage (Aurelia)

```js

interface GroupedHTMLElements {
    [key: string]: HTMLElement[];
}


@inject(Element)
export class MyClass implements IRoutableComponent {
    private handleTabClick: (groups: HTMLElement[], element: HTMLElement, key: string) => void;

    private codeGroupMap: GroupedHTMLElements;

    constructor(private readonly element: Element) {
        this.handleTabClick = (groups, element, key) => {
            
            // Remove active class from all elements in the same group
            groups.forEach(tab => tab.classList.remove('active'));

            // Add active class to the clicked element
            element.classList.toggle('active');

            // Hide all elements in the same group
            const codeCollectionGroup = this.element.querySelectorAll(`[data-code-group="${key}"]`)
            codeCollectionGroup.forEach((codeBlock: HTMLElement) => {
                codeBlock.style.display = 'none';
                codeBlock.classList.remove('active');
            });

            // Show the related data-group-code element
            const targetTabIndex = element.dataset.codeIndex;
            const targetCodeBlockElement = codeCollectionGroup[targetTabIndex] as HTMLElement;
            targetCodeBlockElement.style.display = 'block';
            targetCodeBlockElement.classList.add('active');
        }
    }

    attached() {
        // Find all elements with the data-group attribute
        const codeTabList = Array.from(this.element.querySelectorAll('[data-group]'));

        // Group all elements with the same data-group attribute value
        this.codeGroupMap = codeTabList.reduce((map, element: HTMLElement) => {
            const codeGroup = element.getAttribute('data-group');
            (map[codeGroup] ??= []).push(element);
            return map;
        }, {});

        this.toggleEventListenersForCodeGroups("Add");
    }

    detaching() {
        this.toggleEventListenersForCodeGroups("Remove");
    }

    toggleEventListenersForCodeGroups(operation: "Add" | "Remove") {
        // Add or remove event listeners for each code group
        for (const [key, groups] of Object.entries(this.codeGroupMap)) {
            for (const element of groups) {
                if (operation === "Add") {
                    element.addEventListener('click', () => this.handleTabClick(groups, element, key));
                }

                if (operation === "Remove") {
                    element.removeEventListener('click', () => this.handleTabClick(groups, element, key));
                }
            }
        }
    }
}
```

### Usage (Typical)

## Javascript

```js
// Find all elements with the data-group attribute
const codeTabList = Array.from(document.querySelectorAll('[data-group]'));

// Group all elements with the same data-group attribute value
this.codeGroupMap = codeTabList.reduce((map, element) => {
    const codeGroup = element.getAttribute('data-group');
    (map[codeGroup] ??= []).push(element);
    return map;
}, {});

// Loop through each code group key in the map
Object.entries(codeGroupMap).forEach(([key, groups]) => {

    // Loop through each element in the current code group
    groups.forEach((element) => {
        element.addEventListener('click', () => {
            // Remove active class from all elements in the same group
            groups.forEach(tab => tab.classList.remove('active'));

            // Add active class to the clicked element
            element.classList.toggle('active');

            // Hide all elements in the same group
            const codeCollectionGroup = document.querySelectorAll(`[data-code-group="${key}"]`)
            codeCollectionGroup.forEach((codeBlock) => {
                codeBlock.style.display = 'none';
                codeBlock.classList.remove('active');
            });

            // Show the related data-group-code element
            const targetTabIndex = element.dataset.codeIndex;
            const targetCodeBlockElement = codeCollectionGroup[targetTabIndex];
            targetCodeBlockElement.style.display = 'block';
            targetCodeBlockElement.classList.add('active');
        });
    });
});
```

### CopyCode

```ts
export function copyCode(codeId: string) {
  const codeBlock = document.querySelector(`[data-code-id="${codeId}"]`);

  const code = codeBlock.querySelector("code").textContent;

  navigator.clipboard.writeText(code);
}

window.copyCode = copyCode;
```

Reusing the same view model will require the additional configuration

```js
.register(
    RouterConfiguration.customize({
        ...
        swapOrder: 'detach-current-attach-next',
    }),
```

## CSS

```css
.tab ul {
    display: flex;
    list-style: none;
}

.tab li {
    display: inline-flex;
    padding: 10px;
    background-color: rgb(248, 248, 248);
    user-select: none;
}

.code-tab.active {
    background-color: rgb(230, 230, 230);
}

.code-tab:hover {
    cursor: pointer;
    background-color: rgb(230, 230, 230);
}

.code-block:not(.active) {
    display: none;
}

.code-block {
    display: block;
    font-size: 0.875rem;
    line-height: 1.25rem;
    position: relative;
}

.code-block-copy {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
    cursor: pointer;
}
```
