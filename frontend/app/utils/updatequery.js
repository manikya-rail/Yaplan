/**
 * Provides short hand for transitioning to route with updated query param.
 * Function must take new qp value as first argument
 */

export default function(name, trans){
  return function(value){
    this.transitionTo({queryParams : { [name] : trans ? trans(value) : value}});
  }
}
