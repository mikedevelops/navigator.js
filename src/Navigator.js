require('classlist-polyfill');
require('element-closest');

// TODO: debounce scroll to catch violent scrolling
// TODO: window.history

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
            debounce: 100,
            throttle: 75,
            useHistory: true,
            debug: false
        };

        if (typeof options === 'object') {
            this.options = Object.assign(this.defaults, options);
        }
        else {
            this.options = this.defaults;
        }

        this.pageLinks = [].slice.call(document.querySelectorAll(this.options.pageLinkSelector));
        this.data = [];
        this.state = [];
        this.activeState = {
            active: -1,
            previous: () => {
                return this.activeState.active - 1;
            }
        };

        this.initiateData();
        this.registerEvents();
        this.toggleActiveClasses();
    }

    getPosition (element) {
        const { offset } = this.options;
        return ((element.offsetTop - offset) > 0) ? element.offsetTop - offset : 0;
    }

    initiateData () {
        this.pageLinks.map((link, i) => {
            const position = this.getPosition(link);

            this.data.push({
                index: i,
                id: link.id,
                node: document.querySelector(`a[href="#${this.pageLinks[i].id}"]`)
            });

            this.state.push({
                index: i,
                position: position,
                visited:  position < window.scrollY
            });

            if (this.data[i].visited) {
                this.activeState.active = i;
            }

            // this forced default index
            if (this.activeState.active < 0) {
                this.activeState.active = 0;
            }
        });

        if (this.options.debug) {
            console.log('active item: ', this.activeState.active);
            console.log(JSON.stringify(this.state));
        }
    }

    updateState () {
        const cachedState = this.activeState.active;

        this.state.map((item, i) => {
            const position  = this.getPosition(this.pageLinks[i]);

            item.posistion = position;
            item.visited = position < window.scrollY;

            if (item.visited && item.index !== this.activeState.active) {
                this.activeState.active = item.index;
            }
        });

        if (cachedState !== this.activeState.active) {
            this.toggleActiveClasses();

            if (this.options.debug) {
                console.log('active item: ', this.activeState.active);
                console.log(JSON.stringify(this.state));
            }
        }
    }

    toggleActiveClasses (options = {state: true}) {
        this.state.map((item, i) => {
            if (i !== this.activeState.active) {
                if (this.options.activeElement) {
                    this.data[i].node.closest(this.options.activeElement).classList.remove(this.options.activeClass);
                }
                else {
                    this.data[i].node.classList.remove(this.options.activeClass);
                }
            }
            else {
                if (this.options.activeElement) {
                    this.data[i].node.closest(this.options.activeElement).classList.add(this.options.activeClass);
                }
                else {
                    this.data[i].node.classList.add(this.options.activeClass);
                }
            }
        });
    }

    registerEvents () {
        window.addEventListener('scroll', _throttle(this.updateState, this.options.throttle).bind(this));
        window.addEventListener('resize', _debounce(this.updateState, this.options.debounce).bind(this));
    }
}

module.exports = Navigator;
