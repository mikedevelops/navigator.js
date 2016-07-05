require('classlist-polyfill');
require('element-closest');

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

        if (this.options.defaultIndex) {
            this.toggleActiveClasses(this.options.defaultIndex - 1);
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
                this.toggleActiveClasses(i);
            }
        });
    }

    handleStickyState () {
        this.data.map((link, i) => {
            if (link.pos <= window.scrollY) {
                if (!link.visited) {
                    link.visited = true;
                    this.toggleActiveClasses(i);
                }
            }
            else if (link.visited) {
                const prevIndex = ((i - 1) > 0) ? i - 1 : 0;

                link.visited = false;
                this.toggleActiveClasses(prevIndex);
            }
        });
    }

    toggleActiveClasses (index) {
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

                if (this.options.updateState) {
                    history.replaceState(null, this.pageLinks[i].textContent, '#' + item.id);
                }
            }
        });
    }

    registerEvents () {
        window.addEventListener('scroll', _throttle(this.handleStickyState, this.options.throttle).bind(this));
    }
}
