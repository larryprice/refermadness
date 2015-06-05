var ServicePanel = React.createClass({
  render: function() {
    return (
      <div className="search-panel text-center">
        <div className="container">
          <SearchPage creating={true} originalTarget="create-service" />
        </div>
      </div>
    );
  }
});

var CreateServiceHome = React.createClass({
  render: function() {
    var waitToPop = /^((?!chrome).)*safari/i.test(navigator.userAgent);
    $(window).off("popstate").on("popstate", function() {
      if (waitToPop) {
        waitToPop = false;
        return;
      }
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