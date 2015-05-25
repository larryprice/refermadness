var ServicePanel = React.createClass({displayName: "ServicePanel",
  switchToCreate: function() {
    console.log("create from service");
    history.pushState(null, null, "/service/create");
  },
  render: function() {
    return (
      React.createElement("div", {className: "search-panel text-center"}, 
        React.createElement("div", {className: "container"}, 
          React.createElement(SearchPage, {selected: this.props.service, onAddService: this.switchToCreate})
        )
      )
    );
  }
});

var ServiceHome = React.createClass({displayName: "ServiceHome",
  render: function() {
    $(window).off("popstate").on("popstate", function() {
      window.location = window.location.href;
    });

    // strip the service name from the URL
    var serviceId = window.location.pathname.replace("/service/", "");
    var service = testData.filter(function(data) {
      return data.id === serviceId;
    })[0];

    return (
      React.createElement("div", {className: "service-home"}, 
        React.createElement(Header, {smallTitle: true}), 
        React.createElement(ServicePanel, {service: service})
      )
    );
  }
});

React.render(
  React.createElement(ServiceHome, null),
  document.getElementById('content')
);