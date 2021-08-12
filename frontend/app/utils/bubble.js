/**
 * Provides short hand notation for bubbling events
 */

export default function(name, callback) {
  return function() {
    var args = [name];
    args.push.apply(args, arguments);

    this.sendAction.apply(this, args);

    if (typeof callback != 'undefined') {
      callback();
    }
  }
}
