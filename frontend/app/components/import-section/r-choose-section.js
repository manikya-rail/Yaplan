import Ember from 'ember';

export default Ember.Component.extend({
  isEmptySelection: Ember.computed('sectionsProxy.@each.selected', function () {
    return !this.get('sectionsProxy').isAny('selected', true);
  }),

  documents: Ember.inject.service(),

  router: Ember.inject.service(),

  type: null,

  initSectionsProxy: function () {
    if (this.get('sourceDocument.section_containers')) {
      this.set('sectionsProxy', this.get('sourceDocument.section_containers').map(section => {
        return {
          selected: false,
          data: section
        }
      }));
    }
  }.on('didReceiveAttrs'),

  /** 
   * Returns if we are importing section as 'link'
   * @returns {boolean}
   */
  isLink(){
    return this.type == 'Link';
  },

  actions: {
    /**
     * Handles when user clicks done button
     */
    clickDone(){
      const self = this;
      let sections = this.get('sectionsProxy').filterBy('selected', true).map(o => o.data);
      this.get('documents').importSections(this.get('targetDocument'), sections, this.isLink()).then(() => {
        // this.sendAction('afterImport');
        // this.transitionTo('app.documents.editor', this.get('docid'));
        this.get('router').transitionTo('app.documents.editor', this.get('docid'));
      });
    },

  }
});
