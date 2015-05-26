var AccountPage = React.createClass({displayName: "AccountPage",
  render: function() {
    return (
      React.createElement("div", {className: "account-home"}, 
        React.createElement(Header, {smallTitle: true}), 
        React.createElement("div", null, 
          "SETTINGS"
        )
      )
    );
  }
});

React.render(
  React.createElement(AccountPage, null),
  document.getElementById('content')
);