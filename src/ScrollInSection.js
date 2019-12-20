import React from 'react'

class ScrollInSection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: 20,
      loading: false,
    }
  }

  componentDidMount() {
    this.refs.myscroll.addEventListener("scroll", () => {
      if (
        // use scrollTop to get the scroll position (which is relative to the top of the window)
        // and then added it to the clientHeight (the height of the document)
        // if the sum if greater or equal to the height of the scrollbar, then the bottom of the div has been reached
        this.refs.myscroll.scrollTop + this.refs.myscroll.clientHeight >= 
        this.refs.myscroll.scrollHeight
      ) {
        this.loadMore()
      }
    })
  }

  loadMore() {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({ items: this.state.items + 20, loading: false })
    }, 2000)
  }

  showItems() {
    let items = []

    for (let i = 0; i < this.state.items; i++) {
      items.push(<li key={i}>Item {i}</li>)
    }

    return items
  }

  render() {
    return (
      <div>
        <div style={{ height: '100px'}}>
          Scrolling below section for more list.
        </div>

        <div
          className="scroll-container"
          ref="myscroll"
          style={{ height: "420px", overflow: "auto" }}
        >
          {/* <header className="scroll-header">
            <h1>Scroll header</h1>
          </header> */}
          <ul>
            {this.showItems()}
          </ul>
          {
            this.state.loading ?
              <p className="loading-indicatior">loading...</p>
            : ''
          }
        </div>
      </div>
    )
  }
}

export default ScrollInSection