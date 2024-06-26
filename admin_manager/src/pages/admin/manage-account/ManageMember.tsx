import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getMembers } from '../../../api/UserAPI';
import { User } from '../../../models/User';
import { UserStateView } from './UserStateView';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useDebouncedCallback } from "use-debounce";
import { CreateNewUserModal, DeleteUserModal } from '../Modal';


const ManageUser = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [page, setPage] = useState(1)
  const [totalElements, setTotalElements] = useState(0);
  const [debouncedTxtSearch, setDebouncedTxtSearch] = useState('');
  const [txtSearch, setTxtSearch] = useState('');
  const [isRefresh, setIsRefresh] = useState(false);

  const debouncedTxtSearchChange = useDebouncedCallback(
    (txtSearch: string) => {
      setDebouncedTxtSearch(txtSearch);
    },
    1000
  );

  const handleTxtSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTxtSearch(value);
    debouncedTxtSearchChange(value);
  };

  useEffect(() => {
    getMembers("MEMBER", debouncedTxtSearch, page)
      .then((response) => {
        setMembers(response.usersData)
        setTotalElements(response.totalElements)
        setIsRefresh(false)
      })
  }, [page, debouncedTxtSearch, isRefresh])

  return (
    <>
      <section className="main_content dashboard_part">
        <div className="main_content_iner mb-0">
          <div className="container-fluid plr_30 body_white_bg pt_30">
            <div className="row justify-content-center" style={{ padding: "40px 0px 0px 350px" }}>
              <div className="col-12">
                <div className="breadcrumb-area mb-4">
                  <Link to="/admin">Trang chủ {'  /  '} </Link>
                  <Link to="/admin/danh-sach-nguoi-dung"> Danh sách người dùng  </Link>
                </div>
                <div className="QA_section">
                  <div className="white_box_tittle list_header">
                    <h4>Danh sách người dùng</h4>
                    <div className="box_right d-flex lms_block">
                      <div className="serach_field_2">
                        <div className="search_inner">
                          <form >
                            <div className="search_field">
                              <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={txtSearch}
                                onChange={handleTxtSearch}
                              />
                            </div>
                            <button type="submit">
                              <i className="ti-search"></i>
                            </button>
                          </form>
                        </div>
                      </div>
                      <div className="add_button ms-2">
                        <CreateNewUserModal />
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Tên tài khoản</th>
                          <th scope="col">Họ và tên</th>
                          <th scope="col">Email</th>
                          <th scope="col">Số điện thoại</th>
                          <th scope="col">Trạng thái</th>
                          <th scope="col">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((user) => (
                          <tr key={user.id}>
                            <td>
                              {user.id}
                            </td>
                            <td>{user.username}</td>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                              <a className={`status_btn ${user.state === 'VERIFIED'
                                ? 'bg-success'
                                : user.state === 'DISABLE'
                                  ? 'bg-error'
                                  : user.state === 'ACTIVE'
                                    ? 'bg-primary'
                                    : 'bg-warn'
                                }`}>
                                <UserStateView state={user.state || ''} />
                              </a>
                            </td>
                            <td>
                              <div className="btn-group">
                                <Link to={`/admin/chi-tiet-nguoi-dung/${user.id}`} className="btn btn-sm btn-dark">Xem</Link>
                                <DeleteUserModal user={user} setIsRefresh={setIsRefresh}/>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
              <PaginationControl
                page={page}
                between={3}
                total={totalElements}
                limit={5}
                changePage={(page) => {
                  setPage(page)
                }}
                ellipsis={1}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ManageUser;
