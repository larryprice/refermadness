var FormError = React.createClass({displayName: "FormError",
  render: function() {
    return (
      React.createElement("div", {className: "form-error"}, 
        React.createElement("span", {className: "glyphicon glyphicon-remove form-control-feedback", "aria-hidden": "true"}), 
        React.createElement("span", {className: "sr-only"}, "(error)")
      )
    );
  }
});

var CreateServiceName = React.createClass({displayName: "CreateServiceName",
  render: function() {
    return (
      React.createElement("div", {className: "form-group create-service-name"}, 
        React.createElement("label", {className: "col-sm-3 col-xs-12 control-label", for: "create-service-name"}, "Name"), 
        React.createElement("div", {className: "col-sm-9 col-xs-12"}, 
          React.createElement("input", {type: "text", className: "form-control input-lg", id: "create-service-name", placeholder: "Name of the service..."}), 
          React.createElement(FormError, null)
        )
      )
    );
  }
});

var CreateServiceURL = React.createClass({displayName: "CreateServiceURL",
  render: function() {
    return (
      React.createElement("div", {className: "form-group create-service-url"}, 
        React.createElement("label", {className: "col-sm-3 col-xs-12 control-label", for: "create-service-url"}, "URL"), 
        React.createElement("div", {className: "col-sm-9 col-xs-12"}, 
          React.createElement("input", {type: "text", className: "form-control input-lg", id: "create-service-url", placeholder: "URL to the service..."}), 
          React.createElement(FormError, null)
        )
      )
    );
  }
});

var CreateServiceDescription = React.createClass({displayName: "CreateServiceDescription",
  render: function() {
    return (
      React.createElement("div", {className: "form-group create-service-description"}, 
        React.createElement("label", {className: "col-sm-3 col-xs-12 control-label", for: "create-service-description"}, "Description"), 
        React.createElement("div", {className: "col-sm-9 col-xs-12"}, 
          React.createElement("input", {type: "text", className: "form-control input-lg", id: "create-service-description", placeholder: "Describe the service in a few words..."}), 
          React.createElement(FormError, null)
        )
      )
    );
  }
});

var CreateServiceButton = React.createClass({displayName: "CreateServiceButton",
  addService: function(e) {
    e.preventDefault();

    if ($("body").attr("data-logged-in") !== "true") {
      $("#authenticate-panel").collapse("show");
      $("#authenticate-panel")[0].scrollIntoView();
      return;
    }

    $(".create-service-name, .create-service-description, .create-service-url").removeClass("has-error");
    var validationError = false;
    if ($("#create-service-name").val() === "") {
      $(".create-service-name").addClass("has-error");
      validationError = true;
    }
    if ($("#create-service-url").val() === "" || $("#create-service-url").val().indexOf("http") === -1) {
      $(".create-service-url").addClass("has-error");
      validationError = true;
    }
    if ($("#create-service-description").val() === "") {
      $(".create-service-description").addClass("has-error");
      validationError = true;
    }

    $("#create-service-name, #create-service-description, #create-service-url").one("keyup", function() {
      $(this).closest(".form-group").removeClass("has-error");
    });

    if (validationError) {
      return;
    }

    $(".form-group .glyphicon").addClass("spin infinite");
    var that = this;
    $.ajax({
      url: "/service/create",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        name: $("#create-service-name").val(),
        description: $("#create-service-description").val(),
        url: $("#create-service-url").val()
      }),
      dataType: "json",
      success: function(service) {
        that.props.onServiceCreated(service);
      },
      error: function(xhr) {
        console.log(xhr);
      },
      complete: function() {
        $(".form-group .glyphicon").removeClass("spin infinite");
      }
    });
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
