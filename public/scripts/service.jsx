var ServicePage = React.createClass({
  render: function() {
    return (
      <div className="service-area">
        <div className="view-result col-xs-12">
          <h1 className="text-center service-name">
            {this.props.data.name}
          </h1>
          <h2 className="text-center">
            <a href={this.props.data.url}>{this.props.data.url}</a>
          </h2>
          <h4 className="text-center">
            A description of the service.
          </h4>
        </div>
      </div>
    );
  }
});