import React, { Component, Fragment } from 'react';
import request from 'superagent'
import debounce from 'lodash.debounce'
import ScrollInSection from './ScrollInSection';

class ScrollInSection2 extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
      hasMore: true,
      isLoading: false,
      users: [],
    }
  }

  componentWillMount() {
    // Loads some users on initial load
    this.loadUsers()
  }

  componentDidMount() {
    this.refs.myscroll.addEventListener('scroll', debounce(() => {
        const {
          loadUsers,
          state: {
            error,
            isLoading,
            hasMore,
          },
        } = this;
  
        // Bails early if:
        // * there's an error
        // * it's already loading
        // * there's nothing left to load
        if (error || isLoading || !hasMore) return;
  
        if (
          // use scrollTop to get the scroll position (which is relative to the top of the window)
          // and then added it to the clientHeight (the height of the document)
          // if the sum if greater or equal to the height of the scrollbar, then the bottom of the div has been reached
          this.refs.myscroll.scrollTop + this.refs.myscroll.clientHeight >= 
          this.refs.myscroll.scrollHeight
        ) {
          loadUsers()
        }
      }, 100))
  }

  loadUsers = () => {
    this.setState({ isLoading: true }, () => {
      request
        .get('https://randomuser.me/api/?results=10')
        .then((results) => {
          // Creates a massaged array of user data
          const nextUsers = results.body.results.map(user => ({
            email: user.email,
            name: Object.values(user.name).join(' '),
            photo: user.picture.medium,
            username: user.login.username,
            uuid: user.login.uuid,
          }));

          // Merges the next users into our existing users
          this.setState({
            // Note: Depending on the API you're using, this value may
            // be returned as part of the payload to indicate that there
            // is no additional data to be loaded
            hasMore: (this.state.users.length < 100),
            isLoading: false,
            users: [
              ...this.state.users,
              ...nextUsers,
            ],
          });
        })
        .catch((err) => {
          this.setState({
            error: err.message,
            isLoading: false,
           });
        })
    });
  }

  render() {
    const {
      error,
      hasMore,
      isLoading,
      users,
    } = this.state;

    return (
      <div>
        <div style={{ marginBottom: '30px'}}>
          <h1>Header Section</h1>
        </div>

        <div 
          ref="myscroll"
          style={{ height: '700px', width: '700px', overflow: 'auto'}}
        >
          <h1>Infinite Users!</h1>
          <p>Scroll down to load more!!</p>
          {users.map(user => (
            <Fragment key={user.username}>
              <hr />
              <div style={{ display: 'flex' }}>
                <img
                  alt={user.username}
                  src={user.photo}
                  style={{
                    borderRadius: '50%',
                    height: 72,
                    marginRight: 20,
                    width: 72,
                  }}
                />
                <div>
                  <h2 style={{ marginTop: 0 }}>
                    @{user.username}
                  </h2>
                  <p>Name: {user.name}</p>
                  <p>Email: {user.email}</p>
                </div>
              </div>
            </Fragment>
          ))}
          <hr />
          {error &&
            <div style={{ color: '#900' }}>
              {error}
            </div>
          }
          {isLoading &&
            <div>Loading...</div>
          }
          {!hasMore &&
            <div>You did it! You reached the end!</div>
          }
        </div>
      </div>
    );
  }
}

export default ScrollInSection2