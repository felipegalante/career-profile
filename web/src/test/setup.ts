// jsdom has no layout, so it omits the scrolling APIs React Aria calls when it moves focus within collections.
Element.prototype.scrollTo ??= function scrollTo() {};
Element.prototype.scrollIntoView ??= function scrollIntoView() {};
