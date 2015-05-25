var CreateServiceName = React.createClass({displayName: "CreateServiceName",
  render: function() {
    return (
      React.createElement("div", {className: "form-group"}, 
        React.createElement("label", {className: "col-sm-3 col-xs-12 control-label", for: "create-service-name"}, "Name"), 
        React.createElement("div", {className: "col-sm-9 col-xs-12"}, 
          React.createElement("input", {type: "text", className: "form-control input-lg", id: "create-service-name", placeholder: "Name of the service..."})
        )
      )
    );
  }
});

var CreateServiceURL = React.createClass({displayName: "CreateServiceURL",
  render: function() {
    return (
      React.createElement("div", {className: "form-group"}, 
        React.createElement("label", {className: "col-sm-3 col-xs-12 control-label", for: "create-service-url"}, "URL"), 
        React.createElement("div", {className: "col-sm-9 col-xs-12"}, 
          React.createElement("input", {type: "text", className: "form-control input-lg", id: "create-service-url", placeholder: "URL to the service..."})
        )
      )
    );
  }
});

var CreateServiceDescription = React.createClass({displayName: "CreateServiceDescription",
  render: function() {
    return (
      React.createElement("div", {className: "form-group"}, 
        React.createElement("label", {className: "col-sm-3 col-xs-12 control-label", for: "create-service-description"}, "Description"), 
        React.createElement("div", {className: "col-sm-9 col-xs-12"}, 
          React.createElement("input", {type: "text", className: "form-control input-lg", id: "create-service-description", placeholder: "Describe the service in a few words..."})
        )
      )
    );
  }
});

var CreateServiceButton = React.createClass({displayName: "CreateServiceButton",
  addService: function(e) {
    e.preventDefault();
    $(".form-group .glyphicon").addClass("spin infinite");
    var that = this;
    setTimeout(function() {
      console.log("POST /service/create");
      that.props.onServiceCreated(testData[2]); // ajax request returns newly created service
    }, 300); // simulate ajax request
  },
  render: function() {
    return (
      React.createElement("div", {className: "form-group"}, 
        React.createElement("div", {className: "col-sm-offset-3 col-sm-9 col-xs-12"}, 
          React.createElement("button", {type: "submit", className: "btn btn-default btn-lg", onClick: this.addService}, 
            React.createElement("span", {className: "glyphicon glyphicon-plus"}), 
            "Create Service"
          )
        )
      )
    );
  }
});

var CreateService = React.createClass({displayName: "CreateService",
  componentDidMount: function() {
    if (this.props.fadeIn) {
      setTimeout(function() {
        $(".create-service").addClass("fade-in");
      });
    } else {
      $(".create-service").addClass("fade-in");
    }
  },
  handleCreation: function(data) {
    $(".create-service").removeClass("fade-in");
    this.props.onCreated(data);
  },
  render: function() {
    return (
      React.createElement("div", {className: "create-service"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "create-service-title col-xs-12"}, 
            "Know a service we don't?"
          )
        ), 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "create-service-subtitle col-xs-12"}, 
            "Add it!"
          )
        ), 
        React.createElement("form", {className: "form-horizontal"}, 
          React.createElement(CreateServiceName, null), 
          React.createElement(CreateServiceURL, null), 
          React.createElement(CreateServiceDescription, null), 
          React.createElement(CreateServiceButton, {onServiceCreated: this.handleCreation})
        )
      )
    );
  }
});
