var UserReferralCodes = React.createClass({displayName: "UserReferralCodes",
  render: function() {
    return (
      React.createElement("div", {className: "user-referral-codes container"}
      )
    );
  }
});

var SwitchAccounts = React.createClass({displayName: "SwitchAccounts",
  getInitialState: function() {
    return {
      waitForConfirmation: false
    }
  },
  switchAccounts: function() {
    $(".switch-account-information").addClass("fade-out");
    var that = this;
    setTimeout(function() {
      that.setState({waitForConfirmation: true})
    }, 300);
  },
  componentDidUpdate: function() {
    setTimeout(function() {
      $(".switch-account-information").removeClass("fade-out");
    });
  },
  redirect: function() {
    window.location.href = "/account/switch";
  },
  cancel: function() {
    $(".switch-account-information").addClass("fade-out");
    var that = this;
    setTimeout(function() {
      that.setState({waitForConfirmation: false})
    }, 300);
  },
  render: function () {
    if (!this.state.waitForConfirmation) {
      return (
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-xs-12 text-center switch-account-information"}, 
            React.createElement("button", {className: "btn btn-default btn-lg switch-accounts", onClick: this.switchAccounts}, 
              React.createElement("span", {className: "glyphicon glyphicon-transfer"}), 
              "Use Different Google Identity"
            )
          )
        )
      );
    } else {
      return (
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-xs-12 text-center switch-account-information"}, 
            React.createElement("span", {className: "switch-account-confirmation"}, "Change which Google identity you use to authenticate?"), 
            React.createElement("button", {className: "btn btn-default btn-lg btn-google switch-accounts", onClick: this.redirect}, 
              React.createElement("span", {className: "glyphicon google-plus"}), 
              "Yup, take me to Google"
            ), 
            React.createElement("button", {className: "btn btn-default btn-lg switch-accounts-cancel", onClick: this.cancel}, 
              React.createElement("span", {className: "glyphicon glyphicon glyphicon-ban-circle"}), 
              "Nevermind"
            )
          )
        )
      );
    }
  }
});

var CancelAccountDeletion = React.createClass({displayName: "CancelAccountDeletion",
  render: function() {
    return (
      React.createElement("button", {className: "btn btn-default btn-lg cancel-account-deletion", onClick: this.props.onClick}, 
        React.createElement("span", {className: "glyphicon glyphicon glyphicon-ban-circle"}), 
        "Cancel"
      )
    );
  }
});

var VerifyAccountDeletionDesparation = React.createClass({displayName: "VerifyAccountDeletionDesparation",
  render: function() {
    return (
      React.createElement("div", {className: "desperate-delete-message collapse text-center"}, 
        React.createElement("h3", null, 
          "Wait! Don't go! I never got the chance to tell you, but... ", React.createElement("strong", null, "I love you!")
        ), 
        React.createElement("button", {className: "btn btn-danger btn-lg", onClick: this.props.onContinue}, 
          React.createElement("span", {className: "glyphicon glyphicon-heart-empty"}), 
          "Sorry, pal, but the feeling's not mutual"
        ), 
        React.createElement(CancelAccountDeletion, {onClick: this.props.onCancel})
      )
    );
  }
});

var VerifyAccountDeletionApology = React.createClass({displayName: "VerifyAccountDeletionApology",
  render: function() {
    return (
      React.createElement("div", {className: "apologetic-delete-message collapse text-center"}, 
        React.createElement("h4", null, 
          "...Er. Sorry about that. Overreaction on my part! ", React.createElement("em", null, "Please don't tell my supervisor.")
        ), 
        React.createElement("button", {className: "btn btn-danger btn-lg", onClick: this.props.onContinue}, 
          React.createElement("span", {className: "glyphicon glyphicon-thumbs-up"}), 
          "Sure, I can be discreet, let's get on with this"
        ), 
        React.createElement(CancelAccountDeletion, {onClick: this.props.onCancel})
      )
    );
  }
});

var VerifyAccountDeletionWarning = React.createClass({displayName: "VerifyAccountDeletionWarning",
  validate: function() {
    if ($(".delete-account-validation").val() === this.props.username) {
      $(".warning-delete-message .btn-danger").prop("disabled", false).removeClass("disabled");
    } else {
      $(".warning-delete-message .btn-danger").prop("disabled", true).addClass("disabled");
    }
  },
  componentDidMount: function() {
    this.validate();
  },
  render: function() {
    return (
      React.createElement("div", {className: "warning-delete-message collapse text-center"}, 
        React.createElement("h3", null, 
          React.createElement("strong", null, "Continuing will ", React.createElement("em", null, "permanantly delete"), " your account and remove your codes from the system.")
        ), 
        React.createElement("h3", null, 
          "If you really want to leave, please ", React.createElement("strong", null, "enter your Google username in the textbox below"), "."
        ), 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-sm-4 col-sm-offset-4 col-xs-12"}, 
            React.createElement("form", {onsubmit: "return false;"}, 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("input", {type: "text", className: "form-control input-lg delete-account-validation", 
                       onChange: this.validate, placeholder: "Enter your Google identity..."})
              )
            )
          )
        ), 
        React.createElement("button", {className: "btn btn-danger btn-lg", onClick: this.props.onContinue}, 
          React.createElement("span", {className: "glyphicon glyphicon-fire"}), 
          "Permanently Delete Account"
        ), 
        React.createElement(CancelAccountDeletion, {onClick: this.props.onCancel})
      )
    );
  }
});

var DeleteAccount = React.createClass({displayName: "DeleteAccount",
  initiate: function() {
    $(".delete-account").addClass("fade-out");
    $(".desperate-delete-message").collapse("show");
  },
  apologize: function() {
    $(".desperate-delete-message").collapse("hide");
    $(".apologetic-delete-message").collapse("show");
  },
  finalWarning: function() {
    $(".apologetic-delete-message").collapse("hide");
    $(".warning-delete-message").collapse("show");
  },
  confirmDelete: function() {
    console.log("send oauth delete request to google, delete account data in our database, clear session");
    $(".warning-delete-message .btn-danger .glyphicon").addClass("spin fast infinite");
    var that = this;
    setTimeout(function() {
      window.location.href = "/";
      $(".warning-delete-message .btn-danger .glyphicon").removeClass("spin fast infinite");
      that.rejectDelete();
      // alternatively, send the user to a survey page
    }, 300);
  },
  rejectDelete: function() {
    $(".desperate-delete-message, .apologetic-delete-message, .warning-delete-message").collapse("hide");
    $(".delete-account").removeClass("fade-out");
  },
  render: function () {
    return (
      React.createElement("div", {className: "row delete-account-section"}, 
        React.createElement("div", {className: "col-xs-12 text-center"}, 
          React.createElement("button", {className: "btn btn-danger btn-lg delete-account", onClick: this.initiate}, 
            React.createElement("span", {className: "glyphicon glyphicon-fire"}), 
            "Delete Refer Madness Account"
          )
        ), 
        React.createElement(VerifyAccountDeletionDesparation, {onContinue: this.apologize, onCancel: this.rejectDelete}), 
        React.createElement(VerifyAccountDeletionApology, {onContinue: this.finalWarning, onCancel: this.rejectDelete}), 
        React.createElement(VerifyAccountDeletionWarning, {onContinue: this.confirmDelete, onCancel: this.rejectDelete, username: this.props.username})
      )
    );
  }
});

var LoginSettings = React.createClass({displayName: "LoginSettings",
  getInitialState: function() {
    return {
      username: this.props.username
    }
  },
  render: function() {
    return (
      React.createElement("div", {className: "login-settings container"}, 
        React.createElement("h2", {className: "text-center"}, 
          "You are currently logged in as ", React.createElement("strong", null, this.state.username)
        ), 
        React.createElement(SwitchAccounts, null), 
        React.createElement(DeleteAccount, {username: this.state.username})
      )
    );
  }
});

var AccountPage = React.createClass({displayName: "AccountPage",
  render: function() {
    return (
      React.createElement("div", {className: "account-home"}, 
        React.createElement(Header, {smallTitle: true}), 
        React.createElement(LoginSettings, {username: "larry.price.dev"}), 
        React.createElement(UserReferralCodes, null)
      )
    );
  }
});

React.render(
  React.createElement(AccountPage, null),
  document.getElementById('content')
);