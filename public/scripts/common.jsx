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
        <SmallTitle />
      )
    } else {
      return (
        <Title />
      )
    }
  }
});

var Header = React.createClass({
  render: function() {
    return (
      <div className="header">
        <div className="container-fluid">
          <div className="row ">
            <div className="col-sm-offset-2 col-sm-8 col-xs-12">
              <TitleArea smallTitle={this.props.smallTitle} />
            </div>

            <div className="col-xs-12 col-sm-2 text-center">
              <button className="login-btn btn btn-default">Sign Up or Log In</button>
            </div>
          </div>
      </div>
    </div>
    )
  }
});