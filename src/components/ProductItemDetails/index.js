import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFetchedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getFetchedData(data)
      const updatedSimilarProductsData = data.similar_products.map(
        eachData => ({
          availability: eachData.availability,
          brand: eachData.brand,
          description: eachData.description,
          id: eachData.id,
          imageUrl: eachData.image_url,
          price: eachData.price,
          rating: eachData.rating,
          title: eachData.title,
          totalReviews: eachData.total_reviews,
        }),
      )
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" height={50} width={50} color="#0b99ff" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-img"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductDetailsView = () => {
    const {productData, quantity, similarProductsData} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData
    return (
      <div className="products-main-container">
        <div className="products-container">
          <img src={imageUrl} alt="products" className="product-img" />
          <div className="product-content">
            <h1>{title}</h1>
            <p>Rs {price}</p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </div>
              <p className="review-count">{totalReviews} reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="availability-container">
              <p className="text">Availability:</p>
              <p>{availability}</p>
            </div>
            <div className="availability-container">
              <p className="text">Brand:</p>
              <p>{brand}</p>
            </div>
            <hr />
            <div className="quantity-container">
              <button type="button" data-textid="minus" className="plus-button">
                <BsDashSquare className="quantity-controller-icon" />
              </button>
              <p>{quantity}</p>
              <button type="button" data-testid="plus" className="plus-button">
                <BsPlusSquare className="quantity-controller-icon" />
              </button>
            </div>
            <button className="add-cart-btn">ADD TO CART</button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <ul className="similar-products-list">
          {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
              productDetails={eachSimilarProduct}
              key={eachSimilarProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="products-container">{this.renderProductDetails()}</div>
      </>
    )
  }
}

export default ProductItemDetails
