import DS from 'ember-data';

export default DS.Model.extend({

  comment_text: DS.attr(),
  parent_comment_id: DS.attr(),
  commentable_id: DS.attr(),
  created_at: DS.attr(),
  commenter: DS.attr(),
  role: DS.attr(),

});
