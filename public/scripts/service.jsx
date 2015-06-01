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
  finishEdit: function() {
    $(".add-code-btn .glyphicon").addClass("fade-out");
    setTimeout(function() {
      $(".add-code-btn .glyphicon").removeClass("glyphicon-save fade-out infinite").addClass("glyphicon-pencil fade-in");
    }, 500);
  },
  clickButton: function() {
    if ($(".add-code-entry").hasClass("disabled")) {
      this.startEdit();
    } else {
      $(".add-code-entry").addClass("disabled");
      $(".add-code-btn .glyphicon").addClass("spin infinite");

      if ($(".add-code-entry").val() === this.props.code.Code) {
        this.finishEdit();
        return;
      }

      var that = this;
      $.ajax({
        url: "/codes",
        method: "POST",
        data: JSON.stringify({
          code: $(".add-code-entry").val(),
          serviceId: that.props.serviceId
        }),
        success: function(code) {
          that.props.saved(code)
          that.finishEdit();
        },
        error: function(xhr) {
          console.log("handle error", xhr);
        }
      });
    }
  },
  render: function() {
    return (
      <div className="edit-referral-code">
        <div className="row">
          <div className="col-xs-12">
            <input type="text" className="add-code-entry form-control input-lg disabled"
                   placeholder="Enter your code..." defaultValue={this.props.code.Code} onClick={this.startEdit} />
            <button className="btn btn-lg btn-default add-code-btn hide-me" onClick={this.clickButton}>
              <span className="glyphicon glyphicon-pencil" />
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 referral-code-views">
            <em>{this.props.code.Views} views since {new Date(this.props.code.DateUpdated).toDateString()}</em>
          </div>
        </div>
      </div>
    );
  }
});

var AddButton = React.createClass({
  showEditBox: function() {
    if ($("body").attr("data-logged-in") !== "true") {
      $("#authenticate-panel").collapse("show");
      $("#authenticate-panel")[0].scrollIntoView();
      return;
    }

    if ($(".add-code-entry").val() !== "") {
      $(".add-code-entry").addClass("disabled");
      $(".add-code-entry").prop("disabled", true);
      $(".add-code-btn .glyphicon-plus").addClass("spin");

      var that = this;
      $.ajax({
        url: "/codes",
        method: "POST",
        data: JSON.stringify({
          code: $(".add-code-entry").val(),
          serviceId: that.props.serviceId
        }),
        success: function(code) {
          $(".add-code-btn .glyphicon").addClass("fade-out");
          setTimeout(function() {
            $(".add-code-btn .glyphicon")
              .removeClass("fade-out spin glyphicon-plus")
              .addClass("glyphicon-pencil fade-in");
            $(".add-code-entry").prop("disabled", false);
            that.props.saved(code);
          }, 500);
        },
        error: function(xhr) {
          console.log("handle error", xhr);
        }
      });
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
          <button className="btn btn-lg btn-default add-code-btn" onClick={this.showEditBox}>
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
  onSave: function(code) {
    this.props.onUpdate(code);
    this.setState({code: code});
  },
  getInitialState: function() {
    return {
      code: this.props.code
    };
  },
  render: function() {
    if (this.state.code) {
      return (
        <EditButton code={this.state.code} saved={this.onSave} serviceId={this.props.serviceId} />
      );
    } else {
      return (
        <AddButton saved={this.onSave} serviceId={this.props.serviceId} />
      );
    }
  }
});

var ReportButton = React.createClass({
  report: function() {
    if ($(".report-code-text").hasClass("hidden")) {
      this.props.onReportCode(this.showDefaultButtons);
    } else {
      this.props.onStartReportCode();
      setTimeout(function() {
        $(".report-code-text").addClass("hidden");
        $(".report-code-ask").removeClass("hidden");
      }, 300);
    }
  },
  cancel: function() {
    this.props.onCancelReportCode();
    this.showDefaultButtons();
  },
  showDefaultButtons: function() {
    setTimeout(function() {
      $(".report-code-text").removeClass("hidden");
      $(".report-code-ask").addClass("hidden");
    }, 300);
  },
  render: function() {
    return (
      <div className="report-bad-code">
        <span className="report-code-ask hidden">Are you sure this code didn&apos;t work?</span>
        <button className="btn btn-default btn-xs report-code" onClick={this.report}>
          <span className="glyphicon glyphicon-flag"></span>
          <span className="report-code-text">Report</span>
          <span className="report-code-ask hidden">Yes</span>
        </button>
        <button className="btn btn-default btn-xs report-code-cancel report-code-ask hidden" onClick={this.cancel}>
          <span className="glyphicon glyphicon-ban-circle"></span>
          No
        </button>
      </div>
    );
  }
});

var ReferralCodeActions = React.createClass({
  getInitialState: function() {
    return {
      code: this.props.code
    };
  },
  componentDidMount: function() {
    var zclip = new ZeroClipboard($(".copy-code"));
    zclip.on('ready', function(event) {
      zclip.on('copy', function(event) {
        $(".copy-code .glyphicon").addClass("shake");
      });
      zclip.on('afterCopy', function(event) {
        setTimeout(function () {
          $(".copy-code .glyphicon").removeClass("shake");
        }, 400);
      });
    });
  },
  getNewCode: function(onComplete) {
    console.log("GET", "/api" + window.location.pathname + "/code");
    var that = this;
    setTimeout(function() {
      that.state.code = testData[0].codes[1];
      $(".copy-code").attr("data-clipboard-text", that.state.code.code);
      that.props.onNewCode(that.state.code);
      onComplete();
    });
  },
  shuffle: function() {
    $(".shuffle-code .glyphicon").addClass("spin fast infinite");
    var that = this;
    this.getNewCode(function() {
      $(".shuffle-code .glyphicon").removeClass("infinite");
    });
  },
  hideButtons: function() {
    $(".referral-code-actions").addClass("fade-out");
    setTimeout(function() {
      $(".copy-code, .shuffle-code").addClass("hidden");
      $(".referral-code-actions").removeClass("fade-out").addClass("fade-in");
    }, 500);
  },
  showButtons: function() {
    $(".referral-code-actions").addClass("fade-out");
    setTimeout(function() {
      $(".copy-code, .shuffle-code").removeClass("hidden");
      $(".referral-code-actions").removeClass("fade-out").addClass("fade-in");
    }, 500);
  },
  report: function(callback) {
    $(".report-code .glyphicon").addClass("spin fast infinite");
    console.log("PUT", "/api/code/" + this.state.code.id + "/report");

    var that = this;
    this.getNewCode(function() {
      $(".report-code .glyphicon").removeClass("infinite");
      callback();
      that.showButtons();
    });
  },
  render: function() {
    return (
      <div className="referral-code-actions">
        <button className="btn btn-default btn-xs copy-code" data-clipboard-text={this.state.code}>
          <span className="glyphicon glyphicon-copy"></span>
          Clipboard
        </button>
        <button className="btn btn-default btn-xs shuffle-code" onClick={this.shuffle}>
          <span className="glyphicon glyphicon-random"></span>
          Shuffle
        </button>
        <ReportButton onStartReportCode={this.hideButtons} onCancelReportCode={this.showButtons} onReportCode={this.report} />
      </div>
    )
  }
});

var ReferralCode = React.createClass({
  getInitialState: function() {
    return {
      code: this.props.code
    };
  },
  setCode: function(code) {
    this.state.code = code;
    $(".referral-code").addClass("fade-out");
    setTimeout(function() {
      $(".referral-code").text(code).removeClass("fade-out").addClass("fade-in");
    }, 300);
  },
  render: function() {
    if (this.state.code) {
      return (
        <div className="row random-referral-code">
          <div className="col-xs-12">
            <h3>
              Use this referral code:
            </h3>
            <h1 className="referral-code">
              {this.state.code.Code}
            </h1>
            <ReferralCodeActions code={this.state.code} onNewCode={this.setCode} />
          </div>
        </div>
      );
    } else {
      if (this.props.userHasCode) {
        return (
          <div className="row random-referral-code">
            <h3>Looks like no one has added any codes for this service (except you).</h3>
            <h3>Tell your firends, coworkers, or random strangers to add their codes!</h3>
          </div>
        )
      } else {
        return (
          <div className="row random-referral-code">
            <h3>Looks like no one has added any codes for this service.</h3>
            <h3>Be the first by clicking the button below.</h3>
          </div>
        )
      }
    }
  }
});

var ServicePage = React.createClass({
  getInitialState: function() {
    return {
      code: this.props.data.Code,
      name: this.props.data.Name,
      url: this.props.data.URL,
      description: this.props.data.Description,
      id: this.props.data.ID,
      userCode: this.props.data.UserCode
    };
  },
  onCodeUpdated: function(code) {
    if (!this.state.code) {
      this.setState({userCode: code});
    }
  },
  render: function() {
    return (
      <div className="service-area">
        <div className="view-result row">
          <div className="col-xs-12">
            <h1 className="text-center service-name">
              {this.state.name}
            </h1>
            <h2 className="text-center">
              <a href={this.state.url} target="blank">{this.state.url}</a>
            </h2>
            <h4 className="text-center">
              {this.state.description}
            </h4>
          </div>
        </div>
        <ReferralCode code={this.state.code}  userHasCode={this.state.userCode !== undefined} />
        <ReferralCodeEntry code={this.state.userCode} serviceId={this.state.id} onUpdate={this.onCodeUpdated} />
      </div>
    );
  }
});