import Ember from 'ember';

export default Ember.Component.extend({
  nodes: null,

  initValue: function(){
    for(var i in this.nodes) {
      var node = this.nodes[i];
      if(node.title == undefined && node.object != null) {
        node.title = node.object.content.get('title');
      }
    }
  }.on('didReceiveAttrs')
});
