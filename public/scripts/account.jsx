var UserReferralCodes = React.createClass({
  render: function() {
    return (
      <div className="user-referral-codes container">
      </div>
    );
  }
});

var LoginSettings = React.createClass({
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
      <div className="login-settings container">
        <h2 className="text-center">
          You are currently logged in as <strong>{this.state.username}</strong>
        </h2>
        <div className="row">
          <div className="col-xs-12 text-center">
            <button className="btn btn-default btn-lg switch-accounts">
            <span className="glyphicon glyphicon-transfer"></span>
              Use Different Account
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 text-center">
            <button className="btn btn-danger btn-lg delete-account">
              <span className="glyphicon glyphicon-fire"></span>
              Delete Refer Madness Account
            </button>
          </div>
        </div>
      </div>
    );
  }
});

var AccountPage = React.createClass({
  render: function() {
    return (
      <div className="account-home">
        <Header smallTitle={true} />
        <LoginSettings username={"larry.price.dev"} />
        <UserReferralCodes/>
      </div>
    );
  }
});

React.render(
  <AccountPage />,
  document.getElementById('content')
);