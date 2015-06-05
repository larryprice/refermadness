var SearchPanel = React.createClass({
  render: function() {
    return (
      <div className="search-panel text-center">
        <div className="container">
          <SearchPage />
        </div>
      </div>
    );
  }
});

var SearchHome = React.createClass({
  componentDidMount: function() {
    $(".create-search-result").removeClass("hidden");
  },
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
      <div className="search-home">
        <Header smallTitle={true} />
        <SearchPanel />
      </div>
    );
  }
});

React.render(
  <SearchHome />,
  document.getElementById('content')
);