var AddButton = React.createClass({
  showSearchBox: function() {
    if ($(".add-code-entry").val() !== "") {
      $(".add-code-entry").addClass("disabled");
      $(".add-code-entry").prop("disabled", true);
      $(".add-code-btn .glyphicon-plus").addClass("spin");
      console.log("submit to server");
      setTimeout(function() {
        $(".add-code-btn .glyphicon-plus").removeClass("spin");
      }, 3000)
    } else {
      $(".add-code-msg").toggleClass("hide-me");
      $(".add-code-entry").toggleClass("hide-me");
      $(".add-code-btn").toggleClass("hide-me");
    }
  },
  render: function() {
    return (
      <div className="row add-referral-code">
        <div className="col-xs-12">
          <input type="text" className="add-code-entry hide-me form-control input-lg" placeholder="Enter your code..." />
          <button className="btn btn-lg btn-default add-code-btn" onClick={this.showSearchBox}>
            <span className="glyphicon glyphicon-plus" />
            <div className="add-code-msg">
              Have your own code? Add it!
            </div>
          </button>
        </div>
      </div>
    );
  }
});

var ServicePage = React.createClass({
  render: function() {
    return (
      <div className="service-area">
        <div className="view-result row">
          <div className="col-xs-12">
            <h1 className="text-center service-name">
              {this.props.data.name}
            </h1>
            <h2 className="text-center">
              <a href={this.props.data.url}>{this.props.data.url}</a>
            </h2>
            <h4 className="text-center">
              A brief description of the service.
            </h4>
          </div>
        </div>
        <div className="row random-referral-code">
          <div className="col-xs-12">
            <h3>
              Use this referral code:
            </h3>
            <h1>
              ywj-rpl
            </h1>
          </div>
        </div>
        <AddButton />
      </div>
    );
  }
});