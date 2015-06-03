var EditButton = React.createClass({displayName: "EditButton",
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
      React.createElement("div", {className: "edit-referral-code"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-xs-12"}, 
            React.createElement("input", {type: "text", className: "add-code-entry form-control input-lg disabled", 
                   placeholder: "Enter your code...", defaultValue: this.props.code.Code, onClick: this.startEdit}), 
            React.createElement("button", {className: "btn btn-lg btn-default add-code-btn hide-me", onClick: this.clickButton}, 
              React.createElement("span", {className: "glyphicon glyphicon-pencil"})
            )
          )
        ), 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-xs-12 referral-code-views"}, 
            React.createElement("em", null, this.props.code.Views, " people have viewed your code since ", new Date(this.props.code.DateUpdated).toDateString())
          )
        )
      )
    );
  }
});

var AddButton = React.createClass({displayName: "AddButton",
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
      React.createElement("div", {className: "row add-referral-code"}, 
        React.createElement("div", {className: "col-xs-12"}, 
          React.createElement("input", {type: "text", className: "add-code-entry hide-me form-control input-lg", placeholder: "Enter your code..."}), 
          React.createElement("button", {className: "btn btn-lg btn-default add-code-btn", onClick: this.showEditBox}, 
            React.createElement("span", {className: "glyphicon glyphicon-plus"}), 
            React.createElement("div", {className: "add-code-msg"}, 
              "Have your own code? Add it!"
            )
          )
        )
      )
    );
  }
});

var ReferralCodeEntry = React.createClass({displayName: "ReferralCodeEntry",
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
    if (this.state.code && this.state.code.ID !== "") {
      return (
        React.createElement(EditButton, {code: this.state.code, saved: this.onSave, serviceId: this.props.serviceId})
      );
    } else {
      return (
        React.createElement(AddButton, {saved: this.onSave, serviceId: this.props.serviceId})
      );
    }
  }
});

var ReportButton = React.createClass({displayName: "ReportButton",
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
      React.createElement("div", {className: "report-bad-code"}, 
        React.createElement("span", {className: "report-code-ask hidden"}, "Are you sure this code didn't work?"), 
        React.createElement("button", {className: "btn btn-default btn-xs report-code", onClick: this.report}, 
          React.createElement("span", {className: "glyphicon glyphicon-flag"}), 
          React.createElement("span", {className: "report-code-text"}, "Report"), 
          React.createElement("span", {className: "report-code-ask hidden"}, "Yes")
        ), 
        React.createElement("button", {className: "btn btn-default btn-xs report-code-cancel report-code-ask hidden", onClick: this.cancel}, 
          React.createElement("span", {className: "glyphicon glyphicon-ban-circle"}), 
          "No"
        )
      )
    );
  }
});

var ReferralCodeActions = React.createClass({displayName: "ReferralCodeActions",
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
  shuffle: function() {
    $(".shuffle-code .glyphicon").addClass("spin fast infinite");
    var that = this;
    $.ajax({
      url: "/codes/random?sid=" + that.state.code.ServiceID,
      method: "GET",
      contentType: "application/json",
      success: function(code) {
        $(".copy-code").attr("data-clipboard-text", that.state.code.Code);
        $(".shuffle-code .glyphicon").removeClass("infinite");

        that.props.onNewCode(code);
        that.setState({code: code});
      },
      error: function(xhr) {
        console.log("error getting new code", xhr);
      }
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

    var that = this;
    $.ajax({
      url: "/codes/" + that.state.code.ID + "/report",
      success: function(code) {
        $(".copy-code").attr("data-clipboard-text", that.state.code.Code);

        $(".report-code .glyphicon").removeClass("infinite");
        callback();
        that.showButtons();

        that.props.onNewCode(code);
        that.setState({code: code});
      },
      error: function(xhr) {
        console.log("error getting new code", xhr);
      }
    });
  },
  render: function() {
    return (
      React.createElement("div", {className: "referral-code-actions"}, 
        React.createElement("button", {className: "btn btn-default btn-xs copy-code", "data-clipboard-text": this.state.code.Code}, 
          React.createElement("span", {className: "glyphicon glyphicon-copy"}), 
          "Clipboard"
        ), 
        React.createElement("button", {className: "btn btn-default btn-xs shuffle-code", onClick: this.shuffle}, 
          React.createElement("span", {className: "glyphicon glyphicon-random"}), 
          "Shuffle"
        ), 
        React.createElement(ReportButton, {onStartReportCode: this.hideButtons, onCancelReportCode: this.showButtons, onReportCode: this.report})
      )
    )
  }
});

var ReferralCode = React.createClass({displayName: "ReferralCode",
  getInitialState: function() {
    return {
      code: this.props.code
    };
  },
  setCode: function(code) {
    this.state.code = code;
    $(".referral-code").addClass("fade-out");
    setTimeout(function() {
      $(".referral-code").text(code.Code).removeClass("fade-out").addClass("fade-in");
    }, 300);
  },
  render: function() {
    if (this.state.code) {
      return (
        React.createElement("div", {className: "row random-referral-code"}, 
          React.createElement("div", {className: "col-xs-12"}, 
            React.createElement("h3", null, 
              "Use this referral code:"
            ), 
            React.createElement("h1", {className: "referral-code"}, 
              this.state.code.Code
            ), 
            React.createElement(ReferralCodeActions, {code: this.state.code, onNewCode: this.setCode})
          )
        )
      );
    } else {
      if (this.props.userHasCode) {
        return (
          React.createElement("div", {className: "row random-referral-code"}, 
            React.createElement("h3", null, "Looks like no one has added any codes for this service (except you)."), 
            React.createElement("h3", null, "Tell your firends, coworkers, or random strangers to add their codes!")
          )
        )
      } else {
        return (
          React.createElement("div", {className: "row random-referral-code"}, 
            React.createElement("h3", null, "Looks like no one has added any codes for this service."), 
            React.createElement("h3", null, "Be the first by clicking the button below.")
          )
        )
      }
    }
  }
});

var ServicePage = React.createClass({displayName: "ServicePage",
  getInitialState: function() {
    return {
      code: this.props.data.RandomCode,
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
      React.createElement("div", {className: "service-area"}, 
        React.createElement("div", {className: "view-result row"}, 
          React.createElement("div", {className: "col-xs-12"}, 
            React.createElement("h1", {className: "text-center service-name"}, 
              this.state.name
            ), 
            React.createElement("h2", {className: "text-center"}, 
              React.createElement("a", {href: this.state.url, target: "blank"}, this.state.url)
            ), 
            React.createElement("h4", {className: "text-center"}, 
              this.state.description
            )
          )
        ), 
        React.createElement(ReferralCode, {code: this.state.code, userHasCode: this.state.userCode && this.state.userCode.ID !== ""}), 
        React.createElement(ReferralCodeEntry, {code: this.state.userCode, serviceId: this.state.id, onUpdate: this.onCodeUpdated})
      )
    );
  }
});