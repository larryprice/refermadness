var Title = React.createClass({
  render: function() {
    return (
      <div className="title shrink">{this.props.children}</div>
    )
  }
});

var SearchPanel = React.createClass({
  render: function() {
    return (
      <div className="search-panel text-center">
        <div className="container">
          <Title>Refer Madness</Title>
          <SearchPage onEmptySearch={this.handleEmptySearch} onNonEmptySearch={this.handleSearchActivated} />
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