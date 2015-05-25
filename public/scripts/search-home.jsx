var SearchPanel = React.createClass({
  switchToCreate: function() {
    console.log("create from search");
    history.pushState(null, null, "/service/create");
  },
  render: function() {
    return (
      <div className="search-panel text-center">
        <div className="container">
          <SearchPage onAddService={this.switchToCreate} />
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