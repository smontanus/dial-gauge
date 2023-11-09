## Dial Gauge Web Component
[![Published on npm](https://img.shields.io/badge/npm-published-blue)](https://www.npmjs.com/package/dial-gauge)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/dial-gauge)
[![Version](https://img.shields.io/badge/version-0.1.3-brightgreen)](https://github.com/smontanus/dial-gauge)

Dial Gauge is a web component that provides a customizable dial gauge for numeric display. It is suitable for progress indication as well as graphical display of real time numeric data. It utilizes SVG and is written in pure Javascript with no dependencies.

### Installation
* **NPM**
    `npm install dial-gauge`

* **CDN**
    ```<script type="module" src="https://www.unpkg.com/dial-gauge/dial-gauge.js"></script>```

### Usage
The Dial Gauge component utilizes the custom element tag `<dial-gauge>`. The custom element has the following attributes:

* value - The custom element component value.
* scale-start - The custom element scale starting value.
* scale-end - The custom element scale ending value.
* main-title - The custom element main title, displayed at the top of the component.
* sub-title - The custom element subtitle, displayed at the bottom of the component.
* scale-offset - The custom element bottom offset, an angle applied to adjust the beginning and end of the scale.

The component will automatically update when attributes are set dynamically and displays a numeric representation of the data, as well as the graphical dial. Values that are outside the scale range will display OL for outside limits. The component 'sub-title' attribute is suitable for displaying the units of the data.

```html
<dial-gauge main-title="Main" sub-title="Sub" scale-start="0" scale-end="100" scale-offset="30" value="50">
</dial-gauge>
```

### CSS Style Variables
The following CSS property variables, along with their default values, are available for custom styling.
|Property Variable|Default Value|
|---|---|
|***General Element***|
|--dg-background-color|#ffffff|
|--dg-border|1px solid #000000|
|--dg-border-radius|5px|
|--dg-box-shadow|3px 3px 5px 1px rgba(0,0,0,0.35)|
|--dg-display|inline-block|
|--dg-height|200px|
|--dg-margin|0|
|--dg-width|200px|
|--dg-z-index|0|
|***Title***|
|--dg-title-color|#000000|
|--dg-title-font-family|Verdana, Geneva, Tahoma, sans-serif|
|--dg-title-font-size|1.5em|
|***Dial Arc***|
|--dg-arc-background-color|#efefef|
|--dg-arc-color|#000000|
|--dg-arc-width|20|
|***Numeric Display***|
|--dg-numeric-color|#000000|
|--dg-numeric-font-family|Verdana, Geneva, Tahoma, sans-serif|
|--dg-numeric-font-size|2.5em|
|***Subtitle***|
|--dg-subtitle-color|#000000|
|--dg-subtitle-font-family|Verdana, Geneva, Tahoma, sans-serif|
|--dg-subtitle-font-size|1em|

### Changing the Tag Name
The Dial Gauge component uses the `<dial-gauge>` tag in html. In certain cases users may want, or need, to change the tag name. This can be accomplished in Javascript by subclassing the element and registering this subclass under a new tag name.

```javascript
import {DialGauge} from 'dial-gauge';

customElements.define('my-new-tag', class extends DialGauge{});
```

### Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request.
