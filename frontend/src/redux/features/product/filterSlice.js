import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  filteredProducts: []
}

const filterProductSlice = createSlice({
  name: "filterProduct",
  initialState,
  reducers: {
    FILTER_PRODUCTS(state, action) {
      const { products, search } = action.payload;

      const tempProducts = products?.filter((product) => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
      );

      state.filteredProducts = tempProducts;
    },
  },
});

export const {FILTER_PRODUCTS} = filterProductSlice.actions

export const selectFilteredProducts = (state) => state.filterProduct.filteredProducts

export default filterProductSlice.reducer