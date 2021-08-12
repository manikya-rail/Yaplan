import Ember from 'ember';

const get = Ember.get;
const set = Ember.set;
export default Ember.Component.extend({
  classNames: ['g-document-image-uploader'],
  // document model editor works with
  document: null,
  documents: Ember.inject.service(),
  url: "v1/image",
  notification: {
    type: 0,
    msg: ""
  },
  inProgress: false,

  insertedElement: function() { 
    Ember.run.scheduleOnce('afterRender', this, 'setupUploader');
  }.on('didInsertElement'),

  setupUploader: function(){

    let componentContext = this;
    var uploader = new plupload.Uploader({
        drop_element : 'dropzone',
        browse_button : 'g_document_image_uploader_browse',
        container: 'plupload',
        upload : 'upload.rb', //Dummy
        multi_selection: false,
        filters: {
          max_file_size : '10mb',
          mime_types : [{title : "Image files", extensions : "jpg,jpeg,gif,png"}]
        }
    });

    uploader.init();

    uploader.bind('Init', function(up, params) {
        function $(id) {
          return document.getElementById(id);
        }
        
        if (uploader.features.dragdrop) {
          $('debug').innerHTML = "";
          
          var target = $('dropzone');
          
          target.ondragover = function(event) {
            event.dataTransfer.dropEffect = "copy";
          };
          
          target.ondragenter = function() {
            this.className = "dropzone dragover";
          };
          
          target.ondragleave = function() {
            this.className = "dropzone";
          };
          
          target.ondrop = function(event) {
            this.className = "dropzone";
            event.preventDefault();
          };
        }
    });

    uploader.bind('FilesAdded', function(up, files) {
      componentContext.uploadImage(up, files[0].getNative());
    });

    uploader.bind('Error', function(up, err) {
      componentContext.uploadError(up, err.message);
    });

  },

  /*
  ** Helper function : reads a file into different formats.
  */
  read : function(file, options = { as: 'data-url' }) {
      
      let reader = new FileReader();
      /*jshint +W055 */
      let { promise, resolve, reject } = Ember.RSVP.defer();
      reader.onloadend = resolve;
      reader.onerror = reject;

      switch (options.as) {
      case 'array-buffer':
        reader.readAsArrayBuffer(file);
        break;
      case 'data-url':
        reader.readAsDataURL(file);
        break;
      case 'binary-string':
        reader.readAsBinaryString(file);
        break;
      case 'text':
        reader.readAsText(file);
        break;
      }

      return promise.then(function () {
        return reader.result;
      }, function () {
        return Ember.RSVP.reject(reader.error);
      });
    },

  /**
   * Uploads new image to the section
   * @param file
   */
  uploadImage: function(up, file){
      this.set('inProgress', true);
      
      this.read(file).then(url =>{
        this.get('documents').createImage(this.document, url).then((res) =>{
          this.sendAction('upload', res.get('image').url, res);
          this.set('active', false);
          this.set('inProgress', false);
          this.refreshUploader(up);
        }, (err) => {
          this.uploadError(up, "File upload failed. Please try again.");
        });
      }, (err) => {
          this.uploadError(up, "File upload failed. Please try again.");
      });
  },
  
  /**
   * Handles upload error
   * @param error_msg
   */
  uploadError: function(up, msg){
      const self = this;
      this.set('notification', {
        type: 2,
        msg: msg
      });
      this.set('inProgress', false);
      this.refreshUploader(up);
      setTimeout(function(){
        self.set('notification.type', 0);
      }, 2000);
  },

  /**
   * Refreshes the uploader for another upload
   */
  refreshUploader: function(up){
    let componentContext = this;

    up.destroy();
    Ember.run.later(function(){
      componentContext.setupUploader();
    }, 10);
  }

});
