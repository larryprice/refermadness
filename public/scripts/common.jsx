var Title = React.createClass({
  render: function() {
    return (
      <div className="title text-center">
        <a href="/" alt="Return to home page.">
          Refer Madness
        </a>
      </div>
    )
  }
});

var SmallTitle = React.createClass({
  render: function() {
    return (
      <div className="shrink title text-center">
        <a href="/" alt="Return to home page.">
          Refer Madness
        </a>
      </div>
    )
  }
});

var TitleArea = React.createClass({
  render: function() {
    if (this.props.smallTitle) {
      return (
        <div className="col-sm-offset-2 col-sm-8 col-xs-12">
          <SmallTitle />
        </div>
      )
    } else {
      return (
        <div className="col-sm-offset-2 col-sm-8 col-xs-12">
          <Title />
        </div>
      )
    }
  }
});

var LoginButton = React.createClass({
  togglePanel: function() {
    if (window.location.pathname === "/") {
      $(".title").toggleClass("shrink fast");
    }
    $("#authenticate-panel").collapse('toggle');
  },
  render: function() {
    return (
      <div className="col-xs-12 col-sm-2 text-center">
        <button className="login-btn btn btn-default" data-toggle="collapse" onClick={this.togglePanel}
                aria-expanded="false" aria-controls="authenticate-panel">
          <span className="glyphicon glyphicon-lock"></span>
          Sign Up or Log In
        </button>
      </div>
    )
  }
});

var AccountButton = React.createClass({
  render: function() {
    return (
      <a className="btn btn-default account-btn" href="/account">
        <span className="glyphicon glyphicon-user"></span>
        Account
      </a>
    );
  }
});

var LogoutButton = React.createClass({
  logout: function() {
    window.location.href = "/logout";
  },
  render: function() {
    return (
      <button className="btn btn-default logout-btn" onClick={this.logout}>
        <span className="glyphicon glyphicon-off"></span>
        Log out
      </button>
    );
  }
});

var AuthenticatePanel = React.createClass({
  toggleFAQ: function() {
    $("#login-faq").collapse("toggle");
  },
  authenticate: function() {
    window.location.href = "/login?returnURL=" + encodeURIComponent(window.location.pathname + window.location.search);
  },
  render: function() {
    return (
      <div className="row collapse" id="authenticate-panel">
        <div className="col-xs-12 text-center">
          <h2><strong>Let&apos;s get you authenticated.</strong><span className="glyphicon glyphicon-question-sign" onClick={this.toggleFAQ}></span></h2>
          <div id="login-faq" className="container collapse">
            <div className="login-faq-question"><strong>Why should I?</strong></div>
            <div className="login-faq-answer">Authentication helps prevent malicious users from submitting bad or duplicate referral codes and prevents robots from taking over the site.</div>
            <div className="login-faq-question"><strong>Why Google?</strong></div>
            <div className="login-faq-answer">Google has a respectable history of protecting user passwords. Authenticating with Google means that Refer Madness will never see your password. It also means one less password for you to remember (and, eventually, forget).</div>
            <div className="login-faq-question"><strong>Where&apos;s the legal information?</strong></div>
            <div className="login-faq-answer">You can view the privacy policy and terms of service on <a href="/legal">the legal page</a>.</div>
          </div>
          <button className="btn btn-default btn-lg btn-google" onClick={this.authenticate}>
            <span className="glyphicon google-plus"></span>
            Sign in with Google
          </button>
          <h5>By signing in using the link above, you agree to the <a href="/legal">Terms and Conditions</a>.</h5>
        </div>
      </div>
    );
  }
});

var Header = React.createClass({
  getInitialState: function() {
    return {
      loggedIn: $("body").attr("data-logged-in") === "true"
    }
  },
  render: function() {
    if (this.state.loggedIn) {
      return (
        <div className="header">
          <div className="container-fluid">
            <div className="row">
              <TitleArea smallTitle={this.props.smallTitle} />
              <div className="text-center">
                <AccountButton />
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="header">
          <div className="container-fluid">
            <div className="row">
              <TitleArea smallTitle={this.props.smallTitle} />
              <LoginButton />
            </div>
            <AuthenticatePanel />
          </div>
        </div>
      )
    }
  }
});