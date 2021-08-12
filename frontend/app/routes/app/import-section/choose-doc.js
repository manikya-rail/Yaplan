import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    project_id: {
      refreshModel: true,
      replace: true
    },

    sort_by: {
      refreshModel: true,
      replace: true
    },

    keyword: {
      refreshModel: true,
      replace: true
    }
  },

  /**
   * Returns model related to this route
   */
  model(params){
    return Ember.RSVP.hash({
      projects: this.store.findAll('project'),
      documents: this.store.query('document', {project_id: params.project_id, keyword: params.keyword}, {reload: true}).then(documents => documents.sortBy('updatedAt').reverse()),
      sortBy: [{id: 'title', title: 'Title'}, {id: 'date', title: 'Date'}],
      document: this.store.find('document', params.id),
      document_templates: this.store.query('document_template', {project_id: params.project_id, keyword: params.keyword}, {reload: true}).then(document_templates => document_templates.sortBy('updatedAt').reverse()),
      type : params.type,
      });
  },

  afterModel(model){
    if(!model){
      this.refresh();
    }
  },

  actions: {
    /**
     * Handles when user changes project
     */
    changeProject(project){
      this.transitionTo({queryParams: {project_id: project ? project.id : undefined}});
    },

    /**
     * Handles when user changes sort type
     * @param sortBy
     */
    changeSortBy(sortBy){
      const self = this;
      if(sortBy.id){
        if(sortBy.id == 'title'){
          self.set('currentModel.documents', self.currentModel.documents.sortBy('title'));
          self.set('currentModel.document_templates', self.currentModel.document_templates.sortBy('title'));
        }else if(sortBy.id == 'date'){
          self.set('currentModel.documents', self.currentModel.documents.sortBy('updatedAt').reverse());
          self.set('currentModel.document_templates', self.currentModel.document_templates.sortBy('updatedAt').reverse());
        }
      }else{
        self.set('currentModel.documents', self.currentModel.documents.sortBy('updatedAt').reverse());
        self.set('currentModel.document_templates', self.currentModel.document_templates.sortBy('updatedAt').reverse());
      }
    },

    /**
     * Handles when user changes keyword
     * @param keyword
     */
    changeKeyword(keyword){
      this.transitionTo({queryParams: {keyword: keyword}});
    },

    /**
     * Handles document glick event from g-documents component
     * @param doc
     */
    clickDocument(doc){
      this.transitionTo('app.import-section.choose-section', this.currentModel.document.id, this.currentModel.type, {queryParams: {sourceDoc: doc.id}});
    }
  }
});
