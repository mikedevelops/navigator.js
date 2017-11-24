# Navigator.js

*A vanilla front end package to power in-page navigation*

## Introduction

Navigator is a light weight navigation plugin for in-page navigation links. Navigator maps element IDs provided in the plugin configuration to corrosponding anchor links.

## Installation

Install with NPM using the following command

```
npm install mikedevelops/navigator.js#v1.2.1 --save-dev
```

## Usage

This is an example initiation using some default and custom options, see **Options** for more information

```javascript
var exampleNav = new Navigator({
    activeClass: 'active',
    activeElement: 'list__item', // default: false
    defaultIndex: false, // default: 1
    offset: 0,
    pageLinkSelector: '.page-link',
    throttle: 75,
    updateState: true
});
```

## Example

Example page coming soon...

## Options

```
activeElement: false (default)
```

Any valid HTML Selector,  `.foo, #bar, *[data-active]`. The active element by default will be anchor link with corrorsponding href attribute, if activeClass is set to false.


```
activeClass: 'active' (default)
```

Class name applied to the current active navigation element.


```
defaultIndex: 1 (default)
```

The default active item (this is **not** zero indexed,  defaultIndex: 1 = first item). If set to false, first active item will activate once scrolled into view.


```
offset: 0 (default)
```

Active item offset, this is the amount in pixels an item will activate before it reaches the top of the viewport. Margin & padding are currently included by default.


```
pageLinkSelector: '.page-selector' (default)
```

Page link selector, this accepts any valid HTML selector to identify which links should be considered part of the Navigator menu.


```
throttle: 75 (default)
```

Amount in milliseconds the window scroll event is throttled. The default will update the Navigator's state every 75ms consecutive scroll events are fired. Increasing this amount will improve performance but affect Navigator's accuracy responding to scroll events.


```
updateState: true (default)
```

When set to true, this will replace the current browser history state using the history API. This will append the current active item's href attribute to the page's URL, this makes for better sharing of Navigator links.

## Callbacks

```
onActveItem: null (default)
```

A callback fired once the active item has changed, the active item `HTMLElement` is available as an argument.

```javascript
var exampleNav = new Navigator({
    callbacks: {
        onActiveItem: function (activeItem) {
         // your code here...
        }
    }
}
```

