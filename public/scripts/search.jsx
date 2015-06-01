var testData = [
  {name: "Test #1", url: "https://test1.com", id: "556c6221f06a07031a000001", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
  {name: "Test #2", url: "https://example.test2.com", id: "2", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
  {name: "Test #3", url: "https://3test.org", id: "3", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
  {name: "Test #4", url: "https://signup.4test.net/", id: "4", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
  {name: "Test #5", url: "http://testtesttesttesttest.me", id: "5", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]}
];

var Result = React.createClass({
  viewFull: function() {
    this.props.onSelected(this.props.data);
  },
  render: function() {
    return (
      <div className="search-result col-md-3-point-5 col-sm-6 col-xs-12" onClick={this.viewFull}>
        <h2>
          {this.props.data.name}
        </h2>
        <h4>
          {this.props.data.url}
        </h4>
        <h5>
          Some short description here?
        </h5>
      </div>
    );
  }
});

var CreateResult = React.createClass({
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
      <div className="search-result create-search-result col-md-3-point-5 col-sm-6 col-xs-12 hidden" onClick={this.create}>
        <div className="row">
          <div className="col-xs-offset-1 col-xs-3">
            <span className="glyphicon glyphicon-plus"></span>
          </div>
          <div className="col-xs-7">
            <h2>
              Add
            </h2>
            <h2>
              New
            </h2>
          </div>
        </div>
      </div>
    );
  }
});

var SearchResults = React.createClass({
  selectResult: function(data) {
    this.props.onResultSelected(data)
  },
  standardizeResultHeights: function() {
    var results =$(".search-result")
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
        <Result key={result.id} data={result} onSelected={that.selectResult} />
      );
    });

    return (
      <div className="search-results row">
        {results}
        <CreateResult onCreate={this.newService} />
      </div>
    );
  }
});

var SearchBox = React.createClass({
  onTextChange: function(e) {
    this.props.onSearchTextChange(React.findDOMNode(this.refs.text).value);
  },
  edit: function(e) {
    var currentSearch = React.findDOMNode(this.refs.text).value;
    this.props.onSearchTextChange(currentSearch);
    history.pushState(null, null, "/search?q=" + currentSearch);
  },
  componentDidMount: function() {
    if (this.props.isReadonly !== true) {
      $(".search-box input").select();
    }
  },
  render: function() {
    if (this.props.isReadonly !== true) {
      return (
        <div className="search-box">
          <input type="text" onChange={this.onTextChange} className="form-control input-lg" ref="text"
                 placeholder="Give me a service name or URL!" value={this.props.initialSearch} />
        </div>
      );
    } else {
      return (
          <div className="search-box">
            <input type="text" onChange={this.onTextChange} onClick={this.edit} className="form-control input-lg disabled" ref="text"
                   placeholder="Give me a service name or URL!" value={this.props.initialSearch} />
          </div>
        );
    }
  }
});

var SearchPage = React.createClass({
  getSearchParam: function() {
    var search = window.location.search;
    if (search.startsWith("?q=")) {
      return search.substring(search.indexOf("=")+1);
    }
  },
  getInitialState: function() {
    var query = this.getSearchParam();
    return {
      data: this.getFilteredData(query),
      selected: this.props.selected || -1,
      creating: this.props.creating,
      initialSearch: query
    };
  },
  getFilteredData: function(query) {
    query = $.trim(query);
    if (this.isMounted()) {
      this.setState({initialSearch: query});
    }
    if (query === "") {
      return [];
    }
    return testData.filter(function(val) {
      return val.name.indexOf(query) > -1 || val.url.indexOf(query) > -1;
    });
  },
  handleSearchTextChange: function(query) {
    var data = this.getFilteredData(query);
    if (this.props.onNonEmptySearch) {
      this.props.onNonEmptySearch();
    }
    this.setState({data: data, selected: -1});
  },
  resultSelected: function(data) {
    var animationFinished = false, endAnimation = $(".search-result").length-1;
    $(".search-result").each(function(i, item) {
      setTimeout(function() {
        $(item).addClass("fade-out");
        if (i === endAnimation) {
          animationFinished = true;
        }
      }, (i+1)*200);
    });

    var that = this;
    $.ajax({
      url: "/service/" + data.id,
      contentType: "application/json",
      success: function(service) {
        console.log(service);
        var proceedToServicePage = function() {
          setTimeout(function() {
            if (animationFinished) {
              var searchText = $(".search-box input").val()
              history.pushState(null, null, "/search?q=" + searchText);
              history.pushState(null, null, "/service/" + service.ID + "?q=" + searchText);
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
    var searchText = $(React.findDOMNode(this.refs.searchbox)).find("input").val()
    history.pushState(null, null, "/search?q=" + searchText);
    history.pushState(null, null, "/service/create");
    this.setState({creating: true});
  },
  handleServiceCreated: function(service) {
    history.pushState(null, null, "/service/" + service.id);
    this.setState({creating: false, selected: service});
  },
  render: function() {
    if (this.state.creating) {
      return (
        <div className="search-area">
          <CreateService fadeIn={this.props.originalTarget !== "create-service"} onCreated={this.handleServiceCreated} />
        </div>
      );
    } else if (this.state.selected === -1) {
      return (
        <div className="search-area">
          <SearchBox onSearchTextChange={this.handleSearchTextChange} ref="searchbox" initialSearch={this.state.initialSearch}/>
          <SearchResults data={this.state.data} onResultSelected={this.resultSelected} onNewService={this.createService} />
        </div>
      );
    } else {
      var searchText = this.state.initialSearch || this.getSearchParam() || this.state.selected.name
      return (
        <div className="search-area">
          <SearchBox onSearchTextChange={this.handleSearchTextChange} ref="searchbox" isReadonly={true}
                     initialSearch={this.state.initialSearch || this.state.selected.name}/>
          <ServicePage data={this.state.selected} />
        </div>
      )
    }
  }
});
