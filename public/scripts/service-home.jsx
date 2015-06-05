var ServicePanel = React.createClass({
  render: function() {
    return (
      <div className="search-panel text-center">
        <div className="container">
          <SearchPage selected={this.props.service} />
        </div>
      </div>
    );
  }
});

var ServiceHome = React.createClass({
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
      <div className="service-home">
        <Header smallTitle={true} />
        <ServicePanel service={JSON.parse($("#content").attr("data-service"))} />
      </div>
    );
  }
});

React.render(
  <ServiceHome />,
  document.getElementById('content')
);