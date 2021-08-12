import Ember from 'ember';
import bubble from '../../utils/bubble';
import $ from 'jquery';

export default Ember.Component.extend({
  classNames: ['g-section', 'content'],
  // section model
  section: null,

  documents: Ember.inject.service(),

  sectionTextCmp: null,

  isMenuActive : false,
  isTableMenuActive : false,

  /**
   * Triggers specific 'reorder' event when re-order is clicked from popup menu
   */
  initReorderEvent: function(){
    let $el = $(this.element);

    $el.on('reorder', (evt) =>{
      let r_section = this.get('documents').moveSection(this.section, $(evt.target).prevAll('.g-section').length + 1);
      // this.get('documents').moveSection(this.section, $(evt.target).prevAll('.g-section').length + 1);
      this.set('section', r_section);
    });

  }.on('didInsertElement'),

  /**
   * Adds image to editor by URL
   * @param url
   */
  addImage(url){
    this.sectionTextCmp.addImage(url);
  },

  closeMenu(){
    this.set('isMenuActive', false);
  },

  closeTableMenu(){
    this.set('isTableMenuActive', false);
  },

  actions: {
    onSaved: bubble('onSaved'),
    onSaving: bubble('onSaving'),

    /**
     * Handles when user clicks delete section option from menu
     * @param section
     */
    deleteSection(section){
      this.get('documents').deleteSection(section);
      this.closeMenu();
    },

    /**
     * Clones section in the document
     * @param section
     */
    cloneSection(section){
      this.get('documents').cloneSection(section);
      this.closeMenu();
    },

    showCreateTableMenu(){
      this.closeMenu();
      this.set('isTableMenuActive', true);
    },

    /**
     * Creates table in this section
     */
    createTable(rows, cols){
      this.sectionTextCmp.execCommandInEditor('table', rows, cols);
      this.closeTableMenu();
    },

    /**
     * Handles when user clicks attach image
     */
    attachImage(){
      this.sendAction('openAttachImageDialog', this);
      this.closeMenu();
    }
  }
});
