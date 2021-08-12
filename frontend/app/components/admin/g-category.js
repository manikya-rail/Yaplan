import Ember from 'ember';

export default Ember.Component.extend({

  router: Ember.inject.service('-routing'),
  onNewCategory: false,
  showMessage: false,
  categoryEdit: null,
  categoryDelete: null,
  store: Ember.inject.service(),
  number: 0,
  totalCategories: 0,
  totalPages: 0,
  createDoc: false,
  pages: null,
  page: 1,
  toast: {
    type: 0,
    msg: ''
  },
  sortProps: 'updatedAt',
  allcategories: Ember.computed.sort('categoryList', function(category1, category2) {
    let result = 0;
    let item1, item2;
    switch (this.get('sortProps')) {
      case 'updatedAt':
        item1 = category2.get('updatedAt');
        item2 = category1.get('updatedAt');
        break;
      case 'title':
        item1 = category1.get('name').trim().toLowerCase();
        item2 = category2.get('name').trim().toLowerCase();
        break;
    }
    if (item1 < item2) {
      result = -1;
    } else if (item1 > item2) {
      result = 1;
    } else {
      result = 0;
    }
    return result;
  }),

  didReceiveAttrs: function() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
      const self = this;
      if(this.get('page') == 1) {
        let meta = self.categoryList.get('meta');
        self.set('totalCategories', meta.total_records);
        let totalRecords = meta.total_records;
        let no_of_pages =  Math.ceil(totalRecords/15);
        self.set('totalPages', no_of_pages);
        let pageArray = [];
        let count = 1;
        for(let i=1; i<=no_of_pages; i++){
          count++;
          if(count > 6) {
            break;
          } else {
            pageArray.push(i);
          }
        }
        self.set('pages', pageArray);
      }
    });
  },

  actions: {

    createNewCategory() {
      this.set('categoryEdit', null);
      this.toggleProperty('onNewCategory');
    },

    editCategory(category) {
      this.set('categoryEdit', category);
      this.toggleProperty('onNewCategory');
    },

    archiveCategory(category) {
      this.set('categoryDelete', category);
      this.toggleProperty('onArchiveCategory');
    },

    goToArchivedCategory() {
      this.get('router').transitionTo('app.admin.archived-category');
    },

    callCategory() {
      this.sendAction('refreshPage');
    },

    setSortProps(prop) {
      this.set('sortProps', prop);
      this.notifyPropertyChange('allcategories');
    },

    onConfirm(cat) {
      NProgress.start();
      const self = this;
      $.ajax({
        type: "DELETE",
        url: "v1/categories/" + cat.get('id'),
        success: function() {
          NProgress.done();
          self.set('onArchiveCategory', false);
          self.set('toast.type', 3);
          self.set('toast.msg', "Category Archived");
          setTimeout(function() {
            self.set('toast.type', 0);
            self.send('callCategory');
          }, 2000);
        },
        failure: function() {
          NProgress.done();
          self.set('onArchiveCategory', false);
          self.set('toast.type', 3);
          self.set('toast.msg', "Sorry, There are projects/workflows/documents under this Category");
          setTimeout(function() {
            self.set('toast.type', 0);
          }, 2000);
        },
        error: function (jqXHR, status, err) {
          NProgress.done();
          self.set('onArchiveCategory', false);
          self.set('toast.type', 3);
          self.set('toast.msg', "Sorry, There are projects/workflows/documents under this Category");
          setTimeout(function() {
            self.set('toast.type', 0);
          }, 2000);
        },
      });
    },

    searchDocuments(evt) {
      const self = this;
      self.set('showMessage', true);
      self.set('page', 1);
      self.get('store').query('category', {
        q: evt.target.value, page: 1
      }).then(categories => {
        self.set('showMessage', false);
        self.set('categories', categories);
        self.notifyPropertyChange('allcategories');
      });
    },

    nextPage() {
      let page = this.get('page');
      this.set('page', page + 1);

      const self = this;
      let page_count = this.get('totalPages');
      if(page_count > 5) {
        let page_array = self.get('pages');
        let start = page_array[0] + 1;
        let count = 1;
        let pageArray = [];
        for(let i=start; i<=page_count; i++){
          count++;
          if(count > 6) {
            break;
          } else {
            pageArray.push(i);
          }
        }
        self.set('pages', pageArray);
      }

      this.send('callNext', this.get('page'));
    },

    prevPage() {
      this.set('page', this.get('page') - 1);

      const self = this;
      let page_count = this.get('totalPages');
      let page_array = self.get('pages');
      let count = 1;
      if(page_array[0] != 1) {
        let pageArray = [];
        let start = page_array[0] - 1;
        for(let i=start; i<=page_count; i++){
          count++;
          if(count > 6) {
            break;
          } else {
            pageArray.push(i);
          }
        }
        self.set('pages', pageArray);
      }

      this.send('callNext', this.get('page'));
    },

    callNext(pageNumber) {
      let store = this.get('store');
      let self = this;
      let query = $('#searchinput').val();
      NProgress.start();
      store.query('category', { reload: true, page: pageNumber, q: query }).then(function(res) {
        self.set('page', pageNumber);
        self.set('categoryList', res);
        NProgress.done();
      })
    },

  }

});