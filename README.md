# Markdown It Code Collection Plugin

## Description

Creates tabbed code blocks. Requires extra JS & CSS.

## Work in Progress

- [ ] Add option to allow prefixing of group syntax
- [ ] Add option to allow changing 'active' class name for both the tab and code block
- [ ] Tests

## Usage

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


## JS

```js
// Find all elements with the data-group attribute
const codeTabList = document.querySelectorAll('[data-group]');
const codeGroupMap = {} as { [key: string]: HTMLElement[] };

// Group all elements with the same data-group attribute value
codeTabList.forEach((element: HTMLElement) => {
    const codeGroup = element.getAttribute('data-group');

    if (!codeGroupMap[codeGroup]) {
        codeGroupMap[codeGroup] = [];
    }

    codeGroupMap[codeGroup].push(element);
});

// Add click event listener to each element in the same group
Object.keys(codeGroupMap).forEach((key) => {
    const groups = codeGroupMap[key];

    groups.forEach((element: HTMLDivElement) => {
        element.addEventListener('click', () => {
            // Remove active class from all elements in the same group
            groups.forEach(link => {
                link.classList.remove('active');
            });

            // Add active class to the clicked element
            element.classList.toggle('active');

            // Find the related data-group-code element
            const codeGroup = document.querySelectorAll(`[data-code-group="${key}"]`);

            // Hide all elements in the same group
            codeGroup.forEach((code: HTMLElement) => {
                code.classList.remove('active');
                code.style.display = 'none';
            });

            // Show the related data-group-code element
            const targetTabIndex = element.dataset.codeIndex;
            const targetCodeElement = document.querySelectorAll(`[data-code-group="${key}"]`)[targetTabIndex];
            targetCodeElement.classList.add('active');
            targetCodeElement.style.display = 'block';
        });
    });
});
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
    display: flex;
    font-size: 0.875rem;
    line-height: 1.25rem;
}
```