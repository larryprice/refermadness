var ServicePanel = React.createClass({displayName: "ServicePanel",
  render: function() {
    return (
      React.createElement("div", {className: "search-panel text-center"}, 
        React.createElement("div", {className: "container"}, 
          React.createElement(SearchPage, {creating: true, originalTarget: "create-service"})
        )
      )
    );
  }
});

var CreateServiceHome = React.createClass({displayName: "CreateServiceHome",
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
      React.createElement("div", {className: "create-service-home"}, 
        React.createElement(Header, {smallTitle: true}), 
        React.createElement(ServicePanel, null)
      )
    );
  }
});

React.render(
  React.createElement(CreateServiceHome, null),
  document.getElementById('content')
);