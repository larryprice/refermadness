var AccountPage = React.createClass({
  render: function() {
    return (
      <div className="account-home">
        <Header smallTitle={true} />
        <div>
          SETTINGS
        </div>
      </div>
    );
  }
});

React.render(
  <AccountPage />,
  document.getElementById('content')
);