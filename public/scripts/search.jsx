var testData = [
  {Name: "Test #1", URL: "https://test1.com", ID: "556c6221f06a07031a000001", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
  {Name: "Test #2", URL: "https://example.test2.com", ID: "2", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
  {Name: "Test #3", URL: "https://3test.org", ID: "3", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
  {Name: "Test #4", URL: "https://signup.4test.net/", ID: "4", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
  {Name: "Test #5", URL: "http://testtesttesttesttest.me", ID: "5", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]}
];

var Result = React.createClass({
  getInitialState: function() {
    return {
      code: this.props.data,
    };
  },
  viewFull: function() {
    this.props.onSelected(this.state.code);
  },
  render: function() {
    return (
      <div className="search-result col-md-3-point-5 col-sm-6 col-xs-12" onClick={this.viewFull}>
        <h2>
          {this.state.code.Name}
        </h2>
        <h4>
          {this.state.code.URL}
        </h4>
        <h5>
          {this.state.code.Description}
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
    var results = $(".search-result");
    if (results.length > 1) {
      var standardHeight = Math.max.apply(null,
        results.map(function(idx, el) {
          console.log($(el).height());
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
          <input type="text" onChange={$.debounce(300, this.onTextChange)} className="form-control input-lg" ref="text"
                 placeholder="Give me a service name or URL!" defaultValue={this.props.initialSearch} />
        </div>
      );
    } else {
      return (
          <div className="search-box">
            <input type="text" onChange={$.debounce(300, this.onTextChange)} onClick={this.edit} className="form-control input-lg disabled" ref="text"
                   placeholder="Give me a service name or URL!" defaultValue={this.props.initialSearch} />
          </div>
        );
    }
  }
});

var SearchPage = React.createClass({
  getSearchParam: function() {
    var search = window.location.search;
    if (search.startsWith("?q=")) {
      return decodeURIComponent(search.substring(search.indexOf("=")+1));
    }
  },
  getInitialState: function() {
    var query = this.getSearchParam();
    var data = []
    if ($("#content").attr("data-search-results")) {
      data = JSON.parse($("#content").attr("data-search-results"));
      if (!$.isArray(data)) {
        data = [];
      }
    } else {
      this.getFilteredData(query);
    }
    return {
      data: data,
      selected: this.props.selected || -1,
      creating: this.props.creating,
      initialSearch: query
    };
  },
  getFilteredData: function(query) {
    query = $.trim(query);
    if (query === "") {
      return [];
    }

    var that = this;
    $.ajax({
      url: "/search?q=" + encodeURIComponent(query),
      method: "POST",
      contentType: "application/json",
      success: function(data) {
        console.log("got results", data);
        that.setState({data: [testData[1], testData[2]]});
      },
      error: function(xhr) {
        console.log("got search error", xhr)
      }
    });

    return testData.filter(function(val) {
      return val.Name.indexOf(query) > -1 || val.URL.indexOf(query) > -1;
    });
  },
  handleSearchTextChange: function(query) {
    this.getFilteredData(query);
    if (this.props.onNonEmptySearch) {
      this.props.onNonEmptySearch();
    }
    this.setState({data: data, initialSearch: query, selected: -1});
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
      url: "/service/" + data.id,
      contentType: "application/json",
      success: function(service) {
        var proceedToServicePage = function() {
          setTimeout(function() {
            if (animationFinished) {
              var searchText = encodeURIComponent($(".search-box input").val())
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
    var searchText = encodeURIComponent($(React.findDOMNode(this.refs.searchbox)).find("input").val());
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
      var searchText = this.state.initialSearch || this.getSearchParam() || this.state.selected.Name
      return (
        <div className="search-area">
          <SearchBox onSearchTextChange={this.handleSearchTextChange} ref="searchbox" isReadonly={true}
                     initialSearch={this.state.initialSearch || this.state.selected.Name}/>
          <ServicePage data={this.state.selected} />
        </div>
      )
    }
  }
});
