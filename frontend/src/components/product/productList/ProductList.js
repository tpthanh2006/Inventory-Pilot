import ReactPaginate from 'react-paginate'
import {AiOutlineEye} from 'react-icons/ai'
import {FaEdit, FaTrashAlt} from 'react-icons/fa'
import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'

import './ProductList.scss'
import Search from '../../search/Search'
import { SpinnerImg } from '../../loader/Loader'
import { FILTER_PRODUCTS, selectFilteredProducts } from '../../../redux/features/product/filterSlice'

const ProductList = ({products, isLoading}) => {
  // Handle Search State
  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredProducts);
  const dispatch = useDispatch();

  // Shorten String
  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }

    return text;
  };

  // Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProducts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };

  // End Pagination
  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  return (
    <div className="product-list">
      <hr/>
      <div className='table'>
        <div className='--flex-between --flex-dir-column'>
          <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </span>
        </div>

        {isLoading && <SpinnerImg/>}
        <div className='table'>
          {!isLoading && products.length === 0 ? (
            <p>-- No product found, please add a product --</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {
                  currentItems.map((product, index) => {
                    const {_id, name, category, price, quantity} = product;
                    
                    return (
                      <tr key={_id}>
                        <td>{index + 1}</td>
                        <td>{shortenText(name, 16)}</td>
                        <td>{category}</td>
                        <td>{"$"}{price}</td>
                        <td>{quantity}</td>
                        <td>{"$"}{price * quantity}</td>

                        <td className='icons'>
                          <span>
                            <AiOutlineEye size={25} color={'purple'} />
                          </span>
                          <span>
                            <FaEdit size={25} color={'green'} />
                          </span>
                          <span>
                            <FaTrashAlt size={25} color={'red'} />
                          </span>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          )}
        </div>

        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>
    </div>
  )
}

export default ProductList