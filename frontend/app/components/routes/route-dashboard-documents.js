import Ember from 'ember';
import bubble from '../../utils/bubble';
import {DOCUMENT_OPEN} from '../../services/command-registry';

export default Ember.Component.extend({
  

  isEditProjectOpened : false,
  isChangeApproverOpened : false,
  isDeleteProjectOpend : false,
  commandRegistry: Ember.inject.service(),

  actions : {
    changeKeyword : bubble('changeKeyword'),
    changeSortBy : bubble('changeSortBy'),
    addDocument : bubble('addDocument'),
    onDeleteProject: bubble('onDeleteProject'),
    

    /**
     * Opens edit project modal dialog
     */
    editProjectName(){
      this.set('isEditProjectOpened', true);
    },
    
    deleteProject(){
      this.set('isDeleteProjectOpened', true); 
    },
    /**
     * Opens change approvers modal dialog
     */
    changeApprover(){
      this.set('isChangeApproverOpened', true);
    },

    /**
     * Handles when user clicks document
     * @param doc
       */
    clickDocument(doc){
      this.get('commandRegistry').execute(DOCUMENT_OPEN, doc);
    }
  }
});
