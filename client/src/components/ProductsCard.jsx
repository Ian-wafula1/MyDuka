import { useState } from "react"

export default function ProductsCard({store}) {

    const [searchTerm, setSearchTerm] = useState('')
    return (
        <div className="card products">
            <h1>Products</h1>
            <div className="search">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
                <button>Search</button>
            </div>
            <div>
                {store?.products?.filter(product=>product.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => {
                    return (
                        <div key={product.id}>
                            <p>{product.name}</p>
                            <p>In stock: {product.quantity_in_stock}</p>
                            <p>Spoilt: {product.quantity_spoilt}</p>
                            <p>Buying Price: {product.buying_price}</p>
                            <p>Selling Price: {product.selling_price}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}