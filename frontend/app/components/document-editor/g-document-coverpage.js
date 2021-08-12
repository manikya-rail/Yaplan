import Ember from 'ember';
import bubble from '../../utils/bubble';
import { DOCUMENT_NEW, DOCUMENT_NEW_FROM_TEMPLATE } from '../../services/command-registry';
import { DOCUMENT_OPEN } from '../../services/command-registry';
import $ from 'jquery';

let inject = Ember.inject;
export default Ember.Component.extend({
  classNames: ['g-preview'],
  loading: true,
  cacheTag: '',
  router: Ember.inject.service(),
  session: Ember.inject.service(),
  commandRegistry: inject.service(),
  users: Ember.inject.service(),
  time_zone: '',
  isOwner: false,
  store: Ember.inject.service(),
  comments: null,
  onActiveHeaderFooter: false,
  detailsPanelVisible: false,
  userInformation: null,
  isheader: false,
  isPageNumber: false,
  isCoverPage: false,
  isTableContents: true,
  documentSubtitle: '',
  whenNoCoverPage: false,
  whenCoverPage: false,
  showDiv: true,
  imgageData: null,
  subtitleCharacterCount: 0,
  notification: {
    type: 0,
    msg: ''
  },


  initCacheTag: function() {
    this.set('cacheTag', Date.now());
    const self = this;
    if (this.get('document')) {
      let doc = this.get('document');
      let cover_page = doc.get('cover_page');
      const self = this;
      if (cover_page.url) {
        self.set('whenNoCoverPage', false);
        self.set('whenCoverPage', true);
        self.set('showDiv',true);
      } else {
        self.set('whenNoCoverPage', false);
        self.set('whenCoverPage', false);
      }
    }
  }.on('init'),

  initFormFields: function() {

    var store = this.get('store');
    let doc = this.get('document');
    let created_by = doc.get('created_by');
    if (created_by){
      this.set('userInformation', store.find('user', created_by.id));
    }
    let header = doc.get('header');
    if (header) {
      this.set('isheader', true);
    }
    let pageNumber = doc.get('show_page_number');
    if(pageNumber){
      this.set('isPageNumber', true);
    }
    let showTableOfContents = doc.get('show_contents');
    if (showTableOfContents) {
      this.set('isTableContents', true);
    }
    let showCover = doc.get('show_cover');
    if (showCover) {
      this.set('isCoverPage', true);
    }
    if (doc.get('subtitle')) {
      this.set('documentSubtitle', doc.get('subtitle'));
      this.send('checkCharacter');
    } else {
      this.set('documentSubtitle', '');
    }
    let ttime = this.get('users').getTimeZone();
    this.set('time_zone', ttime);
  }.on('didReceiveAttrs'),

  actions: {

    back: function() {
      this.get('router').transitionTo('app.documents');
    },

    download() {
      window.open('/pdf_documents/' + this.document.id + '.pdf?' + this.get('cacheTag'));
    },

    redirectToProject: function(is_template) {
      if (is_template == true) {
        this.get('router').transitionTo('app.templates.documents');
      } else {
        this.get('router').transitionTo('app.projects.projecttab.document', this.get('document').belongsTo('project').id());
      }
    },

    uploadCoverPage() {
      // this.set('showDiv',false);
      $('#coverpageFilePicker').click();
    },

    resizeCoverPage() {

    },

    afterResizing() {
      NProgress.start();
      const componentContext = this;
      let store = componentContext.get("store");
      store.findRecord("document", componentContext.get('document').id, { reload: true }).then(function(document) {
        document.set("cover_page", componentContext.get('imgageData')),
        document.set("show_cover", true),
        document.save();
        document.get('cover_page');
        componentContext.send('showNotification', "Cover Image set for the Document");
        componentContext.set('showDiv',true);
        componentContext.set('isCoverPage', true);
        componentContext.set('whenNoCoverPage', false);
        // componentContext.set('whenCoverPage',true);
        componentContext.sendAction('refreshPage');
        NProgress.done();
      });
    },

    uploadLogo() {
      $('#logoFilePicker').click();
    },

    onLogoFileSelect() {
      let componentContext = this;
      let file_input = document.getElementById('logoFilePicker');
      let file = file_input.files[0];
      if (!file)
        return;
      var reader = new FileReader();
      reader.addEventListener("load", function() {
        NProgress.start();
        var dataURL = reader.result;
        let store = componentContext.get("store");
        $("#logoDocument").css('background-image', 'none');
        $('#logoDocument').css('background-image', 'url(' + dataURL + ')');
        store.findRecord("document", componentContext.get('document').id).then(function(document) {
          document.set("logo", dataURL),
          document.save();
          NProgress.done();
          componentContext.send('showNotification', "Logo set for the Document");
        });
      }, false);
      reader.readAsDataURL(file);
      $("#logoFilePicker")[0].value = '';
    },

    onFileSelect() {
      // this.set('showDiv', true);
      let componentContext = this;
      componentContext.set('showDiv',false);
      componentContext.set('whenNoCoverPage', true);
      let file_input = document.getElementById('coverpageFilePicker');
      let file = file_input.files[0];
      if (!file){
        componentContext.set('showDiv',true);
        return;
      }
      var reader = new FileReader();
      reader.onload = function(event) {
        NProgress.start();
        let temp_height = $("#coverPageBorder").height();
        let temp_width = $("#coverPageBorder").width();
        var MAX_WIDTH = temp_width;
        var MAX_HEIGHT = temp_height;
        $("#dropzone").css('background-image', 'none');
        $('#dropzone').attr('src', event.target.result);
        // $('#dropzone').css('background-image', 'url(' + event.target.result + ')');
        // $('#dropzone').css('background-size', '100%');
        NProgress.done();
        $("#dropzone").cropbox({
          result: { cropX: 100, cropY: 0, cropW: 400, cropH: 200 },
          width: MAX_WIDTH,
          height: MAX_HEIGHT
        }).on('cropbox', function(e, result, img) {
          var url = img.getDataURL();
          componentContext.set('imgageData', url);
        });
      }
      reader.readAsDataURL(file);
      $("#coverpageFilePicker")[0].value = '';
    },

    checkHeaderFooter() {
      let componentContext = this;
      var isChecked = $('#box-3').is(":checked");
      if (isChecked) {
        this.set('onActiveHeaderFooter', true);
      } else {

        let store = componentContext.get("store");
        store.findRecord("document", componentContext.get('document').id).then(function(document) {
          document.set("header", null),
            document.set("footer", null),
            document.save();
        });
      }

      if (isChecked) {
        componentContext.send('showNotification', "Chosen to show the Header and Footer");
      } else {
        componentContext.send('showNotification', "Chosen to not to show the Header and Footer");
      }
    },

    setDocumentSubTitle() {
      let componentContext = this;
      var subtitle = componentContext.get('documentSubtitle');
      let store = componentContext.get("store");
      store.findRecord("document", componentContext.get('document').id).then(function(document) {
        document.set("subtitle", subtitle),
          document.save();
      });
      this.send('checkCharacter');
      // if (subtitle) {
      //   componentContext.send('showNotification', "Document Subtitle Set")
      // }
    },

    checkTableofContents() {
      let isChecked = $('#box-2').is(":checked");
      let componentContext = this;
      let store = componentContext.get("store");
      store.findRecord("document", componentContext.get('document').id).then(function(document) {
        document.set("show_contents", isChecked),
          document.save();
      });
      if (isChecked) {
        componentContext.send('showNotification', "Chosen to show the Table of Content")
      } else {
        componentContext.send('showNotification', "Chosen to not to show the Table of Content")
      }
    },

    checkPageNumber(){
      let componentContext = this;
        let isChecked = $('#box-4').is(":checked");
        let store = componentContext.get("store");
        store.findRecord("document", componentContext.get('document').id).then(function(document) {
          document.set("show_page_number", isChecked),
          document.save();
        });
        if (isChecked) {
          componentContext.send('showNotification', "Chosen to show Page Numbers")
        } else {
          componentContext.send('showNotification', "Chosen to not to show Page Numbers")
        }
    },

    showCoverPage() {
      var isChecked = $('#box-1').is(":checked");
      let componentContext = this;
      let store = componentContext.get("store");
      store.findRecord("document", componentContext.get('document').id).then(function(document) {
        document.set("show_cover", isChecked),
          document.save();
      });
      if (isChecked) {
        componentContext.send('showNotification', "Chosen to show the Cover Page")
      } else {
        componentContext.send('showNotification', "Chosen to not to show the Cover Page")
      }
    },

    showNotification(message) {
      let self = this;
      self.set('notification.type', 3);
      self.set('notification.msg', message);
      setTimeout(function() {
        self.set('notification.type', 0);
      }, 2000);
    },

    checkCharacter(){
      let subtitle = this.get('documentSubtitle');
      if(subtitle){
        let subtitleLength = subtitle.length;
        let characterCount = 240;
        this.set('subtitleCharacterCount', characterCount - subtitleLength);
      }else{
        this.set('subtitleCharacterCount', 240);
      }
    },


  }
});