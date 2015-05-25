var ServicePanel = React.createClass({
  render: function() {
    return (
      <div className="search-panel text-center">
        <div className="container">
          <SearchPage creating={true} />
        </div>
      </div>
    );
  }
});

var CreateServiceHome = React.createClass({
  render: function() {
    $(window).off("popstate").on("popstate", function() {
      window.location = window.location.href;
    });

    return (
      <div className="create-service-home">
        <Header smallTitle={true} />
        <ServicePanel />
      </div>
    );
  }
});

React.render(
  <CreateServiceHome />,
  document.getElementById('content')
);