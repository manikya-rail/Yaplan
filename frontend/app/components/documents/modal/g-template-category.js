import Ember from 'ember';
import {DOCUMENT_NEW_FROM_TEMPLATE} from '../../../services/command-registry';
import {DOCUMENT_NEW, TEMPLATE_NEW} from '../../../services/command-registry';
import {DOCUMENT_OPEN} from '../../../services/command-registry';

export default Ember.Component.extend({
categoryID : null,
commandRegistry: Ember.inject.service(),
router: Ember.inject.service(),

actions :{
  CreateNewTemplate(){
    let categoryId = parseInt(document.getElementById('template-category').value);
    this.set('categoryID',categoryId);
    this.set('active',false);
    var store = this.get('store');
    this.get('commandRegistry').execute(TEMPLATE_NEW, this.get('categoryID'));
  },
}

});
