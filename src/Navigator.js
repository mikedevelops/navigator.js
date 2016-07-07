require('classlist-polyfill');
require('element-closest');

import _throttle from 'lodash.throttle';
import _debounce from 'lodash.debounce';
import _defaultsDeep from 'lodash.defaultsdeep';

export default class Navigator {
    constructor (options) {
        Navigator.VERSION = 'v1.0.5';

        const defaults = {
            activeClass: 'active',
            activeElement: false,
            defaultIndex: 1,
            offset: 0,
            pageLinkSelector: '.page-link',
            debounce: 100,
            throttle: 75,
            useHistory: true,
            debug: false,
            callbacks: {
                onActiveItem: null
            }
        };

        this.options = _defaultsDeep(options, defaults);
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
        this.pageLinks.map((link, index) => {
            const position = this.getPosition(link);

            this.data.push({
                index: index,
                id: link.id,
                node: document.querySelector(`a[href="#${this.pageLinks[index].id}"]`)
            });

            this.state.push({
                index: index,
                position: position,
                visited:  position < window.scrollY
            });

            if (this.data[index].visited) {
                this.activeState.active = index;
            }
        });

        if (this.options.debug) {
            console.log('window: ', window.scrollY);
            console.log('active item: ', this.activeState.active);
            console.log(JSON.stringify(this.state));
        }
    }

    updateState () {
        const cachedState = this.activeState.active;

        this.state.map((item, index) => {
            const position  = this.getPosition(this.pageLinks[index]);

            item.posistion = position;
            item.visited = position < window.scrollY;

            if (item.visited && item.index !== this.activeState.active) {
                this.activeState.active = item.index;
            }
        });

        // if we have come back up and are behind the first item
        if (!this.state[0].visited && this.activeState.active >= 0) {
            this.activeState.active--;

            if (this.options.useHistory) {
                this.resetHistory();
            }

            this.toggleActiveClasses();
        }
        else if (cachedState !== this.activeState.active) {
            if (this.options.useHistory) {
                this.updateHistory();
            }

            this.toggleActiveClasses();

            if (this.options.callbacks.onActiveItem) {
                this.options.callbacks.onActiveItem(this.data[this.activeState.active].node);
            }

            if (this.options.debug) {
                console.log('window: ', window.scrollY);
                console.log('active item: ', this.activeState.active);
                console.log(JSON.stringify(this.state));
            }
        }
    }

    toggleActiveClasses () {
        if (this.options.debug) {
            console.log('updating DOM...');
        }

        if (this.options.defaultIndex - 1 > this.activeState.active) {
            this.addClass(this.data[this.options.defaultIndex - 1].node);
        }
        else {
            this.state.map((item, index) => {
                if (index !== this.activeState.active) {
                    this.removeClass(this.data[index].node);
                }
                else {
                    this.addClass(this.data[index].node);
                }
            });
        }
    }

    updateHistory () {
        window.history.replaceState(null, '', `#${this.data[this.activeState.active].id}`);
    }

    resetHistory () {
        window.history.replaceState(null, '', ' ');
    }

    addClass (node) {
        if (this.options.activeElement) {
            node.closest(this.options.activeElement).classList.add(this.options.activeClass);
        }
        else {
            node.classList.add(this.options.activeClass);
        }
    }

    removeClass (node) {
        if (this.options.activeElement) {
            node.closest(this.options.activeElement).classList.remove(this.options.activeClass);
        }
        else {
            node.classList.remove(this.options.activeClass);
        }
    }

    registerEvents () {
        window.addEventListener('scroll', _throttle(this.updateState, this.options.throttle).bind(this));
        window.addEventListener('resize', _debounce(this.updateState, this.options.debounce).bind(this));
        window.addEventListener('orientationchange', _debounce(this.updateState, this.options.debounce).bind(this));
    }
}

module.exports = Navigator;
