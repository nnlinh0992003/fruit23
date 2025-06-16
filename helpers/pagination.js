module.exports = (pagination,query,countProducts) =>{
    if(query.page) {
        pagination.currentPage = parseInt(query.page);
      }
    
      pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;

      console.log(pagination.skip);
    
      const totalPage = Math.ceil(countProducts/pagination.limitItems);
      pagination.totalPage = totalPage;

    return pagination;
}
