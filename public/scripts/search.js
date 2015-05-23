var testData = [
  {name: "Test #1", url: "https://test1.com", id: "1", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
  {name: "Test #2", url: "https://example.test2.com", id: "2", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
  {name: "Test #3", url: "https://3test.org", id: "3", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
  {name: "Test #4", url: "https://signup.4test.net/", id: "4", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]},
  {name: "Test #5", url: "http://testtesttesttesttest.me", id: "5", codes: [{id: "1", code: "ywj-rpl"}, {id: "2", code: "123-avv"}]}
];

var Result = React.createClass({displayName: "Result",
  viewFull: function() {
    this.props.onSelected(this.props.data);
  },
  render: function() {
    return (
      React.createElement("div", {className: "search-result col-md-3-point-5 col-sm-6 col-xs-12", onClick: this.viewFull}, 
        React.createElement("h2", null, 
          this.props.data.name
        ), 
        React.createElement("h4", null, 
          this.props.data.url
        ), 
        React.createElement("h5", null, 
          "Some short description here?"
        )
      )
    );
  }
});

var CreateResult = React.createClass({displayName: "CreateResult",
  create: function() {
    this.props.onSelected(this.props.data);
  },
  render: function() {
    return (
      React.createElement("div", {className: "search-result create-search-result col-md-3-point-5 col-sm-6 col-xs-12", onClick: this.create}, 
        React.createElement("h2", null, 
          React.createElement("span", {className: "glyphicon glyphicon-plus"}), 
          "Add New"
        ), 
        React.createElement("h4", null, 
          "Can't find it?"
        ), 
        React.createElement("h5", null, 
          "Define a new subscription service."
        )
      )
    );
  }
});

var SearchResults = React.createClass({displayName: "SearchResults",
  selectResult: function(data) {
    this.props.onResultSelected(data)
  },
  componentDidMount: function() {
    var standardHeight = Math.max.apply(null,
      $(".search-result").map(function(idx, el) {
        return $(el).height();
      }).get());
    $(".search-result").each(function() {
      $(this).height(standardHeight);
    });
  },
  render: function() {
    var that = this;
    var results = this.props.data.map(function (result) {
      return (
        React.createElement(Result, {key: result.id, data: result, onSelected: that.selectResult})
      );
    });

    return (
      React.createElement("div", {className: "search-results row"}, 
        results, 
        React.createElement(CreateResult, null)
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
    history.pushState(null, null, "/search?q=" + currentSearch);
  },
  render: function() {
    if (this.props.isReadonly !== true) {
      return (
        React.createElement("div", {className: "search-box"}, 
          React.createElement("input", {type: "text", onChange: this.onTextChange, className: "form-control input-lg", ref: "text", 
                 placeholder: "Give me a service name or URL!", value: this.props.initialSearch})
        )
      );
    } else {
      return (
          React.createElement("div", {className: "search-box"}, 
            React.createElement("input", {type: "text", onChange: this.onTextChange, onClick: this.edit, className: "form-control input-lg disabled", ref: "text", 
                   placeholder: "Give me a service name or URL!", value: this.props.initialSearch})
          )
        );
    }
  }
});

var SearchPage = React.createClass({displayName: "SearchPage",
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
    if (data.length > 0) {
      if (this.props.onNonEmptySearch) {
        this.props.onNonEmptySearch();
      }
    } else {
      if (this.props.onEmptySearch) {
        this.props.onEmptySearch();
      }
    }
    this.setState({data: data, selected: -1});
  },
  resultSelected: function(data) {
    this.setState({selected: data});
    var searchText = $(React.findDOMNode(this.refs.searchbox)).find("input").val()
    history.pushState(null, null, "/search?q=" + searchText);
    history.pushState(null, null, "/service/" + data.id + "?q=" + searchText);
  },
  render: function() {
    if (this.state.selected === -1) {
      return (
        React.createElement("div", {className: "search-area"}, 
          React.createElement(SearchBox, {onSearchTextChange: this.handleSearchTextChange, ref: "searchbox", initialSearch: this.state.initialSearch}), 
          React.createElement(SearchResults, {data: this.state.data, onResultSelected: this.resultSelected})
        )
      );
    } else {
      var searchText = this.state.initialSearch || this.getSearchParam() || this.state.selected.name
      return (
        React.createElement("div", {className: "search-area"}, 
          React.createElement(SearchBox, {onSearchTextChange: this.handleSearchTextChange, ref: "searchbox", initialSearch: this.state.initialSearch || this.state.selected.name, isReadonly: true}), 
          React.createElement(ServicePage, {data: this.state.selected})
        )
      )
    }
  }
});
