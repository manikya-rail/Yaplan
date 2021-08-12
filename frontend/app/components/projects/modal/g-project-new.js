import Ember from 'ember';

export default Ember.Component.extend({
 isNotFilled: Ember.computed('title', function(){
    return !this.get('title') || (!this.isCreateMode() && this.get('title') == this.project.get('title'));
  }),
  isCreateMode: function(){
    return !this.project;
  },


actions: {

showadcategorymodal: function(){
this.sendAction('createcategory');
},
save: function(){
var titles=this.get('title');
var category_ids=$('input[type=radio][name=check-1]:checked').attr('id');
this.sendAction('createproject', titles,category_ids);
this.sendAction('onProjectCreated');
// this.set('active', false);
// this.sendAction('onInviteMember');

    }





}





});
