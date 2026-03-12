/**
 * Trigger a file download from a Blob or Blob response.
 *
 * @param {Blob} blob - The blob data to download
 * @param {string} filename - The suggested filename for the download
 */
export function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * Trigger a file download from an Axios response with blob responseType.
 *
 * @param {object} response - The Axios response object
 * @param {string} fallbackFilename - Fallback filename if Content-Disposition header is missing
 */
export function downloadFromResponse(response, fallbackFilename = 'download') {
  const contentDisposition = response.headers['content-disposition'];
  let filename = fallbackFilename;

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/['"]/g, '');
    }
  }

  const blob = new Blob([response.data], {
    type: response.headers['content-type'] || 'application/octet-stream',
  });

  downloadFile(blob, filename);
}
