export default class ProductModel {
  name: string = '';
  size: string = '';

  populateFromQuery(query: any): void {
    if (Object.keys(query).includes("name")) {
      this.name = query.name;
    }
    if (Object.keys(query).includes("size")) {
      this.size = query.size;
    }
  }
}
