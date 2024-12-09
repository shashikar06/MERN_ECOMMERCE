
import { Row, Col } from 'react-bootstrap';


import Product from '../Components/Product';
import { useGetProductsQuery } from '../slices/productApiSlice';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
const HomeScreen = () => {
  const { data: products, isLoading, error} = useGetProductsQuery();
  


  console.log(products);
  return (
    <>
    {isLoading ? (
      <Loader />
    ) :error ? (<Message variant='danger'>{error?.data?.message}</Message>) : (
      <>
      <div>
          <h1>Latest Products</h1>
            <Row>
                {products.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
        </div>
      </>
    )}
    </>
   
  )
}

export default HomeScreen