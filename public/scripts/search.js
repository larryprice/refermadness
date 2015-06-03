var CreateResult = React.createClass({displayName: "CreateResult",
  create: function() {
    $(".search-box").addClass("fade-out");
    var that = this;
    $(".search-result").each(function(i, item) {
      setTimeout(function() {
        $(item).addClass("fade-out");
      }, (i+1)*200);
    });
    setTimeout(function() {
      that.props.onCreate();
    }, ($(".search-result").length+1)*200);
  },
  render: function() {
    return (
      React.createElement("div", {className: "search-result create-search-result col-md-3-point-5 col-sm-6 col-xs-12 hidden", onClick: this.create}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-xs-offset-1 col-xs-3"}, 
            React.createElement("span", {className: "glyphicon glyphicon-plus"})
          ), 
          React.createElement("div", {className: "col-xs-7"}, 
            React.createElement("h2", null, 
              "Add"
            ), 
            React.createElement("h2", null, 
              "New"
            )
          )
        )
      )
    );
  }
});

var SearchResults = React.createClass({displayName: "SearchResults",
  selectResult: function(data) {
    this.props.onResultSelected(data)
  },
  standardizeResultHeights: function() {
    var results = $(".search-result").height("inherit");
    if (results.length > 1) {
      var standardHeight = Math.max.apply(null,
        results.map(function(idx, el) {
          return $(el).height();
        }).get());
      results.each(function() {
        $(this).height(standardHeight);
      });
    }
  },
  componentDidMount: function() {
    if (window.location.pathname !== "/") {
      $(".create-search-result").removeClass("hidden");
    }
    this.standardizeResultHeights();
  },
  componentDidUpdate: function() {
    $(".create-search-result").removeClass("hidden");
    this.standardizeResultHeights();
  },
  newService: function() {
    this.props.onNewService();
  },
  render: function() {
    var that = this;
    var results = this.props.data.map(function (result) {
      return (
        React.createElement(Result, {key: result.ID, data: result, onSelected: that.selectResult})
      );
    });

    return (
      React.createElement("div", {className: "search-results row"}, 
        results, 
        React.createElement(CreateResult, {onCreate: this.newService})
      )
    );
  }
});

var SearchBox = React.createClass({displayName: "SearchBox",
  onTextChange: function(e) {
    this.props.onSearchTextChange(React.findDOMNode(this.refs.text).value);
  },
  edit: function(e) {
    var currentSearch = React.findDOMNode(this.refs.text).value;
    this.props.onSearchTextChange(currentSearch);
  },
  componentDidMount: function() {
    if (this.props.isReadonly !== true) {
      $(".search-box input").select();
    }
  },
  render: function() {
    if (this.props.isReadonly !== true) {
      return (
        React.createElement("div", {className: "search-box"}, 
          React.createElement("input", {type: "text", onChange: $.debounce(300, this.onTextChange), className: "form-control input-lg", ref: "text", 
                 placeholder: "Give me a service name or URL!", defaultValue: this.props.initialSearch})
        )
      );
    } else {
      return (
          React.createElement("div", {className: "search-box"}, 
            React.createElement("input", {type: "text", onChange: $.debounce(300, this.onTextChange), onClick: this.edit, className: "form-control input-lg disabled", ref: "text", 
                   placeholder: "Give me a service name or URL!", defaultValue: this.props.initialSearch})
          )
        );
    }
  }
});

var SearchPage = React.createClass({displayName: "SearchPage",
  getSearchParam: function() {
    var search = window.location.search.substring(1).split("&");
    var searchMap = {};
    search.forEach(function(item) {
      var splitVals = item.split("=");
      if (splitVals.length != 2) {
        return;
      }
      searchMap[splitVals[0]] = splitVals[1];
    });

    return searchMap["q"] ? decodeURIComponent(searchMap["q"]) : "";
  },
  getInitialState: function() {
    var query = this.getSearchParam();
    var data = [];
    if ($("#content").attr("data-search-results")) {
      data = JSON.parse($("#content").attr("data-search-results"));
    }
    return {
      services: data.Services || [],
      total: 0,
      selected: this.props.selected || -1,
      creating: this.props.creating,
      initialSearch: query
    };
  },
  getFilteredData: function(query) {
    query = encodeURIComponent($.trim(query));

    var that = this;
    $.ajax({
      url: "/search?q=" + query + "&skip=0&limit=11",
      method: "POST",
      contentType: "application/json",
      success: function(data) {
        history.pushState(null, null, "/search?q=" + query);
        that.setState({services: data.Services || [], total: data.Total});
      },
      error: function(xhr) {
        console.log("got search error", xhr);
      }
    });
  },
  getMoreResults: function() {
    var that = this;
    $.ajax({
      url: "/search?q=" + that.state.initialSearch + "&skip=" + that.state.services.length + "&limit=11",
      method: "POST",
      contentType: "application/json",
      success: function(data) {
        history.pushState(null, null, "/search?q=" + query);
        that.setState({services: that.state.services.concat(data.Services || []), total: data.Total});
      },
      error: function(xhr) {
        console.log("got search error", xhr);
      }
    });
  },
  handleSearchTextChange: function(query) {
    this.getFilteredData(query);
    if (this.props.onNonEmptySearch) {
      this.props.onNonEmptySearch();
    }
    this.setState({initialSearch: query, selected: -1});
  },
  resultSelected: function(data) {
    var animationFinished = false, endAnimation = $(".search-result").length-1;
    $(".search-result").each(function(i, item) {
      setTimeout(function() {
        $(item).addClass("fade-out");
        if (i === endAnimation) {
          animationFinished = true;
        }
      }, i*200);
    });

    var that = this;
    $.ajax({
      url: "/service/" + data.ID,
      contentType: "application/json",
      success: function(service) {
        var proceedToServicePage = function() {
          setTimeout(function() {
            if (animationFinished) {
              history.pushState(null, null, "/service/" + service.ID + "?q=" + encodeURIComponent($(".search-box input").val()));
              that.setState({selected: service});
            } else {
              proceedToServicePage();
            }
          }, 100);
        };
        proceedToServicePage();
      },
      error: function() {
        console.log("der was error");
      }
    });
  },
  createService: function() {
    var searchText = encodeURIComponent($(React.findDOMNode(this.refs.searchbox)).find("input").val());
    history.pushState(null, null, "/search?q=" + searchText);
    history.pushState(null, null, "/service/create");
    this.setState({creating: true});
  },
  handleServiceCreated: function(service) {
    history.pushState(null, null, "/service/" + service.ID);
    this.setState({creating: false, selected: service});
  },
  render: function() {
    if (this.state.creating) {
      return (
        React.createElement("div", {className: "search-area"}, 
          React.createElement(CreateService, {fadeIn: this.props.originalTarget !== "create-service", onCreated: this.handleServiceCreated})
        )
      );
    } else if (this.state.selected === -1) {
      return (
        React.createElement("div", {className: "search-area"}, 
          React.createElement(SearchBox, {onSearchTextChange: this.handleSearchTextChange, ref: "searchbox", initialSearch: this.state.initialSearch}), 
          React.createElement(SearchResults, {data: this.state.services, onResultSelected: this.resultSelected, onNewService: this.createService}), 
          React.createElement(MoreResults, {isVisible: this.state.total > this.state.services.length, onMore: this.getMoreResults})
        )
      );
    } else {
      var searchText = this.state.initialSearch || this.getSearchParam() || this.state.selected.Name
      return (
        React.createElement("div", {className: "search-area"}, 
          React.createElement(SearchBox, {onSearchTextChange: this.handleSearchTextChange, ref: "searchbox", isReadonly: true, 
                     initialSearch: this.state.initialSearch || this.state.selected.Name}), 
          React.createElement(ServicePage, {data: this.state.selected})
        )
      )
    }
  }
});
