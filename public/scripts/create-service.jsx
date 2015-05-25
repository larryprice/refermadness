var CreateServiceName = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <label className="col-sm-3 col-xs-12 control-label" for="create-service-name">Name</label>
        <div className="col-sm-9 col-xs-12">
          <input type="text" className="form-control input-lg" id="create-service-name" placeholder="Name of the service..."/>
        </div>
      </div>
    );
  }
});

var CreateServiceURL = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <label className="col-sm-3 col-xs-12 control-label" for="create-service-url">URL</label>
        <div className="col-sm-9 col-xs-12">
          <input type="text" className="form-control input-lg" id="create-service-url" placeholder="URL to the service..."/>
        </div>
      </div>
    );
  }
});

var CreateServiceDescription = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <label className="col-sm-3 col-xs-12 control-label" for="create-service-description">Description</label>
        <div className="col-sm-9 col-xs-12">
          <input type="text" className="form-control input-lg" id="create-service-description" placeholder="Describe the service in a few words..."/>
        </div>
      </div>
    );
  }
});

var CreateServiceButton = React.createClass({
  addService: function(e) {
    e.preventDefault();
    $(".form-group .glyphicon").addClass("spin infinite");
    setTimeout(function() {
      console.log("POST /service/create");
      that.onServiceCreated(2); // 2 == newserviceid
    }, 300); // simulate ajax request
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
  handleCreation: function() {

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