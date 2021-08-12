import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
  classNames: ['g-input-title'],
  showDocs: false,

  actions: {
    /*
     * Resize Title Height
     */
    resizeTitleHeight: function() {
      this.resizeHeight();
    },

    showLinkedDcouments() {
      this.set('showDocs', true);
    }
  },

  initHeight: function() {
    let componentContext = this;
    Ember.run.later(function() {
      componentContext.resizeHeight();
    }, 1);
  }.on('didReceiveAttrs'),

  resizeHeight: function() {
    let el = this.element.getElementsByTagName("textarea")[0];
    setTimeout(function() {
      if (el && el.style) {
        el.style.cssText = 'height:auto; padding:0';
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
      }
    }, 10);
  }

});
