(function($){ // self-executing wrapper

  // create a model, javascript object, key-value pairs
  var Item = Backbone.Model.extend({
    defaults: {
      part1: 'hello',
      part2: 'world'
    }
  });

  // create a collection of items, an array of model objects
  var List = Backbone.Collection.extend({
    model: Item
  });

  var ListView = Backbone.View.extend({
    el: $('body'), // attaches 'this.el' to an existing element

    // where DOM events are bound to view methods. backbone doesnt have separate controller to handle bindings. happens in view
    events: {
      'click button#add': 'addItem'
    },

    // automatically called upon instantiation. where you make all types of bindings, excluding UI events, such as clicks
    initialize: function(){
      _.bindAll(this, 'render', 'addItem', 'appendItem'); // fixes loss of context for 'this' within methods

      // instantiate a Collection, and binds add event to its own method. backbone doesnt offer separate controller for bindings
      this.collection = new List();
      this.collection.bind('add', this.appendItem); // collection event binder

      this.counter = 0; // total number of items added thus far
      this.render(); // not all views are self-rendering. This one is. 
    },

    // function in charge of render entire view in this.el. needs to be manually called by user
    render: function(){

      var self = this;
      $(this.el).append("<button id='add'>Add list item</button>"); // introduces a button to add a new list item
      $(this.el).append("<ul></ul>");
      // reference this so it can be accessed within scope of the callback
      _(this.collection.models).each(function(item){
        self.appendItem(item);
      }, this);
    },

    // custon function called via click event above
    // now deals solely with model/collections. View updates are move to the event listern appendItem.
    addItem: function(){
      this.counter++;
      var item = new Item();
      item.set({
        part2: item.get('part2') + this.counter
      });
      this.collection.add(item); // add item to collection
    },

    // appendItem is triggered by collection event add and handles the visual update
    appendItem: function(item){
      $('ul', this.el).append("<li>"+item.get('part1')+ " "+item.get('part2')+"</li>");
    }
  });

  // Instantiate main app view
  var listView = new ListView();
  console.log(listView);

})(jQuery);
