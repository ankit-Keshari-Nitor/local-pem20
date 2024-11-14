const parseContentRange = (contentRangeHeader) => {
  if (contentRangeHeader) {
    const regex = /items (\d+)-(\d+)\/(\d+)/;
    const match = contentRangeHeader.match(regex);

    if (match) {
      const start = parseInt(match[1], 10);
      const end = parseInt(match[2], 10);
      const totalItems = parseInt(match[3], 10);
      const pageSize = end - start + 1;
      const pageNumber = Math.floor(start / pageSize) + 1;

      return { start, end, totalItems, pageSize, pageNumber };
    }
  }

  return {};
};

class ListAPIHandler {
  static handleResponse(response, itemKey) {
    if (response.status === 200) {
      const contentRange = response.headers['content-range'];
      const paginationData = parseContentRange(contentRange);
      response.data.forEach((item) => {
        item.id = item[itemKey];
      });
      response.data = {
        data: response.data,
        meta: {
          ...paginationData
        }
      };
    }
  }
  static handleRequest(input, options) { }
}

class ListAPIHandlerNew {
  static handleResponse(response, itemKey) {
    if (response.status === 200) {
      const paginationData = {
        totalItems: response.data?.pageContent?.totalElements || response.data?.page?.totalElements,
        pageSize: response.data?.pageContent?.size || response.data?.page?.size,
        pageNumber: response.data?.pageContent ? response.data?.pageContent?.number + 1 : response.data?.page?.number
      };
      response.data.content !== null && response.data.content.forEach((item) => {
        item.id = item[itemKey];
      });
      response.data = {
        data: response.data.content || [],
        meta: {
          ...paginationData
        }
      };
    }
  }
  static handleRequest(input, options) {

  }
}

export default ListAPIHandler;

export { ListAPIHandler, ListAPIHandlerNew };
