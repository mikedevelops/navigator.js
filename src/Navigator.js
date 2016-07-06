require('classlist-polyfill');
require('element-closest');

// TODO: debounce scroll to catch violent scrolling

import _throttle from 'lodash.throttle';
import _debounce from 'lodash.debounce';

export default class Navigator {
    constructor (options) {
        this.defaults = {
            activeClass: 'active',
            activeElement: false,
            defaultIndex: 1,
            offset: 0,
            pageLinkSelector: '.page-link',
            throttle: 75,
            updateState: true
        };

        if (typeof options === 'object') {
            // TODO: this may need a polyfill
            this.options = Object.assign(this.defaults, options);
        }
        else {
            this.options = this.defaults;
        }

        this.pageLinks = [].slice.call(document.querySelectorAll(this.options.pageLinkSelector));
        this.data = [];

        this.initiateData();
        this.registerEvents();
        this.handleStickyState();
        this.activeIndex = null;

        if (this.options.defaultIndex) {
            this.toggleActiveClasses(this.options.defaultIndex - 1, { state: false });
        }
    }

    initiateData () {
        this.pageLinks.map((link, i) => {
            const offset = this.options.offset;
            const position = ((link.offsetTop - offset) > 0) ? link.offsetTop - offset : 0;

            this.data.push({
                i: i,
                id: link.id,
                pos: position,
                visited: position < window.scrollY,
                node: document.querySelector(`a[href="#${this.pageLinks[i].id}"]`)
            });

            if (this.data[i].visited) {
                this.activeIndex = i;
                this.toggleActiveClasses(i);
            }
            else {
                this.activeIndex = null;
            }
        });
    }

    handleStickyState () {
        this.data.map((link, i) => {
            if (link.pos <= window.scrollY) {
                if (!link.visited) {
                    link.visited = true;
                    this.toggleActiveClasses(i);
                    this.activeIndex = i;
                }
            }
            else if (link.visited) {
                const prevIndex = ((i - 1) > 0) ? i - 1 : 0;

                link.visited = false;

                if (this.activeIndex === 0) {
                    this.activeIndex = null;

                    if (!this.options.defaultIndex) {
                        this.toggleActiveClasses(this.activeIndex);
                    }

                    if (this.options.updateState) {
                        this.removeState();
                    }
                }
                else if (this.activeIndex) {
                    this.activeIndex = prevIndex;
                    this.toggleActiveClasses(prevIndex);
                }
            }
        });
    }

    toggleActiveClasses (index, options = {state: true}) {
        this.data.map((item, i) => {
            if (i !== index) {
                if (this.options.activeElement) {
                    item.node.closest(this.options.activeElement).classList.remove(this.options.activeClass);
                }
                else {
                    item.node.classList.remove(this.options.activeClass);
                }
            }
            else {
                if (this.options.activeElement) {
                    item.node.closest(this.options.activeElement).classList.add(this.options.activeClass);
                }
                else {
                    item.node.classList.add(this.options.activeClass);
                }

                if (options.state) {
                    this.updateState(i, item.id);
                }
            }
        });
    }

    updateState (index, id) {
        history.replaceState(null, this.pageLinks[index].textContent, '#' + id);
    }

    removeState () {
        history.replaceState(null, '', ' ');
    }

    registerEvents () {
        window.addEventListener('scroll', _throttle(this.handleStickyState, this.options.throttle).bind(this));
    }
}

module.exports = Navigator;
