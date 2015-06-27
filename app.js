(function($){ // self-executing wrapper

  var ListView = Backbone.View.extend({
    el: $('body'), // attaches 'this.el' to an existing element

    // where DOM events are bound to view methods. backbone doesnt have separate controller to handle bindings. happens in view
    events: {
      'click button#add': 'addItem'
    },

    // automatically called upon instantiation. where you make all types of bindings, excluding UI events, such as clicks
    initialize: function(){
      _.bindAll(this, 'render', 'addItem'); // fixes loss of context for 'this' within methods

      this.counter = 0; // total number of items added thus far
      this.render(); // not all views are self-rendering. This one is. 
    },

    // function in charge of render entire view in this.el. needs to be manually called by user
    render: function(){
      $(this.el).append("<button id='add'>Add list item</button>"); // introduces a button to add a new list item
      $(this.el).append("<ul></ul>");
    },

    // custon function called via click event above
    addItem: function(){
      this.counter++;
      $('ul', this.el).append("<li>hello world"+this.counter+"</li>");
    }
  });

  // Instantiate main app view
  var listView = new ListView();
  console.log(listView);

})(jQuery);
