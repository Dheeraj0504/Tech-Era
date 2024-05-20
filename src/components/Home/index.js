import {Component} from 'react'
import Loader from 'react-loader-spinner'

import CourseItemCard from '../CourseItemCard'
import FailureView from '../FailureView'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    coursesList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCoursesList()
  }

  getCoursesList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/te/courses'
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    // console.log(data)
    // console.log(response)
    if (response.ok === true) {
      const updatedData = data.courses.map(eachCourse => ({
        id: eachCourse.id,
        name: eachCourse.name,
        logoUrl: eachCourse.logo_url,
      }))

      this.setState({
        coursesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="courses-loader">
      <Loader type="ThreeDots" color="#4656a1" height="50" width="50" />
    </div>
  )

  renderCoursesList = () => {
    const {coursesList} = this.state

    return (
      <div className="container">
        <h1 className="courses-heading">Courses</h1>
        <ul className="courses-list">
          {coursesList.map(eachCourse => (
            <CourseItemCard key={eachCourse.id} courseDetails={eachCourse} />
          ))}
        </ul>
      </div>
    )
  }

  onRetry = () => {
    this.getCoursesList()
  }

  renderFaliureView = () => <FailureView retryBtn={this.onRetry} />

  renderPageDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderCoursesList()
      case apiStatusConstants.failure:
        return this.renderFaliureView()
      default:
        return null
    }
  }

  render() {
    return <div className="Home-container">{this.renderPageDetails()}</div>
  }
}
export default Home
