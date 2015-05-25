var testData = [
  {name: "Test #1", url: "https://test1.com", id: "1", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
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
        if ((i+1) === $(".search-result").length) {
          that.props.onCreate();
        }
      }, (i+1)*100);
    });
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
    $(".create-search-result").removeClass("hidden");
    this.standardizeResultHeights();
  },
  componentDidUpdate: function() {
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
      creating: false,
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
    this.setState({selected: data});
    var searchText = $(React.findDOMNode(this.refs.searchbox)).find("input").val()
    history.pushState(null, null, "/search?q=" + searchText);
    history.pushState(null, null, "/service/" + data.id + "?q=" + searchText);
  },
  createService: function() {
    console.log('createService')
    console.log(this)
    this.props.onAddService();
  },
  render: function() {
    if (this.state.selected === -1) {
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
