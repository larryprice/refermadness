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
  render: function() {
    $(window).off("popstate").on("popstate", function() {
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