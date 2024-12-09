import { useEffect, useState } from "react"
import { Button, Form, FormControl, FormGroup } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import Message from "../Components/Message"
import Loader from "../Components/Loader"
import FormContainer from "../Components/FormContainer"
import { toast } from "react-toastify"
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from "../slices/productApiSlice"


const ProductEditScreen = () => {
    const {id:productId} = useParams();

    const[name,setName] = useState('');
    const[price,setPrice] = useState('');
    const[image,setImage] = useState('');
    const[brand,setBrand] = useState('');
    const[category,setCategory] = useState('');
    const[countInStock,setCountInStock] = useState('');
    const[description,setDescription] = useState('');

    const {data:product,isLoading,refetch,error} = useGetProductDetailsQuery(productId);

    const [updateProduct, { isLoading: loadingUpdate}] = useUpdateProductMutation();

    const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation();
    const navigate = useNavigate();

    useEffect(() => {
        if(product){
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description)

        }
    },[product])

    const submitHandler = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }

        const result = await updateProduct(updatedProduct);
        if(result.error) {
            toast.error(result.error)
        }else{
            toast.success('Product updated');
            navigate('/admin/productlist')
        }
    }   

    const uploadFilehandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
        const res = await uploadProductImage(formData).unwrap();
        toast.success(res.message);
        setImage(res.image);
        } catch (err) {
        toast.error(err?.data?.message || err.error);
        }
        
    }
  return (
    <>
        <Link to='/admin/productlist' className="btn btn-light my-3">
            Go Back
        </Link>
        <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader />}
            
            {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
             (
                <Form onSubmit={ submitHandler } encType="multipart/form-data">
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='price'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Enter Price'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <FormGroup controlId='image' className='my-2'>
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="text" placeholder="Enter Image" value={image} onChange={(e) => setImage}>

                        </Form.Control>
                        <Form.Control type="file" label='choosefile' onChange={ uploadFilehandler }>

                        </Form.Control>

                    </FormGroup>

                    <Form.Group controlId='brand'>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Brand'
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='name'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter category'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='countInStock'>
                        <Form.Label>countInStock</Form.Label>
                        <Form.Control
                            type='Number'
                            placeholder='Enter countInstock'
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='description'>
                        <Form.Label>description</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="primary" className="my-2">Update</Button>
                </Form>
            )}
        </FormContainer>
    </>
  )
}

export default ProductEditScreen