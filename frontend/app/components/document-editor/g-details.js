import Ember from "ember";
import $ from "jquery";
import bubble from '../../utils/bubble';
let inject = Ember.inject;

export default Ember.Component.extend({
  store: Ember.inject.service(),
  router: Ember.inject.service('-routing'),
  descriptionCharacterCount: 0,
  session: Ember.inject.service(),
  currentUser: Ember.inject.service('current-user'),
  users: Ember.inject.service(),
  time_zone: '',
  user_id: null,
  isAdmin: Ember.computed('currentUser.user.role.name', function() {
    return this.get('currentUser.user.role.name') === 'admin';
  }),

  didReceiveAttrs() {
    let ttime = this.get('users').getTimeZone();
    this.set('time_zone', ttime);
  },
  
  initNaoInput: function() {

    let session_data = this.get('session.session.content.authenticated');
    this.set('user_id', session_data.user_id);
    
    $("#datepickers").datepicker({
      dateFormat: "dd-mm-yy",
    });

    $("#datepickere").datepicker({
      dateFormat: "dd-mm-yy"
    });

    $("#datepickers").datepicker("option", "minDate", new Date());
    $("#datepickere").datepicker("option", "minDate", new Date());
    let tempDocument = this.get("document");

    if (tempDocument.get("proposed_startdate")) {
      $("#datepickers").datepicker("setDate", new Date(tempDocument.get("proposed_startdate")));
    } else {
      $("#datepickers").datepicker("setDate", new Date());
    }

    if (tempDocument.get("proposed_enddate")) {
      $("#datepickere").datepicker("setDate", new Date(tempDocument.get("proposed_enddate")));
    } else {
      $("#datepickere").datepicker("setDate", new Date());
    }

    if (tempDocument.get("description")) {
      this.set("documentDescription", tempDocument.get("description"));
      this.send('checkCharacter');
    }

  }.on("didInsertElement"),

  isNotFilled: Ember.computed("documentDescription", function() {
    return (!this.get("documentDescription"));
  }),

  isCommentNull: Ember.computed("docComment", function() {
    return (!this.get("docComment"));
  }),

  setDocumentTag: function(tags) {
    let store = this.get("store");
    const docId = this.get("document").get("id");
    store.findRecord("document", docId).then(function(document) {
      document.set("tags", tags),
        document.save();
    });
  },

  actions: {
    submitDetails() {
      var editDocument = this.get("document");
      var docId = editDocument.get("id");
      let store = this.get("store");
      const self = this;
      if (editDocument.get("is_template")) {
        store.findRecord("document", docId).then(function(document) {
          document.set("description", self.get("documentDescription")),
            document.save();
        });
        self.sendAction("showNotification", "Template Description set");
      } else {
        store.findRecord("document", docId).then(function(document) {
          document.set("description", self.get("documentDescription")),
          document.set("proposed_startdate", $("#datepickers").val());
          document.set("proposed_enddate", $("#datepickere").val());
          document.save();
        });
        self.sendAction("showNotification", "Document Details set");
      }
    },

    writeComment(id) {
      NProgress.start();
      let store = this.get("store");
      const self = this;
      let comment = {};
      comment.comment = {};
      comment.comment.comment_text = self.get("docComment");
      $.ajax({
        async: false,
        url: "/v1/comments?document_id=" + id,
        method: "POST",
        data: comment,
        success: function(response) {
          NProgress.done();
          self.sendAction("showNotification", "Comment Shared");
          self.set("docComment", "");
          let documentComments = store.query("comment", { document_id: id });
          self.set("comments", documentComments);
        },
        failure: function(error) {
          NProgress.done();
          self.set("docComment", "");
          let documentComments = store.query("comment", { document_id: id });
          self.set("comments", documentComments);
        }
      });

    },

    deleteComment(comment) {
      NProgress.start();
      let store = this.get("store");
      const self = this;
      store.findRecord("comment", comment.id, { backgroundReload: false }).then(function(deletedComment) {
        deletedComment.destroyRecord();
        self.sendAction("showNotification", "Comment was removed");
        NProgress.done();
      });
    },

    addTag() {
      let editDocument = this.get("document");
      const docId = editDocument.get("id");
      let self = this
      $.ajax({
        url: "/v1/documents/" + docId + "/add_tags",
        method: "PUT",
        data: { document: { tags: self.get("documentTags") } },
        success: function(response) {
          self.setDocumentTag(response.tags)
          self.set("documentTags", "")
        },
        error: function(error) {
          self.sendAction("showNotification", "You do not have permissions to add tags");
        }
      })
    },

    removeTag(tag) {
      let self = this
      const docId = this.get("document").get("id");
      $.ajax({
        url: "/v1/documents/" + docId + "/remove_tags",
        method: "PUT",
        data: { document: { tags: tag.name } },
        success: function(response) {
          self.setDocumentTag(response.tags)
        },
        error: function(error) {
          self.sendAction("showNotification", "You do not have permissions to remove tags");
        }
      })
    },

    onSaveAsTemplate: bubble('onSaveAsTemplate'),
    onDeleteDocument: bubble('onDeleteDocument'),
    onChangeApprover: bubble('onChangeApprover'),
    onIssueForApproval: bubble('onIssueApproval'),
    preview: bubble('preview'),

    configureDocument(document) {
      this.get('router').transitionTo('app.documents.document-coverpage', document.id);
    },

    checkCharacter(){
      let description = this.get('documentDescription');
      if(description){
        let descriptionLength = description.length;
        let characterCount = 240;
        this.set('descriptionCharacterCount', characterCount - descriptionLength);
      }else{
        this.set('descriptionCharacterCount', 240);
      }
    },

    publishTemplate(template){
      NProgress.start();
      const self = this;
      let store = self.get('store');
      store.findRecord("document", template.get('id'), {reload:true}).then(function(document) {
        document.set("is_public", true),
        document.save().then(() => {
          self.sendAction("showNotification", "Document Template published Successfully");
          NProgress.done();
          self.get('router').transitionTo('app.templates.documents');
        });
      });
    },

    unPublishTemplate(template){
      const self = this;
      let store = self.get('store');
      NProgress.start();
      store.query('workflow-template', {document_template_id: template.get('id')}, {reload:true}).then((t) => {
        self.set('workflowsAssociated', t);
        NProgress.done();
        if(self.get('workflowsAssociated.length')){
          self.send("showNotification", "Sorry, There are Workflow Templates associated with this Document Template");
        }else{
          NProgress.start();
          store.findRecord("document", template.get('id'), {reload:true}).then(function(document) {
            document.set("is_public", false),
            document.save().then(() => {
              self.send("showNotification", "Document Template Unpublished!");
              self.send('refreshPage');
              NProgress.done();
            });
          });
        }
      })
    },

  }

});