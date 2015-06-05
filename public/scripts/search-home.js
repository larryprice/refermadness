var SearchPanel = React.createClass({displayName: "SearchPanel",
  render: function() {
    return (
      React.createElement("div", {className: "search-panel text-center"}, 
        React.createElement("div", {className: "container"}, 
          React.createElement(SearchPage, null)
        )
      )
    );
  }
});

var SearchHome = React.createClass({displayName: "SearchHome",
  componentDidMount: function() {
    $(".create-search-result").removeClass("hidden");
  },
  render: function() {
    var waitToPop = /^((?!chrome).)*safari/i.test(navigator.userAgent);
    $(window).off("popstate").on("popstate", function() {
      if (waitToPop) {
        waitToPop = false;
        return;
      }
      window.location = window.location.href;
    });

    return (
      React.createElement("div", {className: "search-home"}, 
        React.createElement(Header, {smallTitle: true}), 
        React.createElement(SearchPanel, null)
      )
    );
  }
});

React.render(
  React.createElement(SearchHome, null),
  document.getElementById('content')
);