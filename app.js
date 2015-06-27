(function($){ // self-executing wrapper

  // overrides persistence storage temporary to enable Model.destroy()
  Backbone.sync = function(method, model, success, error){
   success();
  }

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

  // ItemView class, responsible for rendering each individual Item.
  var ItemView = Backbone.View.extend({
    tagName: 'li', // name of root tag in this.el

    events: {
      'click span.swap': 'swap', // add two clickable actions for each item
      'click span.delete': 'remove'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'unrender', 'swap', 'remove'); // every function that uses 'this' as the current object should be in inheritedData()

      this.model.bind('change', this.render); // binds render and unrender here
      this.model.bind('remove', this.unrender);
    },

    render: function(){ // add two actions, swap and delete
      // $(this.el).html('<span>'+this.model.get('part1')+' '+this.model.get('part2')+'</span>');
      $(this.el).html('<span style="color:black;">'+this.model.get('part1')+' '+this.model.get('part2')+'</span> &nbsp; &nbsp; <span class="swap" style="font-family:sans-serif; color:blue; cursor:pointer;">[swap]</span> <span class="delete" style="cursor:pointer; color:red; font-family:sans-serif;">[delete]</span>');
      return this;
    },

    unrender: function(){ // removes model from the DOM
      $(this.el).remove();
    },

    swap: function(){ // interchange and item's attributes, the set method will trigger the 'change' event handler
      var swapped = {
        part1: this.model.get('part2'),
        part2: this.model.get('part1')
      };
      this.model.set(swapped);
    },

    remove: function(){
      this.model.destroy();
    }
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
      // refactor view to now be updated by the render method from the ItemView class
      var itemView = new ItemView({
        model: item
      });
      $('ul', this.el).append(itemView.render().el);
      // $('ul', this.el).append("<li>"+item.get('part1')+ " "+item.get('part2')+"</li>");
    }
  });

  // Instantiate main app view
  var listView = new ListView();
  console.log(listView);

})(jQuery);
