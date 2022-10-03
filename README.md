<p align="center">
  <img src="https://api.iconify.design/carbon/tree.svg?color=%2342b883" width="200"/>
</p>

<h2 align="center">
  ViteStrict
</h2>

<h6>
  <i>
    <div align="center">
      Vue 3 Composition API & Reactivity Transform / File-based routing / Layouts / APIs auto-importing
    </div>
    <div align="center">
      Vite / SSG / PWA / I18n / UnoCSS / Iconify / Pinia / Vitest / Playwright / Netlify / pnpm
    </div>
  </i>
</h6>

<p align="center">
  Mocking up web app with the opinionated variation of the <a href="https://github.com/antfu/vitesse">🏕️ Opinionated Vite Starter Template</a>.
</p>

<p align="center">
  ☁️ <a href="https://vitestrict.netlify.app/">Online Demo</a> ☁️
</p>

## 💡 About this project

The project is based on [🏕️Vitesse](https://github.com/antfu/vitesse) by [@antfu](https://github.com/antfu).\
The template has been refactored to enforce an opinionated way of managing file structure for predictability and easy scalability with a large application in mind.\
You will find a guide for the directory tree [below](#-project-structure).

The template aims to provide a clean basis with as little subjective preferences as possible (except for the pre-packed deps and the file architecture, of course).\
Most of the configuration settings remain default. Recommended Eslint presets are included, but mostly not tweaked in any unnecessary way.

You may want to configure the starter to match your own personal preferences before use.

## 🧰 Features

Most of the precious [Vitesse](https://github.com/antfu/vitesse) stuff is still here:

⚡️🗂🍍📑📲🎨😃🌍🔥🤙🏻🖨🦔🦾⚙️☁️

There are a few notable differences:

- 📦 Components auto importing ([unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)) is limited to base components only.

- 📥 APIs auto importing ([unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)) is applied to Vue, VueUse, Vue Router, I18n and user-defined global helpers.

- 🗒 [Markdown Support](https://github.com/antfu/vite-plugin-md) has been fully removed.

- 🧹 [Prettier](https://prettier.io/) has been added to the package.

- 🧪 [vue-router-mock](https://github.com/posva/vue-router-mock) has been added for more convenient mocking of router interactions.

- 🎭 [Playwright](https://playwright.dev/) has been added at the expense of [Cypress](https://www.cypress.io/).

## 🦧 Why

[Vitesse](https://github.com/antfu/vitesse) is a great starting point for any Vue app. It has basically everything you could want to have in your `package.json`.\
With a little of playing with it, however, I found the template to be a bit too far from where I could just start coding my things.\
In my projects, I prefer to have clear, pre-imposed rules and practises for extending app's source code. So adding a component, composable, or any other feature comes without a single doubt, such as "where do I put these?". The development process should be intuitive, without ambiguities, and basically mindless.

Smaller repositories usually aren't too difficult to maintain. Flat component architecture will do just fine.\
The larger projects are problematic though. The flat structure won't work, because components' parental prefixes will stack indefinitely. At the same time, nesting files has to be thoughtful and preferably pre-planned, or it can end up as a rabbit hole of frequent, time-consuming application refactoring.

I made this variation of Vitesse mainly for my own purposes, so I could start coding immediately after cloning the template without tweaking configs or remaking the directory tree.\
It aims to scale predictably and enforce consistent development at the cost of freedom and a few amenities.

## 🚚 Clone template

```bash
npx degit brofrain/vitestrict my-new-app
```

## 🛠️ Project setup

```bash
pnpm i
```

### 🔥 Compile and hot-reload for development

```bash
pnpm dev
```

### 🩺 Lint

```bash
pnpm lint
```

### 🔍 Type check

```bash
pnpm tsc
```

### 🧹 Format with [Prettier](https://prettier.io/)

```bash
pnpm format
```

### 🧪 Run tests with [Vitest](https://vitest.dev/)

```
pnpm test

pnpm test:run

pnpm test:coverage
```

### 🎭 Run tests with [Playwright](https://playwright.dev/)

```
pnpm test:e2e
```

### Run all 🩺🔍🧪🎭

```
pnpm review
```

### 🚀 Compile and minify for production

```bash
pnpm build
```

## 🏁 Checklist

- [ ] Change the project name in `package.json`
- [ ] Change the author name in `LICENSE` or simply remove the file
- [ ] Change the favicon in `public/`
- [ ] Track down all `STARTER_DOCS` comments across the template, make sure you're familiar with the functionality of the related code, and then remove the comment

## 🌳 Project structure

```bash
📁app
├─ 📁dist                         # output directory
├─ 📁locales                      # translation files
├─ 📁node_modules
├─ 📁public                       # static assets (https://vitejs.dev/guide/assets.html#the-public-directory)
├─ 📁src                          # source code
├─ 📁tests                        # Vitest tests
├─ 📁tests-e2e                    # Playwright tests
├─ ⚙️.env                         # environment variables
├─ ⚙️.eslintrc                    # Eslint config
├─ ⚙️.gitignore
├─ ⚙️.npmrc                       # pnpm config
├─ ⚙️.prettierrc                  # Prettier config
├─ 🚩index.html                   # Vite entry point
├─ 🏷️LICENSE
├─ 📦package.json                 # package config
├─ 🔒pnpm-lock.yaml
├─ 📜README.md
├─ ⚙️tsconfig.json                # TypeScript config
├─ ⚙️unocss.config.json           # UnoCSS config
└─ ⚙️vite.config.ts               # Vite config
```

### src/

```bash
📁src
├─ 📁api                          # functions connecting the application with external services
├─ 📁assets                       # assets used by the application (images, videos, locally stored fonts etc.)
├─ 📁components                   # components
├─ 📁composables                  # composables
├─ 📁helpers                      # helper functions
├─ 📁layouts                      # layouts used by vite-plugin-vue-layouts
├─ 📁modules                      # plugin modules
├─ 📁pages                        # views used by vite-plugin-pages & Vue Router
├─ 📁stores                       # Pinia stores
├─ 📁styles                       # styles
├─ 📁types                        # types
├─ 🔻App.vue                      # root component of the application
├─ 🔹main.ts                      # initialization code of the application
├─ 🔹env.d.ts                     # type declarations for environment variables
├─ 🔹shims.d.ts                   # module declaration for .vue files
├─ 🔹__vite_auto-imports.d.ts     # type declarations for unplugin-auto-import plugin (auto-generated - don't edit)
└─ 🔹__vite_components.d.ts       # type declarations for unplugin-vue-components plugin (auto-generated - don't edit)
```

More detailed subfolders descriptions:

#### src/**api**/

Files of directories inside `api/` should contain functions that return ready-to-use data fetched from external services.

```bash
📁api
├─ 📁gql   # GraphQL
├─ 📁rest  # REST
└─ 📁ws    # WebSocket
```

It's best to group the functions by their functionality scope:

```bash
📁api
└─ 📁rest
   ├─ 🔹blog.ts
   └─ 🔹user.ts
```

or API used:

```bash
📁api
└─ 📁rest
   ├─ 🔹github.ts
   └─ 🔹gitlab.ts
```

It's very likely that you will utilize only one of these techniques in your project. Feel free to simplify the architecture then:

```bash
📁api
├─ 🔹blog.ts
└─ 🔹user.ts
```

#### src/**assets**/

Assets referenced in the source code should be stored here.\
👉 [Vite Asset Handling Guide](https://vitejs.dev/guide/assets.html)

```bash
📁assets
├─ 🖼️example.png
└─ 🖼️example.svg
```

```bash
📁assets
├─ 📁img
│  ├─ 🖼️example.png
│  └─ 🖼️example.svg
├─ 📁font
│  └─ 🆎example.ttf
└─ 📁media
   └─ 🎞️example.mp4
```

#### src/**components**/

```
📁components
├─ 📁_base
├─ 📁&app
├─ 📁&shared
└─ 📁[page-name]
```

##### Components folder structure:

- `_base/` should contain **base components** (e.g. buttons, inputs, tables) widely reused in the application.\
  These components are globally auto-imported (thanks to [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)) and receive "base" prefix (the prefix can be changed via `vite.config.ts`).\
  It's recommended to use kebab-case in source code for them to clearly distinguish globally-available components from the manually imported ones.\
  The "\_" directory prefix is meant to mark the folder as special, separated from anything else. Its contents should not be directly imported anywhere in the code.

- `&app/` is an optional folder meant to contain components imported directly in `App.vue`.\
  The "&" prefix prevents the directory from being confused with folders named after router's page components.

- `&layouts/` is an optional folder that holds subfolders for specific layouts. These subfolders are intended to contain the child components of the related layout components.

- `&shared/` should contain reusable components that are too compound to be treated as base components (e.g. search bar, ad banner, confirmation modal).\
  Folders like this should also be created inside page-specific directories or even deeper in the structure whenever reusable non-base components appear. Their parent folders limit the scopes of their usability (e.g. contents of `src/components/&shared/` can be imported anywhere in the code, while components inside `src/components/blog/&shared/` should not be used outside of the `src/components/blog/` directory. Likewise contents of `src/components/blog/slider/&shared/` are meant to be referenced only inside the `src/components/blog/slider/` directory).\
  Same as with `&app/` and `&layouts/`, the "&" prefix distinguishes the folder from directories associated with specific pages or with adjacent components.

- `xyz/` is the folder associated with the "xyz" page. Each page should have its own component directory, named after its filename in `src/pages/` (e.g. `src/pages/index.vue` should have its components stored inside `src/components/index/`, while `src/pages/blog.vue` (or `src/pages/blog/index.vue`) should store its unique children inside `src/components/blog/`).\
  These folders should **not** be nested. Instead parent page name has to be added as a prefix to a nested page folder name (e.g. in your application you want to preview a specific user at "/app/user/[id]" and display all users at the "/app/user/all" url. To do so, you can create pages `src/pages/user/[id].vue` and `src/pages/user/all.vue`. Then you will store components of each of these pages inside directories `src/components/user-[id]/` and `src/components/user-all/` respectively).

##### Why "&"?

The prefix doesn't really matter - it's only meant to clearly identify a folder as not related to a page or, if nested, as not related to an adjacent component.\
Why exactly "&"? The inspiration comes from SASS and its approach to class nesting:

```scss
.a {
  .b {
    color: blue;
  }

  &.c {
    color: cyan;
  }
}
```

```html
<div class="a">
  <div class="b">blue</div>
</div>

<div class="a c">cyan</div>
```

This is pretty much what the prefixed folders contain - resources referenced in the same scope as the stuff adjacent to their parents. They could be stored outside of the "&" wrappers, but they have to be grouped, so they don't blend together with other components.

##### Style guide

For simplicity, it's best to treat the [official style guide](https://vuejs.org/style-guide/) as the most basic set of rules.\
However, due to being a bit outdated and presenting a different solution to the file distribution problem, a few deviations are necessary.

All component names should be PascalCase - both filenames and in-template tags. Following the rule, forcing component names to be multi-word is **not** necessary (~~[A - use multi-word component names](https://vuejs.org/style-guide/rules-essential.html#use-multi-word-component-names)~~) - the code will not produce any conflicts with HTML elements.

Child components or private composables should be stored in a directory named as their parent in kebab-case and adjacent to the parent (e.g. `src/components/blog/SomeSlider.vue` has its own unique buttons to change the active slide. This child button should be placed in `src/components/blog/some-slider/Button.vue`).

Since the file structure inside `src/components/` is not flat but nested, components should **not** include their parent in their name - the location of each component in the directory tree always describes where it is being referenced.\
A component name should be always as short as possible, but at the same time must fully describe what the component is and utilize full words over abbreviations ([B - full-word component names](https://vuejs.org/style-guide/rules-strongly-recommended.html#full-word-component-names)).\
It is also important not to forget about including "The" prefix in components that have only one active instance at a time ([B - single-instance component names](https://vuejs.org/style-guide/rules-strongly-recommended.html#single-instance-component-names)).

##### Example application structure:

```
📁components
├─ 📁_base
│  ├─ 🔻Button.vue
│  ├─ 🔻Checkbox.vue
│  └─ 🔻Input.vue
│
├─ 📁&app
│  ├─ 📁navbar
│  │  ├─ 🔻Link.vue
│  │  └─ 🔻TheBrand.vue
│  ├─ 🔻TheFooter.vue
│  └─ 🔻TheNavbar.vue
│
├─ 📁&layouts
│  └─ 📁docs
│     └─ 🔻TheContentNavigation.vue
│
├─ 📁&shared
│  └─ 🔻SomeSharedComponent.vue
│  └─ 🔻TheLoneSharedComponent.vue
│
├─ 📁index
│  ├─ 📁&shared
│  │  └─ 🔻SomeSubcomponentSharedAcrossIndexComponents.vue
│  ├─ 📁some-component
│  │  ├─ 🔻SomeSubcomponentOfSomeComponent.vue
│  │  └─ 🔹useSomeFeatureOfSomeComponent.ts
│  ├─ 🔻SomeComponent.vue
│  ├─ 🔻SomeOtherComponent.vue
│  └─ 🔻TheLoneComponent.vue
│
└─ 📁some-page
   └─ 🔻SomeComponent.vue
```

#### src/**composables**/

[Composables](https://vuejs.org/guide/reusability/composables.html) are stored here.\
Adjust the file structure to your needs.

#### src/**helpers**/

```bash
📁helpers
├─ 🔹_global.ts
├─ 🔹rest.ts
└─ 🔹utility.ts
```

`helpers/` folder should contain stateless helper functions grouped by their scope of functionality.\
`helpers/_gloabal.ts` is a special file whose contents are globally available without the need to import them (thanks to [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)). For obvious reasons, only very simple and self explanatory functions should be in here (e.g. typechecking helpers, array/object manipulators).

#### src/**layouts**/

Layout components used by [vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts) live here.

#### src/**pages**/

This folder utilizes the file based routing of [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages).\
Example:

```bash
📁pages
│
├─ 🔻index.vue  # /
│
├─ 🔻some-page.vue  # /some-page
│
├─ 📁some-other-page
│  │
│  ├─ 🔻index.vue  # /some-other-page
│  │
│  └─ 📁[someArg]
│     │
│     └─ 🔻[someSubArg].vue  # /some-other-page/[someArg]/[someSubArg]
│
└─ 🔻[...all].vue  # route not found
```

#### src/**stores**/

[Pinia](https://pinia.vuejs.org/) stores live here.\
👉 [Official Guide](https://pinia.vuejs.org/getting-started.html)

```bash
📁stores
├─ 🔹example1.ts
└─ 🔹example2.ts
```

#### src/**types**/

Types used throughout the application are stored here.\
Adjust the folder structure to your needs.

## 🏷️ License

[MIT License](https://opensource.org/licenses/MIT)

Copyright (c) 2022-PRESENT Kajetan Welc

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
