exports.priceNewProducts = (products) => {
    const newProducts = products.map((item) => {
      item.priceNew = (
        item.price * (100 - item.discountPercentage) / 100
      ).toFixed(0); // Làm tròn về số nguyên
  
      return item;
    });
  
    return newProducts;
  };
  