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
    var selected = -1;
    return (
      <div className="search-panel text-center">
        <div className="container">
          <Title>Refer Madness</Title>
          <SearchPage selected={testData[0]} />
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

    return (
      <div className="service-home">
        <ServicePanel />
      </div>
    );
  }
});

React.render(
  <ServiceHome />,
  document.getElementById('content')
);