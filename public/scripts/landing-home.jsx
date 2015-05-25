var SearchPanel = React.createClass({
  handleSearchActivated: function() {
    if (this.props.onSearchActivated) {
      this.props.onSearchActivated();
      $(".search-panel-message").addClass("fadeout");
      $(".title").addClass("shrink");
      history.pushState(null, null, "/search");
    }
  },
  switchToCreate: function() {
    console.log("create from landing");
    history.pushState(null, null, "/service/create");
  },
  render: function() {
    return (
      <div className="search-panel text-center">
        <Header />
        <div className="container">
          <h1 className="search-panel-message"><strong>Looking for referral links?</strong></h1>
          <h2 className="search-panel-message"><strong>Start searching below to find your product or service.</strong></h2>
          <SearchPage onNonEmptySearch={this.handleSearchActivated} onAddService={this.switchToCreate} />
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
            <div className="col-md-4 col-xs-12">
              <div className="row">
                <div className="col-xs-12 text-center">
                  <h1>No</h1><h2>friends?</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div id="no-friends" />
                </div>
              </div>
            </div>
            <div className="col-md-4 col-xs-12">
              <div className="row">
                <div className="col-xs-12 text-center">
                  <h1>No</h1><h2>family?</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div id="no-family" />
                </div>
              </div>
            </div>
            <div className="col-md-4 col-xs-12">
              <div className="row">
                <div className="col-xs-12 text-center">
                  <h1>No</h1><h2>followers?</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div id="no-followers" />
                </div>
              </div>
            </div>
          </div>
          <div className="row" id="no-problem">
            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 text-center"><h1>No problem.</h1></div>
              </div>
              <div className="row">
                <div className="col-xs-12 text-center">
                  <img src="/img/no-problem.png" />
                </div>
              </div>
            </div>
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
            <div className="col-xs-12 text-center">
              <h1>Find a random referral code to get mutual discounts</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 text-center">
              <img width="300px" src="/img/helping-hands.png" alt="Friends with benefits" />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 text-center">
              <h1>Then submit your own for others to use</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

var PopularPanel = React.createClass({
  selectResult: function(data) {
    window.location.href = "/service/" + data.id;
  },
  render: function() {
    var testData = [
      {name: "Test #3", url: "https://3test.org", id: "3"},
      {name: "Test #4", url: "https://signup.4test.net/", id: "4"},
      {name: "Test #5", url: "http://testtesttesttesttest.me", id: "5"}
    ];
    var that = this;
    var results = testData.map(function (result) {
      return (
        <Result key={result.id} data={result} onSelected={that.selectResult} />
      );
    });

    return (
      <div className="popular-panel">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-3 text-center">
              <h1>Most</h1>
              <h1>Popular</h1>
            </div>
            {results}
          </div>
        </div>
      </div>
    );
  }
});

var RecentPanel = React.createClass({
  selectResult: function(data) {
    window.location.href = "/service/" + data.id;
  },
  render: function() {
    var testData = [
      {name: "Test #3", url: "https://3test.org", id: "3"},
      {name: "Test #4", url: "https://signup.4test.net/", id: "4"},
      {name: "Test #5", url: "http://testtesttesttesttest.me", id: "5"}
    ];
    var that = this;
    var results = testData.map(function (result) {
      return (
        <Result key={result.id} data={result} onSelected={that.selectResult} />
      );
    });

    return (
      <div className="recent-panel">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-3 text-center">
              <h1>Most</h1>
              <h1>Recent</h1>
            </div>
            {results}
          </div>
        </div>
      </div>
    );
  }
});

var GetStartedPanel = React.createClass({
  focusOnSearch: function() {
    $(".search-panel")[0].scrollIntoView();
    $(".search-box input").focus();
  },
  render: function() {
    return (
      <div className="get-started-panel">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <h1>
                Why haven&apos;t you started yet?
              </h1>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 text-center">
              <h1>
                It&apos;s <em>literally <strong>free</strong></em>.
              </h1>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 text-center">
              <h1>
                You could even <strong>make</strong> money.
              </h1>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 text-center">
              <a className="btn btn-default" href="javascript:void(0)" onClick={this.focusOnSearch}>
              <span className="glyphicon glyphicon-search" />
                Go ahead - search for a service
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var LandingHome = React.createClass({
  getInitialState: function() {
    $(window).off("popstate").on("popstate", function() {
      window.location = window.location.href;
    });

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
          <PopularPanel />
          <RecentPanel />
          <GetStartedPanel />
        </div>
      );
    }
  }
});

React.render(
  <LandingHome />,
  document.getElementById('content')
);