/**
 * @file dial-gauge.js
 * @fileOverview Dial Gauge is a web component that provides a
 * customizable dial gauge for numeric display. It utilizes SVG
 * and is written in pure Javascript with no dependencies.
 * @version 0.1.2
 * @author Stephen Montanus <steve@stevemontanus.com>
 * @copyright ©2023 Stephen Montanus Software Engineering.
 * @license MIT
 */

/** @constant {Object} */
const template = document.createElement('template');
template.innerHTML = `
<style>
    .dial-gauge {
        background-color: var(--dg-background-color, #ffffff);
        border: var(--dg-border, 1px solid #000000);
        border-radius: var(--dg-border-radius, 5px);
        box-shadow: var(--dg-box-shadow, 3px 3px 5px 1px rgba(0,0,0,0.35));
        display: var(--dg-display, inline-block);
        height: var(--dg-height, 200px);
        margin: var(--dg-margin, 0);
        text-align: center;
        width: var(--dg-width, 200px);
        z-index: var(--dg-z-index, 0);
    }

    #gauge-title {
        display: none;
        fill: var(--dg-title-color, #000000);
        font-family: var(--dg-title-font-family, Verdana, Geneva, Tahoma, sans-serif);
        font-size: var(--dg-title-font-size, 1.5em);
        text-anchor: middle;
    }

    svg > #gauge-background-arc {
        stroke: var(--dg-arc-background-color, #efefef);
        stroke-width: var(--dg-arc-width, 20);
    }

    svg > #gauge-arc {
        stroke: var(--dg-arc-color, #000000);
        stroke-width: var(--dg-arc-width, 20);
    }

    #gauge-numeric {
        display: none;
        dominant-baseline: middle;
        fill: var(--dg-numeric-color, #000000);
        font-family: var(--dg-numeric-font-family, Verdana, Geneva, Tahoma, sans-serif);
        font-size: var(--dg-numeric-font-size, 2.5em);
        text-anchor: middle;
    }

    #gauge-subtitle {
        display: none;
        fill: var(--dg-subtitle-color, #000000);
        font-family: var(--dg-subtitle-font-family, Verdana, Geneva, Tahoma, sans-serif);
        font-size: var(--dg-subtitle-font-size, 1.0em);
        text-anchor: middle;
    }
</style>

<div class="dial-gauge">
    <svg width="100%" height="100%">
        <text id="gauge-title" x="50%" y="11%"></text>
        <path id="gauge-background-arc" fill="none" />
        <path id="gauge-arc" fill="none" />
        <text id="gauge-numeric" x="50%" y="50%">0.0</text>
        <text id="gauge-subtitle" x="50%" y="96%"></text>
    </svg>
</div>
`;

/**
 * Creates a new DialGauge custom HTML element. Utilized in HTML as the <dial-gauge> tag.
 * @name DialGauge
 * @class
 * @extends HTMLElement
 */
export class DialGauge extends HTMLElement {
    /**
     * @description Specify observed attributes so that attributeChangedCallback will work.
     * @return {String[]} String array of attributes to be observed.
     */
    static get observedAttributes() {
        return [
            'value',
            'main-title',
            'sub-title',
            'scale-start',
            'scale-end',
            'scale-offset',
        ];
    }

    /**
     * @description Create a DialGauge element. Fires when an instance of
     * the element is created or updated.
     */
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    /**
     * @description Get the DialGauge element value.
     * @return {string} The value.
     */
    get value() {
        return this.getAttribute('value');
    }

    /**
     * @description Set the DialGauge element value.
     * @param {string} newValue The new value of the element.
     */
    set value(newValue) {
        this.setAttribute('value', newValue);
    }

    /**
     * @description Get the DialGauge element title.
     * @return {string} The title.
     */
    get mainTitle() {
        return this.getAttribute('main-title');
    }

    /**
     * @description Set the DialGauge element title.
     * @param {string} newValue The new title of the element.
     */
    set mainTitle(newValue) {
        this.setAttribute('main-title', newValue);
    }

    /**
     * @description Get the DialGauge element subtitle.
     * @return {string} The subtitle.
     */
    get subTitle() {
        return this.getAttribute('sub-title');
    }

    /**
     * @description Set the DialGauge element subtitle.
     * @param {string} newValue The new subtitle of the element.
     */
    set subTitle(newValue) {
        this.setAttribute('sub-title', newValue);
    }

    /**
     * @description Get the DialGauge element user scale starting value.
     * @return {float} The starting scale value.
     */
    get scaleStart() {
        return this.getAttribute('scale-start');
    }
    /**
     * @description Set the DialGauge element user scale starting value.
     * @param {float} newValue The new starting scale value.
     */
    set scaleStart(newValue) {
        this.setAttribute('scale-start', newValue);
    }

    /**
     * @description Get the DialGauge element user scale ending value.
     * @return {float} The ending scale value.
     */
    get scaleEnd() {
        return this.getAttribute('scale-end');
    }

    /**
     * @description Set the DialGauge element user scale ending value.
     * @param {float} newValue The new ending scale value.
     */
    set scaleEnd(newValue) {
        this.setAttribute('scale-end', newValue);
    }

    /**
     * @description Get the DialGauge user bottom offset angle.
     * @return {float} The bottom offset angle.
     */
    get scaleOffset() {
        return this.getAttribute('scale-offset');
    }

    /**
     * @description Set the DialGauge user bottom offset angle.
     * @param {float} newValue The new bottom offset angle.
     */
    set scaleOffset(newValue) {
        this.setAttribute('scale-offset', newValue);
    }

    /**
     * @name centerSVG
     * @description Calculate the center of the SVG container.
     * @return {Object}
     */
    centerSVG() {
        const container = this.shadowRoot.querySelector('.dial-gauge');
        return {
            x: container.clientWidth / 2,
            y: container.clientHeight / 2,
        };
    }

    /**
     * @name scaleDegrees
     * @description Scale user value to degrees.
     * @param {float} userValue The user numeric value.
     * @return {float}
     */
    scaleDegrees(userValue) {
        const start = this.scaleStart;
        const end = this.scaleEnd;
        return ((userValue - start) / (end - start)) * (360 - 2 * this.scaleOffset);
    }

    /**
     * @name polarToCartesian
     * @description Convert polar to cartesian coordinates.
     * @param {integer} centerX Arc center x coordinate.
     * @param {integer} centerY Arc center y coordinate.
     * @param {integer} radius Radius of the arc.
     * @param {integer} angleInDegrees Arc angle in degrees.
     * @return {Object}
     */
    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians)),
        };
    }

    /**
     * @name describeArc
     * @description Arc segment generator.
     * @param {integer} x Arc center x coordinate.
     * @param {integer} y Arc center y coordinate.
     * @param {integer} radius Radius of the arc.
     * @param {integer} startAngle Arc start angle in degrees.
     * @param {integer} endAngle Arc end angle in degrees.
     * @return {Object}
     */
    describeArc(x, y, radius, startAngle, endAngle) {
        endAngle = endAngle >= 180 ? 179.99 : endAngle;
        const start = this.polarToCartesian(x, y, radius, endAngle);
        const end = this.polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
        const d = [
            'M', start.x, start.y,
            'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        ].join(' ');
        return d;
    }

    /**
     * @name connectedCallback
     * @description Fires when an instance is inserted into the document.
     * @return {void}
     */
    connectedCallback() {
        // Display the main title if it is set.
        if (this.mainTitle !== '') {
            this.shadowRoot.querySelector('#gauge-title').style.display = 'initial';
        } else {
            this.shadowRoot.querySelector('#gauge-title').style.display = 'none';
        }
        // Display the sub title if it is set.
        if (this.mainTitle !== '') {
            this.shadowRoot.querySelector('#gauge-subtitle').style.display = 'initial';
        } else {
            this.shadowRoot.querySelector('#gauge-subtitle').style.display = 'none';
        }
        // Display the numeric and arc if value is set.
        if (this.value !== null) {
            this.shadowRoot.querySelector('#gauge-numeric').style.display = 'initial';
            this.shadowRoot.querySelector('#gauge-arc').style.display = 'initial';
        } else {
            this.shadowRoot.querySelector('#gauge-numeric').style.display = 'none';
            this.shadowRoot.querySelector('#gauge-arc').style.display = 'none';
        }
        // Render the background arc.
        const center = this.centerSVG();
        const arcRadius = this.shadowRoot.querySelector('.dial-gauge')
            .clientWidth * .30;
        this.shadowRoot.querySelector('#gauge-background-arc')
            .setAttribute(
                'd',
                this.describeArc(
                    center.x,
                    center.y,
                    arcRadius,
                    this.scaleOffset - 180,
                    180 - this.scaleOffset,
                ),
            );
    }

    /**
     * @name attributeChangedCallback
     * @description Fires when an attribute was added, removed, or updated.
     * @param {string} attrName The element attribute name.
     * @param {string} oldVal The old value of the attribute.
     * @param {string} newVal The new value of the attribute.
     * @return {void}
     */
    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
        case 'value':
            if (newVal !== null) {
                // Check if value is within scale limits
                if (newVal >= parseFloat(this.scaleStart) &&
                    newVal <= parseFloat(this.scaleEnd)) { // Within scale limits.
                    // Value is set, display the arc and numeric.
                    this.shadowRoot.querySelector('#gauge-arc').style.display = 'initial';
                    this.shadowRoot.querySelector('#gauge-numeric').style.display = 'initial';
                    // Get the center of component.
                    const center = this.centerSVG();
                    // Calculate the arc radius based on component width.
                    const arcRadius = this.shadowRoot.querySelector('.dial-gauge')
                        .clientWidth * .30;
                    // Scale new user value to degree.
                    const scaledValue = this.scaleDegrees(newVal);
                    // Update the arc display.
                    this.shadowRoot.querySelector('#gauge-arc')
                        .setAttribute(
                            'd',
                            this.describeArc(
                                center.x,
                                center.y,
                                arcRadius,
                                this.scaleOffset - 180,
                                scaledValue - (180 - this.scaleOffset),
                            ),
                        );
                    // Update the numeric display.
                    this.shadowRoot.querySelector('#gauge-numeric').textContent = newVal;
                } else { // Outside scale limits.
                    this.shadowRoot.querySelector('#gauge-arc').style.display = 'none';
                    this.shadowRoot.querySelector('#gauge-numeric').textContent = 'OL';
                }
            } else {
                // Value is not set, hide the arc and numeric.
                this.shadowRoot.querySelector('#gauge-arc').style.display = 'none';
                this.shadowRoot.querySelector('#gauge-numeric').style.display = 'none';
            }
            break;
        case 'main-title':
            if (newVal !== oldVal) {
                // Update element title attribute.
                this.shadowRoot.querySelector('#gauge-title').textContent = newVal;
            }
            break;
        case 'sub-title':
            if (newVal !== oldVal) {
                // Update element subtitle attribute.
                this.shadowRoot.querySelector('#gauge-subtitle').textContent = newVal;
            }
            break;
        case 'scale-start':
            if (newVal !== oldVal) {
                // TODO: check for out of limits.
                // Get the center of component.
                const center = this.centerSVG();
                // Calculate the arc radius based on component width.
                const arcRadius = this.shadowRoot.querySelector('.dial-gauge')
                    .clientWidth * .30;
                // Scale new user value to degree.
                const scaledValue = this.scaleDegrees(this.value);
                // Update the arc display.
                this.shadowRoot.querySelector('#gauge-arc')
                    .setAttribute(
                        'd',
                        this.describeArc(
                            center.x,
                            center.y,
                            arcRadius,
                            this.scaleOffset - 180,
                            scaledValue - (180 - this.scaleOffset),
                        ),
                    );
            }
            break;
        case 'scale-end':
            if (newVal !== oldVal) {
                // TODO: check for out of limits.
                // Get the center of component.
                const center = this.centerSVG();
                // Calculate the arc radius based on component width.
                const arcRadius = this.shadowRoot.querySelector('.dial-gauge')
                    .clientWidth * .30;
                // Scale new user value to degree.
                const scaledValue = this.scaleDegrees(this.value);
                // Update the arc display.
                this.shadowRoot.querySelector('#gauge-arc')
                    .setAttribute(
                        'd',
                        this.describeArc(
                            center.x,
                            center.y,
                            arcRadius,
                            this.scaleOffset - 180,
                            scaledValue - (180 - this.scaleOffset),
                        ),
                    );
            }
            break;
        case 'scale-offset':
            // TODO:
            break;
        }
    }
}

customElements.define('dial-gauge', DialGauge);
