/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ProjectShowCase from './components/ProjectShowCase'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'

//  This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  fail: 'fail',
}

// Replace your code here
class App extends Component {
  state = {
    sel: 'ALL',
    data: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {sel} = this.state

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${sel}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.projects.map(i => ({
        id: i.id,
        name: i.name,
        imageUrl: i.image_url,
      }))
      this.setState({data: updateData, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.fail})
    }
  }

  one = event => {
    this.setState({sel: event.target.value}, this.getData)
  }

  loadingView = () => (
    <div className="load" data-testid="loader">
      <Loader type="ThreeDots" color="#000fff" height={50} width={50} />
    </div>
  )

  failureView = () => (
    <div className="fail-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="image"
        alt="failure view"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="button" type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  successView = () => {
    const {data} = this.state
    return (
      <div className="q-con">
        <ul className="app-con">
          {data.map(j => (
            <ProjectShowCase details={j} key={j.id} />
          ))}
        </ul>
      </div>
    )
  }

  finalRender = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.loadingView()
      case apiStatusConstants.success:
        return this.successView()
      case apiStatusConstants.fail:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {sel} = this.state
    return (
      <div>
        <nav className="nav-el">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png "
            className="web"
            alt="website logo"
          />
        </nav>
        <div className="main-container">
          <ul className="sel-container">
            <select className="sel" value={sel} onChange={this.one}>
              {categoriesList.map(each => (
                <option value={each.id} key={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.finalRender()}
        </div>
      </div>
    )
  }
}

export default App
