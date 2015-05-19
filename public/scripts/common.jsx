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
  render: function() {
    return (
      <div className="col-xs-12 col-sm-2 text-center">
        <button className="login-btn btn btn-default" onclick="javascript:void(0)" data-toggle="collapse"
                data-target="#authenticate-panel" aria-expanded="false" aria-controls="authenticate-panel">
          <span className="glyphicon glyphicon-lock"></span>
          Sign Up or Log In
        </button>

        <div className="collapse" id="authenticate-panel">
          <div className="well">Hey there, Sailor</div>
        </div>
      </div>
    )
  }
})

var Header = React.createClass({
  render: function() {
    return (
      <div className="header">
        <div className="container-fluid">
          <div className="row ">
            <TitleArea smallTitle={this.props.smallTitle} />
            <LoginButton />
          </div>
      </div>
    </div>
    )
  }
});