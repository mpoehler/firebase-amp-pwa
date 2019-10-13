export default class ProductModel {
  name: string = '';
  size: string = '';

  populateFromQuery(query: object): void {
    Object.keys(query).forEach(key => {
      
    });
  }
}
