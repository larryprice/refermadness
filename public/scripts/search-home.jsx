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

var SearchPanel = React.createClass({
  render: function() {
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

var SearchHome = React.createClass({
  render: function() {
    $(window).off("popstate").on("popstate", function() {
      window.location = window.location.href;
    });

    return (
      <div className="search-home">
          <SearchPanel />
      </div>
    );
  }
});

React.render(
  <SearchHome />,
  document.getElementById('content')
);