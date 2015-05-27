var UserReferralCodes = React.createClass({
  render: function() {
    return (
      <div className="user-referral-codes container">
      </div>
    );
  }
});

var SwitchAccounts = React.createClass({
  switchAccounts: function() {
    console.log("Warning about redirect with confirmation");
  },
  render: function () {
    return (
      <div className="row">
        <div className="col-xs-12 text-center">
          <span className="hidden">Oh, you want to change which Google identity you use to authenticate?</span>
          <button className="btn btn-default btn-lg switch-accounts" onClick={this.switchAccounts}>
            <span className="glyphicon glyphicon-transfer"></span>
            Use Different Google Identity
          </button>
          <button className="btn btn-default hidden">
            <span className="glyphicon glyphicon glyphicon-ban-circle"></span>
            Nope
          </button>
        </div>
      </div>
    );
  }
});

var CancelAccountDeletion = React.createClass({
  render: function() {
    return (
      <button className="btn btn-default btn-lg cancel-account-deletion" onClick={this.props.onClick}>
        <span className="glyphicon glyphicon glyphicon-ban-circle"></span>
        Cancel
      </button>
    );
  }
});

var VerifyAccountDeletionDesparation = React.createClass({
  render: function() {
    return (
      <div className="desperate-delete-message collapse text-center">
        <h3>
          Wait! Don&apos;t go! I never got the chance to tell you, but... <strong>I love you!</strong>
        </h3>
        <button className="btn btn-danger btn-lg" onClick={this.props.onContinue}>
          <span className="glyphicon glyphicon-heart-empty"></span>
          Sorry, pal, but the feeling&apos;s not mutual
        </button>
        <CancelAccountDeletion onClick={this.props.onCancel} />
      </div>
    );
  }
});

var VerifyAccountDeletionApology = React.createClass({
  render: function() {
    return (
      <div className="apologetic-delete-message collapse text-center">
        <h4>
          ...Er. Sorry about that. Overreaction on my part! <em>Please don&apos;t tell my supervisor.</em>
        </h4>
        <button className="btn btn-danger btn-lg" onClick={this.props.onContinue}>
          <span className="glyphicon glyphicon-thumbs-up"></span>
          Sure, I can be discreet, let&apos;s get on with this
        </button>
        <CancelAccountDeletion onClick={this.props.onCancel} />
      </div>
    );
  }
});

var VerifyAccountDeletionWarning = React.createClass({
  render: function() {
    return (
      <div className="warning-delete-message collapse text-center">
        <h3>
          <strong>Continuing will <em>permanantly delete</em> your account and remove your codes from the system.</strong>
        </h3>
        <h3>
          If you really want to leave, please <strong>enter your Google username in the textbox below</strong>.
        </h3>
        <button className="btn btn-danger btn-lg" onClick={this.props.onContinue}>
          <span className="glyphicon glyphicon-fire"></span>
          Delete
        </button>
        <CancelAccountDeletion onClick={this.props.onCancel} />
      </div>
    );
  }
});

var DeleteAccount = React.createClass({
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
    setTimeout(function() {
      window.location.href = "/";
      // alternatively, send the user to a survey page
    }, 300);
  },
  rejectDelete: function() {
    $(".desperate-delete-message, .apologetic-delete-message, .warning-delete-message").collapse("hide");
    $(".delete-account").removeClass("fade-out");
  },
  render: function () {
    return (
      <div className="row delete-account-section">
        <div className="col-xs-12 text-center">
          <button className="btn btn-danger btn-lg delete-account" onClick={this.initiate}>
            <span className="glyphicon glyphicon-fire"></span>
            Delete Refer Madness Account
          </button>
        </div>
        <VerifyAccountDeletionDesparation onContinue={this.apologize} onCancel={this.rejectDelete} />
        <VerifyAccountDeletionApology onContinue={this.finalWarning} onCancel={this.rejectDelete} />
        <VerifyAccountDeletionWarning onContinue={this.confirmDelete} onCancel={this.rejectDelete} />
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
  render: function() {
    return (
      <div className="login-settings container">
        <h2 className="text-center">
          You are currently logged in as <strong>{this.state.username}</strong>
        </h2>
        <SwitchAccounts />
        <DeleteAccount />
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