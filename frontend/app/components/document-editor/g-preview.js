import Ember from 'ember';
import bubble from '../../utils/bubble';

export default Ember.Component.extend({
  classNames : ['g-preview'],
  document : null,
  loading: true,
  cacheTag: '',
  router: Ember.inject.service(),

  initCacheTag: function(){
    this.set('cacheTag', Date.now());
  }.on('init'),

  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
        this.setupLoadObserver();
    });
  },

  setupLoadObserver: function(){
  	let componentContext = this;
    var pdfPreview = $(this.element).find('.pdf-preview');
    pdfPreview.bind('DOMSubtreeModified', function(){
      Ember.run.later(componentContext, function() {
  		  this.set('loading', false);
  		}, 1);
      pdfPreview.unbind('DOMSubtreeModified');
    });
  },

  actions : {
    // back : bubble('back'),

    back: function(){
       this.get('router').transitionTo('app.documents.editor', this.get('document').id);
    },

    download(){
      window.open('/pdf_documents/' + this.document.id + '.pdf?' + this.get('cacheTag'));
    },

    redirectToProject: function(is_template){
      if(is_template == true){
        this.get('router').transitionTo('app.templates.documents');
      }else{
       // this.get('router').transitionTo('app.projects.projecttab.document', this.get('document.project'));
         this.get('router').transitionTo('app.projects.projecttab.document', this.get('document').belongsTo('project').id());
      }
    }
  }
});
