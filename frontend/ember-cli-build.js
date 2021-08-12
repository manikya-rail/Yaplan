/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {});
  // var app = new EmberApp(defaults, {
  //   gzip: {
  //     enabled: EmberApp.env() === 'production'
  //   },
  //   minifyJS: {
  //     enabled: EmberApp.env() === 'production',
  //     options: {
  //       exclude: ["**/pdf.js", "**/pdf.worker.js"]
  //     }
  //   },
  //   'ember-cli-qunit': {
  //     useLintTree: false
  //   },
  //   minifyCSS: {
  //     enabled: EmberApp.env() === 'production',
  //   },
  //   tests: false,
  // });

  app.import('bower_components/jquery-ui/jquery-ui.min.js');
  app.import('bower_components/js-cookie/src/js.cookie.js');
  app.import('bower_components/jquery-ui/themes/base/jquery-ui.min.css');
  app.import('bower_components/cropbox/jquery.cropbox.js');
  app.import('bower_components/cropbox/jquery.cropbox.css');
  app.import('bower_components/cytoscape/dist/cytoscape.min.js');
  app.import('bower_components/jquery.steps/build/jquery.steps.min.js');
  app.import('vendor/js/plupload/plupload.full.min.js');
  app.import('vendor/js/ocanvas.min.js');
  app.import('vendor/js/classie.js');
  app.import('vendor/js/nprogress.js');
  app.import('vendor/css/nprogress.css');
  app.import('vendor/js/scroll.min.js');
  app.import('vendor/js/malihu-scroll/jquery.mCustomScrollbar.min.js');
  app.import('vendor/js/input-nao/input-nao.js');
  app.import('vendor/js/masonry.pkgd.min.js');
  // app.import('vendor/js/segment.js');
  // app.import('vendor/js/segment-ops.js');
  app.import('vendor/js/fb-register.js');
  app.import('vendor/js/cytoscape-context-menus/cytoscape-context-menus.js');
  app.import('vendor/js/cytoscape-context-menus/cytoscape-context-menus.css');
  app.import('vendor/js/cytoscape-edge-bend-editing/cytoscape-edge-bend-editing.js');
  app.import('vendor/js/cytoscape-edgehandles/cytoscape-edgehandles.js');
  app.import('vendor/js/cytoscape-snap-to-grid.js');
  app.import('vendor/js/cytoscape-node-resize.js');
  app.import('vendor/js/imagesloaded.pkgd.min.js');
  app.import('vendor/js/jquery.qtip.min.js');
  app.import('vendor/js/cytoscape-qtip.js');
  app.import('vendor/js/landing/landing-setup.js');

  app.import('vendor/css/landing.css');
  app.import('vendor/css/jquery.qtip.min.css');
  app.import('vendor/css/jquery.mCustomScrollbar.min.css');

  app.import('vendor/js/zoom-master/jquery.zoom.js');
  app.import('vendor/js/zoom-master/jquery.zoom.min.js');

  app.import('vendor/js/wheelzoom-master/wheelzoom.js');

  //app.import('vendor/js/sentry-ops.js');
  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  //var fontawesome = new funnel('bower_components/font-awesome/fonts', {
  //  destDir: 'assets/fonts'
  //});
  //
  //

  var htmlEditorAssets = new Funnel('public/styles', {
    destDir : '/assets'
  });

  var merged = mergeTrees([app.toTree(), htmlEditorAssets], {
    overwrite: true
  });

  return merged;
};
