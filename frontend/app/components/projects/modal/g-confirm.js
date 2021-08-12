import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  router: Ember.inject.service('-routing'),
  title: '',
  isDoc: false,
  notification: {
    type: 0,
    msg: ''
  },
  destroyCategory: null,
  deleteDoc: null,

  initFormFields: function() {
    if (this.get('archive_this_Document') == "null") {
      if (this.get('archiveCategory')) {
        this.set('title', 'Category');
        this.set('isDoc', false);
      } else {
        this.set('title', 'Project');
        this.set('isDoc', false);
      }
    } else {
      this.set('title', 'Document');
      this.set('isDoc', true);
    }
  }.on('didReceiveAttrs'),

  actions: {
    onArchiveProject(project) {
      const self = this;
      self.sendAction('onArchiveProject', project);
    },

    onArchiveDocument(doc) {
      var store = this.get('store');
      let self = this;
      if (self.get('onEditMode')) {
        self.sendAction('afterDelete', doc);
      } else {
        self.sendAction('deleteDoc', doc);
      }
    },

    onArchiveCategory(cat) {
      // console.log(cat.id);
      var store = this.get('store');
      this.sendAction('onConfirm',cat);
    }
  },

});