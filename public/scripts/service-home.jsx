var Title = React.createClass({
  render: function() {
    return (
      <div className="title shrink">
        <a href="/" alt="Return to home page.">
          {this.props.children}
        </a>
      </div>
    )
  }
});

var ServicePanel = React.createClass({
  render: function() {
    return (
      <div className="search-panel text-center">
        <div className="container">
          <Title>Refer Madness</Title>
          <SearchPage selected={this.props.service} />
        </div>
      </div>
    );
  }
});

var ServiceHome = React.createClass({
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
      <div className="service-home">
        <ServicePanel service={service} />
      </div>
    );
  }
});

React.render(
  <ServiceHome />,
  document.getElementById('content')
);