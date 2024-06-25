import { Component } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  FormControl,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      showModal: false,
      isEditing: false,
      currentStudentId: null,
      formData: {
        firstName: "",
        lastName: "",
        group: "",
        phone: "",
      },
      searchTerm: "",
      filterGroup: "",
      isLoading: false,
    };

    this.groups = ["Male", "Female"];
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value,
      },
    });
  };

  handleFormSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });

    const { isEditing, currentStudentId, students, formData } = this.state;

    if (isEditing) {
      this.setState({
        students: students.map((student) =>
          student.id === currentStudentId
            ? { ...formData, id: currentStudentId }
            : student
        ),
        isEditing: false,
        currentStudentId: null,
      });
      toast.success("Contact updated successfully!");
    } else {
      this.setState({
        students: [...students, { ...formData, id: uuidv4() }],
      });
      toast.success("Contact added successfully!");
    }

    this.setState({
      showModal: false,
      formData: {
        firstName: "",
        lastName: "",
        group: "",
        phone: "",
      },
      isLoading: false,
    });
  };

  openModal = () => {
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      isEditing: false,
      currentStudentId: null,
      formData: {
        firstName: "",
        lastName: "",
        group: "",
        phone: "",
      },
    });
  };

  handleEdit = (student) => {
    this.setState({
      formData: {
        firstName: student.firstName,
        lastName: student.lastName,
        group: student.group,
        phone: student.phone,
      },
      currentStudentId: student.id,
      isEditing: true,
      showModal: true,
    });
  };

  handleDelete = async (id) => {
    this.setState({ isLoading: true });

    const updatedStudents = this.state.students.filter(
      (student) => student.id !== id
    );

    this.setState({
      students: updatedStudents,
      isLoading: false,
    });

    toast.error("Contact deleted successfully!");
  };

  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleGroupFilterChange = (e) => {
    this.setState({ filterGroup: e.target.value });
  };

  render() {
    const {
      students,
      showModal,
      isEditing,
      formData,
      searchTerm,
      filterGroup,
      isLoading,
    } = this.state;

    const filteredStudents = students.filter((student) => {
      return (
        (student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.group.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterGroup === "" || student.group === filterGroup)
      );
    });

    return (
      <div className="container mt-4 all-groups">
        <ToastContainer />
        <div className="btns-search">
          <Row className="mt-3">
            <Col>
              <InputGroup>
                <FormControl
                  placeholder="Search"
                  value={searchTerm}
                  onChange={this.handleSearch}
                />
              </InputGroup>
            </Col>
            <Col>
              <Form.Select
                value={filterGroup}
                onChange={this.handleGroupFilterChange}
              >
                <option value="">All Contacts</option>
                {this.groups.map((group, index) => (
                  <option key={index} value={group}>
                    {group}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Button
            variant="primary"
            onClick={this.openModal}
            className="add mt-auto"
          >
            {isLoading ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              "+ Add Contact"
            )}
          </Button>
        </div>
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.phone}</td>
                <td>{student.group}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => this.handleEdit(student)}
                    className="edit-btn"
                  >
                    {isLoading ? (
                      <Spinner animation="border" size="sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      "Edit"
                    )}
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => this.handleDelete(student.id)}
                    className="delete-btn"
                  >
                    {isLoading ? (
                      <Spinner animation="border" size="sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditing ? "Edit Contact" : "Add Contact"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleFormSubmit}>
              <Form.Group
                className="mb-3 inputs-style"
                controlId="formFirstName"
              >
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={this.handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={this.handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={this.handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroup">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="group"
                  value={formData.group}
                  onChange={this.handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  {this.groups.map((group, index) => (
                    <option key={index} value={group}>
                      {group}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : isEditing
                  ? "Update Contact"
                  : "Add Contact"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default App;
