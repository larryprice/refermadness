var ServicePage = React.createClass({
  render: function() {
    return (
      <div className="service-area">
        <div className="view-result col-xs-12">
          <h1 className="text-center service-name">
            {this.props.data.name}
          </h1>
          <h2 className="text-center">
            {this.props.data.url}
          </h2>
          <h4 className="text-center">
            A description of the service.
          </h4>
        </div>
      </div>
    );
  }
});