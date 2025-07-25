import ProductsCard from './ProductsCard';
import { Field, Form, Formik } from 'formik';
import { MySelect, MyTextInput } from '../utils/formElements';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';

export default function ClerkStore({ store, setStore }) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<ProductsCard store={store} />
			<div className="card entries">
				<h1>Entries</h1>
				<div>
					{store?.entries
						?.sort((a) => (a.payment_status !== 'pending' ? 1 : -1))
						.map((entry) => {
							return (
								<div key={entry.id}>
									<p>Product: {store.products.find((product) => product.id === entry.product_id).name}</p>
									<p>Quantity: {entry.quantity}</p>
									<p>Status: {entry.payment_status}</p>
									<p>Total: {entry.total_sum}</p>
									<p>Date: {entry.created_at.split('T').join(', ').split('.')[0]}</p>
								</div>
							);
						})}
				</div>
				<div>
					<button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Close' : 'Add Entry'}</button>
                    {<div style={isOpen ? { display: 'block' } : { display: 'none' }} >
                            <Formik
                                initialValues={{ product_name: '', quantity: 1 }}
                                validationSchema={Yup.object({
                                    product_name: Yup.string().required('Required'),
                                    quantity: Yup.number().moreThan(0).required('Required'),
                                })}
                                onSubmit={(values, { setSubmitting }) => {
                                    const product = store?.products
                                        ?.find((product) => product.id === values.product_id);

                                    axios
                                        .post('/api/entries', {
                                            product_name: values.product_name,
                                            quantity: values.quantity,
                                            total_sum: values.quantity * product.buying_price,
                                            store_id: store.id,
                                        })
                                        .then(() => {
                                            setIsOpen(false);
                                            setStore(x => {
                                                return {
                                                    ...x,
                                                    entries: [
                                                        ...x.entries,
                                                        {
                                                            id: x.entries.length + 1,
                                                            product_name: values.product_name,
                                                            quantity: values.quantity,
                                                            total_sum: values.quantity * product.buying_price,
                                                            store_id: store.id,
                                                            product_id: product.id,
                                                            payment_status: 'pending',
                                                        },
                                                    ],
                                                }
                                            })
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                                    setSubmitting(false);
                                }}
                            >
                                {({ values }) => (
                                    <Form>
                                    <MySelect name="product_name" label="Product Name">
                                        {store.products.map((product) => {
                                            return (
                                                <option key={product.id} value={product.name}>
                                                    {product.name}
                                                </option>
                                            );
                                        })}
                                    </MySelect>
                                    <MyTextInput name="quantity" type="number" label="Quantity" />
                                    <div className='total_sum'>
                                        Total Sum: <span>{(()=>{
                                            const product = store?.products?.find((product) => product.name.toLowerCase() === values?.product_name.toLowerCase())
                                            return product ?  `$${+product?.buying_price * values?.quantity}` : 'N/A'
                                        })()}</span>
                                    </div>
                                    <button type="submit">Submit</button>
                                </Form>
                                )}
                            </Formik>
                        </div>
                    }
				</div>
			</div>
		</>
	);
}
