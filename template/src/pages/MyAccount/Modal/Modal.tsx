import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './Modal.css';
import { handleLogout } from '../../../utils/logout';
import { formatNumber, formatNumberAcceptNull } from '../../../utils/formatNumber';
import { numberToVietnameseText } from '../../../utils/numberToVietnameseText';
import { Image } from '../../../models/Image';
import { formatDateString } from '../../../utils/formatDateString';
// *** MODAL FOR USER
export const ViewTransactionModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="dark" size="sm" onClick={handleShow}>
        Xem
      </Button>
      {show && (
        <div className='overlay' >
          <Modal
            show={show}
            onHide={handleClose}
            centered
            backdropClassName="custom-backdrop"
            size="lg"
          >
            <Modal.Header >
              <Modal.Title>Thông tin chi tiết phiên giao dịch </Modal.Title>
            </Modal.Header>
            <Modal.Body>...</Modal.Body>
            <Modal.Footer>
              <Button variant="dark" onClick={handleClose}>
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

    </>
  );
}

export const ViewJewelryRequestModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="dark" size="sm" onClick={handleShow}>
        Xem
      </Button>
      {show && (
        <div className='overlay' >
          <Modal
            show={show}
            onHide={handleClose}
            centered
            backdropClassName="custom-backdrop"
            size="lg"
          >
            <Modal.Header >
              <Modal.Title>Thông tin sản phẩm yêu cầu </Modal.Title>
            </Modal.Header>
            <Modal.Body>...</Modal.Body>
            <Modal.Footer>
              <Button variant="dark" onClick={handleClose}>
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

    </>
  );
};

// *** MODAL FOR STAFF ***
// Modal for Jewelry List
export const JewelryModal = ({ jewelry, images }) => {
  const [show, setShow] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCloseJewelryDetail = () => setShow(false);
  const handleShowJewelryDetail = () => setShow(true);

  const handleShowCreateModal = () => {
    setShow(false); // Close the JewelryModal
    setShowCreateModal(true); // Open the JewelryCreateRequestModal
  };
  const handleCloseCreateModal = () => setShowCreateModal(false);
  return (
    <>
      <Button variant="dark" size="sm" onClick={handleShowJewelryDetail}>
        View
      </Button>
      {show && (
        <div className='overlay' >
          <Modal
            show={show}
            onHide={handleCloseJewelryDetail}
            centered
            backdrop="static"
            size="lg"
          >
            <Modal.Header>
              <Modal.Title>

                Thông tin trang sức - MS:<span className=' fw-bold'>{jewelry.id}</span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form action="javascript:void(0)">
                <div className="checkbox-form">
                  <div className="row">
                    <div className="col-md-12 ">
                      <div className="country-select clearfix">
                      </div>
                    </div>
                    <div className="col-md-6 fw-medium">
                      <div className="checkout-form-list">
                        <label>
                          Tên trang sức{" "}
                        </label>
                        <input
                          placeholder=""
                          type="text"
                          value={jewelry.name}
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 fw-medium">
                      <div className="checkout-form-list">
                        <label>
                          Danh mục
                        </label>
                        <input
                          placeholder=""
                          type="text"
                          value={jewelry.category.name}
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 fw-medium">
                      <div className="checkout-form-list">
                        <label>
                          Chất liệu
                        </label>
                        <input
                          placeholder=""
                          type="text"
                          value={jewelry.material}
                          readOnly={true}
                        />
                      </div>
                    </div>

                    <div className="col-md-4 fw-medium">
                      <div className="checkout-form-list">
                        <label>
                          Thương hiệu
                        </label>
                        <input
                          placeholder="Street address"
                          type="text"
                          value={jewelry.brand}
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 fw-medium">
                      <div className="checkout-form-list">
                        <label>
                          Cân nặng (g)
                        </label>
                        <input
                          placeholder="Street address"
                          type="text"
                          value={jewelry.weight}
                          readOnly={true}
                        />
                      </div>


                    </div>
                    <div className="order-notes fw-medium">
                      <div className="checkout-form-list checkout-form-list-2">
                        <label>Mô tả sản phẩm </label>
                        <textarea
                          id="checkout-mess"
                          value={jewelry.description}
                        ></textarea>
                      </div>
                    </div>
                    <div className="order-notes col-md-12 fw-medium">
                      <div className="checkout-form-list checkout-form-list-2 row">
                        <label>Hình ảnh sản phẩm </label>
                        {React.Children.toArray(images.map(
                          (img: Image) =>
                            <div className='col-md-3'>
                              <img src={img.data} alt="Ảnh sản phẩm" />
                            </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label className='text-danger fw-bold'>Giá đề xuất</label>
                        <input className=' fw-bold'
                          placeholder=""
                          type="text"
                          value={formatNumber(jewelry.price)}
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label className='text-success fw-bold'>Định giá</label>
                        <input
                          className=' fw-bold'
                          placeholder=""
                          type="text"
                          value={formatNumber(jewelry.price)}
                        />
                      </div>
                    </div>



                  </div>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="dark" onClick={handleCloseJewelryDetail}>
                Đóng
              </Button >
              <Button variant="warning" onClick={handleShowCreateModal}>
                Tạo yêu cầu
              </Button>

            </Modal.Footer>
          </Modal>
        </div >
      )}

      <JewelryCreateRequestModal show={showCreateModal} handleClose={handleCloseCreateModal} />
    </>
  );
};

interface JewelryCreateRequestModalProps {
  show: boolean;
  handleClose: () => void;
}


export const JewelryCreateRequestModal: React.FC<JewelryCreateRequestModalProps> = ({ show, handleClose }) => {
  return (
    <>{show && (
      <div className='overlay' >
        <Modal
          show={show}
          onHide={handleClose}
          centered
          backdrop="static"
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Tạo yêu cầu cho trang sức</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ...
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={handleClose}>
              Đóng
            </Button>
            <Button variant="warning" onClick={handleClose}>
              Gửi yêu cầu
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )}

    </>
  );
};

// Delete Jewelry Modal
export const DeleteJewelryModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="danger" size="sm" onClick={handleShow} className='ms-2'>
        xóa
      </Button>
      {show && (
        <div className='overlay'>
          <Modal
            show={show}
            onHide={handleClose}
            centered
            backdropClassName="custom-backdrop"
          >
            <Modal.Header >
              <Modal.Title>Xác nhận xóa sản phẩm </Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc muốn xóa sản phẩm này khỏi danh sách chờ không?</Modal.Body>
            <Modal.Footer>
              <Button variant="dark" onClick={handleClose}>
                Hủy
              </Button>
              <Button variant="danger" onClick={handleClose}>
                Xóa
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

    </>
  );
};

interface BidConfirmProps {
  bidValue: number;
}

// Modal for Jewelry HandOver
export const BidConfirm: React.FC<BidConfirmProps> = ({ bidValue }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <button
        className="fw-bold text-center eg-btn btn--primary text-white btn--sm"
        style={{
          backgroundColor: "#B41712",
          textTransform: "unset",
          border: "unset",
          borderRadius: "5px",
          padding: "10px 10px",
          fontSize: "16px"
        }}
        onClick={handleShow}
      >
        <i className="fa fa-gavel" style={{ marginRight: "7px" }}></i>Trả giá
      </button>
      {show && (
        <div className='overlay' >
          <Modal
            show={show}
            onHide={handleClose}
            centered
            backdropClassName="custom-backdrop"
          >
            <Modal.Body>
              <div className="swal2-icon swal2-warning swal2-icon-show" style={{ display: "flex" }}>
                <div className="swal2-icon-content">?</div>
              </div>
              <h2 className="swal2-title" id="swal2-title" style={{ display: "flex", justifyContent: "center" }}>Trả giá trang sức với: {formatNumber(bidValue)} VNĐ.</h2>
              <h5 id="swal2-title" style={{ display: "flex", justifyContent: "center" }}>Giá của bạn: {numberToVietnameseText(bidValue)}.</h5>
            </Modal.Body>
            <Modal.Footer>
              <Button style={{ color: "white", border: "none", backgroundColor: "#767678" }} onClick={handleClose}>
                Hủy
              </Button>
              <Button className='bg-primary text-white' onClick={handleClose}>
                Xác nhận
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

    </>
  );
};

// Modal for Jewelry HandOver
export const AssignAuctionModal = ({ auction }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="dark" size="sm" onClick={handleShow}>
        Xem
      </Button>
      {show && (
        <div className='overlay' >
          <Modal
            show={show}
            onHide={handleClose}
            centered
            backdropClassName="custom-backdrop"
            size="lg"
          >
            <Modal.Header >
              <Modal.Title>Xem chi tiết phiên đấu giá - MS:<span className='fw-bold'>{auction.id}</span> </Modal.Title>
            </Modal.Header>
            <Modal.Body> <form action="javascript:void(0)">
              <div className="checkbox-form">
                <div className="row">
                  <div className="col-md-12">
                    <div className="country-select clearfix">
                    </div>
                  </div>
                  <div className="col-md-9 fw-medium">
                    <div className="checkout-form-list">
                      <label>
                        Phiên đấu giá
                      </label>
                      <input
                        placeholder=""
                        type="text"
                        value={auction.name}
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 fw-medium">
                    <div className="checkout-form-list">
                      <label>
                        Phí tham gia (VNĐ)
                      </label>
                      <input
                        placeholder=""
                        type="text"
                        value={formatNumber(auction.participationFee)}
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 fw-medium">
                    <div className="checkout-form-list">
                      <label>
                        Thời gian bắt đầu
                      </label>
                      <input
                        placeholder=""
                        type="text"
                        value={formatDateString(auction.startDate)}
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 fw-medium">
                    <div className="checkout-form-list">
                      <label>
                        Thời gian kết thúc
                      </label>
                      <input
                        placeholder=""
                        type="text"
                        value={formatDateString(auction.endDate)}
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 fw-medium">
                    <div className="checkout-form-list">
                      <label>
                        Giá khởi điểm (VNĐ)
                      </label>
                      <input
                        placeholder=""
                        type="text"
                        value={formatNumber(auction.firstPrice)}
                        readOnly={true}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 fw-medium">
                    <div className="checkout-form-list">
                      <label>
                        Tiền đặt trước (VNĐ)
                      </label>
                      <input
                        placeholder="Street address"
                        type="text"
                        value={formatNumber(auction.deposit)}
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 fw-medium">
                    <div className="checkout-form-list">
                      <label>
                        Bước giá (VNĐ)
                      </label>
                      <input
                        placeholder="Street address"
                        type="text"
                        value={formatNumber(auction.priceStep)}
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="order-notes col-md-12 fw-medium">
                    <div className="checkout-form-list checkout-form-list-2">
                      <label>Mô tả </label>
                      <textarea
                        id="checkout-mess"
                        value={auction.description}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-md-6 fw-medium text-danger">
                    <div className="checkout-form-list">
                      <label>
                        Giá cuối (VNĐ)
                      </label>
                      <input className='fw-bold'
                        placeholder="Chưa cập nhật"
                        type="text"
                        value={auction?.lastPrice !== undefined ? formatNumberAcceptNull(auction.lastPrice) : ''}
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 fw-semibold text-success">
                    <div className="checkout-form-list">
                      <label>
                        Trạng thái
                      </label>
                      <input className='fw-bold'
                        placeholder="Street address"
                        type="text"
                        value={auction.state}
                        readOnly={true}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </form></Modal.Body>
            <Modal.Footer>
              <Button variant="dark" onClick={handleClose}>
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

    </>
  );
};

// Modal Logout
export const LogoutModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <span
        // className="nav-link"
        id="account-details-tab"
        data-bs-toggle="tab"
        style={{ cursor: "pointer" }}
        role="tab"
        aria-controls="account-details"
        aria-selected="false"
        onClick={handleShow}
      > ĐĂNG XUẤT
      </span>
      {show && (
        <div className='overlay' >
          <Modal
            show={show}
            centered
            onHide={handleClose}
            backdropClassName="custom-backdrop"
          >
            <Modal.Header >
              <Modal.Title>Xác nhận đăng xuất </Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc muốn đăng xuất khỏi tài khoản ngay bây giờ?</Modal.Body>
            <Modal.Footer>
              <Button variant="dark" onClick={handleClose}>
                Hủy
              </Button>
              <Button variant="warning" onClick={() => handleLogout()}>
                Đăng xuất
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

    </>
  );
};

interface SaveEditProfileModalProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleEdit: () => void;
}

export const SaveEditProfileModal: React.FC<SaveEditProfileModalProps> = ({ isEditing, setIsEditing, handleEdit }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    changeState();
    setShow(false)
  };
  const handleShow = () => setShow(true);

  const changeState = () => {
    setIsEditing(!isEditing);

    const inputs = document.querySelectorAll('input[type="text"]');

    inputs.forEach((input) => {
      if (!isEditing) {
        input.removeAttribute('readonly');
        input.classList.remove('input-required');
      } else {
        handleEdit();
        input.setAttribute('readonly', '');
        input.classList.add('input-required');
      }
    });
  };

  return (
    <>
      <button
        className="btn btn-xs btn-primary mb-3 mt-2"
        id="save-profile-tab"
        type="button"
        data-bs-toggle="tab"
        // href="#account-details"
        role="tab"
        aria-controls="account-details"
        aria-selected="false"
        // onClick={handleShow}
        onClick={!isEditing ? changeState : handleShow}
        style={{ backgroundColor: "black", border: "none" }}
      >
        {isEditing ? "Lưu" : "Chỉnh sửa"}
      </button>
      {show && (
        <div className='overlay' >
          <Modal
            show={show}
            centered
            onHide={handleClose}
            backdropClassName="custom-backdrop"
          >
            <Modal.Header >
              <Modal.Title>Xác nhận lưu thay đổi</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc muốn thông tin thay đổi tài khoản?</Modal.Body>
            <Modal.Footer>
              <Button variant="dark" onClick={handleClose}>
                Hủy
              </Button>
              <Button variant="warning" onClick={handleClose}>
                Lưu
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};