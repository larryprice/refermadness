var SearchPanel = React.createClass({displayName: "SearchPanel",
  handleSearchActivated: function() {
    if (this.props.onSearchActivated) {
      this.props.onSearchActivated();
      $(".search-panel-message").addClass("fadeout");
      $(".title").addClass("shrink");
      history.pushState(null, null, "/search");
    }
  },
  render: function() {
    return (
      React.createElement("div", {className: "search-panel"}, 
        React.createElement(Header, null), 
        React.createElement("div", {className: "container text-center"}, 
          React.createElement("h1", {className: "search-panel-message"}, React.createElement("strong", null, "Looking for referral links?")), 
          React.createElement("h2", {className: "search-panel-message"}, React.createElement("strong", null, "Start searching below to find your product or service.")), 
          React.createElement(SearchPage, {onNonEmptySearch: this.handleSearchActivated})
        )
      )
    );
  }
});

var LonelyPanel = React.createClass({displayName: "LonelyPanel",
  render: function() {
    return (
      React.createElement("div", {className: "lonely-panel"}, 
        React.createElement("div", {className: "container"}, 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-md-4 col-xs-12"}, 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-xs-12 text-center"}, 
                  React.createElement("h1", null, "No"), React.createElement("h2", null, "friends?")
                )
              ), 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-xs-12"}, 
                  React.createElement("div", {id: "no-friends"})
                )
              )
            ), 
            React.createElement("div", {className: "col-md-4 col-xs-12"}, 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-xs-12 text-center"}, 
                  React.createElement("h1", null, "No"), React.createElement("h2", null, "family?")
                )
              ), 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-xs-12"}, 
                  React.createElement("div", {id: "no-family"})
                )
              )
            ), 
            React.createElement("div", {className: "col-md-4 col-xs-12"}, 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-xs-12 text-center"}, 
                  React.createElement("h1", null, "No"), React.createElement("h2", null, "followers?")
                )
              ), 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-xs-12"}, 
                  React.createElement("div", {id: "no-followers"})
                )
              )
            )
          ), 
          React.createElement("div", {className: "row", id: "no-problem"}, 
            React.createElement("div", {className: "col-xs-12"}, 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-xs-12 text-center"}, React.createElement("h1", null, "No problem."))
              ), 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-xs-12 text-center"}, 
                  React.createElement("img", {src: "/img/no-problem.png"})
                )
              )
            )
          )
        )
      )
    );
  }
});

var HookPanel = React.createClass({displayName: "HookPanel",
  render: function() {
    return (
      React.createElement("div", {className: "hook-panel"}, 
        React.createElement("div", {className: "container"}, 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-xs-12 text-center"}, 
              React.createElement("h1", null, "Find a random referral code to get mutual discounts")
            )
          ), 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-xs-12 text-center"}, 
              React.createElement("img", {width: "300px", src: "/img/helping-hands.png", alt: "Friends with benefits"})
            )
          ), 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-xs-12 text-center"}, 
              React.createElement("h1", null, "Then submit your own for others to use")
            )
          )
        )
      )
    )
  }
});

var PopularPanel = React.createClass({displayName: "PopularPanel",
  selectResult: function(data) {
    window.location.href = "/service/" + data.ID;
  },
  standardizeResultHeights: function() {
    var results = $(".popular-panel .search-result");
    var standardHeight = Math.max.apply(null,
      results.map(function(idx, el) {
        return $(el).height();
      }).get());
    results.each(function() {
      $(this).height(standardHeight);
    });
  },
  componentDidMount: function() {
    this.standardizeResultHeights();
  },
  componentDidUpdate: function() {
    this.standardizeResultHeights();
  },
  fetchData: function() {
    var that = this;
    $.ajax({
      url: "/service/popular",
      contentType: "application/json",
      success: function(data) {
        that.setState({services: data || []});
      }
    });
  },
  getInitialState: function() {
    this.fetchData();
    return {
      services: []
    };
  },
  render: function() {
    var that = this;
    var results = this.state.services.map(function (result) {
      return (
        React.createElement(Result, {key: result.ID, data: result, onSelected: that.selectResult})
      );
    });

    return (
      React.createElement("div", {className: "popular-panel"}, 
        React.createElement("div", {className: "container"}, 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-xs-12 col-md-3 text-center"}, 
              React.createElement("h1", null, "Most"), 
              React.createElement("h1", null, "Popular")
            ), 
            results
          )
        )
      )
    );
  }
});

var RecentPanel = React.createClass({displayName: "RecentPanel",
  selectResult: function(data) {
    window.location.href = "/service/" + data.ID;
  },
  standardizeResultHeights: function() {
    var results = $(".recent-panel .search-result");
    var standardHeight = Math.max.apply(null,
      results.map(function(idx, el) {
        return $(el).height();
      }).get());
    results.each(function() {
      $(this).height(standardHeight);
    });
  },
  componentDidMount: function() {
    this.standardizeResultHeights();
  },
  componentDidUpdate: function() {
    this.standardizeResultHeights();
  },
  fetchData: function() {
    var that = this;
    $.ajax({
      url: "/service/recent",
      contentType: "application/json",
      success: function(data) {
        that.setState({services: data || []});
      }
    });
  },
  getInitialState: function() {
    this.fetchData();
    return {
      services: []
    };
  },
  render: function() {
    var that = this;
    var results = this.state.services.map(function (result) {
      return (
        React.createElement(Result, {key: result.ID, data: result, onSelected: that.selectResult})
      );
    });

    return (
      React.createElement("div", {className: "recent-panel"}, 
        React.createElement("div", {className: "container"}, 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-xs-12 col-md-3 text-center"}, 
              React.createElement("h1", null, "Most"), 
              React.createElement("h1", null, "Recent")
            ), 
            results
          )
        )
      )
    );
  }
});

var GetStartedPanel = React.createClass({displayName: "GetStartedPanel",
  focusOnSearch: function() {
    $(".search-panel")[0].scrollIntoView();
    $(".search-box input").focus();
  },
  render: function() {
    return (
      React.createElement("div", {className: "get-started-panel"}, 
        React.createElement("div", {className: "container"}, 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-xs-12 text-center"}, 
              React.createElement("h1", null, 
                "Why haven't you started yet?"
              )
            )
          ), 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-xs-12 text-center"}, 
              React.createElement("h1", null, 
                "It's ", React.createElement("em", null, "literally ", React.createElement("strong", null, "free")), "."
              )
            )
          ), 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-xs-12 text-center"}, 
              React.createElement("h1", null, 
                "You could even ", React.createElement("strong", null, "make"), " money."
              )
            )
          ), 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-xs-12 text-center"}, 
              React.createElement("a", {className: "btn btn-default", href: "javascript:void(0)", onClick: this.focusOnSearch}, 
              React.createElement("span", {className: "glyphicon glyphicon-search"}), 
                "Go ahead - search for a service"
              )
            )
          )
        )
      )
    );
  }
});

var LandingHome = React.createClass({displayName: "LandingHome",
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
        React.createElement("div", {className: "home-page"}, 
          React.createElement(SearchPanel, null)
        )
      );
    } else {
      return (
        React.createElement("div", {className: "home-page"}, 
          React.createElement(SearchPanel, {onSearchActivated: this.handleSearchActivated}), 
          React.createElement(LonelyPanel, null), 
          React.createElement(HookPanel, null), 
          React.createElement(PopularPanel, null), 
          React.createElement(RecentPanel, null), 
          React.createElement(GetStartedPanel, null)
        )
      );
    }
  }
});

React.render(
  React.createElement(LandingHome, null),
  document.getElementById('content')
);