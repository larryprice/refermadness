var testData = [
  {name: "Test #1", url: "https://test1.com"},
  {name: "Test #2", url: "https://example.test2.com"},
  {name: "Test #3", url: "https://3test.org"},
  {name: "Test #4", url: "https://signup.4test.net/"},
  {name: "Test #5", url: "http://testtesttesttesttest.me"}
];

var Result = React.createClass({
  render: function() {
    return (
      <div className="search-result col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <h2>
          {this.props.name}
        </h2>
      </div>
    );
  }
});

var SearchResults = React.createClass({
  render: function() {
    var results = this.props.data.map(function (result) {
      return (
        <Result name={result.name} key={result.name} />
      );
    });

    return (
      <div className="search-results row">
        {results}
      </div>
    );
  }
});

var SearchBox = React.createClass({
  onTextChange: function(e) {
    this.props.onSearchTextChange(React.findDOMNode(this.refs.text).value);
  },
  render: function() {
    return (
      <div className="search-box">
        <input type="text" onChange={this.onTextChange} className="form-control input-lg" placeholder="Give me a service name or URL!" ref="text"/>
      </div>
    );
  }
});

var SearchArea = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  handleSearchTextChange: function(query) {
    query = $.trim(query);
    if (query === "") {
      this.setState({data: []});
      return
    }
    var searchResults = testData.filter(function(val) {
      return val.name.indexOf(query) > -1 || val.url.indexOf(query) > -1;
    });
    this.setState({data: searchResults});
  },
  render: function() {
    return (
      <div className="search-area">
        <SearchBox onSearchTextChange={this.handleSearchTextChange} ref="searchbox"/>
        <SearchResults data={this.state.data} />
      </div>
    );
  }
});

var Title = React.createClass({
  render: function() {
    return (
      <div className="title">{this.props.children}</div>
    )
  }
});

var TopPanel = React.createClass({
  render: function() {
    return (
      <div className="top-panel text-center">
        <div className="container">
          <Title>Refer Madness</Title>
          <h1><strong>Looking for referral links?</strong></h1>
          <h2><strong>Start searching below to find your product or service.</strong></h2>
          <SearchArea />
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

var HomePage = React.createClass({
  render: function() {
    return (
      <div className="home-page">
        <TopPanel />
        <LonelyPanel />
        <HookPanel />
      </div>
    );
  }
});

React.render(
  <HomePage />,
  document.getElementById('content')
);