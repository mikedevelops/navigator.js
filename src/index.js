import Navigator from './Navigator';

var exampleNav = new Navigator({
    activeClass: 'active',
    activeElement: '.list__item', // default: false
    defaultIndex: 1,
    offset: 0,
    pageLinkSelector: '.page-link',
    throttle: 75,
    updateState: true
});
