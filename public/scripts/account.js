var UserReferralCodes = React.createClass({displayName: "UserReferralCodes",
  render: function() {
    return (
      React.createElement("div", {className: "user-referral-codes container"}
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
  switchAccounts: function() {
    console.log("Warning about redirect with confirmation");
  },
  deleteAccount: function() {
    console.log("Warning about deletion with verification textbox");
  },
  render: function() {
    return (
      React.createElement("div", {className: "login-settings container"}, 
        React.createElement("h2", {className: "text-center"}, 
          "You are currently logged in as ", React.createElement("strong", null, this.state.username)
        ), 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-xs-12 text-center"}, 
            React.createElement("button", {className: "btn btn-default btn-lg switch-accounts"}, 
            React.createElement("span", {className: "glyphicon glyphicon-transfer"}), 
              "Use Different Account"
            )
          )
        ), 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-xs-12 text-center"}, 
            React.createElement("button", {className: "btn btn-danger btn-lg delete-account"}, 
              React.createElement("span", {className: "glyphicon glyphicon-fire"}), 
              "Delete Refer Madness Account"
            )
          )
        )
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