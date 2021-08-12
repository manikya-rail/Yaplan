import Ember from 'ember';

export default Ember.Component.extend({
  categoryImagePath : null,
  store: Ember.inject.service(),
  count: 0,

  notification: {
		type: 0,
		msg: ''
	},

  initNaoInput: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      const self = this;
      if(self.get('categoryEdit')){
        let category = self.get('categoryEdit');
        let image = category.get('image');
        self.set('categoryName',category.get('name'));
        self.$('#categoryImage').css('background-image', 'url(' + image.url + ')');
        self.set('categoryImagePath',image.url);
      }else{
        self.set('categoryName', '');
        self.$('#categoryImage').css('background-image', 'url(assets/images/upload_default_image.png)');
        self.set('categoryImagePath',null);
      }
    });
  }.on('didReceiveAttrs'),

  isNotFilled: Ember.computed('categoryName','categoryImagePath', function() {
    return (!this.get('categoryName') || !this.get('categoryImagePath'));
  }),

  actions: {

    CreateCategory(){
      const self = this;
      let store = this.get('store');
      if(this.get('categoryEdit')){
        if(self.get('count') == 1){
          NProgress.start();
          let category = self.get('categoryEdit');
          store.findRecord('category',category.get('id')).then(function(editedCategory){
            editedCategory.set('name',self.get('categoryName'));
            editedCategory.set('image',self.get('categoryImagePath'));
            editedCategory.save();
          });
          NProgress.done();
        }else{
          NProgress.start();
          let category = self.get('categoryEdit');
          store.findRecord('category',category.get('id')).then(function(editedCategory){
            editedCategory.set('name',self.get('categoryName'));
            editedCategory.save();
          });
          NProgress.done();
        }
        self.set('notification.type', 3);
        self.set('notification.msg', `Category updated Successfully.`);
        setTimeout(function(){
          self.set('count',0);
          self.set('notification.type', 0);
          self.set('active',false);
          self.sendAction('callRefresh');
        }, 2000);
      }else{
        NProgress.start();
        let newCategory = store.createRecord('category');
        newCategory.setProperties({
          name: self.get('categoryName'),
          image: self.get('categoryImagePath'),
          is_published: true
        });
        newCategory.save().then(function(saveddata) {
          self.set('notification.type', 3);
          self.set('notification.msg', `New Category created Successfully.`);
          NProgress.done();
          setTimeout(function(){
            self.set('count',0);
            self.set('notification.type', 0);
            self.set('active',false);
            self.sendAction('callRefresh');
          }, 2000);

        }).catch((adapterError) => {
          self.set('notification.type', 3);
          self.set('notification.msg', "Oops, There was a technical glitch while creating category");
          NProgress.done();
          setTimeout(function(){
            self.set('notification.type', 0);
            self.set('active',false);
          }, 2000);

        });
      }
    },

    uploadCategoryImage() {
      $('#categoryImageFilePicker').click();
    },

    onFileSelect() {
      const componentContext = this;
      let file_input = document.getElementById('categoryImageFilePicker');
      let file = file_input.files[0];
      if (!file)
        return;
      var reader = new FileReader();
      reader.addEventListener("load", function() {
        var dataURL = reader.result;
        componentContext.set('count', 1);
        componentContext.set('categoryImagePath',reader.result);
        $('#categoryImage').css('background-image', 'url(' + reader.result + ')');
      }, false);
        reader.readAsDataURL(file);
        $("#categoryImageFilePicker")[0].value = '';
    },
  }

});
