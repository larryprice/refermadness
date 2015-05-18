var EditButton = React.createClass({
  startEdit: function() {
    if ($(".add-code-entry").hasClass("disabled")) {
      $(".add-code-entry").removeClass("disabled").select();
      $(".add-code-btn .glyphicon").addClass("fade-out");
      setTimeout(function() {
        $(".add-code-btn .glyphicon").removeClass("glyphicon-pencil fade-out").addClass("glyphicon-save fade-in");
      }, 500);
    }
  },
  clickButton: function() {
    if ($(".add-code-entry").hasClass("disabled")) {
      this.startEdit();
    } else {
      if ($(".add-code-entry").val() !== this.props.value) {
        console.log("submit new code");
        this.props.saved($(".add-code-entry").val());
      }
      $(".add-code-entry").addClass("disabled");
      $(".add-code-btn .glyphicon").addClass("spin infinite");
      setTimeout(function() {
        $(".add-code-btn .glyphicon").addClass("fade-out");
        setTimeout(function() {
          $(".add-code-btn .glyphicon").removeClass("glyphicon-save fade-out infinite").addClass("glyphicon-pencil fade-in");
        }, 500);
      }, 300); // simulate ajax
    }
  },
  render: function() {
    return (
      <div className="edit-referral-code">
        <div className="row">
          <div className="col-xs-12">
            <input type="text" className="add-code-entry form-control input-lg disabled"
                   placeholder="Enter your code..." defaultValue={this.props.value} onClick={this.startEdit} />
            <button className="btn btn-lg btn-default add-code-btn hide-me" onClick={this.clickButton}>
              <span className="glyphicon glyphicon-pencil" />
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 referral-code-views">
            <em>0 views since 14 May 2015</em>
          </div>
        </div>
      </div>
    );
  }
});

var AddButton = React.createClass({
  showSearchBox: function() {
    if ($(".add-code-entry").val() !== "") {
      $(".add-code-entry").addClass("disabled");
      $(".add-code-entry").prop("disabled", true);
      $(".add-code-btn .glyphicon-plus").addClass("spin");
      console.log("submit to server");
      var that = this;
      setTimeout(function() {
        $(".add-code-btn .glyphicon").addClass("fade-out");
        setTimeout(function() {
          $(".add-code-btn .glyphicon")
            .removeClass("fade-out spin glyphicon-plus")
            .addClass("glyphicon-pencil fade-in");
          $(".add-code-entry").prop("disabled", false);
          that.props.saved($(".add-code-entry").val());
        }, 500);
      }, 300);
    } else {
      $(".add-code-msg").toggleClass("hide-me");
      $(".add-code-entry").toggleClass("hide-me");
      $(".add-code-btn").toggleClass("hide-me");
      $(".add-code-entry").focus();
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

var ReferralCodeEntry = React.createClass({
  onSave: function(value) {
    this.setState({value: value});
  },
  getInitialState: function() {
    return {
      value: ""
    };
  },
  render: function() {
    if (this.state.value !== "") {
      return (
        <EditButton value={this.state.value} saved={this.onSave} />
      );
    } else {
      return (
        <AddButton saved={this.onSave} />
      );
    }
  }
});

var ReferralCodeActions = React.createClass({
  componentDidMount: function() {
    var zclip = new ZeroClipboard($(".btn-copy"));
    zclip.on('ready', function(event) {
      zclip.on('copy', function(event) {
        $(".btn-copy .glyphicon").addClass("spin");
      });
      zclip.on('afterCopy', function(event) {
        setTimeout(function () {
          $(".btn-copy .glyphicon").removeClass("spin");
        }, 1000);
      });
    });
  },
  render: function() {
    return (
      <div className="referral-code-actions">
        <button className="btn btn-default btn-xs btn-copy" data-clipboard-text={this.props.code}>
          <span className="glyphicon glyphicon-copy"></span>
          Clipboard
        </button>
        <button className="btn btn-default btn-xs">
          <span className="glyphicon glyphicon-random"></span>
          Shuffle
        </button>
        <button className="btn btn-default btn-xs">
          <span className="glyphicon glyphicon-flag"></span>
          Report
        </button>
      </div>
    )
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
              <a href={this.props.data.url} target="blank">{this.props.data.url}</a>
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
            <h1 className="referral-code">
              ywj-rpl
            </h1>
            <ReferralCodeActions code={"ywj-rpl"} />
          </div>
        </div>
        <ReferralCodeEntry />
      </div>
    );
  }
});