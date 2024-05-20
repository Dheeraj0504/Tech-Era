import {Component} from 'react'
import Loader from 'react-loader-spinner'
import FailureView from '../FailureView'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CourseItemDetails extends Component {
  state = {
    courseDetails: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCourseDetails()
  }

  getCourseDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    // console.log(this.props)
    const {match} = this.props
    const {params} = match
    const {id} = params

    const courseDetailsUrl = `https://apis.ccbp.in/te/courses/${id}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(courseDetailsUrl, options)
    const fetchedData = await response.json()
    // console.log(fetchedData)
    // console.log(response)
    if (response.ok === true) {
      const data = fetchedData.course_details
      const courseDetailsUpdatedData = {
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        name: data.name,
      }

      this.setState({
        courseDetails: courseDetailsUpdatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="courses-details-loader">
      <Loader type="ThreeDots" color="#4656a1" height="50" width="50" />
    </div>
  )

  renderCourseDetails = () => {
    const {courseDetails} = this.state
    const {imageUrl, name, description} = courseDetails

    return (
      <div className="card-container">
        <img src={imageUrl} alt={name} className="course-image" />
        <div className="course-desc-container">
          <h1 className="course-details-heading">{name}</h1>
          <p className="course-details-description">{description}</p>
        </div>
      </div>
    )
  }

  onRetry = () => {
    this.getCourseDetails()
  }

  renderFaliureView = () => <FailureView retryBtn={this.onRetry} />

  renderPageDetailsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderCourseDetails()
      case apiStatusConstants.failure:
        return this.renderFaliureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="course-details-container">
        {this.renderPageDetailsView()}
      </div>
    )
  }
}
export default CourseItemDetails
