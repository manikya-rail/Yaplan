import Ember from 'ember';
import autosave from 'ember-autosave';
import bubble from '../../utils/bubble';
export default Ember.Component.extend({  
  sectionTextProxy: autosave('sectionText', {
    save: function(model) {
      this.sendAction('onSaving');
      model.save().then(() => this.sendAction('onSaved'));
    }
  }),

  /**
   * Adds image to editor
   * @param url
   */
  addImage(url) {
    this.editor.execute('image', url);
    this.editor.updateHeight();
  },
  editorId: Ember.computed('sectionTextProxy', function() {
    return `editor_${this.get('sectionTextProxy.id')}`;
  }),
  options: Ember.computed('sectionTextProxy', function() {
    const self = this;
    return {
      // selector: `textarea#editor_${this.get('sectionTextProxy.id')}`,
      // menubar: "edit view insert tools table format",
      plugins: ["table image lists autoresize advlist imagetools visualblocks media", "emoticons paste textcolor colorpicker textpattern lists"],
      paste_data_images: true,
      statusbar: false,
      automatic_uploads: true,
      theme: "modern",
      menubar: false,
      branding: false,
      // inline: true,
      theme_advanced_buttons3_add: "tablecontrols",
      selection_toolbar: 'undo redo | styleselect numlist bullist | bold italic fontsizeselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor emoticons | link image table',
      insert_toolbar: 'undo redo',
      toolbar1: "undo redo | styleselect | bold italic fontsizeselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor emoticons | link image table",
      table_toolbar: "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
      file_picker_types: 'image',
      fontsize_formats: "4pt 8pt 10pt 12pt 14pt 18pt 24pt 36pt",
      table_default_styles: { width: '100%' },
      setup: function(theEditor) {
        theEditor.on('focus', function () {
          self.$(this.contentAreaContainer.parentElement).find("div.mce-toolbar-grp").show();
        });
        theEditor.on('blur', function () {
          self.$(this.contentAreaContainer.parentElement).find("div.mce-toolbar-grp").hide();
        });
        theEditor.on("init", function () {
          self.$(this.contentAreaContainer.parentElement).find("div.mce-toolbar-grp").hide();
        });
      },
      file_picker_callback: function(cb, value, meta) {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/jpeg, image/png');
        input.onchange = function() {
          var file = this.files[0];

          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function() {
            var id = 'blobid' + (new Date()).getTime();
            var blobCache = tinymce.activeEditor.editorUpload.blobCache;
            var base64 = reader.result.split(',')[1];
            var blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);
            cb(blobInfo.blobUri(), { title: file.name });
          };
        };

        input.click();
      },
    };
  }),
  //   const self = this;
  //   tinymce.init({
  //     // menubar: "edit view insert tools table format",
  //     plugins: ["table image autoresize contextmenu imagetools visualblocks media", "emoticons paste textcolor colorpicker textpattern"],
  //     paste_data_images: true,
  //     statusbar: false,
  //     automatic_uploads: true,
  //     // theme: "inlite",
  //     menubar: false,
  //     // inline: true,
  //     theme_advanced_buttons3_add: "tablecontrols",
  //     selection_toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor emoticons | link image table',
  //     insert_toolbar: 'undo redo',
  //     toolbar1: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor emoticons | link image table",
  //     table_toolbar: "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
  //     file_picker_types: 'image',
  //     setup: function(theEditor) {
  //       theEditor.on('focus', function () {
  //         self.$(this.contentAreaContainer.parentElement).find("div.mce-toolbar-grp").show();
  //       });
  //       theEditor.on('blur', function () {
  //         self.$(this.contentAreaContainer.parentElement).find("div.mce-toolbar-grp").hide();
  //       });
  //       theEditor.on("init", function () {
  //         self.$(this.contentAreaContainer.parentElement).find("div.mce-toolbar-grp").hide();
  //       });
  //     },
  //     file_picker_callback: function(cb, value, meta) {
  //       var input = document.createElement('input');
  //       input.setAttribute('type', 'file');
  //       input.setAttribute('accept', 'image/*');
  //       input.onchange = function() {
  //         var file = this.files[0];

  //         var reader = new FileReader();
  //         reader.readAsDataURL(file);
  //         reader.onload = function() {
  //           var id = 'blobid' + (new Date()).getTime();
  //           var blobCache = tinymce.activeEditor.editorUpload.blobCache;
  //           var base64 = reader.result.split(',')[1];
  //           var blobInfo = blobCache.create(id, file, base64);
  //           blobCache.add(blobInfo);
  //           cb(blobInfo.blobUri(), { title: file.name });
  //         };
  //       };

  //       input.click();
  //     },
  //   })
  // },
  /**
   * Registers component in target
   */
  _registerWithParent: function() {
    this.attrs.registerAs.update(this);
  }.on('init'),
  /**
   * Executes given command in HTML Editor
   * @param command
   */
  execCommandInEditor(...args) {
    this.editor.execute.apply(this.editor, args);
  },
  actions: {
    onSaved: bubble('onSaved'),
    onSaving: bubble('onSaving'),

    uploadImage() {
      // console.log('Uploading', arguments);
    },

    createTableSample() {
      let id = $("#" + this.get('sectionTextProxy.id'));
      tinymce.activeEditor.execCommand('mceInsertTable', true, id);
    }


  }
});
