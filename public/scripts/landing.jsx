var Title = React.createClass({
  render: function() {
    return (
      <div className="title">{this.props.children}</div>
    )
  }
});

var SearchPanel = React.createClass({
  handleEmptySearch: function() {
    if (this.props.onSearchInactivated) {
      this.props.onSearchInactivated();
    }
  },
  handleSearchActivated: function() {
    if (this.props.onSearchActivated) {
      this.props.onSearchActivated();
      $(".search-panel-message").addClass("fadeout");
      $(".title").addClass("shrink");
    }
  },
  render: function() {
    return (
      <div className="search-panel text-center">
        <div className="container">
          <Title>Refer Madness</Title>
          <h1 className="search-panel-message"><strong>Looking for referral links?</strong></h1>
          <h2 className="search-panel-message"><strong>Start searching below to find your product or service.</strong></h2>
          <SearchArea onEmptySearch={this.handleEmptySearch} onNonEmptySearch={this.handleSearchActivated} />
        </div>
      </div>
    );
  }
});

var LonelyPanel = React.createClass({
  render: function() {
    return (
      <div className="lonely-panel">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-xs-1 text-center"><h1>No</h1><h2>friends?</h2></div>
            <div className="col-md-4 col-xs-1 text-center"><h1>No</h1><h2>family?</h2></div>
            <div className="col-md-4 col-xs-1 text-center"><h1>No</h1><h2>followers?</h2></div>
            <div className="col-xs-12 text-center"><h1>No</h1><h1>problem.</h1></div>
          </div>
        </div>
      </div>
    );
  }
});

var HookPanel = React.createClass({
  render: function() {
    return (
      <div className="hook-panel">
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-xs-12">
              <h2>Find a random referral link to get discounts...</h2>
            </div>
          </div>
          <div>
            <div className="col-md-10 col-md-offset-2 col-xs-12">
              <h2>...Then submit your own code or URL to start getting benefits.</h2>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

var RecentPanel = React.createClass({
  render: function() {
    return (
      <div className="recent-panel">
      </div>
    );
  }
});


var RandomPanel = React.createClass({
  render: function() {
    return (
      <div className="random-panel">
      </div>
    );
  }
});

var ContactPanel = React.createClass({
  render: function() {
    return (
      <div className="contact-panel">
      </div>
    );
  }
});

var HomePage = React.createClass({
  getInitialState: function() {
    return {searchActive: false};
  },
  handleSearchActivated: function() {
    this.setState({searchActive: true});
  },
  render: function() {
    if (this.state.searchActive) {
      return (
        <div className="home-page">
          <SearchPanel />
        </div>
      );
    } else {
      return (
        <div className="home-page">
          <SearchPanel onSearchActivated={this.handleSearchActivated} />
          <LonelyPanel />
          <HookPanel />
          <RecentPanel />
          <RandomPanel />
          <ContactPanel />
        </div>
      );
    }
  }
});

React.render(
  <HomePage />,
  document.getElementById('content')
);