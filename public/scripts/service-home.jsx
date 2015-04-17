var Title = React.createClass({
  render: function() {
    return (
      <div className="title shrink">{this.props.children}</div>
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
          <SearchPage />
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