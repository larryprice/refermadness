var FormError = React.createClass({
  render: function() {
    return (
      <div className="form-error">
        <span className="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
        <span className="sr-only">(error)</span>
      </div>
    );
  }
});

var CreateServiceName = React.createClass({
  render: function() {
    return (
      <div className="form-group create-service-name">
        <label className="col-sm-3 col-xs-12 control-label" for="create-service-name">Name</label>
        <div className="col-sm-9 col-xs-12">
          <input type="text" className="form-control input-lg" id="create-service-name" placeholder="Name of the service..."/>
          <FormError />
        </div>
      </div>
    );
  }
});

var CreateServiceURL = React.createClass({
  render: function() {
    return (
      <div className="form-group create-service-url">
        <label className="col-sm-3 col-xs-12 control-label" for="create-service-url">URL</label>
        <div className="col-sm-9 col-xs-12">
          <div className="input-group">
            <div className="input-group-addon">https://</div>
            <input type="text" className="form-control input-lg" id="create-service-url" placeholder="yourservice.com"/>
          </div>
          <FormError />
        </div>
      </div>
    );
  }
});

var CreateServiceDescription = React.createClass({
  render: function() {
    return (
      <div className="form-group create-service-description">
        <label className="col-sm-3 col-xs-12 control-label" for="create-service-description">Description</label>
        <div className="col-sm-9 col-xs-12">
          <input type="text" className="form-control input-lg" id="create-service-description" placeholder="Describe the service in a few words..."/>
          <FormError />
        </div>
      </div>
    );
  }
});

var CreateServiceButton = React.createClass({
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
    if ($("#create-service-url").val() === "") {
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
      <div className="form-group">
        <div className="col-sm-offset-3 col-sm-9 col-xs-12">
          <button type="submit" className="btn btn-default btn-lg" onClick={this.addService}>
            <span className="glyphicon glyphicon-plus"></span>
            Create Service
          </button>
        </div>
      </div>
    );
  }
});

var CreateService = React.createClass({
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
      <div className="create-service">
        <div className="row">
          <div className="create-service-title col-xs-12">
            Know a service we don&apos;t?
          </div>
        </div>
        <div className="row">
          <div className="create-service-subtitle col-xs-12">
            Add it!
          </div>
        </div>
        <form className="form-horizontal">
          <CreateServiceName />
          <CreateServiceURL />
          <CreateServiceDescription />
          <CreateServiceButton onServiceCreated={this.handleCreation} />
        </form>
      </div>
    );
  }
});
