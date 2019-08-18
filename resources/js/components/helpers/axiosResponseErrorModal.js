import Modal from "antd/lib/modal";

/**
 * @param response
 */
export default function (response) {
  response = response.response.data;
  if (response.status === 'error') {
    Modal.error({
      title: 'Error',
      content: response.message,
    });
  } else {
    Modal.error({
      title: 'Error',
      content: 'Unknown server error occured. Don\'t worry, we\'re already working on it.',
    });
  }
}